'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNotification } from '@/components/notification'

export default function AdminPage() {
  const [pins, setPins] = useState<string[]>([])
  const [newPin, setNewPin] = useState('')
  const [isClient, setIsClient] = useState(false)
  const { showError, clearError, NotificationComponent } = useNotification()

  const fetchPins = useCallback(async () => {
    try {
      const response = await fetch('/api/manage-pins')
      const data = await response.json()
      if (data.success) {
        setPins(data.pins || [])
      } else {
        showError('Error al cargar los PINs')
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error)
      showError('Error al conectar con el servidor')
    }
  }, [showError])

  useEffect(() => {
    setIsClient(true)
    fetchPins()
  }, [fetchPins])

  const handleAddPin = async () => {
    clearError()
    try {
      const response = await fetch('/api/manage-pins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', pin: newPin }),
      })
      const data = await response.json()
      if (data.success) {
        setNewPin('')
        fetchPins()
      } else {
        showError(data.message || 'Error al añadir el PIN')
      }
    } catch (error) {
      console.error('Error al añadir el PIN:', error)
      showError('Error al conectar con el servidor')
    }
  }

  const handleRemovePin = async (pin: string) => {
    clearError()
    try {
      const response = await fetch('/api/manage-pins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'remove', pin }),
      })
      const data = await response.json()
      if (data.success) {
        fetchPins()
      } else {
        showError(data.message || 'Error al eliminar el PIN')
      }
    } catch (error) {
      console.error('Error al eliminar el PIN:', error)
      showError('Error al conectar con el servidor')
    }
  }

  if (!isClient) {
    return null
  }

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Panel de Administración - Gestionar PINs</h1>
        <div className="mb-4 flex">
          <Input
            type="text"
            value={newPin}
            onChange={(e) => setNewPin(e.target.value)}
            placeholder="Ingrese nuevo PIN"
            className="mr-2"
          />
          <Button onClick={handleAddPin}>Añadir PIN</Button>
        </div>
        <ul className="space-y-2">
          {pins.map((pin) => (
            <li key={pin} className="flex justify-between items-center">
              <span>{pin}</span>
              <Button onClick={() => handleRemovePin(pin)} variant="destructive">Eliminar</Button>
            </li>
          ))}
        </ul>
      </div>
      {NotificationComponent}
    </>
  )
}