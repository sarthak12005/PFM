import React from 'react'
import { AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react'

const BudgetProgressBar = ({ category, formatCurrency }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'exceeded':
        return {
          color: 'bg-red-500',
          bgColor: 'bg-red-100',
          textColor: 'text-red-700',
          icon: AlertTriangle,
          iconColor: 'text-red-600'
        }
      case 'warning':
        return {
          color: 'bg-yellow-500',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-700',
          icon: TrendingUp,
          iconColor: 'text-yellow-600'
        }
      default:
        return {
          color: 'bg-green-500',
          bgColor: 'bg-green-100',
          textColor: 'text-green-700',
          icon: CheckCircle,
          iconColor: 'text-green-600'
        }
    }
  }

  const statusConfig = getStatusConfig(category.status)
  const StatusIcon = statusConfig.icon
  const progressWidth = Math.min(100, category.progress)

  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
      {/* Category Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div 
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: category.color }}
          ></div>
          <h4 className="font-medium text-gray-900">{category.name}</h4>
          <StatusIcon size={16} className={statusConfig.iconColor} />
        </div>
        
        <div className="text-right">
          <div className="text-sm font-medium text-gray-900">
            {formatCurrency(category.spentAmount)} / {formatCurrency(category.budgetAmount)}
          </div>
          <div className={`text-xs ${statusConfig.textColor}`}>
            {category.progress.toFixed(1)}% used
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className={`w-full h-3 ${statusConfig.bgColor} rounded-full overflow-hidden`}>
          <div 
            className={`h-full ${statusConfig.color} transition-all duration-500 ease-out rounded-full`}
            style={{ 
              width: `${progressWidth}%`,
              backgroundColor: category.color
            }}
          ></div>
          
          {/* Overflow indicator for exceeded budgets */}
          {category.progress > 100 && (
            <div 
              className="absolute top-0 left-0 h-full bg-red-500 opacity-30 rounded-full"
              style={{ width: '100%' }}
            ></div>
          )}
        </div>
        
        {/* Progress markers */}
        <div className="absolute top-0 left-0 w-full h-3 flex items-center">
          {/* 80% warning marker */}
          <div 
            className="absolute w-0.5 h-4 bg-yellow-400 -mt-0.5"
            style={{ left: '80%' }}
          ></div>
          {/* 100% limit marker */}
          <div 
            className="absolute w-0.5 h-4 bg-red-400 -mt-0.5"
            style={{ left: '100%' }}
          ></div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="flex items-center justify-between mt-3 text-sm">
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">
            Remaining: <span className="font-medium text-gray-900">
              {formatCurrency(category.remaining)}
            </span>
          </span>
          
          {category.status === 'exceeded' && (
            <span className="text-red-600">
              Over by: <span className="font-medium">
                {formatCurrency(category.spentAmount - category.budgetAmount)}
              </span>
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {category.status === 'good' && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              On Track
            </span>
          )}
          {category.status === 'warning' && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
              Near Limit
            </span>
          )}
          {category.status === 'exceeded' && (
            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
              Over Budget
            </span>
          )}
        </div>
      </div>

      {/* Spending Insights */}
      {category.spentAmount > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
            <div>
              <span className="block">Daily Average:</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(category.spentAmount / new Date().getDate())}
              </span>
            </div>
            <div>
              <span className="block">Projected Monthly:</span>
              <span className="font-medium text-gray-900">
                {formatCurrency((category.spentAmount / new Date().getDate()) * 30)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BudgetProgressBar
