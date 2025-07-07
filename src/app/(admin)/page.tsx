'use client'
import { BookingsManagement } from '@/components/admin/BookingsManagement'
// import EventsToday from '@/components/admin/EventsToday'
import { EcommerceMetrics } from '@/components/ecommerce/EcommerceMetrics'
import { useEffect, useState } from 'react'
import { Booking } from '@/types'

export default function AdminPage() {
  const [bookingsData, setBookingsData] = useState<Booking[]>([])
  // const [loading, setLoading] = useState(false)
  // const [error, setError] = useState<string | null>(null)
  function isToday(dateStr: string) {
    const d = new Date(dateStr)
    const today = new Date()
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    )
  }

  useEffect(() => {
    const fetchBookings = async () => {
      // setLoading(true)
      // setError(null)
      try {
        const res = await fetch('/api/bookings')
        const data = await res.json()
        const filteredData = data.filter((booking: Booking) =>
          isToday(booking.event.start_time),
        )
        setBookingsData(filteredData)
      } catch {
        // setError('Failed to fetch bookings')
        console.log('Failed to fetch bookings')
      } finally {
        // setLoading(false)
        console.log('Failed to fetch bookings')
      }
    }
    fetchBookings()
  }, [])

  return (
    <div>
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-12">
          <EcommerceMetrics bookingsData={bookingsData} />
        </div>
        <div className="col-span-12">
          <BookingsManagement
            title="Bookings Today"
            description="Manage your bookings"
            bookingsData={bookingsData}
          />
        </div>
        {/* <div className="col-span-12">
          <EventsToday />
        </div> */}
      </div>
    </div>
  )
}
