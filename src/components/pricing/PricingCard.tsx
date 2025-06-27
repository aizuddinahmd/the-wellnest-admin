'use client'
import { useModal } from '@/hooks/useModal'
import { Modal } from '../ui/modal'
import React, { useState, useEffect } from 'react'
import Label from '../form/Label'
import Input from '../form/input/InputField'
import Button from '../ui/button/Button'

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

// function isToday(dateStr: string) {
//   const d = new Date(dateStr)
//   const today = new Date()
//   return (
//     d.getFullYear() === today.getFullYear() &&
//     d.getMonth() === today.getMonth() &&
//     d.getDate() === today.getDate()
//   )
// }

export default function PricingCard() {
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

  const handleSave = () => {
    // Handle save logic here
    console.log('Saving changes...')
    closeModal()
  }

  useEffect(() => {
    if (!isOpen) return
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
  }, [isOpen])

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
        {/* <div className="text-xl font-bold">Pricing</div> */}
        <Button onClick={openModal}>Add New +</Button>
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
      <Modal isOpen={isOpen} onClose={closeModal} className="m-4 max-w-[700px]">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 lg:p-11 dark:bg-gray-900">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Add Package
            </h4>
            <p className="mb-6 text-sm text-gray-500 lg:mb-7 dark:text-gray-400">
              Add a new package to your pricing list.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div>
                <h5 className="mb-5 text-lg font-medium text-gray-800 lg:mb-6 dark:text-white/90">
                  Package Details
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Package Name</Label>
                    <Input type="text" defaultValue="Musharof" />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Category</Label>
                    <Input type="text" defaultValue="Chowdhury" />
                  </div>
                  <div className="col-span-2">
                    <Label>Description</Label>
                    <Input type="text" defaultValue="Team Manager" />
                  </div>
                </div>
                <div className="mt-7">
                  <h5 className="mb-5 text-lg font-medium text-gray-800 lg:mb-6 dark:text-white/90">
                    Personal Information
                  </h5>

                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                    <div className="col-span-2 lg:col-span-1">
                      <Label>First Name</Label>
                      <Input type="text" defaultValue="Musharof" />
                    </div>

                    <div className="col-span-2 lg:col-span-1">
                      <Label>Last Name</Label>
                      <Input type="text" defaultValue="Chowdhury" />
                    </div>

                    <div className="col-span-2 lg:col-span-1">
                      <Label>Email Address</Label>
                      <Input type="text" defaultValue="randomuser@pimjo.com" />
                    </div>

                    <div className="col-span-2 lg:col-span-1">
                      <Label>Phone</Label>
                      <Input type="text" defaultValue="+09 363 398 46" />
                    </div>

                    <div className="col-span-2">
                      <Label>Bio</Label>
                      <Input type="text" defaultValue="Team Manager" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3 px-2 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  )
}
