import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

const DashboardCard = ({
  title,
  amount,
  icon: Icon,
  color,
  trend,
  trendDirection,
  subtitle,
  onClick,
  loading = false,
  className = ''
}) => {
  const [displayAmount, setDisplayAmount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (loading) return

    setIsAnimating(true)
    const timer = setTimeout(() => {
      setDisplayAmount(amount)
      setIsAnimating(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [amount, loading])

  const formatAmount = (value) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)}Cr`
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`
    } else if (value >= 1000) {
      return `₹${(value / 1000).toFixed(1)}K`
    }
    return `₹${value.toLocaleString()}`
  }

  const getTrendColor = () => {
    if (trendDirection === 'up') return 'text-green-600'
    if (trendDirection === 'down') return 'text-red-600'
    return 'text-gray-600'
  }

  const getTrendIcon = () => {
    if (trendDirection === 'up') return <TrendingUp size={16} />
    if (trendDirection === 'down') return <TrendingDown size={16} />
    return null
  }

  const getColorClasses = () => {
    const colorMap = {
      blue: 'bg-blue-500 text-white',
      green: 'bg-green-500 text-white',
      red: 'bg-red-500 text-white',
      yellow: 'bg-yellow-500 text-white',
      purple: 'bg-purple-500 text-white',
      indigo: 'bg-indigo-500 text-white',
      pink: 'bg-pink-500 text-white',
      gray: 'bg-gray-500 text-white'
    }
    return colorMap[color] || 'bg-blue-500 text-white'
  }

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-200 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 ${
        onClick ? 'cursor-pointer hover:scale-105' : ''
      } ${className}`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
          {title}
        </h3>
        {Icon && (
          <div className={`p-3 rounded-lg ${getColorClasses()}`}>
            <Icon size={24} />
          </div>
        )}
      </div>

      {/* Amount */}
      <div className="mb-2">
        <p className={`text-3xl font-bold text-gray-900 transition-all duration-300 ${
          isAnimating ? 'scale-110' : 'scale-100'
        }`}>
          {formatAmount(displayAmount)}
        </p>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>

      {/* Trend */}
      {trend && (
        <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
          {getTrendIcon()}
          <span className="text-sm font-medium">
            {typeof trend === 'number' ? `${trend > 0 ? '+' : ''}${trend}%` : trend}
          </span>
          <span className="text-xs text-gray-500">vs last month</span>
        </div>
      )}
    </div>
  )
}

// Specialized dashboard cards
export const IncomeCard = ({ amount, trend, trendDirection, loading, onClick }) => (
  <DashboardCard
    title="Total Income"
    amount={amount}
    icon={TrendingUp}
    color="green"
    trend={trend}
    trendDirection={trendDirection}
    loading={loading}
    onClick={onClick}
  />
)

export const ExpenseCard = ({ amount, trend, trendDirection, loading, onClick }) => (
  <DashboardCard
    title="Total Expenses"
    amount={amount}
    icon={TrendingDown}
    color="red"
    trend={trend}
    trendDirection={trendDirection}
    loading={loading}
    onClick={onClick}
  />
)

export const SavingsCard = ({ amount, trend, trendDirection, loading, onClick }) => (
  <DashboardCard
    title="Total Savings"
    amount={amount}
    icon={TrendingUp}
    color="blue"
    trend={trend}
    trendDirection={trendDirection}
    loading={loading}
    onClick={onClick}
  />
)

export default DashboardCard
