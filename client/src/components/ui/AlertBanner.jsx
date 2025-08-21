import React from 'react'
import { AlertTriangle, AlertCircle, CheckCircle, X, TrendingUp } from 'lucide-react'

const AlertBanner = ({ alert, onDismiss }) => {
  const getAlertConfig = (type) => {
    switch (type) {
      case 'exceeded':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: AlertTriangle,
          iconColor: 'text-red-600'
        }
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          icon: AlertCircle,
          iconColor: 'text-yellow-600'
        }
      case 'goal_reached':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          icon: CheckCircle,
          iconColor: 'text-green-600'
        }
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: TrendingUp,
          iconColor: 'text-blue-600'
        }
    }
  }

  const config = getAlertConfig(alert.type)
  const AlertIcon = config.icon

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
  }

  return (
    <div className={`${config.bg} ${config.border} border rounded-lg p-4 transition-all duration-300 hover:shadow-md`}>
      <div className="flex items-start space-x-3">
        <div className={`flex-shrink-0 ${config.iconColor}`}>
          <AlertIcon size={20} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className={`font-medium ${config.text}`}>
              {alert.category ? `${alert.category} Budget Alert` : 'Budget Alert'}
            </h4>
            <span className={`text-xs ${config.text} opacity-75`}>
              {formatDate(alert.createdAt)}
            </span>
          </div>
          
          <p className={`mt-1 text-sm ${config.text} opacity-90`}>
            {alert.message}
          </p>
          
          {alert.threshold && (
            <div className="mt-2 flex items-center space-x-2">
              <span className={`text-xs ${config.text} opacity-75`}>
                Threshold: {alert.threshold}%
              </span>
              {alert.category && (
                <span className={`px-2 py-1 text-xs rounded-full ${config.bg} ${config.text} border ${config.border}`}>
                  {alert.category}
                </span>
              )}
            </div>
          )}
        </div>
        
        <button
          onClick={() => onDismiss(alert._id)}
          className={`flex-shrink-0 ${config.text} hover:opacity-75 transition-opacity`}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

export default AlertBanner
