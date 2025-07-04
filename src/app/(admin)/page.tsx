'use client'
import { BookingsManagement } from '@/components/admin/BookingsManagement'
// import EventsToday from '@/components/admin/EventsToday'
import { EcommerceMetrics } from '@/components/ecommerce/EcommerceMetrics'
import MonthlySalesChart from '@/components/ecommerce/MonthlySalesChart'
import MonthlyTarget from '@/components/ecommerce/MonthlyTarget'

export default function AdminPage() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics />
        <MonthlySalesChart />
      </div>
      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>
      <div className="col-span-12">
        <BookingsManagement
          title="Bookings Today"
          description="Manage your bookings"
        />
      </div>
      {/* <div className="col-span-12">
        <EventsToday />
      </div> */}
    </div>
  )
}
