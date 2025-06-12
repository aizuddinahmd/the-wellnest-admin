import React, { useState, useEffect } from 'react'

interface Customer {
  id: string
  name: string
  phone: string
  email: string
  status: string
  registrationDate: string
}

interface Event {
  id: string
  title: string
  start_time: string
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

function isToday(dateStr: string) {
  const d = new Date(dateStr)
  const today = new Date()
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  )
}

export default function CustomerManagement() {
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    eventId: '',
  })
  const [eventsToday, setEventsToday] = useState<Event[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!showModal) return
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events')
        const data = await res.json()
        if (Array.isArray(data)) {
          setEventsToday(data.filter((e: Event) => isToday(e.start_time)))
        } else {
          setEventsToday([])
        }
      } catch {
        setEventsToday([])
      }
    }
    fetchEvents()
  }, [showModal])

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch('/api/register-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          eventId: form.eventId,
        }),
      })
      const data = await res.json()
      // console.log('data', data)
      if (!res.ok) {
        setMessage(data.error || 'Registration failed')
        setShowModal(false)
      } else {
        setMessage('Registration successful!')
        setShowModal(false)
        setForm({ name: '', phone: '', email: '', eventId: '' })
      }
    } catch (err) {
      console.error('Error:', err)
      setMessage('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-xl font-bold">Customer Management</div>
        <button
          className="rounded bg-black px-6 py-2 font-semibold text-white hover:bg-gray-800"
          onClick={() => setShowModal(true)}
        >
          Register
        </button>
      </div>
      {message && (
        <div
          className={`mb-4 rounded p-3 text-sm ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
        >
          {message}
        </div>
      )}
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
      {/* Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="relative w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowModal(false)}
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path
                  d="M6 6l12 12M6 18L18 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <h3 className="mb-6 text-lg font-bold">Register New Customer</h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  className="w-full rounded border px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleFormChange}
                  className="w-full rounded border px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleFormChange}
                  className="w-full rounded border px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Event for Today
                </label>
                <select
                  name="eventId"
                  value={form.eventId}
                  onChange={handleFormChange}
                  className="w-full rounded border px-3 py-2"
                  required
                >
                  <option value="">Select an event</option>
                  {eventsToday.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="rounded bg-black px-6 py-2 font-semibold text-white hover:bg-gray-800"
                  disabled={loading}
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
