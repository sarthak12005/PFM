import { useState, useEffect, useRef } from 'react'

/**
 * Custom hook for intersection observer
 * Useful for lazy loading and infinite scroll
 */
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const elementRef = useRef(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting
        setIsIntersecting(isElementIntersecting)
        
        if (isElementIntersecting && !hasIntersected) {
          setHasIntersected(true)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [hasIntersected, options])

  return {
    elementRef,
    isIntersecting,
    hasIntersected
  }
}

/**
 * Hook for lazy loading components
 */
export const useLazyLoad = (options = {}) => {
  const { elementRef, hasIntersected } = useIntersectionObserver(options)
  
  return {
    ref: elementRef,
    shouldLoad: hasIntersected
  }
}

/**
 * Hook for infinite scroll
 */
export const useInfiniteScroll = (callback, options = {}) => {
  const { elementRef, isIntersecting } = useIntersectionObserver(options)
  
  useEffect(() => {
    if (isIntersecting && callback) {
      callback()
    }
  }, [isIntersecting, callback])
  
  return elementRef
}
