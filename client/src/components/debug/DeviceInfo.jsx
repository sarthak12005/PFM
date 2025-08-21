import React, { useState, useEffect } from 'react'
import { Monitor, Smartphone, Tablet, Wifi, WifiOff, Battery, Signal } from 'lucide-react'

const DeviceInfo = () => {
  const [deviceInfo, setDeviceInfo] = useState({})
  const [networkInfo, setNetworkInfo] = useState({})
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const getDeviceInfo = () => {
      const info = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
        colorDepth: window.screen.colorDepth,
        orientation: window.screen.orientation?.type || 'unknown',
        touchSupport: 'ontouchstart' in window,
        maxTouchPoints: navigator.maxTouchPoints || 0,
        hardwareConcurrency: navigator.hardwareConcurrency,
        memory: navigator.deviceMemory || 'unknown',
        connection: navigator.connection || navigator.mozConnection || navigator.webkitConnection
      }
      
      setDeviceInfo(info)
    }

    const getNetworkInfo = () => {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
      if (connection) {
        setNetworkInfo({
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData
        })
      }
    }

    getDeviceInfo()
    getNetworkInfo()

    const handleResize = () => {
      setDeviceInfo(prev => ({
        ...prev,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight
      }))
    }

    const handleOrientationChange = () => {
      setTimeout(() => {
        setDeviceInfo(prev => ({
          ...prev,
          orientation: window.screen.orientation?.type || 'unknown',
          windowWidth: window.innerWidth,
          windowHeight: window.innerHeight
        }))
      }, 100)
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleOrientationChange)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleOrientationChange)
    }
  }, [])

  const getDeviceType = () => {
    const width = deviceInfo.windowWidth
    if (width < 768) return { type: 'Mobile', icon: Smartphone, color: 'text-green-600' }
    if (width < 1024) return { type: 'Tablet', icon: Tablet, color: 'text-blue-600' }
    return { type: 'Desktop', icon: Monitor, color: 'text-purple-600' }
  }

  const getConnectionQuality = () => {
    const effectiveType = networkInfo.effectiveType
    switch (effectiveType) {
      case 'slow-2g': return { quality: 'Very Slow', color: 'text-red-600' }
      case '2g': return { quality: 'Slow', color: 'text-orange-600' }
      case '3g': return { quality: 'Good', color: 'text-yellow-600' }
      case '4g': return { quality: 'Fast', color: 'text-green-600' }
      default: return { quality: 'Unknown', color: 'text-gray-600' }
    }
  }

  const device = getDeviceType()
  const connection = getConnectionQuality()
  const DeviceIcon = device.icon

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded-full shadow-lg z-50 hover:bg-gray-700 transition-colors"
        title="Show device info"
      >
        <Monitor size={20} />
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-xl p-4 max-w-sm z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">Device Info</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>

      <div className="space-y-3 text-sm">
        {/* Device Type */}
        <div className="flex items-center space-x-2">
          <DeviceIcon size={16} className={device.color} />
          <span className="font-medium">{device.type}</span>
          <span className="text-gray-500">
            {deviceInfo.windowWidth}×{deviceInfo.windowHeight}
          </span>
        </div>

        {/* Screen Info */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-gray-500">Screen:</span>
            <br />
            {deviceInfo.screenWidth}×{deviceInfo.screenHeight}
          </div>
          <div>
            <span className="text-gray-500">Pixel Ratio:</span>
            <br />
            {deviceInfo.devicePixelRatio}x
          </div>
        </div>

        {/* Orientation */}
        <div className="flex items-center space-x-2">
          <span className="text-gray-500">Orientation:</span>
          <span className="capitalize">{deviceInfo.orientation}</span>
        </div>

        {/* Touch Support */}
        <div className="flex items-center space-x-2">
          <span className="text-gray-500">Touch:</span>
          <span className={deviceInfo.touchSupport ? 'text-green-600' : 'text-red-600'}>
            {deviceInfo.touchSupport ? 'Supported' : 'Not Supported'}
          </span>
          {deviceInfo.maxTouchPoints > 0 && (
            <span className="text-gray-500">({deviceInfo.maxTouchPoints} points)</span>
          )}
        </div>

        {/* Network Status */}
        <div className="flex items-center space-x-2">
          {deviceInfo.onLine ? (
            <Wifi size={16} className="text-green-600" />
          ) : (
            <WifiOff size={16} className="text-red-600" />
          )}
          <span className={deviceInfo.onLine ? 'text-green-600' : 'text-red-600'}>
            {deviceInfo.onLine ? 'Online' : 'Offline'}
          </span>
        </div>

        {/* Connection Quality */}
        {networkInfo.effectiveType && (
          <div className="flex items-center space-x-2">
            <Signal size={16} className={connection.color} />
            <span className={connection.color}>{connection.quality}</span>
            <span className="text-gray-500">({networkInfo.effectiveType})</span>
          </div>
        )}

        {/* Performance Info */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-gray-500">CPU Cores:</span>
            <br />
            {deviceInfo.hardwareConcurrency || 'Unknown'}
          </div>
          <div>
            <span className="text-gray-500">Memory:</span>
            <br />
            {deviceInfo.memory !== 'unknown' ? `${deviceInfo.memory}GB` : 'Unknown'}
          </div>
        </div>

        {/* Data Saver */}
        {networkInfo.saveData !== undefined && (
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">Data Saver:</span>
            <span className={networkInfo.saveData ? 'text-orange-600' : 'text-green-600'}>
              {networkInfo.saveData ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        )}

        {/* PWA Status */}
        <div className="flex items-center space-x-2">
          <span className="text-gray-500">PWA:</span>
          <span className={window.matchMedia('(display-mode: standalone)').matches ? 'text-green-600' : 'text-gray-600'}>
            {window.matchMedia('(display-mode: standalone)').matches ? 'Installed' : 'Browser'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default DeviceInfo
