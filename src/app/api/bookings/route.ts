import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createClient()
    console.log('body:', body)

    // 1. Check if event has available slots
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, capacity')
      .eq('id', body.event_id)
      .single()
    if (eventError || !event) {
      console.error('Event not found:', eventError)
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }
    const { count: bookedCount, error: countError } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', body.event_id)
    const booked = typeof bookedCount === 'number' ? bookedCount : 0
    if (countError) {
      console.error('Failed to check slots:', countError)
      return NextResponse.json(
        { error: 'Failed to check slots' },
        { status: 400 },
      )
    }
    if (booked >= event.capacity) {
      console.error('Event is fully booked')
      return NextResponse.json(
        { error: 'Event is fully booked' },
        { status: 400 },
      )
    }

    // 2. If using package, validate package
    if (body.use_package) {
      if (!body.package_id) {
        return NextResponse.json(
          { error: 'Package ID required' },
          { status: 400 },
        )
      }
      const { data: pkg, error: pkgError } = await supabase
        .from('packages')
        .select('id, status, remaining_sessions')
        .eq('id', body.package_id)
        .eq('user_id', body.user_id)
        .single()
      if (pkgError || !pkg) {
        return NextResponse.json(
          { error: 'Package not found' },
          { status: 404 },
        )
      }
      if (pkg.status !== 'active' || pkg.remaining_sessions <= 0) {
        return NextResponse.json(
          { error: 'Package is not valid or has no sessions left' },
          { status: 400 },
        )
      }
    }

    // 3. Insert booking record
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([
        {
          user_id: body.user_id,
          event_id: body.event_id,
          //   used_package: body.use_package,
          //   package_id: body.use_package ? body.package_id : null,
        },
      ])
      .select()
      .single()
    if (bookingError || !booking) {
      console.error('Booking error:', bookingError)
      return NextResponse.json(
        {
          error: bookingError?.message || 'Failed to create booking',
          details: bookingError,
        },
        { status: 400 },
      )
    }

    // 3.5. Decrement event capacity
    const { error: updateEventError } = await supabase
      .from('events')
      .update({ capacity: event.capacity - 1 })
      .eq('id', body.event_id)
    if (updateEventError) {
      return NextResponse.json(
        { error: 'Failed to update event capacity' },
        { status: 400 },
      )
    }

    // 4. If using package, insert into package_usage and decrease remaining_sessions
    if (body.use_package) {
      const { error: usageError } = await supabase
        .from('package_usage')
        .insert([
          {
            // package_id: body.package_id,
            booking_id: booking.id,
            user_id: body.user_id,
            event_id: body.event_id,
          },
        ])
      if (usageError) {
        return NextResponse.json(
          { error: 'Failed to record package usage' },
          { status: 400 },
        )
      }
      const { data: pkgCurrent, error: pkgCurrentError } = await supabase
        .from('packages')
        .select('remaining_sessions')
        // .eq('id', body.package_id)
        .eq('user_id', body.user_id)
        .single()
      if (pkgCurrentError || !pkgCurrent) {
        return NextResponse.json(
          { error: 'Failed to fetch package sessions' },
          { status: 400 },
        )
      }
      const newSessions = Math.max(0, (pkgCurrent.remaining_sessions || 1) - 1)
      const { error: updatePkgError } = await supabase
        .from('packages')
        .update({ remaining_sessions: newSessions })
        // .eq('id', body.package_id)
        .eq('user_id', body.user_id)
      if (updatePkgError) {
        return NextResponse.json(
          { error: 'Failed to update package sessions' },
          { status: 400 },
        )
      }
    }

    return NextResponse.json({ success: true, booking }, { status: 201 })
  } catch (error) {
    console.error('Error booking event:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}

// GET: Fetch all bookings
export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('bookings')
      .select(
        `
      *,
      event:events (
        id,
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
        email
      ),
      staff:staff (
        full_name
      )
    `,
      )
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    console.log(data)

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
