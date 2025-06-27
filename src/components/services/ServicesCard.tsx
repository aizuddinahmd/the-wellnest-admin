'use client'
import React, { useState, useEffect } from 'react'
// import { useToast } from '@/hooks/use-toast'
// import { useRouter } from 'next/navigation'
// import Button from '../ui/button/Button'
// import ComponentCard from '../common/ComponentCard'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table'
import { Modal } from '../ui/modal'
import { useModal } from '@/hooks/useModal'
import Button from '../ui/button/Button'
import { Ellipsis, FilterIcon, PlusIcon } from 'lucide-react'
import CreateServicesForm from './CreateServicesForm'
import Badge from '../ui/badge/Badge'
import { Dropdown } from '../ui/dropdown/Dropdown'
import { DropdownItem } from '../ui/dropdown/DropdownItem'

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
  status: string
}

export const ServicesCard = () => {
  // const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isOpen, openModal, closeModal } = useModal()
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

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

  // Dropdown action handlers
  const handleEdit = (service: Service) => {
    // TODO: Open edit modal with service data
    alert(`Edit service: ${service.name}`)
    setOpenDropdownId(null)
  }
  const handleDeactivate = (service: Service) => {
    // TODO: Implement deactivate logic
    alert(`Deactivate service: ${service.name}`)
    setOpenDropdownId(null)
  }
  const handleDelete = (service: Service) => {
    // TODO: Implement delete logic
    alert(`Delete service: ${service.name}`)
    setOpenDropdownId(null)
  }

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Card Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex flex-col">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              Services
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your services
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              startIcon={<FilterIcon className="h-4 w-4" />}
              onClick={() => openModal()}
            >
              Filter
            </Button>
            <Button
              endIcon={<PlusIcon className="h-4 w-4" />}
              onClick={() => openModal()}
            >
              Add Service
            </Button>
          </div>
        </div>
        <div className="border-t border-gray-100 p-4 sm:p-6 dark:border-gray-800">
          <div className="space-y-6"></div>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
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
                        <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                          <Badge color="success">Active</Badge>
                        </TableCell>
                        <TableCell className="text-theme-sm relative px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                          <button
                            type="button"
                            className="dropdown-toggle"
                            aria-label="Open actions"
                            onClick={() =>
                              setOpenDropdownId(
                                openDropdownId === service.id
                                  ? null
                                  : service.id,
                              )
                            }
                          >
                            <Ellipsis className="h-4 w-4 cursor-pointer" />
                          </button>
                          <Dropdown
                            isOpen={openDropdownId === service.id}
                            onClose={() => setOpenDropdownId(null)}
                            className="top-6 right-0 min-w-[160px]"
                          >
                            <DropdownItem onClick={() => handleEdit(service)}>
                              Edit
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => handleDeactivate(service)}
                            >
                              Deactivate
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => handleDelete(service)}
                              className="text-red-600"
                            >
                              Delete
                            </DropdownItem>
                          </Dropdown>
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
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[1400px] p-6 lg:p-10"
      >
        <div className="custom-scrollbar flex max-h-[80vh] flex-col overflow-y-auto px-2">
          <CreateServicesForm />
        </div>
      </Modal>
    </>
  )
}
