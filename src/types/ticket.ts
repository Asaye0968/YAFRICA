// types/ticket.ts
export interface CustomerInfo {
  fullName: string
  phone: string
  email: string
  address: string
}

export interface TicketItem {
  id: string
  name: string
  quantity: number
  price: number
  image: string
}

export interface BankDetails {
  name: string
  accountNumber: string
  accountName: string
  branch?: string
}

export interface PaymentProof {
  imageUrl: string
  uploadedAt: string
  verified?: boolean
  verifiedBy?: string
  verifiedAt?: string
}

export interface OrderTicket {
  id: string
  _id?: string // MongoDB compatibility
  orderNumber: string
  customerInfo: CustomerInfo
  items: TicketItem[]
  totalAmount: number
  paymentMethod: string
  bankDetails?: BankDetails
  timestamp: string
  createdAt?: string // Add this for created date
  updatedAt?: string // Add this for updated date
  status: string
  paymentProof?: PaymentProof
  adminVerified?: boolean
  adminVerifiedAt?: string
  adminNotes?: string // Add this for admin notes
}