import React from 'react'
import { Clock } from 'lucide-react'

const ActivityTimeline = ({ activities }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else if (diffInHours < 48) {
      return 'Yesterday'
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
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

  const getColorClasses = (color) => {
    switch (color) {
      case 'green':
        return {
          bg: 'bg-green-100',
          icon: 'text-green-600',
          dot: 'bg-green-500',
          line: 'bg-green-200'
        }
      case 'red':
        return {
          bg: 'bg-red-100',
          icon: 'text-red-600',
          dot: 'bg-red-500',
          line: 'bg-red-200'
        }
      case 'blue':
        return {
          bg: 'bg-blue-100',
          icon: 'text-blue-600',
          dot: 'bg-blue-500',
          line: 'bg-blue-200'
        }
      case 'purple':
        return {
          bg: 'bg-purple-100',
          icon: 'text-purple-600',
          dot: 'bg-purple-500',
          line: 'bg-purple-200'
        }
      default:
        return {
          bg: 'bg-gray-100',
          icon: 'text-gray-600',
          dot: 'bg-gray-500',
          line: 'bg-gray-200'
        }
    }
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-500">
        <Clock size={48} className="mb-4 text-gray-300" />
        <p className="text-lg font-medium">No recent activity</p>
        <p className="text-sm">Your recent actions will appear here</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="max-h-80 overflow-y-auto">
        <div className="relative">
          {activities.map((activity, index) => {
            const Icon = activity.icon
            const colorClasses = getColorClasses(activity.color)
            const isLast = index === activities.length - 1
            
            return (
              <div key={activity.id} className="relative flex items-start space-x-3 pb-4">
                {/* Timeline Line */}
                {!isLast && (
                  <div className={`absolute left-4 top-8 w-0.5 h-full ${colorClasses.line}`}></div>
                )}
                
                {/* Timeline Dot */}
                <div className="relative flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full ${colorClasses.bg} flex items-center justify-center border-2 border-white shadow-sm`}>
                    <Icon size={14} className={colorClasses.icon} />
                  </div>
                  <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 ${colorClasses.dot} rounded-full`}></div>
                </div>
                
                {/* Activity Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {formatDate(activity.date)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-1">
                    {activity.description}
                    {activity.amount && (
                      <span className={`ml-2 font-semibold ${
                        activity.type === 'transaction' && activity.action === 'Added Income'
                          ? 'text-green-600'
                          : activity.type === 'transaction' && activity.action === 'Expense'
                          ? 'text-red-600'
                          : 'text-gray-900'
                      }`}>
                        {activity.action === 'Added Income' ? '+' : '-'}{formatCurrency(activity.amount)}
                      </span>
                    )}
                  </p>
                  
                  {/* Activity Type Badge */}
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      activity.type === 'transaction'
                        ? 'bg-blue-100 text-blue-800'
                        : activity.type === 'achievement'
                        ? 'bg-purple-100 text-purple-800'
                        : activity.type === 'profile'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {activity.type === 'transaction' ? '💰 Transaction' :
                       activity.type === 'achievement' ? '🏆 Achievement' :
                       activity.type === 'profile' ? '👤 Profile' : '📝 Other'}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      {/* View All Button */}
      <div className="pt-4 border-t border-gray-200">
        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
          View All Activity
        </button>
      </div>
    </div>
  )
}

export default ActivityTimeline
