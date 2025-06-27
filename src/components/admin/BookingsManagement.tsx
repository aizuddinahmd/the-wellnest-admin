import React, { useState, useEffect } from 'react'
import { useModal } from '@/hooks/useModal'
import { Modal } from '../ui/modal'

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
  // const [showModal, setShowModal] = useState(false)
  const { isOpen, openModal, closeModal } = useModal()
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    eventId: '',
    search: '',
  })
  const [eventsToday, setEventsToday] = useState<Event[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [customers, setCustomers] = useState<any[]>([])

  // useEffect(() => {
  //   if (!showModal) return
  //   const fetchEvents = async () => {
  //     try {
  //       const res = await fetch('/api/events')
  //       const data = await res.json()
  //       if (Array.isArray(data)) {
  //         setEventsToday(data.filter((e: Event) => isToday(e.start_time)))
  //       } else {
  //         setEventsToday([])
  //       }
  //     } catch {
  //       setEventsToday([])
  //     }
  //   }
  //   fetchEvents()
  // }, [showModal])

  useEffect(() => {
    // Fetch customers when component mounts
    const fetchCustomers = async () => {
      const res = await fetch('/api/customers')
      const data = await res.json()
      setCustomers(data)
    }
    fetchCustomers()
  }, [])

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
        closeModal()
      } else {
        setMessage('Registration successful!')
        closeModal()
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
    <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-xl font-bold">Customer Management</div>
        <button
          onClick={openModal}
          className="rounded-md bg-[#355c4a] px-4 py-2 text-white hover:bg-[#355c4a]/80"
        >
          Add Customer
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
            {customers.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-4 font-medium text-gray-900">
                  {c.full_name}
                </td>
                <td className="px-4 py-4 text-gray-700">{c.phone}</td>
                <td className="px-4 py-4 text-gray-700">{c.email}</td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-block rounded px-3 py-1 text-xs font-semibold ${c.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}
                  >
                    {c.status || 'Active'}
                  </span>
                </td>
                <td className="px-4 py-4 text-gray-700">
                  {c.created_at
                    ? new Date(c.created_at).toLocaleDateString()
                    : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Search Customer Modal*/}

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[700px] p-6 lg:p-10"
      >
        <div className="custom-scrollbar flex max-h-[80vh] flex-col overflow-y-auto px-2">
          <h3 className="mb-6 text-2xl font-bold">Register Customer</h3>
          <div>
            <label className="mb-2 block font-semibold">
              Search existing customer
            </label>
            <input
              type="text"
              className="mb-2 w-full rounded-lg border px-4 py-2"
              placeholder="Enter customer name, email or phone number"
              value={form.search || ''}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, search: e.target.value }))
              }}
            />

            <div className="my-4 flex items-center">
              <hr className="flex-grow border-t" />
              <span className="mx-2 text-gray-400">OR</span>
              <hr className="flex-grow border-t" />
            </div>
            <button
              className="flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2 font-semibold hover:bg-gray-50"
              onClick={() => {
                closeModal()
                setShowRegistrationModal(true)
              }}
            >
              <span>➕</span> Add new customer
            </button>
          </div>

          {/* <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="relative w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
              <h3 className="mb-6 text-lg font-bold">Register Customer</h3>
              <div>
                <label className="mb-2 block font-semibold">
                  Search existing customer
                </label>
                <input
                  type="text"
                  className="mb-2 w-full rounded-lg border px-4 py-2"
                  placeholder="Enter customer name, email or phone number"
                  value={form.search || ''}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, search: e.target.value }))
                  }}
                />

                <div className="my-4 flex items-center">
                  <hr className="flex-grow border-t" />
                  <span className="mx-2 text-gray-400">OR</span>
                  <hr className="flex-grow border-t" />
                </div>
                <button
                  className="flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2 font-semibold hover:bg-gray-50"
                  onClick={() => {
                    closeModal()
                    setShowRegistrationModal(true)
                  }}
                >
                  <span>➕</span> Add new customer
                </button>
              </div>
            </div>
          </div> */}
        </div>
      </Modal>

      {/* Registration Modal */}
      {showRegistrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="relative w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowRegistrationModal(false)}
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
