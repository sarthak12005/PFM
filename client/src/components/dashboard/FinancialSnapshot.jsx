import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react'

const FinancialSnapshot = ({ summary }) => {
  const [animatedValues, setAnimatedValues] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netSavings: 0,
    transactionCount: 0
  })

  // Animated counter effect
  useEffect(() => {
    const duration = 1500 // 1.5 seconds
    const steps = 60
    const interval = duration / steps

    const animateValue = (key, targetValue) => {
      const increment = targetValue / steps
      let current = 0
      
      const timer = setInterval(() => {
        current += increment
        if (current >= targetValue) {
          setAnimatedValues(prev => ({ ...prev, [key]: targetValue }))
          clearInterval(timer)
        } else {
          setAnimatedValues(prev => ({ ...prev, [key]: Math.floor(current) }))
        }
      }, interval)

      return timer
    }

    const timers = Object.entries(summary).map(([key, value]) => 
      animateValue(key, value)
    )

    return () => timers.forEach(timer => clearInterval(timer))
  }, [summary])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num)
  }

  const cards = [
    {
      title: 'Total Income',
      value: animatedValues.totalIncome,
      icon: TrendingUp,
      color: 'green',
      trend: '+12.5%',
      trendDirection: 'up',
      formatter: formatCurrency
    },
    {
      title: 'Total Expenses',
      value: animatedValues.totalExpenses,
      icon: TrendingDown,
      color: 'red',
      trend: '+8.2%',
      trendDirection: 'up',
      formatter: formatCurrency
    },
    {
      title: 'Net Savings',
      value: animatedValues.netSavings,
      icon: DollarSign,
      color: animatedValues.netSavings >= 0 ? 'blue' : 'red',
      trend: animatedValues.netSavings >= 0 ? '+15.3%' : '-5.2%',
      trendDirection: animatedValues.netSavings >= 0 ? 'up' : 'down',
      formatter: formatCurrency
    },
    {
      title: 'Transactions',
      value: animatedValues.transactionCount,
      icon: Activity,
      color: 'purple',
      trend: '+23',
      trendDirection: 'up',
      formatter: formatNumber
    }
  ]

  const getColorClasses = (color) => {
    switch (color) {
      case 'green':
        return {
          bg: 'bg-green-50',
          icon: 'text-green-600',
          border: 'border-green-200',
          gradient: 'from-green-500 to-green-600'
        }
      case 'red':
        return {
          bg: 'bg-red-50',
          icon: 'text-red-600',
          border: 'border-red-200',
          gradient: 'from-red-500 to-red-600'
        }
      case 'blue':
        return {
          bg: 'bg-blue-50',
          icon: 'text-blue-600',
          border: 'border-blue-200',
          gradient: 'from-blue-500 to-blue-600'
        }
      case 'purple':
        return {
          bg: 'bg-purple-50',
          icon: 'text-purple-600',
          border: 'border-purple-200',
          gradient: 'from-purple-500 to-purple-600'
        }
      default:
        return {
          bg: 'bg-gray-50',
          icon: 'text-gray-600',
          border: 'border-gray-200',
          gradient: 'from-gray-500 to-gray-600'
        }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Financial Overview</h2>
        <span className="text-sm text-gray-500">This Month</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => {
          const Icon = card.icon
          const colorClasses = getColorClasses(card.color)
          
          return (
            <div 
              key={card.title}
              className="card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden p-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background gradient decoration */}
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${colorClasses.gradient} opacity-5 rounded-full transform translate-x-8 -translate-y-8`}></div>
              
              <div className="card-content relative ">
                <div className="flex items-center justify-between mb-2 gap-2">
                  <div className={`p-2 rounded-lg ${colorClasses.bg} ${colorClasses.border} border`}>
                    <Icon size={20} className={colorClasses.icon} />
                  </div>
                  
                  {/* Trend Indicator */}
                  <div className="flex items-center space-x-1">
                    {card.trendDirection === 'up' ? (
                      <TrendingUp size={14} className="text-green-500" />
                    ) : (
                      <TrendingDown size={14} className="text-red-500" />
                    )}
                    <span className={`text-xs font-medium ${
                      card.trendDirection === 'up' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {card.trend}
                    </span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {card.formatter(card.value)}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* Savings Rate */}
        <div className="bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Savings Rate</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-blue-900">
              {summary.totalIncome > 0 ? ((summary.netSavings / summary.totalIncome) * 100).toFixed(1) : 0}%
            </span>
            <span className="text-sm text-blue-600">
              {summary.netSavings >= 0 ? 'Great job!' : 'Need improvement'}
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
              style={{ 
                width: `${Math.min(100, Math.max(0, (summary.netSavings / summary.totalIncome) * 100))}%` 
              }}
            ></div>
          </div>
        </div>

        {/* Expense Ratio */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingDown size={16} className="text-red-600" />
            <span className="text-sm font-medium text-red-800">Expense Ratio</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-red-900">
              {summary.totalIncome > 0 ? ((summary.totalExpenses / summary.totalIncome) * 100).toFixed(1) : 0}%
            </span>
            <span className="text-sm text-red-600">
              of income spent
            </span>
          </div>
          <div className="w-full bg-red-200 rounded-full h-2 mt-2">
            <div 
              className="bg-red-600 h-2 rounded-full transition-all duration-1000"
              style={{ 
                width: `${Math.min(100, (summary.totalExpenses / summary.totalIncome) * 100)}%` 
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FinancialSnapshot
