'use client'
import CustomerManagement from '@/components/admin/CustomerManagement'
import EventsToday from '@/components/admin/EventsToday'

export default function AdminPage() {
  return (
    <>
      <EventsToday />
      <CustomerManagement />
    </>
  )
}
