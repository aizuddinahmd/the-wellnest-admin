import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json()
    const supabase = await createClient()
    const bookingId = params.id

    // Update only booking status and notes (payment info goes to payments table via transactions)
    const { data, error } = await supabase
      .from('bookings')
      .update({
        status: body.status,
        notes: body.notes || '',
      })
      .eq('id', bookingId)
      .select()
      .single()

    if (error) {
      console.error('Error updating booking:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, booking: data }, { status: 200 })
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const supabase = await createClient()
    const bookingId = params.id

    const { data, error } = await supabase
      .from('bookings')
      .select(
        `
        *,
        event:events (
          id,
          title,
          start_time,
          service_id,
          service:services (
            name,
            service_pricing (
              id,
              price
            )
          )
        ),
        user:users (
          full_name,
          email,
          phone
        ),
        staff:staff (
          full_name
        )
      `,
      )
      .eq('id', bookingId)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching booking:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
