import React, { useState } from 'react'
import { Bell, Mail, AlertTriangle, TrendingUp, Calendar, Smartphone, Save } from 'lucide-react'
import toast from 'react-hot-toast'

const NotificationToggles = ({ notifications, onUpdate }) => {
  const [settings, setSettings] = useState(notifications)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleToggle = (key) => {
    const newSettings = {
      ...settings,
      [key]: !settings[key]
    }
    setSettings(newSettings)
    
    // Auto-save after a short delay
    setTimeout(() => {
      handleSave(newSettings)
    }, 500)
  }

  const handleSave = async (settingsToSave = settings) => {
    setIsUpdating(true)
    try {
      await onUpdate(settingsToSave)
    } catch (error) {
      console.error('Error updating notifications:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const ToggleSwitch = ({ enabled, onChange, disabled = false }) => (
    <button
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        enabled ? 'bg-blue-600' : 'bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )

  const notificationOptions = [
    {
      key: 'monthlyReport',
      title: 'Monthly Financial Report',
      description: 'Receive a detailed monthly summary of your finances via email',
      icon: Calendar,
      category: 'Reports'
    },
    {
      key: 'highExpenseAlert',
      title: 'High Expense Alerts',
      description: 'Get notified when you make unusually large transactions',
      icon: AlertTriangle,
      category: 'Spending'
    },
    {
      key: 'budgetAlert',
      title: 'Budget Limit Warnings',
      description: 'Alert when you\'re approaching or exceeding category budgets',
      icon: TrendingUp,
      category: 'Budget'
    },
    {
      key: 'emailNotifications',
      title: 'Email Notifications',
      description: 'Receive notifications via email',
      icon: Mail,
      category: 'Delivery'
    },
    {
      key: 'pushNotifications',
      title: 'Push Notifications',
      description: 'Receive notifications on your device (coming soon)',
      icon: Smartphone,
      category: 'Delivery',
      disabled: true
    }
  ]

  const groupedNotifications = notificationOptions.reduce((groups, option) => {
    const category = option.category
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(option)
    return groups
  }, {})

  return (
    <div className="space-y-6">
      {/* Notification Settings */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <Bell size={20} className="text-orange-600" />
                <h3 className="card-title">Notification Preferences</h3>
              </div>
              <p className="card-description">Choose what notifications you want to receive</p>
            </div>
            {isUpdating && (
              <div className="flex items-center space-x-2 text-sm text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Saving...</span>
              </div>
            )}
          </div>
        </div>
        <div className="card-content">
          <div className="space-y-6">
            {Object.entries(groupedNotifications).map(([category, options]) => (
              <div key={category}>
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center space-x-2">
                  <span>{category}</span>
                  <div className="flex-1 border-t border-gray-200"></div>
                </h4>
                <div className="space-y-4">
                  {options.map((option) => {
                    const Icon = option.icon
                    const isEnabled = settings[option.key]
                    
                    return (
                      <div key={option.key} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${
                            isEnabled ? 'bg-blue-100' : 'bg-gray-200'
                          }`}>
                            <Icon size={18} className={
                              isEnabled ? 'text-blue-600' : 'text-gray-500'
                            } />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h5 className="font-medium text-gray-900">{option.title}</h5>
                              {option.disabled && (
                                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                                  Coming Soon
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                          </div>
                        </div>
                        <ToggleSwitch
                          enabled={isEnabled}
                          onChange={() => handleToggle(option.key)}
                          disabled={option.disabled}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notification Schedule */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center space-x-2">
            <Calendar size={20} className="text-green-600" />
            <h3 className="card-title">Notification Schedule</h3>
          </div>
          <p className="card-description">When you'll receive different types of notifications</p>
        </div>
        <div className="card-content">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar size={16} className="text-blue-600" />
                  <span className="font-medium text-gray-900">Monthly Reports</span>
                </div>
                <p className="text-sm text-gray-600">
                  Sent on the 1st of each month at 9:00 AM
                </p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle size={16} className="text-orange-600" />
                  <span className="font-medium text-gray-900">Expense Alerts</span>
                </div>
                <p className="text-sm text-gray-600">
                  Immediately when transaction exceeds ₹5,000
                </p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp size={16} className="text-red-600" />
                  <span className="font-medium text-gray-900">Budget Warnings</span>
                </div>
                <p className="text-sm text-gray-600">
                  When you reach 80% and 100% of category limits
                </p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Bell size={16} className="text-purple-600" />
                  <span className="font-medium text-gray-900">General Updates</span>
                </div>
                <p className="text-sm text-gray-600">
                  Weekly summary every Sunday at 6:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Preview */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center space-x-2">
            <Mail size={20} className="text-indigo-600" />
            <h3 className="card-title">Email Preview</h3>
          </div>
          <p className="card-description">Sample of what your notifications will look like</p>
        </div>
        <div className="card-content">
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="border-b border-gray-200 pb-3 mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">SaveWise</h4>
                  <p className="text-sm text-gray-500">notifications@savewise.com</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Your Monthly Financial Report - January 2025</h4>
              <p className="text-sm text-gray-600">
                Hi {settings.profile?.name || 'User'}, here's your financial summary for this month:
              </p>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-500">Income</p>
                    <p className="font-semibold text-green-600">₹65,000</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Expenses</p>
                    <p className="font-semibold text-red-600">₹42,300</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Savings</p>
                    <p className="font-semibold text-blue-600">₹22,700</p>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-gray-500">
                View your detailed report in the SaveWise app →
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
            <Bell size={12} className="text-white" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">
              Privacy & Security
            </h4>
            <p className="text-sm text-blue-700">
              Your notification preferences are stored securely and you can change them anytime. 
              We never share your financial data with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationToggles
