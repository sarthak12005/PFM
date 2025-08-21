import React from 'react'
import { TrendingUp } from 'lucide-react'

const LoadingSpinner = ({ size = 'large', message = 'Loading...' }) => {
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        {/* Outer spinning ring */}
        <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin`}></div>
        
        {/* Inner icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <TrendingUp 
            className={`${size === 'small' ? 'h-3 w-3' : size === 'medium' ? 'h-4 w-4' : 'h-6 w-6'} text-primary-600 animate-pulse`} 
          />
        </div>
      </div>
      
      {message && (
        <p className={`mt-4 text-gray-600 ${size === 'small' ? 'text-sm' : 'text-base'} font-medium`}>
          {message}
        </p>
      )}
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
