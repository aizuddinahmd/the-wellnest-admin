'use client'
import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Badge from '@/components/ui/badge/Badge'
import { Dropdown } from '@/components/ui/dropdown/Dropdown'
import { DropdownItem } from '@/components/ui/dropdown/DropdownItem'
import { Ellipsis } from 'lucide-react'

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

interface TabButtonProps {
  id: string
  label: string
  isActive: boolean
  onClick: () => void
}

export const TabButton: React.FC<TabButtonProps> = ({
  label,
  isActive,
  onClick,
}) => {
  return (
    <button
      className={`inline-flex items-center border-b-2 px-2.5 py-2 text-sm font-medium transition-colors duration-200 ease-in-out ${
        isActive
          ? 'text-brand-500 dark:text-brand-400 border-brand-500 dark:border-brand-400'
          : 'border-transparent bg-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

interface TabContentProps {
  id: string
  title: string
  isActive: boolean
}

const TabContent: React.FC<TabContentProps> = ({ title, isActive }) => {
  if (!isActive) return null

  return (
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
              <div className="py-8 text-center text-gray-500">Loading...</div>
            )}
            {packages.length === 0 && !loading && (
              <div className="py-8 text-center text-gray-500">
                No packages found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const tabs = [
  { id: 'package', label: 'Package' },
  { id: 'membership', label: 'Membership' },
]

const PricingCard2: React.FC = () => {
  const [activeTab, setActiveTab] = useState('package')
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  z
  return (
    <div className="rounded-xl border border-gray-200 p-6 dark:border-gray-800">
      <div className="border-b border-gray-200 dark:border-gray-800">
        <nav className="-mb-px flex space-x-2 overflow-x-auto [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 dark:[&::-webkit-scrollbar-track]:bg-transparent">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              id={tab.id}
              label={tab.label}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </nav>
      </div>

      <div className="pt-4 dark:border-gray-800">
        {tabs.map((tab) => (
          <TabContent
            key={tab.id}
            id={tab.id}
            title={tab.label}
            isActive={activeTab === tab.id}
          />
        ))}
      </div>
    </div>
  )
}

export default PricingCard2
