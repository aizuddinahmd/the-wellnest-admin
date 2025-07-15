'use client'
import React, { useState, useEffect, useRef } from 'react'
// import { useToast } from '@/hooks/use-toast'
// import { useRouter } from 'next/navigation'
// import Button from '../ui/button/Button'
// import ComponentCard from '../common/ComponentCard'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table'
import { Modal } from '../ui/modal'
import { useModal } from '@/hooks/useModal'
import Button from '../ui/button/Button'
import {
  Ellipsis,
  FilterIcon,
  PlusIcon,
  PhoneCall,
  Mail,
  UserRoundPlus,
} from 'lucide-react'
// import CreateServicesForm from './CreateServicesForm'
import Badge from '../ui/badge/Badge'
import { Dropdown } from '../ui/dropdown/Dropdown'
import { DropdownItem } from '../ui/dropdown/DropdownItem'
import SpinnerTwo from '../ui/spinners/SpinnerTwo'
// import CreateBookingsForm from '../bookings/CreateBookingsForm'
import { Booking, User, Event } from '@/types'
import ComponentCard from '../common/ComponentCard'
import Label from '../form/Label'
import Input from '../form/input/InputField'
import PhoneInput from '../form/group-input/PhoneInput'
import DatePicker from '@/components/form/date-picker'
import Select from '../form/Select'
import { useDropzone } from 'react-dropzone'
import { ChevronDownIcon, EnvelopeIcon } from '../../icons'
import Image from 'next/image'
import Radio from '../form/input/Radio'
// import CustomerRegistrationModal from '../bookings/CustomerRegistrationModal'
import { toast } from 'sonner'

export const BookingsManagement = ({
  title,
  description,
  bookingsData,
  usersData,
  eventsData,
}: {
  title: string
  description: string
  bookingsData: Booking[]
  usersData?: User[]
  eventsData?: Event[]
}) => {
  // const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isOpen, openModal, closeModal } = useModal()
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    nric: '',
    phone: '',
    email: '',
    dob: '',
    gender: '',
    nationality: '',
    race: '',
    religion: '',
    address: '',
    state: '',
    city: '',
    postcode: '',
    country: '',
    eventId: '',
    bookingType: 'one-off', // or 'package', 'membership'
    // add other fields as needed
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<'form' | 'summary'>('form')
  // const [personalDetails, setPersonalDetails] = useState<User | null>(null)
  // const [purpose, setPurpose] = useState<'Consultation' | 'OTC'>('Consultation')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [customers, setCustomers] = useState<User[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  // const [registerName, setRegisterName] = useState('')
  // const [registerEmail, setRegisterEmail] = useState('')
  // const [registerPhone, setRegisterPhone] = useState('')
  const [registering, setRegistering] = useState(false)
  const [registerError, setRegisterError] = useState<string | null>(null)
  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [selectedValue, setSelectedValue] = useState<string>('Consultation')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(false)
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  useEffect(() => {
    setBookings(bookingsData)
    setCustomers(usersData ?? [])
    setEvents(eventsData ?? [])
    setLoading(false)
    setError(null)
  }, [bookingsData, usersData, eventsData])

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
  const handleEventChange = (event: Event) => {
    setSelectedEvent(event)
    setIsEventDropdownOpen(false)
  }

  const onDrop = (acceptedFiles: File[]) => {
    // For demo, just use the file name as image_url
    if (acceptedFiles.length > 0) {
      setImageUrl(acceptedFiles[0].name)
    }
  }
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': [],
      'image/jpeg': [],
      'image/webp': [],
      'image/svg+xml': [],
    },
  })
  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ]
  const nationalityOptions = [
    { value: 'malaysia', label: 'Malaysia' },
    { value: 'indonesia', label: 'Indonesia' },
    { value: 'singapore', label: 'Singapore' },
    { value: 'thailand', label: 'Thailand' },
    { value: 'philippines', label: 'Philippines' },
    { value: 'vietnam', label: 'Vietnam' },
    { value: 'myanmar', label: 'Myanmar' },
  ]

  const raceOptions = [
    { value: 'malaysian', label: 'Malaysian' },
    { value: 'chinese', label: 'Chinese' },
    { value: 'indian', label: 'Indian' },
  ]
  const religionOptions = [
    { value: 'islam', label: 'Islam' },
    { value: 'christian', label: 'Christian' },
    { value: 'hindu', label: 'Hindu' },
    { value: 'buddhism', label: 'Buddhism' },
    { value: 'other', label: 'Other' },
  ]

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    // Collect all details into an object
    const details = {
      imageUrl,
    }
    setForm({ ...form, ...details })
    setStep('summary')
  }

  const countries = [{ code: 'MY', label: '+60' }]

  const handleRadioChange = (value: string) => {
    setSelectedValue(value)
  }

  // Filtered customers for dropdown
  const filteredCustomers = customers.filter(
    (c) =>
      (c.full_name?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (c.email?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (c.phone?.toLowerCase() || '').includes(search.toLowerCase()),
  )

  // Open dropdown when input is focused
  const handleInputFocus = () => setDropdownOpen(true)
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function toggleDropdown() {
    setIsDropdownOpen(!isDropdownOpen)
  }

  function closeDropdown() {
    setIsDropdownOpen(false)
  }

  const handleBookingRegister = async (selectedEvent: Event) => {
    setRegistering(true)
    setRegisterError(null)
    setRegisterSuccess(null)
    try {
      // 1. Ensure user exists (by email or phone)
      let userId = selectedCustomer?.id
      if (!userId) {
        // If not selected from dropdown, create new user
        const userRes = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: form.name,
            nric: form.nric,
            phone: form.phone,
            email: form.email,
            dob: form.dob,
            gender: form.gender,
            nationality: form.nationality,
            race: form.race,
            religion: form.religion,
            address: form.address,
            state: form.state,
            city: form.city,
            postcode: form.postcode,
            country: form.country,
          }),
        })
        const userData = await userRes.json()
        if (!userRes.ok) {
          toast.error(userData.error || 'User registration failed')
          throw new Error(userData.error || 'User creation failed')
        }
        toast.success('User registered successfully!')
        userId = userData.id
      }

      // 2. Create booking and decrement event capacity atomically (backend should handle this)
      const bookingRes = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          event_id: selectedEvent.id,
          staff_id: selectedEvent.staff_id || null,
          status: 'pending',
          booking_time: new Date().toISOString(),
          attended: false,
          notes: '',
        }),
      })
      const bookingData = await bookingRes.json()
      if (!bookingRes.ok) {
        toast.error(bookingData.error || 'Booking failed')
        throw new Error(bookingData.error || 'Booking failed')
      }
      toast.success('Booking successful!')
      // Optionally, refresh bookings list here
      closeModal()
    } catch (error) {
      setRegisterError(
        error instanceof Error ? error.message : 'Booking failed',
      )
    } finally {
      setRegistering(false)
    }
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
            No bookings for today.
          </div>
        )}
      </div>
      {/*Search Users Modal */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[600px] p-6 lg:p-10"
      >
        <div>
          <div className="mb-6 w-full">
            <div className="space-y-6">
              <ComponentCard title="Booking Details">
                <div className="space-y-6">
                  {/* Step 1: Choose purpose */}
                  <div>
                    <Label>Choose visit purpose</Label>
                    <div className="flex gap-6">
                      <Radio
                        id="otc"
                        name="group1"
                        value="OTC"
                        checked={selectedValue === 'OTC'}
                        onChange={handleRadioChange}
                        label="OTC"
                      />
                      <Radio
                        id="consultation"
                        name="group1"
                        value="Consultation"
                        checked={selectedValue === 'Consultation'}
                        onChange={handleRadioChange}
                        label="Consultation"
                      />
                    </div>
                  </div>
                  {/* Step 2: Search existing customer */}
                  <div>
                    <Label>Search existing customer</Label>
                    <div className="relative inline-block w-full">
                      <button
                        onClick={toggleDropdown}
                        className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 px-3 py-2 text-base font-medium text-gray-700 dark:bg-gray-800"
                      >
                        Enter name, email or phone number
                        <svg
                          className={`stroke-current duration-200 ease-in-out ${
                            isDropdownOpen ? 'rotate-180' : ''
                          }`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4.79199 7.396L10.0003 12.6043L15.2087 7.396"
                            stroke=""
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>

                      <Dropdown
                        isOpen={isDropdownOpen}
                        onClose={closeDropdown}
                        className="absolute right-0 left-0 z-10 mt-1 max-h-60 overflow-y-auto rounded border bg-white shadow-lg"
                      >
                        <Input
                          type="text"
                          placeholder="Search by name, email or phone number"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="w-full rounded border px-3 py-2 text-base font-medium text-gray-500 dark:bg-gray-800"
                        />
                        <div className="border-b px-3 py-2 text-xs font-semibold text-gray-500">
                          Existing patient
                        </div>

                        {filteredCustomers.length === 0 ? (
                          loading ? (
                            <div className="px-3 py-2 text-gray-400">
                              <SpinnerTwo />
                            </div>
                          ) : (
                            <div className="px-3 py-2 text-gray-400">
                              No results found
                            </div>
                          )
                        ) : (
                          filteredCustomers.slice(0, 10).map((c) => (
                            <DropdownItem
                              key={c.id}
                              onClick={() => {
                                setSelectedCustomer(c)
                                setSearch(`${c.full_name} (${c.phone})`)
                                setDropdownOpen(false)
                              }}
                              className="flex cursor-pointer flex-col items-start px-3 py-2 hover:bg-gray-100"
                            >
                              <span className="font-medium">{c.full_name}</span>
                              <span className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <PhoneCall className="h-3 w-3" /> {c.phone}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" /> {c.email}
                                </span>
                              </span>
                            </DropdownItem>
                          ))
                        )}
                      </Dropdown>
                    </div>
                  </div>
                  {/* Divider with OR */}
                  <div className="my-2 flex items-center gap-2">
                    <div className="h-px flex-1 bg-gray-200" />
                    <span className="text-xs font-medium text-gray-400">
                      OR
                    </span>
                    <div className="h-px flex-1 bg-gray-200" />
                  </div>
                  {/* Add new customer button */}
                  <Button
                    className="w-full"
                    size="sm"
                    onClick={() => setShowRegisterModal(true)}
                  >
                    Add new customer <UserRoundPlus className="h-3 w-3" />
                  </Button>
                </div>
                {/* Register new customer modal */}
                {showRegisterModal && (
                  <Modal
                    isOpen={showRegisterModal}
                    onClose={() => setShowRegisterModal(false)}
                    className="max-w-[1000px] p-6 lg:p-10"
                  >
                    <div className="custom-scrollbar flex max-h-[80vh] flex-col overflow-y-auto px-2">
                      {/* Customer registration modal */}
                      <div>
                        {step === 'form' ? (
                          <form onSubmit={handleNext}>
                            <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
                              <div className="space-y-6">
                                <ComponentCard title="Personal Details">
                                  <div className="space-y-6">
                                    <div>
                                      <Label>Name</Label>
                                      <Input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) =>
                                          setForm({
                                            ...form,
                                            name: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                    <div>
                                      <Label>NRIC</Label>
                                      <Input
                                        type="text"
                                        placeholder="Enter NRIC"
                                        value={form.nric}
                                        onChange={(e) =>
                                          setForm({
                                            ...form,
                                            nric: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                    <div>
                                      <Label>Phone</Label>
                                      <PhoneInput
                                        selectPosition="start"
                                        countries={countries}
                                        placeholder="+60 (555) 000-0000"
                                        onChange={(phoneNumber) =>
                                          setForm({
                                            ...form,
                                            phone: phoneNumber,
                                          })
                                        }
                                      />
                                    </div>{' '}
                                    <div>
                                      <Label>Email</Label>
                                      <div className="relative">
                                        <Input
                                          placeholder="info@gmail.com"
                                          type="text"
                                          className="pl-[62px]"
                                          value={form.email}
                                          onChange={(e) =>
                                            setForm({
                                              ...form,
                                              email: e.target.value,
                                            })
                                          }
                                        />
                                        <span className="absolute top-1/2 left-0 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                                          <EnvelopeIcon />
                                        </span>
                                      </div>
                                    </div>
                                    <div>
                                      <Label>Date of Birth</Label>
                                      <DatePicker
                                        id="date-picker"
                                        placeholder="Select a date"
                                        onChange={(
                                          dates,
                                          currentDateString,
                                        ) => {
                                          setForm({
                                            ...form,
                                            dob: currentDateString,
                                          })
                                        }}
                                      />
                                    </div>
                                    <div className="flex flex-row gap-6">
                                      <div>
                                        <Label>Gender</Label>
                                        <div className="relative">
                                          <Select
                                            options={genderOptions}
                                            placeholder="Select an option"
                                            onChange={(value) =>
                                              setForm({
                                                ...form,
                                                gender: value,
                                              })
                                            }
                                            className="dark:bg-dark-900"
                                          />
                                          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                                            <ChevronDownIcon />
                                          </span>
                                        </div>
                                      </div>
                                      <div>
                                        <Label>Nationality</Label>
                                        <div className="relative">
                                          <Select
                                            options={nationalityOptions}
                                            placeholder="Select an option"
                                            onChange={(value) =>
                                              setForm({
                                                ...form,
                                                nationality: value,
                                              })
                                            }
                                            className="dark:bg-dark-900"
                                          />
                                          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                                            <ChevronDownIcon />
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex flex-row gap-6">
                                      <div>
                                        <Label>Race</Label>
                                        <div className="relative">
                                          <Select
                                            options={raceOptions}
                                            placeholder="Select an option"
                                            onChange={(value) =>
                                              setForm({ ...form, race: value })
                                            }
                                            className="dark:bg-dark-900"
                                          />
                                          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                                            <ChevronDownIcon />
                                          </span>
                                        </div>
                                      </div>
                                      <div>
                                        <Label>Religion</Label>
                                        <div className="relative">
                                          <Select
                                            options={religionOptions}
                                            placeholder="Select an option"
                                            onChange={(value) =>
                                              setForm({
                                                ...form,
                                                religion: value,
                                              })
                                            }
                                            className="dark:bg-dark-900"
                                          />
                                          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                                            <ChevronDownIcon />
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </ComponentCard>
                              </div>
                              <div className="space-y-6">
                                <ComponentCard title="Upload Images">
                                  <div className="dark:hover:border-brand-500 hover:border-brand-500 cursor-pointer rounded-xl border border-dashed border-gray-300 transition dark:border-gray-700">
                                    <div
                                      {...getRootProps()}
                                      className={`dropzone rounded-xl border-dashed border-gray-300 p-7 lg:p-10 ${
                                        isDragActive
                                          ? 'border-brand-500 bg-gray-100 dark:bg-gray-800'
                                          : 'border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900'
                                      } `}
                                      id="demo-upload"
                                    >
                                      <input
                                        {...getInputProps()}
                                        ref={fileInputRef}
                                      />

                                      <div className="dz-message m-0! flex flex-col items-center">
                                        <div className="mb-[22px] flex justify-center">
                                          <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                                            <svg
                                              className="fill-current"
                                              width="29"
                                              height="28"
                                              viewBox="0 0 29 28"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                                              />
                                            </svg>
                                          </div>
                                        </div>

                                        <h4 className="text-theme-xl mb-3 font-semibold text-gray-800 dark:text-white/90">
                                          {isDragActive
                                            ? 'Drop Files Here'
                                            : 'Drag & Drop Files Here'}
                                        </h4>

                                        <span className="mb-5 block w-full max-w-[290px] text-center text-sm text-gray-700 dark:text-gray-400">
                                          Drag and drop your PNG, JPG, WebP, SVG
                                          images here or browse
                                        </span>

                                        <span className="text-theme-sm text-brand-500 font-medium underline">
                                          Browse File
                                        </span>
                                        {imageUrl && (
                                          <div className="mt-2 text-xs text-gray-500">
                                            Selected: {imageUrl}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </ComponentCard>
                                <ComponentCard title="Address">
                                  <div className="space-y-6">
                                    <div>
                                      <Label>Street</Label>
                                      <Input
                                        type="text"
                                        value={form.address}
                                        onChange={(e) =>
                                          setForm({
                                            ...form,
                                            address: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="flex flex-row gap-6">
                                    <div>
                                      <Label>City</Label>
                                      <Input
                                        type="text"
                                        value={form.city}
                                        onChange={(e) =>
                                          setForm({
                                            ...form,
                                            city: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                    <div>
                                      <Label>State</Label>
                                      <Input
                                        type="text"
                                        value={form.state}
                                        onChange={(e) =>
                                          setForm({
                                            ...form,
                                            state: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="flex flex-row gap-6">
                                    <div>
                                      <Label>Postcode</Label>
                                      <Input
                                        type="text"
                                        value={form.postcode}
                                        onChange={(e) =>
                                          setForm({
                                            ...form,
                                            postcode: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                    <div>
                                      <Label>Country</Label>
                                      <div className="relative">
                                        <Select
                                          options={nationalityOptions}
                                          placeholder="Select an option"
                                          onChange={(value) =>
                                            setForm({ ...form, country: value })
                                          }
                                          className="dark:bg-dark-900"
                                        />
                                        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                                          <ChevronDownIcon />
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </ComponentCard>
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <Button
                                className="w-full cursor-pointer"
                                size="sm"
                                onClick={handleNext}
                              >
                                Next
                              </Button>
                            </div>
                          </form>
                        ) : (
                          <div>
                            <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
                              <div className="space-y-6">
                                <ComponentCard title="Personal Details">
                                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                                    <div className="flex w-full flex-col items-center gap-6 xl:flex-row">
                                      <div>
                                        <div className="h-20 w-20 overflow-hidden rounded-full border border-gray-200 dark:border-gray-800">
                                          <Image
                                            width={80}
                                            height={80}
                                            src="/images/user/owner.jpg"
                                            alt="user"
                                          />
                                        </div>
                                      </div>

                                      <div className="order-3 xl:order-2">
                                        <h4 className="mb-2 text-center text-lg font-semibold text-gray-800 xl:text-left dark:text-white/90">
                                          {form.name || 'John Doe'}
                                        </h4>
                                        <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                                          <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {form.nric || '309128490214'}
                                          </p>
                                        </div>
                                        <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                                          <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {form.gender || 'Male'}
                                          </p>
                                          <div className="hidden h-3.5 w-px bg-gray-300 xl:block dark:bg-gray-700"></div>
                                          <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {form.nationality || 'Malaysia'}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex w-full flex-col items-center gap-6 xl:flex-row">
                                    <div className="order-3 xl:order-2">
                                      <h4 className="mb-2 text-center text-lg font-semibold text-gray-800 xl:text-left dark:text-white/90">
                                        Address Details
                                      </h4>
                                      <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                          {form.address ||
                                            '123, Jalan 1, 12345 Kuala Lumpur'}
                                        </p>
                                      </div>
                                      <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                          {form.city || 'Kuala Lumpur'}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                          {form.state || 'Kuala Lumpur'}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </ComponentCard>
                              </div>
                              <div className="space-y-6">
                                <ComponentCard title="Booking Details">
                                  {/* <div className="space-y-6">
                                <div>
                                  <Label>Booking Date</Label>
                                  <DatePicker
                                    id="date-picker"
                                    placeholder="Select a date"
                                    onChange={(dates, currentDateString) => {
                                      setDob(currentDateString)
                                    }}
                                  />
                                </div>
                              </div> */}
                                  <div className="space-y-6">
                                    <div>
                                      <Label>Event</Label>
                                      <div className="relative inline-block w-full">
                                        <button
                                          onClick={() =>
                                            setIsEventDropdownOpen(
                                              (prev) => !prev,
                                            )
                                          }
                                          className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 px-3 py-2 text-base font-medium text-gray-700 dark:bg-gray-800"
                                        >
                                          {selectedEvent?.title ||
                                            'Select an event'}
                                          <svg
                                            className={`stroke-current duration-200 ease-in-out ${
                                              isEventDropdownOpen
                                                ? 'rotate-180'
                                                : ''
                                            }`}
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path
                                              d="M4.79199 7.396L10.0003 12.6043L15.2087 7.396"
                                              stroke=""
                                              strokeWidth="1.5"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                            />
                                          </svg>
                                        </button>

                                        <Dropdown
                                          isOpen={isEventDropdownOpen}
                                          onClose={() =>
                                            setIsEventDropdownOpen(false)
                                          }
                                          className="absolute right-0 left-0 z-10 mt-1 max-h-60 overflow-y-auto rounded border bg-white shadow-lg"
                                        >
                                          {loading ? (
                                            <div className="flex items-center justify-center py-4">
                                              <SpinnerTwo />
                                            </div>
                                          ) : events.length === 0 ? (
                                            <div className="px-4 py-2 text-center text-gray-500">
                                              No events today
                                            </div>
                                          ) : (
                                            events.map((e) => (
                                              <div
                                                key={e.id}
                                                onClick={() =>
                                                  handleEventChange(e)
                                                }
                                                className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${
                                                  selectedEvent?.id === e.id
                                                    ? 'bg-gray-100 font-semibold'
                                                    : ''
                                                }`}
                                              >
                                                <span className="font-medium">
                                                  {e.title}
                                                </span>
                                              </div>
                                            ))
                                          )}
                                        </Dropdown>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex flex-row gap-2">
                                    <Radio
                                      id="one-off"
                                      name="booking-type"
                                      value="one-off"
                                      checked={true}
                                      label="One-Off"
                                      onChange={() => {}}
                                    />
                                    <Radio
                                      id="package"
                                      name="booking-type"
                                      value="package"
                                      checked={false}
                                      label="Package"
                                      onChange={() => {}}
                                    />
                                    <Radio
                                      id="membership"
                                      name="booking-type"
                                      value="membership"
                                      checked={false}
                                      label="Membership"
                                      onChange={() => {}}
                                    />
                                  </div>
                                </ComponentCard>
                              </div>
                            </div>
                            <div className="flex w-full justify-end gap-2">
                              <Button
                                variant="outline"
                                className="cursor-pointer"
                                size="sm"
                                onClick={() => setStep('form')}
                              >
                                Back
                              </Button>
                              <Button
                                className="bg-brand-500 cursor-pointer text-white"
                                size="sm"
                                onClick={() =>
                                  selectedEvent &&
                                  handleBookingRegister(selectedEvent)
                                }
                                disabled={!selectedEvent}
                              >
                                Create Booking
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                      {/* <CustomerRegistrationModal /> */}
                    </div>
                  </Modal>
                )}
              </ComponentCard>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}
