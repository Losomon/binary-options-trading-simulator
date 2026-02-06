import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import './styles/NotificationSystem.css'

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'trade'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: Date
  autoClose?: boolean
  duration?: number
}

interface NotificationSystemProps {
  notifications: Notification[]
  onDismiss: (id: string) => void
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

export function NotificationSystem({ notifications, onDismiss, position = 'top-right' }: NotificationSystemProps) {
  // Auto-close per-notification with cleanup.
  useEffect(() => {
    const timers = notifications
      .filter((n) => n.autoClose !== false)
      .map((n) =>
        window.setTimeout(() => {
          onDismiss(n.id)
        }, n.duration || 5000),
      )

    return () => {
      timers.forEach((t) => window.clearTimeout(t))
    }
  }, [notifications, onDismiss])

  const getPositionStyles = () => {
    const base = { position: 'fixed' as const, zIndex: 9999 }
    switch (position) {
      case 'top-right':
        return { ...base, top: '2rem', right: '2rem' }
      case 'top-left':
        return { ...base, top: '2rem', left: '2rem' }
      case 'bottom-right':
        return { ...base, bottom: '2rem', right: '2rem' }
      case 'bottom-left':
        return { ...base, bottom: '2rem', left: '2rem' }
    }
  }

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return '✓'
      case 'error':
        return '✕'
      case 'warning':
        return '⚠'
      case 'info':
        return 'ℹ'
      case 'trade':
        return '📈'
      default:
        return '•'
    }
  }

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return '#00ff88'
      case 'error':
        return 'var(--neon-pink)'
      case 'warning':
        return '#ffaa00'
      case 'info':
        return 'var(--neon-cyan)'
      case 'trade':
        return 'var(--neon-purple)'
      default:
        return 'var(--neon-cyan)'
    }
  }

  return (
    <div className="notification-container" style={getPositionStyles()}>
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            className={`notification-card ${notification.type}`}
            initial={{ opacity: 0, x: position.includes('right') ? 100 : -100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: position.includes('right') ? 100 : -100, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            onClick={() => onDismiss(notification.id)}
          >
            <button
              type="button"
              className="notification-close"
              onClick={(e) => {
                e.stopPropagation()
                onDismiss(notification.id)
              }}
            >
              ×
            </button>

            <div className="notification-header">
              <div className="notification-icon">{getNotificationIcon(notification.type)}</div>
              <div className="notification-content">
                <div className="notification-title">{notification.title}</div>
                <div className="notification-message">{notification.message}</div>
                <div className="notification-timestamp">{notification.timestamp.toLocaleTimeString()}</div>
              </div>
            </div>

            {notification.autoClose !== false ? (
              <div
                className="notification-progress"
                style={{
                  animationDuration: `${notification.duration || 5000}ms`,
                  background: getNotificationColor(notification.type),
                }}
              />
            ) : null}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// Helper hook to manage notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback(
    (type: NotificationType, title: string, message: string, options?: { autoClose?: boolean; duration?: number }) => {
      const notification: Notification = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        type,
        title,
        message,
        timestamp: new Date(),
        autoClose: options?.autoClose,
        duration: options?.duration,
      }

      setNotifications((prev) => [notification, ...prev])
    },
    [],
  )

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  return {
    notifications,
    addNotification,
    dismissNotification,
    clearAll,
  }
}

// Toast notification component for quick alerts
export const showToast = (type: NotificationType, title: string, message: string) => {
  const event = new CustomEvent('toast', {
    detail: { type, title, message },
  })
  window.dispatchEvent(event)
}

export default NotificationSystem

