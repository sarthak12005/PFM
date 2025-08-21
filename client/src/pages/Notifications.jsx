import React, { useState, useEffect } from 'react'
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  DollarSign,
  Target,
  Calendar,
  TrendingUp,
  Settings,
  Trash2,
  Check,
  Filter,
  Search,
  Clock,
  X
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCategories } from '../context/CategoriesContext'
import { notificationsAPI, budgetAPI, goalsAPI, transactionsAPI } from '../services/api'
import { LoadingSpinner } from '../components/ui'
import toast from 'react-hot-toast'

const Notifications = () => {
  const { user } = useAuth()
  const { refreshCategories } = useCategories()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [realTimeData, setRealTimeData] = useState({
    budgetAlerts: [],
    goalUpdates: [],
    recentTransactions: []
  })

  const notificationTypes = [
    { value: 'budget', label: 'Budget Alerts', icon: Target, color: 'orange' },
    { value: 'goal', label: 'Goal Updates', icon: TrendingUp, color: 'green' },
    { value: 'transaction', label: 'Transactions', icon: DollarSign, color: 'blue' },
    { value: 'reminder', label: 'Reminders', icon: Calendar, color: 'purple' },
    { value: 'system', label: 'System', icon: Info, color: 'gray' }
  ]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      // Fetch notifications and real-time data in parallel
      const [notificationsResponse, budgetResponse, goalsResponse, transactionsResponse] = await Promise.all([
        notificationsAPI.getAll(),
        budgetAPI.getBudget(new Date().toISOString().slice(0, 7)), // Current month
        goalsAPI.getAll(),
        transactionsAPI.getAll({ limit: 10, sortBy: 'date', sortOrder: 'desc' })
      ])

      if (notificationsResponse.data.success) {
        setNotifications(notificationsResponse.data.data || [])
      }

      // Process real-time data for dynamic notifications
      const budgetData = budgetResponse.data.success ? budgetResponse.data.data : null
      const goalsData = goalsResponse.data.success ? goalsResponse.data.data || [] : []
      const transactionsData = transactionsResponse.data.success ? transactionsResponse.data.data.transactions || [] : []

      // Generate real-time notifications
      const dynamicNotifications = await generateDynamicNotifications(budgetData, goalsData, transactionsData)

      // Merge with existing notifications
      setNotifications(prev => [...dynamicNotifications, ...prev])

      setRealTimeData({
        budgetAlerts: budgetData ? generateBudgetAlerts(budgetData) : [],
        goalUpdates: generateGoalUpdates(goalsData),
        recentTransactions: transactionsData
      })

    } catch (error) {
      console.error('Error fetching notifications:', error)
      toast.error('Failed to load notifications')
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  const generateDynamicNotifications = async (budgetData, goalsData, transactionsData) => {
    const notifications = []
    const now = new Date()

    // Budget alerts
    if (budgetData && budgetData.categories) {
      budgetData.categories.forEach(category => {
        const percentage = category.budgetAmount > 0 ? (category.spentAmount / category.budgetAmount) * 100 : 0

        if (percentage >= 100) {
          notifications.push({
            _id: `budget-exceeded-${category.name}-${Date.now()}`,
            type: 'budget',
            title: 'Budget Exceeded!',
            message: `You've exceeded your ${category.name} budget by ${formatCurrency(category.spentAmount - category.budgetAmount)}`,
            priority: 'high',
            isRead: false,
            createdAt: now.toISOString(),
            data: { category: category.name, percentage: percentage.toFixed(1) }
          })
        } else if (percentage >= 80) {
          notifications.push({
            _id: `budget-warning-${category.name}-${Date.now()}`,
            type: 'budget',
            title: 'Budget Warning',
            message: `You've used ${percentage.toFixed(1)}% of your ${category.name} budget`,
            priority: 'medium',
            isRead: false,
            createdAt: now.toISOString(),
            data: { category: category.name, percentage: percentage.toFixed(1) }
          })
        }
      })
    }

    // Goal updates
    goalsData.forEach(goal => {
      const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0

      if (progress >= 100) {
        notifications.push({
          _id: `goal-completed-${goal._id}-${Date.now()}`,
          type: 'goal',
          title: 'Goal Completed! 🎉',
          message: `Congratulations! You've achieved your goal: ${goal.title}`,
          priority: 'high',
          isRead: false,
          createdAt: now.toISOString(),
          data: { goalId: goal._id, goalTitle: goal.title }
        })
      } else if (progress >= 75) {
        notifications.push({
          _id: `goal-progress-${goal._id}-${Date.now()}`,
          type: 'goal',
          title: 'Goal Progress',
          message: `You're ${progress.toFixed(1)}% towards your goal: ${goal.title}`,
          priority: 'low',
          isRead: false,
          createdAt: now.toISOString(),
          data: { goalId: goal._id, goalTitle: goal.title, progress: progress.toFixed(1) }
        })
      }
    })

    // Recent transaction alerts
    const recentTransactions = transactionsData.slice(0, 3)
    recentTransactions.forEach(transaction => {
      if (transaction.amount > 1000) { // Large transaction alert
        notifications.push({
          _id: `transaction-large-${transaction._id}-${Date.now()}`,
          type: 'transaction',
          title: 'Large Transaction',
          message: `${transaction.type === 'expense' ? 'Expense' : 'Income'} of ${formatCurrency(transaction.amount)} recorded`,
          priority: 'medium',
          isRead: false,
          createdAt: now.toISOString(),
          data: { transactionId: transaction._id, amount: transaction.amount, type: transaction.type }
        })
      }
    })

    return notifications
  }

  const generateBudgetAlerts = (budgetData) => {
    if (!budgetData || !budgetData.categories) return []

    return budgetData.categories.map(category => {
      const percentage = category.budgetAmount > 0 ? (category.spentAmount / category.budgetAmount) * 100 : 0
      return {
        category: category.name,
        percentage: percentage.toFixed(1),
        status: percentage >= 100 ? 'exceeded' : percentage >= 80 ? 'warning' : 'good'
      }
    })
  }

  const generateGoalUpdates = (goalsData) => {
    return goalsData.map(goal => {
      const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0
      return {
        id: goal._id,
        title: goal.title,
        progress: progress.toFixed(1),
        status: progress >= 100 ? 'completed' : progress >= 75 ? 'near' : 'progress'
      }
    })
  }

  const getNotificationIcon = (type) => {
    const notificationType = notificationTypes.find(nt => nt.value === type)
    return notificationType ? notificationType.icon : Bell
  }

  const getNotificationColor = (type) => {
    const notificationType = notificationTypes.find(nt => nt.value === type)
    return notificationType ? notificationType.color : 'gray'
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red'
      case 'medium': return 'yellow'
      case 'low': return 'green'
      default: return 'gray'
    }
  }

  const formatTimeAgo = (dateString) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return date.toLocaleDateString()
  }

  const markAsRead = async (notificationId) => {
    try {
      await notificationsAPI.markAsRead(notificationId)
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      )
    } catch (error) {
      console.error('Error marking notification as read:', error)
      toast.error('Failed to mark as read')
    }
  }

  const markAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead()
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })))
      toast.success('All notifications marked as read')
    } catch (error) {
      console.error('Error marking all as read:', error)
      toast.error('Failed to mark all as read')
    }
  }

  const deleteNotification = async (notificationId) => {
    try {
      await notificationsAPI.delete(notificationId)
      setNotifications(prev => prev.filter(notif => notif._id !== notificationId))
      toast.success('Notification deleted')
    } catch (error) {
      console.error('Error deleting notification:', error)
      toast.error('Failed to delete notification')
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && !notification.isRead) ||
                         (filter === 'read' && notification.isRead) ||
                         notification.type === filter
    
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  const unreadCount = notifications.filter(n => !n.isRead).length

  if (loading) {
    return <LoadingSpinner message="Loading notifications..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <Bell size={32} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold">Notifications</h1>
              </div>
              <p className="text-lg opacity-90">Stay updated with your financial activities</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={markAllAsRead}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <CheckCircle size={20} />
                <span>Mark All Read</span>
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="bg-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors flex items-center space-x-2"
              >
                <Settings size={20} />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
              </div>
              <Bell className="text-blue-500" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
              </div>
              <AlertTriangle className="text-red-500" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-orange-600">
                  {notifications.filter(n => n.priority === 'high').length}
                </p>
              </div>
              <AlertTriangle className="text-orange-500" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today</p>
                <p className="text-2xl font-bold text-green-600">
                  {notifications.filter(n => {
                    const today = new Date().toDateString()
                    const notifDate = new Date(n.createdAt).toDateString()
                    return today === notifDate
                  }).length}
                </p>
              </div>
              <Calendar className="text-green-500" size={24} />
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
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Notifications</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              {notificationTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Real-time Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Budget Alerts */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Target size={20} className="text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-900">Budget Status</h3>
            </div>
            <div className="space-y-3">
              {realTimeData.budgetAlerts.slice(0, 3).map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{alert.category}</p>
                    <p className="text-sm text-gray-500">{alert.percentage}% used</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    alert.status === 'exceeded' ? 'bg-red-500' :
                    alert.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                </div>
              ))}
              {realTimeData.budgetAlerts.length === 0 && (
                <p className="text-gray-500 text-center py-4">No budget alerts</p>
              )}
            </div>
          </div>

          {/* Goal Updates */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp size={20} className="text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900">Goal Progress</h3>
            </div>
            <div className="space-y-3">
              {realTimeData.goalUpdates.slice(0, 3).map((goal) => (
                <div key={goal.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900">{goal.title}</p>
                    <span className={`text-sm font-semibold ${
                      goal.status === 'completed' ? 'text-green-600' :
                      goal.status === 'near' ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      {goal.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        goal.status === 'completed' ? 'bg-green-500' :
                        goal.status === 'near' ? 'bg-blue-500' : 'bg-gray-400'
                      }`}
                      style={{ width: `${Math.min(parseFloat(goal.progress), 100)}%` }}
                    />
                  </div>
                </div>
              ))}
              {realTimeData.goalUpdates.length === 0 && (
                <p className="text-gray-500 text-center py-4">No active goals</p>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <DollarSign size={20} className="text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <div className="space-y-3">
              {realTimeData.recentTransactions.slice(0, 3).map((transaction) => (
                <div key={transaction._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{transaction.title}</p>
                    <p className="text-sm text-gray-500">{transaction.category}</p>
                  </div>
                  <span className={`font-semibold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </span>
                </div>
              ))}
              {realTimeData.recentTransactions.length === 0 && (
                <p className="text-gray-500 text-center py-4">No recent transactions</p>
              )}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.map(notification => {
            const Icon = getNotificationIcon(notification.type)
            const typeColor = getNotificationColor(notification.type)
            const priorityColor = getPriorityColor(notification.priority)

            return (
              <div
                key={notification._id}
                className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 ${
                  !notification.isRead ? 'border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className={`p-3 bg-${typeColor}-100 rounded-lg flex-shrink-0`}>
                    <Icon className={`text-${typeColor}-600`} size={24} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${priorityColor}-100 text-${priorityColor}-800`}>
                            {notification.priority}
                          </span>
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{notification.message}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock size={14} />
                            <span>{formatTimeAgo(notification.createdAt)}</span>
                          </div>
                          <span className="capitalize">{notification.type}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2 ml-4">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification._id)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Mark as read"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification._id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredNotifications.length === 0 && (
          <div className="text-center py-16">
            <Bell size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No notifications found</h3>
            <p className="text-gray-500">You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications
