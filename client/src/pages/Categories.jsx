import React, { useState, useEffect } from 'react'
import {
  Tag,
  Plus,
  Edit3,
  Trash2,
  Search,
  Filter,
  Grid,
  List,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  ShoppingBag,
  Home,
  Car,
  Utensils,
  Gamepad2,
  Heart,
  GraduationCap,
  Plane,
  Shield,
  Clock
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { categoriesAPI, transactionsAPI } from '../services/api'
import { LoadingSpinner } from '../components/ui'
import toast from 'react-hot-toast'

const Categories = () => {
  const { user } = useAuth()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [categoryStats, setCategoryStats] = useState({
    totalCategories: 0,
    expenseCategories: 0,
    incomeCategories: 0,
    mostUsedCategory: null,
    recentTransactions: []
  })

  const iconOptions = [
    { name: 'ShoppingBag', icon: ShoppingBag, label: 'Shopping' },
    { name: 'Home', icon: Home, label: 'Home' },
    { name: 'Car', icon: Car, label: 'Transport' },
    { name: 'Utensils', icon: Utensils, label: 'Food & Utilis' },
    { name: 'Gamepad2', icon: Gamepad2, label: 'Entertainment' },
    { name: 'Heart', icon: Heart, label: 'Health' },
    { name: 'GraduationCap', icon: GraduationCap, label: 'Education' },
    { name: 'Plane', icon: Plane, label: 'Travel' },
    { name: 'Shield', icon: Shield, label: 'Insurance' },
    { name: 'DollarSign', icon: DollarSign, label: 'Finance' }
  ]

  const colorOptions = [
    'red', 'blue', 'green', 'yellow', 'purple', 'pink', 'indigo', 'orange', 'teal', 'gray'
  ]

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const [categoriesResponse, transactionsResponse] = await Promise.all([
        categoriesAPI.getAll({ includeStats: true }),
        transactionsAPI.getAll({ limit: 20, sortBy: 'date', sortOrder: 'desc' })
      ])

      if (categoriesResponse.data.success) {
        const categoriesData = categoriesResponse.data.data || []
        setCategories(categoriesData)

        // Calculate statistics
        const expenseCategories = categoriesData.filter(cat => cat.type === 'expense')
        const incomeCategories = categoriesData.filter(cat => cat.type === 'income')
        const mostUsed = categoriesData.reduce((prev, current) =>
          (prev.transactionCount > current.transactionCount) ? prev : current,
          categoriesData[0] || null
        )

        setCategoryStats({
          totalCategories: categoriesData.length,
          expenseCategories: expenseCategories.length,
          incomeCategories: incomeCategories.length,
          mostUsedCategory: mostUsed,
          recentTransactions: transactionsResponse.data.success ?
            (transactionsResponse.data.data.transactions || []).slice(0, 5) : []
        })
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Failed to load categories')
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  const getIcon = (iconName) => {
    const iconOption = iconOptions.find(opt => opt.name === iconName)
    return iconOption ? iconOption.icon : Tag
  }

  const getCategoryColorClasses = (color) => {
    const colorMap = {
      'red': 'bg-gradient-to-r from-red-500 to-red-600',
      'blue': 'bg-gradient-to-r from-blue-500 to-blue-600',
      'green': 'bg-gradient-to-r from-green-500 to-green-600',
      'yellow': 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      'purple': 'bg-gradient-to-r from-purple-500 to-purple-600',
      'pink': 'bg-gradient-to-r from-pink-500 to-pink-600',
      'indigo': 'bg-gradient-to-r from-indigo-500 to-indigo-600',
      'orange': 'bg-gradient-to-r from-orange-500 to-orange-600',
      'teal': 'bg-gradient-to-r from-teal-500 to-teal-600',
      'gray': 'bg-gradient-to-r from-gray-500 to-gray-600'
    }
    return colorMap[color] || colorMap['gray']
  }

  const getCategoryIconClasses = (color) => {
    const colorMap = {
      'red': 'bg-red-100 text-red-600',
      'blue': 'bg-blue-100 text-blue-600',
      'green': 'bg-green-100 text-green-600',
      'yellow': 'bg-yellow-100 text-yellow-600',
      'purple': 'bg-purple-100 text-purple-600',
      'pink': 'bg-pink-100 text-pink-600',
      'indigo': 'bg-indigo-100 text-indigo-600',
      'orange': 'bg-orange-100 text-orange-600',
      'teal': 'bg-teal-100 text-teal-600',
      'gray': 'bg-gray-100 text-gray-600'
    }
    return colorMap[color] || colorMap['gray']
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const filteredCategories = categories.filter(category => {
    const matchesFilter = filter === 'all' || category.type === filter
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return
    }

    const loadingToast = toast.loading('Deleting category...')
    try {
      const response = await categoriesAPI.delete(categoryId)
      if (response.data.success) {
        setCategories(prev => prev.filter(cat => cat._id !== categoryId))
        toast.success('Category deleted successfully!', { id: loadingToast })
      } else {
        throw new Error(response.data.message || 'Failed to delete category')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error(error.response?.data?.message || 'Failed to delete category', { id: loadingToast })
    }
  }

  const handleAddCategory = async (categoryData) => {
    const loadingToast = toast.loading('Creating category...')
    try {
      const response = await categoriesAPI.create(categoryData)
      if (response.data.success) {
        setCategories(prev => [...prev, response.data.data])
        setShowAddModal(false)
        toast.success('Category created successfully!', { id: loadingToast })
      } else {
        throw new Error(response.data.message || 'Failed to create category')
      }
    } catch (error) {
      console.error('Error creating category:', error)
      toast.error(error.response?.data?.message || 'Failed to create category', { id: loadingToast })
    }
  }

  const handleEditCategory = async (categoryId, categoryData) => {
    const loadingToast = toast.loading('Updating category...')
    try {
      const response = await categoriesAPI.update(categoryId, categoryData)
      if (response.data.success) {
        setCategories(prev => prev.map(cat =>
          cat._id === categoryId ? response.data.data : cat
        ))
        setEditingCategory(null)
        toast.success('Category updated successfully!', { id: loadingToast })
      } else {
        throw new Error(response.data.message || 'Failed to update category')
      }
    } catch (error) {
      console.error('Error updating category:', error)
      toast.error(error.response?.data?.message || 'Failed to update category', { id: loadingToast })
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading categories..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Tag size={32} />
                <h1 className="text-3xl font-bold">Categories</h1>
              </div>
              <p className="text-lg opacity-90">Organize your transactions with custom categories</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add Category</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Categories</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              </div>
              <Tag className="text-indigo-500" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Income Categories</p>
                <p className="text-2xl font-bold text-green-600">
                  {categories.filter(c => c.type === 'income').length}
                </p>
              </div>
              <TrendingUp className="text-green-500" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Expense Categories</p>
                <p className="text-2xl font-bold text-red-600">
                  {categories.filter(c => c.type === 'expense').length}
                </p>
              </div>
              <TrendingDown className="text-red-500" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Custom Categories</p>
                <p className="text-2xl font-bold text-purple-600">
                  {categories.filter(c => !c.isDefault).length}
                </p>
              </div>
              <BarChart3 className="text-purple-500" size={24} />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {/* View Mode */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Category Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Most Used Category */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp size={20} className="text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900">Most Active Category</h3>
            </div>
            {categoryStats.mostUsedCategory ? (
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${getCategoryIconClasses(categoryStats.mostUsedCategory.color)}`}>
                  {React.createElement(getIcon(categoryStats.mostUsedCategory.icon), { size: 24 })}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{categoryStats.mostUsedCategory.name}</p>
                  <p className="text-sm text-gray-500">
                    {categoryStats.mostUsedCategory.transactionCount} transactions • {formatCurrency(categoryStats.mostUsedCategory.totalAmount)}
                  </p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                    categoryStats.mostUsedCategory.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {categoryStats.mostUsedCategory.type}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No category data available</p>
            )}
          </div>

          {/* Recent Category Usage */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Clock size={20} className="text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">Recent Usage</h3>
            </div>
            <div className="space-y-3">
              {categoryStats.recentTransactions.map((transaction) => (
                <div key={transaction._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{transaction.title}</p>
                    <p className="text-sm text-gray-500">{transaction.category}</p>
                  </div>
                  <div className="text-right">
                    <span className={`font-semibold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </span>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {categoryStats.recentTransactions.length === 0 && (
                <p className="text-gray-500 text-center py-4">No recent transactions</p>
              )}
            </div>
          </div>
        </div>

        {/* Categories Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map(category => {
              const Icon = getIcon(category.icon)
              const headerClasses = getCategoryColorClasses(category.color)
              return (
                <div key={category._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  {/* Header */}
                  <div className={`${headerClasses} text-white p-4`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon size={24} />
                        <div>
                          <h3 className="font-semibold">{category.name}</h3>
                          <p className="text-sm opacity-90 capitalize">{category.type}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingCategory(category)}
                          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                          <Edit3 size={16} />
                        </button>
                        {!category.isDefault && (
                          <button
                            onClick={() => handleDeleteCategory(category._id)}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">{category.description}</p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Transactions</p>
                        <p className="font-bold text-gray-900">{category.transactionCount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="font-bold text-gray-900">{formatCurrency(category.totalAmount)}</p>
                      </div>
                    </div>

                    {/* Default Badge */}
                    {category.isDefault && (
                      <span className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                        Default Category
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transactions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCategories.map(category => {
                    const Icon = getIcon(category.icon)
                    const iconClasses = getCategoryIconClasses(category.color)
                    return (
                      <tr key={category._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 ${iconClasses} rounded-lg`}>
                              <Icon size={20} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{category.name}</p>
                              <p className="text-sm text-gray-500">{category.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            category.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {category.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {category.transactionCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(category.totalAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setEditingCategory(category)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <Edit3 size={16} />
                            </button>
                            {!category.isDefault && (
                              <button
                                onClick={() => handleDeleteCategory(category._id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-16">
            <Tag size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No categories found</h3>
            <p className="text-gray-500 mb-4">Create your first custom category to get started</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Create Category
            </button>
          </div>
        )}
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <CategoryModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddCategory}
          iconOptions={iconOptions}
          title="Add New Category"
        />
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <CategoryModal
          isOpen={!!editingCategory}
          onClose={() => setEditingCategory(null)}
          onSubmit={(data) => handleEditCategory(editingCategory._id, data)}
          iconOptions={iconOptions}
          title="Edit Category"
          initialData={editingCategory}
        />
      )}
    </div>
  )
}

// Category Modal Component
const CategoryModal = ({ isOpen, onClose, onSubmit, iconOptions, title, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    type: initialData?.type || 'expense',
    icon: initialData?.icon || 'Tag',
    color: initialData?.color || 'blue',
    description: initialData?.description || ''
  })

  const colorOptions = [
    { value: 'red', label: 'Red', class: 'bg-red-500' },
    { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
    { value: 'green', label: 'Green', class: 'bg-green-500' },
    { value: 'yellow', label: 'Yellow', class: 'bg-yellow-500' },
    { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
    { value: 'pink', label: 'Pink', class: 'bg-pink-500' },
    { value: 'indigo', label: 'Indigo', class: 'bg-indigo-500' },
    { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
    { value: 'teal', label: 'Teal', class: 'bg-teal-500' },
    { value: 'gray', label: 'Gray', class: 'bg-gray-500' }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validation
    if (!formData.name.trim()) {
      toast.error('Please enter a category name')
      return
    }

    const categoryData = {
      ...formData,
      name: formData.name.trim()
    }

    onSubmit(categoryData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., Groceries"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon
              </label>
              <div className="grid grid-cols-5 gap-2">
                {iconOptions.map((option) => {
                  const IconComponent = option.icon
                  return (
                    <button
                      key={option.name}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: option.name })}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        formData.icon === option.name
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <IconComponent size={20} className="mx-auto" />
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <div className="grid grid-cols-5 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: color.value })}
                    className={`w-8 h-8 rounded-full ${color.class} ${
                      formData.color === color.value
                        ? 'ring-2 ring-offset-2 ring-gray-400'
                        : ''
                    }`}
                    title={color.label}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows={3}
                placeholder="Describe this category..."
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                {initialData ? 'Update Category' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Categories
