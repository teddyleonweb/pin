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
      return res.status(400).json({ success: false, message: 'Invalid PIN format' })
    }

    try {
      if (action === 'add') {
        await addPin(pin)
        res.status(200).json({ success: true, message: 'PIN added successfully' })
      } else if (action === 'remove') {
        await removePin(pin)
        res.status(200).json({ success: true, message: 'PIN removed successfully' })
      } else {
        res.status(400).json({ success: false, message: 'Invalid action' })
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error processing request' })
    }
  } else if (req.method === 'GET') {
    try {
      const pins = await listPins()
      res.status(200).json({ success: true, pins })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching PINs' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}