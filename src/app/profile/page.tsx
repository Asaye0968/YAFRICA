// 'use client'

// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { motion } from 'framer-motion'
// import { 
//   User, Mail, Phone, Store, MapPin, CreditCard, 
//   Save, Edit3, Shield, Calendar, LogOut, 
//   Settings, Home, BadgeCheck, UserCog
// } from 'lucide-react'
// import { toast, ToastContainer } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'

// interface UserProfile {
//   id: string
//   name: string
//   email: string
//   phone: string
//   storeName: string
//   address: string
//   paymentMethod: string
//   role: string
//   status: string
//   createdAt: string
//   updatedAt: string
// }

// export default function ProfilePage() {
//   const router = useRouter()
//   const [loading, setLoading] = useState(true)
//   const [saving, setSaving] = useState(false)
//   const [editing, setEditing] = useState(false)
//   const [user, setUser] = useState<UserProfile | null>(null)
//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     storeName: '',
//     address: '',
//     paymentMethod: ''
//   })

//   useEffect(() => {
//     fetchProfile()
//   }, [])

//   const fetchProfile = async () => {
//     try {
//       const response = await fetch('/api/profile')
      
//       if (response.status === 401) {
//         router.push('/signin')
//         return
//       }

//       if (!response.ok) {
//         throw new Error('Failed to fetch profile')
//       }

//       const data = await response.json()
      
//       if (data.success) {
//         setUser(data.user)
//         setFormData({
//           name: data.user.name,
//           phone: data.user.phone || '',
//           storeName: data.user.storeName || '',
//           address: data.user.address || '',
//           paymentMethod: data.user.paymentMethod || ''
//         })
//       }
//     } catch (error) {
//       console.error('Profile fetch error:', error)
//       toast.error('Failed to load profile')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleLogout = async () => {
//     try {
//       await fetch('/api/auth/logout', {
//         method: 'POST',
//         credentials: 'include',
//       })
//       setUser(null)
//       localStorage.removeItem('user-auth')
//       toast.info('Logged out successfully')
//       setTimeout(() => {
//         window.location.href = '/'
//       }, 1500)
//     } catch (err) {
//       console.error('Logout failed', err)
//       toast.error('Logout failed')
//     }
//   }

//   const handleSave = async () => {
//     setSaving(true)
    
//     try {
//       const response = await fetch('/api/profile', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       })

//       const data = await response.json()

//       if (data.success) {
//         setUser(data.user)
//         setEditing(false)
//         toast.success('Profile updated successfully!')
//       } else {
//         toast.error(data.error || 'Failed to update profile')
//       }
//     } catch (error) {
//       console.error('Profile update error:', error)
//       toast.error('Failed to update profile')
//     } finally {
//       setSaving(false)
//     }
//   }

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }))
//   }

//   const getRoleIcon = (role: string) => {
//     switch (role) {
//       case 'admin': return <Shield className="w-4 h-4 text-purple-500" />
//       case 'seller': return <Store className="w-4 h-4 text-green-500" />
//       default: return <User className="w-4 h-4 text-blue-500" />
//     }
//   }

//   const getRoleColor = (role: string) => {
//     switch (role) {
//       case 'admin': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
//       case 'seller': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
//       default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
//     }
//   }

//   const getSettingsPath = () => {
//     switch (user?.role) {
//       case 'seller': return '/seller/settings'
//       case 'admin': return '/admin/settings'
//       default: return '/settings'
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
//         <div className="text-center">
//           <motion.div
//             animate={{ rotate: 360 }}
//             transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//             className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4"
//           />
//           <p className="text-gray-600 dark:text-gray-300 text-lg">Loading your profile...</p>
//         </div>
//       </div>
//     )
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
//         <div className="text-center">
//           <User className="w-20 h-20 text-gray-400 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Profile Not Found</h2>
//           <p className="text-gray-600 dark:text-gray-300 mb-6">Please log in to view your profile.</p>
//           <button
//             onClick={() => router.push('/signin')}
//             className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl font-semibold hover:from-yellow-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl"
//           >
//             Sign In to Continue
//           </button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
//       <ToastContainer position="top-right" theme="colored" />
      
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-8"
//         >
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
//                 Account Profile
//               </h1>
//               <p className="text-gray-600 dark:text-gray-300 text-lg">
//                 Manage your personal information and account settings
//               </p>
//             </div>
//             <div className="flex items-center gap-3">
//               <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRoleColor(user.role)}`}>
//                 {user.role.toUpperCase()}
//               </span>
//             </div>
//           </div>
//         </motion.div>

//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//           {/* Sidebar */}
//           <div className="lg:col-span-1">
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6"
//             >
//               {/* User Card */}
//               <div className="text-center mb-6">
//                 <div className="relative inline-block mb-4">
//                   <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
//                     {user.name.charAt(0).toUpperCase()}
//                   </div>
//                   <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5 border-2 border-white dark:border-gray-800">
//                     <BadgeCheck className="w-3 h-3 text-white" />
//                   </div>
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{user.name}</h3>
//                 <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">{user.email}</p>
//                 <div className="flex items-center justify-center gap-2">
//                   {getRoleIcon(user.role)}
//                   <span className="text-sm font-medium capitalize text-gray-600 dark:text-gray-300">
//                     {user.role}
//                   </span>
//                 </div>
//               </div>

//               {/* Navigation */}
//               <nav className="space-y-2 mb-6">
//                 <button
//                   onClick={() => router.push(getSettingsPath())}
//                   className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                 >
//                   <Settings className="w-5 h-5" />
//                   <span className="font-medium">Settings</span>
//                 </button>
//               </nav>

//               {/* Quick Actions */}
//               <div className="border-t border-gray-200 dark:border-gray-600 pt-4 space-y-2">
//                 {user.role === 'seller' && (
//                   <button
//                     onClick={() => router.push('/seller/dashboard')}
//                     className="w-full flex items-center gap-3 px-3 py-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
//                   >
//                     <Store className="w-4 h-4" />
//                     <span className="text-sm font-medium">Seller Dashboard</span>
//                   </button>
//                 )}
//                 {user.role === 'admin' && (
//                   <button
//                     onClick={() => router.push('/admin/dashboard')}
//                     className="w-full flex items-center gap-3 px-3 py-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
//                   >
//                     <Shield className="w-4 h-4" />
//                     <span className="text-sm font-medium">Admin Dashboard</span>
//                   </button>
//                 )}
//                 <button
//                   onClick={() => router.push('/')}
//                   className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
//                 >
//                   <Home className="w-4 h-4" />
//                   <span className="text-sm font-medium">Back to Home</span>
//                 </button>
//                 <button
//                   onClick={handleLogout}
//                   className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
//                 >
//                   <LogOut className="w-4 h-4" />
//                   <span className="text-sm font-medium">Log Out</span>
//                 </button>
//               </div>
//             </motion.div>

//             {/* Account Status Card */}
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.1 }}
//               className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 mt-6"
//             >
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
//                 <UserCog className="w-5 h-5 text-yellow-500" />
//                 Account Overview
//               </h3>
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600 dark:text-gray-400">Status</span>
//                   <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                     user.status === 'active' 
//                       ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
//                       : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
//                   }`}>
//                     {user.status}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600 dark:text-gray-400">Member since</span>
//                   <span className="text-sm font-medium text-gray-900 dark:text-white">
//                     {new Date(user.createdAt).toLocaleDateString()}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600 dark:text-gray-400">Last updated</span>
//                   <span className="text-sm font-medium text-gray-900 dark:text-white">
//                     {new Date(user.updatedAt).toLocaleDateString()}
//                   </span>
//                 </div>
//               </div>
//             </motion.div>
//           </div>

//           {/* Main Content - Profile Information */}
//           <div className="lg:col-span-3">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8"
//             >
//               <div className="flex items-center justify-between mb-12">
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Personal Information</h2>
//                   <p className="text-gray-600 dark:text-gray-300 mt-1">
//                     Update your personal details and contact information
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => setEditing(!editing)}
//                   className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
//                     editing
//                       ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
//                       : 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white hover:from-yellow-600 hover:to-amber-600 shadow-lg hover:shadow-xl'
//                   }`}
//                 >
//                   <Edit3 className="w-4 h-4" />
//                   {editing ? 'Cancel Editing' : 'Edit Profile'}
//                 </button>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Name */}
//                 <div className="space-y-3">
//                   <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
//                     <User className="w-4 h-4" />
//                     Full Name
//                   </label>
//                   {editing ? (
//                     <input
//                       type="text"
//                       name="name"
//                       value={formData.name}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300"
//                       placeholder="Enter your full name"
//                     />
//                   ) : (
//                     <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border border-transparent">
//                       {user.name}
//                     </div>
//                   )}
//                 </div>

//                 {/* Email */}
//                 <div className="space-y-3">
//                   <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
//                     <Mail className="w-4 h-4" />
//                     Email Address
//                   </label>
//                   <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border border-transparent">
//                     {user.email}
//                   </div>
//                   <p className="text-xs text-gray-500 dark:text-gray-400">
//                     Email address cannot be changed
//                   </p>
//                 </div>

//                 {/* Phone */}
//                 <div className="space-y-3">
//                   <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
//                     <Phone className="w-4 h-4" />
//                     Phone Number
//                   </label>
//                   {editing ? (
//                     <input
//                       type="tel"
//                       name="phone"
//                       value={formData.phone}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300"
//                       placeholder="+251 XXX XXX XXX"
//                     />
//                   ) : (
//                     <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border border-transparent">
//                       {user.phone || 'Not provided'}
//                     </div>
//                   )}
//                 </div>

//                 {/* Store Name */}
//                 {user.role === 'seller' && (
//                   <div className="space-y-3">
//                     <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
//                       <Store className="w-4 h-4" />
//                       Store Name
//                     </label>
//                     {editing ? (
//                       <input
//                         type="text"
//                         name="storeName"
//                         value={formData.storeName}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300"
//                         placeholder="Enter your store name"
//                       />
//                     ) : (
//                       <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border border-transparent">
//                         {user.storeName || 'Not provided'}
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* Address */}
//                 <div className="md:col-span-2 space-y-3">
//                   <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
//                     <MapPin className="w-4 h-4" />
//                     Address
//                   </label>
//                   {editing ? (
//                     <textarea
//                       name="address"
//                       value={formData.address}
//                       onChange={handleInputChange}
//                       rows={3}
//                       className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300 resize-none"
//                       placeholder="Enter your complete address"
//                     />
//                   ) : (
//                     <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border border-transparent whitespace-pre-wrap">
//                       {user.address || 'Not provided'}
//                     </div>
//                   )}
//                 </div>

//                 {/* Payment Method */}
//                 <div className="md:col-span-2 space-y-3">
//                   <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
//                     <CreditCard className="w-4 h-4" />
//                     Preferred Payment Method
//                   </label>
//                   {editing ? (
//                     <select
//                       name="paymentMethod"
//                       value={formData.paymentMethod}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300"
//                     >
//                       <option value="">Select payment method</option>
//                       <option value="bank_transfer">Bank Transfer</option>
//                       <option value="mobile_money">Mobile Money</option>
//                       <option value="cash">Cash on Delivery</option>
//                       <option value="credit_card">Credit Card</option>
//                     </select>
//                   ) : (
//                     <div className="px-4  mb-6 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border border-transparent capitalize">
//                       {user.paymentMethod ? user.paymentMethod.replace(/_/g, ' ') : 'Not specified'}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Save Button */}
//               {editing && (
//                 <div className="flex justify-end pt-6 mt-6 border-t border-gray-200 dark:border-gray-600">
//                   <button
//                     onClick={handleSave}
//                     disabled={saving}
//                     className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl font-semibold hover:from-yellow-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
//                   >
//                     <Save className="w-5 h-5" />
//                     {saving ? (
//                       <span className="flex items-center gap-2">
//                         <motion.div
//                           animate={{ rotate: 360 }}
//                           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                           className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
//                         />
//                         Saving...
//                       </span>
//                     ) : (
//                       'Save Changes'
//                     )}
//                   </button>
//                 </div>
//               )}
//             </motion.div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
// 'use client'

// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { motion } from 'framer-motion'
// import { 
//   User, Mail, Phone, Store, MapPin, CreditCard, 
//   Save, Edit3, Shield, Calendar, LogOut, 
//   Settings, Home, BadgeCheck, UserCog,
//   Clock, XCircle, Ticket
// } from 'lucide-react'
// import { toast, ToastContainer } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'

// interface UserProfile {
//   id: string
//   name: string
//   email: string
//   phone: string
//   storeName: string
//   address: string
//   paymentMethod: string
//   role: string
//   status: string
//   createdAt: string
//   updatedAt: string
// }

// interface OrderTicket {
//   id: string
//   _id?: string
//   orderNumber: string
//   customerInfo: {
//     fullName: string
//     phone: string
//     email: string
//     address: string
//   }
//   items: Array<{
//     id: string
//     name: string
//     quantity: number
//     price: number
//     image: string
//   }>
//   totalAmount: number
//   paymentMethod: string
//   bankDetails?: any
//   timestamp: string
//   createdAt?: string
//   updatedAt?: string
//   status: string
//   paymentProof?: {
//     imageUrl: string
//     uploadedAt: string
//     verified?: boolean
//     verifiedBy?: string
//     verifiedAt?: string
//   }
//   adminVerified?: boolean
//   adminVerifiedAt?: string
//   adminNotes?: string
// }

// export default function ProfilePage() {
//   const router = useRouter()
//   const [loading, setLoading] = useState(true)
//   const [saving, setSaving] = useState(false)
//   const [editing, setEditing] = useState(false)
//   const [user, setUser] = useState<UserProfile | null>(null)
//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     storeName: '',
//     address: '',
//     paymentMethod: ''
//   })
  
//   // New state for tickets section
//   const [userOrders, setUserOrders] = useState<OrderTicket[]>([])
//   const [ordersLoading, setOrdersLoading] = useState(false)
//   const [activeTab, setActiveTab] = useState('profile') // 'profile' or 'tickets'

//   useEffect(() => {
//     fetchProfile()
//   }, [])

//   const fetchProfile = async () => {
//     try {
//       const response = await fetch('/api/profile')
      
//       if (response.status === 401) {
//         router.push('/signin')
//         return
//       }

//       if (!response.ok) {
//         throw new Error('Failed to fetch profile')
//       }

//       const data = await response.json()
      
//       if (data.success) {
//         setUser(data.user)
//         setFormData({
//           name: data.user.name,
//           phone: data.user.phone || '',
//           storeName: data.user.storeName || '',
//           address: data.user.address || '',
//           paymentMethod: data.user.paymentMethod || ''
//         })
//       }
//     } catch (error) {
//       console.error('Profile fetch error:', error)
//       toast.error('Failed to load profile')
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Fetch user orders
//   const fetchUserOrders = async () => {
//     try {
//       setOrdersLoading(true)
//       const response = await fetch('/api/user/orders')
      
//       if (response.ok) {
//         const data = await response.json()
        
//         const transformedOrders: OrderTicket[] = data.orders.map((order: any) => ({
//           id: order._id,
//           _id: order._id,
//           orderNumber: order.orderNumber,
//           customerInfo: order.customerInfo,
//           items: order.items || [],
//           totalAmount: order.totalAmount,
//           paymentMethod: order.paymentMethod || '',
//           bankDetails: order.bankDetails,
//           timestamp: order.createdAt,
//           createdAt: order.createdAt,
//           updatedAt: order.updatedAt,
//           status: order.status,
//           paymentProof: order.paymentProof,
//           adminVerified: order.paymentProof?.verified || false,
//           adminVerifiedAt: order.paymentProof?.verifiedAt,
//           adminNotes: order.adminNotes
//         }))
        
//         setUserOrders(transformedOrders)
//       } else {
//         toast.error('Failed to load your orders')
//       }
//     } catch (error) {
//       console.error('Error fetching user orders:', error)
//       toast.error('Error loading your orders')
//     } finally {
//       setOrdersLoading(false)
//     }
//   }

//   // Load orders when tickets tab is active
//   useEffect(() => {
//     if (activeTab === 'tickets') {
//       fetchUserOrders()
//     }
//   }, [activeTab])

//   const handleLogout = async () => {
//     try {
//       await fetch('/api/auth/logout', {
//         method: 'POST',
//         credentials: 'include',
//       })
//       setUser(null)
//       localStorage.removeItem('user-auth')
//       toast.info('Logged out successfully')
//       setTimeout(() => {
//         window.location.href = '/'
//       }, 1500)
//     } catch (err) {
//       console.error('Logout failed', err)
//       toast.error('Logout failed')
//     }
//   }

//   const handleSave = async () => {
//     setSaving(true)
    
//     try {
//       const response = await fetch('/api/profile', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       })

//       const data = await response.json()

//       if (data.success) {
//         setUser(data.user)
//         setEditing(false)
//         toast.success('Profile updated successfully!')
//       } else {
//         toast.error(data.error || 'Failed to update profile')
//       }
//     } catch (error) {
//       console.error('Profile update error:', error)
//       toast.error('Failed to update profile')
//     } finally {
//       setSaving(false)
//     }
//   }

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }))
//   }

//   const getRoleIcon = (role: string) => {
//     switch (role) {
//       case 'admin': return <Shield className="w-4 h-4 text-purple-500" />
//       case 'seller': return <Store className="w-4 h-4 text-green-500" />
//       default: return <User className="w-4 h-4 text-blue-500" />
//     }
//   }

//   const getRoleColor = (role: string) => {
//     switch (role) {
//       case 'admin': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
//       case 'seller': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
//       default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
//     }
//   }

//   const getSettingsPath = () => {
//     switch (user?.role) {
//       case 'seller': return '/seller/settings'
//       case 'admin': return '/admin/settings'
//       default: return '/settings'
//     }
//   }

//   const onDownloadTicket = async (order: OrderTicket) => {
//     try {
//       // You can implement PDF generation or use your existing download logic
//       const response = await fetch(`/api/tickets/${order.orderNumber}/download`)
      
//       if (response.ok) {
//         const blob = await response.blob()
//         const url = window.URL.createObjectURL(blob)
//         const a = document.createElement('a')
//         a.style.display = 'none'
//         a.href = url
//         a.download = `ticket-${order.orderNumber}.pdf`
//         document.body.appendChild(a)
//         a.click()
//         window.URL.revokeObjectURL(url)
//         toast.success('Ticket downloaded successfully!')
//       } else {
//         toast.error('Failed to download ticket')
//       }
//     } catch (error) {
//       console.error('Download error:', error)
//       toast.error('Error downloading ticket')
//     }
//   }

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
//       case 'pending': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
//       case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
//       default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
//         <div className="text-center">
//           <motion.div
//             animate={{ rotate: 360 }}
//             transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//             className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4"
//           />
//           <p className="text-gray-600 dark:text-gray-300 text-lg">Loading your profile...</p>
//         </div>
//       </div>
//     )
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
//         <div className="text-center">
//           <User className="w-20 h-20 text-gray-400 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Profile Not Found</h2>
//           <p className="text-gray-600 dark:text-gray-300 mb-6">Please log in to view your profile.</p>
//           <button
//             onClick={() => router.push('/signin')}
//             className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl font-semibold hover:from-yellow-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl"
//           >
//             Sign In to Continue
//           </button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
//       <ToastContainer position="top-right" theme="colored" />
      
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-8"
//         >
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
//                 Account Profile
//               </h1>
//               <p className="text-gray-600 dark:text-gray-300 text-lg">
//                 Manage your personal information and account settings
//               </p>
//             </div>
//             <div className="flex items-center gap-3">
//               <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRoleColor(user.role)}`}>
//                 {user.role.toUpperCase()}
//               </span>
//             </div>
//           </div>
//         </motion.div>

//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//           {/* Sidebar */}
//           <div className="lg:col-span-1">
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6"
//             >
//               {/* User Card */}
//               <div className="text-center mb-6">
//                 <div className="relative inline-block mb-4">
//                   <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
//                     {user.name.charAt(0).toUpperCase()}
//                   </div>
//                   <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5 border-2 border-white dark:border-gray-800">
//                     <BadgeCheck className="w-3 h-3 text-white" />
//                   </div>
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{user.name}</h3>
//                 <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">{user.email}</p>
//                 <div className="flex items-center justify-center gap-2">
//                   {getRoleIcon(user.role)}
//                   <span className="text-sm font-medium capitalize text-gray-600 dark:text-gray-300">
//                     {user.role}
//                   </span>
//                 </div>
//               </div>

//               {/* Navigation */}
//               <nav className="space-y-2 mb-6">
//                 <button
//                   onClick={() => router.push(getSettingsPath())}
//                   className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                 >
//                   <Settings className="w-5 h-5" />
//                   <span className="font-medium">Settings</span>
//                 </button>
//               </nav>

//               {/* Quick Actions */}
//               <div className="border-t border-gray-200 dark:border-gray-600 pt-4 space-y-2">
//                 {user.role === 'seller' && (
//                   <button
//                     onClick={() => router.push('/seller/dashboard')}
//                     className="w-full flex items-center gap-3 px-3 py-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
//                   >
//                     <Store className="w-4 h-4" />
//                     <span className="text-sm font-medium">Seller Dashboard</span>
//                   </button>
//                 )}
//                 {user.role === 'admin' && (
//                   <button
//                     onClick={() => router.push('/admin/dashboard')}
//                     className="w-full flex items-center gap-3 px-3 py-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
//                   >
//                     <Shield className="w-4 h-4" />
//                     <span className="text-sm font-medium">Admin Dashboard</span>
//                   </button>
//                 )}
//                 <button
//                   onClick={() => router.push('/')}
//                   className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
//                 >
//                   <Home className="w-4 h-4" />
//                   <span className="text-sm font-medium">Back to Home</span>
//                 </button>
//                 <button
//                   onClick={handleLogout}
//                   className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
//                 >
//                   <LogOut className="w-4 h-4" />
//                   <span className="text-sm font-medium">Log Out</span>
//                 </button>
//               </div>
//             </motion.div>

//             {/* Account Status Card */}
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.1 }}
//               className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 mt-6"
//             >
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
//                 <UserCog className="w-5 h-5 text-yellow-500" />
//                 Account Overview
//               </h3>
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600 dark:text-gray-400">Status</span>
//                   <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                     user.status === 'active' 
//                       ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
//                       : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
//                   }`}>
//                     {user.status}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600 dark:text-gray-400">Member since</span>
//                   <span className="text-sm font-medium text-gray-900 dark:text-white">
//                     {new Date(user.createdAt).toLocaleDateString()}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600 dark:text-gray-400">Last updated</span>
//                   <span className="text-sm font-medium text-gray-900 dark:text-white">
//                     {new Date(user.updatedAt).toLocaleDateString()}
//                   </span>
//                 </div>
//               </div>
//             </motion.div>
//           </div>

//           {/* Main Content - Profile Information & Tickets */}
//           <div className="lg:col-span-3">
//             {/* Tabs Navigation */}
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 mb-6"
//             >
//               <div className="flex space-x-1">
//                 <button
//                   onClick={() => setActiveTab('profile')}
//                   className={`flex-1 py-3 px-4 text-center rounded-xl font-semibold transition-all duration-300 ${
//                     activeTab === 'profile'
//                       ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg'
//                       : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
//                   }`}
//                 >
//                   <User className="w-5 h-5 inline-block mr-2" />
//                   Profile
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('tickets')}
//                   className={`flex-1 py-3 px-4 text-center rounded-xl font-semibold transition-all duration-300 ${
//                     activeTab === 'tickets'
//                       ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg'
//                       : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
//                   }`}
//                 >
//                   <Ticket className="w-5 h-5 inline-block mr-2" />
//                   My Tickets ({userOrders.length})
//                 </button>
//               </div>
//             </motion.div>

//             {/* Profile Tab Content */}
//             {activeTab === 'profile' && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8"
//               >
//                 <div className="flex items-center justify-between mb-12">
//                   <div>
//                     <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Personal Information</h2>
//                     <p className="text-gray-600 dark:text-gray-300 mt-1">
//                       Update your personal details and contact information
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => setEditing(!editing)}
//                     className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
//                       editing
//                         ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
//                         : 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white hover:from-yellow-600 hover:to-amber-600 shadow-lg hover:shadow-xl'
//                     }`}
//                   >
//                     <Edit3 className="w-4 h-4" />
//                     {editing ? 'Cancel Editing' : 'Edit Profile'}
//                   </button>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {/* Name */}
//                   <div className="space-y-3">
//                     <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
//                       <User className="w-4 h-4" />
//                       Full Name
//                     </label>
//                     {editing ? (
//                       <input
//                         type="text"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300"
//                         placeholder="Enter your full name"
//                       />
//                     ) : (
//                       <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border border-transparent">
//                         {user.name}
//                       </div>
//                     )}
//                   </div>

//                   {/* Email */}
//                   <div className="space-y-3">
//                     <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
//                       <Mail className="w-4 h-4" />
//                       Email Address
//                     </label>
//                     <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border border-transparent">
//                       {user.email}
//                     </div>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">
//                       Email address cannot be changed
//                     </p>
//                   </div>

//                   {/* Phone */}
//                   <div className="space-y-3">
//                     <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
//                       <Phone className="w-4 h-4" />
//                       Phone Number
//                     </label>
//                     {editing ? (
//                       <input
//                         type="tel"
//                         name="phone"
//                         value={formData.phone}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300"
//                         placeholder="+251 XXX XXX XXX"
//                       />
//                     ) : (
//                       <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border border-transparent">
//                         {user.phone || 'Not provided'}
//                       </div>
//                     )}
//                   </div>

//                   {/* Store Name */}
//                   {user.role === 'seller' && (
//                     <div className="space-y-3">
//                       <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
//                         <Store className="w-4 h-4" />
//                         Store Name
//                       </label>
//                       {editing ? (
//                         <input
//                           type="text"
//                           name="storeName"
//                           value={formData.storeName}
//                           onChange={handleInputChange}
//                           className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300"
//                           placeholder="Enter your store name"
//                         />
//                       ) : (
//                         <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border border-transparent">
//                           {user.storeName || 'Not provided'}
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   {/* Address */}
//                   <div className="md:col-span-2 space-y-3">
//                     <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
//                       <MapPin className="w-4 h-4" />
//                       Address
//                     </label>
//                     {editing ? (
//                       <textarea
//                         name="address"
//                         value={formData.address}
//                         onChange={handleInputChange}
//                         rows={3}
//                         className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300 resize-none"
//                         placeholder="Enter your complete address"
//                       />
//                     ) : (
//                       <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border border-transparent whitespace-pre-wrap">
//                         {user.address || 'Not provided'}
//                       </div>
//                     )}
//                   </div>

//                   {/* Payment Method */}
//                   <div className="md:col-span-2 space-y-3">
//                     <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
//                       <CreditCard className="w-4 h-4" />
//                       Preferred Payment Method
//                     </label>
//                     {editing ? (
//                       <select
//                         name="paymentMethod"
//                         value={formData.paymentMethod}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300"
//                       >
//                         <option value="">Select payment method</option>
//                         <option value="bank_transfer">Bank Transfer</option>
//                         <option value="mobile_money">Mobile Money</option>
//                         <option value="cash">Cash on Delivery</option>
//                         <option value="credit_card">Credit Card</option>
//                       </select>
//                     ) : (
//                       <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border border-transparent capitalize">
//                         {user.paymentMethod ? user.paymentMethod.replace(/_/g, ' ') : 'Not specified'}
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Save Button */}
//                 {editing && (
//                   <div className="flex justify-end pt-6 mt-6 border-t border-gray-200 dark:border-gray-600">
//                     <button
//                       onClick={handleSave}
//                       disabled={saving}
//                       className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl font-semibold hover:from-yellow-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
//                     >
//                       <Save className="w-5 h-5" />
//                       {saving ? (
//                         <span className="flex items-center gap-2">
//                           <motion.div
//                             animate={{ rotate: 360 }}
//                             transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                             className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
//                           />
//                           Saving...
//                         </span>
//                       ) : (
//                         'Save Changes'
//                       )}
//                     </button>
//                   </div>
//                 )}
//               </motion.div>
//             )}

//             {/* Tickets Tab Content */}
//             {activeTab === 'tickets' && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="space-y-6"
//               >
//                 {/* Loading State */}
//                 {ordersLoading && (
//                   <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
//                     <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//                     <p className="text-gray-600 dark:text-gray-300">Loading your tickets...</p>
//                   </div>
//                 )}

//                 {/* Orders Grid */}
//                 {!ordersLoading && userOrders.length > 0 && (
//                   <div className="grid grid-cols-1 gap-6">
//                     {userOrders.map((order) => (
//                       <div key={order._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
//                         {/* Order Header */}
//                         <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white">
//                           <div className="flex justify-between items-center">
//                             <div>
//                               <h3 className="text-xl font-bold">Order #{order.orderNumber}</h3>
//                               <p className="text-gray-300 text-sm">
//                                 {new Date(order.createdAt!).toLocaleDateString()} • {order.items.length} item(s)
//                               </p>
//                             </div>
//                             <div className="text-right">
//                               <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
//                                 <p className="text-2xl font-bold text-emerald-400">
//                                   {order.totalAmount.toFixed(2)} Br
//                                 </p>
//                                 <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
//                                   {order.status.toUpperCase()}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                         </div>

//                         {/* Order Details */}
//                         <div className="p-6">
//                           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//                             <div>
//                               <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Customer</h4>
//                               <p className="text-gray-600 dark:text-gray-300">{order.customerInfo.fullName}</p>
//                               <p className="text-sm text-gray-500 dark:text-gray-400">{order.customerInfo.phone}</p>
//                             </div>
//                             <div>
//                               <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Status</h4>
//                               <div className="flex items-center gap-2">
//                                 {order.status === 'confirmed' && <BadgeCheck className="w-5 h-5 text-green-500" />}
//                                 {order.status === 'pending' && <Clock className="w-5 h-5 text-amber-500" />}
//                                 {order.status === 'cancelled' && <XCircle className="w-5 h-5 text-red-500" />}
//                                 <span className="capitalize">{order.status}</span>
//                               </div>
//                               {order.paymentProof?.verifiedAt && (
//                                 <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//                                   Verified on {new Date(order.paymentProof.verifiedAt).toLocaleDateString()}
//                                 </p>
//                               )}
//                             </div>
//                             <div>
//                               <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Actions</h4>
//                               <div className="flex gap-2">
//                                 <button
//                                   onClick={() => {
//                                     // Open order details in new tab or modal
//                                     router.push(`/orders/${order.orderNumber}`)
//                                   }}
//                                   className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
//                                 >
//                                   View Details
//                                 </button>
//                                 {order.status === 'confirmed' && (
//                                   <button
//                                     onClick={() => onDownloadTicket(order)}
//                                     className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
//                                   >
//                                     Download
//                                   </button>
//                                 )}
//                               </div>
//                             </div>
//                           </div>

//                           {/* Items Preview */}
//                           <div>
//                             <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Items</h4>
//                             <div className="flex gap-3 overflow-x-auto pb-2">
//                               {order.items.slice(0, 3).map((item, index) => (
//                                 <div key={index} className="flex-shrink-0 w-20 text-center">
//                                   <img
//                                     src={item.image}
//                                     alt={item.name}
//                                     className="w-16 h-16 rounded-lg object-cover mx-auto border border-gray-300 dark:border-gray-600"
//                                   />
//                                   <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 truncate">
//                                     {item.name}
//                                   </p>
//                                   <p className="text-xs font-medium text-gray-900 dark:text-white">
//                                     Qty: {item.quantity}
//                                   </p>
//                                 </div>
//                               ))}
//                               {order.items.length > 3 && (
//                                 <div className="flex-shrink-0 w-20 text-center flex items-center justify-center">
//                                   <div className="bg-gray-100 dark:bg-gray-700 rounded-lg w-16 h-16 flex items-center justify-center">
//                                     <span className="text-lg font-bold text-gray-600 dark:text-gray-300">
//                                       +{order.items.length - 3}
//                                     </span>
//                                   </div>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {/* Empty State */}
//                 {!ordersLoading && userOrders.length === 0 && (
//                   <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
//                     <Ticket className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
//                     <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Tickets Yet</h3>
//                     <p className="text-gray-600 dark:text-gray-300 mb-6">
//                       You haven't placed any orders yet. Start shopping to see your tickets here!
//                     </p>
//                     <button
//                       onClick={() => router.push('/products')}
//                       className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl font-semibold hover:from-yellow-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl"
//                     >
//                       Start Shopping
//                     </button>
//                   </div>
//                 )}
//               </motion.div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
// 'use client'

// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { motion } from 'framer-motion'
// import { 
//   User, Mail, Phone, Store, MapPin, CreditCard, 
//   Save, Edit3, Shield, Calendar, LogOut, 
//   Settings, Home, BadgeCheck, UserCog,
//   Clock, XCircle, Ticket, Printer
// } from 'lucide-react'
// import { toast, ToastContainer } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'

// interface UserProfile {
//   id: string
//   name: string
//   email: string
//   phone: string
//   storeName: string
//   address: string
//   paymentMethod: string
//   role: string
//   status: string
//   createdAt: string
//   updatedAt: string
// }

// interface OrderTicket {
//   id: string
//   _id?: string
//   orderNumber: string
//   customerInfo: {
//     fullName: string
//     phone: string
//     email: string
//     address: string
//   }
//   items: Array<{
//     id: string
//     name: string
//     quantity: number
//     price: number
//     image: string
//   }>
//   totalAmount: number
//   paymentMethod: string
//   bankDetails?: any
//   timestamp: string
//   createdAt?: string
//   updatedAt?: string
//   status: string
//   paymentProof?: {
//     imageUrl: string
//     uploadedAt: string
//     verified?: boolean
//     verifiedBy?: string
//     verifiedAt?: string
//   }
//   adminVerified?: boolean
//   adminVerifiedAt?: string
//   adminNotes?: string
// }

// export default function ProfilePage() {
//   const router = useRouter()
//   const [loading, setLoading] = useState(true)
//   const [saving, setSaving] = useState(false)
//   const [editing, setEditing] = useState(false)
//   const [user, setUser] = useState<UserProfile | null>(null)
//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     storeName: '',
//     address: '',
//     paymentMethod: ''
//   })
  
//   // New state for tickets section
//   const [userOrders, setUserOrders] = useState<OrderTicket[]>([])
//   const [ordersLoading, setOrdersLoading] = useState(false)
//   const [activeTab, setActiveTab] = useState('profile') // 'profile' or 'tickets'

//   useEffect(() => {
//     fetchProfile()
//   }, [])

//   const fetchProfile = async () => {
//     try {
//       const response = await fetch('/api/profile')
      
//       if (response.status === 401) {
//         router.push('/signin')
//         return
//       }

//       if (!response.ok) {
//         throw new Error('Failed to fetch profile')
//       }

//       const data = await response.json()
      
//       if (data.success) {
//         setUser(data.user)
//         setFormData({
//           name: data.user.name,
//           phone: data.user.phone || '',
//           storeName: data.user.storeName || '',
//           address: data.user.address || '',
//           paymentMethod: data.user.paymentMethod || ''
//         })
//       }
//     } catch (error) {
//       console.error('Profile fetch error:', error)
//       toast.error('Failed to load profile')
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Fetch user orders
//   const fetchUserOrders = async () => {
//     try {
//       setOrdersLoading(true)
//       const response = await fetch('/api/user/orders')
      
//       if (response.ok) {
//         const data = await response.json()
        
//         const transformedOrders: OrderTicket[] = data.orders.map((order: any) => ({
//           id: order._id,
//           _id: order._id,
//           orderNumber: order.orderNumber,
//           customerInfo: order.customerInfo,
//           items: order.items || [],
//           totalAmount: order.totalAmount,
//           paymentMethod: order.paymentMethod || '',
//           bankDetails: order.bankDetails,
//           timestamp: order.createdAt,
//           createdAt: order.createdAt,
//           updatedAt: order.updatedAt,
//           status: order.status,
//           paymentProof: order.paymentProof,
//           adminVerified: order.paymentProof?.verified || false,
//           adminVerifiedAt: order.paymentProof?.verifiedAt,
//           adminNotes: order.adminNotes
//         }))
        
//         setUserOrders(transformedOrders)
//       } else {
//         toast.error('Failed to load your orders')
//       }
//     } catch (error) {
//       console.error('Error fetching user orders:', error)
//       toast.error('Error loading your orders')
//     } finally {
//       setOrdersLoading(false)
//     }
//   }

//   // Load orders when tickets tab is active
//   useEffect(() => {
//     if (activeTab === 'tickets') {
//       fetchUserOrders()
//     }
//   }, [activeTab])

//   const handleLogout = async () => {
//     try {
//       await fetch('/api/auth/logout', {
//         method: 'POST',
//         credentials: 'include',
//       })
//       setUser(null)
//       localStorage.removeItem('user-auth')
//       toast.info('Logged out successfully')
//       setTimeout(() => {
//         window.location.href = '/'
//       }, 1500)
//     } catch (err) {
//       console.error('Logout failed', err)
//       toast.error('Logout failed')
//     }
//   }

//   const handleSave = async () => {
//     setSaving(true)
    
//     try {
//       const response = await fetch('/api/profile', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       })

//       const data = await response.json()

//       if (data.success) {
//         setUser(data.user)
//         setEditing(false)
//         toast.success('Profile updated successfully!')
//       } else {
//         toast.error(data.error || 'Failed to update profile')
//       }
//     } catch (error) {
//       console.error('Profile update error:', error)
//       toast.error('Failed to update profile')
//     } finally {
//       setSaving(false)
//     }
//   }

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }))
//   }

//   const getRoleIcon = (role: string) => {
//     switch (role) {
//       case 'admin': return <Shield className="w-4 h-4 text-purple-500" />
//       case 'seller': return <Store className="w-4 h-4 text-green-500" />
//       default: return <User className="w-4 h-4 text-blue-500" />
//     }
//   }

//   const getRoleColor = (role: string) => {
//     switch (role) {
//       case 'admin': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
//       case 'seller': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
//       default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
//     }
//   }

//   const getSettingsPath = () => {
//     switch (user?.role) {
//       case 'seller': return '/seller/settings'
//       case 'admin': return '/admin/settings'
//       default: return '/settings'
//     }
//   }

//   // UPDATED DOWNLOAD FUNCTION - No API needed
//   const onDownloadTicket = async (order: OrderTicket) => {
//     try {
//       console.log('🔄 Generating ticket for order:', order.orderNumber)
      
//       // Create a new window with the ticket display
//       const ticketWindow = window.open('', '_blank')
//       if (ticketWindow) {
//         // Create the ticket HTML structure
//         const ticketHTML = `
//           <!DOCTYPE html>
//           <html>
//             <head>
//               <title>YAFRICAN STORE - Ticket ${order.orderNumber}</title>
//               <script src="https://cdn.tailwindcss.com"></script>
//               <style>
//                 @media print {
//                   body { margin: 0; padding: 0; }
//                   .no-print { display: none !important; }
//                   .print-break { page-break-after: always; }
//                 }
//                 body { font-family: system-ui, sans-serif; }
//               </style>
//             </head>
//             <body class="bg-gray-100 p-4">
//               <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
//                 <!-- Professional Header -->
//                 <div class="bg-gradient-to-r from-gray-900 to-gray-800 p-8 text-white">
//                   <div class="flex justify-between items-start mb-6">
//                     <div>
//                       <h1 class="text-3xl font-bold tracking-tight">YAFRICAN STORE</h1>
//                       <p class="text-gray-300 mt-2">Official Order Confirmation</p>
//                     </div>
//                     <div class="text-right">
//                       <div class="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
//                         <p class="text-sm text-gray-300">Order Reference</p>
//                         <p class="text-xl font-mono font-bold tracking-wider">${order.orderNumber}</p>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div class="grid grid-cols-2 gap-6 text-sm">
//                     <div>
//                       <p class="text-gray-400">Issue Date</p>
//                       <p class="font-semibold">${new Date(order.createdAt!).toLocaleDateString('en-ET', {
//                         year: 'numeric',
//                         month: 'long',
//                         day: 'numeric',
//                         hour: '2-digit',
//                         minute: '2-digit'
//                       })}</p>
//                     </div>
//                     <div>
//                       <p class="text-gray-400">Total Amount</p>
//                       <p class="text-2xl font-bold text-emerald-400">${order.totalAmount.toFixed(2)} Br</p>
//                     </div>
//                   </div>
//                 </div>

//                 <!-- Status Bar -->
//                 <div class="border-b border-gray-200">
//                   <div class="px-8 py-4 bg-emerald-50 border-emerald-200">
//                     <div class="flex items-center gap-3">
//                       <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
//                       <span class="font-semibold text-emerald-600">Payment Verified - Official Ticket</span>
//                     </div>
//                   </div>
//                 </div>

//                 <!-- Main Content -->
//                 <div class="p-8 space-y-8">
//                   <!-- Customer & Order Information -->
//                   <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                     <!-- Customer Details -->
//                     <div class="space-y-6">
//                       <div>
//                         <h3 class="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">CUSTOMER INFORMATION</h3>
//                         <div class="space-y-3">
//                           <div>
//                             <p class="text-sm text-gray-600">Full Name</p>
//                             <p class="font-semibold text-gray-900">${order.customerInfo.fullName}</p>
//                           </div>
//                           <div>
//                             <p class="text-sm text-gray-600">Contact Number</p>
//                             <p class="font-semibold text-gray-900">${order.customerInfo.phone}</p>
//                           </div>
//                           <div>
//                             <p class="text-sm text-gray-600">Email Address</p>
//                             <p class="font-semibold text-gray-900">${order.customerInfo.email}</p>
//                           </div>
//                           <div>
//                             <p class="text-sm text-gray-600">Delivery Address</p>
//                             <p class="font-semibold text-gray-900 leading-relaxed">${order.customerInfo.address}</p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <!-- Order Items -->
//                     <div>
//                       <h3 class="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">ORDER SUMMARY</h3>
//                       <div class="space-y-4">
//                         ${order.items.map(item => `
//                           <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
//                             <div class="flex items-center gap-4">
//                               <img
//                                 src="${item.image}"
//                                 alt="${item.name}"
//                                 class="w-16 h-16 rounded-lg object-cover border border-gray-300"
//                               />
//                               <div>
//                                 <p class="font-semibold text-gray-900">${item.name}</p>
//                                 <p class="text-sm text-gray-600">Quantity: ${item.quantity}</p>
//                                 <p class="text-sm text-gray-600">Unit Price: ${item.price.toFixed(2)} Br</p>
//                               </div>
//                             </div>
//                             <div class="text-right">
//                               <p class="font-bold text-lg text-gray-900">
//                                 ${(item.price * item.quantity).toFixed(2)} Br
//                               </p>
//                             </div>
//                           </div>
//                         `).join('')}
//                       </div>
                      
//                       <!-- Total Amount -->
//                       <div class="mt-6 p-4 bg-gray-900 rounded-lg text-white">
//                         <div class="flex justify-between items-center">
//                           <span class="text-lg font-semibold">Total Amount</span>
//                           <span class="text-2xl font-bold text-emerald-400">
//                             ${order.totalAmount.toFixed(2)} Br
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <!-- Verification Details -->
//                   <div class="bg-emerald-50 rounded-lg p-6 border border-emerald-200">
//                     <h4 class="font-semibold text-emerald-900 mb-4">PAYMENT VERIFICATION</h4>
//                     <div class="space-y-2 text-sm">
//                       <div class="flex justify-between">
//                         <span class="text-emerald-700">Order Status:</span>
//                         <span class="font-semibold text-emerald-900">${order.status.toUpperCase()}</span>
//                       </div>
//                       <div class="flex justify-between">
//                         <span class="text-emerald-700">Payment Verified:</span>
//                         <span class="font-semibold text-emerald-900">YES</span>
//                       </div>
//                       ${order.paymentProof?.verifiedAt ? `
//                         <div class="flex justify-between">
//                           <span class="text-emerald-700">Verified On:</span>
//                           <span class="font-semibold text-emerald-900">${new Date(order.paymentProof.verifiedAt).toLocaleDateString()}</span>
//                         </div>
//                       ` : ''}
//                       ${order.paymentProof?.verifiedBy ? `
//                         <div class="flex justify-between">
//                           <span class="text-emerald-700">Verified By:</span>
//                           <span class="font-semibold text-emerald-900">${order.paymentProof.verifiedBy}</span>
//                         </div>
//                       ` : ''}
//                     </div>
//                   </div>

//                   <!-- Footer Note -->
//                   <div class="text-center border-t border-gray-200 pt-6">
//                     <p class="text-sm text-gray-600">
//                       This is your official purchase confirmation ticket. Present this ticket for order pickup/delivery.
//                     </p>
//                     <p class="text-xs text-gray-500 mt-2">
//                       Generated on ${new Date().toLocaleString()} • Yafrican Store
//                     </p>
//                   </div>

//                   <!-- Print Button -->
//                   <div class="no-print text-center">
//                     <button onclick="window.print()" class="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
//                       🖨️ Print Ticket
//                     </button>
//                     <p class="text-sm text-gray-600 mt-2">Click above to print your official ticket</p>
//                   </div>
//                 </div>
//               </div>
//             </body>
//           </html>
//         `
        
//         ticketWindow.document.write(ticketHTML)
//         ticketWindow.document.close()
        
//         toast.success('Ticket opened in new window. Use the print button to save as PDF.')
//       } else {
//         toast.error('Please allow popups to view your ticket')
//       }
//     } catch (error) {
//       console.error('Ticket generation error:', error)
//       toast.error('Error generating ticket. Please try again.')
//     }
//   }

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
//       case 'pending': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
//       case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
//       default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
//         <div className="text-center">
//           <motion.div
//             animate={{ rotate: 360 }}
//             transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//             className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4"
//           />
//           <p className="text-gray-600 dark:text-gray-300 text-lg">Loading your profile...</p>
//         </div>
//       </div>
//     )
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
//         <div className="text-center">
//           <User className="w-20 h-20 text-gray-400 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Profile Not Found</h2>
//           <p className="text-gray-600 dark:text-gray-300 mb-6">Please log in to view your profile.</p>
//           <button
//             onClick={() => router.push('/signin')}
//             className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl font-semibold hover:from-yellow-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl"
//           >
//             Sign In to Continue
//           </button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
//       <ToastContainer position="top-right" theme="colored" />
      
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-8"
//         >
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
//                 Account Profile
//               </h1>
//               <p className="text-gray-600 dark:text-gray-300 text-lg">
//                 Manage your personal information and account settings
//               </p>
//             </div>
//             <div className="flex items-center gap-3">
//               <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRoleColor(user.role)}`}>
//                 {user.role.toUpperCase()}
//               </span>
//             </div>
//           </div>
//         </motion.div>

//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//           {/* Sidebar */}
//           <div className="lg:col-span-1">
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6"
//             >
//               {/* User Card */}
//               <div className="text-center mb-6">
//                 <div className="relative inline-block mb-4">
//                   <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
//                     {user.name.charAt(0).toUpperCase()}
//                   </div>
//                   <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5 border-2 border-white dark:border-gray-800">
//                     <BadgeCheck className="w-3 h-3 text-white" />
//                   </div>
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{user.name}</h3>
//                 <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">{user.email}</p>
//                 <div className="flex items-center justify-center gap-2">
//                   {getRoleIcon(user.role)}
//                   <span className="text-sm font-medium capitalize text-gray-600 dark:text-gray-300">
//                     {user.role}
//                   </span>
//                 </div>
//               </div>

//               {/* Navigation */}
//               <nav className="space-y-2 mb-6">
//                 <button
//                   onClick={() => router.push(getSettingsPath())}
//                   className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                 >
//                   <Settings className="w-5 h-5" />
//                   <span className="font-medium">Settings</span>
//                 </button>
//               </nav>

//               {/* Quick Actions */}
//               <div className="border-t border-gray-200 dark:border-gray-600 pt-4 space-y-2">
//                 {user.role === 'seller' && (
//                   <button
//                     onClick={() => router.push('/seller/dashboard')}
//                     className="w-full flex items-center gap-3 px-3 py-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
//                   >
//                     <Store className="w-4 h-4" />
//                     <span className="text-sm font-medium">Seller Dashboard</span>
//                   </button>
//                 )}
//                 {user.role === 'admin' && (
//                   <button
//                     onClick={() => router.push('/admin/dashboard')}
//                     className="w-full flex items-center gap-3 px-3 py-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
//                   >
//                     <Shield className="w-4 h-4" />
//                     <span className="text-sm font-medium">Admin Dashboard</span>
//                   </button>
//                 )}
//                 <button
//                   onClick={() => router.push('/')}
//                   className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
//                 >
//                   <Home className="w-4 h-4" />
//                   <span className="text-sm font-medium">Back to Home</span>
//                 </button>
//                 <button
//                   onClick={handleLogout}
//                   className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
//                 >
//                   <LogOut className="w-4 h-4" />
//                   <span className="text-sm font-medium">Log Out</span>
//                 </button>
//               </div>
//             </motion.div>

//             {/* Account Status Card */}
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.1 }}
//               className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 mt-6"
//             >
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
//                 <UserCog className="w-5 h-5 text-yellow-500" />
//                 Account Overview
//               </h3>
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600 dark:text-gray-400">Status</span>
//                   <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                     user.status === 'active' 
//                       ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
//                       : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
//                   }`}>
//                     {user.status}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600 dark:text-gray-400">Member since</span>
//                   <span className="text-sm font-medium text-gray-900 dark:text-white">
//                     {new Date(user.createdAt).toLocaleDateString()}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600 dark:text-gray-400">Last updated</span>
//                   <span className="text-sm font-medium text-gray-900 dark:text-white">
//                     {new Date(user.updatedAt).toLocaleDateString()}
//                   </span>
//                 </div>
//               </div>
//             </motion.div>
//           </div>

//           {/* Main Content - Profile Information & Tickets */}
//           <div className="lg:col-span-3">
//             {/* Tabs Navigation */}
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 mb-6"
//             >
//               <div className="flex space-x-1">
//                 <button
//                   onClick={() => setActiveTab('profile')}
//                   className={`flex-1 py-3 px-4 text-center rounded-xl font-semibold transition-all duration-300 ${
//                     activeTab === 'profile'
//                       ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg'
//                       : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
//                   }`}
//                 >
//                   <User className="w-5 h-5 inline-block mr-2" />
//                   Profile
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('tickets')}
//                   className={`flex-1 py-3 px-4 text-center rounded-xl font-semibold transition-all duration-300 ${
//                     activeTab === 'tickets'
//                       ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg'
//                       : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
//                   }`}
//                 >
//                   <Ticket className="w-5 h-5 inline-block mr-2" />
//                   My Tickets ({userOrders.length})
//                 </button>
//               </div>
//             </motion.div>

//             {/* Profile Tab Content */}
//             {activeTab === 'profile' && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8"
//               >
//                 {/* ... (Your existing profile form content remains exactly the same) ... */}
//                 <div className="flex items-center justify-between mb-12">
//                   <div>
//                     <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Personal Information</h2>
//                     <p className="text-gray-600 dark:text-gray-300 mt-1">
//                       Update your personal details and contact information
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => setEditing(!editing)}
//                     className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
//                       editing
//                         ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
//                         : 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white hover:from-yellow-600 hover:to-amber-600 shadow-lg hover:shadow-xl'
//                     }`}
//                   >
//                     <Edit3 className="w-4 h-4" />
//                     {editing ? 'Cancel Editing' : 'Edit Profile'}
//                   </button>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {/* ... (All your existing profile form fields remain exactly the same) ... */}
//                   {/* Name */}
//                   <div className="space-y-3">
//                     <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
//                       <User className="w-4 h-4" />
//                       Full Name
//                     </label>
//                     {editing ? (
//                       <input
//                         type="text"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300"
//                         placeholder="Enter your full name"
//                       />
//                     ) : (
//                       <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border border-transparent">
//                         {user.name}
//                       </div>
//                     )}
//                   </div>

//                   {/* Email */}
//                   <div className="space-y-3">
//                     <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
//                       <Mail className="w-4 h-4" />
//                       Email Address
//                     </label>
//                     <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border border-transparent">
//                       {user.email}
//                     </div>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">
//                       Email address cannot be changed
//                     </p>
//                   </div>

//                   {/* Phone */}
//                   <div className="space-y-3">
//                     <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
//                       <Phone className="w-4 h-4" />
//                       Phone Number
//                     </label>
//                     {editing ? (
//                       <input
//                         type="tel"
//                         name="phone"
//                         value={formData.phone}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300"
//                         placeholder="+251 XXX XXX XXX"
//                       />
//                     ) : (
//                       <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border border-transparent">
//                         {user.phone || 'Not provided'}
//                       </div>
//                     )}
//                   </div>

//                   {/* Store Name */}
//                   {user.role === 'seller' && (
//                     <div className="space-y-3">
//                       <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
//                         <Store className="w-4 h-4" />
//                         Store Name
//                       </label>
//                       {editing ? (
//                         <input
//                           type="text"
//                           name="storeName"
//                           value={formData.storeName}
//                           onChange={handleInputChange}
//                           className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300"
//                           placeholder="Enter your store name"
//                         />
//                       ) : (
//                         <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border border-transparent">
//                           {user.storeName || 'Not provided'}
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   {/* Address */}
//                   <div className="md:col-span-2 space-y-3">
//                     <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
//                       <MapPin className="w-4 h-4" />
//                       Address
//                     </label>
//                     {editing ? (
//                       <textarea
//                         name="address"
//                         value={formData.address}
//                         onChange={handleInputChange}
//                         rows={3}
//                         className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300 resize-none"
//                         placeholder="Enter your complete address"
//                       />
//                     ) : (
//                       <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border border-transparent whitespace-pre-wrap">
//                         {user.address || 'Not provided'}
//                       </div>
//                     )}
//                   </div>

//                   {/* Payment Method */}
//                   <div className="md:col-span-2 space-y-3">
//                     <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
//                       <CreditCard className="w-4 h-4" />
//                       Preferred Payment Method
//                     </label>
//                     {editing ? (
//                       <select
//                         name="paymentMethod"
//                         value={formData.paymentMethod}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300"
//                       >
//                         <option value="">Select payment method</option>
//                         <option value="bank_transfer">Bank Transfer</option>
//                         <option value="mobile_money">Mobile Money</option>
//                         <option value="cash">Cash on Delivery</option>
//                         <option value="credit_card">Credit Card</option>
//                       </select>
//                     ) : (
//                       <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border border-transparent capitalize">
//                         {user.paymentMethod ? user.paymentMethod.replace(/_/g, ' ') : 'Not specified'}
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Save Button */}
//                 {editing && (
//                   <div className="flex justify-end pt-6 mt-6 border-t border-gray-200 dark:border-gray-600">
//                     <button
//                       onClick={handleSave}
//                       disabled={saving}
//                       className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl font-semibold hover:from-yellow-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
//                     >
//                       <Save className="w-5 h-5" />
//                       {saving ? (
//                         <span className="flex items-center gap-2">
//                           <motion.div
//                             animate={{ rotate: 360 }}
//                             transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                             className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
//                           />
//                           Saving...
//                         </span>
//                       ) : (
//                         'Save Changes'
//                       )}
//                     </button>
//                   </div>
//                 )}
//               </motion.div>
//             )}

//             {/* Tickets Tab Content */}
//             {activeTab === 'tickets' && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="space-y-6"
//               >
//                 {/* Loading State */}
//                 {ordersLoading && (
//                   <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
//                     <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//                     <p className="text-gray-600 dark:text-gray-300">Loading your tickets...</p>
//                   </div>
//                 )}

//                 {/* Orders Grid */}
//                 {!ordersLoading && userOrders.length > 0 && (
//                   <div className="grid grid-cols-1 gap-6">
//                     {userOrders.map((order) => (
//                       <div key={order._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
//                         {/* Order Header */}
//                         <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white">
//                           <div className="flex justify-between items-center">
//                             <div>
//                               <h3 className="text-xl font-bold">Order #{order.orderNumber}</h3>
//                               <p className="text-gray-300 text-sm">
//                                 {new Date(order.createdAt!).toLocaleDateString()} • {order.items.length} item(s)
//                               </p>
//                             </div>
//                             <div className="text-right">
//                               <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
//                                 <p className="text-2xl font-bold text-emerald-400">
//                                   {order.totalAmount.toFixed(2)} Br
//                                 </p>
//                                 <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
//                                   {order.status.toUpperCase()}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                         </div>

//                         {/* Order Details */}
//                         <div className="p-6">
//                           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//                             <div>
//                               <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Customer</h4>
//                               <p className="text-gray-600 dark:text-gray-300">{order.customerInfo.fullName}</p>
//                               <p className="text-sm text-gray-500 dark:text-gray-400">{order.customerInfo.phone}</p>
//                             </div>
//                             <div>
//                               <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Status</h4>
//                               <div className="flex items-center gap-2">
//                                 {order.status === 'confirmed' && <BadgeCheck className="w-5 h-5 text-green-500" />}
//                                 {order.status === 'pending' && <Clock className="w-5 h-5 text-amber-500" />}
//                                 {order.status === 'cancelled' && <XCircle className="w-5 h-5 text-red-500" />}
//                                 <span className="capitalize">{order.status}</span>
//                               </div>
//                               {order.paymentProof?.verifiedAt && (
//                                 <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//                                   Verified on {new Date(order.paymentProof.verifiedAt).toLocaleDateString()}
//                                 </p>
//                               )}
//                             </div>
//                             <div>
//                               <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Actions</h4>
//                               <div className="flex gap-2">
//                                 <button
//                                   onClick={() => {
//                                     // Open order details in new tab or modal
//                                     router.push(`/orders/${order.orderNumber}`)
//                                   }}
//                                   className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
//                                 >
//                                   View Details
//                                 </button>
//                                 {order.status === 'confirmed' && (
//                                   <button
//                                     onClick={() => onDownloadTicket(order)}
//                                     className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
//                                   >
//                                     <Printer className="w-4 h-4" />
//                                     Download
//                                   </button>
//                                 )}
//                               </div>
//                             </div>
//                           </div>

//                           {/* Items Preview */}
//                           <div>
//                             <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Items</h4>
//                             <div className="flex gap-3 overflow-x-auto pb-2">
//                               {order.items.slice(0, 3).map((item, index) => (
//                                 <div key={index} className="flex-shrink-0 w-20 text-center">
//                                   <img
//                                     src={item.image}
//                                     alt={item.name}
//                                     className="w-16 h-16 rounded-lg object-cover mx-auto border border-gray-300 dark:border-gray-600"
//                                   />
//                                   <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 truncate">
//                                     {item.name}
//                                   </p>
//                                   <p className="text-xs font-medium text-gray-900 dark:text-white">
//                                     Qty: {item.quantity}
//                                   </p>
//                                 </div>
//                               ))}
//                               {order.items.length > 3 && (
//                                 <div className="flex-shrink-0 w-20 text-center flex items-center justify-center">
//                                   <div className="bg-gray-100 dark:bg-gray-700 rounded-lg w-16 h-16 flex items-center justify-center">
//                                     <span className="text-lg font-bold text-gray-600 dark:text-gray-300">
//                                       +{order.items.length - 3}
//                                     </span>
//                                   </div>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {/* Empty State */}
//                 {!ordersLoading && userOrders.length === 0 && (
//                   <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
//                     <Ticket className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
//                     <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Tickets Yet</h3>
//                     <p className="text-gray-600 dark:text-gray-300 mb-6">
//                       You haven't placed any orders yet. Start shopping to see your tickets here!
//                     </p>
//                     <button
//                       onClick={() => router.push('/products')}
//                       className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl font-semibold hover:from-yellow-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl"
//                     >
//                       Start Shopping
//                     </button>
//                   </div>
//                 )}
//               </motion.div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  User, Mail, Phone, Store, MapPin, CreditCard, 
  Save, Edit3, Shield, Calendar, LogOut, 
  Settings, Home, BadgeCheck, UserCog,
  Clock, XCircle, Ticket, Printer, Download, FileText, ImageIcon
} from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  storeName: string
  address: string
  paymentMethod: string
  role: string
  status: string
  createdAt: string
  updatedAt: string
}

interface OrderTicket {
  id: string
  _id?: string
  orderNumber: string
  customerInfo: {
    fullName: string
    phone: string
    email: string
    address: string
  }
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
    image: string
  }>
  totalAmount: number
  paymentMethod: string
  bankDetails?: any
  timestamp: string
  createdAt?: string
  updatedAt?: string
  status: string
  paymentProof?: {
    imageUrl: string
    uploadedAt: string
    verified?: boolean
    verifiedBy?: string
    verifiedAt?: string
  }
  adminVerified?: boolean
  adminVerifiedAt?: string
  adminNotes?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    storeName: '',
    address: '',
    paymentMethod: ''
  })
  
  // New state for tickets section
  const [userOrders, setUserOrders] = useState<OrderTicket[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('profile') // 'profile' or 'tickets'
  const [downloadingOrder, setDownloadingOrder] = useState<string | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      
      if (response.status === 401) {
        router.push('/signin')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }

      const data = await response.json()
      
      if (data.success) {
        setUser(data.user)
        setFormData({
          name: data.user.name,
          phone: data.user.phone || '',
          storeName: data.user.storeName || '',
          address: data.user.address || '',
          paymentMethod: data.user.paymentMethod || ''
        })
      }
    } catch (error) {
      console.error('Profile fetch error:', error)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  // Fetch user orders
  const fetchUserOrders = async () => {
    try {
      setOrdersLoading(true)
      const response = await fetch('/api/user/orders')
      
      if (response.ok) {
        const data = await response.json()
        
        const transformedOrders: OrderTicket[] = data.orders.map((order: any) => ({
          id: order._id,
          _id: order._id,
          orderNumber: order.orderNumber,
          customerInfo: order.customerInfo,
          items: order.items || [],
          totalAmount: order.totalAmount,
          paymentMethod: order.paymentMethod || '',
          bankDetails: order.bankDetails,
          timestamp: order.createdAt,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          status: order.status,
          paymentProof: order.paymentProof,
          adminVerified: order.paymentProof?.verified || false,
          adminVerifiedAt: order.paymentProof?.verifiedAt,
          adminNotes: order.adminNotes
        }))
        
        setUserOrders(transformedOrders)
      } else {
        toast.error('Failed to load your orders')
      }
    } catch (error) {
      console.error('Error fetching user orders:', error)
      toast.error('Error loading your orders')
    } finally {
      setOrdersLoading(false)
    }
  }

  // Load orders when tickets tab is active
  useEffect(() => {
    if (activeTab === 'tickets') {
      fetchUserOrders()
    }
  }, [activeTab])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
      setUser(null)
      localStorage.removeItem('user-auth')
      toast.info('Logged out successfully')
      setTimeout(() => {
        window.location.href = '/'
      }, 1500)
    } catch (err) {
      console.error('Logout failed', err)
      toast.error('Logout failed')
    }
  }

  const handleSave = async () => {
    setSaving(true)
    
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setUser(data.user)
        setEditing(false)
        toast.success('Profile updated successfully!')
      } else {
        toast.error(data.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4 text-purple-500" />
      case 'seller': return <Store className="w-4 h-4 text-green-500" />
      default: return <User className="w-4 h-4 text-blue-500" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
      case 'seller': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    }
  }

  const getSettingsPath = () => {
    switch (user?.role) {
      case 'seller': return '/seller/settings'
      case 'admin': return '/admin/settings'
      default: return '/settings'
    }
  }

  // DOWNLOAD AS TEXT FILE
  const downloadAsText = async (order: OrderTicket) => {
    try {
      setDownloadingOrder(order._id!)
      
      const receiptContent = `
YAFRICAN STORE
OFFICIAL RECEIPT
==========================================
Order: ${order.orderNumber}
Date:  ${new Date(order.createdAt!).toLocaleDateString()}
Time:  ${new Date(order.createdAt!).toLocaleTimeString()}

CUSTOMER INFORMATION
------------------------------------------
Name:  ${order.customerInfo.fullName}
Phone: ${order.customerInfo.phone}
Email: ${order.customerInfo.email}
Addr:  ${order.customerInfo.address}

ORDER ITEMS
------------------------------------------
${order.items.map(item => {
  return `${item.quantity} x ${item.name} - ${item.price.toFixed(2)} Br = ${(item.price * item.quantity).toFixed(2)} Br`
}).join('\n')}

------------------------------------------
SUBTOTAL: ${order.totalAmount.toFixed(2)} Br
TOTAL:    ${order.totalAmount.toFixed(2)} Br

PAYMENT INFORMATION
------------------------------------------
Method:  ${order.paymentMethod.toUpperCase().replace(/_/g, ' ')}
Status:  ${order.status.toUpperCase()}
Verified: ${order.paymentProof?.verified ? 'YES' : 'PENDING'}
${order.paymentProof?.verifiedAt ? `Verified On: ${new Date(order.paymentProof.verifiedAt).toLocaleDateString()}` : ''}
${order.paymentProof?.verifiedBy ? `Verified By: ${order.paymentProof.verifiedBy}` : ''}

THANK YOU FOR YOUR PURCHASE!
This is your official receipt.
Present this receipt for order pickup/delivery.

Generated: ${new Date().toLocaleString()}
==========================================
      `.trim()

      const blob = new Blob([receiptContent], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `receipt-${order.orderNumber}.txt`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      
      toast.success('Text receipt downloaded!')
    } catch (error) {
      console.error('Text download error:', error)
      toast.error('Error downloading text receipt')
    } finally {
      setDownloadingOrder(null)
    }
  }

  // DOWNLOAD AS IMAGE
  const downloadAsImage = async (order: OrderTicket) => {
    try {
      setDownloadingOrder(order._id!)
      
      // Create a canvas element
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      
      // Set canvas size
      canvas.width = 600
      canvas.height = 800
      
      // Background
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Styles
      const titleFont = 'bold 24px Arial'
      const headerFont = 'bold 18px Arial'
      const normalFont = '16px Arial'
      const smallFont = '14px Arial'
      
      let yPosition = 50
      
      // Title
      ctx.fillStyle = '#000000'
      ctx.font = titleFont
      ctx.textAlign = 'center'
      ctx.fillText('YAFRICAN STORE', canvas.width / 2, yPosition)
      yPosition += 30
      ctx.fillText('OFFICIAL RECEIPT', canvas.width / 2, yPosition)
      yPosition += 50
      
      // Order Info
      ctx.textAlign = 'left'
      ctx.font = normalFont
      ctx.fillText(`Order: ${order.orderNumber}`, 50, yPosition)
      yPosition += 25
      ctx.fillText(`Date: ${new Date(order.createdAt!).toLocaleDateString()}`, 50, yPosition)
      yPosition += 25
      ctx.fillText(`Time: ${new Date(order.createdAt!).toLocaleTimeString()}`, 50, yPosition)
      yPosition += 40
      
      // Customer Info
      ctx.font = headerFont
      ctx.fillText('CUSTOMER INFORMATION', 50, yPosition)
      yPosition += 30
      ctx.font = normalFont
      ctx.fillText(`Name: ${order.customerInfo.fullName}`, 50, yPosition)
      yPosition += 25
      ctx.fillText(`Phone: ${order.customerInfo.phone}`, 50, yPosition)
      yPosition += 25
      ctx.fillText(`Email: ${order.customerInfo.email}`, 50, yPosition)
      yPosition += 25
      ctx.fillText(`Address: ${order.customerInfo.address}`, 50, yPosition)
      yPosition += 40
      
      // Items Header
      ctx.font = headerFont
      ctx.fillText('ORDER ITEMS', 50, yPosition)
      yPosition += 30
      
      // Items
      ctx.font = normalFont
      order.items.forEach(item => {
        const itemText = `${item.quantity} x ${item.name}`
        const priceText = `${(item.price * item.quantity).toFixed(2)} Br`
        ctx.fillText(itemText, 50, yPosition)
        ctx.fillText(priceText, canvas.width - 100, yPosition)
        yPosition += 25
      })
      
      yPosition += 20
      
      // Total
      ctx.font = headerFont
      ctx.fillText('SUBTOTAL:', 50, yPosition)
      ctx.fillText(`${order.totalAmount.toFixed(2)} Br`, canvas.width - 100, yPosition)
      yPosition += 25
      ctx.fillText('TOTAL:', 50, yPosition)
      ctx.fillText(`${order.totalAmount.toFixed(2)} Br`, canvas.width - 100, yPosition)
      yPosition += 40
      
      // Payment Info
      ctx.font = headerFont
      ctx.fillText('PAYMENT INFORMATION', 50, yPosition)
      yPosition += 30
      ctx.font = normalFont
      ctx.fillText(`Method: ${order.paymentMethod.toUpperCase().replace(/_/g, ' ')}`, 50, yPosition)
      yPosition += 25
      ctx.fillText(`Status: ${order.status.toUpperCase()}`, 50, yPosition)
      yPosition += 25
      ctx.fillText(`Verified: ${order.paymentProof?.verified ? 'YES' : 'PENDING'}`, 50, yPosition)
      yPosition += 40
      
      // Footer
      ctx.font = smallFont
      ctx.textAlign = 'center'
      ctx.fillText('THANK YOU FOR YOUR PURCHASE!', canvas.width / 2, yPosition)
      yPosition += 20
      ctx.fillText('This is your official receipt.', canvas.width / 2, yPosition)
      yPosition += 20
      ctx.fillText('Present this receipt for order pickup/delivery.', canvas.width / 2, yPosition)
      yPosition += 20
      ctx.fillText(`Generated: ${new Date().toLocaleString()}`, canvas.width / 2, yPosition)
      
      // Convert to image and download
      const image = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `receipt-${order.orderNumber}.png`
      link.href = image
      link.click()
      
      toast.success('Image receipt downloaded!')
    } catch (error) {
      console.error('Image download error:', error)
      toast.error('Error downloading image receipt')
    } finally {
      setDownloadingOrder(null)
    }
  }

  // DOWNLOAD AS PDF (using browser print)
  const downloadAsPDF = async (order: OrderTicket) => {
    try {
      setDownloadingOrder(order._id!)
      
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        toast.error('Please allow popups to generate PDF')
        return
      }
      
      const receiptHTML = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Receipt ${order.orderNumber}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 40px; 
                line-height: 1.6;
                color: #333;
              }
              .header { 
                text-align: center; 
                margin-bottom: 30px;
                border-bottom: 2px solid #333;
                padding-bottom: 20px;
              }
              .section { 
                margin: 25px 0; 
              }
              .section-title { 
                font-weight: bold; 
                font-size: 18px;
                margin-bottom: 15px;
                border-bottom: 1px solid #ccc;
                padding-bottom: 5px;
              }
              .item-row { 
                display: flex; 
                justify-content: space-between; 
                margin: 8px 0;
              }
              .total-row { 
                font-weight: bold; 
                border-top: 1px solid #333;
                padding-top: 10px;
                margin-top: 10px;
              }
              .footer { 
                text-align: center; 
                margin-top: 40px;
                font-size: 14px;
                color: #666;
              }
              @media print {
                body { margin: 20px; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>YAFRICAN STORE</h1>
              <h2>OFFICIAL RECEIPT</h2>
            </div>
            
            <div class="section">
              <div class="item-row">
                <span><strong>Order:</strong> ${order.orderNumber}</span>
                <span><strong>Date:</strong> ${new Date(order.createdAt!).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">CUSTOMER INFORMATION</div>
              <div class="item-row"><span><strong>Name:</strong> ${order.customerInfo.fullName}</span></div>
              <div class="item-row"><span><strong>Phone:</strong> ${order.customerInfo.phone}</span></div>
              <div class="item-row"><span><strong>Email:</strong> ${order.customerInfo.email}</span></div>
              <div class="item-row"><span><strong>Address:</strong> ${order.customerInfo.address}</span></div>
            </div>
            
            <div class="section">
              <div class="section-title">ORDER ITEMS</div>
              ${order.items.map(item => `
                <div class="item-row">
                  <span>${item.quantity} x ${item.name}</span>
                  <span>${(item.price * item.quantity).toFixed(2)} Br</span>
                </div>
              `).join('')}
              <div class="item-row total-row">
                <span>SUBTOTAL:</span>
                <span>${order.totalAmount.toFixed(2)} Br</span>
              </div>
              <div class="item-row total-row">
                <span>TOTAL:</span>
                <span>${order.totalAmount.toFixed(2)} Br</span>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">PAYMENT INFORMATION</div>
              <div class="item-row"><span><strong>Method:</strong> ${order.paymentMethod.toUpperCase().replace(/_/g, ' ')}</span></div>
              <div class="item-row"><span><strong>Status:</strong> ${order.status.toUpperCase()}</span></div>
              <div class="item-row"><span><strong>Verified:</strong> ${order.paymentProof?.verified ? 'YES' : 'PENDING'}</span></div>
              ${order.paymentProof?.verifiedAt ? `<div class="item-row"><span><strong>Verified On:</strong> ${new Date(order.paymentProof.verifiedAt).toLocaleDateString()}</span></div>` : ''}
              ${order.paymentProof?.verifiedBy ? `<div class="item-row"><span><strong>Verified By:</strong> ${order.paymentProof.verifiedBy}</span></div>` : ''}
            </div>
            
            <div class="footer">
              <p>THANK YOU FOR YOUR PURCHASE!</p>
              <p>This is your official receipt. Present this receipt for order pickup/delivery.</p>
              <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <script>
              window.onload = function() {
                window.print();
                setTimeout(() => window.close(), 1000);
              }
            </script>
          </body>
        </html>
      `
      
      printWindow.document.write(receiptHTML)
      printWindow.document.close()
      
      toast.success('PDF receipt generated! Check your print dialog.')
    } catch (error) {
      console.error('PDF download error:', error)
      toast.error('Error generating PDF receipt')
    } finally {
      setDownloadingOrder(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'pending': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 dark:text-gray-300 text-lg">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <User className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Profile Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Please log in to view your profile.</p>
          <button
            onClick={() => router.push('/signin')}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl font-semibold hover:from-yellow-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <ToastContainer position="top-right" theme="colored" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Account Profile
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Manage your personal information and account settings
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRoleColor(user.role)}`}>
                {user.role.toUpperCase()}
              </span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6"
            >
              {/* User Card */}
              <div className="text-center mb-6">
                <div className="relative inline-block mb-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5 border-2 border-white dark:border-gray-800">
                    <BadgeCheck className="w-3 h-3 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{user.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">{user.email}</p>
                <div className="flex items-center justify-center gap-2">
                  {getRoleIcon(user.role)}
                  <span className="text-sm font-medium capitalize text-gray-600 dark:text-gray-300">
                    {user.role}
                  </span>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-2 mb-6">
                <button
                  onClick={() => router.push(getSettingsPath())}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Settings</span>
                </button>
              </nav>

              {/* Quick Actions */}
              <div className="border-t border-gray-200 dark:border-gray-600 pt-4 space-y-2">
                {user.role === 'seller' && (
                  <button
                    onClick={() => router.push('/seller/dashboard')}
                    className="w-full flex items-center gap-3 px-3 py-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                  >
                    <Store className="w-4 h-4" />
                    <span className="text-sm font-medium">Seller Dashboard</span>
                  </button>
                )}
                {user.role === 'admin' && (
                  <button
                    onClick={() => router.push('/admin/dashboard')}
                    className="w-full flex items-center gap-3 px-3 py-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    <span className="text-sm font-medium">Admin Dashboard</span>
                  </button>
                )}
                <button
                  onClick={() => router.push('/')}
                  className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span className="text-sm font-medium">Back to Home</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Log Out</span>
                </button>
              </div>
            </motion.div>

            {/* Account Status Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 mt-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <UserCog className="w-5 h-5 text-yellow-500" />
                Account Overview
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Status</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {user.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Member since</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Last updated</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content - Profile Information & Tickets */}
          <div className="lg:col-span-3">
            {/* Tabs Navigation */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 mb-6"
            >
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex-1 py-3 px-4 text-center rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === 'profile'
                      ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <User className="w-5 h-5 inline-block mr-2" />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('tickets')}
                  className={`flex-1 py-3 px-4 text-center rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === 'tickets'
                      ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Ticket className="w-5 h-5 inline-block mr-2" />
                  My Tickets ({userOrders.length})
                </button>
              </div>
            </motion.div>

            {/* Profile Tab Content */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8"
              >
                {/* ... (Your existing profile form content remains exactly the same) ... */}
                <div className="flex items-center justify-between mb-12">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Personal Information</h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                      Update your personal details and contact information
                    </p>
                  </div>
                  <button
                    onClick={() => setEditing(!editing)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      editing
                        ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        : 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white hover:from-yellow-600 hover:to-amber-600 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    <Edit3 className="w-4 h-4" />
                    {editing ? 'Cancel Editing' : 'Edit Profile'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <User className="w-4 h-4" />
                      Full Name
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border border-transparent">
                        {user.name}
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </label>
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border border-transparent">
                      {user.email}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Email address cannot be changed
                    </p>
                  </div>

                  {/* Phone */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </label>
                    {editing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300"
                        placeholder="+251 XXX XXX XXX"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border border-transparent">
                        {user.phone || 'Not provided'}
                      </div>
                    )}
                  </div>

                  {/* Store Name */}
                  {user.role === 'seller' && (
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <Store className="w-4 h-4" />
                        Store Name
                      </label>
                      {editing ? (
                        <input
                          type="text"
                          name="storeName"
                          value={formData.storeName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300"
                          placeholder="Enter your store name"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border border-transparent">
                          {user.storeName || 'Not provided'}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Address */}
                  <div className="md:col-span-2 space-y-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <MapPin className="w-4 h-4" />
                      Address
                    </label>
                    {editing ? (
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300 resize-none"
                        placeholder="Enter your complete address"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border border-transparent whitespace-pre-wrap">
                        {user.address || 'Not provided'}
                      </div>
                    )}
                  </div>

                  {/* Payment Method */}
                  <div className="md:col-span-2 space-y-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <CreditCard className="w-4 h-4" />
                      Preferred Payment Method
                    </label>
                    {editing ? (
                      <select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300"
                      >
                        <option value="">Select payment method</option>
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="mobile_money">Mobile Money</option>
                        <option value="cash">Cash on Delivery</option>
                        <option value="credit_card">Credit Card</option>
                      </select>
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border border-transparent capitalize">
                        {user.paymentMethod ? user.paymentMethod.replace(/_/g, ' ') : 'Not specified'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Save Button */}
                {editing && (
                  <div className="flex justify-end pt-6 mt-6 border-t border-gray-200 dark:border-gray-600">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl font-semibold hover:from-yellow-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <Save className="w-5 h-5" />
                      {saving ? (
                        <span className="flex items-center gap-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          />
                          Saving...
                        </span>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Tickets Tab Content */}
            {activeTab === 'tickets' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Loading State */}
                {ordersLoading && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
                    <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300">Loading your tickets...</p>
                  </div>
                )}

                {/* Orders Grid */}
                {!ordersLoading && userOrders.length > 0 && (
                  <div className="grid grid-cols-1 gap-6">
                    {userOrders.map((order) => (
                      <div key={order._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {/* Order Header */}
                        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="text-xl font-bold">Order #{order.orderNumber}</h3>
                              <p className="text-gray-300 text-sm">
                                {new Date(order.createdAt!).toLocaleDateString()} • {order.items.length} item(s)
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                                <p className="text-2xl font-bold text-emerald-400">
                                  {order.totalAmount.toFixed(2)} Br
                                </p>
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                  {order.status.toUpperCase()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Order Details */}
                        <div className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Customer</h4>
                              <p className="text-gray-600 dark:text-gray-300">{order.customerInfo.fullName}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{order.customerInfo.phone}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Status</h4>
                              <div className="flex items-center gap-2">
                                {order.status === 'confirmed' && <BadgeCheck className="w-5 h-5 text-green-500" />}
                                {order.status === 'pending' && <Clock className="w-5 h-5 text-amber-500" />}
                                {order.status === 'cancelled' && <XCircle className="w-5 h-5 text-red-500" />}
                                <span className="capitalize">{order.status}</span>
                              </div>
                              {order.paymentProof?.verifiedAt && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                  Verified on {new Date(order.paymentProof.verifiedAt).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Download Receipt</h4>
                              <div className="flex flex-col gap-2">
                                {order.status === 'confirmed' ? (
                                  <>
                                    {/* <button
                                      onClick={() => downloadAsText(order)}
                                      disabled={downloadingOrder === order._id}
                                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                      <FileText className="w-4 h-4" />
                                      {downloadingOrder === order._id ? 'Downloading...' : 'Text'}
                                    </button> */}
                                    <button
                                      onClick={() => downloadAsImage(order)}
                                      disabled={downloadingOrder === order._id}
                                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                      <ImageIcon className="w-4 h-4" />
                                      {downloadingOrder === order._id ? 'Downloading...' : 'Image'}
                                    </button>
                                    <button
                                      onClick={() => downloadAsPDF(order)}
                                      disabled={downloadingOrder === order._id}
                                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                      <Download className="w-4 h-4" />
                                      {downloadingOrder === order._id ? 'Generating...' : 'PDF'}
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    disabled
                                    className="w-full bg-gray-400 text-white py-2 px-4 rounded-lg text-sm font-medium cursor-not-allowed flex items-center justify-center gap-2"
                                  >
                                    <Clock className="w-4 h-4" />
                                    Awaiting Verification
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Items Preview */}
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Items</h4>
                            <div className="flex gap-3 overflow-x-auto pb-2">
                              {order.items.slice(0, 3).map((item, index) => (
                                <div key={index} className="flex-shrink-0 w-20 text-center mb-3">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-16 h-16 rounded-lg object-cover mx-auto border border-gray-300 dark:border-gray-600"
                                  />
                                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 truncate">
                                    {item.name}
                                  </p>
                                  <p className="text-xs font-medium text-gray-900 dark:text-white">
                                    Qty: {item.quantity}
                                  </p>
                                </div>
                              ))}
                              {order.items.length > 3 && (
                                <div className="flex-shrink-0 w-20 text-center flex items-center justify-center">
                                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg w-16 h-16 flex items-center justify-center">
                                    <span className="text-lg font-bold text-gray-600 dark:text-gray-300">
                                      +{order.items.length - 3}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Empty State */}
                {!ordersLoading && userOrders.length === 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                    <Ticket className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Tickets Yet</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      You haven't placed any orders yet. Start shopping to see your tickets here!
                    </p>
                    <button
                      onClick={() => router.push('/products')}
                      className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl font-semibold hover:from-yellow-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Start Shopping
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}