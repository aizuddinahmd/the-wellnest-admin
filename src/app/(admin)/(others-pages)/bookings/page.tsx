import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import { BookingsManagement } from '@/components/admin/BookingsManagement'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Bookings',
  description: 'this is the bookings page for admin',
  // other metadata
}
export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Bookings" />
      <BookingsManagement title="Bookings" description="Manage your bookings" />
    </div>
  )
}
