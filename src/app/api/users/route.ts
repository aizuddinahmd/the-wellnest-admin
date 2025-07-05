import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

// POST: Create a new user
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          name: body.name,
          email: body.email,
          phone: body.phone,
        },
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}

// GET: Fetch all users
export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('full_name', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
