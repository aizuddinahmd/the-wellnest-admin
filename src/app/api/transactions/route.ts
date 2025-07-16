import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    console.log('Transaction request body:', body)

    // Start a transaction to ensure data consistency
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert([
        {
          user_id: body.user_id || null, // Nullable for walk-ins
          booking_id: body.booking_id,
          total_amount: body.total_amount,
          payment_method: body.payment_method,
          status: 'paid', // Set to paid immediately since payment is being processed
          notes: body.reference_id ? `Reference: ${body.reference_id}` : null,
        },
      ])
      .select()
      .single()

    if (transactionError) {
      console.error('Error creating transaction:', transactionError)
      return NextResponse.json(
        { error: transactionError.message },
        { status: 400 },
      )
    }

    console.log('Transaction created:', transaction)

    // Create transaction items
    const transactionItems = body.items.map(
      (item: {
        service_id: string
        quantity?: number
        unit_price: number
        label?: string
      }) => ({
        transaction_id: transaction.id,
        service_id: item.service_id,
        quantity: item.quantity || 1,
        unit_price: item.unit_price,
        label:
          item.label ||
          `Service - ${item.quantity || 1} session${(item.quantity || 1) > 1 ? 's' : ''}`,
        // Note: subtotal is a generated column and will be calculated automatically
      }),
    )

    const { data: items, error: itemsError } = await supabase
      .from('transaction_items')
      .insert(transactionItems)
      .select()

    if (itemsError) {
      console.error('Error creating transaction items:', itemsError)
      // Rollback transaction
      await supabase.from('transactions').delete().eq('id', transaction.id)
      return NextResponse.json({ error: itemsError.message }, { status: 400 })
    }

    console.log('Transaction items created:', items)

    return NextResponse.json(
      {
        success: true,
        transaction,
        items,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Error processing transaction:', error)
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
      .from('transactions')
      .select(
        `
        *,
        transaction_items (
          *,
          service:services (
            name
          )
        ),
        user:users (
          full_name,
          email
        ),
        booking:bookings (
          id,
          event:events (
            title,
            start_time
          )
        )
      `,
      )
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
