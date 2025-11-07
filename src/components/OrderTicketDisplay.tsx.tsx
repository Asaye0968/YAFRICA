// components/OrderTicketDisplay.tsx
'use client'

import { useState, useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { OrderTicket } from '../types/ticket'
import 'react-toastify/dist/ReactToastify.css'

interface OrderTicketDisplayProps {
  ticket: OrderTicket
  onDownload: () => void
  onProofUpload?: (ticket: OrderTicket, imageUrl: string) => void
}

export default function OrderTicketDisplay({ ticket, onDownload, onProofUpload }: OrderTicketDisplayProps) {
  const [uploadingProof, setUploadingProof] = useState(false)
  const [ticketStatus, setTicketStatus] = useState(ticket)
  const [checkingStatus, setCheckingStatus] = useState(false)

  // Check ticket status periodically
  useEffect(() => {
    const checkTicketStatus = async () => {
      if (!ticketStatus.adminVerified) {
        setCheckingStatus(true)
        try {
          const response = await fetch(`/api/orders/${ticket.orderNumber}/status`)
          if (response.ok) {
            const data = await response.json()
            if (data.adminVerified && data.adminVerified !== ticketStatus.adminVerified) {
              setTicketStatus(prev => ({ ...prev, ...data }))
              toast.success('Payment Verified! You can now download your official ticket.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              })
            }
          }
        } catch (error) {
          console.error('Error checking ticket status:', error)
        } finally {
          setCheckingStatus(false)
        }
      }
    }

    // Check immediately
    checkTicketStatus()

    // Set up interval to check every 30 seconds if not verified
    const interval = setInterval(() => {
      if (!ticketStatus.adminVerified) {
        checkTicketStatus()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [ticket.orderNumber, ticketStatus.adminVerified])

  const handleProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  // Validate file type and size
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!validTypes.includes(file.type)) {
    toast.error('Please upload a valid image file (JPEG, PNG, GIF, WebP)', {
      position: "top-right",
      autoClose: 5000,
    })
    return
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB in bytes
  if (file.size > maxSize) {
    toast.error('Image size should be less than 5MB', {
      position: "top-right",
      autoClose: 5000,
    })
    return
  }

  setUploadingProof(true)
  
  try {
    const formData = new FormData()
    formData.append('paymentProof', file)
    formData.append('orderNumber', ticket.orderNumber)
    
    console.log('🔄 Uploading payment proof for order:', ticket.orderNumber)
    
    const response = await fetch('/api/upload-payment', {
      method: 'POST',
      body: formData
    })

    const data = await response.json()
    
    if (response.ok) {
      console.log('✅ Upload successful:', data)
      
      // Create the updated ticket with the new payment proof
      const updatedTicket = {
        ...ticketStatus,
        paymentProof: {
          imageUrl: data.imageUrl,
          uploadedAt: new Date().toISOString(),
          verified: false
        }
      }
      
      // Update local state
      setTicketStatus(updatedTicket)
      
      // Call the parent callback if provided
      if (onProofUpload) {
        onProofUpload(updatedTicket, data.imageUrl)
      }
      
      toast.success('Payment proof uploaded successfully! Admin will verify your payment.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      
      // Also update the order in the database with the payment proof
      await updateOrderWithPaymentProof(data.imageUrl)
      
    } else {
      console.error('❌ Upload failed:', data)
      toast.error(data.error || 'Failed to upload payment proof. Please try again.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
  } catch (error) {
    console.error('❌ Upload error:', error)
    toast.error('Network error uploading payment proof. Please check your connection.', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  } finally {
    setUploadingProof(false)
    // Reset the file input
    e.target.value = ''
  }
}

// Add this helper function to update the order in database
const updateOrderWithPaymentProof = async (imageUrl: string) => {
  try {
    const response = await fetch(`/api/orders/${ticket.orderNumber}/payment-proof`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageUrl,
        uploadedAt: new Date().toISOString()
      }),
    })

    if (!response.ok) {
      console.error('Failed to update order with payment proof')
    }
  } catch (error) {
    console.error('Error updating order:', error)
  }
}

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ET', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusMessage = () => {
    if (!ticketStatus.paymentProof) {
      return {
        message: 'Awaiting Payment Proof Upload',
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        badgeColor: 'bg-amber-500'
      }
    }
    
    if (ticketStatus.paymentProof && !ticketStatus.adminVerified) {
      return {
        message: 'Under Verification - Admin Review in Progress',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        badgeColor: 'bg-blue-500'
      }
    }
    
    if (ticketStatus.adminVerified) {
      return {
        message: 'Payment Verified - Ticket Ready for Download',
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        badgeColor: 'bg-emerald-500'
      }
    }
    
    return {
      message: 'Processing Your Order',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      badgeColor: 'bg-gray-500'
    }
  }

  const statusInfo = getStatusMessage()

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        {/* Professional Header */}
        <div className="bg-linear-to-r from-gray-900 to-gray-800 p-8 text-white">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">YAFRICAN STORE</h1>
              <p className="text-gray-300 mt-2">Official Order Confirmation</p>
            </div>
            <div className="text-right">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                <p className="text-sm text-gray-300">Order Reference</p>
                <p className="text-xl font-mono font-bold tracking-wider">{ticketStatus.orderNumber}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-gray-400">Issue Date</p>
              <p className="font-semibold">{formatDate(ticketStatus.timestamp)}</p>
            </div>
            <div>
              <p className="text-gray-400">Total Amount</p>
              <p className="text-2xl font-bold text-emerald-400">{ticketStatus.totalAmount.toFixed(2)} Br</p>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="border-b border-gray-200">
          <div className={`px-8 py-4 ${statusInfo.bgColor} ${statusInfo.borderColor}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${statusInfo.badgeColor}`}></div>
                <span className={`font-semibold ${statusInfo.color}`}>{statusInfo.message}</span>
              </div>
              {checkingStatus && (
                <div className="text-sm text-blue-600">Checking status...</div>
              )}
            </div>
            {!ticketStatus.adminVerified && ticketStatus.paymentProof && (
              <p className="text-sm text-blue-600 mt-2 ml-6">
                Verification typically completed within 24 hours
              </p>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8 space-y-8">
          {/* Customer & Order Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Customer Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">CUSTOMER INFORMATION</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-semibold text-gray-900">{ticketStatus.customerInfo.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contact Number</p>
                    <p className="font-semibold text-gray-900">{ticketStatus.customerInfo.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email Address</p>
                    <p className="font-semibold text-gray-900">{ticketStatus.customerInfo.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Delivery Address</p>
                    <p className="font-semibold text-gray-900 leading-relaxed">{ticketStatus.customerInfo.address}</p>
                  </div>
                </div>
              </div>

              {/* Payment Instructions */}
              {ticketStatus.bankDetails && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-900 mb-3">PAYMENT INSTRUCTIONS</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-amber-700">Bank:</span>
                      <span className="font-semibold text-amber-900">{ticketStatus.bankDetails.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-700">Account Name:</span>
                      <span className="font-semibold text-amber-900">{ticketStatus.bankDetails.accountName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-700">Account Number:</span>
                      <span className="font-mono font-bold text-amber-900">{ticketStatus.bankDetails.accountNumber}</span>
                    </div>
                    {ticketStatus.bankDetails.branch && (
                      <div className="flex justify-between">
                        <span className="text-amber-700">Branch:</span>
                        <span className="font-semibold text-amber-900">{ticketStatus.bankDetails.branch}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 p-3 bg-amber-100 rounded border border-amber-300">
                    <p className="text-amber-800 text-sm font-medium text-center">
                      Transfer exactly {ticketStatus.totalAmount.toFixed(2)} Br
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">ORDER SUMMARY</h3>
              <div className="space-y-4">
                {ticketStatus.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover border border-gray-300"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-sm text-gray-600">Unit Price: {item.price.toFixed(2)} Br</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900">
                        {(item.price * item.quantity).toFixed(2)} Br
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Total Amount */}
              <div className="mt-6 p-4 bg-gray-900 rounded-lg text-white">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Amount</span>
                  <span className="text-2xl font-bold text-emerald-400">
                    {ticketStatus.totalAmount.toFixed(2)} Br
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className="border-t border-gray-200 pt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Download Ticket */}
              <div className="text-center">
                <button
                  onClick={onDownload}
                  disabled={!ticketStatus.adminVerified}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
                    ticketStatus.adminVerified
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {ticketStatus.adminVerified ? (
                    'DOWNLOAD OFFICIAL TICKET'
                  ) : (
                    'TICKET AVAILABLE AFTER VERIFICATION'
                  )}
                </button>
                <p className="text-sm text-gray-600 mt-2">
                  {ticketStatus.adminVerified 
                    ? 'Download your verified order ticket' 
                    : 'Download will be enabled after payment verification'
                  }
                </p>
              </div>

              {/* Upload Proof */}
              <div className="text-center">
                <label className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 cursor-pointer block ${
                  !ticketStatus.paymentProof && !uploadingProof
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProofUpload}
                    className="hidden"
                    disabled={!!ticketStatus.paymentProof || uploadingProof}
                  />
                  {uploadingProof ? (
                    'UPLOADING PAYMENT PROOF...'
                  ) : ticketStatus.paymentProof ? (
                    'PAYMENT PROOF SUBMITTED'
                  ) : (
                    'UPLOAD PAYMENT PROOF'
                  )}
                </label>
                <p className="text-sm text-gray-600 mt-2">
                  {!ticketStatus.paymentProof 
                    ? 'Upload screenshot of bank transfer confirmation' 
                    : 'Proof submitted - awaiting verification'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Uploaded Proof Preview */}
          {ticketStatus.paymentProof && (
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4">PAYMENT PROOF SUBMITTED</h4>
              <div className="flex items-center gap-6">
                <img
                  src={ticketStatus.paymentProof.imageUrl}
                  alt="Payment proof"
                  className="w-24 h-24 object-cover rounded-lg border-2 border-gray-300 cursor-pointer shadow-sm"
                  onClick={() => window.open(ticketStatus.paymentProof!.imageUrl, '_blank')}
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">
                    Submitted on {formatDate(ticketStatus.paymentProof.uploadedAt)}
                  </p>
                  <p className={`text-sm font-semibold mt-1 ${
                    ticketStatus.adminVerified ? 'text-emerald-600' : 'text-blue-600'
                  }`}>
                    {ticketStatus.adminVerified 
                      ? 'Status: Verified by Administration' 
                      : 'Status: Awaiting Verification'
                    }
                  </p>
                  {ticketStatus.adminVerified && ticketStatus.paymentProof.verifiedAt && (
                    <p className="text-sm text-gray-600 mt-1">
                      Verified on {formatDate(ticketStatus.paymentProof.verifiedAt)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Process Timeline */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-6">ORDER PROCESS TIMELINE</h4>
            <div className="space-y-4">
              <div className={`flex items-center gap-4 ${ticketStatus.paymentProof ? 'text-emerald-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                  ticketStatus.paymentProof ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  1
                </div>
                <div className="flex-1">
                  <p className="font-medium">Payment Transfer</p>
                  <p className="text-sm text-gray-600">Transfer amount to provided bank account</p>
                </div>
              </div>
              
              <div className={`flex items-center gap-4 ${ticketStatus.paymentProof ? 'text-emerald-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                  ticketStatus.paymentProof ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  2
                </div>
                <div className="flex-1">
                  <p className="font-medium">Proof Submission</p>
                  <p className="text-sm text-gray-600">Upload transfer confirmation screenshot</p>
                </div>
              </div>
              
              <div className={`flex items-center gap-4 ${ticketStatus.adminVerified ? 'text-emerald-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                  ticketStatus.adminVerified ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  3
                </div>
                <div className="flex-1">
                  <p className="font-medium">Admin Verification</p>
                  <p className="text-sm text-gray-600">Payment confirmation and validation</p>
                </div>
              </div>
              
              <div className={`flex items-center gap-4 ${ticketStatus.adminVerified ? 'text-emerald-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                  ticketStatus.adminVerified ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  4
                </div>
                <div className="flex-1">
                  <p className="font-medium">Ticket Generation</p>
                  <p className="text-sm text-gray-600">Download official order confirmation</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-gray-400">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 bg-white border-gray-300">
                  5
                </div>
                <div className="flex-1">
                  <p className="font-medium">Order Fulfillment</p>
                  <p className="text-sm text-gray-600">Delivery coordination and tracking</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600">
              For assistance, contact our support team • Thank you for choosing Yafrican Store
            </p>
          </div>
        </div>
      </div>
    </>
  )
}