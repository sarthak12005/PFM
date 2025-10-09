import React from 'react'
import { TrendingUp } from 'lucide-react'

const LoadingSpinner = ({ size = 'large', message = 'Loading...' }) => {
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  }

  const Skeleton = ({ className }) => (
    <div className={`bg-gray-200 animate-pulse rounded-md ${className}`}></div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 sm:h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-10 w-40 mt-4 sm:mt-0" />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm animate-pulse">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse"></div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm animate-pulse">
              <Skeleton className="h-5 w-40 mb-4" />
              <Skeleton className="h-64 sm:h-80 w-full rounded-lg" />
            </div>
          ))}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm animate-pulse">
          <Skeleton className="h-5 w-40 mb-4" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Alternative minimal spinner for inline use
export const InlineSpinner = ({ size = 'small' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-6 w-6',
    large: 'h-8 w-8'
  }

  return (
    <div className={`${sizeClasses[size]} border-2 border-gray-200 border-t-primary-600 rounded-full animate-spin`}></div>
  )
}

// Page loading spinner
export const PageSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoadingSpinner size="large" message="Loading SaveWise..." />
    </div>
  )
}

export default LoadingSpinner
