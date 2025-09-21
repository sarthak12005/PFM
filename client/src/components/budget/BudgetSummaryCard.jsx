import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

const BudgetSummaryCard = ({ 
  title, 
  amount, 
  icon: Icon, 
  color, 
  progress, 
  formatCurrency,
  trend,
  trendDirection 
}) => {
  const getColorClasses = (color) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-50',
          icon: 'text-blue-600',
          border: 'border-blue-200',
          gradient: 'from-blue-500 to-blue-600',
          progress: 'bg-blue-500'
        }
      case 'red':
        return {
          bg: 'bg-red-50',
          icon: 'text-red-600',
          border: 'border-red-200',
          gradient: 'from-red-500 to-red-600',
          progress: 'bg-red-500'
        }
      case 'green':
        return {
          bg: 'bg-green-50',
          icon: 'text-green-600',
          border: 'border-green-200',
          gradient: 'from-green-500 to-green-600',
          progress: 'bg-green-500'
        }
      case 'purple':
        return {
          bg: 'bg-purple-50',
          icon: 'text-purple-600',
          border: 'border-purple-200',
          gradient: 'from-purple-500 to-purple-600',
          progress: 'bg-purple-500'
        }
      case 'yellow':
        return {
          bg: 'bg-yellow-50',
          icon: 'text-yellow-600',
          border: 'border-yellow-200',
          gradient: 'from-yellow-500 to-yellow-600',
          progress: 'bg-yellow-500'
        }
      default:
        return {
          bg: 'bg-gray-50',
          icon: 'text-gray-600',
          border: 'border-gray-200',
          gradient: 'from-gray-500 to-gray-600',
          progress: 'bg-gray-500'
        }
    }
  }

  const colorClasses = getColorClasses(color)

  return (
    <div className="card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden p-2">
      {/* Background gradient decoration */}
      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${colorClasses.gradient} opacity-5 rounded-full transform translate-x-8 -translate-y-8`}></div>
      
      <div className="card-content relative">
        <div className="flex items-center justify-between mb-1">
          <div className={`p-3 rounded-lg ${colorClasses.bg} ${colorClasses.border} border`}>
            <Icon size={24} className={colorClasses.icon} />
          </div>
          
          {/* Trend Indicator */}
          {trend && (
            <div className="flex items-center space-x-1">
              {trendDirection === 'up' ? (
                <TrendingUp size={16} className="text-green-500" />
              ) : (
                <TrendingDown size={16} className="text-red-500" />
              )}
              <span className={`text-sm font-medium ${
                trendDirection === 'up' ? 'text-green-500' : 'text-red-500'
              }`}>
                {trend}
              </span>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(amount)}
          </p>
          
          {/* Progress Bar */}
          {progress !== undefined && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`${colorClasses.progress} h-2 rounded-full transition-all duration-500 ease-out`}
                  style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BudgetSummaryCard
