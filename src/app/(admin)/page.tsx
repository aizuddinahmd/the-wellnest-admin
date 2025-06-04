"use client"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

interface Booking {
  id: string
  patient: string
  age: string
  queue: string
  arriveAt: string
  visitNotes: string
  doctor: string
  doctorAvatar?: string
  payment: string
  duration: string
  status: string
  statusColor: string
  phone?: string
  email?: string
}

const mockBookings: Booking[] = [
  {
    id: '1',
    patient: 'MUFID AISAR BIN MUHAMMAD AMIR AISAR',
    age: '2 year 4 month 18 day old',
    queue: '1002',
    arriveAt: '4 Jun 2025\n10:40 AM',
    visitNotes: 'Nak follow up mata dan ada demam sikit',
    doctor: 'Dr Faziera D...',
    payment: 'AIA',
    duration: '<1 min',
    status: 'Waiting',
    statusColor: 'bg-red-100 text-red-600',
  },
  {
    id: '2',
    patient: 'NAYLA BINTI MUHAMMAD IZZAT',
    age: '7 year 3 month 16 day old',
    queue: '1001',
    arriveAt: '4 Jun 2025\n8:42 AM',
    visitNotes: 'Demam panas',
    doctor: 'Dr Faziera D...',
    payment: 'Self-pay',
    duration: '38 mins',
    status: 'Completed',
    statusColor: 'bg-blue-100 text-blue-600',
  },
  {
    id: '3',
    patient: 'MUFID AISAR BIN MUHAMMAD AMIR AISAR',
    age: '7 year 3 month 16 day old',
    queue: '1001',
    arriveAt: '4 Jun 2025\n8:42 AM',
    visitNotes: 'Demam panas',
    doctor: 'Dr Faziera D...',
    payment: 'Self-pay',
    duration: '38 mins',
    status: 'Completed',
    statusColor: 'bg-blue-100 text-blue-600',
  },
  // ... add more mock bookings as needed
]

const TABS = [
  { label: 'All', value: 'all' },
  { label: 'Schedule for today', value: 'today' },
  { label: 'Completed', value: 'completed' },
]

const mockServices = [
  { value: 'pilates', label: 'Pilates' },
  { value: 'physio', label: 'Physio' },
  { value: 'rehab', label: 'Rehab' },
  { value: 'strength', label: 'Strength' },
]

export default function HomePage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [activeTab, setActiveTab] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    service: mockServices[0].value,
  })

  useEffect(() => {
    // Replace with real API call if available
    setBookings(mockBookings)
  }, [])

  // Filtering logic for tabs
  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'all') return true
    if (activeTab === 'completed') return b.status.toLowerCase() === 'completed'
    if (activeTab === 'today') {
      // For demo, just filter by arriveAt containing '4 Jun 2025'
      return b.arriveAt.includes('4 Jun 2025')
    }
    return true
  })

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowModal(false)
    // TODO: handle registration logic
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="text-2xl font-bold">Bookings for Today</div>
        <button
          className="rounded bg-black px-6 py-2 text-white font-semibold hover:bg-gray-800"
          onClick={() => setShowModal(true)}
        >
          Register
        </button>
      </div>
      {/* Tabs */}
      <div className="mb-4 flex gap-8 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            className={`pb-2 text-base font-semibold transition-colors ${
              activeTab === tab.value
                ? 'text-black border-b-2 border-black'
                : 'text-gray-500'
            }`}
            style={{ borderBottomWidth: activeTab === tab.value ? 2 : 0 }}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-500">User</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-500">Phone</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-500">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-500">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-500">Booking Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredBookings.map((b, idx) => (
              <tr key={b.id}>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={`https://randomuser.me/api/portraits/${idx % 2 === 0 ? 'men' : 'women'}/${40 + idx}.jpg`}
                      alt={b.patient}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{b.patient}</div>
                      <div className="text-xs text-gray-500">{b.age}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-gray-700">{b.phone || '012-3456789'}</td>
                <td className="px-4 py-4 text-gray-700">{b.email || 'user@example.com'}</td>
                <td className="px-4 py-4">
                  <span className={`inline-block rounded px-3 py-1 text-xs font-semibold ${b.statusColor}`}>{b.status}</span>
                </td>
                <td className="px-4 py-4 text-gray-700">{b.arriveAt.split('\n')[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowModal(false)}
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
            <h3 className="text-lg font-bold mb-6">Register New Booking</h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
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
                <label className="block text-sm font-medium mb-1">Phone Number</label>
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
                <label className="block text-sm font-medium mb-1">Email</label>
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
                <label className="block text-sm font-medium mb-1">Service Booking</label>
                <select
                  name="service"
                  value={form.service}
                  onChange={handleFormChange}
                  className="w-full rounded border px-3 py-2"
                  required
                >
                  {mockServices.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="rounded bg-black px-6 py-2 text-white font-semibold hover:bg-gray-800"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 