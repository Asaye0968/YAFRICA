// // components/Checkout.tsx
// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { useCart } from '../app/contexts/CartContext'
// import { DocumentDuplicateIcon, CheckIcon, UserIcon } from '@heroicons/react/24/outline'
// import { TicketGenerator } from '../utils/ticketGenerator'
// import OrderTicketDisplay from './OrderTicketDisplay.tsx'
// import { OrderTicket, CustomerInfo } from '../types/ticket'
// import { FaTicketAlt } from 'react-icons/fa'
// interface BankDetails {
//   id: string
//   name: string
//   logo: string
//   accountNumber: string
//   accountName: string
//   branch?: string
// }

// interface User {
//   id: string
//   name: string
//   email: string
//   phone?: string
// }

// const ethiopianBanks: BankDetails[] = [
//   {
//     id: 'commercial',
//     name: 'Commercial Bank of Ethiopia',
//     logo: '/banks/cbe.png',
//     accountNumber: '10003456789',
//     accountName: 'Yafrican Online Store',
//     branch: 'Main Branch'
//   },
//   {
//     id: 'abyssinia',
//     name: 'Abyssinia Bank',
//     logo: '/banks/abyssinia.png',
//     accountNumber: '10004567890',
//     accountName: 'Yafrican Online Store',
//     branch: 'Head Office'
//   },
//   {
//     id: 'zemen',
//     name: 'Zemen Bank',
//     logo: '/banks/zemen.png',
//     accountNumber: '10005678901',
//     accountName: 'Yafrican Online Store',
//     branch: 'Main Branch'
//   },
//   {
//     id: 'abay',
//     name: 'Abay Bank',
//     logo: '/banks/abay.png',
//     accountNumber: '10006789012',
//     accountName: 'Yafrican Online Store',
//     branch: 'Head Office'
//   },
//   {
//     id: 'telebirr',
//     name: 'Telebirr',
//     logo: '/banks/Telebirr.png',
//     accountNumber: '251912345678',
//     accountName: 'Yafrican Store',
//     branch: ''
//   },
//   {
//     id: 'awash',
//     name: 'Awash Bank',
//     logo: '/banks/awash.png',
//     accountNumber: '10007890123',
//     accountName: 'Yafrican Online Store',
//     branch: 'Main Branch'
//   }
// ]

// export default function Checkout() {
//   const router = useRouter()
//   const { cartItems, totalPrice, clearCart } = useCart()
//   const [selectedBank, setSelectedBank] = useState<string>('')
//   const [copiedAccount, setCopiedAccount] = useState<string>('')
//   const [user, setUser] = useState<User | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [customerInfo, setCustomerInfo] = useState({
//     fullName: '',
//     phone: '',
//     email: '',
//     address: ''
//   })
//   const [generatedTicket, setGeneratedTicket] = useState<OrderTicket | null>(null)
//   const [showTicket, setShowTicket] = useState(false)
//   const [orderLoading, setOrderLoading] = useState(false)

//   const ticketGenerator = new TicketGenerator()

//   // Check authentication and get user data on component mount
//   useEffect(() => {
//     checkAuthentication()
//   }, [])

//   const checkAuthentication = async () => {
//     try {
//       setLoading(true)
//       const response = await fetch('/api/auth/check', {
//         credentials: 'include'
//       })
      
//       const data = await response.json()
      
//       if (response.ok && data.loggedIn && data.user) {
//         // User is authenticated
//         setUser(data.user)
        
//         // Pre-fill user data
//         setCustomerInfo(prev => ({
//           ...prev,
//           fullName: data.user.name || '',
//           email: data.user.email || '',
//           phone: data.user.phone || ''
//         }))
//       } else {
//         // User not authenticated, redirect to signin
//         console.log('User not authenticated, redirecting to signin')
//         window.location.href = `/signin?returnUrl=${encodeURIComponent(window.location.pathname)}`
//         return
//       }
//     } catch (error) {
//       console.error('Auth check failed:', error)
//       window.location.href = `/signin?returnUrl=${encodeURIComponent(window.location.pathname)}`
//       return
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleCopyAccount = (accountNumber: string) => {
//     navigator.clipboard.writeText(accountNumber)
//     setCopiedAccount(accountNumber)
//     setTimeout(() => setCopiedAccount(''), 2000)
//   }

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setCustomerInfo(prev => ({
//       ...prev,
//       [name]: value
//     }))
//   }

//   const handleProofUpload = (ticket: OrderTicket, imageUrl: string) => {
//     const updatedTicket = ticketGenerator.addPaymentProof(ticket, imageUrl)
//     setGeneratedTicket(updatedTicket)
//     saveTicketToStorage(updatedTicket)
//   }

//   const saveTicketToStorage = (ticket: OrderTicket) => {
//     const existingTickets = JSON.parse(localStorage.getItem('yafrican_tickets') || '[]')
//     const updatedTickets = [...existingTickets, ticket]
//     localStorage.setItem('yafrican_tickets', JSON.stringify(updatedTickets))
//   }

//   const handlePlaceOrder = async () => {
//     if (!selectedBank) {
//       alert('Please select a payment method')
//       return
//     }

//     if (!customerInfo.fullName || !customerInfo.phone || !customerInfo.address) {
//       alert('Please fill in all required customer information')
//       return
//     }

//     try {
//       setOrderLoading(true)

//       // Generate order ticket
//       const selectedBankDetails = ethiopianBanks.find(bank => bank.id === selectedBank)
//       const ticket = ticketGenerator.generateOrderTicket(
//         customerInfo,
//         cartItems.map(item => ({
//           id: item.id,
//           name: item.name,
//           quantity: item.quantity,
//           price: item.price,
//           image: item.image
//         })),
//         totalPrice,
//         selectedBank,
//         selectedBankDetails
//       )

//       // Save order to database
//       const response = await fetch('/api/orders', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           ticket,
//           customerInfo,
//           cartItems,
//           totalPrice,
//           paymentMethod: selectedBank,
//           bankDetails: selectedBankDetails
//         }),
//         credentials: 'include'
//       })

//       if (response.ok) {
//         setGeneratedTicket(ticket)
//         setShowTicket(true)
//         saveTicketToStorage(ticket)
//         clearCart()
//       } else {
//         alert('Failed to create order. Please try again.')
//       }
//     } catch (error) {
//       console.error('Order creation error:', error)
//       alert('An error occurred. Please try again.')
//     } finally {
//       setOrderLoading(false)
//     }
//   }

//   const handleDownloadTicket = () => {
//     if (!generatedTicket) return
    
//     // Create a beautiful downloadable ticket
//     const ticketHtml = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Order Ticket - ${generatedTicket.orderNumber}</title>
//         <style>
//           @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
//           body { font-family: 'Inter', sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
//           .ticket { background: white; border-radius: 20px; padding: 30px; max-width: 500px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); border: 4px solid #f59e0b; }
//           .header { text-align: center; background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 20px; margin: -30px -30px 20px -30px; border-radius: 16px 16px 0 0; }
//           .order-number { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
//           .customer-info, .order-summary { margin-bottom: 20px; padding: 20px; background: #f8fafc; border-radius: 12px; }
//           .total { font-size: 28px; font-weight: bold; color: #f59e0b; text-align: center; margin: 30px 0; padding: 20px; background: linear-gradient(135deg, #fed7aa, #fdba74); border-radius: 12px; }
//           .footer { text-align: center; color: #64748b; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 2px dashed #e2e8f0; }
//           .item { display: flex; justify-content: between; align-items: center; margin-bottom: 10px; padding: 10px; background: white; border-radius: 8px; }
//         </style>
//       </head>
//       <body>
//         <div class="ticket">
//           <div class="header">
//             <h2>🎫 Yafrican Order Ticket</h2>
//             <div class="order-number">${generatedTicket.orderNumber}</div>
//             <div>${new Date(generatedTicket.timestamp).toLocaleDateString()}</div>
//           </div>
          
//           <div class="customer-info">
//             <strong>Customer:</strong> ${generatedTicket.customerInfo.fullName}<br>
//             <strong>Phone:</strong> ${generatedTicket.customerInfo.phone}<br>
//             <strong>Email:</strong> ${generatedTicket.customerInfo.email}
//           </div>
          
//           <div class="order-summary">
//             <strong>Items:</strong><br>
//             ${generatedTicket.items.map(item => `
//               <div class="item">
//                 <span>${item.name} x${item.quantity}</span>
//                 <span>${(item.price * item.quantity).toFixed(2)} Br</span>
//               </div>
//             `).join('')}
//           </div>
          
//           <div class="total">Total: ${generatedTicket.totalAmount.toFixed(2)} Br</div>
          
//           <div class="footer">
//             Thank you for your order!<br>
//             We'll contact you within 24 hours.
//           </div>
//         </div>
//       </body>
//       </html>
//     `
    
//     const blob = new Blob([ticketHtml], { type: 'text/html' })
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement('a')
//     a.href = url
//     a.download = `yafrican-ticket-${generatedTicket.orderNumber}.html`
//     document.body.appendChild(a)
//     a.click()
//     document.body.removeChild(a)
//     URL.revokeObjectURL(url)
//   }

//   const selectedBankDetails = ethiopianBanks.find(bank => bank.id === selectedBank)

//   // Add a redirect check in the render
//   if (loading) {
//     return (
//       <div className="max-w-6xl mx-auto px-4 py-8">
//         <div className="flex items-center justify-center min-h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
//         </div>
//       </div>
//     )
//   }

//   // If no user and not loading, show nothing (redirect should happen)
//   if (!user && !loading) {
//     return (
//       <div className="max-w-6xl mx-auto px-4 py-8">
//         <div className="flex items-center justify-center min-h-64">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
//             <p>Redirecting to signin...</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (showTicket && generatedTicket) {
//     return (
//       <div className="max-w-4xl mx-auto px-4 py-8">
//         <OrderTicketDisplay 
//           ticket={generatedTicket}
//           onDownload={handleDownloadTicket}
//           onProofUpload={handleProofUpload}
//         />
//       </div>
//     )
//   }

//   if (cartItems.length === 0) {
//     return (
//       <div className="max-w-4xl mx-auto px-4 py-8">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-gray-900 mb-4">Checkout</h1>
//           <p className="text-gray-600">Your cart is empty</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-8">
//       {/* User Info Header */}
//       {user && (
//         <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
//           <div className="flex items-center gap-3">
//             <UserIcon className="w-5 h-5 text-green-600" />
//             <div>
//               <p className="font-medium text-green-800">
//                 Welcome back, {user.name}!
//               </p>
//               <p className="text-sm text-green-600">
//                 Your information has been pre-filled. Please verify and add your delivery address.
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Left Column - Customer Info & Order Summary */}
//         <div className="space-y-6">
//           {/* Customer Information */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold text-gray-900 mb-4">
//               Customer Information
//               {user && (
//                 <span className="ml-2 text-sm text-green-600 font-normal">
//                   (Pre-filled from your account)
//                 </span>
//               )}
//             </h2>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Full Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="fullName"
//                   value={customerInfo.fullName}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
//                   placeholder="Enter your full name"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Phone Number *
//                 </label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={customerInfo.phone}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
//                   placeholder="+251 XXX XXX XXX"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Email Address
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={customerInfo.email}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
//                   placeholder="your@email.com"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Delivery Address *
//                 </label>
//                 <textarea
//                   name="address"
//                   value={customerInfo.address}
//                   onChange={handleInputChange}
//                   rows={3}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
//                   placeholder="Enter your complete delivery address"
//                   required
//                 />
//                 <p className="text-sm text-gray-500 mt-1">
//                   Please provide detailed address including city, sub-city, and specific landmarks
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Order Summary */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
//             <div className="space-y-3">
//               {cartItems.map((item) => (
//                 <div key={item.id} className="flex justify-between items-center">
//                   <div className="flex items-center space-x-3">
//                     <img
//                       src={item.image}
//                       alt={item.name}
//                       className="w-12 h-12 object-cover rounded"
//                     />
//                     <div>
//                       <p className="font-medium text-gray-900">{item.name}</p>
//                       <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
//                     </div>
//                   </div>
//                   <p className="font-semibold text-gray-900">
//                     {(item.price * item.quantity).toFixed(2)} Br
//                   </p>
//                 </div>
//               ))}
//             </div>
//             <div className="border-t mt-4 pt-4">
//               <div className="flex justify-between text-lg font-bold">
//                 <span>Total Amount:</span>
//                 <span className="text-yellow-600">{totalPrice.toFixed(2)} Br</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right Column - Payment Methods */}
//         <div className="space-y-6">
//           {/* Payment Methods */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
//             <p className="text-gray-600 mb-4">Select your preferred bank for transfer</p>
            
//             <div className="space-y-3">
//               {ethiopianBanks.map((bank) => (
//                 <div
//                   key={bank.id}
//                   className={`border rounded-lg p-4 cursor-pointer transition-all ${
//                     selectedBank === bank.id
//                       ? 'border-yellow-500 bg-yellow-50'
//                       : 'border-gray-200 hover:border-yellow-300'
//                   }`}
//                   onClick={() => setSelectedBank(bank.id)}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-3">
//                       <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
//                         <span className="text-xs font-bold text-gray-600">
//                           {bank.name.split(' ').map(word => word[0]).join('')}
//                         </span>
//                       </div>
//                       <div>
//                         <h3 className="font-semibold text-gray-900">{bank.name}</h3>
//                         <p className="text-sm text-gray-500">
//                           Account: {bank.accountNumber}
//                         </p>
//                       </div>
//                     </div>
//                     <div className={`w-4 h-4 rounded-full border-2 ${
//                       selectedBank === bank.id
//                         ? 'bg-yellow-500 border-yellow-500'
//                         : 'border-gray-300'
//                     }`} />
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Selected Bank Details */}
//             {selectedBankDetails && (
//               <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
//                 <h3 className="font-semibold text-green-900 mb-3">
//                   Transfer Instructions for {selectedBankDetails.name}
//                 </h3>
//                 <div className="space-y-2 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Account Name:</span>
//                     <span className="font-medium">{selectedBankDetails.accountName}</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-600">Account Number:</span>
//                     <div className="flex items-center space-x-2">
//                       <span className="font-mono font-medium bg-gray-100 px-2 py-1 rounded">
//                         {selectedBankDetails.accountNumber}
//                       </span>
//                       <button
//                         onClick={() => handleCopyAccount(selectedBankDetails.accountNumber)}
//                         className="p-1 text-gray-500 hover:text-yellow-600 transition-colors"
//                         title="Copy account number"
//                       >
//                         {copiedAccount === selectedBankDetails.accountNumber ? (
//                           <CheckIcon className="w-4 h-4 text-green-500" />
//                         ) : (
//                           <DocumentDuplicateIcon className="w-4 h-4" />
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                   {selectedBankDetails.branch && (
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Branch:</span>
//                       <span className="font-medium">{selectedBankDetails.branch}</span>
//                     </div>
//                   )}
//                   <div className="mt-3 p-3 bg-yellow-100 border border-yellow-200 rounded">
//                     <p className="text-yellow-800 text-xs">
//                       💡 <strong>Important:</strong> After making the transfer, please upload the receipt screenshot for admin approval.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Place Order Button */}
//           <button
//             onClick={handlePlaceOrder}
//             disabled={!selectedBank || orderLoading}
//             className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg flex items-center justify-center gap-2"
//           >
//             {orderLoading ? (
//               <>
//                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                 Creating Your Ticket...
//               </>
//             ) : (
//               'Get YourTicket '
//             )}
//           </button>

//           {/* Additional Instructions */}
//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//             <h4 className="font-semibold text-blue-900 mb-2">Order Process</h4>
//             <ol className="text-sm text-blue-800 space-y-1">
//               <li>1. Fill in your delivery information</li>
//               <li>2. Select your preferred bank</li>
//               <li>3. Get your beautiful order ticket</li>
//               <li>4. Transfer the total amount to the provided account</li>
//               <li>5. Upload the transfer receipt screenshot</li>
//               <li>6. Wait for admin approval (within 24 hours)</li>
//               <li>7. We'll process your order and confirm delivery</li>
//             </ol>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// components/Checkout.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '../app/contexts/CartContext'
import { DocumentDuplicateIcon, CheckIcon, UserIcon, TicketIcon } from '@heroicons/react/24/outline'
import { TicketGenerator } from '../utils/ticketGenerator'
import OrderTicketDisplay from './OrderTicketDisplay'
import { OrderTicket, CustomerInfo } from '../types/ticket'

interface BankDetails {
  id: string
  name: string
  logo: string
  accountNumber: string
  accountName: string
  branch?: string
}

interface User {
  id: string
  name: string
  email: string
  phone?: string
}

const ethiopianBanks: BankDetails[] = [
  {
    id: 'commercial',
    name: 'Commercial Bank of Ethiopia',
    logo: '/banks/cbe.png',
    accountNumber: '10003456789',
    accountName: 'Yafrican Online Store',
    branch: 'Main Branch'
  },
  {
    id: 'abyssinia',
    name: 'Abyssinia Bank',
    logo: '/banks/abyssinia.png',
    accountNumber: '10004567890',
    accountName: 'Yafrican Online Store',
    branch: 'Head Office'
  },
  {
    id: 'zemen',
    name: 'Zemen Bank',
    logo: '/banks/zemen.png',
    accountNumber: '10005678901',
    accountName: 'Yafrican Online Store',
    branch: 'Main Branch'
  },
  {
    id: 'abay',
    name: 'Abay Bank',
    logo: '/banks/abay.png',
    accountNumber: '10006789012',
    accountName: 'Yafrican Online Store',
    branch: 'Head Office'
  },
  {
    id: 'telebirr',
    name: 'Telebirr',
    logo: '/banks/Telebirr.png',
    accountNumber: '251912345678',
    accountName: 'Yafrican Store',
    branch: ''
  },
  {
    id: 'awash',
    name: 'Awash Bank',
    logo: '/banks/awash.png',
    accountNumber: '10007890123',
    accountName: 'Yafrican Online Store',
    branch: 'Main Branch'
  }
]

export default function Checkout() {
  const router = useRouter()
  const { cartItems, totalPrice, clearCart } = useCart()
  const [selectedBank, setSelectedBank] = useState<string>('')
  const [copiedAccount, setCopiedAccount] = useState<string>('')
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: ''
  })
  const [generatedTicket, setGeneratedTicket] = useState<OrderTicket | null>(null)
  const [showTicket, setShowTicket] = useState(false)
  const [orderLoading, setOrderLoading] = useState(false)

  const ticketGenerator = new TicketGenerator()

  // Check authentication and get user data on component mount
  useEffect(() => {
    checkAuthentication()
  }, [])

  const checkAuthentication = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/auth/check', {
        credentials: 'include'
      })
      
      const data = await response.json()
      
      if (response.ok && data.loggedIn && data.user) {
        // User is authenticated
        setUser(data.user)
        
        // Pre-fill user data
        setCustomerInfo(prev => ({
          ...prev,
          fullName: data.user.name || '',
          email: data.user.email || '',
          phone: data.user.phone || ''
        }))
      } else {
        // User not authenticated, redirect to signin
        console.log('User not authenticated, redirecting to signin')
        window.location.href = `/signin?returnUrl=${encodeURIComponent(window.location.pathname)}`
        return
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      window.location.href = `/signin?returnUrl=${encodeURIComponent(window.location.pathname)}`
      return
    } finally {
      setLoading(false)
    }
  }

  const handleCopyAccount = (accountNumber: string) => {
    navigator.clipboard.writeText(accountNumber)
    setCopiedAccount(accountNumber)
    setTimeout(() => setCopiedAccount(''), 2000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }))
  }

 // In your Checkout component, replace the handleProofUpload function:
const handleProofUpload = async (ticket: OrderTicket, imageUrl: string) => {
  try {
    // Since OrderTicketDisplay now passes the image URL directly (from file input)
    const updatedTicket = ticketGenerator.addPaymentProof(ticket, imageUrl)
    setGeneratedTicket(updatedTicket)
    saveTicketToStorage(updatedTicket)
    
    console.log('✅ Payment proof added to ticket:', imageUrl)
    
  } catch (error) {
    console.error('❌ Error adding payment proof:', error)
    alert('Failed to add payment proof to ticket')
  }
}

  const saveTicketToStorage = (ticket: OrderTicket) => {
    const existingTickets = JSON.parse(localStorage.getItem('yafrican_tickets') || '[]')
    const updatedTickets = [...existingTickets, ticket]
    localStorage.setItem('yafrican_tickets', JSON.stringify(updatedTickets))
  }

  const handlePlaceOrder = async () => {
    if (!selectedBank) {
      alert('Please select a payment method')
      return
    }

    if (!customerInfo.fullName || !customerInfo.phone || !customerInfo.address) {
      alert('Please fill in all required customer information')
      return
    }

    try {
      setOrderLoading(true)

      // Generate order ticket
      const selectedBankDetails = ethiopianBanks.find(bank => bank.id === selectedBank)
      const ticket = ticketGenerator.generateOrderTicket(
        customerInfo,
        cartItems.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image
        })),
        totalPrice,
        selectedBank,
        selectedBankDetails
      )

      // Save order to database
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticket,
          customerInfo,
          cartItems,
          totalPrice,
          paymentMethod: selectedBank,
          bankDetails: selectedBankDetails
        }),
        credentials: 'include'
      })

      if (response.ok) {
        setGeneratedTicket(ticket)
        setShowTicket(true)
        saveTicketToStorage(ticket)
        clearCart()
      } else {
        alert('Failed to create order. Please try again.')
      }
    } catch (error) {
      console.error('Order creation error:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setOrderLoading(false)
    }
  }

const handleDownloadTicket = async () => {
  if (!generatedTicket) return
  
  try {
    // Create a canvas element to generate the ticket as image
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = 600
    canvas.height = 800

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, '#667eea')
    gradient.addColorStop(1, '#764ba2')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Ticket container
    const ticketWidth = 500
    const ticketHeight = 700
    const ticketX = (canvas.width - ticketWidth) / 2
    const ticketY = (canvas.height - ticketHeight) / 2

    // Ticket background with rounded corners
    ctx.fillStyle = 'white'
    ctx.beginPath()
    ctx.roundRect(ticketX, ticketY, ticketWidth, ticketHeight, 20)
    ctx.fill()

    // Ticket border
    ctx.strokeStyle = '#f59e0b'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.roundRect(ticketX, ticketY, ticketWidth, ticketHeight, 20)
    ctx.stroke()

    // Header section - create rounded top corners only
    ctx.fillStyle = '#f59e0b'
    ctx.beginPath()
    ctx.moveTo(ticketX + 20, ticketY) // Start from top-left rounded corner
    ctx.lineTo(ticketX + ticketWidth - 20, ticketY) // Top line
    ctx.arcTo(ticketX + ticketWidth, ticketY, ticketX + ticketWidth, ticketY + 20, 20) // Top-right corner
    ctx.lineTo(ticketX + ticketWidth, ticketY + 100) // Right line
    ctx.lineTo(ticketX, ticketY + 100) // Bottom line
    ctx.lineTo(ticketX, ticketY + 20) // Left line
    ctx.arcTo(ticketX, ticketY, ticketX + 20, ticketY, 20) // Top-left corner
    ctx.closePath()
    ctx.fill()

    // Header text
    ctx.fillStyle = 'white'
    ctx.font = 'bold 24px Inter, Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Yafrican Order Ticket', ticketX + ticketWidth / 2, ticketY + 40)

    ctx.font = 'bold 20px Inter, Arial, sans-serif'
    ctx.fillText(generatedTicket.orderNumber, ticketX + ticketWidth / 2, ticketY + 70)

    // Date
    ctx.font = '16px Inter, Arial, sans-serif'
    ctx.fillText(new Date(generatedTicket.timestamp).toLocaleDateString(), ticketX + ticketWidth / 2, ticketY + 95)

    // Customer info section
    let currentY = ticketY + 140
    ctx.fillStyle = '#1f2937'
    ctx.font = 'bold 18px Inter, Arial, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('Customer Information:', ticketX + 30, currentY)

    currentY += 30
    ctx.font = '16px Inter, Arial, sans-serif'
    ctx.fillText(`Name: ${generatedTicket.customerInfo.fullName}`, ticketX + 30, currentY)
    
    currentY += 25
    ctx.fillText(`Phone: ${generatedTicket.customerInfo.phone}`, ticketX + 30, currentY)
    
    currentY += 25
    ctx.fillText(`Email: ${generatedTicket.customerInfo.email}`, ticketX + 30, currentY)

    // Items section
    currentY += 50
    ctx.fillStyle = '#1f2937'
    ctx.font = 'bold 18px Inter, Arial, sans-serif'
    ctx.fillText('Order Items:', ticketX + 30, currentY)

    currentY += 30
    generatedTicket.items.forEach((item, index) => {
      if (currentY > ticketY + ticketHeight - 150) return // Prevent overflow
      
      ctx.fillStyle = '#374151'
      ctx.font = '14px Inter, Arial, sans-serif'
      ctx.fillText(`${item.name} x${item.quantity}`, ticketX + 30, currentY)
      
      ctx.fillStyle = '#f59e0b'
      ctx.font = 'bold 14px Inter, Arial, sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(`${(item.price * item.quantity).toFixed(2)} Br`, ticketX + ticketWidth - 30, currentY)
      
      ctx.textAlign = 'left'
      currentY += 20
    })

    // Total section
    currentY = ticketY + ticketHeight - 100
    ctx.fillStyle = '#f59e0b'
    ctx.beginPath()
    ctx.roundRect(ticketX + 50, currentY, ticketWidth - 100, 60, 12)
    ctx.fill()

    ctx.fillStyle = 'white'
    ctx.font = 'bold 24px Inter, Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Total Amount', ticketX + ticketWidth / 2, currentY + 25)
    
    ctx.font = 'bold 28px Inter, Arial, sans-serif'
    ctx.fillText(`${generatedTicket.totalAmount.toFixed(2)} Br`, ticketX + ticketWidth / 2, currentY + 55)

    // Footer
    currentY = ticketY + ticketHeight - 30
    ctx.fillStyle = '#64748b'
    ctx.font = '14px Inter, Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Thank you for your order! We\'ll contact you within 24 hours.', ticketX + ticketWidth / 2, currentY)

    // Convert to image and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `yafrican-ticket-${generatedTicket.orderNumber}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    }, 'image/png')

  } catch (error) {
    console.error('Error generating ticket image:', error)
    // Fallback to HTML download if image generation fails
    const ticketHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Order Ticket - ${generatedTicket.orderNumber}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          body { font-family: 'Inter', sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
          .ticket { background: white; border-radius: 20px; padding: 30px; max-width: 500px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); border: 4px solid #f59e0b; }
          .header { text-align: center; background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 20px; margin: -30px -30px 20px -30px; border-radius: 16px 16px 0 0; }
          .order-number { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .customer-info, .order-summary { margin-bottom: 20px; padding: 20px; background: #f8fafc; border-radius: 12px; }
          .total { font-size: 28px; font-weight: bold; color: #f59e0b; text-align: center; margin: 30px 0; padding: 20px; background: linear-gradient(135deg, #fed7aa, #fdba74); border-radius: 12px; }
          .footer { text-align: center; color: #64748b; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 2px dashed #e2e8f0; }
          .item { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding: 10px; background: white; border-radius: 8px; }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="header">
            <h2>Yafrican Order Ticket</h2>
            <div class="order-number">${generatedTicket.orderNumber}</div>
            <div>${new Date(generatedTicket.timestamp).toLocaleDateString()}</div>
          </div>
          
          <div class="customer-info">
            <strong>Customer:</strong> ${generatedTicket.customerInfo.fullName}<br>
            <strong>Phone:</strong> ${generatedTicket.customerInfo.phone}<br>
            <strong>Email:</strong> ${generatedTicket.customerInfo.email}
          </div>
          
          <div class="order-summary">
            <strong>Items:</strong><br>
            ${generatedTicket.items.map(item => `
              <div class="item">
                <span>${item.name} x${item.quantity}</span>
                <span style="font-weight: bold; color: #f59e0b;">${(item.price * item.quantity).toFixed(2)} Br</span>
              </div>
            `).join('')}
          </div>
          
          <div class="total">Total: ${generatedTicket.totalAmount.toFixed(2)} Br</div>
          
          <div class="footer">
            Thank you for your order!<br>
            We'll contact you within 24 hours.
          </div>
        </div>
      </body>
      </html>
    `
    
    const blob = new Blob([ticketHtml], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `yafrican-ticket-${generatedTicket.orderNumber}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}
  const selectedBankDetails = ethiopianBanks.find(bank => bank.id === selectedBank)

  // Add a redirect check in the render
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
        </div>
      </div>
    )
  }

  // If no user and not loading, show nothing (redirect should happen)
  if (!user && !loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p>Redirecting to signin...</p>
          </div>
        </div>
      </div>
    )
  }

  if (showTicket && generatedTicket) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <OrderTicketDisplay 
          ticket={generatedTicket}
          onDownload={handleDownloadTicket}
          onProofUpload={handleProofUpload}
        />
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Checkout</h1>
          <p className="text-gray-600">Your cart is empty</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* User Info Header */}
      {user && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-3">
            <UserIcon className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">
                Welcome back, {user.name}!
              </p>
              <p className="text-sm text-green-600">
                Your information has been pre-filled. Please verify and add your delivery address.
              </p>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Customer Info & Order Summary */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Customer Information
              {user && (
                <span className="ml-2 text-sm text-green-600 font-normal">
                  (Pre-filled from your account)
                </span>
              )}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={customerInfo.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="+251 XXX XXX XXX"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={customerInfo.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address *
                </label>
                <textarea
                  name="address"
                  value={customerInfo.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter your complete delivery address"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Please provide detailed address including city, sub-city, and specific landmarks
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {(item.price * item.quantity).toFixed(2)} Br
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount:</span>
                <span className="text-yellow-600">{totalPrice.toFixed(2)} Br</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Payment Methods */}
        <div className="space-y-6">
          {/* Payment Methods */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
            <p className="text-gray-600 mb-4">Select your preferred bank for transfer</p>
            
            <div className="space-y-3">
              {ethiopianBanks.map((bank) => (
                <div
                  key={bank.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedBank === bank.id
                      ? 'border-yellow-500 bg-yellow-50'
                      : 'border-gray-200 hover:border-yellow-300'
                  }`}
                  onClick={() => setSelectedBank(bank.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-600">
                          {bank.name.split(' ').map(word => word[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{bank.name}</h3>
                        <p className="text-sm text-gray-500">
                          Account: {bank.accountNumber}
                        </p>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedBank === bank.id
                        ? 'bg-yellow-500 border-yellow-500'
                        : 'border-gray-300'
                    }`} />
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Bank Details */}
            {selectedBankDetails && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-3">
                  Transfer Instructions for {selectedBankDetails.name}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Name:</span>
                    <span className="font-medium">{selectedBankDetails.accountName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Account Number:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-medium bg-gray-100 px-2 py-1 rounded">
                        {selectedBankDetails.accountNumber}
                      </span>
                      <button
                        onClick={() => handleCopyAccount(selectedBankDetails.accountNumber)}
                        className="p-1 text-gray-500 hover:text-yellow-600 transition-colors"
                        title="Copy account number"
                      >
                        {copiedAccount === selectedBankDetails.accountNumber ? (
                          <CheckIcon className="w-4 h-4 text-green-500" />
                        ) : (
                          <DocumentDuplicateIcon className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  {selectedBankDetails.branch && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Branch:</span>
                      <span className="font-medium">{selectedBankDetails.branch}</span>
                    </div>
                  )}
                  <div className="mt-3 p-3 bg-yellow-100 border border-yellow-200 rounded">
                    <p className="text-yellow-800 text-xs">
                      💡 <strong>Important:</strong> After making the transfer, please upload the receipt screenshot for admin approval.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Place Order Button with Ticket Icon */}
          <button
            onClick={handlePlaceOrder}
            disabled={!selectedBank || orderLoading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg flex items-center justify-center gap-3"
          >
            {orderLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating Your Ticket...
              </>
            ) : (
              <>
                <TicketIcon className="w-6 h-6" />
                Get Your Ticket
              </>
            )}
          </button>

          {/* Additional Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Order Process</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Fill in your delivery information</li>
              <li>2. Select your preferred bank</li>
              <li>3. Get your beautiful order ticket</li>
              <li>4. Transfer the total amount to the provided account</li>
              <li>5. Upload the transfer receipt screenshot</li>
              <li>6. Wait for admin approval (within 24 hours)</li>
              <li>7. We'll process your order and confirm delivery</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}