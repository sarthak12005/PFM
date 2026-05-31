import React, { useState, useEffect } from 'react'
import { Plus, Edit3, Trash2, Save, X, Target, Sliders } from 'lucide-react'
import toast from 'react-hot-toast'
import { categoriesAPI } from '../../services/api'
// fallback for development if API not available
import { STANDARD_CATEGORIES } from '../../constants/categories'

const BudgetInputForm = ({ month, categories, savingsGoal, onUpdate, onCategoryUpdate }) => {
  const [formData, setFormData] = useState({
    categories: [],
    savingsGoal: 0
  })
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [selectedCategoryName, setSelectedCategoryName] = useState('')
  const [budgetAmount, setBudgetAmount] = useState('')

  // Use standardized expense categories fetched from API
  const [expenseCategories, setExpenseCategories] = React.useState(STANDARD_CATEGORIES.expense || [])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res = await categoriesAPI.getAll({ type: 'expense' })
        if (mounted) setExpenseCategories(res.data.data || [])
      } catch (err) {
        // keep fallback
        console.error('Failed to load expense categories:', err)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

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
    if (!selectedCategoryName.trim()) {
      toast.error('Please select a category')
      return
    }

    if (!budgetAmount || parseFloat(budgetAmount) <= 0) {
      toast.error('Budget amount must be greater than 0')
      return
    }

    const categoryExists = formData.categories.some(
      cat => cat.name === selectedCategoryName
    )

    if (categoryExists) {
      toast.error(`${selectedCategoryName} is already in your budget`)
      return
    }

    // Get category details from standard categories
    const categoryDetails = expenseCategories.find(cat => cat.name === selectedCategoryName)

    const updatedCategories = [
      ...formData.categories,
      {
        name: selectedCategoryName,
        budgetAmount: parseFloat(budgetAmount),
        color: categoryDetails?.color || '#3B82F6',
        spentAmount: 0
      }
    ]

    setFormData(prev => ({ ...prev, categories: updatedCategories }))
    setSelectedCategoryName('')
    setBudgetAmount('')
    setShowAddCategory(false)
    
    // Auto-save the new category
    onCategoryUpdate(selectedCategoryName, parseFloat(budgetAmount), categoryDetails?.color || '#3B82F6')
  }

  const handleEditCategory = (index) => {
    setEditingCategory(index)
  }

  const handleSaveCategory = (index) => {
    const category = formData.categories[index]
    
    if (!category.budgetAmount || parseFloat(category.budgetAmount) <= 0) {
      toast.error('Budget amount must be greater than 0')
      return
    }

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

        {/* Add Category Form - Category Selection Only (No Custom Categories) */}
        {showAddCategory && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h5 className="font-medium text-blue-900 mb-4">Select Category to Budget</h5>
            <p className="text-xs text-blue-700 mb-4">Choose from available categories. You can only budget for predefined categories.</p>
            
            <div className="space-y-3">
              {/* Category Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategoryName}
                  onChange={(e) => setSelectedCategoryName(e.target.value)}
                  className="input w-full"
                >
                  <option value="">-- Select a Category --</option>
                  {expenseCategories
                    .filter(cat => !formData.categories.some(budgeted => budgeted.name === cat.name))
                    .map(category => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Budget Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget Amount</label>
                <input
                  type="number"
                  placeholder="Enter budget amount"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                  className="input w-full"
                  min="0"
                  step="100"
                />
              </div>

              {/* Category Preview */}
              {selectedCategoryName && (
                <div className="p-3 bg-white border border-blue-200 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Preview:</p>
                  <div className="flex items-center space-x-2">
                    {expenseCategories.find(cat => cat.name === selectedCategoryName) && (
                      <>
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: expenseCategories.find(cat => cat.name === selectedCategoryName)?.color }}
                        ></div>
                        <span className="font-medium text-gray-900">{selectedCategoryName}</span>
                        <span className="text-gray-600">-</span>
                        <span className="text-gray-700">{formatCurrency(parseFloat(budgetAmount) || 0)}</span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex space-x-2 mt-4">
              <button
                onClick={handleAddCategory}
                className="btn-primary text-sm"
              >
                <Plus size={16} className="mr-1" />
                Add to Budget
              </button>
              <button
                onClick={() => {
                  setShowAddCategory(false)
                  setSelectedCategoryName('')
                  setBudgetAmount('')
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
