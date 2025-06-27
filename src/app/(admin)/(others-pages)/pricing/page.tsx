import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import { PricingCard } from '@/components/pricing/PricingCard'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'this is the pricing page for admin',
  // other metadata
}
export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Pricing" />
      <PricingCard />
    </div>
  )
}
