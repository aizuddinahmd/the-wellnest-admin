import React, { useState } from 'react'

interface Booking {
  id: string
  user: {
    full_name: string
    email: string
  }
}

interface Customer {
  id: string
  name: string
  phone: string
  email: string
  status: string
  registrationDate: string
}

export default function BookingsForm() {
  const [form, setForm] = useState<Booking>({
    id: '',
    user: {
      full_name: '',
      email: '',
    },
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  //   const [eventsToday, setEventsToday] = useState<Event[]>([])
  const [customers, setCustomers] = useState<any[]>([])

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
      const res = await fetch('/api/customers', {
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
        // closeModal()
      } else {
        setMessage('Registration successful!')
        // closeModal()
        setForm({ name: '', phone: '', email: '', eventId: '', search: '' })
      }
    } catch (err) {
      console.error('Error:', err)
      setMessage('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {' '}
      <div className="custom-scrollbar flex max-h-[80vh] flex-col overflow-y-auto px-2">
        <h3 className="mb-6 text-2xl font-bold">Register New Customer</h3>
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
            {/* <select
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
            </select> */}
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="rounded-md bg-[#355c4a] px-4 py-2 text-white hover:bg-[#355c4a]/80"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
