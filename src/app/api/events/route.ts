import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
	try {
		const data = await req.json()
		// TODO: Save 'data' to your database here (e.g., using Prisma, Supabase, etc.)
		// Example: const savedEvent = await db.events.create({ data })

		return NextResponse.json({ success: true, event: data }, { status: 201 })
	} catch (error) {
		return NextResponse.json({ success: false, error: error?.message || 'Unknown error' }, { status: 500 })
	}
} 