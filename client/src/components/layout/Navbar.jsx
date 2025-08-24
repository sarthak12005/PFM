import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Crown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/transactions', label: 'Transactions' },
    { path: '/budget-planner', label: 'Budget' },
    { path: '/goals', label: 'Goals' },
    { path: '/categories', label: 'Categories' },
    // { path: '/notifications', label: 'Notifications' }
    { path: '/profile', label: 'Profile' },
    { path: '/settings', label: 'Settings' },
  ]

  if (!user) {
    return null
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/dashboard"
              className="text-xl sm:text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
            >
              SaveWise
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-all duration-200 px-2 py-1 rounded-md ${isActive(link.path)
                    ? 'text-primary-600 bg-primary-50 border-b-2 border-primary-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Menu - Desktop */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
            {/* Admin Panel Link */}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="flex items-center px-3 py-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-all duration-200 transform hover:scale-105"
              >
                <Crown className="h-4 w-4 mr-2" />
                Admin Panel
              </Link>
            )}

            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 transform hover:scale-105"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 touch-manipulation"
              aria-label="Toggle mobile menu"
            >
              <div className="relative w-6 h-6">
                <Menu
                  size={24}
                  className={`absolute inset-0 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'}`}
                />
                <X
                  size={24}
                  className={`absolute inset-0 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'}`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
        isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-white border-t border-gray-200 shadow-lg">
          <div className="px-3 py-4 space-y-2 max-h-96 overflow-y-auto">
            {navLinks.map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 touch-manipulation transform hover:scale-105 active:scale-95 ${isActive(link.path)
                    ? 'text-primary-600 bg-primary-50 border-l-4 border-primary-600'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: isMobileMenuOpen ? 'slideInFromRight 0.3s ease-out forwards' : 'none'
                }}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile User Menu */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="px-4 space-y-3">
                <div className="pb-2">
                  <p className="text-base font-semibold text-gray-800">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>

                {/* Admin Panel Link - Mobile */}
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center w-full px-4 py-3 rounded-lg text-base font-medium text-white bg-yellow-600 hover:bg-yellow-700 transition-all duration-200 transform hover:scale-105 active:scale-95 touch-manipulation"
                  >
                    <Crown className="h-5 w-5 mr-3" />
                    Admin Panel
                  </Link>
                )}

                <button
                  onClick={() => {
                    logout()
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 transform hover:scale-105 active:scale-95 touch-manipulation"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
