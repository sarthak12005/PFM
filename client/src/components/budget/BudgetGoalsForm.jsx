import React, { useState } from 'react'
import { Target, DollarSign, Plus, Trash2, Save, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'

const BudgetGoalsForm = ({ budgetGoals, onUpdate }) => {
  const [formData, setFormData] = useState({
    monthlySavingsGoal: budgetGoals.monthlySavingsGoal,
    categoryLimits: { ...budgetGoals.categoryLimits }
  })
  const [newCategory, setNewCategory] = useState({ name: '', limit: '' })
  const [isUpdating, setIsUpdating] = useState(false)

  const predefinedCategories = [
    'Food',
    'Transportation',
    'Entertainment',
    'Shopping',
    'Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Insurance',
    'Housing'
  ]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleSavingsGoalChange = (e) => {
    const value = parseFloat(e.target.value) || 0
    setFormData(prev => ({
      ...prev,
      monthlySavingsGoal: value
    }))
  }

  const handleCategoryLimitChange = (category, value) => {
    const numericValue = parseFloat(value) || 0
    setFormData(prev => ({
      ...prev,
      categoryLimits: {
        ...prev.categoryLimits,
        [category]: numericValue
      }
    }))
  }

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      toast.error('Category name is required')
      return
    }

    if (!newCategory.limit || parseFloat(newCategory.limit) <= 0) {
      toast.error('Valid budget limit is required')
      return
    }

    if (formData.categoryLimits[newCategory.name]) {
      toast.error('Category already exists')
      return
    }

    setFormData(prev => ({
      ...prev,
      categoryLimits: {
        ...prev.categoryLimits,
        [newCategory.name]: parseFloat(newCategory.limit)
      }
    }))

    setNewCategory({ name: '', limit: '' })
    toast.success('Category added successfully!')
  }

  const handleRemoveCategory = (category) => {
    if (window.confirm(`Remove budget limit for ${category}?`)) {
      setFormData(prev => {
        const newLimits = { ...prev.categoryLimits }
        delete newLimits[category]
        return {
          ...prev,
          categoryLimits: newLimits
        }
      })
      toast.success('Category removed successfully!')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsUpdating(true)

    try {
      if (formData.monthlySavingsGoal < 0) {
        toast.error('Savings goal cannot be negative')
        return
      }

      await onUpdate(formData)
    } catch (error) {
      console.error('Error updating budget goals:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const totalCategoryBudget = Object.values(formData.categoryLimits).reduce((sum, limit) => sum + limit, 0)
  const savingsPercentage = totalCategoryBudget > 0 ? ((formData.monthlySavingsGoal / (totalCategoryBudget + formData.monthlySavingsGoal)) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Monthly Savings Goal */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center space-x-2">
            <Target size={20} className="text-green-600" />
            <h3 className="card-title">Monthly Savings Goal</h3>
          </div>
          <p className="card-description">Set your target savings amount for each month</p>
        </div>
        <div className="card-content">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="savingsGoal" className="block text-sm font-medium text-gray-700 mb-2">
                  Target Amount (₹)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign size={20} className="text-gray-400" />
                  </div>
                  <input
                    id="savingsGoal"
                    type="number"
                    min="0"
                    step="100"
                    value={formData.monthlySavingsGoal}
                    onChange={handleSavingsGoalChange}
                    className="input pl-10 text-lg font-semibold"
                    placeholder="10000"
                  />
                </div>
              </div>

              {/* Savings Progress Visualization */}
              {formData.monthlySavingsGoal > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-800">Monthly Savings Goal</span>
                    <span className="text-sm text-green-600">{formatCurrency(formData.monthlySavingsGoal)}</span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, savingsPercentage)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    {savingsPercentage.toFixed(1)}% of total budget allocated to savings
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Category Budget Limits */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center space-x-2">
            <TrendingUp size={20} className="text-blue-600" />
            <h3 className="card-title">Category Budget Limits</h3>
          </div>
          <p className="card-description">Set spending limits for different expense categories</p>
        </div>
        <div className="card-content">
          <div className="space-y-4">
            {/* Existing Categories */}
            <div className="space-y-3">
              {Object.entries(formData.categoryLimits).map(([category, limit]) => (
                <div key={category} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{category}</span>
                      <div className="flex items-center space-x-2">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                            <span className="text-gray-400 text-sm">₹</span>
                          </div>
                          <input
                            type="number"
                            min="0"
                            step="100"
                            value={limit}
                            onChange={(e) => handleCategoryLimitChange(category, e.target.value)}
                            className="w-24 pl-6 pr-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <button
                          onClick={() => handleRemoveCategory(category)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                          title="Remove category"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Category */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Add New Category</h4>
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <select
                    value={newCategory.name}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                    className="input text-sm"
                  >
                    <option value="">Select category</option>
                    {predefinedCategories
                      .filter(cat => !formData.categoryLimits[cat])
                      .map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    <option value="custom">Custom Category</option>
                  </select>
                </div>
                
                {newCategory.name === 'custom' && (
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Category name"
                      value={newCategory.customName || ''}
                      onChange={(e) => setNewCategory(prev => ({ 
                        ...prev, 
                        name: e.target.value,
                        customName: e.target.value 
                      }))}
                      className="input text-sm"
                    />
                  </div>
                )}
                
                <div className="w-24">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <span className="text-gray-400 text-sm">₹</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      placeholder="0"
                      value={newCategory.limit}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, limit: e.target.value }))}
                      className="input pl-6 text-sm"
                    />
                  </div>
                </div>
                
                <button
                  onClick={handleAddCategory}
                  className="btn-secondary p-2"
                  title="Add category"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Budget Summary */}
            {Object.keys(formData.categoryLimits).length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-800">Total Category Budget</span>
                  <span className="text-lg font-bold text-blue-900">{formatCurrency(totalCategoryBudget)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-600">Plus Savings Goal</span>
                  <span className="text-sm font-medium text-blue-700">{formatCurrency(formData.monthlySavingsGoal)}</span>
                </div>
                <div className="border-t border-blue-200 mt-2 pt-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-800">Total Monthly Budget</span>
                  <span className="text-lg font-bold text-blue-900">
                    {formatCurrency(totalCategoryBudget + formData.monthlySavingsGoal)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isUpdating}
          className="btn-primary flex items-center space-x-2"
        >
          <Save size={16} />
          <span>{isUpdating ? 'Saving...' : 'Save Budget Goals'}</span>
        </button>
      </div>
    </div>
  )
}

export default BudgetGoalsForm
