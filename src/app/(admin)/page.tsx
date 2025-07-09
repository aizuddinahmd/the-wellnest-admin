'use client'
import { BookingsManagement } from '@/components/admin/BookingsManagement'
// import EventsToday from '@/components/admin/EventsToday'
import { EcommerceMetrics } from '@/components/ecommerce/EcommerceMetrics'
import { useEffect, useState } from 'react'
import { Booking, User, Event } from '@/types'

export default function AdminPage() {
  const [bookingsData, setBookingsData] = useState<Booking[]>([])
  const [todaysBookings, setTodaysBookings] = useState<Booking[]>([])
  const [usersData, setUsersData] = useState<User[]>([])
  const [todaysEvents, setTodaysEvents] = useState<Event[]>([])
  const [eventsData, setEventsData] = useState<Event[]>([])
  const [todaysUsers, setTodaysUsers] = useState<User[]>([])
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
        setBookingsData(data)
        const todaysBookings = data.filter((booking: Booking) =>
          isToday(booking.event.start_time),
        )
        setTodaysBookings(todaysBookings)
      } catch {
        // setError('Failed to fetch bookings')
        console.log('Failed to fetch bookings')
      } finally {
        // setLoading(false)
        console.log('Failed to fetch bookings')
      }
    }
    const fetchCustomers = async () => {
      try {
        const res = await fetch('/api/customers')
        const data = await res.json()
        setUsersData(data)
        const todaysUsers = data.filter((user: User) =>
          isToday(user.created_at),
        )
        setTodaysUsers(todaysUsers)
      } catch {
        // setError('Failed to fetch bookings')
        console.log('Failed to fetch bookings')
      } finally {
        // setLoading(false)
        console.log('Failed to fetch bookings')
      }
    }
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events')
        const data = await res.json()
        setEventsData(data)
        const todaysEvents = data.filter((event: Event) =>
          isToday(event.start_time),
        )
        setTodaysEvents(todaysEvents)
      } catch {
        // setError('Failed to fetch bookings')
        console.log('Failed to fetch bookings')
      } finally {
        // setLoading(false)
        console.log('Failed to fetch bookings')
      }
    }
    fetchBookings()
    fetchCustomers()
    fetchEvents()
  }, [])

  return (
    <div>
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-12">
          <EcommerceMetrics
            bookingsData={todaysBookings}
            eventsData={todaysEvents}
            customersData={todaysUsers}
          />
        </div>
        <div className="col-span-12">
          <BookingsManagement
            title="Bookings Today"
            description="Manage your bookings"
            bookingsData={todaysBookings}
            usersData={usersData}
            eventsData={todaysEvents}
          />
        </div>
        {/* <div className="col-span-12">
          <EventsToday />
        </div> */}
      </div>
    </div>
  )
}
