import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyPin } from '@/lib/db'

type Data = {
  isValid: boolean
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    const { pin } = req.body

    if (typeof pin !== 'string') {
      return res.status(400).json({ isValid: false })
    }

    const isValid = await verifyPin(pin)
    res.status(200).json({ isValid })
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}