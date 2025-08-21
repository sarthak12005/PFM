import React, { useState } from 'react'
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Globe, 
  Shield, 
  Download, 
  Trash2, 
  Sun, 
  Moon, 
  DollarSign,
  Calendar,
  AlertTriangle,
  LogOut
} from 'lucide-react'
import toast from 'react-hot-toast'

// Notification Settings Component
export const NotificationSettings = ({ settings, onUpdate }) => {
  const notificationTypes = [
    {
      category: 'Email Notifications',
      icon: Mail,
      settings: [
        { key: 'budgetAlerts', label: 'Budget Alerts', description: 'Get notified when approaching budget limits' },
        { key: 'goalUpdates', label: 'Goal Updates', description: 'Updates on your financial goals progress' },
        { key: 'monthlyReports', label: 'Monthly Reports', description: 'Receive monthly financial summaries' },
        { key: 'securityAlerts', label: 'Security Alerts', description: 'Important security notifications' }
      ]
    },
    {
      category: 'Push Notifications',
      icon: Smartphone,
      settings: [
        { key: 'budgetAlerts', label: 'Budget Alerts', description: 'Real-time budget notifications' },
        { key: 'transactionAlerts', label: 'Transaction Alerts', description: 'Notifications for new transactions' },
        { key: 'reminders', label: 'Reminders', description: 'Bill payment and goal reminders' }
      ]
    }
  ]

  const handleToggle = (category, key) => {
    const newSettings = {
      ...settings.notifications,
      [category]: {
        ...settings.notifications[category],
        [key]: !settings.notifications[category][key]
      }
    }
    onUpdate('notifications', newSettings)
  }

  return (
    <div className="px-4 py-5 sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Notification Preferences</h3>
          <p className="mt-1 text-sm text-gray-500">
            Choose how you want to receive notifications and updates.
          </p>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="space-y-8">
            {notificationTypes.map((type) => {
              const Icon = type.icon
              const categoryKey = type.category.toLowerCase().includes('email') ? 'email' : 'push'
              
              return (
                <div key={type.category}>
                  <div className="flex items-center mb-4">
                    <Icon size={20} className="text-gray-400 mr-2" />
                    <h4 className="text-sm font-medium text-gray-900">{type.category}</h4>
                  </div>
                  <div className="space-y-4">
                    {type.settings.map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between">
                        <div className="flex-1">
                          <h5 className="text-sm font-medium text-gray-900">{setting.label}</h5>
                          <p className="text-sm text-gray-500">{setting.description}</p>
                        </div>
                        <button
                          onClick={() => handleToggle(categoryKey, setting.key)}
                          className={`${
                            settings.notifications[categoryKey][setting.key] ? 'bg-blue-600' : 'bg-gray-200'
                          } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                        >
                          <span
                            className={`${
                              settings.notifications[categoryKey][setting.key] ? 'translate-x-5' : 'translate-x-0'
                            } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// Privacy Settings Component
export const PrivacySettings = ({ settings, onUpdate }) => {
  const privacyOptions = [
    {
      key: 'profileVisibility',
      label: 'Profile Visibility',
      description: 'Control who can see your profile information',
      type: 'select',
      options: [
        { value: 'public', label: 'Public' },
        { value: 'private', label: 'Private' },
        { value: 'friends', label: 'Friends Only' }
      ]
    },
    {
      key: 'dataSharing',
      label: 'Data Sharing',
      description: 'Allow sharing anonymized data for service improvement',
      type: 'toggle'
    },
    {
      key: 'analyticsOptOut',
      label: 'Analytics Opt-out',
      description: 'Opt out of analytics and usage tracking',
      type: 'toggle'
    },
    {
      key: 'marketingOptOut',
      label: 'Marketing Communications',
      description: 'Opt out of marketing emails and promotions',
      type: 'toggle'
    }
  ]

  const handleChange = (key, value) => {
    onUpdate('privacy', { [key]: value })
  }

  return (
    <div className="px-4 py-5 sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Privacy Controls</h3>
          <p className="mt-1 text-sm text-gray-500">
            Manage your privacy settings and data sharing preferences.
          </p>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="space-y-6">
            {privacyOptions.map((option) => (
              <div key={option.key} className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{option.label}</h4>
                  <p className="text-sm text-gray-500">{option.description}</p>
                </div>
                <div className="ml-4">
                  {option.type === 'toggle' ? (
                    <button
                      onClick={() => handleChange(option.key, !settings.privacy[option.key])}
                      className={`${
                        settings.privacy[option.key] ? 'bg-blue-600' : 'bg-gray-200'
                      } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    >
                      <span
                        className={`${
                          settings.privacy[option.key] ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                      />
                    </button>
                  ) : (
                    <select
                      value={settings.privacy[option.key]}
                      onChange={(e) => handleChange(option.key, e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      {option.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Preference Settings Component
export const PreferenceSettings = ({ settings, onUpdate }) => {
  const preferences = [
    {
      key: 'theme',
      label: 'Theme',
      description: 'Choose your preferred color scheme',
      type: 'select',
      options: [
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
        { value: 'system', label: 'System' }
      ]
    },
    {
      key: 'language',
      label: 'Language',
      description: 'Select your preferred language',
      type: 'select',
      options: [
        { value: 'en', label: 'English' },
        { value: 'hi', label: 'Hindi' },
        { value: 'es', label: 'Spanish' }
      ]
    },
    {
      key: 'currency',
      label: 'Currency',
      description: 'Default currency for transactions',
      type: 'select',
      options: [
        { value: 'INR', label: 'Indian Rupee (₹)' },
        { value: 'USD', label: 'US Dollar ($)' },
        { value: 'EUR', label: 'Euro (€)' }
      ]
    },
    {
      key: 'dateFormat',
      label: 'Date Format',
      description: 'How dates are displayed',
      type: 'select',
      options: [
        { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
        { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
        { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
      ]
    }
  ]

  const handleChange = (key, value) => {
    onUpdate('preferences', { [key]: value })
    toast.success('Preference updated!')
  }

  return (
    <div className="px-4 py-5 sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">App Preferences</h3>
          <p className="mt-1 text-sm text-gray-500">
            Customize how the app looks and behaves.
          </p>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="space-y-6">
            {preferences.map((pref) => (
              <div key={pref.key}>
                <label htmlFor={pref.key} className="block text-sm font-medium text-gray-700">
                  {pref.label}
                </label>
                <p className="text-sm text-gray-500 mb-2">{pref.description}</p>
                <select
                  id={pref.key}
                  value={settings.preferences[pref.key]}
                  onChange={(e) => handleChange(pref.key, e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  {pref.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Data Settings Component
export const DataSettings = ({ onExport, onDeleteAccount }) => {
  const exportFormats = [
    { format: 'csv', label: 'CSV', description: 'Comma-separated values for spreadsheets' },
    { format: 'json', label: 'JSON', description: 'JavaScript Object Notation for developers' },
    { format: 'pdf', label: 'PDF', description: 'Portable Document Format for reports' }
  ]

  return (
    <div className="px-4 py-5 sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Data Management</h3>
          <p className="mt-1 text-sm text-gray-500">
            Export your data or manage your account.
          </p>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="space-y-8">
            {/* Data Export */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">Export Your Data</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {exportFormats.map((format) => (
                  <button
                    key={format.format}
                    onClick={() => onExport(format.format)}
                    className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <div className="flex-shrink-0">
                      <Download size={20} className="text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="absolute inset-0" aria-hidden="true" />
                      <p className="text-sm font-medium text-gray-900">{format.label}</p>
                      <p className="text-sm text-gray-500 truncate">{format.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Account Deletion */}
            <div className="pt-8 border-t border-gray-200">
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Delete Account</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>
                        Once you delete your account, all of your data will be permanently removed. 
                        This action cannot be undone.
                      </p>
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={onDeleteAccount}
                        className="bg-red-600 border border-transparent rounded-md py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <Trash2 size={16} className="mr-2" />
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
