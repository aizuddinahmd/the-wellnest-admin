'use client'
import { useState } from 'react'
import { ChevronDownIcon } from '@/icons'
import ComponentCard from '../common/ComponentCard'
import Input from '../form/input/InputField'
import Label from '../form/Label'
import Select from '../form/Select'
import { useDropzone } from 'react-dropzone'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table'

export default function CreateServicesForm() {
  const options = [
    { value: 'Pilates', label: 'Pilates' },
    { value: 'Physio', label: 'Physio' },
    { value: 'Rehab', label: 'Rehab' },
    { value: 'Strength', label: 'Strength' },
  ]

  // Form state
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(options[0].value)
  const [duration, setDuration] = useState(0)
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [singlePrice, setSinglePrice] = useState('')

  // Separate price states for each type

  const [packageType, setPackageType] = useState({
    sessions: '',
    price: '',
    durationDays: '',
  })
  const [membership, setMembership] = useState({
    sessions: '',
    price: '',
    durationDays: '',
  })

  const handleSelectChange = (value: string) => {
    setCategory(value)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          category,
          duration_minutes: duration,
          image_url: imageUrl,
          base_price: singlePrice,
          package_price: packageType.price,
          membership_price: membership.price,
          package_sessions: packageType.sessions,
          membership_sessions: membership.sessions,
          package_duration_days: packageType.durationDays,
          membership_duration_days: membership.durationDays,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        setMessage(err.error || 'Failed to create service')
      } else {
        setMessage('Service created successfully!')
        setName('')
        setDescription('')
        setCategory(options[0].value)
        setDuration(0)
        setImageUrl('')
        setPackageType({ sessions: '', price: '', durationDays: '' })
        setMembership({ sessions: '', price: '', durationDays: '' })
      }
    } catch (err) {
      console.error('Error creating service:', err)
      setMessage('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="mb-6 text-2xl font-bold">Create New Service</h1>
      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <ComponentCard title="Service Details">
            <div className="space-y-6">
              <div>
                <Label>Name</Label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  type="text"
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <Label>Category</Label>
                <div className="relative">
                  <Select
                    options={options}
                    placeholder="Select an option"
                    onChange={handleSelectChange}
                    // value={category}
                    className="dark:bg-dark-900"
                  />
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                    <ChevronDownIcon />
                  </span>
                </div>
              </div>
              <div>
                <Label>Duration (minutes)</Label>
                <Input
                  type="number"
                  placeholder="Enter duration in minutes"
                  value={duration || ''}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  min="1"
                  // required
                />
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
                {/* Hidden Input */}
                <input {...getInputProps()} />

                <div className="dz-message m-0! flex flex-col items-center">
                  {/* Icon Container */}
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

                  {/* Text Content */}
                  <h4 className="text-theme-xl mb-3 font-semibold text-gray-800 dark:text-white/90">
                    {isDragActive
                      ? 'Drop Files Here'
                      : 'Drag & Drop Files Here'}
                  </h4>

                  <span className="mb-5 block w-full max-w-[290px] text-center text-sm text-gray-700 dark:text-gray-400">
                    Drag and drop your PNG, JPG, WebP, SVG images here or browse
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
        </div>
      </div>
      <div className="space-y-6">
        <ComponentCard title="Price">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[1102px]">
                <Table>
                  {/* Table Header */}
                  <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                      <TableCell
                        isHeader
                        className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                      >
                        Type
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
                        Price (RM)
                      </TableCell>
                      <TableCell
                        isHeader
                        className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                      >
                        Duration Days
                      </TableCell>
                    </TableRow>
                  </TableHeader>

                  {/* Table Body */}
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    <TableRow>
                      <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                        <div className="flex flex-col items-start gap-2">
                          <div className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
                            Single
                          </div>
                          <div className="text-theme-xs text-gray-500 dark:text-gray-400">
                            1 Session
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                        <input
                          type="number"
                          placeholder="Sessions"
                          value={1}
                          disabled
                          className="rounded-md border border-gray-200 p-2 dark:border-white/[0.05]"
                        />
                      </TableCell>
                      <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                        <input
                          type="number"
                          placeholder="Price"
                          value={singlePrice}
                          onChange={(e) => setSinglePrice(e.target.value)}
                          className="rounded-md border border-gray-200 p-2 dark:border-white/[0.05]"
                        />
                      </TableCell>
                      <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                        <input
                          type="number"
                          placeholder="-"
                          disabled
                          className="rounded-md border border-gray-200 p-2 dark:border-white/[0.05]"
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                        <div className="flex flex-col items-start gap-2">
                          <div className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
                            Packages
                          </div>
                          <div className="text-theme-xs text-gray-500 dark:text-gray-400">
                            10 Sessions Package
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                        <input
                          type="number"
                          placeholder="Sessions"
                          value={packageType.sessions}
                          onChange={(e) =>
                            setPackageType((prev) => ({
                              ...prev,
                              sessions: e.target.value,
                            }))
                          }
                          className="rounded-md border border-gray-200 p-2 dark:border-white/[0.05]"
                        />
                      </TableCell>
                      <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                        <input
                          type="number"
                          placeholder="Price"
                          value={packageType.price}
                          onChange={(e) =>
                            setPackageType((prev) => ({
                              ...prev,
                              price: e.target.value,
                            }))
                          }
                          className="rounded-md border border-gray-200 p-2 dark:border-white/[0.05]"
                        />
                      </TableCell>
                      <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                        <input
                          type="number"
                          placeholder="Duration Days"
                          value={packageType.durationDays}
                          onChange={(e) =>
                            setPackageType((prev) => ({
                              ...prev,
                              durationDays: e.target.value,
                            }))
                          }
                          className="rounded-md border border-gray-200 p-2 dark:border-white/[0.05]"
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                        <div className="flex flex-col items-start gap-2">
                          <div className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
                            Membership
                          </div>
                          <div className="text-theme-xs text-gray-500 dark:text-gray-400">
                            Monthly Membership
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                        <input
                          type="number"
                          placeholder="Sessions"
                          value={membership.sessions}
                          onChange={(e) =>
                            setMembership((prev) => ({
                              ...prev,
                              sessions: e.target.value,
                            }))
                          }
                          className="rounded-md border border-gray-200 p-2 dark:border-white/[0.05]"
                        />
                      </TableCell>
                      <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                        <input
                          type="number"
                          placeholder="Price"
                          value={membership.price}
                          onChange={(e) =>
                            setMembership((prev) => ({
                              ...prev,
                              price: e.target.value,
                            }))
                          }
                          className="rounded-md border border-gray-200 p-2 dark:border-white/[0.05]"
                        />
                      </TableCell>
                      <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                        <input
                          type="number"
                          placeholder="Duration Days"
                          value={membership.durationDays}
                          onChange={(e) =>
                            setMembership((prev) => ({
                              ...prev,
                              durationDays: e.target.value,
                            }))
                          }
                          className="rounded-md border border-gray-200 p-2 dark:border-white/[0.05]"
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </ComponentCard>
      </div>
      {message && (
        <div
          className={`mt-6 rounded p-3 text-sm ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
        >
          {message}
        </div>
      )}
      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          className="rounded bg-[#355c4a] px-6 py-2 font-semibold text-white hover:bg-[#355c4a]/80 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Create Service'}
        </button>
      </div>
    </form>
  )
}
