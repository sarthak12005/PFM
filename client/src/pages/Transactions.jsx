import React, { useState, useEffect } from 'react'
import {
  Plus,
  Filter,
  Search,
  Edit3,
  Trash2,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  X,
  PieChart,
  Target,
  Tag
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCategories } from '../context/CategoriesContext'
import { transactionsAPI } from '../services/api'
import { AddTransactionForm } from '../components/forms'
import TransactionTable from '../components/transactions/TransactionTable'
import { EditTransactionModal } from '../components/modals'
import FiltersBar from '../components/filters/FiltersBar'
import { LoadingSpinner } from '../components/ui'
import toast from 'react-hot-toast'

const Transactions = () => {
  const { user } = useAuth()
  const { allCategoryNames, refreshCategories } = useCategories()
  const [transactions, setTransactions] = useState([])
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    category: '',
    dateFrom: '',
    dateTo: ''
  })



  useEffect(() => {
    fetchTransactions()
  }, [filters])

  useEffect(() => {
    applyFilters()
  }, [transactions, filters])

  const fetchTransactions = async () => {
    setLoading(true)
    try {
      const response = await transactionsAPI.getAll({
        page: 1,
        limit: 100,
        search: filters.search,
        type: filters.type,
        category: filters.category,
        startDate: filters.dateFrom,
        endDate: filters.dateTo
      })

      if (response.data.success) {
        setTransactions(response.data.data.transactions || [])
      } else {
        throw new Error(response.data.message || 'Failed to fetch transactions')
      }

    } catch (error) {
      console.error('Error fetching transactions:', error)
      toast.error('Failed to load transactions')
      // Set empty array when API fails
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...transactions]

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(transaction =>
        transaction.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        transaction.category.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    // Type filter
    if (filters.type) {
      filtered = filtered.filter(transaction => transaction.type === filters.type)
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(transaction => transaction.category === filters.category)
    }

    // Date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter(transaction =>
        new Date(transaction.date) >= new Date(filters.dateFrom)
      )
    }

    if (filters.dateTo) {
      filtered = filtered.filter(transaction =>
        new Date(transaction.date) <= new Date(filters.dateTo)
      )
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    setFilteredTransactions(filtered)
  }

  const handleAddTransaction = async (transactionData) => {
    const loadingToast = toast.loading('Adding transaction...')
    try {
      const response = await transactionsAPI.create(transactionData)

      if (response.data.success) {
        const newTransaction = response.data.data
        setTransactions(prev => [newTransaction, ...prev])
        setShowAddForm(false)

        // Refresh categories to update transaction counts
        refreshCategories()

        toast.success('Transaction added successfully!', { id: loadingToast })

        // Refresh transactions to get updated data
        fetchTransactions()

        // Show helpful messages about related features
        if (transactionData.type === 'expense') {
          setTimeout(() => {
            toast.success('💡 Check your Budget page to see how this affects your spending limits!', {
              duration: 4000
            })
          }, 1000)
        } else if (transactionData.type === 'income' && transactionData.category === 'Savings') {
          setTimeout(() => {
            toast.success('🎯 Visit Goals page to contribute this savings to your financial goals!', {
              duration: 4000
            })
          }, 1000)
        }
      } else {
        throw new Error(response.data.message || 'Failed to add transaction')
      }

    } catch (error) {
      console.error('Error adding transaction:', error)
      toast.error(error.response?.data?.message || 'Failed to add transaction', { id: loadingToast })
    }
  }

  const handleEditTransaction = async (id, transactionData) => {
    try {
      const response = await transactionsAPI.update(id, transactionData)

      if (response.data.success) {
        const updatedTransaction = response.data.data
        setTransactions(prev =>
          prev.map(transaction =>
            transaction._id === id ? updatedTransaction : transaction
          )
        )
        setEditingTransaction(null)
        toast.success('Transaction updated successfully!')

        // Refresh transactions to get updated data
        fetchTransactions()
      } else {
        throw new Error(response.data.message || 'Failed to update transaction')
      }

    } catch (error) {
      console.error('Error updating transaction:', error)
      toast.error(error.response?.data?.message || 'Failed to update transaction')
    }
  }

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return
    }

    try {
      const response = await transactionsAPI.delete(id)

      if (response.data.success) {
        setTransactions(prev => prev.filter(transaction => transaction._id !== id))
        toast.success('Transaction deleted successfully!')

        // Refresh transactions to get updated data
        fetchTransactions()
      } else {
        throw new Error(response.data.message || 'Failed to delete transaction')
      }

    } catch (error) {
      console.error('Error deleting transaction:', error)
      toast.error(error.response?.data?.message || 'Failed to delete transaction')
    }
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      type: '',
      category: '',
      dateFrom: '',
      dateTo: ''
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

  // Calculate summary stats
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  if (loading) {
    return <LoadingSpinner message="Loading transactions..." />
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-1">Manage your income and expenses</p>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Enhanced Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 opacity-5 rounded-full transform translate-x-8 -translate-y-8"></div>
          <div className="card-content relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Income</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
                <p className="text-xs text-green-500 mt-1">+12.5% from last month</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl shadow-sm">
                <TrendingUp size={24} className="text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 opacity-5 rounded-full transform translate-x-8 -translate-y-8"></div>
          <div className="card-content relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
                <p className="text-xs text-red-500 mt-1">+8.2% from last month</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-red-100 to-red-200 rounded-xl shadow-sm">
                <TrendingDown size={24} className="text-red-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
          <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${totalIncome - totalExpenses >= 0 ? 'from-blue-500 to-blue-600' : 'from-red-500 to-red-600'} opacity-5 rounded-full transform translate-x-8 -translate-y-8`}></div>
          <div className="card-content relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Net Balance</p>
                <p className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {formatCurrency(totalIncome - totalExpenses)}
                </p>
                <p className={`text-xs mt-1 ${totalIncome - totalExpenses >= 0 ? 'text-blue-500' : 'text-red-500'}`}>
                  {totalIncome - totalExpenses >= 0 ? 'Positive balance' : 'Negative balance'}
                </p>
              </div>
              <div className={`p-3 bg-gradient-to-br ${totalIncome - totalExpenses >= 0 ? 'from-blue-100 to-blue-200' : 'from-red-100 to-red-200'} rounded-xl shadow-sm`}>
                <DollarSign size={24} className={totalIncome - totalExpenses >= 0 ? 'text-blue-600' : 'text-red-600'} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => window.location.href = '/budget'}
          className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <PieChart size={20} />
            </div>
            <div className="text-left">
              <p className="font-semibold">Check Budget</p>
              <p className="text-sm opacity-90">See how your spending affects budget limits</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => window.location.href = '/goals'}
          className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Target size={20} />
            </div>
            <div className="text-left">
              <p className="font-semibold">Update Goals</p>
              <p className="text-sm opacity-90">Contribute savings to your financial goals</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => window.location.href = '/categories'}
          className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Tag size={20} />
            </div>
            <div className="text-left">
              <p className="font-semibold">Manage Categories</p>
              <p className="text-sm opacity-90">Add or edit transaction categories</p>
            </div>
          </div>
        </button>
      </div>

      {/* Filters Bar */}
      <FiltersBar
        filters={filters}
        setFilters={setFilters}
        onClearFilters={clearFilters}
        transactions={transactions}
      />

      {/* Transactions Table/List */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="card-title">All Transactions</h3>
              <p className="card-description">
                Showing {filteredTransactions.length} of {transactions.length} transactions
              </p>
            </div>
          </div>
        </div>
        <div className="card-content">
          <TransactionTable
            transactions={filteredTransactions}
            onEdit={setEditingTransaction}
            onDelete={handleDeleteTransaction}
            formatCurrency={formatCurrency}
          />
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Add Transaction</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <AddTransactionForm
                onSubmit={handleAddTransaction}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Transaction Modal */}
      {editingTransaction && (
        <EditTransactionModal
          transaction={editingTransaction}
          onSubmit={handleEditTransaction}
          onCancel={() => setEditingTransaction(null)}
        />
      )}
    </div>
  )
}

export default Transactions
