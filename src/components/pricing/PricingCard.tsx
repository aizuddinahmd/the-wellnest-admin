'use client'
import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

interface Service {
  id: string
  name: string
  description?: string
}

interface SelectedService {
  id: string
  name: string
  checked: boolean
  sessions: string
}

const initialForm = {
  label: '',
  pricing_type: 'package',
  price: '',
  sessions_included: '',
  duration_days: '',
}

export default function PricingCard() {
  const [form, setForm] = useState(initialForm)
  const [services, setServices] = useState<SelectedService[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  // Fetch services on mount
  useEffect(() => {
    setLoading(true)
    const supabase = createClient()
    supabase
      .from('services')
      .select('id, name')
      .then(({ data, error }) => {
        if (error) {
          setToast({ type: 'error', message: 'Failed to fetch services' })
        } else if (data) {
          setServices(
            data.map((s: Service) => ({
              id: s.id,
              name: s.name,
              checked: false,
              sessions: '',
            })),
          )
        }
        setLoading(false)
      })
  }, [])

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(t)
    }
  }, [toast])

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
      prev.map((s, i) => (i === idx ? { ...s, sessions: value } : s)),
    )
  }

  // Validation
  const validate = () => {
    if (!form.label.trim()) return 'Package name is required'
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0)
      return 'Valid price required'
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
        (!s.sessions || isNaN(Number(s.sessions)) || Number(s.sessions) < 1)
      )
        return 'Enter valid session count for each selected service'
    }
    return null
  }

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errorMsg = validate()
    if (errorMsg) {
      setToast({ type: 'error', message: errorMsg })
      return
    }
    setSubmitting(true)
    const supabase = createClient()
    // 1. Insert into service_pricing
    const { data: pricingData, error: pricingError } = await supabase
      .from('service_pricing')
      .insert([
        {
          label: form.label,
          pricing_type: form.pricing_type,
          price: Number(form.price),
          sessions_included: Number(form.sessions_included),
          duration_days:
            form.pricing_type === 'membership'
              ? Number(form.duration_days)
              : null,
          service_id: null,
        },
      ])
      .select()
      .single()
    if (pricingError || !pricingData) {
      setToast({
        type: 'error',
        message: pricingError?.message || 'Failed to create package',
      })
      setSubmitting(false)
      return
    }
    // 2. Insert into package_services
    const selected = services.filter((s) => s.checked)
    const packageServices = selected.map((s) => ({
      pricing_id: pricingData.id,
      service_id: s.id,
      sessions: Number(s.sessions),
    }))
    const { error: psError } = await supabase
      .from('package_services')
      .insert(packageServices)
    if (psError) {
      setToast({ type: 'error', message: psError.message })
      setSubmitting(false)
      return
    }
    setToast({ type: 'success', message: 'Package created successfully!' })
    setForm(initialForm)
    setServices((prev) =>
      prev.map((s) => ({ ...s, checked: false, sessions: '' })),
    )
    setSubmitting(false)
  }

  return (
    <div className="mx-auto mt-6 max-w-2xl rounded-xl bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-bold">
        Create New Package / Membership
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1 block font-medium">Package Name</label>
          <input
            type="text"
            name="label"
            value={form.label}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
            maxLength={100}
            required
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
              value={form.price}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2"
              min={0}
              required
            />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="mb-1 block font-medium">Total Sessions</label>
            <input
              type="number"
              name="sessions_included"
              value={form.sessions_included}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2"
              min={1}
              required
            />
          </div>
          {form.pricing_type === 'membership' && (
            <div className="flex-1">
              <label className="mb-1 block font-medium">Duration (days)</label>
              <input
                type="number"
                name="duration_days"
                value={form.duration_days}
                onChange={handleChange}
                className="w-full rounded border px-3 py-2"
                min={1}
                required
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
                <div key={s.id} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={s.checked}
                    onChange={() => handleServiceCheck(idx)}
                    id={`service-${s.id}`}
                  />
                  <label htmlFor={`service-${s.id}`} className="flex-1">
                    {s.name}
                  </label>
                  <input
                    type="number"
                    min={1}
                    placeholder="Sessions"
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
        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded bg-[#355c4a] px-6 py-2 font-semibold text-white hover:bg-[#355c4a]/90 disabled:opacity-60"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Create Package'}
          </button>
        </div>
      </form>
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 rounded px-4 py-2 text-white shadow ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
        >
          {toast.message}
        </div>
      )}
    </div>
  )
}
