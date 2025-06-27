'use client'
import React, { useState, useEffect } from 'react'
import { useModal } from '@/hooks/useModal'
import { Modal } from '../ui/modal'
import { useRouter } from 'next/navigation'
import CreateServicesForm from './CreateServicesForm'

// const Categories = [
// 	{ name: 'Massage', items: 1 },
// 	{ name: 'Mat Pilates', items: 3 },
// 	{ name: 'Yoga', items: 2 },
// 	{ name: 'Reformer Pilates', items: 2 },
// ]

interface Service {
  id: string
  name: string
  base_price: number
  category: string
}

export const ServicesCard = () => {
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isOpen, openModal, closeModal } = useModal()

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/services')
        const data = await res.json()
        if (Array.isArray(data)) {
          setServices(data)
        } else {
          setError('Failed to fetch courses')
        }
      } catch {
        setError('Failed to fetch courses')
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  // const handleClassCreate = (e: React.FormEvent) => {
  // 	e.preventDefault()
  // 	// TODO: Replace with actual create logic
  // 	console.log('Create class:', newClassName, 'for', modalCategory)
  // 	handleCloseModal()
  // }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 sm:px-6 sm:pt-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Services
        </h3>
        <button
          onClick={openModal}
          className="rounded-md bg-[#355c4a] px-4 py-2 text-white hover:bg-[#355c4a]/80"
        >
          Add Service
        </button>
      </div>
      {/* Courses Table */}
      <div className="mt-8">
        <h4 className="mb-4 text-base font-semibold text-gray-700 dark:text-white/80">
          Available Services
        </h4>
        {loading ? (
          <div className="py-8 text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">
                    Price
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">
                    Category
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {services.map((service) => (
                  <tr key={service.id}>
                    <td className="px-4 py-2 text-gray-800 dark:text-white/90">
                      {service.name}
                    </td>
                    <td className="px-4 py-2 text-gray-700 dark:text-white/80">
                      RM {service.base_price}
                    </td>
                    <td className="px-4 py-2 text-gray-700 dark:text-white/80">
                      {service.category}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {services.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                No services found.
              </div>
            )}
          </div>
        )}
      </div>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-full p-6 lg:p-10"
      >
        <div className="custom-scrollbar flex max-h-[80vh] flex-col overflow-y-auto px-2">
          <CreateServicesForm />
        </div>
      </Modal>
    </div>
  )
}
