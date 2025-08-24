import React, { useState, useEffect } from 'react'
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Activity,
  Plus,
  Minus,
  CreditCard,
  Wallet,
  Target,
  Eye
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { transactionsAPI, budgetAPI } from '../services/api'
import { DashboardCard } from '../components/cards'
import { BarChart, PieChart } from '../components/charts'
import RecentTransactions from '../components/transactions/RecentTransactions'
import { QuickAddModal } from '../components/modals'
import { LoadingSpinner } from '../components/ui'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('6months')
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [quickAddType, setQuickAddType] = useState('income')
  const [dashboardData, setDashboardData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netSavings: 0,
    monthlyData: { labels: [], datasets: [] },
    categoryData: { labels: [], datasets: [] },
    recentTransactions: []
  })



  useEffect(() => {
    fetchDashboardData()
  }, [dateRange])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // Calculate date range for API call
      let endDate = new Date()
      let startDate = new Date()

      switch (dateRange) {
        case '1month':
          startDate.setMonth(startDate.getMonth() - 1)
          break
        case '3months':
          startDate.setMonth(startDate.getMonth() - 3)
          break
        case '6months':
          startDate.setMonth(startDate.getMonth() - 6)
          break
        case '1year':
          startDate.setFullYear(startDate.getFullYear() - 1)
          break
        default:
          startDate.setMonth(startDate.getMonth() - 6)
      }

      // Fetch transactions from API
      const transactionsResponse = await transactionsAPI.getAll({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        limit: 100
      })

      // Fetch summary data
      const summaryResponse = await transactionsAPI.getSummary({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      })

      // Fetch category breakdown
      const categoryResponse = await transactionsAPI.getCategories({
        type: 'expense',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      })

      // Fetch monthly data
      const monthlyResponse = await transactionsAPI.getMonthlyData({
        months: dateRange === '1year' ? 12 : 6
      })

      const fetchedTransactions = transactionsResponse.data.data.transactions || []
      const summaryData = summaryResponse.data.data || {}
      const categoryData = categoryResponse.data.data || []
      const monthlyData = monthlyResponse.data.data || []

      setTransactions(fetchedTransactions)

      // Set dashboard data from API responses
      setDashboardData({
        totalIncome: summaryData.totalIncome || 0,
        totalExpenses: summaryData.totalExpenses || 0,
        netSavings: summaryData.netSavings || 0,
        transactionCount: summaryData.transactionCount || 0,
        monthlyData: monthlyData,
        categoryData: categoryData,
        recentTransactions: fetchedTransactions.slice(0, 5)
      })

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')

      // Set empty state when API fails
      setDashboardData({
        totalIncome: 0,
        totalExpenses: 0,
        netSavings: 0,
        transactionCount: 0,
        monthlyData: { labels: [], datasets: [] },
        categoryData: { labels: [], datasets: [] },
        recentTransactions: []
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateDashboardMetrics = (transactionData) => {
    // Calculate totals
    const totalIncome = transactionData
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = transactionData
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    const netSavings = totalIncome - totalExpenses

    // Calculate monthly data for bar chart
    const monthlyData = calculateMonthlyData(transactionData)

    // Calculate category data for pie chart
    const categoryData = calculateCategoryData(transactionData)

    // Get recent transactions (last 5)
    const recentTransactions = transactionData
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)

    return {
      totalIncome,
      totalExpenses,
      netSavings,
      monthlyData,
      categoryData,
      recentTransactions
    }
  }

  const calculateMonthlyData = (transactionData) => {
    const monthlyMap = {}

    transactionData.forEach(transaction => {
      const date = new Date(transaction.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = { income: 0, expenses: 0 }
      }

      if (transaction.type === 'income') {
        monthlyMap[monthKey].income += transaction.amount
      } else {
        monthlyMap[monthKey].expenses += transaction.amount
      }
    })

    // Convert to Chart.js format
    const monthlyArray = Object.entries(monthlyMap)
      .map(([month, data]) => ({
        month,
        ...data
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6) // Last 6 months

    // Format for Chart.js
    return {
      labels: monthlyArray.map(item => {
        const [year, month] = item.month.split('-')
        const date = new Date(year, month - 1)
        return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      }),
      datasets: [
        {
          label: 'Income',
          data: monthlyArray.map(item => item.income),
          backgroundColor: '#10B981',
          borderColor: '#10B981',
        },
        {
          label: 'Expenses',
          data: monthlyArray.map(item => item.expenses),
          backgroundColor: '#EF4444',
          borderColor: '#EF4444',
        }
      ]
    }
  }

  const calculateCategoryData = (transactionData) => {
    const categoryMap = {}

    transactionData
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        if (!categoryMap[transaction.category]) {
          categoryMap[transaction.category] = 0
        }
        categoryMap[transaction.category] += transaction.amount
      })

    const categoryArray = Object.entries(categoryMap).map(([category, amount]) => ({
      category,
      amount
    }))

    // Format for Chart.js
    return {
      labels: categoryArray.map(item => item.category),
      datasets: [
        {
          label: 'Expenses',
          data: categoryArray.map(item => item.amount),
          backgroundColor: [
            '#EF4444', // Red
            '#F59E0B', // Orange
            '#10B981', // Green
            '#3B82F6', // Blue
            '#8B5CF6', // Purple
            '#EC4899', // Pink
            '#14B8A6', // Teal
            '#F97316'  // Orange
          ]
        }
      ]
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

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
        {/* Header Section */}
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
              {getGreeting()}, {user?.name || 'User'}! 👋
            </h1>
            <p className="text-sm sm:text-base text-gray-600">Here's your financial overview</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <Filter size={18} className="text-gray-500 hidden sm:block" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <option value="1month">Last Month</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last Year</option>
              </select>
            </div>
          </div>
        </div>



        {/* Enhanced Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <DashboardCard
            title="Total Income"
            amount={dashboardData.totalIncome}
            icon={TrendingUp}
            color="green"
            trend="+12.5%"
            trendDirection="up"
            delay="0"
          />
          <DashboardCard
            title="Total Expenses"
            amount={dashboardData.totalExpenses}
            icon={TrendingDown}
            color="red"
            trend="+8.2%"
            trendDirection="up"
            delay="100"
          />
          <DashboardCard
            title="Net Savings"
            amount={dashboardData.netSavings}
            icon={PiggyBank}
            color="blue"
            trend="+15.3%"
            trendDirection="up"
            delay="200"
          />
          <DashboardCard
            title="Transactions"
            amount={transactions.length}
            icon={Activity}
            color="purple"
            trend="+23"
            trendDirection="up"
            delay="300"
            isCount={true}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <button
            onClick={() => {
              setQuickAddType('income')
              setShowQuickAdd(true)
            }}
            className="group p-3 sm:p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl touch-manipulation"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                <Plus size={18} className="sm:w-5 sm:h-5" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm sm:text-base">Add Income</p>
                <p className="text-xs sm:text-sm opacity-90">Quick income entry</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => {
              setQuickAddType('expense')
              setShowQuickAdd(true)
            }}
            className="group p-3 sm:p-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl touch-manipulation"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                <Minus size={18} className="sm:w-5 sm:h-5" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm sm:text-base">Add Expense</p>
                <p className="text-xs sm:text-sm opacity-90">Quick expense entry</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => window.location.href = '/budget-planner'}
            className="group p-3 sm:p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl touch-manipulation"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                <Target size={18} className="sm:w-5 sm:h-5" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm sm:text-base">Set Budget</p>
                <p className="text-xs sm:text-sm opacity-90">Plan your spending</p>
              </div>
            </div>
          </button>

        <button
          onClick={() => window.location.href = '/transactions'}
          className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Eye size={20} />
            </div>
            <div className="text-left">
              <p className="font-semibold">View All</p>
              <p className="text-sm opacity-90">See all transactions</p>
            </div>
          </div>
        </button>
      </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Bar Chart - Monthly Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
                <DollarSign className="mr-2 text-blue-600" size={18} />
                Monthly Income vs Expenses
              </h3>
              <p className="text-sm text-gray-600 mt-1">Last 6 months comparison</p>
            </div>
            <div className="p-4 sm:p-6">
              <div className="h-64 sm:h-80 m-2">
                <BarChart data={dashboardData.monthlyData} />
              </div>
            </div>
          </div>

          {/* Pie Chart - Category Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
                <Calendar className="mr-2 text-teal-600" size={18} />
                Expense Categories
              </h3>
              <p className="text-sm text-gray-600 mt-1">Spending breakdown by category</p>
            </div>
            <div className="p-4 sm:p-6">
              <div className="h-64 sm:h-80">
                <PieChart data={dashboardData.categoryData} />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Recent Transactions</h3>
                <p className="text-sm text-gray-600">Your latest financial activity</p>
              </div>
              <button
                onClick={() => window.location.href = '/transactions'}
                className="w-full sm:w-auto px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200 touch-manipulation"
              >
                View All
              </button>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <RecentTransactions
              transactions={dashboardData.recentTransactions}
              formatCurrency={formatCurrency}
            />
          </div>
        </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="card-content text-center">
            <ArrowUpRight className="mx-auto mb-2 text-green-600" size={24} />
            <h4 className="font-semibold text-gray-900">Add Income</h4>
            <p className="text-sm text-gray-600">Record new income</p>
          </div>
        </button>

        <button className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="card-content text-center">
            <ArrowDownRight className="mx-auto mb-2 text-red-600" size={24} />
            <h4 className="font-semibold text-gray-900">Add Expense</h4>
            <p className="text-sm text-gray-600">Record new expense</p>
          </div>
        </button>

        <button className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="card-content text-center">
            <PiggyBank className="mx-auto mb-2 text-blue-600" size={24} />
            <h4 className="font-semibold text-gray-900">Set Goal</h4>
            <p className="text-sm text-gray-600">Create savings goal</p>
          </div>
        </button>

        <button className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="card-content text-center">
            <Calendar className="mx-auto mb-2 text-purple-600" size={24} />
            <h4 className="font-semibold text-gray-900">View Calendar</h4>
            <p className="text-sm text-gray-600">Monthly overview</p>
          </div>
        </button>
      </div>

        {/* Quick Add Modal */}
        <QuickAddModal
          isOpen={showQuickAdd}
          onClose={() => setShowQuickAdd(false)}
          type={quickAddType}
          onSuccess={fetchDashboardData}
        />
      </div>
    </div>
  )
}

export default Dashboard
