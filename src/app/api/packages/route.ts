import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createClient()
    // 1. Insert into service_pricing
    const { data: pricing, error: pricingError } = await supabase
      .from('service_pricing')
      .insert([
        {
          label: body.label,
          pricing_type: body.pricing_type,
          price: body.price,
          sessions_included: body.sessions_included,
          duration_days:
            body.pricing_type === 'membership' ? body.duration_days : null,
          service_id: null,
        },
      ])
      .select()
      .single()
    if (pricingError || !pricing) {
      return NextResponse.json(
        { error: pricingError?.message || 'Failed to create package' },
        { status: 400 },
      )
    }
    // 2. Insert into package_services
    const services = body.services || []
    if (services.length > 0) {
      const packageServices = services.map((s: any) => ({
        pricing_id: pricing.id,
        service_id: s.service_id,
        sessions_included: s.sessions,
      }))
      const { error: psError } = await supabase
        .from('package_services')
        .insert(packageServices)
      if (psError) {
        return NextResponse.json({ error: psError.message }, { status: 400 })
      }
    }
    return NextResponse.json({ success: true, pricing }, { status: 201 })
  } catch (error) {
    console.error('Error creating package:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
