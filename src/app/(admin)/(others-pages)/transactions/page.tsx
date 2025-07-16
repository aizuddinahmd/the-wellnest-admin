import { createClient } from '@/utils/supabase/server'
import ComponentCard from '@/components/common/ComponentCard'
import { formatDateTime } from '@/utils/dateTime'
import Badge from '@/components/ui/badge/Badge'

export default async function TransactionsPage() {
  const supabase = await createClient()

  // Fetch transactions with related data
  const { data: transactions, error } = await supabase
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
      payments (*),
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
    console.error('Error fetching transactions:', error)
    return <div>Error loading transactions</div>
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Transactions
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View all payment transactions and details
        </p>
      </div>

      <ComponentCard title="Transaction History">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              {transactions?.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    {transaction.id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {transaction.user?.full_name || 'Walk-in Customer'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {transaction.user?.email || 'No email'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {transaction.booking?.event?.title || 'Service'}
                    </div>
                    {transaction.transaction_items?.map(
                      (
                        item: {
                          service?: { name: string }
                          quantity: number
                        },
                        index: number,
                      ) => (
                        <div
                          key={index}
                          className="text-sm text-gray-500 dark:text-gray-400"
                        >
                          {item.service?.name} (Qty: {item.quantity})
                        </div>
                      ),
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-white">
                    RM {transaction.total_amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-white">
                    {transaction.payments?.[0]?.payment_method?.toUpperCase() ||
                      'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      size="sm"
                      color={
                        transaction.status === 'paid' ? 'success' : 'warning'
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                    {formatDateTime(transaction.created_at, 'short')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!transactions ||
            (transactions.length === 0 && (
              <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                No transactions found
              </div>
            ))}
        </div>
      </ComponentCard>
    </div>
  )
}
