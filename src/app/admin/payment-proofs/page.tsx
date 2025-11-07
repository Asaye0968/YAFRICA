// src/app/admin/payment-proofs/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { CreditCard, Eye, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface PaymentProof {
  _id: string
  orderNumber: string
  customerInfo: {
    fullName?: string
    phone?: string
    email?: string
    address?: string
  }
  totalAmount: number
  paymentMethod: string
  bankDetails?: {
    name?: string
    accountNumber?: string
    accountName?: string
  }
  paymentProof: {
    imageUrl: string
    uploadedAt: string
    verified: boolean
    verifiedBy?: string
    verifiedAt?: string
  }
  status: string
  createdAt: string
}

export default function PaymentProofsAdminPage() {
  const [paymentProofs, setPaymentProofs] = useState<PaymentProof[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProof, setSelectedProof] = useState<PaymentProof | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [verifyingId, setVerifyingId] = useState<string | null>(null) // Track which one is verifying
  const [rejectingId, setRejectingId] = useState<string | null>(null) // Track which one is rejecting
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('pending')
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({})

  const handleImageError = (proofId: string) => {
    console.log(`Image failed to load for proof: ${proofId}`)
    setImageErrors(prev => ({...prev, [proofId]: true}))
  }

  useEffect(() => {
    fetchPaymentProofs()
  }, [filter])

  const fetchPaymentProofs = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/payment-proofs?filter=${filter}`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        console.log('📋 Fetched payment proofs:', data.paymentProofs)
        setPaymentProofs(data.paymentProofs || [])
      } else {
        console.error('❌ Failed to fetch payment proofs')
        toast.error('Failed to fetch payment proofs')
        setPaymentProofs([])
      }
    } catch (error) {
      console.error('❌ Error fetching payment proofs:', error)
      toast.error('Error fetching payment proofs')
      setPaymentProofs([])
    } finally {
      setLoading(false)
    }
  }
// In your admin component, add this debug effect
useEffect(() => {
  if (paymentProofs.length > 0) {
    paymentProofs.forEach(proof => {
      console.log('🔍 Payment Proof Image Debug:', {
        orderNumber: proof.orderNumber,
        imageUrl: proof.paymentProof?.imageUrl,
        fullPath: proof.paymentProof?.imageUrl
      })
    })
  }
}, [paymentProofs])
  // ✅ FIXED: Properly handle verification with individual loading states
  const handleVerifyPayment = async (proof: PaymentProof) => {
    try {
      setVerifyingId(proof._id) // Set which specific one is being verified
      
      console.log('🔄 Verifying payment:', {
        orderId: proof._id,
        orderNumber: proof.orderNumber
      })

      const response = await fetch(`/api/admin/orders/${proof._id}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          status: 'confirmed',
          adminNotes: 'Payment verified successfully'
        })
      })

      if (response.ok) {
        // ✅ FIXED: Update only the specific payment proof
        setPaymentProofs(prevProofs => 
          prevProofs.map(p => 
            p._id === proof._id 
              ? {
                  ...p,
                  status: 'confirmed',
                  paymentProof: {
                    ...p.paymentProof,
                    verified: true,
                    verifiedAt: new Date().toISOString(),
                    verifiedBy: 'Admin'
                  }
                }
              : p
          )
        )
        
        toast.success(`Payment for order ${proof.orderNumber} verified successfully!`)
        setShowModal(false)
        
        console.log('✅ Verified successfully:', proof.orderNumber)
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to verify payment')
        console.error('❌ Verification failed:', errorData)
      }
    } catch (error) {
      console.error('❌ Error verifying payment:', error)
      toast.error('Error verifying payment')
    } finally {
      setVerifyingId(null) // Reset loading state
    }
  }

  // ✅ FIXED: Properly handle rejection with individual loading states
  const handleRejectPayment = async (proof: PaymentProof, reason: string) => {
    try {
      setRejectingId(proof._id) // Set which specific one is being rejected
      
      console.log('🔄 Rejecting payment:', {
        orderId: proof._id,
        orderNumber: proof.orderNumber,
        reason
      })

      const response = await fetch(`/api/admin/orders/${proof._id}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          status: 'cancelled',
          adminNotes: reason
        })
      })

      if (response.ok) {
        // ✅ FIXED: Update only the specific payment proof
        setPaymentProofs(prevProofs => 
          prevProofs.map(p => 
            p._id === proof._id 
              ? {
                  ...p,
                  status: 'cancelled',
                  paymentProof: {
                    ...p.paymentProof,
                    verified: false
                  }
                }
              : p
          )
        )
        
        toast.success(`Payment for order ${proof.orderNumber} rejected successfully!`)
        setShowModal(false)
        
        console.log('✅ Rejected successfully:', proof.orderNumber)
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to reject payment')
        console.error('❌ Rejection failed:', errorData)
      }
    } catch (error) {
      console.error('❌ Error rejecting payment:', error)
      toast.error('Error rejecting payment')
    } finally {
      setRejectingId(null) // Reset loading state
    }
  }

  // Debugging
  useEffect(() => {
    if (paymentProofs.length > 0) {
      console.log('🔍 Current Payment Proofs State:', paymentProofs.map(p => ({
        _id: p._id,
        orderNumber: p.orderNumber,
        status: p.status,
        verified: p.paymentProof.verified
      })))
    }
  }, [paymentProofs])

  const openProofModal = (proof: PaymentProof) => {
    setSelectedProof(proof)
    setShowModal(true)
  }

  const getStatusBadge = (status: string, verified: boolean) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium"
    
    if (verified) {
      return <span className={`${baseClasses} bg-green-100 text-green-800 border border-green-200`}>
        <CheckCircle className="w-3 h-3 inline mr-1" />
        Verified
      </span>
    }
    
    switch (status) {
      case 'pending':
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-200`}>
          <AlertCircle className="w-3 h-3 inline mr-1" />
          Pending Review
        </span>
      case 'confirmed':
        return <span className={`${baseClasses} bg-green-100 text-green-800 border border-green-200`}>
          <CheckCircle className="w-3 h-3 inline mr-1" />
          Confirmed
        </span>
      case 'cancelled':
        return <span className={`${baseClasses} bg-red-100 text-red-800 border border-red-200`}>
          <XCircle className="w-3 h-3 inline mr-1" />
          Rejected
        </span>
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`}>
          {status}
        </span>
    }
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString || dateString === 'Invalid Date') return 'Invalid Date'
    
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'Invalid Date'
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return 'Invalid Date'
    }
  }

 // Replace your getImageUrl function with this:
const getImageUrl = (proof: PaymentProof) => {
  if (imageErrors[proof._id]) {
    console.log(`❌ Image error for ${proof._id}, using placeholder`);
    return `/api/placeholder/400/200?text=Image+Not+Found`;
  }
  
  const originalUrl = proof.paymentProof?.imageUrl;
  console.log(`🖼️ Original URL for ${proof.orderNumber}:`, originalUrl);

  if (!originalUrl) {
    console.log(`❌ No URL for ${proof.orderNumber}`);
    return `/api/placeholder/400/200?text=No+Image+Uploaded`;
  }

  // Handle different URL types
  if (originalUrl.startsWith('http')) {
    return originalUrl;
  }

  if (originalUrl.startsWith('data:')) {
    return originalUrl;
  }

  // Extract filename from path - handle Windows paths
  let filename = originalUrl;
  
  // Handle Windows paths (C:\\Users\\...)
  if (originalUrl.includes('\\')) {
    const parts = originalUrl.split('\\');
    filename = parts[parts.length - 1];
    console.log(`📁 Extracted filename from Windows path:`, filename);
  }
  
  // Handle Unix paths
  if (originalUrl.includes('/')) {
    const parts = originalUrl.split('/');
    filename = parts[parts.length - 1];
    console.log(`📁 Extracted filename from Unix path:`, filename);
  }

  // Construct the public URL
  const publicUrl = `/uploads/payment-proofs/${filename}`;
  console.log(`🔗 Public URL for ${proof.orderNumber}:`, publicUrl);
  
  return publicUrl;
};
// Temporary debug component - add this to your admin page
// Add this debug component to your admin page
const ImageDebugger = () => {
  if (paymentProofs.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-md z-50">
      <h4 className="font-bold mb-2">🖼️ Image Debug Info:</h4>
      {paymentProofs.slice(0, 3).map(proof => {
        const imageUrl = getImageUrl(proof);
        return (
          <div key={proof._id} className="mb-2 border-b border-gray-600 pb-2">
            <div><strong>Order:</strong> {proof.orderNumber}</div>
            <div><strong>Stored URL:</strong> {proof.paymentProof?.imageUrl || 'No URL'}</div>
            <div><strong>Final URL:</strong> {imageUrl}</div>
            <div><strong>Status:</strong> {imageErrors[proof._id] ? '❌ Error' : '✅ Loading'}</div>
            <div className="mt-1">
              <button 
                onClick={() => {
                  console.log('🖼️ Image details:', {
                    proof,
                    imageUrl,
                    fullPath: `C:\\Users\\hp\\Desktop\\nextjs pro\\yafrican\\public\\uploads\\payment-proofs\\${proof.orderNumber}*.png`
                  });
                  window.open(imageUrl, '_blank');
                }}
                className="bg-blue-500 px-2 py-1 rounded text-xs"
              >
                Test Image
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Then add <ImageDebugger /> to your JSX (temporarily)

  // Safe data accessors
  const getCustomerName = (proof: PaymentProof) => proof.customerInfo?.fullName || 'Unknown Customer'
  const getCustomerEmail = (proof: PaymentProof) => proof.customerInfo?.email || 'No email provided'
  const getCustomerPhone = (proof: PaymentProof) => proof.customerInfo?.phone || 'No phone provided'
  const getCustomerAddress = (proof: PaymentProof) => proof.customerInfo?.address || 'No address provided'

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
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

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Proofs Management</h1>
          <p className="text-gray-600">Review and verify customer payment proofs</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm border">
            {[
              { 
                key: 'pending', 
                label: 'Pending Review', 
                count: paymentProofs.filter(p => !p.paymentProof.verified && p.status === 'pending').length 
              },
              { 
                key: 'verified', 
                label: 'Verified', 
                count: paymentProofs.filter(p => p.paymentProof.verified).length 
              },
              { 
                key: 'rejected', 
                label: 'Rejected', 
                count: paymentProofs.filter(p => p.status === 'cancelled').length 
              },
              { 
                key: 'all', 
                label: 'All Proofs', 
                count: paymentProofs.length 
              }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  filter === tab.key
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Payment Proofs Grid */}
        {paymentProofs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Payment Proofs Found</h3>
            <p className="text-gray-600">
              {filter === 'pending' 
                ? 'All pending payment proofs have been processed.' 
                : 'No payment proofs match the current filter.'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {paymentProofs.map((proof) => (
              <div key={proof._id} className="bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{proof.orderNumber}</h3>
                    {getStatusBadge(proof.status, proof.paymentProof.verified)}
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {proof.totalAmount ? `${proof.totalAmount.toFixed(2)} Br` : 'N/A'}
                  </p>
                </div>

                {/* Customer Info */}
                <div className="p-4 border-b border-gray-200">
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-600">Customer</p>
                      <p className="font-medium text-gray-900">
                        {getCustomerName(proof)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900 truncate">
                        {getCustomerEmail(proof)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium text-gray-900">
                        {getCustomerPhone(proof)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Proof Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">Uploaded</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatDate(proof.paymentProof.uploadedAt)}
                    </span>
                  </div>

                  {/* Proof Image Preview */}
                {/* Proof Image Preview - REPLACE THIS SECTION */}
<div className="mb-4">
  <div className="relative aspect-video bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
    <img
      src={getImageUrl(proof)}
      alt={`Payment proof for order ${proof.orderNumber}`}
      className="w-full h-full object-contain bg-white"
      onError={() => handleImageError(proof._id)}
      onClick={() => openProofModal(proof)}
    />
    <div className="absolute inset-0 flex items-center justify-center bg-transparent hover:bg-black hover:bg-opacity-10 transition-all duration-200 cursor-pointer">
      <Eye className="w-8 h-8 text-white opacity-0 hover:opacity-100 transition-opacity" />
    </div>
  </div>
  {imageErrors[proof._id] && (
    <p className="text-xs text-red-500 mt-1 text-center">
      Image failed to load
    </p>
  )}
</div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openProofModal(proof)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    {!proof.paymentProof.verified && proof.status === 'pending' && (
                      <button
                        onClick={() => handleVerifyPayment(proof)}
                        disabled={verifyingId === proof._id}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        {verifyingId === proof._id ? 'Verifying...' : 'Verify'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Payment Proof Modal */}
        {showModal && selectedProof && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Payment Proof Details</h2>
                    <p className="text-gray-600">Order #{selectedProof.orderNumber}</p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Proof Image */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Proof</h3>
                    <div className="bg-gray-100 rounded-lg border border-gray-300 overflow-hidden">
                      <img
                        src={getImageUrl(selectedProof)}
                        alt="Payment proof"
                        className="w-full h-auto max-h-96 object-contain"
                        onError={() => handleImageError(selectedProof._id)}
                      />
                    </div>
                    <div className="mt-4 text-sm text-gray-600 space-y-1">
                      <p><strong>Uploaded:</strong> {formatDate(selectedProof.paymentProof.uploadedAt)}</p>
                      {selectedProof.paymentProof.verified && selectedProof.paymentProof.verifiedAt && (
                        <p><strong>Verified:</strong> {formatDate(selectedProof.paymentProof.verifiedAt)}</p>
                      )}
                      {selectedProof.paymentProof.verifiedBy && (
                        <p><strong>Verified by:</strong> {selectedProof.paymentProof.verifiedBy}</p>
                      )}
                    </div>
                  </div>

                  {/* Right Column - Order Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h3>
                    
                    {/* Customer Details */}
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-3">Customer Details</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Full Name:</span>
                          <span className="font-medium text-right">{getCustomerName(selectedProof)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phone:</span>
                          <span className="font-medium">{getCustomerPhone(selectedProof)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium truncate max-w-[200px]">{getCustomerEmail(selectedProof)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Address:</span>
                          <p className="font-medium mt-1 text-sm">{getCustomerAddress(selectedProof)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-3">Payment Details</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Amount:</span>
                          <span className="font-bold text-green-600">{selectedProof.totalAmount.toFixed(2)} Br</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Method:</span>
                          <span className="font-medium capitalize">{selectedProof.paymentMethod.replace('_', ' ')}</span>
                        </div>
                        {selectedProof.bankDetails && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Bank:</span>
                              <span className="font-medium">{selectedProof.bankDetails.name || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Account:</span>
                              <span className="font-medium">{selectedProof.bankDetails.accountNumber || 'N/A'}</span>
                            </div>
                            {selectedProof.bankDetails.accountName && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Account Name:</span>
                                <span className="font-medium">{selectedProof.bankDetails.accountName}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Verification Status */}
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-3">Verification Status</h4>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(selectedProof.status, selectedProof.paymentProof.verified)}
                        {selectedProof.paymentProof.verified && (
                          <span className="text-sm text-green-600">✓ Payment Verified</span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {!selectedProof.paymentProof.verified && selectedProof.status === 'pending' && (
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleVerifyPayment(selectedProof)}
                          disabled={verifyingId === selectedProof._id}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-5 h-5" />
                          {verifyingId === selectedProof._id ? 'Verifying...' : 'Verify Payment'}
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt('Please provide a reason for rejection:')
                            if (reason) {
                              handleRejectPayment(selectedProof, reason)
                            }
                          }}
                          disabled={rejectingId === selectedProof._id}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-md font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-5 h-5" />
                          {rejectingId === selectedProof._id ? 'Rejecting...' : 'Reject'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}