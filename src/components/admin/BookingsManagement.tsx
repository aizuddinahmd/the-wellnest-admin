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
// import CreateServicesForm from './CreateServicesForm'
import Badge from '../ui/badge/Badge'
import { Dropdown } from '../ui/dropdown/Dropdown'
import { DropdownItem } from '../ui/dropdown/DropdownItem'
import SpinnerTwo from '../ui/spinners/SpinnerTwo'
import CreateBookingsForm from '../bookings/CreateBookingsForm'

interface Booking {
  id: string
  user: {
    full_name: string
    email: string
  }
  event: {
    title: string
    start_time: string
  }
  staff: {
    full_name: string
  }
  notes: string
  status: string
  created_at: string
  updated_at: string
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

export const BookingsManagement = ({
  title,
  description,
}: {
  title: string
  description: string
}) => {
  // const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isOpen, openModal, closeModal } = useModal()
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/bookings')
        const data = await res.json()
        if (Array.isArray(data)) {
          const filtered = data.filter(
            (b: Booking) =>
              b.event && b.event.start_time && isToday(b.event.start_time),
          )
          setBookings(filtered)
        } else {
          setError('Failed to fetch bookings')
        }
      } catch {
        setError('Failed to fetch bookings')
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  // const handleClassCreate = (e: React.FormEvent) => {
  // 	e.preventDefault()
  // 	// TODO: Replace with actual create logic
  // 	console.log('Create class:', newClassName, 'for', modalCategory)
  // 	handleCloseModal()
  // }

  // Dropdown action handlers
  const handleEdit = (booking: Booking) => {
    // TODO: Open edit modal with service data
    alert(`Edit service: ${booking.event.title}`)
    setOpenDropdownId(null)
  }
  const handleDeactivate = (booking: Booking) => {
    // TODO: Implement deactivate logic
    alert(`Deactivate booking: ${booking.event.title}`)
    setOpenDropdownId(null)
  }
  const handleDelete = (booking: Booking) => {
    // TODO: Implement delete logic
    alert(`Delete booking: ${booking.event.title}`)
    setOpenDropdownId(null)
  }

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Card Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex flex-col">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              {title}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              startIcon={<FilterIcon className="h-3 w-3" />}
              onClick={() => openModal()}
              size="sm"
            >
              Filter
            </Button>
            <Button
              endIcon={<PlusIcon className="h-3 w-3" />}
              onClick={() => openModal()}
              size="sm"
            >
              Add Booking
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                Customer Name
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                Time
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                Events
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                Instructor
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                Package
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
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="x-5 py-4 text-start sm:px-6">
                  <span className="text-theme-sm block font-medium text-gray-800 dark:text-white/90">
                    {booking.user.full_name}
                  </span>
                  <span className="text-theme-xs block text-gray-500 dark:text-gray-400">
                    {booking.user.email}
                  </span>
                </TableCell>
                <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                  {booking.event.start_time}
                </TableCell>
                <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                  {booking.event.title}
                </TableCell>
                <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                  {booking.notes}
                </TableCell>
                <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                  <Badge size="sm" color="success">
                    Active
                  </Badge>
                </TableCell>
                <TableCell className="text-theme-sm relative px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                  <button
                    type="button"
                    className="dropdown-toggle"
                    aria-label="Open actions"
                    onClick={() =>
                      setOpenDropdownId(
                        openDropdownId === booking.id ? null : booking.id,
                      )
                    }
                  >
                    <Ellipsis className="h-4 w-4 cursor-pointer" />
                  </button>
                  <Dropdown
                    isOpen={openDropdownId === booking.id}
                    onClose={() => setOpenDropdownId(null)}
                    className="top-6 right-0 min-w-[160px]"
                  >
                    <DropdownItem onClick={() => handleEdit(booking)}>
                      Edit
                    </DropdownItem>
                    <DropdownItem onClick={() => handleDeactivate(booking)}>
                      Deactivate
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => handleDelete(booking)}
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

        {loading && (
          <div className="flex justify-center py-8">
            <SpinnerTwo />
          </div>
        )}
        {bookings.length === 0 && !loading && (
          <div className="py-8 text-center text-gray-500">
            No bookings found.
          </div>
        )}
      </div>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[600px] p-6 lg:p-10"
      >
        <div className="custom-scrollbar flex max-h-[80vh] flex-col overflow-y-auto px-2">
          <CreateBookingsForm />
        </div>
      </Modal>
    </>
  )
}
