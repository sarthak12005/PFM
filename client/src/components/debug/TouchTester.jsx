import React, { useState, useRef, useEffect } from 'react'
import { Hand, RotateCcw } from 'lucide-react'

const TouchTester = () => {
  const [touches, setTouches] = useState([])
  const [isVisible, setIsVisible] = useState(false)
  const canvasRef = useRef(null)
  const touchHistory = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Clear canvas
    const clearCanvas = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    // Draw touch points
    const drawTouches = () => {
      clearCanvas()
      
      // Draw touch history (fading trails)
      touchHistory.current.forEach((touch, index) => {
        const age = touchHistory.current.length - index
        const opacity = Math.max(0.1, 1 - (age / 50))
        
        ctx.globalAlpha = opacity
        ctx.fillStyle = touch.color
        ctx.beginPath()
        ctx.arc(touch.x, touch.y, touch.radius, 0, 2 * Math.PI)
        ctx.fill()
      })
      
      // Draw current touches
      ctx.globalAlpha = 1
      touches.forEach((touch) => {
        // Draw touch circle
        ctx.fillStyle = touch.color
        ctx.beginPath()
        ctx.arc(touch.x, touch.y, touch.radius, 0, 2 * Math.PI)
        ctx.fill()
        
        // Draw touch ID
        ctx.fillStyle = 'white'
        ctx.font = '12px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(touch.id, touch.x, touch.y + 4)
        
        // Draw force indicator (if supported)
        if (touch.force > 0) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(touch.x, touch.y, touch.radius + (touch.force * 20), 0, 2 * Math.PI)
          ctx.stroke()
        }
      })
    }

    drawTouches()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [touches])

  const getRandomColor = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8']
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const handleTouchStart = (e) => {
    e.preventDefault()
    const rect = canvasRef.current.getBoundingClientRect()
    const newTouches = Array.from(e.touches).map((touch) => ({
      id: touch.identifier,
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
      radius: 20,
      color: getRandomColor(),
      force: touch.force || 0,
      timestamp: Date.now()
    }))
    
    setTouches(newTouches)
    
    // Add to history
    newTouches.forEach(touch => {
      touchHistory.current.push({
        ...touch,
        radius: 15
      })
    })
    
    // Limit history size
    if (touchHistory.current.length > 100) {
      touchHistory.current = touchHistory.current.slice(-100)
    }
  }

  const handleTouchMove = (e) => {
    e.preventDefault()
    const rect = canvasRef.current.getBoundingClientRect()
    const updatedTouches = Array.from(e.touches).map((touch) => ({
      id: touch.identifier,
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
      radius: 20,
      color: touches.find(t => t.id === touch.identifier)?.color || getRandomColor(),
      force: touch.force || 0,
      timestamp: Date.now()
    }))
    
    setTouches(updatedTouches)
    
    // Add to history
    updatedTouches.forEach(touch => {
      touchHistory.current.push({
        ...touch,
        radius: 10
      })
    })
    
    // Limit history size
    if (touchHistory.current.length > 100) {
      touchHistory.current = touchHistory.current.slice(-100)
    }
  }

  const handleTouchEnd = (e) => {
    e.preventDefault()
    const rect = canvasRef.current.getBoundingClientRect()
    const remainingTouches = Array.from(e.touches).map((touch) => ({
      id: touch.identifier,
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
      radius: 20,
      color: touches.find(t => t.id === touch.identifier)?.color || getRandomColor(),
      force: touch.force || 0,
      timestamp: Date.now()
    }))
    
    setTouches(remainingTouches)
  }

  const clearHistory = () => {
    touchHistory.current = []
    setTouches([])
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-16 right-4 bg-blue-600 text-white p-2 rounded-full shadow-lg z-50 hover:bg-blue-700 transition-colors"
        title="Touch Tester"
      >
        <Hand size={20} />
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-96 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-gray-900">Touch Tester</h3>
          <div className="flex space-x-2">
            <button
              onClick={clearHistory}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              title="Clear"
            >
              <RotateCcw size={16} />
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="flex-1 relative">
          <canvas
            ref={canvasRef}
            className="w-full h-full bg-gray-50 touch-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
          />
          
          {touches.length === 0 && touchHistory.current.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Hand size={48} className="mx-auto mb-2 opacity-50" />
                <p>Touch the screen to test touch interactions</p>
                <p className="text-sm mt-1">Multi-touch supported</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t bg-gray-50">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Active Touches:</span>
              <span className="ml-2 font-medium">{touches.length}</span>
            </div>
            <div>
              <span className="text-gray-500">Max Touch Points:</span>
              <span className="ml-2 font-medium">{navigator.maxTouchPoints || 'Unknown'}</span>
            </div>
          </div>
          
          {touches.length > 0 && (
            <div className="mt-2">
              <div className="text-xs text-gray-500 mb-1">Touch Details:</div>
              <div className="space-y-1">
                {touches.map((touch) => (
                  <div key={touch.id} className="flex items-center space-x-2 text-xs">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: touch.color }}
                    />
                    <span>ID: {touch.id}</span>
                    <span>X: {Math.round(touch.x)}</span>
                    <span>Y: {Math.round(touch.y)}</span>
                    {touch.force > 0 && <span>Force: {touch.force.toFixed(2)}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TouchTester
