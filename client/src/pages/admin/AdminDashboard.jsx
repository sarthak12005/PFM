import React, { useState, useEffect } from 'react'
import {
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  UserPlus,
  CreditCard,
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Calendar,
  Download
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { LoadingSpinner } from '../../components/ui'
import { BarChart, PieChart as PieChartComponent } from '../../components/charts'
import { DashboardCard } from '../../components/cards'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    users: {
      total: 0,
      active: 0,
      newThisMonth: 0,
      growth: []
    },
    transactions: {
      total: 0,
      thisMonth: 0,
      totalIncome: 0,
      totalExpenses: 0,
      netSavings: 0
    },
    offers: {
      total: 0,
      active: 0
    },
    memberships: [],
    recentActivity: {
      users: [],
      transactions: []
    }
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch dashboard data`)
      }

      const data = await response.json()
      if (data.success) {
        setDashboardData(data.data)
      } else {
        throw new Error(data.message || 'Invalid response format')
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error(`Failed to load dashboard data: ${error.message}`)

      // Set default data to prevent UI crashes
      setDashboardData({
        users: { total: 0, active: 0, newThisMonth: 0, growth: [] },
        transactions: { total: 0, thisMonth: 0, totalIncome: 0, totalExpenses: 0, netSavings: 0 },
        offers: { total: 0, active: 0 },
        memberships: [],
        recentActivity: { users: [], transactions: [] }
      })
    } finally {
      setLoading(false)
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return <LoadingSpinner />
  }

  // Prepare chart data
  const userGrowthData = {
    labels: dashboardData.users.growth.map(item => 
      `${item._id.year}-${String(item._id.month).padStart(2, '0')}`
    ),
    datasets: [
      {
        label: 'New Users',
        data: dashboardData.users.growth.map(item => item.count),
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
      }
    ]
  }

  const membershipData = {
    labels: dashboardData.memberships.map(item => item._id || 'Unknown'),
    datasets: [
      {
        label: 'Users',
        data: dashboardData.memberships.map(item => item.count),
        backgroundColor: ['#10B981', '#F59E0B', '#8B5CF6']
      }
    ]
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user?.name}! Here's what's happening with SaveWise.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Total Users"
          amount={dashboardData.users.total}
          icon={Users}
          color="blue"
          trend={`+${dashboardData.users.newThisMonth} this month`}
        />
        <DashboardCard
          title="Active Users"
          amount={dashboardData.users.active}
          icon={UserPlus}
          color="green"
          trend={`${((dashboardData.users.active / dashboardData.users.total) * 100).toFixed(1)}% active`}
        />
        <DashboardCard
          title="Total Transactions"
          amount={dashboardData.transactions.total}
          icon={Activity}
          color="purple"
          trend={`+${dashboardData.transactions.thisMonth} this month`}
        />
        <DashboardCard
          title="Platform Revenue"
          amount={formatCurrency(dashboardData.transactions.netSavings)}
          icon={DollarSign}
          color="yellow"
          trend="Total savings tracked"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* User Growth Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <BarChart data={userGrowthData} height={300} />
        </div>

        {/* Membership Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Membership Distribution</h3>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          <PieChartComponent data={membershipData} height={300} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {dashboardData.recentActivity.users.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{formatDate(user.createdAt)}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    user.membershipTier === 'premium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : user.membershipTier === 'enterprise'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.membershipTier}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {dashboardData.recentActivity.transactions.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{transaction.title}</p>
                  <p className="text-sm text-gray-500">
                    {transaction.user?.name} • {transaction.category}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-sm text-gray-500">{formatDate(transaction.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
            <Users className="h-5 w-5 mr-2" />
            Manage Users
          </button>
          <button className="flex items-center justify-center p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
            <CreditCard className="h-5 w-5 mr-2" />
            Manage Offers
          </button>
          <button className="flex items-center justify-center p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
            <Target className="h-5 w-5 mr-2" />
            Manage Memberships
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
