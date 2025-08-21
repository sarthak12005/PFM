import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Import pages
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import BudgetPlanner from './pages/BudgetPlanner'
import Goals from './pages/Goals'
import Categories from './pages/Categories'
import Notifications from './pages/Notifications'
import About from './pages/About'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import MobileTest from './pages/MobileTest'

// Import components
import { Navbar, Footer, ProtectedRoute } from './components/layout'

// Admin Components
import AdminRoute from './components/layout/AdminRoute'
import AdminDashboard from './pages/admin/AdminDashboard'
import UserManagement from './pages/admin/UserManagement'
import MembershipManagement from './pages/admin/MembershipManagement'

// Import context
import { AuthProvider } from './context/AuthContext'
import { CategoriesProvider } from './context/CategoriesContext'

// Debug components (only in development)
import DeviceInfo from './components/debug/DeviceInfo'
import TouchTester from './components/debug/TouchTester'

function App() {
  return (
    <AuthProvider>
      <CategoriesProvider>
        <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/transactions" element={
                <ProtectedRoute>
                  <Transactions />
                </ProtectedRoute>
              } />
              <Route path="/budget-planner" element={
                <ProtectedRoute>
                  <BudgetPlanner />
                </ProtectedRoute>
              } />
              <Route path="/goals" element={
                <ProtectedRoute>
                  <Goals />
                </ProtectedRoute>
              } />
              <Route path="/categories" element={
                <ProtectedRoute>
                  <Categories />
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="/admin/users" element={
                <AdminRoute>
                  <UserManagement />
                </AdminRoute>
              } />
              <Route path="/admin/memberships" element={
                <AdminRoute>
                  <MembershipManagement />
                </AdminRoute>
              } />

              {/* Profile Route */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />

              {/* Public Pages */}
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />

              {/* Development/Testing Pages */}
              {import.meta.env.DEV && (
                <Route path="/mobile-test" element={<MobileTest />} />
              )}

              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />

          {/* Toast notifications */}
          <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{}}
            toastOptions={{
              // Default options for all toasts
              duration: 4000,
              style: {
                background: '#ffffff',
                color: '#374151',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                fontSize: '14px',
                fontWeight: '500',
                padding: '12px 16px',
                maxWidth: '400px',
              },
              // Success toasts
              success: {
                duration: 3000,
                style: {
                  background: '#f0fdf4',
                  color: '#166534',
                  border: '1px solid #bbf7d0',
                },
                iconTheme: {
                  primary: '#16a34a',
                  secondary: '#f0fdf4',
                },
              },
              // Error toasts
              error: {
                duration: 5000,
                style: {
                  background: '#fef2f2',
                  color: '#991b1b',
                  border: '1px solid #fecaca',
                },
                iconTheme: {
                  primary: '#dc2626',
                  secondary: '#fef2f2',
                },
              },
              // Loading toasts
              loading: {
                duration: Infinity,
                style: {
                  background: '#fefce8',
                  color: '#a16207',
                  border: '1px solid #fde68a',
                },
                iconTheme: {
                  primary: '#d97706',
                  secondary: '#fefce8',
                },
              },
            }}
          />

          {/* Debug components (development only) */}
          {import.meta.env.DEV && (
            <>
              <DeviceInfo />
              <TouchTester />
            </>
          )}
        </div>
      </Router>
      </CategoriesProvider>
    </AuthProvider>
  )
}

export default App
