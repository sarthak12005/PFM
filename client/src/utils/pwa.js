// PWA utilities for SaveWise
import toast from 'react-hot-toast'

// Register service worker
export const registerServiceWorker = () => {
  // Only register service worker in production
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js')
        // console.log('Service Worker registered successfully:', registration)

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available
              showUpdateAvailableNotification()
            }
          })
        })

        // Listen for controlling service worker changes
        let refreshing = false;

        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (!refreshing) {
            refreshing = true;
            window.location.reload();
          }
        });


      } catch (error) {
        console.error('Service Worker registration failed:', error)
      }
    })
  }
}

// Show update available notification
const showUpdateAvailableNotification = () => {
  toast('Update Available: A new version of SaveWise is ready! Click to update.', {
    duration: 10000,
    position: 'bottom-center',
    action: {
      label: 'Update',
      onClick: () => window.location.reload()
    }
  })
}

// Check if app is running as PWA
export const isPWA = () => {
  return window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true ||
    document.referrer.includes('android-app://')
}

// Install prompt handling
let deferredPrompt = null

export const initInstallPrompt = () => {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault()
    // Stash the event so it can be triggered later
    deferredPrompt = e

    // Show install button/banner
    showInstallPrompt()
  })

  window.addEventListener('appinstalled', () => {
    // console.log('PWA was installed')
    deferredPrompt = null
    hideInstallPrompt()

    toast.success('SaveWise installed successfully!', {
      duration: 3000,
      position: 'bottom-center'
    })
  })
}

// Show install prompt
const showInstallPrompt = () => {
  // Only show if not already installed
  if (!isPWA()) {
    toast('Install SaveWise: Add to home screen for quick access', {
      duration: 8000,
      position: 'bottom-center',
      action: {
        label: 'Install',
        onClick: () => installApp()
      }
    })
  }
}

// Hide install prompt
const hideInstallPrompt = () => {
  // Implementation to hide install UI
  // console.log('Hiding install prompt')
}

// Trigger app installation
export const installApp = async () => {
  if (deferredPrompt) {
    try {
      // Show the install prompt
      deferredPrompt.prompt()

      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === 'accepted') {
        // console.log('User accepted the install prompt')
      } else {
        // console.log('User dismissed the install prompt')
      }

      deferredPrompt = null
    } catch (error) {
      console.error('Error during app installation:', error)
    }
  } else {
    // Fallback for browsers that don't support install prompt
    toast.error('Installation not available on this device', {
      duration: 3000
    })
  }
}

// Check for app updates
export const checkForUpdates = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration) {
        await registration.update()
      }
    } catch (error) {
      console.error('Error checking for updates:', error)
    }
  }
}

// Handle offline/online status
export const initNetworkStatus = () => {
  const updateOnlineStatus = () => {
    if (navigator.onLine) {
      toast.success('Back online!', {
        duration: 2000,
        position: 'bottom-center'
      })

      // Trigger background sync if available
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        navigator.serviceWorker.ready.then((registration) => {
          return registration.sync.register('background-sync-transactions')
        }).catch((error) => {
          console.error('Background sync registration failed:', error)
        })
      }
    } else {
      toast.error('You are offline. Some features may be limited.', {
        duration: 5000,
        position: 'bottom-center'
      })
    }
  }

  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)

  // Initial status check
  if (!navigator.onLine) {
    updateOnlineStatus()
  }
}

// Request notification permission
export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    try {
      const permission = await Notification.requestPermission()

      if (permission === 'granted') {
        toast.success('Notifications enabled!', {
          duration: 2000
        })
        return true
      } else {
        toast.error('Notifications disabled', {
          duration: 2000
        })
        return false
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return false
    }
  }
  return false
}

// Show local notification
export const showNotification = (title, options = {}) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    const notificationOptions = {
      vibrate: [100, 50, 100],
      ...options
    }

    // Only add icons in production where they exist
    if (import.meta.env.PROD) {
      notificationOptions.icon = '/icons/icon-192x192.png'
      notificationOptions.badge = '/icons/badge-72x72.png'
    }

    const notification = new Notification(title, notificationOptions)

    // Auto close after 5 seconds
    setTimeout(() => {
      notification.close()
    }, 5000)

    return notification
  }
}

// Initialize all PWA features
export const initPWA = () => {
  registerServiceWorker()
  initInstallPrompt()
  initNetworkStatus()

  // Check for updates every 30 minutes
  setInterval(checkForUpdates, 30 * 60 * 1000)
}
