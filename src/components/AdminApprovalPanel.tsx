// components/AdminApprovalPanel.tsx
'use client'

import { useState, useEffect } from 'react'
import { Receipt, ManualPaymentReceipt } from '../types/receipt'

interface AdminApprovalPanelProps {
  receipts: Receipt[]
  onReceiptUpdate: (receipts: Receipt[]) => void
}

export default function AdminApprovalPanel({ receipts, onReceiptUpdate }: AdminApprovalPanelProps) {
  const [pendingApprovals, setPendingApprovals] = useState<ManualPaymentReceipt[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const pending = receipts.filter(
      (receipt): receipt is ManualPaymentReceipt =>
        receipt.type === 'manual' && 
        receipt.status === 'pending_approval'
    )
    setPendingApprovals(pending)
  }, [receipts])

  const approvePayment = async (receipt: ManualPaymentReceipt) => {
    try {
      setLoading(true)
      
      const response = await fetch(`/api/admin/payments/${receipt.id}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          approvedBy: 'Admin User' // You can get this from your auth context
        })
      })

      if (response.ok) {
        const updatedReceipt = await response.json()
        
        // Update the receipt in the parent state
        const updatedReceipts = receipts.map(r => 
          r.id === receipt.id ? updatedReceipt : r
        )
        onReceiptUpdate(updatedReceipts)
        
        alert(`Payment for Order ${receipt.orderNumber} approved successfully!`)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to approve payment')
      }
    } catch (error) {
      console.error('Failed to approve payment:', error)
      alert('Failed to approve payment')
    } finally {
      setLoading(false)
    }
  }

  const rejectPayment = async (receipt: ManualPaymentReceipt, reason: string) => {
    try {
      setLoading(true)
      
      const response = await fetch(`/api/admin/payments/${receipt.id}/reject`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rejectedBy: 'Admin User', // You can get this from your auth context
          reason: reason
        })
      })

      if (response.ok) {
        const updatedReceipt = await response.json()
        
        // Update the receipt in the parent state
        const updatedReceipts = receipts.map(r => 
          r.id === receipt.id ? updatedReceipt : r
        )
        onReceiptUpdate(updatedReceipts)
        
        alert(`Payment for Order ${receipt.orderNumber} rejected.`)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to reject payment')
      }
    } catch (error) {
      console.error('Failed to reject payment:', error)
      alert('Failed to reject payment')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending_payment: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending Payment' },
      pending_approval: { color: 'bg-orange-100 text-orange-800', label: 'Pending Approval' },
      confirmed: { color: 'bg-green-100 text-green-800', label: 'Confirmed' },
      completed: { color: 'bg-blue-100 text-blue-800', label: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
      rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending_payment
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="text-center py-8">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Processing payment...</p>
        </div>
      </div>
    )
  }

  if (pendingApprovals.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Payment Approval</h2>
          <p className="text-gray-600 text-sm">Review and approve pending payment transactions</p>
        </div>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Approvals</h3>
          <p className="text-gray-500">All payment transactions have been processed.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Payment Approval</h2>
            <p className="text-gray-600 text-sm">Review and approve pending payment transactions</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
              {pendingApprovals.length} Pending
            </span>
          </div>
        </div>
      </div>

      {/* Payment List */}
      <div className="p-6">
        <div className="space-y-6">
          {pendingApprovals.map((receipt) => (
            <div key={receipt.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Order & Customer Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 text-lg">Order #{receipt.orderNumber}</h3>
                          {getStatusBadge(receipt.status)}
                        </div>
                        <p className="text-gray-900 font-medium">{receipt.customerInfo.fullName}</p>
                        <p className="text-gray-600">{receipt.customerInfo.phone}</p>
                        <p className="text-gray-500 text-sm">{receipt.customerInfo.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{receipt.totalAmount.toFixed(2)} Br</p>
                      <p className="text-sm text-gray-500 capitalize">
                        {receipt.paymentMethod.replace('_', ' ')}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Order Items:</h4>
                    <div className="space-y-2">
                      {receipt.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 text-sm">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-10 h-10 rounded object-cover"
                            onError={(e) => {
                              // Fallback if image fails to load
                              (e.target as HTMLImageElement).src = '/images/placeholder-product.jpg'
                            }}
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-semibold text-gray-900">{item.price.toFixed(2)} Br</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bank Details (if available) */}
                  {receipt.bankDetails && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <h4 className="font-medium text-gray-900 mb-2">Bank Transfer Details:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Bank:</span>
                          <p className="font-medium">{receipt.bankDetails.name}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Account:</span>
                          <p className="font-medium">{receipt.bankDetails.accountNumber}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Account Name:</span>
                          <p className="font-medium">{receipt.bankDetails.accountName}</p>
                        </div>
                        {receipt.bankDetails.branch && (
                          <div>
                            <span className="text-gray-500">Branch:</span>
                            <p className="font-medium">{receipt.bankDetails.branch}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Proof & Actions */}
                <div className="flex flex-col gap-4 lg:w-80">
                  {receipt.paymentProof && (
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700 mb-2">Payment Proof</p>
                      <img
                        src={receipt.paymentProof.imageUrl}
                        alt="Payment proof"
                        className="w-full max-w-48 h-48 object-contain border rounded-lg cursor-pointer hover:shadow-md transition-shadow mx-auto"
                        onClick={() => window.open(receipt.paymentProof!.imageUrl, '_blank')}
                        onError={(e) => {
                          // Fallback if payment proof image fails to load
                          (e.target as HTMLImageElement).src = '/images/placeholder-payment.jpg'
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Uploaded: {new Date(receipt.paymentProof.uploadedAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">Click image to view full size</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => approvePayment(receipt)}
                      disabled={loading}
                      className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt('Please provide a reason for rejection:')
                        if (reason && reason.trim()) {
                          rejectPayment(receipt, reason.trim())
                        }
                      }}
                      disabled={loading}
                      className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}