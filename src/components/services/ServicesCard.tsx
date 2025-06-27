'use client'
import React, { useState, useEffect } from 'react'
// import FullScreenModal from '../example/ModalExample/FullScreenModal';
// import FormInModal from '../example/ModalExample/FormInModal';
import { useRouter } from 'next/navigation'
import Button from '../ui/button/Button'
import ComponentCard from '../common/ComponentCard'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table'

// const Categories = [
// 	{ name: 'Massage', items: 1 },
// 	{ name: 'Mat Pilates', items: 3 },
// 	{ name: 'Yoga', items: 2 },
// 	{ name: 'Reformer Pilates', items: 2 },
// ]

interface Service {
  id: string
  name: string
  description: string
  base_price: number
  category: string
  duration_minutes: number
}

export const ServicesCard = () => {
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
    <ComponentCard
      title="Services"
      desc="Manage your services"
      addButton
      ButtonText="Add Service +"
      ButtonLink="/services/create-services"
    >
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        {/* <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Services
          </h3>
          <Button onClick={() => router.push('/services/create-services')}>
            Add Service +
          </Button>
        </div> */}
        {/* Courses Table */}
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Services
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Category
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Base Price
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Duration
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Status
                  </TableCell>
                </TableRow>
              </TableHeader>
              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="x-5 py-4 text-start sm:px-6">
                      <span className="text-theme-sm block font-medium text-gray-800 dark:text-white/90">
                        {service.name}
                      </span>
                      <span className="text-theme-xs block text-gray-500 dark:text-gray-400">
                        {service.description}
                      </span>
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                      {service.category}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                      RM {service.base_price}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                      {service.duration_minutes} minutes
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {services.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                No services found.
              </div>
            )}
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}
