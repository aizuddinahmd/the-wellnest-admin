import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

// POST: Create a new service
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createClient()
    console.log(body)

    // 1. Insert service
    const { data: serviceData, error: serviceError } = await supabase
      .from('services')
      .insert([
        {
          name: body.name,
          description: body.description,
          category: body.category,
          duration_minutes: body.duration_minutes,
          base_price: body.base_price,
          image_url: body.image_url,
          is_active: body.is_active ?? true,
        },
      ])
      .select()
      .single()

    if (serviceError) {
      return NextResponse.json({ error: serviceError.message }, { status: 400 })
    }

    const serviceId = serviceData.id

    // 2. Prepare pricing options from frontend variables
    const pricingOptions = [
      {
        pricing_type: 'single',
        label: '1 Session',
        price: body.base_price ? parseFloat(body.base_price) : 0,
        sessions_included: 1,
        duration_days: null,
        service_id: serviceId,
      },
      {
        pricing_type: 'package',
        label: '10-Session Package',
        price: body.package_price ? parseFloat(body.package_price) : 0,
        sessions_included: body.package_sessions
          ? parseInt(body.package_sessions)
          : 10,
        duration_days: body.package_duration_days
          ? parseInt(body.package_duration_days)
          : null,
        service_id: serviceId,
      },
      {
        pricing_type: 'membership',
        label: 'Monthly Membership',
        price: body.membership_price ? parseFloat(body.membership_price) : 0,
        sessions_included: body.membership_sessions
          ? parseInt(body.membership_sessions)
          : 999,
        duration_days: body.membership_duration_days
          ? parseInt(body.membership_duration_days)
          : 30,
        service_id: serviceId,
      },
    ]

    // 3. Insert into service_pricing table
    const { error: pricingError } = await supabase
      .from('service_pricing')
      .insert(pricingOptions)

    if (pricingError) {
      return NextResponse.json({ error: pricingError.message }, { status: 400 })
    }

    return NextResponse.json(
      { ...serviceData, pricing: pricingOptions },
      { status: 201 },
    )
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}

// GET: Fetch all services
export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}

// PATCH: Edit or deactivate a service
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createClient()
    const { id, action, ...fields } = body
    if (!id) {
      return NextResponse.json(
        { error: 'Service id is required' },
        { status: 400 },
      )
    }

    if (action === 'deactivate') {
      // Only deactivate (set is_active to false)
      const { error } = await supabase
        .from('services')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', id)
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
      return NextResponse.json(
        { message: 'Service deactivated' },
        { status: 200 },
      )
    } else if (action === 'edit') {
      // Edit all fields
      const updateFields = {
        name: fields.name,
        description: fields.description,
        category: fields.category,
        duration_minutes: fields.duration_minutes,
        base_price: fields.base_price,
        image_url: fields.image_url,
        is_active: fields.is_active,
        updated_at: new Date().toISOString(),
      }
      // Remove undefined fields
      const updateFieldsRecord = updateFields as Record<string, unknown>
      Object.keys(updateFieldsRecord).forEach(
        (key) =>
          updateFieldsRecord[key] === undefined &&
          delete updateFieldsRecord[key],
      )
      const { error } = await supabase
        .from('services')
        .update(updateFields)
        .eq('id', id)
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
      return NextResponse.json({ message: 'Service updated' }, { status: 200 })
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error updating service:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}

// DELETE: Delete a service
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    if (!id) {
      return NextResponse.json(
        { error: 'Service id is required' },
        { status: 400 },
      )
    }
    const supabase = await createClient()
    const { error } = await supabase.from('services').delete().eq('id', id)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ message: 'Service deleted' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
