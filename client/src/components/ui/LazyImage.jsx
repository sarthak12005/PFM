import React, { useState, useRef, useEffect } from 'react'

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = null,
  fallback = null,
  onLoad = () => {},
  onError = () => {},
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad()
  }

  const handleError = () => {
    setIsError(true)
    onError()
  }

  const defaultPlaceholder = (
    <div className={`bg-gray-200 animate-pulse flex items-center justify-center ${className}`}>
      <div className="text-gray-400 text-sm">Loading...</div>
    </div>
  )

  const defaultFallback = (
    <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
      <div className="text-gray-500 text-sm">Image not available</div>
    </div>
  )

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {!isInView && (placeholder || defaultPlaceholder)}
      
      {isInView && !isError && (
        <>
          {!isLoaded && (placeholder || defaultPlaceholder)}
          <img
            src={src}
            alt={alt}
            className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
            onLoad={handleLoad}
            onError={handleError}
            loading="lazy"
            {...props}
          />
        </>
      )}
      
      {isError && (fallback || defaultFallback)}
    </div>
  )
}

export default LazyImage
