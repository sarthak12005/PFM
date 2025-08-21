import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

const SummaryCard = ({ 
  title, 
  amount, 
  icon: Icon, 
  color, 
  trend, 
  trendDirection,
  subtitle,
  description,
  onClick,
  loading = false,
  className = '',
  size = 'default' // 'small', 'default', 'large'
}) => {
  const [displayAmount, setDisplayAmount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (loading) return

    setIsAnimating(true)
    const timer = setTimeout(() => {
      setDisplayAmount(amount)
      setIsAnimating(false)
    }, 150)

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
    if (trendDirection === 'up') return <TrendingUp size={14} />
    if (trendDirection === 'down') return <TrendingDown size={14} />
    return null
  }

  const getColorClasses = () => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      red: 'bg-red-100 text-red-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      purple: 'bg-purple-100 text-purple-600',
      indigo: 'bg-indigo-100 text-indigo-600',
      pink: 'bg-pink-100 text-pink-600',
      gray: 'bg-gray-100 text-gray-600'
    }
    return colorMap[color] || 'bg-blue-100 text-blue-600'
  }

  const getSizeClasses = () => {
    const sizeMap = {
      small: 'p-4',
      default: 'p-6',
      large: 'p-8'
    }
    return sizeMap[size] || sizeMap.default
  }

  const getAmountSize = () => {
    const sizeMap = {
      small: 'text-xl',
      default: 'text-2xl',
      large: 'text-3xl'
    }
    return sizeMap[size] || sizeMap.default
  }

  const getIconSize = () => {
    const sizeMap = {
      small: 20,
      default: 24,
      large: 28
    }
    return sizeMap[size] || sizeMap.default
  }

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${getSizeClasses()} ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-3">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          {subtitle && <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>}
          {trend && <div className="h-3 bg-gray-200 rounded w-1/4"></div>}
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 ${getSizeClasses()} ${
        onClick ? 'cursor-pointer hover:scale-102' : ''
      } ${className}`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
          {title}
        </h3>
        {Icon && (
          <div className={`p-2 rounded-lg ${getColorClasses()}`}>
            <Icon size={getIconSize()} />
          </div>
        )}
      </div>

      {/* Amount */}
      <div className="mb-2">
        <p className={`${getAmountSize()} font-bold text-gray-900 transition-all duration-300 ${
          isAnimating ? 'scale-105' : 'scale-100'
        }`}>
          {formatAmount(displayAmount)}
        </p>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-xs text-gray-500 mb-2">{description}</p>
      )}

      {/* Trend */}
      {trend && (
        <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
          {getTrendIcon()}
          <span className="text-xs font-medium">
            {typeof trend === 'number' ? `${trend > 0 ? '+' : ''}${trend}%` : trend}
          </span>
          <span className="text-xs text-gray-400">vs last period</span>
        </div>
      )}
    </div>
  )
}

// Specialized summary cards
export const CompactSummaryCard = (props) => (
  <SummaryCard {...props} size="small" />
)

export const LargeSummaryCard = (props) => (
  <SummaryCard {...props} size="large" />
)

export default SummaryCard
