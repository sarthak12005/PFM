import React, { useState, useEffect } from 'react'
import {
  Plus,
  Edit,
  Trash2,
  Users,
  DollarSign,
  Star,
  Crown,
  Check,
  X
} from 'lucide-react'
import { LoadingSpinner } from '../../components/ui'
import toast from 'react-hot-toast'

const MembershipManagement = () => {
  const [loading, setLoading] = useState(true)
  const [memberships, setMemberships] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedMembership, setSelectedMembership] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    fetchMemberships()
  }, [])

  const fetchMemberships = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch('/api/memberships/admin/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch memberships')
      }

      const data = await response.json()
      setMemberships(data.data.memberships)
    } catch (error) {
      console.error('Error fetching memberships:', error)
      toast.error('Failed to load memberships')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateMembership = async (membershipData) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/memberships', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(membershipData)
      })

      if (!response.ok) {
        throw new Error('Failed to create membership')
      }

      toast.success('Membership created successfully')
      fetchMemberships()
      setShowCreateModal(false)
    } catch (error) {
      console.error('Error creating membership:', error)
      toast.error('Failed to create membership')
    }
  }

  const handleEditMembership = (membership) => {
    setSelectedMembership(membership)
    setShowEditModal(true)
  }

  const handleUpdateMembership = async (membershipId, updates) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/memberships/${membershipId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        throw new Error('Failed to update membership')
      }

      toast.success('Membership updated successfully')
      fetchMemberships()
      setShowEditModal(false)
    } catch (error) {
      console.error('Error updating membership:', error)
      toast.error('Failed to update membership')
    }
  }

  const handleDeleteMembership = async (membershipId) => {
    if (!confirm('Are you sure you want to delete this membership?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/memberships/${membershipId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete membership')
      }

      toast.success('Membership deleted successfully')
      fetchMemberships()
    } catch (error) {
      console.error('Error deleting membership:', error)
      toast.error('Failed to delete membership')
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getTierBadgeColor = (tier) => {
    switch (tier) {
      case 'free':
        return 'bg-gray-100 text-gray-800'
      case 'premium':
        return 'bg-blue-100 text-blue-800'
      case 'enterprise':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Membership Management</h1>
            <p className="text-gray-600 mt-2">
              Manage subscription tiers and pricing plans.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Membership
          </button>
        </div>

        {/* Memberships Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memberships.map((membership) => (
            <div key={membership._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative">
              {/* Popular Badge */}
              {membership.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Header */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-2">
                  <Crown className={`h-6 w-6 mr-2 ${
                    membership.tier === 'enterprise' ? 'text-purple-500' :
                    membership.tier === 'premium' ? 'text-blue-500' : 'text-gray-400'
                  }`} />
                  <h3 className="text-xl font-bold text-gray-900">{membership.name}</h3>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTierBadgeColor(membership.tier)}`}>
                  {membership.tier}
                </span>
              </div>

              {/* Pricing */}
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900">
                  {formatCurrency(membership.effectiveMonthlyPrice || membership.pricing.monthly)}
                  <span className="text-lg font-normal text-gray-500">/month</span>
                </div>
                {membership.pricing.yearly > 0 && (
                  <div className="text-sm text-gray-500 mt-1">
                    {formatCurrency(membership.effectiveYearlyPrice || membership.pricing.yearly)}/year
                    {membership.yearlySavings > 0 && (
                      <span className="text-green-600 ml-1">
                        (Save {formatCurrency(membership.yearlySavings)})
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-6 text-center">
                {membership.description}
              </p>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {membership.features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{feature.name}</div>
                      <div className="text-xs text-gray-500">{feature.description}</div>
                    </div>
                  </div>
                ))}
                {membership.features.length > 4 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{membership.features.length - 4} more features
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6 p-3 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Users className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {membership.statistics?.activeSubscribers || 0}
                  </div>
                  <div className="text-xs text-gray-500">Active</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(membership.statistics?.monthlyRevenue || 0)}
                  </div>
                  <div className="text-xs text-gray-500">Revenue</div>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-center mb-4">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  membership.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {membership.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Actions */}
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => handleEditMembership(membership)}
                  className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteMembership(membership._id)}
                  className="flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {memberships.length === 0 && (
          <div className="text-center py-12">
            <Crown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No memberships found</h3>
            <p className="text-gray-500 mb-4">Create your first membership plan to get started.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Membership
            </button>
          </div>
        )}
      </div>

      {/* Create Membership Modal */}
      {showCreateModal && (
        <CreateMembershipModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateMembership}
        />
      )}

      {/* Edit Membership Modal */}
      {showEditModal && selectedMembership && (
        <EditMembershipModal
          membership={selectedMembership}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateMembership}
        />
      )}
    </div>
  )
}

// Create Membership Modal Component
const CreateMembershipModal = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    tier: 'free',
    description: '',
    pricing: {
      monthly: 0,
      yearly: 0,
      currency: 'INR'
    },
    features: [
      { name: '', description: '', icon: 'check', isHighlight: false }
    ],
    isActive: true,
    isPopular: false
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onCreate(formData)
  }

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, { name: '', description: '', icon: 'check', isHighlight: false }]
    }))
  }

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const updateFeature = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => 
        i === index ? { ...feature, [field]: value } : feature
      )
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Membership</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tier</label>
              <select
                value={formData.tier}
                onChange={(e) => setFormData(prev => ({ ...prev, tier: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="free">Free</option>
                <option value="premium">Premium</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Price (₹)</label>
              <input
                type="number"
                min="0"
                value={formData.pricing.monthly}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  pricing: { ...prev.pricing, monthly: parseInt(e.target.value) || 0 }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Yearly Price (₹)</label>
              <input
                type="number"
                min="0"
                value={formData.pricing.yearly}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  pricing: { ...prev.pricing, yearly: parseInt(e.target.value) || 0 }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Features */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Features</label>
              <button
                type="button"
                onClick={addFeature}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Add Feature
              </button>
            </div>
            {formData.features.map((feature, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2 p-3 border border-gray-200 rounded-lg">
                <input
                  type="text"
                  placeholder="Feature name"
                  value={feature.name}
                  onChange={(e) => updateFeature(index, 'name', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Description"
                    value={feature.description}
                    onChange={(e) => updateFeature(index, 'description', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-900">Active</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isPopular}
                onChange={(e) => setFormData(prev => ({ ...prev, isPopular: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-900">Popular</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Create Membership
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Edit Membership Modal Component (similar to Create but with pre-filled data)
const EditMembershipModal = ({ membership, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: membership.name,
    tier: membership.tier,
    description: membership.description,
    pricing: membership.pricing,
    features: membership.features,
    isActive: membership.isActive,
    isPopular: membership.isPopular
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdate(membership._id, formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Membership</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Price (₹)</label>
              <input
                type="number"
                min="0"
                value={formData.pricing.monthly}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  pricing: { ...prev.pricing, monthly: parseInt(e.target.value) || 0 }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-900">Active</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isPopular}
                onChange={(e) => setFormData(prev => ({ ...prev, isPopular: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-900">Popular</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Update Membership
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MembershipManagement
