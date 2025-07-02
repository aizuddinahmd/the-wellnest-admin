import ComponentCard from '@/components/common/ComponentCard'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
// import PricingCard2 from '@/components/pricing/PricingCard2'
import PricingCard from '@/components/pricing/PricingCard'
// import TabWithUnderline from '@/components/ui/tabs/TabWithUnderline'
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
