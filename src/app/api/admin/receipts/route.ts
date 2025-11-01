import { NextRequest, NextResponse } from 'next/server'
import { Receipt } from '@/types/receipt'

// Sample data - replace with your actual database calls
const sampleReceipts: Receipt[] = [
  {
    id: 'receipt_1',
    orderNumber: 'ORD-001234',
    type: 'manual',
    customerInfo: {
      fullName: 'John Doe',
      phone: '+251911223344',
      email: 'john@example.com',
      address: 'Addis Ababa, Ethiopia'
    },
    items: [
      {
        id: '1',
        name: 'Ethiopian Coffee Beans',
        price: 450,
        quantity: 2,
        image: '/api/placeholder/80/80'
      },
      {
        id: '2',
        name: 'Handwoven Scarf',
        price: 350,
        quantity: 1,
        image: '/api/placeholder/80/80'
      }
    ],
    totalAmount: 1250,
    paymentMethod: 'bank_transfer',
    bankDetails: {
      id: '1',
      name: 'Commercial Bank of Ethiopia',
      logo: '/api/placeholder/40/40',
      accountNumber: '1000345678901',
      accountName: 'Yafrican Store',
      branch: 'Bole Branch'
    },
    paymentProof: {
      imageUrl: '/api/placeholder/300/200',
      uploadedAt: new Date().toISOString(),
      verified: false
    },
    orderDate: new Date().toISOString(),
    status: 'pending_approval'
  },
  {
    id: 'receipt_2',
    orderNumber: 'ORD-001235',
    type: 'manual',
    customerInfo: {
      fullName: 'Jane Smith',
      phone: '+251922334455',
      email: 'jane@example.com',
      address: 'Addis Ababa, Ethiopia'
    },
    items: [
      {
        id: '3',
        name: 'Traditional Jewelry Set',
        price: 1200,
        quantity: 1,
        image: '/api/placeholder/80/80'
      }
    ],
    totalAmount: 1200,
    paymentMethod: 'telegram',
    paymentProof: {
      imageUrl: '/api/placeholder/300/200',
      uploadedAt: new Date().toISOString(),
      verified: false
    },
    orderDate: new Date().toISOString(),
    status: 'pending_approval'
  },
  {
    id: 'receipt_3',
    orderNumber: 'ORD-001236',
    type: 'telebirr',
    customerInfo: {
      fullName: 'Mike Johnson',
      phone: '+251933445566',
      email: 'mike@example.com',
      address: 'Addis Ababa, Ethiopia'
    },
    items: [
      {
        id: '4',
        name: 'Ethiopian Spices Set',
        price: 350,
        quantity: 3,
        image: '/api/placeholder/80/80'
      }
    ],
    totalAmount: 1050,
    transactionId: 'TXN-789012',
    paymentConfirmed: true,
    paymentDate: new Date().toISOString(),
    orderDate: new Date().toISOString(),
    status: 'confirmed'
  }
]

export async function GET(request: NextRequest) {
  try {
    // In a real application, you would:
    // 1. Verify admin authentication
    // 2. Fetch receipts from your database
    // 3. Filter based on query parameters
    
    // For now, return sample data
    return NextResponse.json({
      success: true,
      receipts: sampleReceipts,
      total: sampleReceipts.length,
      pending: sampleReceipts.filter(r => r.status === 'pending_approval').length
    })
    
  } catch (error) {
    console.error('Failed to fetch receipts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch receipts' },
      { status: 500 }
    )
  }
}