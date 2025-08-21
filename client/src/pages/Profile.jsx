import React, { useState, useEffect } from 'react'
import {
  User,
  Edit3,
  Calendar,
  Hash,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Award,
  PieChart as PieChartIcon,
  MapPin,
  Mail,
  Phone,
  Camera,
  Settings,
  Target,
  CreditCard,
  BarChart3,
  Clock,
  Star,
  Trophy,
  Zap,
  Shield,
  Gift
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { transactionsAPI, authAPI } from '../services/api'
import { PieChart, BarChart } from '../components/charts'
import { LoadingSpinner } from '../components/ui'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    userInfo: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: user?.location || '',
      bio: user?.bio || '',
      joinedDate: user?.createdAt || '',
      userId: user?._id || '',
      profilePhoto: user?.profilePhoto || null,
      membershipType: user?.membershipType || 'Free',
      totalTransactions: 0,
      accountStatus: 'Active'
    },
    financialSummary: {
      totalIncome: 0,
      totalExpenses: 0,
      netSavings: 0,
      transactionCount: 0,
      monthlyAverage: 0,
      savingsRate: 0,
      topCategory: '',
      budgetUtilization: 0
    },
    statistics: {
      totalGoals: 0,
      completedGoals: 0,
      totalCategories: 0,
      averageTransaction: 0,
      longestStreak: 0,
      thisMonthTransactions: 0
    },
    expenseBreakdown: [],
    monthlyTrends: [],
    recentActivities: [],
    achievements: [],
    goals: []
  })



  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    setLoading(true)
    try {
      // Fetch data from multiple endpoints
      const [summaryResponse, categoryResponse, activityResponse] = await Promise.all([
        transactionsAPI.getSummary(),
        transactionsAPI.getCategories({ type: 'expense' }),
        authAPI.getActivity()
      ])

      const summaryData = summaryResponse.data.data || {}
      const categoryData = categoryResponse.data.data || []
      const activityData = activityResponse.data.data || []

      // Calculate category breakdown with percentages
      const totalExpenses = categoryData.reduce((sum, cat) => sum + cat.amount, 0)
      const categoryBreakdown = categoryData.map(cat => ({
        ...cat,
        percentage: totalExpenses > 0 ? ((cat.amount / totalExpenses) * 100).toFixed(1) : 0,
        color: getCategoryColor(cat.category)
      }))

      setProfileData({
        userInfo: {
          ...user,
          totalTransactions: summaryData.transactionCount || 0
        },
        financialSummary: {
          totalIncome: summaryData.totalIncome || 0,
          totalExpenses: summaryData.totalExpenses || 0,
          netSavings: summaryData.netSavings || 0,
          transactionCount: summaryData.transactionCount || 0,
          savingsRate: summaryData.totalIncome > 0 ? ((summaryData.netSavings / summaryData.totalIncome) * 100).toFixed(1) : 0,
          expenseRatio: summaryData.totalIncome > 0 ? ((summaryData.totalExpenses / summaryData.totalIncome) * 100).toFixed(1) : 0
        },
        categoryBreakdown: categoryBreakdown,
        activities: activityData,
        achievements: [] // Remove sample achievements
      })

    } catch (error) {
      console.error('Error fetching profile data:', error)
      toast.error('Failed to load profile data')
      // Set empty state when API fails
      setProfileData({
        userInfo: {
          name: user?.name || '',
          email: user?.email || '',
          joinedDate: '',
          userId: '',
          profilePhoto: null,
          totalTransactions: 0
        },
        financialSummary: {
          totalIncome: 0,
          totalExpenses: 0,
          netSavings: 0,
          transactionCount: 0
        },
        expenseBreakdown: [],
        recentActivities: [],
        achievements: []
      })
    } finally {
      setLoading(false)
    }
  }

  const getCategoryColor = (category) => {
    const colorMap = {
      'Food': '#f87171',
      'Housing': '#60a5fa',
      'Transportation': '#34d399',
      'Entertainment': '#facc15',
      'Shopping': '#a78bfa',
      'Utilities': '#fb7185',
      'Healthcare': '#fbbf24',
      'Education': '#10b981',
      'Travel': '#06b6d4',
      'Insurance': '#8b5cf6'
    }
    return colorMap[category] || '#6b7280'
  }

  const handleProfileUpdate = async (updatedInfo) => {
    try {
      const response = await authAPI.updateProfile(updatedInfo)

      if (response.data.success) {
        setProfileData(prev => ({
          ...prev,
          userInfo: { ...prev.userInfo, ...updatedInfo }
        }))
        toast.success('Profile updated successfully!')

        // Refresh profile data
        fetchProfileData()
      } else {
        throw new Error(response.data.message || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error(error.response?.data?.message || 'Failed to update profile')
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading your profile..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Hero Section with Background */}
      <div className="relative bg-gradient-to-r from-blue-600 to-teal-600 pb-32">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 container mx-auto px-4 pt-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">My Profile</h1>
            <div className="text-white/80 text-sm">
              Member since {new Date(profileData.userInfo.joinedDate).toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative -mt-24 container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - User Profile */}
          <div className="lg:col-span-1 space-y-6">
            <UserProfileCard 
              userInfo={profileData.userInfo}
              onUpdate={handleProfileUpdate}
            />
            
            <AchievementBadge 
              achievements={profileData.achievements}
            />
          </div>

          {/* Right Column - Financial Data */}
          <div className="lg:col-span-2 space-y-6">
            {/* Financial Summary */}
            <FinancialSnapshot 
              summary={profileData.financialSummary}
            />

            {/* Charts and Timeline */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Expense Breakdown */}
              <div className="card">
                <div className="card-header">
                  <div className="flex items-center space-x-2">
                    <PieChartIcon size={20} className="text-purple-600" />
                    <h3 className="card-title">Expense Breakdown</h3>
                  </div>
                  <p className="card-description">Where your money goes</p>
                </div>
                <div className="card-content">
                  <ExpensePieChart 
                    data={profileData.expenseBreakdown}
                  />
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="card">
                <div className="card-header">
                  <div className="flex items-center space-x-2">
                    <Activity size={20} className="text-blue-600" />
                    <h3 className="card-title">Recent Activity</h3>
                  </div>
                  <p className="card-description">Your latest actions</p>
                </div>
                <div className="card-content">
                  <ActivityTimeline 
                    activities={profileData.recentActivities}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
