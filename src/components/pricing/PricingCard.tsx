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
import CreateNewPackage from './CreateNewPackage'
import { TabButton } from '../ui/tabs/TabButton'
import { TabContent } from '../ui/tabs/TabContent'
import { toast } from 'sonner'
import SpinnerTwo from '../ui/spinners/SpinnerTwo'
// import CreateServicesForm from '../services/CreateServicesForm'

interface Package {
  id: string
  label: string
  description: string
  price: number
  sessions_included: number
  // services: Service[]
  duration_days: number
  status: string
}

export default function PricingCard() {
  // const router = useRouter()
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isOpen, openModal, closeModal } = useModal()
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [modalType, setModalType] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('package')

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/packages')
        const data = await res.json()
        if (Array.isArray(data)) {
          setPackages(data)
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
  const handleEdit = (pkg: Package) => {
    setSelectedPackage(pkg)
    setModalType('edit')
    setOpenDropdownId(null)
  }
  const handleDeactivate = (pkg: Package) => {
    setSelectedPackage(pkg)
    setModalType('deactivate')
    setOpenDropdownId(null)
  }
  const handleDelete = (pkg: Package) => {
    setSelectedPackage(pkg)
    setModalType('delete')
    setOpenDropdownId(null)
  }

  // Refresh services list
  const refreshServices = async () => {
    try {
      const res = await fetch('/api/services')
      const data = await res.json()
      if (Array.isArray(data)) {
        setPackages(data)
      }
    } catch {}
  }

  // Handle edit form submit
  const handleEditSubmit = async (updatedPackage: Partial<Package>) => {
    if (!selectedPackage) return
    try {
      const res = await fetch('/api/services', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedPackage.id,
          action: 'edit',
          ...updatedPackage,
        }),
      })
      if (!res.ok) throw new Error('Failed to update service')
      toast.success('Package updated successfully')
      setModalType(null)
      setSelectedPackage(null)
      refreshServices()
    } catch (err) {
      toast.error('Error updating package', {
        description: err instanceof Error ? err.message : 'Unknown error',
      })
    }
  }

  // Handle deactivate
  const handleDeactivateConfirm = async () => {
    if (!selectedPackage) return
    try {
      const res = await fetch('/api/services', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedPackage.id,
          action: 'deactivate',
        }),
      })
      if (!res.ok) throw new Error('Failed to deactivate package')
      toast.success('Package deactivated successfully')
      setModalType(null)
      setSelectedPackage(null)
      refreshServices()
    } catch (err) {
      toast.error('Error deactivating package', {
        description: err instanceof Error ? err.message : 'Unknown error',
      })
    }
  }

  // Handle delete
  const handleDeleteConfirm = async () => {
    if (!selectedPackage) return
    try {
      const res = await fetch('/api/services', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedPackage.id }),
      })
      if (!res.ok) throw new Error('Failed to delete package')
      toast.success('Package deleted successfully')
      setModalType(null)
      setSelectedPackage(null)
      refreshServices()
    } catch (err) {
      toast.error('Error deleting package', {
        description: err instanceof Error ? err.message : 'Unknown error',
      })
    }
  }

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Card Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex flex-col">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              Packages & Memberships
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your packages and memberships
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
              Add Service
            </Button>
          </div>
        </div>
        {/* Tabs Section */}
        <div className="rounded-xl border border-gray-200 p-6 dark:border-gray-800">
          <div className="border-b border-gray-200 dark:border-gray-800">
            <nav className="-mb-px flex space-x-2 overflow-x-auto [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 dark:[&::-webkit-scrollbar-track]:bg-transparent">
              <TabButton
                key={'package'}
                id={'package'}
                label={'Package'}
                isActive={activeTab === 'package'}
                onClick={() => setActiveTab('package')}
              />
              <TabButton
                key={'membership'}
                id={'membership'}
                label={'Membership'}
                isActive={activeTab === 'membership'}
                onClick={() => setActiveTab('membership')}
              />
            </nav>
          </div>

          <div className="pt-4 dark:border-gray-800">
            <TabContent
              key={'package'}
              id={'package'}
              title={'Package'}
              isActive={activeTab === 'package'}
            >
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                    >
                      Package Name
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                    >
                      Sessions
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                    >
                      Duration (Days)
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                    >
                      Included Services
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                    >
                      Price
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
                  {packages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell className="x-5 py-4 text-start sm:px-6">
                        <span className="text-theme-sm block font-medium text-gray-800 dark:text-white/90">
                          {pkg.label}
                        </span>
                        <span className="text-theme-xs block text-gray-500 dark:text-gray-400">
                          {pkg.description}
                        </span>
                      </TableCell>
                      <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                        {pkg.sessions_included}
                      </TableCell>
                      <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                        {pkg.duration_days ? `${pkg.duration_days} days` : '-'}
                      </TableCell>
                      <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                        {pkg.duration_days} days
                      </TableCell>
                      <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                        {pkg.price}
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
                              openDropdownId === pkg.id ? null : pkg.id,
                            )
                          }
                        >
                          <Ellipsis className="h-4 w-4 cursor-pointer" />
                        </button>
                        <Dropdown
                          isOpen={openDropdownId === pkg.id}
                          onClose={() => setOpenDropdownId(null)}
                          className="top-6 right-0 min-w-[160px]"
                        >
                          <DropdownItem onClick={() => handleEdit(pkg)}>
                            Edit
                          </DropdownItem>
                          <DropdownItem onClick={() => handleDeactivate(pkg)}>
                            Deactivate
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => handleDelete(pkg)}
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
              {packages.length === 0 && !loading && (
                <div className="py-8 text-center text-gray-500">
                  No packages found.
                </div>
              )}
            </TabContent>
            <TabContent
              key={'membership'}
              id={'membership'}
              title={'Membership'}
              isActive={activeTab === 'membership'}
            >
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                    >
                      Membership Name
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                    >
                      Sessions
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                    >
                      Duration (Days)
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                    >
                      Included Services
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                    >
                      Price
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
                  {packages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell className="x-5 py-4 text-start sm:px-6">
                        <span className="text-theme-sm block font-medium text-gray-800 dark:text-white/90">
                          {pkg.label}
                        </span>
                        <span className="text-theme-xs block text-gray-500 dark:text-gray-400">
                          {pkg.description}
                        </span>
                      </TableCell>
                      <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                        {pkg.sessions_included}
                      </TableCell>
                      <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                        {pkg.duration_days ? `${pkg.duration_days} days` : '-'}
                      </TableCell>
                      <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                        {pkg.duration_days} days
                      </TableCell>
                      <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                        {pkg.price}
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
                              openDropdownId === pkg.id ? null : pkg.id,
                            )
                          }
                        >
                          <Ellipsis className="h-4 w-4 cursor-pointer" />
                        </button>
                        <Dropdown
                          isOpen={openDropdownId === pkg.id}
                          onClose={() => setOpenDropdownId(null)}
                          className="top-6 right-0 min-w-[160px]"
                        >
                          <DropdownItem onClick={() => handleEdit(pkg)}>
                            Edit
                          </DropdownItem>
                          <DropdownItem onClick={() => handleDeactivate(pkg)}>
                            Deactivate
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => handleDelete(pkg)}
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
                <div className="py-8 text-center text-gray-500">Loading...</div>
              )}
              {packages.length === 0 && !loading && (
                <div className="py-8 text-center text-gray-500">
                  No packages found.
                </div>
              )}
            </TabContent>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[1400px] p-6 lg:p-10"
      >
        <div className="custom-scrollbar flex max-h-[80vh] flex-col overflow-y-auto px-2">
          <CreateNewPackage
            isOpen={isOpen}
            onClose={closeModal}
            onSuccess={() => {}}
          />
        </div>
      </Modal>
      <Modal
        isOpen={modalType !== null}
        onClose={() => setModalType(null)}
        className={
          modalType === 'edit' ? 'max-w-[1400px] p-6 lg:p-10' : 'max-w-lg p-6'
        }
      >
        {modalType === 'edit' && selectedPackage && (
          <div className="custom-scrollbar flex max-h-[80vh] flex-col overflow-y-auto px-2">
            <h2 className="mb-4 text-lg font-bold">Edit Service</h2>
            {/* <CreateNewPackage
              package={selectedPackage}
              onSubmit={handleEditSubmit}
              // onClose={() => setModalType(null)}
            /> */}
          </div>
        )}

        {modalType === 'deactivate' && selectedPackage && (
          <div>
            <h2 className="mb-4 text-lg font-bold">Deactivate Service</h2>
            <p>
              Are you sure you want to deactivate <b>{selectedPackage.label}</b>
              ?
            </p>
            <div className="mt-6 flex gap-2">
              <Button size="sm" onClick={handleDeactivateConfirm}>
                Yes, Deactivate
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setModalType(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
        {modalType === 'delete' && selectedPackage && (
          <div>
            <h2 className="mb-4 text-lg font-bold text-red-600">
              Delete Service
            </h2>
            <p>
              Are you sure you want to <b>delete</b>{' '}
              <b>{selectedPackage.label}</b>? This action cannot be undone.
            </p>
            <div className="mt-6 flex gap-2">
              <Button size="sm" onClick={handleDeleteConfirm}>
                Yes, Delete
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setModalType(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
