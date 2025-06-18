'use client'
import BookingsManagement from '@/components/admin/BookingsManagement'
import EventsToday from '@/components/admin/EventsToday'
import { EcommerceMetrics } from '@/components/ecommerce/EcommerceMetrics'

export default function AdminPage() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics />
      </div>
      <div className="col-span-12">
        <EventsToday />
      </div>
      <div className="col-span-12">
        <BookingsManagement />
      </div>
    </div>
  )
}
