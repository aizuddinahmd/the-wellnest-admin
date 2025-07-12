import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    // Support both single object and array of objects
    const events = Array.isArray(body) ? body : [body]

    // Map to ensure all required fields are present
    const eventsToInsert = events.map((event) => ({
      title: event.title,
      service_id: event.service_id || null,
      start_time: event.start_time,
      end_time: event.end_time,
      capacity: event.capacity,
      waitlist: event.waitlist,
      color: event.color,
      repeat: event.repeat,
      repeat_days: event.repeat_days,
      staff_id: event.staff_id || null,
      // add any other required fields here
    }))

    const { data, error } = await supabase
      .from('events')
      .insert(eventsToInsert)
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error }, { status: 400 })
    }

    console.log('Event(s) created:', data)
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('start_time', { ascending: true })

    // console.log('Fetched events:', data)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
