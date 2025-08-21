import React, { Suspense } from 'react'
import { useLazyLoad } from '../../hooks/useIntersectionObserver'
import LoadingSpinner from './LoadingSpinner'

/**
 * Wrapper component for lazy loading other components
 * Only renders the component when it comes into view
 */
const LazyComponent = ({ 
  children, 
  fallback = <LoadingSpinner />, 
  placeholder = null,
  className = '',
  ...options 
}) => {
  const { ref, shouldLoad } = useLazyLoad(options)

  const defaultPlaceholder = (
    <div className={`min-h-[200px] bg-gray-50 animate-pulse rounded-lg flex items-center justify-center ${className}`}>
      <div className="text-gray-400 text-sm">Loading component...</div>
    </div>
  )

  return (
    <div ref={ref} className={className}>
      {shouldLoad ? (
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      ) : (
        placeholder || defaultPlaceholder
      )}
    </div>
  )
}

export default LazyComponent
