import React, { useState, useEffect } from 'react'
import {
  User,
  Lock,
  Palette,
  Target,
  Bell,
  Camera,
  Eye,
  EyeOff,
  Save,
  Trash2,
  Sun,
  Moon,
  DollarSign,
  AlertTriangle,
  Shield,
  Globe,
  Smartphone,
  Mail,
  Download,
  Upload,
  RefreshCw,
  LogOut,
  Settings as SettingsIcon,
  CreditCard,
  Database,
  HelpCircle
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { LoadingSpinner } from '../components/ui'
import {
  NotificationSettings,
  PrivacySettings,
  PreferenceSettings,
  DataSettings
} from '../components/settings/SettingsComponents'
import toast from 'react-hot-toast'

const Settings = () => {
  const { user, logout } = useAuth()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [settings, setSettings] = useState({
    // Profile settings
    profile: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      profilePhoto: user?.profilePhoto || null,
      bio: user?.bio || '',
      location: user?.location || '',
      dateOfBirth: user?.dateOfBirth || '',
      occupation: user?.occupation || ''
    },
    // Security settings
    security: {
      twoFactorEnabled: false,
      loginNotifications: true,
      sessionTimeout: 30,
      passwordLastChanged: user?.passwordLastChanged || null
    },
    // Notification preferences
    notifications: {
      email: {
        budgetAlerts: true,
        goalUpdates: true,
        monthlyReports: true,
        securityAlerts: true,
        promotions: false
      },
      push: {
        budgetAlerts: true,
        goalUpdates: false,
        transactionAlerts: true,
        reminders: true
      },
      inApp: {
        budgetAlerts: true,
        goalUpdates: true,
        transactionAlerts: true,
        systemUpdates: true
      }
    },
    // Privacy settings
    privacy: {
      profileVisibility: 'private',
      dataSharing: false,
      analyticsOptOut: false,
      marketingOptOut: false
    },
    // App preferences
    preferences: {
      theme: 'light',
      language: 'en',
      currency: 'INR',
      dateFormat: 'DD/MM/YYYY',
      numberFormat: 'indian',
      defaultTransactionType: 'expense'
    }
  })

  useEffect(() => {
    fetchUserSettings()
  }, [])

  const fetchUserSettings = async () => {
    setLoading(true)
    try {
      // For now, use default settings. Replace with actual API call when backend is ready
      // const response = await userAPI.getSettings()
      // setSettings(response.data.settings)

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      // Use default settings with user data
      setSettings(prev => ({
        ...prev,
        profile: {
          name: user?.name || '',
          email: user?.email || '',
          profilePhoto: null
        }
      }))

    } catch (error) {
      console.error('Error fetching settings:', error)
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSettingsUpdate = async (section, data) => {
    try {
      setSettings(prev => ({
        ...prev,
        [section]: { ...prev[section], ...data }
      }))

      // For now, simulate API call. Replace with actual API call when backend is ready
      // await userAPI.updateSettings({ [section]: data })

      toast.success('Settings updated successfully!')

    } catch (error) {
      console.error('Error updating settings:', error)
      toast.error('Failed to update settings')
    }
  }

  const tabs = [
    { id: 'account', label: 'Profile', icon: User, description: 'Personal information and profile settings' },
    { id: 'security', label: 'Security', icon: Shield, description: 'Password, 2FA, and security preferences' },
    { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Email, push, and in-app notifications' },
    { id: 'privacy', label: 'Privacy', icon: Lock, description: 'Data sharing and privacy controls' },
    { id: 'theme', label: 'Preferences', icon: Palette, description: 'App theme, language, and display options' },
    { id: 'data', label: 'Data & Export', icon: Database, description: 'Export data and manage account data' }
  ]

  const handlePasswordChange = async (passwordData) => {
    const loadingToast = toast.loading('Changing password...')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      toast.success('Password changed successfully!', {
        id: loadingToast
      })
    } catch (error) {
      toast.error('Failed to change password', {
        id: loadingToast
      })
    }
  }

  const handleDataExport = async (format) => {
    const loadingToast = toast.loading(`Preparing ${format.toUpperCase()} export...`)

    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000))

      toast.success(`${format.toUpperCase()} export ready for download!`, {
        id: loadingToast,
        duration: 5000
      })
    } catch (error) {
      toast.error('Export failed', {
        id: loadingToast
      })
    }
  }

  const handleAccountDeletion = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      const loadingToast = toast.loading('Deleting account...')

      try {
        // Simulate account deletion
        await new Promise(resolve => setTimeout(resolve, 2000))

        toast.success('Account deleted successfully', {
          id: loadingToast
        })

        // Logout user
        setTimeout(() => {
          logout()
        }, 1000)
      } catch (error) {
        toast.error('Failed to delete account', {
          id: loadingToast
        })
      }
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading settings..." />
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return <ProfileSettings settings={settings} onUpdate={handleSettingsUpdate} />
      case 'security':
        return <SecuritySettings settings={settings} onUpdate={handleSettingsUpdate} onPasswordChange={handlePasswordChange} />
      case 'notifications':
        return <NotificationSettings settings={settings} onUpdate={handleSettingsUpdate} />
      case 'privacy':
        return <PrivacySettings settings={settings} onUpdate={handleSettingsUpdate} />
      case 'theme':
        return <PreferenceSettings settings={settings} onUpdate={handleSettingsUpdate} />
      case 'data':
        return <DataSettings onExport={handleDataExport} onDeleteAccount={handleAccountDeletion} />
      default:
        return <ProfileSettings settings={settings} onUpdate={handleSettingsUpdate} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your account settings and preferences
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <RefreshCw size={16} className="mr-2" />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
          {/* Sidebar Navigation */}
          <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${
                      isActive
                        ? 'bg-blue-50 border-blue-500 text-blue-700 hover:bg-blue-50 hover:text-blue-700'
                        : 'border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900'
                    } group border-l-4 px-3 py-2 flex items-center text-sm font-medium w-full text-left transition-colors duration-200`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon
                      className={`${
                        isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                      } flex-shrink-0 -ml-1 mr-3 h-6 w-6`}
                      aria-hidden="true"
                    />
                    <div className="flex-1">
                      <span className="truncate">{tab.label}</span>
                      <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">
                        {tab.description}
                      </p>
                    </div>
                  </button>
                )
              })}
            </nav>
          </aside>

          {/* Content area */}
          <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
            <div className="bg-white shadow rounded-lg">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Profile Settings Component
const ProfileSettings = ({ settings, onUpdate }) => {
  const [formData, setFormData] = useState(settings.profile)

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdate('profile', formData)
    toast.success('Profile updated successfully!')
  }

  return (
    <div className="px-4 py-5 sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Profile Information</h3>
          <p className="mt-1 text-sm text-gray-500">
            Update your personal information and profile settings.
          </p>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 py-2 px-1  focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border border-black/50 rounded-md"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 py-2 px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border border-black/50 rounded-md"
                />
              </div>

              <div className="col-span-6">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="mt-1 py-2 px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border border-black/50 rounded-md"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Save size={16} className="mr-2" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// Security Settings Component
const SecuritySettings = ({ settings, onUpdate, onPasswordChange }) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    onPasswordChange(passwordData)
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  return (
    <div className="px-4 py-5 sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Security Settings</h3>
          <p className="mt-1 text-sm text-gray-500">
            Manage your password and security preferences.
          </p>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <div className="mt-1 relative">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  name="currentPassword"
                  id="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="ṃt-1 py-2 px-1 focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 shadow-sm sm:text-sm border border-gray-300 rounded-md"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                >
                  {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="mt-1 relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  name="newPassword"
                  id="newPassword"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="ṃt-1 py-2 px-1 border focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                >
                  {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="mt-1 relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  name="confirmPassword"
                  id="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="ṃt-1 py-2 px-1 border focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                >
                  {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Lock size={16} className="mr-2" />
                Change Password
              </button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
              </div>
              <button
                onClick={() => onUpdate('security', { twoFactorEnabled: !settings.security.twoFactorEnabled })}
                className={`${
                  settings.security.twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-200'
                } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                <span
                  className={`${
                    settings.security.twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
