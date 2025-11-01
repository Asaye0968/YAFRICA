'use client'

import { useEffect, useState } from 'react'
import { Receipt } from '@/types/receipt'

import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import AdminApprovalPanel from '@/components/AdminApprovalPanel' // Import your payment approval component

import {
  Users, Package, ShoppingBag, BarChart, Settings, LogOut,
  CheckCircle, XCircle, Eye, Edit, Trash2, TrendingUp,
  DollarSign, ShoppingCart, UserCheck, AlertCircle,
  Home, ChevronRight, Search, Filter, Download, Plus,
  Mail, Phone,
  EyeOff,
  CreditCard
} from 'lucide-react'

// =========================
// Types
// =========================
interface Product {
  _id: string
  name: string
  price: number
  category: string
  status: 'pending' | 'approved' | 'rejected'
  inStock: boolean
  images: string[]
  description: string
  sellerId: {
    _id: string
    storeName: string
    email: string
    phone: string
  }
  createdAt: string
  updatedAt: string
}

interface User {
  _id: string
  name: string
  email: string
  role: 'admin' | 'seller' | 'customer'
  status: 'active' | 'suspended'
  createdAt: string
  storeName?: string
  totalProducts?: number
  phone?: string
}

interface DashboardStats {
  totalUsers: number
  totalSellers: number
  totalProducts: number
  pendingApprovals: number
  totalRevenue: number
  monthlySales: number
}

// =========================
// Professional Sidebar Component
// =========================
// =========================
// Professional Sidebar Component (Responsive)
// =========================
function AdminSidebar({ 
  activeSection, 
  setActiveSection,
  onLogout 
}: {
  activeSection: string
  setActiveSection: (section: string) => void
  onLogout: () => void
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <Home className="w-5 h-5" /> },
    { id: 'products', label: 'Product Management', icon: <Package className="w-5 h-5" /> },
    { id: 'sellers', label: 'Seller Management', icon: <Users className="w-5 h-5" /> },
    { id: 'users', label: 'User Management', icon: <UserCheck className="w-5 h-5" /> },
        { id: 'payments', label: 'Payment Approval', icon: <CreditCard className="w-5 h-5" /> }, // Added Payment Approval

    { id: 'analytics', label: 'Analytics', icon: <BarChart className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ]

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('admin-sidebar')
      const mobileMenuButton = document.getElementById('mobile-menu-button')
      
      if (isMobileOpen && 
          sidebar && 
          !sidebar.contains(event.target as Node) &&
          mobileMenuButton &&
          !mobileMenuButton.contains(event.target as Node)) {
        setIsMobileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMobileOpen])

  // Close mobile sidebar when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        id="mobile-menu-button"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg shadow-lg"
      >
        {isMobileOpen ? <XCircle className="w-6 h-6" /> : <Home className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        id="admin-sidebar"
        initial={{ x: -300 }}
        animate={{ 
          x: isMobileOpen ? 0 : (window.innerWidth < 768 ? -300 : 0)
        }}
        className={`bg-gray-900 text-white h-screen sticky top-0 flex flex-col z-40
          ${collapsed ? 'w-16 md:w-20' : 'w-64 md:w-80'} 
          ${isMobileOpen ? 'fixed inset-y-0 left-0' : 'hidden md:flex'}
          transition-all duration-300 shadow-xl`}
      >
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-white text-sm md:text-lg">AdminPro</h1>
                  <p className="text-gray-400 text-xs md:text-sm">Dashboard</p>
                </div>
              </motion.div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 md:p-2 hover:bg-gray-800 rounded-lg transition-colors hidden md:block"
            >
              <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
            </button>
            {/* Mobile close button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-1 md:p-2 hover:bg-gray-800 rounded-lg transition-colors md:hidden"
            >
              <XCircle className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 md:p-4 space-y-1 md:space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id)
                if (window.innerWidth < 768) {
                  setIsMobileOpen(false)
                }
              }}
              className={`w-full flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg md:rounded-xl transition-all duration-200 ${
                activeSection === item.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <div className={`p-1 md:p-2 rounded-md md:rounded-lg ${
                activeSection === item.id ? 'bg-blue-500' : 'bg-gray-700'
              }`}>
                {item.icon}
              </div>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-medium text-xs md:text-sm whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-2 md:p-4 border-t border-gray-700">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-2 md:gap-3 p-2 md:p-3 text-red-400 hover:bg-red-900 hover:text-red-300 rounded-lg md:rounded-xl transition-colors text-xs md:text-sm"
          >
            <LogOut className="w-4 h-4 md:w-5 md:h-5" />
            {!collapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </motion.div>
    </>
  )
}
// =========================
// Stats Cards Component
// =========================
function StatsCards({ stats }: { stats: DashboardStats }) {
  const statItems = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      change: '+12%',
      trend: 'up',
      icon: <Users className="w-6 h-6" />,
      color: 'blue'
    },
    {
      label: 'Total Sellers',
      value: stats.totalSellers,
      change: '+8%',
      trend: 'up',
      icon: <UserCheck className="w-6 h-6" />,
      color: 'green'
    },
    {
      label: 'Pending Approvals',
      value: stats.pendingApprovals,
      change: '+5',
      trend: 'up',
      icon: <AlertCircle className="w-6 h-6" />,
      color: 'amber'
    },
    {
      label: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: '+23%',
      trend: 'up',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'purple'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      amber: 'from-amber-500 to-amber-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {statItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${getColorClasses(item.color)} text-white shadow-lg`}>
              {item.icon}
            </div>
            <span className={`text-sm font-semibold ${
              item.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {item.change}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{item.value}</h3>
          <p className="text-gray-600 text-sm font-medium">{item.label}</p>
        </motion.div>
      ))}
    </div>
  )
}

// =========================
// Product Management Table Component (Fully Responsive)
// =========================
function ProductManagementTable({ 
  products, 
  onApprove, 
  onReject,
  onDelete,
  onView 
}: { 
  products: Product[]
  onApprove: (productId: string) => void
  onReject: (productId: string) => void
  onDelete: (productId: string) => void
  onView: (product: Product) => void
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredProducts = products.filter(product => {
    if (!product) return false
    
    const productName = product.name || ''
    const storeName = product.sellerId?.storeName || ''
    
    const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         storeName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string | undefined) => {
    const safeStatus = status || 'pending'
    const statusConfig = {
      pending: { color: 'bg-amber-100 text-amber-800 border-amber-200', icon: <AlertCircle className="w-3 h-3" /> },
      approved: { color: 'bg-green-100 text-green-800 border-green-200', icon: <CheckCircle className="w-3 h-3" /> },
      rejected: { color: 'bg-red-100 text-red-800 border-red-200', icon: <XCircle className="w-3 h-3" /> }
    }
    
    const config = statusConfig[safeStatus as keyof typeof statusConfig] || statusConfig.pending
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.icon}
        <span className="hidden xs:inline">{safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)}</span>
        <span className="xs:hidden">{safeStatus.charAt(0).toUpperCase()}</span>
      </span>
    )
  }

  const handleBulkDeleteRejected = () => {
    const rejectedProducts = filteredProducts.filter(p => p.status === 'rejected')
    if (rejectedProducts.length > 0) {
      if (confirm(`Are you sure you want to permanently delete all ${rejectedProducts.length} rejected products? This action cannot be undone.`)) {
        rejectedProducts.forEach(product => {
          onDelete(product._id)
        })
      }
    } else {
      alert('No rejected products found to delete.')
    }
  }

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200">
      {/* Table Header - Fully Responsive */}
      <div className="p-3 sm:p-4 md:p-6 border-b border-gray-200">
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Title Section */}
          <div className="text-center sm:text-left">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">Product Management</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Review and manage all products on the platform</p>
          </div>
          
          {/* Controls Section */}
          <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 w-full">
            {/* Search Input */}
            <div className="relative flex-1 min-w-0">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products or sellers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 sm:pl-10 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
              />
            </div>
            
            {/* Filter and Action Buttons */}
            <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 flex-wrap">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white min-w-[120px] flex-1 xs:flex-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              
              {/* Clean Rejected Button */}
              <button
                onClick={handleBulkDeleteRejected}
                className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium flex-1 xs:flex-none justify-center"
              >
                <Trash2 className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">Clean Rejected</span>
                <span className="sm:hidden">Clean</span>
              </button>
              
              {/* Export Button - Hidden on smallest screens */}
              <button className="hidden xs:flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Content - Make table responsive */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <span className="hidden xs:inline">Product</span>
                <span className="xs:hidden">Item</span>
              </th>
              <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                Seller
              </th>
              <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Submitted
              </th>
              <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-3 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img 
                      src={product.images?.[0] || '/api/placeholder/40/40'} 
                      alt={product.name || 'Product image'}
                      className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg object-cover border flex-shrink-0"
                    />
                    <div className="ml-2 sm:ml-3 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-[100px] xs:max-w-[140px] sm:max-w-none">
                        {product.name || 'Unnamed Product'}
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-[100px] xs:max-w-[140px] sm:max-w-none">
                        {product.category || 'Uncategorized'}
                      </div>
                      <div className="text-xs text-gray-400 sm:hidden mt-1">
                        {product.sellerId?.storeName || 'N/A'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-3 sm:px-4 md:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                  <div className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                    {product.sellerId?.storeName || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-500 truncate max-w-[120px]">
                    {product.sellerId?.email || 'N/A'}
                  </div>
                </td>
                <td className="px-3 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">${product.price || 0}</div>
                </td>
                <td className="px-3 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(product.status)}
                </td>
                <td className="px-3 sm:px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                  {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'Unknown date'}
                </td>
                <td className="px-3 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <button
                      onClick={() => onView(product)}
                      className="p-1 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    {(product.status === 'pending' || !product.status) && (
                      <>
                        <button
                          onClick={() => onApprove(product._id)}
                          className="p-1 sm:p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Approve Product"
                        >
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => onReject(product._id)}
                          className="p-1 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Reject Product"
                        >
                          <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => onDelete(product._id)}
                      className="p-1 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Product Permanently"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">No products found</h3>
          <p className="text-gray-500 text-sm">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Summary - Responsive */}
      <div className="px-3 sm:px-4 md:px-6 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 text-xs text-gray-600">
          <span>Showing {filteredProducts.length} of {products.length} products</span>
          <div className="flex gap-2 sm:gap-4 flex-wrap">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              Pending: {products.filter(p => p.status === 'pending').length}
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Approved: {products.filter(p => p.status === 'approved').length}
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Rejected: {products.filter(p => p.status === 'rejected').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
// =========================
// User Management Table Component
// =========================
// =========================
// =========================
// User Management Table Component (Fully Responsive)
// =========================
function UserManagementTable({ 
  users, 
  onSuspend, 
  onActivate,
  onDelete 
}: { 
  users: User[]
  onSuspend: (userId: string) => void
  onActivate: (userId: string) => void
  onDelete: (userId: string) => void
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  const filteredUsers = users.filter(user => {
    if (!user) return false
    
    const userName = user.name || 'Unknown User'
    const userEmail = user.email || 'No email'
    
    const matchesSearch = userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const getRoleBadge = (role: string | undefined) => {
    const safeRole = role || 'customer'
    const roleConfig = {
      admin: { color: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Admin' },
      seller: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Seller' },
      customer: { color: 'bg-gray-100 text-gray-800 border-gray-200', label: 'Customer' }
    }
    
    const config = roleConfig[safeRole as keyof typeof roleConfig] || roleConfig.customer
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const getStatusBadge = (status: string | undefined) => {
    const safeStatus = status || 'active'
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
        safeStatus === 'active' 
          ? 'bg-green-100 text-green-800 border-green-200' 
          : 'bg-red-100 text-red-800 border-red-200'
      }`}>
        {safeStatus === 'active' ? 'Active' : 'Suspended'}
      </span>
    )
  }

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200">
      {/* Table Header - Fully Responsive */}
      <div className="p-3 sm:p-4 md:p-6 border-b border-gray-200">
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Title Section */}
          <div className="text-center sm:text-left">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">User Management</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Manage all user accounts and access levels</p>
          </div>
          
          {/* Controls Section - Stack on mobile, row on larger screens */}
          <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 w-full">
            {/* Search Input */}
            <div className="relative flex-1 min-w-0">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 sm:pl-10 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
              />
            </div>
            
            {/* Filter and Action Buttons */}
            <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
              {/* Role Filter */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white min-w-[120px] flex-1 xs:flex-none"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="seller">Seller</option>
                <option value="customer">Customer</option>
              </select>
              
              {/* Export Button - Hidden on smallest screens */}
              <button className="hidden xs:flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto">
        {/* Desktop Table */}
        <table className="w-full hidden md:table">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Products</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {(user.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none">
                        {user.name || 'Unknown User'}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-[120px] sm:max-w-none">
                        {user.email || 'No email'}
                      </div>
                      {user.storeName && (
                        <div className="text-xs text-gray-400 truncate max-w-[120px] sm:max-w-none">
                          {user.storeName}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  {getRoleBadge(user.role)}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(user.status)}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 text-center">
                    {user.role === 'seller' ? (user.totalProducts || 0) : '-'}
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown date'}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                    {(user.status === 'active' || !user.status) ? (
                      <button
                        onClick={() => onSuspend(user._id)}
                        className="px-2 py-1 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors text-xs sm:text-sm font-medium"
                      >
                        Suspend
                      </button>
                    ) : (
                      <button
                        onClick={() => onActivate(user._id)}
                        className="px-2 py-1 text-green-600 hover:bg-green-50 rounded-lg transition-colors text-xs sm:text-sm font-medium"
                      >
                        Activate
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(user._id)}
                      className="p-1 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete User"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4 p-4">
          {filteredUsers.map((user) => (
            <div key={user._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {(user.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{user.name || 'Unknown User'}</div>
                    <div className="text-sm text-gray-500">{user.email || 'No email'}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {getRoleBadge(user.role)}
                  {getStatusBadge(user.status)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <span className="text-gray-500">Products:</span>
                  <div className="font-medium">
                    {user.role === 'seller' ? (user.totalProducts || 0) : '-'}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Joined:</span>
                  <div className="font-medium">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                {(user.status === 'active' || !user.status) ? (
                  <button
                    onClick={() => onSuspend(user._id)}
                    className="flex-1 px-3 py-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors text-sm font-medium border border-amber-200"
                  >
                    Suspend
                  </button>
                ) : (
                  <button
                    onClick={() => onActivate(user._id)}
                    className="flex-1 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors text-sm font-medium border border-green-200"
                  >
                    Activate
                  </button>
                )}
                <button
                  onClick={() => onDelete(user._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                  title="Delete User"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  )
}

// =========================
// Seller Management Table Component (Fully Responsive)
// =========================
function SellerManagementTable({ 
  sellers, 
  onSuspend, 
  onActivate,
  onDelete 
}: { 
  sellers: User[]
  onSuspend: (sellerId: string) => void
  onActivate: (sellerId: string) => void
  onDelete: (sellerId: string) => void
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredSellers = sellers.filter(seller => {
    if (!seller) return false
    
    const storeName = seller.storeName || ''
    const sellerName = seller.name || ''
    const sellerEmail = seller.email || ''
    
    const matchesSearch = storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sellerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || seller.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string | undefined) => {
    const safeStatus = status || 'active'
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
        safeStatus === 'active' 
          ? 'bg-green-100 text-green-800 border-green-200' 
          : 'bg-red-100 text-red-800 border-red-200'
      }`}>
        {safeStatus === 'active' ? 'Active' : 'Suspended'}
      </span>
    )
  }

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200">
      {/* Table Header - Fully Responsive */}
      <div className="p-3 sm:p-4 md:p-6 border-b border-gray-200">
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Title Section */}
          <div className="text-center sm:text-left">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">Seller Management</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Manage seller accounts and stores</p>
          </div>
          
          {/* Controls Section */}
          <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 w-full">
            {/* Search Input */}
            <div className="relative flex-1 min-w-0">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search sellers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 sm:pl-10 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
              />
            </div>
            
            {/* Filter and Action Buttons */}
            <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white min-w-[120px] flex-1 xs:flex-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
              
              {/* Export Button - Hidden on smallest screens */}
              <button className="hidden xs:flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto">
        {/* Desktop Table */}
        <table className="w-full min-w-[600px] hidden md:table">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Store</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Seller</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Products</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSellers.map((seller) => (
              <tr key={seller._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 max-w-[150px] truncate">
                    {seller.storeName || 'No Store Name'}
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{seller.name || 'Unknown'}</div>
                  <div className="text-sm text-gray-500 truncate max-w-[150px]">{seller.email}</div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 truncate max-w-[150px]">{seller.email}</div>
                  <div className="text-sm text-gray-500">{seller.phone || 'No phone'}</div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(seller.status)}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 text-center">
                    {seller.totalProducts || 0}
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                    <button
                      onClick={() => window.open(`mailto:${seller.email}`)}
                      className="p-1 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Email Seller"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                    {seller.phone && (
                      <button
                        onClick={() => window.open(`tel:${seller.phone}`)}
                        className="p-1 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Call Seller"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                    )}
                    {(seller.status === 'active' || !seller.status) ? (
                      <button
                        onClick={() => onSuspend(seller._id)}
                        className="p-1 sm:p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Suspend Seller"
                      >
                        <AlertCircle className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onActivate(seller._id)}
                        className="p-1 sm:p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Activate Seller"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(seller._id)}
                      className="p-1 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Seller"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Tablet Table (Simplified) */}
        <table className="w-full min-w-[500px] hidden sm:table md:hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Store & Seller</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Products</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSellers.map((seller) => (
              <tr key={seller._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 max-w-[120px] truncate">
                    {seller.storeName || 'No Store'}
                  </div>
                  <div className="text-sm text-gray-500 truncate max-w-[120px]">
                    {seller.name || 'Unknown'}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 truncate max-w-[120px]">{seller.email}</div>
                  {seller.phone && (
                    <div className="text-xs text-gray-500">{seller.phone}</div>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {getStatusBadge(seller.status)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 text-center">
                    {seller.totalProducts || 0}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => window.open(`mailto:${seller.email}`)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Email"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                    {(seller.status === 'active' || !seller.status) ? (
                      <button
                        onClick={() => onSuspend(seller._id)}
                        className="p-1 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Suspend"
                      >
                        <AlertCircle className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onActivate(seller._id)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Activate"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(seller._id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Cards */}
        <div className="sm:hidden space-y-3 p-3">
          {filteredSellers.map((seller) => (
            <div key={seller._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              {/* Header Section */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {(seller.name || 'S').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-900 truncate">
                      {seller.storeName || 'No Store Name'}
                    </div>
                    <div className="text-sm text-gray-500 truncate">{seller.name || 'Unknown'}</div>
                    <div className="text-xs text-gray-400 truncate mt-1">{seller.email}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
                  {getStatusBadge(seller.status)}
                </div>
              </div>
              
              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                <div>
                  <span className="text-gray-500 text-xs">Contact:</span>
                  <div className="font-medium truncate">
                    {seller.phone || 'No phone'}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Products:</span>
                  <div className="font-medium text-center">
                    {seller.totalProducts || 0}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                <button
                  onClick={() => window.open(`mailto:${seller.email}`)}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium border border-blue-200"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </button>
                
                {(seller.status === 'active' || !seller.status) ? (
                  <button
                    onClick={() => onSuspend(seller._id)}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors text-sm font-medium border border-amber-200"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>Suspend</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onActivate(seller._id)}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors text-sm font-medium border border-green-200"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Activate</span>
                  </button>
                )}
                
                <button
                  onClick={() => onDelete(seller._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                  title="Delete Seller"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredSellers.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">No sellers found</h3>
          <p className="text-gray-500 text-sm">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Summary - Responsive */}
      <div className="px-3 sm:px-4 md:px-6 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 text-xs text-gray-600">
          <span>Showing {filteredSellers.length} of {sellers.length} sellers</span>
          <div className="flex gap-2 sm:gap-4 flex-wrap">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Active: {sellers.filter(s => s.status === 'active').length}
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Suspended: {sellers.filter(s => s.status === 'suspended').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}// =========================
// Settings Component with Show/Hide Password
// =========================
function SettingsSection({ user, onUpdate }: { user: any; onUpdate: (data: any) => Promise<void> }) {
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  // Show/hide password states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    username: user?.username || ''
  })

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Preferences state
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    weeklyReports: true,
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  })

  const showMessage = (type: string, text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 5000)
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate required fields
      if (!profileForm.name.trim() || !profileForm.email.trim()) {
        showMessage('error', 'Name and email are required')
        return
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(profileForm.email)) {
        showMessage('error', 'Please enter a valid email address')
        return
      }

      await onUpdate({
        type: 'profile',
        data: profileForm
      })
      
      showMessage('success', 'Profile updated successfully!')
    } catch (error) {
      showMessage('error', 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate password fields
      if (!passwordForm.currentPassword) {
        showMessage('error', 'Current password is required')
        return
      }

      if (!passwordForm.newPassword) {
        showMessage('error', 'New password is required')
        return
      }

      if (passwordForm.newPassword.length < 8) {
        showMessage('error', 'New password must be at least 8 characters long')
        return
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        showMessage('error', 'New passwords do not match')
        return
      }

      await onUpdate({
        type: 'password',
        data: passwordForm
      })
      
      showMessage('success', 'Password updated successfully!')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      showMessage('error', 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  const handlePreferencesUpdate = async () => {
    setLoading(true)

    try {
      await onUpdate({
        type: 'preferences',
        data: preferences
      })
      
      showMessage('success', 'Preferences updated successfully!')
    } catch (error) {
      showMessage('error', 'Failed to update preferences')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Settings className="w-4 h-4" /> },
    { id: 'preferences', label: 'Preferences', icon: <BarChart className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Mail className="w-4 h-4" /> }
  ]

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
            <p className="text-gray-600 text-sm">Manage your account settings and preferences</p>
          </div>
          {message.text && (
            <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 border-b lg:border-b-0 lg:border-r border-gray-200">
          <nav className="flex lg:flex-col overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700 border-r-2 lg:border-r-0 lg:border-l-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <div className="max-w-2xl">
                  <h4 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h4>
                  
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                          Username
                        </label>
                        <input
                          type="text"
                          id="username"
                          value={profileForm.username}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, username: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter username"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your email"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors font-medium"
                      >
                        {loading ? 'Updating...' : 'Update Profile'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="max-w-2xl">
                  <h4 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h4>
                  
                  <form onSubmit={handlePasswordUpdate} className="space-y-6">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h5 className="font-medium text-amber-800">Password Requirements</h5>
                          <p className="text-amber-700 text-sm mt-1">
                            Password must be at least 8 characters long and include uppercase, lowercase, and numbers.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Current Password Field */}
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                          Current Password *
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            id="currentPassword"
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter current password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* New Password Field */}
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                          New Password *
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            id="newPassword"
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter new password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                          >
                            {showNewPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Must be at least 8 characters long
                        </p>
                      </div>

                      {/* Confirm Password Field */}
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm New Password *
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Confirm new password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors font-medium"
                      >
                        {loading ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </form>

                  {/* Two-Factor Authentication Section */}
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <h5 className="text-lg font-semibold text-gray-900 mb-4">Two-Factor Authentication</h5>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                      </div>
                      <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium">
                        Enable 2FA
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Settings */}
              {activeTab === 'preferences' && (
                <div className="max-w-2xl">
                  <h4 className="text-lg font-semibold text-gray-900 mb-6">Preferences</h4>
                  
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <select
                        id="language"
                        value={preferences.language}
                        onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-2">
                        Timezone
                      </label>
                      <select
                        id="timezone"
                        value={preferences.timezone}
                        onChange={(e) => setPreferences(prev => ({ ...prev, timezone: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="America/Chicago">Central Time (CT)</option>
                        <option value="America/Denver">Mountain Time (MT)</option>
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900">Weekly Reports</p>
                        <p className="text-sm text-gray-600">Receive weekly performance reports via email</p>
                      </div>
                      <button
                        onClick={() => setPreferences(prev => ({ ...prev, weeklyReports: !prev.weeklyReports }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          preferences.weeklyReports ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            preferences.weeklyReports ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        onClick={handlePreferencesUpdate}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors font-medium"
                      >
                        {loading ? 'Updating...' : 'Save Preferences'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <div className="max-w-2xl">
                  <h4 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h4>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900">Email Notifications</p>
                        <p className="text-sm text-gray-600">Receive important updates via email</p>
                      </div>
                      <button
                        onClick={() => setPreferences(prev => ({ ...prev, emailNotifications: !prev.emailNotifications }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          preferences.emailNotifications ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            preferences.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900">SMS Notifications</p>
                        <p className="text-sm text-gray-600">Receive urgent alerts via SMS</p>
                      </div>
                      <button
                        onClick={() => setPreferences(prev => ({ ...prev, smsNotifications: !prev.smsNotifications }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          preferences.smsNotifications ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            preferences.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h5 className="font-medium text-blue-800">Notification Settings</h5>
                          <p className="text-blue-700 text-sm mt-1">
                            You can customize which notifications you receive and how you receive them.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        onClick={handlePreferencesUpdate}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors font-medium"
                      >
                        {loading ? 'Updating...' : 'Save Notifications'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// =========================
// Main Admin Dashboard Component
// =========================
export default function ProfessionalAdminDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeSection, setActiveSection] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [flash, setFlash] = useState('')
  
  // State for data
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalSellers: 0,
    totalProducts: 0,
    pendingApprovals: 0,
    totalRevenue: 0,
    monthlySales: 0
  })

  const [products, setProducts] = useState<Product[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [sellers, setSellers] = useState<User[]>([])

  // Check authentication and fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if user is authenticated and is admin
        const authRes = await fetch('/api/auth/check')
        const authData = await authRes.json()
        
        if (!authData.loggedIn || authData.user.role !== 'admin') {
          router.push('/admin/login')
          return
        }
        
        setUser(authData.user)

        // Fetch dashboard stats
        const statsRes = await fetch('/api/admin/dashboard')
        if (statsRes.ok) {
          const statsData = await statsRes.json()
          console.log('📊 Stats data:', statsData)
          setStats(statsData.stats || {
            totalUsers: 0,
            totalSellers: 0,
            totalProducts: 0,
            pendingApprovals: 0,
            totalRevenue: 0,
            monthlySales: 0
          })
        } else {
          console.error('❌ Failed to fetch stats')
        }

        // Fetch products for approval
        const productsRes = await fetch('/api/admin/products?status=all&limit=100')
        if (productsRes.ok) {
          const productsData = await productsRes.json()
          console.log('📦 Products data:', productsData)
          const safeProducts = Array.isArray(productsData.products) ? productsData.products : []
          setProducts(safeProducts)
        } else {
          console.error('❌ Failed to fetch products')
          setProducts([])
        }

        // Fetch users
        const usersRes = await fetch('/api/admin/users?limit=50')
        if (usersRes.ok) {
          const usersData = await usersRes.json()
          console.log('👥 Users data:', usersData)
          const safeUsers = Array.isArray(usersData.users) ? usersData.users : []
          setUsers(safeUsers)
        } else {
          console.error('❌ Failed to fetch users')
          setUsers([])
        }

        // Fetch sellers when sellers section is active
        if (activeSection === 'sellers') {
          const sellersRes = await fetch('/api/admin/users?role=seller&limit=100')
          if (sellersRes.ok) {
            const sellersData = await sellersRes.json()
            console.log('👨‍💼 Sellers data:', sellersData)
            const safeSellers = Array.isArray(sellersData.users) ? sellersData.users : []
            setSellers(safeSellers)
          } else {
            console.error('❌ Failed to fetch sellers')
            setSellers([])
          }
        }

      } catch (error) {
        console.error('❌ Failed to fetch data:', error)
        router.push('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router, activeSection])

  // Handle flash message from actions (approved, rejected, deleted)
  useEffect(() => {
    const msg = searchParams?.get('msg') || ''
    if (msg) {
      setFlash(msg)
      const t = setTimeout(() => setFlash(''), 3000)
      return () => clearTimeout(t)
    }
  }, [searchParams])
// Add this state
const [receipts, setReceipts] = useState<Receipt[]>([])
const [receiptsLoading, setReceiptsLoading] = useState(false)

// Update your useEffect for receipts
useEffect(() => {
  const fetchReceipts = async () => {
    if (activeSection !== 'payments') return
    
    setReceiptsLoading(true)
    try {
      const response = await fetch('/api/admin/receipts')
      if (response.ok) {
        const data = await response.json()
        setReceipts(data.receipts || [])
      } else {
        console.error('Failed to fetch receipts')
        setReceipts([])
      }
    } catch (error) {
      console.error('Failed to fetch receipts:', error)
      setReceipts([])
    } finally {
      setReceiptsLoading(false)
    }
  }
  
  fetchReceipts()
}, [activeSection])

const handleReceiptUpdate = (updatedReceipts: Receipt[]) => {
  setReceipts(updatedReceipts)
}
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleApproveProduct = async (productId: string) => {
    try {
      console.log('🔄 Approving product:', productId)
      
      const response = await fetch(`/api/admin/products/${productId}/approve`, {
        method: 'PATCH'
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('✅ Product approved successfully:', result)
        
        // Refresh products data
        await refreshProducts()
        
        alert('Product approved successfully!')
      } else {
        const error = await response.json()
        console.error('❌ Failed to approve product:', error)
        alert(error.error || 'Failed to approve product')
      }
    } catch (error) {
      console.error('❌ Failed to approve product:', error)
      alert('Failed to approve product')
    }
  }

  const handleRejectProduct = async (productId: string) => {
    try {
      console.log('🔄 Rejecting product:', productId)
      
      const response = await fetch(`/api/admin/products/${productId}/reject`, {
        method: 'PATCH'
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('✅ Product rejected successfully:', result)
        
        // Refresh products data
        await refreshProducts()
        
        alert('Product rejected successfully!')
      } else {
        const error = await response.json()
        console.error('❌ Failed to reject product:', error)
        alert(error.error || 'Failed to reject product')
      }
    } catch (error) {
      console.error('❌ Failed to reject product:', error)
      alert('Failed to reject product')
    }
  }

  // Add refresh function
  const refreshProducts = async () => {
    try {
      console.log('🔄 Refreshing products data...')
      const productsRes = await fetch('/api/admin/products?status=all&limit=100')
      if (productsRes.ok) {
        const productsData = await productsRes.json()
        console.log('✅ Products refreshed:', productsData.products.length)
        const safeProducts: Product[] = Array.isArray(productsData.products) ? productsData.products : []
        setProducts(safeProducts)
        
        // Update stats
        setStats(prev => ({
          ...prev,
          pendingApprovals: safeProducts.filter((p: Product) => p.status === 'pending').length,
          totalProducts: safeProducts.length
        }))
      }
    } catch (error) {
      console.error('❌ Failed to refresh products:', error)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('⚠️ WARNING: This will permanently delete this product and all its data. This action cannot be undone. Are you sure you want to proceed?')) {
      try {
        const response = await fetch(`/api/admin/products/${productId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          const result = await response.json()
          
          // Remove product from state
          setProducts(prev => prev.filter(p => p._id !== productId))
          
          // Update stats
          const deletedProduct = products.find(p => p._id === productId)
          setStats(prev => ({
            ...prev,
            totalProducts: prev.totalProducts - 1,
            pendingApprovals: deletedProduct?.status === 'pending' 
              ? prev.pendingApprovals - 1 
              : prev.pendingApprovals
          }))
          
          console.log('✅ Product deleted successfully:', result)
        } else {
          const error = await response.json()
          console.error('❌ Failed to delete product:', error)
          alert(error.error || 'Failed to delete product')
        }
      } catch (error) {
        console.error('❌ Failed to delete product:', error)
        alert('Failed to delete product')
      }
    }
  }

  const handleViewProduct = (product: Product) => {
    router.push(`/admin/products/${product._id}`)
  }

  const handleSuspendUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/suspend`, {
        method: 'PATCH'
      })
      
      if (response.ok) {
        setUsers(prev => prev.map(u => 
          u._id === userId ? { ...u, status: 'suspended' } : u
        ))
        setSellers(prev => prev.map(s => 
          s._id === userId ? { ...s, status: 'suspended' } : s
        ))
        alert('User suspended successfully!')
      } else {
        const error = await response.json()
        console.error('❌ Failed to suspend user:', error)
        alert(error.error || 'Failed to suspend user')
      }
    } catch (error) {
      console.error('❌ Failed to suspend user:', error)
      alert('Failed to suspend user')
    }
  }

  const handleActivateUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/activate`, {
        method: 'PATCH'
      })
      
      if (response.ok) {
        setUsers(prev => prev.map(u => 
          u._id === userId ? { ...u, status: 'active' } : u
        ))
        setSellers(prev => prev.map(s => 
          s._id === userId ? { ...s, status: 'active' } : s
        ))
        alert('User activated successfully!')
      } else {
        const error = await response.json()
        console.error('❌ Failed to activate user:', error)
        alert(error.error || 'Failed to activate user')
      }
    } catch (error) {
      console.error('❌ Failed to activate user:', error)
      alert('Failed to activate user')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          setUsers(prev => prev.filter(u => u._id !== userId))
          setSellers(prev => prev.filter(s => s._id !== userId))
          alert('User deleted successfully!')
        } else {
          const error = await response.json()
          console.error('❌ Failed to delete user:', error)
          alert(error.error || 'Failed to delete user')
        }
      } catch (error) {
        console.error('❌ Failed to delete user:', error)
        alert('Failed to delete user')
      }
    }
  }
//setting
const handleSettingsUpdate = async (updateData: { type: string; data: any }) => {
  try {
    setLoading(true)
    
    const endpoint = updateData.type === 'password' 
      ? '/api/admin/update-password'
      : '/api/admin/update-profile'

    const response = await fetch(endpoint, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData.data),
    })

    if (response.ok) {
      const result = await response.json()
      
      if (updateData.type === 'profile') {
        setUser((prev: any) => ({ ...prev, ...updateData.data }))
      }
      
      return result
    } else {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update settings')
    }
  } catch (error) {
    console.error('Settings update error:', error)
    throw error
  } finally {
    setLoading(false)
  }
}

  // Seller Management Functions
  const suspendSeller = async (sellerId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${sellerId}/suspend`, {
        method: 'PATCH'
      })
      
      if (response.ok) {
        setSellers(prev => prev.map(seller => 
          seller._id === sellerId ? { ...seller, status: 'suspended' } : seller
        ))
        alert('Seller suspended successfully!')
      } else {
        const error = await response.json()
        console.error('❌ Failed to suspend seller:', error)
        alert(error.error || 'Failed to suspend seller')
      }
    } catch (error) {
      console.error('❌ Failed to suspend seller:', error)
      alert('Failed to suspend seller')
    }
  }

  const activateSeller = async (sellerId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${sellerId}/activate`, {
        method: 'PATCH'
      })
      
      if (response.ok) {
        setSellers(prev => prev.map(seller => 
          seller._id === sellerId ? { ...seller, status: 'active' } : seller
        ))
        alert('Seller activated successfully!')
      } else {
        const error = await response.json()
        console.error('❌ Failed to activate seller:', error)
        alert(error.error || 'Failed to activate seller')
      }
    } catch (error) {
      console.error('❌ Failed to activate seller:', error)
      alert('Failed to activate seller')
    }
  }

  const deleteSeller = async (sellerId: string) => {
    if (confirm('Are you sure you want to delete this seller? This will also remove all their products. This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/admin/users/${sellerId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          setSellers(prev => prev.filter(seller => seller._id !== sellerId))
          alert('Seller deleted successfully!')
        } else {
          const error = await response.json()
          console.error('❌ Failed to delete seller:', error)
          alert(error.error || 'Failed to delete seller')
        }
      } catch (error) {
        console.error('❌ Failed to delete seller:', error)
        alert('Failed to delete seller')
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Admin Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        onLogout={handleLogout}
      />
      
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 min-w-0">
                <div className="h-16 md:h-0"></div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
{/* Header - Updated for mobile */}
            <div className="mb-4 md:mb-6 lg:mb-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-1 md:mb-2 truncate">
                    {activeSection === 'overview' && 'Dashboard Overview'}
                    {activeSection === 'products' && 'Product Management'}
                    {activeSection === 'sellers' && 'Seller Management'}
                    {activeSection === 'users' && 'User Management'}
                            {activeSection === 'payments' && 'Payment Approval'} {/* Added */}

                    {activeSection === 'analytics' && 'Analytics'}
                    {activeSection === 'settings' && 'Settings'}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                    {activeSection === 'overview' && 'Complete overview of platform performance'}
                    {activeSection === 'products' && 'Review and manage all products on the platform'}
                    {activeSection === 'sellers' && 'Manage seller accounts and permissions'}
                            {activeSection === 'payments' && 'Review and approve pending payment transactions'} {/* Added */}

                    {activeSection === 'users' && 'Manage all user accounts and access levels'}
                    {activeSection === 'analytics' && 'Platform analytics and performance metrics'}
                    {activeSection === 'settings' && 'System configuration and preferences'}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                  {flash && (
                    <div className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium ${
                      flash === 'approved' ? 'bg-green-100 text-green-800 border border-green-200' :
                      flash === 'rejected' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                      'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {flash === 'approved' && 'Approved'}
                      {flash === 'rejected' && 'Rejected'}
                      {flash === 'deleted' && 'Deleted'}
                    </div>
                  )}
                  {user && (
                    <div className="text-right">
                      <p className="text-xs sm:text-sm text-gray-600">Welcome back,</p>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">
                        {user.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>


            {/* Content Sections */}
                        <div className="overflow-x-auto">

            {activeSection === 'overview' && (
              <div>
                <StatsCards stats={stats} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Pending Products for Review */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Pending Products</h3>
                          <p className="text-gray-600 text-sm">Products awaiting approval</p>
                        </div>
                        <button
                          onClick={() => setActiveSection('products')}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                        >
                          View All Products
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      {products.filter(p => p.status === 'pending').slice(0, 5).map((product) => (
                        <div key={product._id} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
                          <div className="flex items-center space-x-3 flex-1">
                            <img 
                              src={product.images?.[0] || '/api/placeholder/40/40'} 
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover border"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">{product.name}</div>
                              <div className="text-xs text-gray-500">{product.category}</div>
                              <div className="text-xs text-gray-400 mt-1">
                                Seller: {product.sellerId?.storeName || 'N/A'}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => handleApproveProduct(product._id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Approve Product"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRejectProduct(product._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject Product"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleViewProduct(product)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {products.filter(p => p.status === 'pending').length === 0 && (
                        <div className="text-center py-8">
                          <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-500 text-sm">No pending products for review</p>
                        </div>
                      )}
                    </div>
                    {products.filter(p => p.status === 'pending').length > 0 && (
                      <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
                        <div className="flex justify-between items-center text-xs text-gray-600">
                          <span>
                            Showing {Math.min(products.filter(p => p.status === 'pending').length, 5)} of{' '}
                            {products.filter(p => p.status === 'pending').length} pending products
                          </span>
                          <div className="flex gap-4">
                            <span className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                              Pending: {products.filter(p => p.status === 'pending').length}
                            </span>
                            <span className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              Approved: {products.filter(p => p.status === 'approved').length}
                            </span>
                            <span className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              Rejected: {products.filter(p => p.status === 'rejected').length}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <UserManagementTable
                    users={users.slice(0, 5)}
                    onSuspend={handleSuspendUser}
                    onActivate={handleActivateUser}
                    onDelete={handleDeleteUser}
                  />
                </div>
              </div>
            )}

            {activeSection === 'products' && (
              <ProductManagementTable
                products={products}
                onApprove={handleApproveProduct}
                onReject={handleRejectProduct}
                onDelete={handleDeleteProduct}
                onView={handleViewProduct}
              />
            )}

            {activeSection === 'sellers' && (
              <SellerManagementTable
                sellers={sellers}
                onSuspend={suspendSeller}
                onActivate={activateSeller}
                onDelete={deleteSeller}
              />
            )}

            {activeSection === 'users' && (
              <UserManagementTable
                users={users}
                onSuspend={handleSuspendUser}
                onActivate={handleActivateUser}
                onDelete={handleDeleteUser}
              />
            )}
{activeSection === 'payments' && (
  <AdminApprovalPanel 
    receipts={receipts}
    onReceiptUpdate={handleReceiptUpdate}
  />
)}
            {activeSection === 'analytics' && (
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <div className="text-center py-12">
                  <BarChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Advanced analytics with sales trends, user growth, and platform performance metrics coming soon.
                  </p>
                </div>
              </div>
            )}

   {activeSection === 'settings' && (
  <SettingsSection 
    user={user} 
    onUpdate={handleSettingsUpdate}
  />
)}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}