'use client'

import { useState, useEffect } from 'react'
import { X, AlertCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface NotificationProps {
  message: string
  onClose: () => void
  duration?: number
}

export function Notification({ message, onClose, duration = 5000 }: NotificationProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg shadow-lg" role="alert">
      <AlertCircle className="h-4 w-4" aria-hidden="true" />
      <span>{message}</span>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-4 w-4 p-0 hover:bg-destructive-foreground/10"
        onClick={onClose}
        aria-label="Cerrar notificación"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function useNotification() {
  const [error, setError] = useState<string | null>(null)

  const showError = (message: string) => {
    setError(message)
  }

  const clearError = () => {
    setError(null)
  }

  return {
    error,
    showError,
    clearError,
    NotificationComponent: error ? (
      <Notification 
        message={error} 
        onClose={clearError}
      />
    ) : null
  }
}