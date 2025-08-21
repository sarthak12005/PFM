import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Target,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Crown,
  Home,
  ChevronRight
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      current: location.pathname === '/admin'
    },
    {
      name: 'User Management',
      href: '/admin/users',
      icon: Users,
      current: location.pathname === '/admin/users'
    },
    {
      name: 'Offers Management',
      href: '/admin/offers',
      icon: CreditCard,
      current: location.pathname === '/admin/offers'
    },
    {
      name: 'Memberships',
      href: '/admin/memberships',
      icon: Target,
      current: location.pathname === '/admin/memberships'
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
      current: location.pathname === '/admin/analytics'
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      current: location.pathname === '/admin/settings'
    }
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const goToUserDashboard = () => {
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex-shrink-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent navigation={navigation} user={user} onLogout={handleLogout} onGoToUserDashboard={goToUserDashboard} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="sticky top-0 z-10 md:hidden bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="h-10 w-10 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center">
              <Crown className="h-5 w-5 text-yellow-500 mr-2" />
              <span className="text-lg font-bold text-gray-900">SaveWise Admin</span>
            </div>
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

// Sidebar Content Component
const SidebarContent = ({ navigation, user, onLogout, onGoToUserDashboard }) => {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
      {/* Logo and Admin Badge */}
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4 mb-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-900">SaveWise</h1>
              <div className="flex items-center">
                <Crown className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-sm text-yellow-600 font-medium">Admin Panel</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  item.current
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon
                  className={`mr-3 flex-shrink-0 h-5 w-5 ${
                    item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {item.name}
                {item.current && (
                  <ChevronRight className="ml-auto h-4 w-4 text-blue-500" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Quick Actions */}
        <div className="px-2 mt-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Quick Actions</h3>
            <button
              onClick={onGoToUserDashboard}
              className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-700 bg-white rounded-md hover:bg-blue-100 transition-colors"
            >
              <Home className="h-4 w-4 mr-2" />
              User Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* User info and logout */}
      <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
        <div className="flex items-center w-full">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <div className="flex items-center">
              <Crown className="h-3 w-3 text-yellow-500 mr-1" />
              <p className="text-xs text-yellow-600">Administrator</p>
            </div>
          </div>
          <div className="ml-3">
            <button
              onClick={onLogout}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
