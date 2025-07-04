import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, eventId, usePackage, packageId } = body
    const supabase = await createClient()

    // 1. Check if event has available slots
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, capacity')
      .eq('id', eventId)
      .single()
    if (eventError || !event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }
    const { count: bookedCount, error: countError } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId)
    const booked = typeof bookedCount === 'number' ? bookedCount : 0
    if (countError) {
      return NextResponse.json(
        { error: 'Failed to check slots' },
        { status: 400 },
      )
    }
    if (booked >= event.capacity) {
      return NextResponse.json(
        { error: 'Event is fully booked' },
        { status: 400 },
      )
    }

    // 2. If using package, validate package
    if (usePackage) {
      if (!packageId) {
        return NextResponse.json(
          { error: 'Package ID required' },
          { status: 400 },
        )
      }
      const { data: pkg, error: pkgError } = await supabase
        .from('packages')
        .select('id, status, remaining_sessions')
        .eq('id', packageId)
        .eq('user_id', userId)
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
          user_id: userId,
          event_id: eventId,
          used_package: usePackage,
          package_id: usePackage ? packageId : null,
        },
      ])
      .select()
      .single()
    if (bookingError || !booking) {
      return NextResponse.json(
        { error: 'Failed to create booking' },
        { status: 400 },
      )
    }

    // 4. If using package, insert into package_usage and decrease remaining_sessions
    if (usePackage) {
      const { error: usageError } = await supabase
        .from('package_usage')
        .insert([
          {
            package_id: packageId,
            booking_id: booking.id,
            user_id: userId,
            event_id: eventId,
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
        .eq('id', packageId)
        .eq('user_id', userId)
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
        .eq('id', packageId)
        .eq('user_id', userId)
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
				user:users (full_name, email),
				event:events (title),
				staff:staff (full_name)
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
