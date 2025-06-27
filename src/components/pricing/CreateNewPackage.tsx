import React, { useEffect, useState } from 'react'
import { Modal } from '../ui/modal'
import { createClient } from '@/utils/supabase/client'
import Button from '../ui/button/Button'

interface Service {
  service_id: string
  name: string
  checked: boolean
  sessions: number
}

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const initialForm = {
  label: '',
  pricing_type: 'package',
  price: '',
  sessions_included: '',
  duration_days: '',
}

export default function CreateNewPackage({
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const [form, setForm] = useState(initialForm)
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Fetch services
  useEffect(() => {
    if (!isOpen) return
    setLoading(true)
    const supabase = createClient()
    supabase
      .from('services')
      .select('id, name')
      .then(({ data }) => {
        if (data) {
          setServices(
            data.map((s: any) => ({
              service_id: s.id,
              name: s.name,
              checked: false,
              sessions: 1,
            })),
          )
        }
        setLoading(false)
      })
    setForm(initialForm)
    setError(null)
    setSuccess(null)
  }, [isOpen])

  // Form handlers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleServiceCheck = (idx: number) => {
    setServices((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, checked: !s.checked } : s)),
    )
  }

  const handleServiceSessions = (idx: number, value: string) => {
    setServices((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, sessions: Number(value) } : s)),
    )
  }

  // Manual validation
  const validate = () => {
    if (!form.label.trim()) return 'Package name required'
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0)
      return 'Price must be >= 0'
    if (
      !form.sessions_included ||
      isNaN(Number(form.sessions_included)) ||
      Number(form.sessions_included) < 1
    )
      return 'Total sessions required'
    if (
      form.pricing_type === 'membership' &&
      (!form.duration_days ||
        isNaN(Number(form.duration_days)) ||
        Number(form.duration_days) < 1)
    )
      return 'Duration (days) required for membership'
    if (!services.some((s) => s.checked)) return 'Select at least one service'
    for (const s of services) {
      if (
        s.checked &&
        (!s.sessions || isNaN(Number(s.sessions)) || s.sessions < 1)
      )
        return 'Enter valid session count for each selected service'
    }
    return null
  }

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    const err = validate()
    if (err) {
      setError(err)
      return
    }
    setLoading(true)
    try {
      const selectedServices = services.filter((s) => s.checked)
      const res = await fetch('/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: form.label,
          pricing_type: form.pricing_type,
          price: Number(form.price),
          sessions_included: Number(form.sessions_included),
          duration_days:
            form.pricing_type === 'membership'
              ? Number(form.duration_days)
              : null,
          services: selectedServices.map((s) => ({
            service_id: s.service_id,
            sessions: s.sessions,
          })),
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        setError(err.error || 'Failed to create package')
      } else {
        setSuccess('Package created!')
        setForm(initialForm)
        setServices((prev) =>
          prev.map((s) => ({ ...s, checked: false, sessions: 1 })),
        )
        onClose()
        onSuccess()
      }
    } catch (e) {
      setError('Failed to create package')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg p-6">
      <h2 className="mb-4 text-xl font-bold">
        Create New Package / Membership
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block font-medium">Package Name</label>
          <input
            name="label"
            value={form.label}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="mb-1 block font-medium">Type</label>
            <select
              name="pricing_type"
              value={form.pricing_type}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2"
            >
              <option value="package">Package</option>
              <option value="membership">Membership</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="mb-1 block font-medium">Price (RM)</label>
            <input
              type="number"
              name="price"
              min={0}
              value={form.price}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="mb-1 block font-medium">Total Sessions</label>
            <input
              type="number"
              name="sessions_included"
              min={1}
              value={form.sessions_included}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2"
            />
          </div>
          {form.pricing_type === 'membership' && (
            <div className="flex-1">
              <label className="mb-1 block font-medium">Duration (days)</label>
              <input
                type="number"
                name="duration_days"
                min={1}
                value={form.duration_days}
                onChange={handleChange}
                className="w-full rounded border px-3 py-2"
              />
            </div>
          )}
        </div>
        <div>
          <label className="mb-2 block font-medium">Assign Services</label>
          {loading ? (
            <div className="py-4 text-gray-500">Loading services...</div>
          ) : (
            <div className="space-y-2">
              {services.map((s, idx) => (
                <div key={s.service_id} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={s.checked}
                    onChange={() => handleServiceCheck(idx)}
                    id={`service-${s.service_id}`}
                  />
                  <label htmlFor={`service-${s.service_id}`} className="flex-1">
                    {s.name}
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={s.sessions}
                    onChange={(e) => handleServiceSessions(idx, e.target.value)}
                    className="w-24 rounded border px-2 py-1"
                    disabled={!s.checked}
                  />
                  <span className="text-xs text-gray-400">sessions</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        {success && <div className="text-sm text-green-600">{success}</div>}
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Create Package'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
