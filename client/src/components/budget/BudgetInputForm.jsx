import React, { useState, useEffect } from 'react'
import { Plus, Edit3, Trash2, Save, X, Target, Sliders } from 'lucide-react'
import toast from 'react-hot-toast'

const BudgetInputForm = ({ month, categories, savingsGoal, onUpdate, onCategoryUpdate }) => {
  const [formData, setFormData] = useState({
    categories: [],
    savingsGoal: 0
  })
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [newCategory, setNewCategory] = useState({
    name: '',
    budgetAmount: '',
    color: '#3B82F6'
  })

  // Predefined category options
  const predefinedCategories = [
    { name: 'Food', color: '#f87171', icon: '🍽️' },
    { name: 'Housing', color: '#60a5fa', icon: '🏠' },
    { name: 'Transportation', color: '#34d399', icon: '🚗' },
    { name: 'Entertainment', color: '#facc15', icon: '🎬' },
    { name: 'Shopping', color: '#a78bfa', icon: '🛍️' },
    { name: 'Utilities', color: '#fb7185', icon: '⚡' },
    { name: 'Healthcare', color: '#fbbf24', icon: '🏥' },
    { name: 'Education', color: '#10b981', icon: '📚' },
    { name: 'Travel', color: '#06b6d4', icon: '✈️' },
    { name: 'Insurance', color: '#8b5cf6', icon: '🛡️' }
  ]

  useEffect(() => {
    setFormData({
      categories: categories || [],
      savingsGoal: savingsGoal || 0
    })
  }, [categories, savingsGoal])

  const handleSavingsGoalChange = (value) => {
    const numValue = parseFloat(value) || 0
    setFormData(prev => ({ ...prev, savingsGoal: numValue }))
  }

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      toast.error('Category name is required')
      return
    }

    if (!newCategory.budgetAmount || parseFloat(newCategory.budgetAmount) <= 0) {
      toast.error('Budget amount must be greater than 0')
      return
    }

    const categoryExists = formData.categories.some(
      cat => cat.name.toLowerCase() === newCategory.name.toLowerCase()
    )

    if (categoryExists) {
      toast.error('Category already exists')
      return
    }

    const updatedCategories = [
      ...formData.categories,
      {
        name: newCategory.name.trim(),
        budgetAmount: parseFloat(newCategory.budgetAmount),
        color: newCategory.color,
        spentAmount: 0
      }
    ]

    setFormData(prev => ({ ...prev, categories: updatedCategories }))
    setNewCategory({ name: '', budgetAmount: '', color: '#3B82F6' })
    setShowAddCategory(false)
    
    // Auto-save the new category
    onCategoryUpdate(newCategory.name.trim(), parseFloat(newCategory.budgetAmount), newCategory.color)
  }

  const handleEditCategory = (index) => {
    setEditingCategory(index)
  }

  const handleSaveCategory = (index) => {
    const category = formData.categories[index]
    onCategoryUpdate(category.name, category.budgetAmount, category.color)
    setEditingCategory(null)
  }

  const handleDeleteCategory = (index) => {
    const updatedCategories = formData.categories.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, categories: updatedCategories }))
    
    // Update the budget
    onUpdate({
      categories: updatedCategories,
      savingsGoal: formData.savingsGoal
    })
  }

  const handleCategoryChange = (index, field, value) => {
    const updatedCategories = [...formData.categories]
    updatedCategories[index] = {
      ...updatedCategories[index],
      [field]: field === 'budgetAmount' ? parseFloat(value) || 0 : value
    }
    setFormData(prev => ({ ...prev, categories: updatedCategories }))
  }

  const handleSaveBudget = () => {
    onUpdate({
      categories: formData.categories,
      savingsGoal: formData.savingsGoal
    })
  }

  const selectPredefinedCategory = (predefined) => {
    setNewCategory({
      name: predefined.name,
      budgetAmount: '',
      color: predefined.color
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const totalBudget = formData.categories.reduce((sum, cat) => sum + cat.budgetAmount, 0)

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center space-x-2">
          <Target size={20} className="text-blue-600" />
          <h3 className="card-title">Set Monthly Budget</h3>
        </div>
        <p className="card-description">
          Plan your spending for {new Date(`${month}-01`).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </div>
      
      <div className="card-content space-y-6">
        {/* Savings Goal */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Target size={16} className="text-green-600" />
              <span className="font-medium text-green-800">Monthly Savings Goal</span>
            </div>
            <span className="text-sm text-green-600">
              {((formData.savingsGoal / (totalBudget + formData.savingsGoal)) * 100 || 0).toFixed(1)}% of income
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <input
                type="number"
                value={formData.savingsGoal}
                onChange={(e) => handleSavingsGoalChange(e.target.value)}
                placeholder="Enter savings goal"
                className="input w-full"
                min="0"
                step="100"
              />
            </div>
            <span className="text-lg font-semibold text-green-700">
              {formatCurrency(formData.savingsGoal)}
            </span>
          </div>
        </div>

        {/* Categories List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">Budget Categories</h4>
            <button
              onClick={() => setShowAddCategory(true)}
              className="btn-primary text-sm flex items-center space-x-1"
            >
              <Plus size={16} />
              <span>Add Category</span>
            </button>
          </div>

          {formData.categories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Sliders size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No categories added yet</p>
              <p className="text-sm">Start by adding your first budget category</p>
            </div>
          ) : (
            <div className="space-y-3">
              {formData.categories.map((category, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      
                      {editingCategory === index ? (
                        <div className="flex items-center space-x-2 flex-1">
                          <input
                            type="text"
                            value={category.name}
                            onChange={(e) => handleCategoryChange(index, 'name', e.target.value)}
                            className="input flex-1"
                          />
                          <input
                            type="number"
                            value={category.budgetAmount}
                            onChange={(e) => handleCategoryChange(index, 'budgetAmount', e.target.value)}
                            className="input w-32"
                            min="0"
                            step="100"
                          />
                          <input
                            type="color"
                            value={category.color}
                            onChange={(e) => handleCategoryChange(index, 'color', e.target.value)}
                            className="w-8 h-8 rounded border border-gray-300"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-between flex-1">
                          <span className="font-medium text-gray-900">{category.name}</span>
                          <span className="text-lg font-semibold text-gray-700">
                            {formatCurrency(category.budgetAmount)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {editingCategory === index ? (
                        <>
                          <button
                            onClick={() => handleSaveCategory(index)}
                            className="p-1 text-green-600 hover:text-green-700"
                          >
                            <Save size={16} />
                          </button>
                          <button
                            onClick={() => setEditingCategory(null)}
                            className="p-1 text-gray-600 hover:text-gray-700"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditCategory(index)}
                            className="p-1 text-blue-600 hover:text-blue-700"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(index)}
                            className="p-1 text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Category Form */}
        {showAddCategory && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h5 className="font-medium text-blue-900 mb-3">Add New Category</h5>
            
            {/* Predefined Categories */}
            <div className="mb-4">
              <p className="text-sm text-blue-700 mb-2">Quick select:</p>
              <div className="flex flex-wrap gap-2">
                {predefinedCategories
                  .filter(pred => !formData.categories.some(cat => cat.name === pred.name))
                  .map((predefined) => (
                    <button
                      key={predefined.name}
                      onClick={() => selectPredefinedCategory(predefined)}
                      className="px-3 py-1 text-xs bg-white border border-blue-300 rounded-full hover:bg-blue-50 transition-colors flex items-center space-x-1"
                    >
                      <span>{predefined.icon}</span>
                      <span>{predefined.name}</span>
                    </button>
                  ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <input
                type="text"
                placeholder="Category name"
                value={newCategory.name}
                onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                className="input"
              />
              <input
                type="number"
                placeholder="Budget amount"
                value={newCategory.budgetAmount}
                onChange={(e) => setNewCategory(prev => ({ ...prev, budgetAmount: e.target.value }))}
                className="input"
                min="0"
                step="100"
              />
              <input
                type="color"
                value={newCategory.color}
                onChange={(e) => setNewCategory(prev => ({ ...prev, color: e.target.value }))}
                className="input h-10"
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleAddCategory}
                className="btn-primary text-sm"
              >
                Add Category
              </button>
              <button
                onClick={() => {
                  setShowAddCategory(false)
                  setNewCategory({ name: '', budgetAmount: '', color: '#3B82F6' })
                }}
                className="btn-secondary text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Total Budget Summary */}
        {formData.categories.length > 0 && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">Total Monthly Budget:</span>
              <span className="text-xl font-bold text-gray-900">
                {formatCurrency(totalBudget)}
              </span>
            </div>
            <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
              <span>Plus Savings Goal:</span>
              <span>{formatCurrency(formData.savingsGoal)}</span>
            </div>
            <div className="flex items-center justify-between mt-1 pt-2 border-t border-gray-300">
              <span className="font-medium text-gray-900">Total Required Income:</span>
              <span className="text-lg font-bold text-blue-600">
                {formatCurrency(totalBudget + formData.savingsGoal)}
              </span>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveBudget}
            className="btn-primary flex items-center space-x-2"
          >
            <Save size={16} />
            <span>Save Budget</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default BudgetInputForm
