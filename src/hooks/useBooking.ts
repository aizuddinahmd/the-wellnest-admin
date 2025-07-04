import { useState } from 'react'

interface BookSessionParams {
  userId: string
  eventId: string
  usePackage: boolean
  packageId?: string
}

interface BookingResult {
  success: boolean
  booking?: unknown
  error?: string
}

export function useBooking() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<BookingResult | null>(null)

  async function bookSession({
    userId,
    eventId,
    usePackage,
    packageId,
  }: BookSessionParams) {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, eventId, usePackage, packageId }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Booking failed')
        setResult({ success: false, error: data.error })
        return { success: false, error: data.error }
      }
      setResult({ success: true, booking: data.booking })
      return { success: true, booking: data.booking }
    } catch {
      setError('Booking failed')
      setResult({ success: false, error: 'Booking failed' })
      return { success: false, error: 'Booking failed' }
    } finally {
      setLoading(false)
    }
  }

  return { bookSession, loading, error, result }
}
