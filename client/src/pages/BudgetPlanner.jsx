import React, { useState, useEffect, useMemo } from 'react'
import {
  Target,
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Calendar,
  PieChart as PieChartIcon,
  BarChart3,
  Plus,
  Edit3,
  Trash2,
  Save
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { budgetAPI, transactionsAPI } from '../services/api'
import BudgetInputForm from '../components/budget/BudgetInputForm'
import BudgetProgressBar from '../components/budget/BudgetProgressBar'
import BudgetSummaryCard from '../components/budget/BudgetSummaryCard'
import AlertBanner from '../components/ui/AlertBanner'
import { SpendingPieChart } from '../components/charts/SpendingPieChart';
import MonthSelector from '../components/filters/MonthSelector'
import { LoadingSpinner } from '../components/ui'
import toast from 'react-hot-toast'
import BudgetAllocation from '../components/budget/BudgetAllocation'

const BudgetPlanner = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  const [budgetData, setBudgetData] = useState({
    categories: [],
    totalBudget: 0,
    totalSpent: 0,
    savingsGoal: 0,
    alerts: []
  })

  const [actualSpending, setActualSpending] = useState([])
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [recentTransactions, setRecentTransactions] = useState([])
  const [budgetAlerts, setBudgetAlerts] = useState([])

  useEffect(() => {
    fetchBudgetData()
  }, [selectedMonth])

  const fetchBudgetData = async () => {
    setLoading(true)
    try {
      // Fetch budget data
      const budgetResponse = await budgetAPI.getBudget(selectedMonth)
      setBudgetData(budgetResponse.data.data)

      // Fetch actual spending for the month
      const startDate = new Date(`${selectedMonth}-01`)
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0)

      const [spendingResponse, transactionsResponse] = await Promise.all([
        transactionsAPI.getCategories({
          type: 'expense',
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }),
        transactionsAPI.getAll({
          type: 'expense',
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          limit: 10,
          sortBy: 'date',
          sortOrder: 'desc'
        })
      ])

      setActualSpending(spendingResponse.data.data || [])
      setRecentTransactions(transactionsResponse.data.data.transactions || [])


      // Generate budget alerts
      generateBudgetAlerts(budgetResponse.data.data, spendingResponse.data.data || [])

    } catch (error) {
      console.error('Error fetching budget data:', error)
      toast.error('Failed to load budget data')
    } finally {
      setLoading(false)
    }
  }

  const generateBudgetAlerts = (budget, spending) => {
    const alerts = []

    if (budget.categories && spending) {
      budget.categories.forEach(budgetCategory => {
        const actualCategory = spending.find(s => s.category === budgetCategory.name)
        const spent = actualCategory ? actualCategory.amount : 0
        const budgetAmount = budgetCategory.budgetAmount || 0
        const percentage = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0

        if (percentage >= 100) {
          alerts.push({
            id: `exceeded-${budgetCategory.name}`,
            type: 'exceeded',
            category: budgetCategory.name,
            message: `You've exceeded your ${budgetCategory.name} budget by ${formatCurrency(spent - budgetAmount)}`,
            percentage: percentage.toFixed(1)
          })
        } else if (percentage >= 80) {
          alerts.push({
            id: `warning-${budgetCategory.name}`,
            type: 'warning',
            category: budgetCategory.name,
            message: `You've used ${percentage.toFixed(1)}% of your ${budgetCategory.name} budget`,
            percentage: percentage.toFixed(1)
          })
        }
      })
    }

    setBudgetAlerts(alerts)
  }

  const handleBudgetUpdate = async (budgetData) => {
    try {
      await budgetAPI.createOrUpdateBudget({
        month: selectedMonth,
        ...budgetData
      })

      toast.success('Budget updated successfully!')
      await fetchBudgetData()
    } catch (error) {
      console.error('Error updating budget:', error)
      toast.error('Failed to update budget')
    }
  }

  const handleCategoryUpdate = async (categoryName, budgetAmount, color) => {
    try {
      await budgetAPI.updateCategoryBudget(selectedMonth, {
        categoryName,
        budgetAmount,
        color
      })

      toast.success('Category budget updated!')
      await fetchBudgetData()
    } catch (error) {
      console.error('Error updating category:', error)
      toast.error('Failed to update category')
    }
  }

  const handleAlertDismiss = async (alertId) => {
    try {
      await budgetAPI.markAlertRead(selectedMonth, alertId)
      setBudgetData(prev => ({
        ...prev,
        alerts: prev.alerts.filter(alert => alert._id !== alertId)
      }))
      toast.success('Alert dismissed')
    } catch (error) {
      console.error('Error dismissing alert:', error)
      toast.error('Failed to dismiss alert')
    }
  }

  // Calculate budget progress and insights
  const budgetInsights = useMemo(() => {
    const categoriesWithProgress = budgetData.categories.map(category => {
      const actualCategory = actualSpending.find(ac => ac.category === category.name)
      const spentAmount = actualCategory ? actualCategory.amount : 0
      const progress = category.budgetAmount > 0 ? (spentAmount / category.budgetAmount) * 100 : 0

      return {
        ...category,
        spentAmount,
        progress,
        remaining: Math.max(0, category.budgetAmount - spentAmount),
        status: progress >= 100 ? 'exceeded' : progress >= 80 ? 'warning' : 'good'
      }
    })

    const totalBudgeted = categoriesWithProgress.reduce((sum, cat) => sum + cat.budgetAmount, 0)
    const totalSpent = categoriesWithProgress.reduce((sum, cat) => sum + cat.spentAmount, 0)
    const totalRemaining = Math.max(0, totalBudgeted - totalSpent)
    const overallProgress = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0

    return {
      categories: categoriesWithProgress,
      totalBudgeted,
      totalSpent,
      totalRemaining,
      overallProgress,
      savingsGoal: budgetData.savingsGoal,
      potentialSavings: totalRemaining
    }
  }, [budgetData, actualSpending])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getMonthName = (monthString) => {
    const [year, month] = monthString.split('-')
    const date = new Date(year, month - 1)
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  if (loading) {
    return <LoadingSpinner message="Loading budget data..." />
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Budget Planner</h1>
          <p className="text-gray-600 mt-1">Plan and track your monthly spending</p>
        </div>

        <MonthSelector
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />
      </div>

      {/* Alerts Section */}
      {budgetData.alerts && budgetData.alerts.length > 0 && (
        <div className="space-y-3">
          {budgetData.alerts.map((alert) => (
            <AlertBanner
              key={alert._id}
              alert={alert}
              onDismiss={() => handleAlertDismiss(alert._id)}
            />
          ))}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <BudgetSummaryCard
          title="Total Budget"
          amount={budgetInsights.totalBudgeted}
          icon={Target}
          color="blue"
          formatCurrency={formatCurrency}
        />
        <BudgetSummaryCard
          title="Total Spent"
          amount={budgetInsights.totalSpent}
          icon={TrendingDown}
          color="red"
          progress={budgetInsights.overallProgress}
          formatCurrency={formatCurrency}
        />
        <BudgetSummaryCard
          title="Remaining Budget"
          amount={budgetInsights.totalRemaining}
          icon={DollarSign}
          color="green"
          formatCurrency={formatCurrency}
        />
        <BudgetSummaryCard
          title="Savings Goal"
          amount={budgetInsights.savingsGoal}
          icon={TrendingUp}
          color="purple"
          progress={budgetInsights.savingsGoal > 0 ? (budgetInsights.potentialSavings / budgetInsights.savingsGoal) * 100 : 0}
          formatCurrency={formatCurrency}
        />
      </div>

      {/* Budget Alerts */}
      {budgetAlerts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <AlertTriangle size={20} className="text-orange-500" />
            Budget Alerts
          </h2>
          {budgetAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border-l-4 ${alert.type === 'exceeded'
                ? 'bg-red-50 border-red-500 text-red-800'
                : 'bg-yellow-50 border-yellow-500 text-yellow-800'
                }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{alert.category} Budget Alert</p>
                  <p className="text-sm">{alert.message}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold">{alert.percentage}%</span>
                  <p className="text-xs">of budget used</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Budget Analysis */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Category-wise Budget vs Actual */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center space-x-2">
              <BarChart3 size={20} className="text-blue-600" />
              <h3 className="card-title">Category Budget Analysis</h3>
            </div>
            <p className="card-description">Compare budgeted vs actual spending by category</p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {budgetInsights.categories.map((category) => {
                const isOverBudget = category.spentAmount > category.budgetAmount
                const percentage = category.budgetAmount > 0 ? (category.spentAmount / category.budgetAmount) * 100 : 0

                return (
                  <div key={category.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{category.name}</span>
                      <div className="text-right">
                        <span className={`font-semibold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                          {formatCurrency(category.spentAmount)} / {formatCurrency(category.budgetAmount)}
                        </span>
                        <p className="text-xs text-gray-500">{percentage.toFixed(1)}% used</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${isOverBudget ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    {category.remaining > 0 && (
                      <p className="text-xs text-green-600">
                        {formatCurrency(category.remaining)} remaining
                      </p>
                    )}
                    {category.remaining < 0 && (
                      <p className="text-xs text-red-600">
                        {formatCurrency(Math.abs(category.remaining))} over budget
                      </p>
                    )}
                  </div>
                )
              })}

            </div>
          </div>
        </div>

        {/* Recent Transactions Impact */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center space-x-2">
              <DollarSign size={20} className="text-green-600" />
              <h3 className="card-title">Recent Transactions</h3>
            </div>
            <p className="card-description">Latest expenses affecting your budget</p>
          </div>
          <div className="card-content">
            <div className="space-y-3">
              {(recentTransactions || []).slice(0, 8).map((transaction) => {
                const budgetCategory = budgetData.categories?.find(c => c.name === transaction.category)
                const isTracked = !!budgetCategory

                return (
                  <div key={transaction._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{transaction.title}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{transaction.category}</span>
                        <span>•</span>
                        <span>{new Date(transaction.date).toLocaleDateString()}</span>
                        {isTracked && (
                          <>
                            <span>•</span>
                            <span className="text-blue-600">Tracked in budget</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-red-600">
                        -{formatCurrency(transaction.amount)}
                      </span>
                    </div>
                  </div>
                )
              })}
              {(!recentTransactions || recentTransactions.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <DollarSign size={48} className="mx-auto mb-2 opacity-50" />
                  <p>No transactions this month</p>
                </div>
              )}
            </div>
            {(recentTransactions && recentTransactions.length > 0) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => window.location.href = '/transactions'}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  View All Transactions
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Budget Input and Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Budget Input Form */}
          <BudgetInputForm
            month={selectedMonth}
            categories={budgetData.categories}
            savingsGoal={budgetData.savingsGoal}
            onUpdate={handleBudgetUpdate}
            onCategoryUpdate={handleCategoryUpdate}
          />

          {/* Budget Progress */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BarChart3 size={20} className="text-green-600" />
                  <h3 className="card-title">Budget vs Actual Spending</h3>
                </div>
                <span className="text-sm text-gray-500">
                  {getMonthName(selectedMonth)}
                </span>
              </div>
              <p className="card-description">Track your spending against budget limits</p>
            </div>
            <div className="card-content">
              <div className="space-y-4">
                {budgetInsights.categories.map((category) => (
                  <BudgetProgressBar
                    key={category.name}
                    category={category}
                    formatCurrency={formatCurrency}
                  />
                ))}

                {budgetInsights.categories.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Target size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No budget categories set</p>
                    <p className="text-sm">Add categories to start tracking your budget</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Charts and Insights */}
        <div className="space-y-6">
          {/* Spending Pie Chart */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center space-x-2">
                <PieChartIcon size={20} className="text-purple-600" />
                <h3 className="card-title">Budget Allocation</h3>
              </div>
              <p className="card-description">How your budget is distributed</p>
            </div>
            <div className="card-content">
              <SpendingPieChart
                data={budgetInsights.categories}
                formatCurrency={formatCurrency}
              />
            </div>
          </div>

          {/* Budget Insights */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center space-x-2">
                <TrendingUp size={20} className="text-blue-600" />
                <h3 className="card-title">Budget Insights</h3>
              </div>
              <p className="card-description">Smart suggestions for your budget</p>
            </div>
            <div className="card-content">
              <div className="space-y-3">
                {budgetInsights.overallProgress > 100 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle size={16} className="text-red-600" />
                      <span className="text-sm font-medium text-red-800">Budget Exceeded</span>
                    </div>
                    <p className="text-sm text-red-700 mt-1">
                      You've spent {budgetInsights.overallProgress.toFixed(1)}% of your total budget.
                    </p>
                  </div>
                )}

                {budgetInsights.overallProgress <= 70 && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle size={16} className="text-green-600" />
                      <span className="text-sm font-medium text-green-800">Great Job!</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      You're doing well with {(100 - budgetInsights.overallProgress).toFixed(1)}% of your budget remaining.
                    </p>
                  </div>
                )}

                {budgetInsights.potentialSavings > budgetInsights.savingsGoal && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <TrendingUp size={16} className="text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Savings Opportunity</span>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">
                      You could save {formatCurrency(budgetInsights.potentialSavings - budgetInsights.savingsGoal)} more than your goal!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Budget Allocation Component */}
          {/* <BudgetAllocation budgetData={[
            { category: 'Food', amount: 500, percentage: 25 },
            { category: 'Housing', amount: 800, percentage: 40 },
            { category: 'Transportation', amount: 200, percentage: 10 },
            { category: 'Entertainment', amount: 300, percentage: 15 },
            { category: 'Others', amount: 200, percentage: 10 }
          ]} /> */}
        </div>
      </div>
    </div>
  )
}

export default BudgetPlanner
