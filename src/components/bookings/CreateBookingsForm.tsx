import React, { useState, useEffect, useRef } from 'react'
import { Modal } from '../ui/modal'
import { Dropdown } from '../ui/dropdown/Dropdown'
import { DropdownItem } from '../ui/dropdown/DropdownItem'
import { UserRoundPlus, PhoneCall, Mail } from 'lucide-react'
import CustomerRegistrationModal from './CustomerRegistrationModal'
import ComponentCard from '../common/ComponentCard'
import Label from '../form/Label'
import Input from '../form/input/InputField'
import Radio from '../form/input/Radio'
// import RadioGroupItem from '../form/input/RadioItem'

interface Customer {
  id: string
  full_name: string
  phone: string
  email: string
  status?: string
  registrationDate?: string
}

export default function CreateBookingsForm() {
  const [purpose, setPurpose] = useState<'Consultation' | 'OTC'>('Consultation')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  )
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [registerName, setRegisterName] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPhone, setRegisterPhone] = useState('')
  const [registering, setRegistering] = useState(false)
  const [registerError, setRegisterError] = useState<string | null>(null)
  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState<string>('option2')

  // Fetch customers (simulate API call)
  useEffect(() => {
    const fetchCustomers = async () => {
      const res = await fetch('/api/users')
      const data = await res.json()
      setCustomers(data)
    }

    fetchCustomers()
  }, [])

  const handleRadioChange = (value: string) => {
    setSelectedValue(value)
  }

  // Filtered customers for dropdown
  const filteredCustomers = customers.filter(
    (c) =>
      (c.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
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
    setIsOpen(!isOpen)
  }

  function closeDropdown() {
    setIsOpen(false)
  }

  // Register new customer
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegistering(true)
    setRegisterError(null)
    setRegisterSuccess(null)
    try {
      const res = await fetch('/api/register-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          phone: registerPhone,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setRegisterError(data.error || 'Registration failed')
      } else {
        setRegisterSuccess('Registration successful!')
        setCustomers((prev) => [...prev, data.user])
        setSelectedCustomer(data.user)
        setShowRegisterModal(false)
        setRegisterName('')
        setRegisterEmail('')
        setRegisterPhone('')
      }
    } catch {
      setRegisterError('Registration failed')
    } finally {
      setRegistering(false)
    }
  }

  return (
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
                        isOpen ? 'rotate-180' : ''
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
                    isOpen={isOpen}
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
                      <div className="px-3 py-2 text-gray-400">
                        No results found
                      </div>
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
                <span className="text-xs font-medium text-gray-400">OR</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>
              {/* Add new customer button */}
              <button
                type="button"
                className="bg-brand-500 hover:bg-brand-500/80 flex w-full items-center justify-center gap-2 rounded-lg border py-2 text-base font-medium text-white"
                onClick={() => setShowRegisterModal(true)}
              >
                <UserRoundPlus className="h-5 w-5" /> Add new customer
              </button>
            </div>
            {/* Register new customer modal */}
            {showRegisterModal && (
              <Modal
                isOpen={showRegisterModal}
                onClose={() => setShowRegisterModal(false)}
                className="max-w-[1000px] p-6 lg:p-10"
              >
                <div className="custom-scrollbar flex max-h-[80vh] flex-col overflow-y-auto px-2">
                  <CustomerRegistrationModal />
                </div>
              </Modal>
            )}
          </ComponentCard>
        </div>
      </div>
    </div>
  )
}
