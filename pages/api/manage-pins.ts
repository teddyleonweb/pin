import type { NextApiRequest, NextApiResponse } from 'next'
import { addPin, removePin, listPins } from '@/lib/db'

type Data = {
  success: boolean
  message?: string
  pins?: string[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    const { action, pin } = req.body

    if (typeof pin !== 'string') {
      return res.status(400).json({ success: false, message: 'Formato de PIN inválido' })
    }

    try {
      if (action === 'add') {
        await addPin(pin)
        res.status(200).json({ success: true, message: 'PIN añadido exitosamente' })
      } else if (action === 'remove') {
        await removePin(pin)
        res.status(200).json({ success: true, message: 'PIN eliminado exitosamente' })
      } else {
        res.status(400).json({ success: false, message: 'Acción inválida' })
      }
    } catch (error) {
      console.error('Error al procesar la solicitud:', error)
      res.status(500).json({ success: false, message: 'Error al procesar la solicitud' })
    }
  } else if (req.method === 'GET') {
    try {
      const pins = await listPins()
      res.status(200).json({ success: true, pins })
    } catch (error) {
      console.error('Error al obtener los PINs:', error)
      res.status(500).json({ success: false, message: 'Error al obtener los PINs' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}