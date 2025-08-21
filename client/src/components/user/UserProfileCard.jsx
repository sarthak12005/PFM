import React, { useState } from 'react'
import { User, Edit3, Calendar, Hash, Camera, Mail, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'

const UserProfileCard = ({ userInfo, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: userInfo.name,
    email: userInfo.email
  })
  const [isUpdating, setIsUpdating] = useState(false)

  const handleEdit = () => {
    setIsEditing(true)
    setEditData({
      name: userInfo.name,
      email: userInfo.email
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData({
      name: userInfo.name,
      email: userInfo.email
    })
  }

  const handleSave = async () => {
    if (!editData.name.trim()) {
      toast.error('Name is required')
      return
    }

    if (!editData.email.trim() || !/\S+@\S+\.\S+/.test(editData.email)) {
      toast.error('Valid email is required')
      return
    }

    setIsUpdating(true)
    try {
      await onUpdate(editData)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // TODO: Implement photo upload
      toast.success('Profile photo updated!')
    }
  }

  const formatJoinDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="card relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-teal-500/10 rounded-full transform translate-x-16 -translate-y-16"></div>
      
      <div className="card-content relative">
        {/* Profile Photo Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative group">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {userInfo.name.charAt(0).toUpperCase()}
            </div>
            
            {/* Photo Upload Overlay */}
            <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera size={20} className="text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          </div>
          
          {/* Edit Button */}
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="mt-3 flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <Edit3 size={14} />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        {/* Profile Information */}
        <div className="space-y-4">
          {isEditing ? (
            /* Edit Mode */
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={editData.name}
                    onChange={handleInputChange}
                    className="input pl-9 text-sm"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={16} className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={editData.email}
                    onChange={handleInputChange}
                    className="input pl-9 text-sm"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                <button
                  onClick={handleSave}
                  disabled={isUpdating}
                  className="flex-1 btn-primary text-sm flex items-center justify-center space-x-1"
                >
                  <Save size={14} />
                  <span>{isUpdating ? 'Saving...' : 'Save'}</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 btn-secondary text-sm flex items-center justify-center space-x-1"
                >
                  <X size={14} />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          ) : (
            /* View Mode */
            <div className="space-y-4">
              {/* Name */}
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-1">{userInfo.name}</h2>
                <p className="text-gray-600 text-sm">{userInfo.email}</p>
              </div>

              {/* User Details */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Hash size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">User ID</p>
                    <p className="text-sm font-medium text-gray-900">{userInfo.userId}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Calendar size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Member Since</p>
                    <p className="text-sm font-medium text-gray-900">{formatJoinDate(userInfo.joinedDate)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <User size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Total Transactions</p>
                    <p className="text-sm font-medium text-gray-900">{userInfo.totalTransactions}</p>
                  </div>
                </div>
              </div>

              {/* Account Status */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Account Status</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfileCard
