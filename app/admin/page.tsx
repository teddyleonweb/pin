'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Lock } from 'lucide-react'
import { useNotification } from '@/components/notification'

export default function Home() {
  const [pin, setPin] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const { showError, clearError, NotificationComponent } = useNotification()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    clearError()

    try {
      const response = await fetch('/api/verify-pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin }),
      })

      const data = await response.json()

      if (data.isValid) {
        setIsAuthenticated(true)
      } else {
        showError('PIN incorrecto. Por favor, inténtelo de nuevo.')
      }
    } catch (error) {
      showError('Hubo un error al verificar el PIN. Por favor, inténtelo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isClient) {
    return null
  }

  if (isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-xl">
          <h1 className="text-3xl font-bold text-center mb-6">Bienvenido al Landing</h1>
          <div className="aspect-w-16 aspect-h-9">
            <iframe 
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
              title="Video del Landing"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-cyan-500 to-blue-500">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
          <h1 className="text-3xl font-bold text-center mb-6">Ingrese el PIN</h1>
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type="password"
                placeholder="Ingrese el PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="pl-10"
                disabled={isLoading}
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Verificando...' : 'Confirmar PIN'}
            </Button>
          </form>
        </div>
      </div>
      {NotificationComponent}
    </>
  )
}