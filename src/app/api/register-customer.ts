import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('body', body)
    const { name, phone, email, eventId } = body

    const supabase = await createClient()

    // 1. Check event capacity
    // const { data: event, error: eventError } = await supabase
    //   .from('events')
    //   .select('id, capacity')
    //   .eq('id', eventId)
    //   .single()

    // if (eventError || !event) {
    //   return NextResponse.json({ error: 'Event not found.' }, { status: 404 })
    // }

    // if (event.capacity <= 0) {
    //   return NextResponse.json(
    //     { error: 'No more slots available for this event.' },
    //     { status: 400 },
    //   )
    // }

    // 2. Create or fetch user
    let userId: string
    const { data: existingUser, error: existingUserError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUserError && existingUserError.code !== 'PGRST116') {
      // PGRST116: No rows found
      console.error('User fetch error:', existingUserError)
      return NextResponse.json(
        { error: existingUserError.message },
        { status: 500 },
      )
    }

    if (existingUser) {
      userId = existingUser.id
    } else {
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert([
          {
            full_name: name,
            email,
            phone,
          },
        ])
        .select('id')
        .single()
      if (userError || !newUser) {
        console.error('User insert error:', userError)
        return NextResponse.json(
          { error: userError?.message || 'Failed to create use' },
          { status: 500 },
        )
      }
      userId = newUser.id
    }

    // 3. Decrement event capacity
    // const { error: updateError } = await supabase
    //   .from('events')
    //   .update({ capacity: event.capacity - 1 })
    //   .eq('id', eventId)

    // if (updateError) {
    //   return NextResponse.json(
    //     { error: 'Failed to update event capacity.' },
    //     { status: 500 },
    //   )
    // }

    // 4. Create booking
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
      console.error('Booking insert error:', bookingError)
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
