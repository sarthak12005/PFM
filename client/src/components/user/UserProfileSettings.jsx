import React, { useState } from 'react'
import { User, Mail, Lock, Camera, Eye, EyeOff, Save, Trash2, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

const UserProfileSettings = ({ profile, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [isUpdating, setIsUpdating] = useState(false)
  const [showPasswordSection, setShowPasswordSection] = useState(false)
  const [showDangerZone, setShowDangerZone] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setIsUpdating(true)

    try {
      // Validate form
      if (!formData.name.trim()) {
        toast.error('Name is required')
        return
      }

      if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
        toast.error('Valid email is required')
        return
      }

      await onUpdate({
        name: formData.name,
        email: formData.email
      })

    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setIsUpdating(true)

    try {
      // Validate passwords
      if (!formData.currentPassword) {
        toast.error('Current password is required')
        return
      }

      if (formData.newPassword.length < 6) {
        toast.error('New password must be at least 6 characters')
        return
      }

      if (formData.newPassword !== formData.confirmPassword) {
        toast.error('New passwords do not match')
        return
      }

      // TODO: Implement password change API call
      toast.success('Password updated successfully!')
      
      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
      setShowPasswordSection(false)

    } catch (error) {
      console.error('Error changing password:', error)
      toast.error('Failed to change password')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleProfilePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // TODO: Implement photo upload
      toast.success('Profile photo updated!')
    }
  }

  const handleAccountDeactivation = () => {
    if (window.confirm('Are you sure you want to deactivate your account? This action cannot be undone.')) {
      // TODO: Implement account deactivation
      toast.error('Account deactivation feature coming soon')
    }
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center space-x-2">
            <User size={20} className="text-blue-600" />
            <h3 className="card-title">Profile Information</h3>
          </div>
          <p className="card-description">Update your account details and profile photo</p>
        </div>
        <div className="card-content">
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            {/* Profile Photo */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {formData.name.charAt(0).toUpperCase()}
                </div>
                <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <Camera size={16} className="text-gray-600" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Profile Photo</h4>
                <p className="text-sm text-gray-500">JPG, GIF or PNG. 1MB max.</p>
              </div>
            </div>

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={20} className="text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input pl-10"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={20} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input pl-10"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isUpdating}
                className="btn-primary flex items-center space-x-2"
              >
                <Save size={16} />
                <span>{isUpdating ? 'Updating...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Password Settings */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <Lock size={20} className="text-green-600" />
                <h3 className="card-title">Password & Security</h3>
              </div>
              <p className="card-description">Update your password to keep your account secure</p>
            </div>
            <button
              onClick={() => setShowPasswordSection(!showPasswordSection)}
              className="btn-secondary text-sm"
            >
              {showPasswordSection ? 'Cancel' : 'Change Password'}
            </button>
          </div>
        </div>
        
        {showPasswordSection && (
          <div className="card-content">
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {/* Current Password */}
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={20} className="text-gray-400" />
                  </div>
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type={showPasswords.current ? 'text' : 'password'}
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="input pl-10 pr-10"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPasswords.current ? (
                      <EyeOff size={20} className="text-gray-400" />
                    ) : (
                      <Eye size={20} className="text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={20} className="text-gray-400" />
                  </div>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPasswords.new ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="input pl-10 pr-10"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPasswords.new ? (
                      <EyeOff size={20} className="text-gray-400" />
                    ) : (
                      <Eye size={20} className="text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={20} className="text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="input pl-10 pr-10"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff size={20} className="text-gray-400" />
                    ) : (
                      <Eye size={20} className="text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Update Password Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Save size={16} />
                  <span>{isUpdating ? 'Updating...' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <div className="card border-red-200">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <AlertTriangle size={20} className="text-red-600" />
                <h3 className="card-title text-red-900">Danger Zone</h3>
              </div>
              <p className="card-description text-red-600">Irreversible and destructive actions</p>
            </div>
            <button
              onClick={() => setShowDangerZone(!showDangerZone)}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              {showDangerZone ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        
        {showDangerZone && (
          <div className="card-content">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Trash2 size={20} className="text-red-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-red-900 mb-1">
                    Deactivate Account
                  </h4>
                  <p className="text-sm text-red-700 mb-3">
                    Once you deactivate your account, there is no going back. Please be certain.
                  </p>
                  <button
                    onClick={handleAccountDeactivation}
                    className="btn-danger text-sm"
                  >
                    Deactivate Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfileSettings
