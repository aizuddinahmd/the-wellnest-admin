'use client'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import { BookingsManagement } from '@/components/admin/BookingsManagement'
// import { Metadata } from 'next'
import { useEffect, useState } from 'react'
import { Booking } from '@/types'

// export const metadata: Metadata = {
//   title: 'Bookings',
//   description: 'this is the bookings page for admin',
//   // other metadata
// }

export default function BookingsPage() {
  const [bookingsData, setBookingsData] = useState<Booking[]>([])
  useEffect(() => {
    const fetchBookings = async () => {
      const res = await fetch('/api/bookings')
      const data = await res.json()
      setBookingsData(data)
    }
    fetchBookings()
  }, [])

  return (
    <div>
      <PageBreadcrumb pageTitle="Bookings" />
      <BookingsManagement
        title="Bookings"
        description="Manage your bookings"
        bookingsData={bookingsData}
      />
    </div>
  )
}
