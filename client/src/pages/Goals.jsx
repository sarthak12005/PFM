import React, { useState, useEffect } from 'react'
import {
  Target,
  Plus,
  Edit3,
  Trash2,
  Calendar,
  DollarSign,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  PiggyBank,
  Home,
  Car,
  Plane,
  GraduationCap,
  Heart
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { goalsAPI, transactionsAPI } from '../services/api'
import { LoadingSpinner } from '../components/ui'
import toast from 'react-hot-toast'

const Goals = () => {
  const { user } = useAuth()
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [filter, setFilter] = useState('all')
  const [goalTransactions, setGoalTransactions] = useState({})
  const [savingsTransactions, setSavingsTransactions] = useState([])

  const goalTypes = [
    { value: 'emergency', label: 'Emergency Fund', icon: AlertCircle, color: 'red' },
    { value: 'vacation', label: 'Vacation', icon: Plane, color: 'blue' },
    { value: 'house', label: 'House/Property', icon: Home, color: 'green' },
    { value: 'car', label: 'Vehicle', icon: Car, color: 'purple' },
    { value: 'education', label: 'Education', icon: GraduationCap, color: 'indigo' },
    { value: 'retirement', label: 'Retirement', icon: PiggyBank, color: 'yellow' },
    { value: 'health', label: 'Health/Medical', icon: Heart, color: 'pink' },
    { value: 'other', label: 'Other', icon: Target, color: 'gray' }
  ]

  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
    setLoading(true)
    try {
      const [goalsResponse, savingsResponse] = await Promise.all([
        goalsAPI.getAll(),
        transactionsAPI.getAll({
          type: 'income',
          category: 'Savings',
          limit: 50,
          sortBy: 'date',
          sortOrder: 'desc'
        })
      ])

      if (goalsResponse.data.success) {
        const goalsData = goalsResponse.data.data || []
        setGoals(goalsData)

        // Fetch transactions for each goal to track automatic progress
        const goalTransactionPromises = goalsData.map(async (goal) => {
          try {
            const response = await transactionsAPI.getAll({
              type: 'income',
              description: goal.title, // Look for transactions mentioning the goal
              limit: 20
            })
            return { goalId: goal._id, transactions: response.data.data || [] }
          } catch (error) {
            return { goalId: goal._id, transactions: [] }
          }
        })

        const goalTransactionResults = await Promise.all(goalTransactionPromises)
        const goalTransactionMap = {}
        goalTransactionResults.forEach(result => {
          goalTransactionMap[result.goalId] = result.transactions
        })
        setGoalTransactions(goalTransactionMap)
      }

      if (savingsResponse.data.success) {
        setSavingsTransactions(savingsResponse.data.data || [])
      }

    } catch (error) {
      console.error('Error fetching goals:', error)
      toast.error('Failed to load goals')
      // Set empty array when API fails
      setGoals([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddGoal = async (goalData) => {
    const loadingToast = toast.loading('Creating goal...')
    try {
      const response = await goalsAPI.create(goalData)
      if (response.data.success) {
        setGoals(prev => [...prev, response.data.data])
        setShowAddModal(false)
        toast.success('Goal created successfully!', { id: loadingToast })
      } else {
        throw new Error(response.data.message || 'Failed to create goal')
      }
    } catch (error) {
      console.error('Error creating goal:', error)
      toast.error(error.response?.data?.message || 'Failed to create goal', { id: loadingToast })
    }
  }

  const handleEditGoal = async (goalId, goalData) => {
    const loadingToast = toast.loading('Updating goal...')
    try {
      const response = await goalsAPI.update(goalId, goalData)
      if (response.data.success) {
        setGoals(prev => prev.map(goal =>
          goal._id === goalId ? response.data.data : goal
        ))
        setEditingGoal(null)
        toast.success('Goal updated successfully!', { id: loadingToast })
      } else {
        throw new Error(response.data.message || 'Failed to update goal')
      }
    } catch (error) {
      console.error('Error updating goal:', error)
      toast.error(error.response?.data?.message || 'Failed to update goal', { id: loadingToast })
    }
  }

  const handleDeleteGoal = async (goalId) => {
    if (!window.confirm('Are you sure you want to delete this goal? This action cannot be undone.')) {
      return
    }

    const loadingToast = toast.loading('Deleting goal...')
    try {
      const response = await goalsAPI.delete(goalId)
      if (response.data.success) {
        setGoals(prev => prev.filter(goal => goal._id !== goalId))
        toast.success('Goal deleted successfully!', { id: loadingToast })
      } else {
        throw new Error(response.data.message || 'Failed to delete goal')
      }
    } catch (error) {
      console.error('Error deleting goal:', error)
      toast.error(error.response?.data?.message || 'Failed to delete goal', { id: loadingToast })
    }
  }

  const handleUpdateProgress = async (goalId, amount) => {
    const loadingToast = toast.loading('Updating progress...')
    try {
      const response = await goalsAPI.addProgress(goalId, { amount })
      if (response.data.success) {
        setGoals(prev => prev.map(goal =>
          goal._id === goalId ? response.data.data : goal
        ))
        toast.success('Progress updated successfully!', { id: loadingToast })

        // Refresh data to get updated transactions
        fetchGoals()
      } else {
        throw new Error(response.data.message || 'Failed to update progress')
      }
    } catch (error) {
      console.error('Error updating progress:', error)
      toast.error(error.response?.data?.message || 'Failed to update progress', { id: loadingToast })
    }
  }

  const handleAutoContribute = async (goalId) => {
    const goal = goals.find(g => g._id === goalId)
    if (!goal) return

    const recentSavings = (savingsTransactions || []).slice(0, 5)
    if (recentSavings.length === 0) {
      toast.error('No recent savings transactions found')
      return
    }

    const totalSavings = recentSavings.reduce((sum, t) => sum + t.amount, 0)
    const suggestedAmount = Math.min(totalSavings * 0.5, goal.targetAmount - goal.currentAmount)

    if (suggestedAmount <= 0) {
      toast.error('Goal is already completed or no savings available')
      return
    }

    const confirmed = window.confirm(
      `Contribute ${formatCurrency(suggestedAmount)} from recent savings to "${goal.title}"?`
    )

    if (confirmed) {
      await handleUpdateProgress(goalId, suggestedAmount)
    }
  }

  const getGoalIcon = (type) => {
    const goalType = goalTypes.find(gt => gt.value === type)
    return goalType ? goalType.icon : Target
  }

  const getGoalColorClasses = (type) => {
    const colorMap = {
      'emergency': {
        header: 'bg-gradient-to-r from-red-500 to-red-600',
        progress: 'bg-gradient-to-r from-red-500 to-red-600',
        button: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
      },
      'vacation': {
        header: 'bg-gradient-to-r from-blue-500 to-blue-600',
        progress: 'bg-gradient-to-r from-blue-500 to-blue-600',
        button: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
      },
      'house': {
        header: 'bg-gradient-to-r from-green-500 to-green-600',
        progress: 'bg-gradient-to-r from-green-500 to-green-600',
        button: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
      },
      'car': {
        header: 'bg-gradient-to-r from-purple-500 to-purple-600',
        progress: 'bg-gradient-to-r from-purple-500 to-purple-600',
        button: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
      },
      'education': {
        header: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
        progress: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
        button: 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700'
      },
      'retirement': {
        header: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
        progress: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
        button: 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700'
      },
      'health': {
        header: 'bg-gradient-to-r from-pink-500 to-pink-600',
        progress: 'bg-gradient-to-r from-pink-500 to-pink-600',
        button: 'bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700'
      },
      'other': {
        header: 'bg-gradient-to-r from-gray-500 to-gray-600',
        progress: 'bg-gradient-to-r from-gray-500 to-gray-600',
        button: 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700'
      }
    }
    return colorMap[type] || colorMap['other']
  }

  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100)
  }

  const getDaysLeft = (targetDate) => {
    const today = new Date()
    const target = new Date(targetDate)
    const diffTime = target - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const filteredGoals = goals.filter(goal => {
    if (filter === 'all') return true
    if (filter === 'active') return goal.status === 'active'
    if (filter === 'completed') return goal.status === 'completed'
    if (filter === 'paused') return goal.status === 'paused'
    return goal.type === filter
  })

  if (loading) {
    return <LoadingSpinner message="Loading your goals..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Target size={32} />
                <h1 className="text-3xl font-bold">Financial Goals</h1>
              </div>
              <p className="text-lg opacity-90">Track and achieve your financial dreams</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add Goal</span>
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
                <p className="text-sm text-gray-600">Total Goals</p>
                <p className="text-2xl font-bold text-gray-900">{goals.length}</p>
              </div>
              <Target className="text-blue-500" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Goals</p>
                <p className="text-2xl font-bold text-green-600">
                  {goals.filter(g => g.status === 'active').length}
                </p>
              </div>
              <TrendingUp className="text-green-500" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-blue-600">
                  {goals.filter(g => g.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="text-blue-500" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Target</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(goals.reduce((sum, g) => sum + g.targetAmount, 0))}
                </p>
              </div>
              <DollarSign className="text-purple-500" size={24} />
            </div>
          </div>
        </div>

        {/* Savings Insights */}
        {(savingsTransactions && savingsTransactions.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Recent Savings */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp size={20} className="text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Recent Savings</h3>
                </div>
                <span className="text-sm text-gray-500">Last 30 days</span>
              </div>
              <div className="space-y-3">
                {(savingsTransactions || []).slice(0, 5).map((transaction) => (
                  <div key={transaction._id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{transaction.title}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="font-semibold text-green-600">
                      +{formatCurrency(transaction.amount)}
                    </span>
                  </div>
                ))}
                <div className="pt-3 border-t border-green-200">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">Total Savings</span>
                    <span className="font-bold text-green-600">
                      +{formatCurrency((savingsTransactions || []).reduce((sum, t) => sum + t.amount, 0))}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Goal Suggestions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Target size={20} className="text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Smart Suggestions</h3>
              </div>
              <div className="space-y-4">
                {goals.filter(g => g.status === 'active').slice(0, 3).map((goal) => {
                  const remainingAmount = goal.targetAmount - goal.currentAmount
                  const recentSavingsTotal = (savingsTransactions || []).slice(0, 5).reduce((sum, t) => sum + t.amount, 0)
                  const suggestedContribution = Math.min(recentSavingsTotal * 0.3, remainingAmount)

                  if (suggestedContribution <= 0) return null

                  return (
                    <div key={goal._id} className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-gray-900">{goal.title}</p>
                        <button
                          onClick={() => handleAutoContribute(goal._id)}
                          className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors"
                        >
                          Auto Contribute
                        </button>
                      </div>
                      <p className="text-sm text-gray-600">
                        Suggested: {formatCurrency(suggestedContribution)} from recent savings
                      </p>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                        <div
                          className="bg-blue-600 h-1 rounded-full"
                          style={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
                {goals.filter(g => g.status === 'active').length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <Target size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Create active goals to see suggestions</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'active', 'completed', 'paused', ...goalTypes.map(gt => gt.value)].map(filterOption => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === filterOption
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {filterOption === 'all' ? 'All Goals' : 
               goalTypes.find(gt => gt.value === filterOption)?.label || 
               filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          ))}
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map(goal => {
            const Icon = getGoalIcon(goal.type)
            const progress = calculateProgress(goal.currentAmount, goal.targetAmount)
            const daysLeft = getDaysLeft(goal.targetDate)
            const colorClasses = getGoalColorClasses(goal.type)

            return (
              <div key={goal._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Header */}
                <div className={`${colorClasses.header} text-white p-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon size={24} />
                      <div>
                        <h3 className="font-semibold">{goal.title}</h3>
                        <p className="text-sm opacity-90">{goal.type}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingGoal(goal)}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteGoal(goal._id)}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{goal.description}</p>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm font-bold text-gray-900">{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`${colorClasses.progress} h-3 rounded-full transition-all duration-300`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Current</p>
                      <p className="font-bold text-gray-900">{formatCurrency(goal.currentAmount)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Target</p>
                      <p className="font-bold text-gray-900">{formatCurrency(goal.targetAmount)}</p>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Calendar size={14} />
                      <span>{new Date(goal.targetDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock size={14} />
                      <span className={daysLeft > 0 ? 'text-green-600' : 'text-red-600'}>
                        {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => {
                        const amount = prompt('Enter amount to add to this goal:')
                        if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
                          handleUpdateProgress(goal._id, parseFloat(amount))
                        }
                      }}
                      className={`flex-1 ${colorClasses.button} text-white py-2 rounded-lg font-semibold transition-all hover:shadow-lg`}
                    >
                      Add Progress
                    </button>
                    <button
                      onClick={() => window.location.href = `/transactions?category=Savings&description=${encodeURIComponent(goal.title)}`}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      title="View related transactions"
                    >
                      <DollarSign size={16} />
                    </button>
                  </div>

                  {/* Related Transactions */}
                  {goalTransactions[goal._id] && goalTransactions[goal._id].length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs font-medium text-gray-600 mb-2">Recent Contributions</p>
                      <div className="space-y-1">
                        {goalTransactions[goal._id].slice(0, 3).map((transaction) => (
                          <div key={transaction._id} className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 truncate">
                              {transaction.title}
                            </span>
                            <span className="text-green-600 font-medium">
                              +{formatCurrency(transaction.amount)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredGoals.length === 0 && (
          <div className="text-center py-16">
            <Target size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No goals found</h3>
            <p className="text-gray-500 mb-4">Start by creating your first financial goal</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Create Your First Goal
            </button>
          </div>
        )}
      </div>

      {/* Add Goal Modal */}
      {showAddModal && (
        <GoalModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddGoal}
          goalTypes={goalTypes}
          title="Add New Goal"
        />
      )}

      {/* Edit Goal Modal */}
      {editingGoal && (
        <GoalModal
          isOpen={!!editingGoal}
          onClose={() => setEditingGoal(null)}
          onSubmit={(data) => handleEditGoal(editingGoal._id, data)}
          goalTypes={goalTypes}
          title="Edit Goal"
          initialData={editingGoal}
        />
      )}
    </div>
  )
}

// Goal Modal Component
const GoalModal = ({ isOpen, onClose, onSubmit, goalTypes, title, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    type: initialData?.type || 'other',
    targetAmount: initialData?.targetAmount || '',
    currentAmount: initialData?.currentAmount || 0,
    targetDate: initialData?.targetDate ? new Date(initialData.targetDate).toISOString().split('T')[0] : '',
    description: initialData?.description || ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validation
    if (!formData.title.trim()) {
      toast.error('Please enter a goal title')
      return
    }
    if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
      toast.error('Please enter a valid target amount')
      return
    }
    if (!formData.targetDate) {
      toast.error('Please select a target date')
      return
    }

    const goalData = {
      ...formData,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount) || 0
    }

    onSubmit(goalData)
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
                Goal Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Emergency Fund"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Goal Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {goalTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Amount (₹)
              </label>
              <input
                type="number"
                value={formData.targetAmount}
                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="100000"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Amount (₹)
              </label>
              <input
                type="number"
                value={formData.currentAmount}
                onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Date
              </label>
              <input
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Describe your goal..."
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
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {initialData ? 'Update Goal' : 'Create Goal'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Goals
