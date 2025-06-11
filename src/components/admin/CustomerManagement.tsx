import React from 'react'

interface Customer {
  id: string
  name: string
  phone: string
  email: string
  status: string
  registrationDate: string
}

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Aisyah Binti Ahmad',
    phone: '012-3456789',
    email: 'aisyah@example.com',
    status: 'Active',
    registrationDate: '2024-06-01',
  },
  {
    id: '2',
    name: 'John Doe',
    phone: '013-9876543',
    email: 'john@example.com',
    status: 'Inactive',
    registrationDate: '2024-05-15',
  },
  {
    id: '3',
    name: 'Nurul Huda',
    phone: '014-1234567',
    email: 'nurul@example.com',
    status: 'Active',
    registrationDate: '2024-04-20',
  },
]

export default function CustomerManagement() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow">
      <div className="mb-4 text-xl font-bold">Customer Management</div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-500">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-500">
                Phone
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-500">
                Email
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-500">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-500">
                Registration Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mockCustomers.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-4 font-medium text-gray-900">
                  {c.name}
                </td>
                <td className="px-4 py-4 text-gray-700">{c.phone}</td>
                <td className="px-4 py-4 text-gray-700">{c.email}</td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-block rounded px-3 py-1 text-xs font-semibold ${c.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-gray-700">
                  {c.registrationDate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
