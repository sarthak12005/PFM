import React, { useState } from 'react'
import { DollarSign, Calendar, Tag, FileText, Plus, X } from 'lucide-react'
import { useCategories } from '../../context/CategoriesContext'

const AddTransactionForm = ({ onSubmit, onCancel, initialData = null }) => {
  const { expenseCategoryNames, incomeCategoryNames, loading: categoriesLoading } = useCategories()

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    amount: initialData?.amount || '',
    type: initialData?.type || 'expense',
    category: initialData?.category || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    description: initialData?.description || ''
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fallback categories if context is loading or empty
  const fallbackCategories = {
    expense: [
      'Food & Dining',
      'Transportation',
      'Shopping',
      'Entertainment',
      'Bills & Utilities',
      'Healthcare',
      'Education',
      'Travel',
      'Other'
    ],
    income: [
      'Salary',
      'Freelance',
      'Business',
      'Investment',
      'Gift',
      'Savings',
      'Other'
    ]
  }

  // Use context categories or fallback
  const categories = {
    expense: expenseCategoryNames.length > 0 ? expenseCategoryNames : fallbackCategories.expense,
    income: incomeCategoryNames.length > 0 ? incomeCategoryNames : fallbackCategories.income
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0'
    }

    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    if (!formData.date) {
      newErrors.date = 'Date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount)
      }
      
      await onSubmit(transactionData)
    } catch (error) {
      console.error('Error submitting transaction:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
          {initialData ? 'Edit Transaction' : 'Add New Transaction'}
        </h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors touch-target"
            aria-label="Close form"
          >
            <X size={20} className="text-gray-500" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Transaction Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Transaction Type
          </label>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-6">
            <label className="flex items-center touch-target">
              <input
                type="radio"
                name="type"
                value="expense"
                checked={formData.type === 'expense'}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="mr-3 text-red-600 focus:ring-red-500 w-4 h-4"
              />
              <span className="text-base sm:text-sm text-gray-700 font-medium">Expense</span>
            </label>
            <label className="flex items-center touch-target">
              <input
                type="radio"
                name="type"
                value="income"
                checked={formData.type === 'income'}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="mr-3 text-green-600 focus:ring-green-500 w-4 h-4"
              />
              <span className="text-base sm:text-sm text-gray-700 font-medium">Income</span>
            </label>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 sm:py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base sm:text-sm ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter transaction title"
              autoComplete="off"
              inputMode="text"
            />
          </div>
          {errors.title && (
            <p className="mt-2 text-sm text-red-600 font-medium">{errors.title}</p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount *
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 sm:py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base sm:text-sm ${
                errors.amount ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0.00"
              inputMode="decimal"
              pattern="[0-9]*"
            />
          </div>
          {errors.amount && (
            <p className="mt-2 text-sm text-red-600 font-medium">{errors.amount}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a category</option>
              {categories[formData.type].map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Add any additional notes..."
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
              formData.type === 'expense'
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Plus size={20} />
            )}
            <span>
              {isSubmitting
                ? 'Saving...'
                : initialData
                  ? 'Update Transaction'
                  : `Add ${formData.type === 'expense' ? 'Expense' : 'Income'}`
              }
            </span>
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default AddTransactionForm
