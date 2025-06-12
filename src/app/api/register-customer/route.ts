import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, phone, email, eventId } = body

    const supabase = await createClient()

    // 1. Check event capacity
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, capacity')
      .eq('id', eventId)
      .single()

    if (eventError || !event) {
      return NextResponse.json({ error: 'Event not found.' }, { status: 404 })
    }

    if (event.capacity <= 0) {
      return NextResponse.json(
        { error: 'No more slots available for this event.' },
        { status: 400 },
      )
    }

    // 2. Create or fetch user
    let userId: string
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      userId = existingUser.id
    } else {
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert([{ full_name: name, email, phone }])
        .select('id')
        .single()
      if (userError || !newUser) {
        return NextResponse.json(
          { error: userError?.message || 'Failed to create user.' },
          { status: 500 },
        )
      }
      userId = newUser.id
    }

    // 3. Decrement event capacity (atomic update)
    const { data: updatedEvent, error: updateError } = await supabase
      .from('events')
      .update({ capacity: event.capacity - 1 })
      .eq('id', eventId)
      .eq('capacity', event.capacity)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message || 'Failed to update event capacity.' },
        { status: 500 },
      )
    }
    if (!updatedEvent) {
      // No row updated, capacity was already 0 or another booking happened
      return NextResponse.json(
        { error: 'No more slots available for this event.' },
        { status: 400 },
      )
    }

    // 4. Create booking (only if capacity update succeeded)
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([
        {
          event_id: eventId,
          user_id: userId,
          status: 'booked',
          booking_time: new Date().toISOString(),
          attended: false,
          notes: '',
        },
      ])
      .select()
      .single()

    if (bookingError) {
      // Optionally: Roll back the capacity decrement here if needed
      return NextResponse.json(
        { error: bookingError.message || 'Failed to create booking.' },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true, booking }, { status: 201 })
  } catch (error) {
    console.error('Error registering customer:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
