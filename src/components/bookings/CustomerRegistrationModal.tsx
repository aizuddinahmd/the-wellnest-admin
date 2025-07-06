import React, { useRef, useState } from 'react'
import ComponentCard from '../common/ComponentCard'
import Label from '../form/Label'
import Input from '../form/input/InputField'
// import Select from '../form/Select'
// import { ChevronDownIcon } from 'lucide-react'
import { ChevronDownIcon, EnvelopeIcon } from '../../icons'
import { useDropzone } from 'react-dropzone'
import PhoneInput from '../form/group-input/PhoneInput'
import DatePicker from '@/components/form/date-picker'
import Select from '../form/Select'

export default function CustomerRegistrationModal() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [nric, setNric] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [dob, setDob] = useState('')
  const [gender, setGender] = useState('')
  const [nationality, setNationality] = useState('')
  const [race, setRace] = useState('')
  const [religion, setReligion] = useState('')
  const [address, setAddress] = useState('')
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [postcode, setPostcode] = useState('')
  const [country, setCountry] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleRaceChange = (value: string) => {
    setRace(value)
  }
  const handleReligionChange = (value: string) => {
    setReligion(value)
  }
  const handleGenderChange = (value: string) => {
    setGender(value)
  }
  const handleNationalityChange = (value: string) => {
    setNationality(value)
  }

  const handleCountryChange = (value: string) => {
    setCountry(value)
  }

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
    onNext({
      image,
      name,
      nric,
      phone,
      email,
      dob,
      gender,
      nationality,
      race,
      religion,
      address,
      state,
      city,
      postcode,
      country,
    })
  }

  const countries = [{ code: 'MY', label: '+60' }]
  const handlePhoneNumberChange = (phoneNumber: string) => {
    setPhone(phoneNumber)
  }
  const handleEmailChange = (email: string) => {
    setEmail(email)
  }

  return (
    <form onSubmit={handleNext}>
      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <ComponentCard title="Personal Details">
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
                <Label>NRIC</Label>
                <Input
                  type="text"
                  placeholder="Enter NRIC"
                  value={nric}
                  onChange={(e) => setNric(e.target.value)}
                />
              </div>
              <div>
                <Label>Phone</Label>
                <PhoneInput
                  selectPosition="start"
                  countries={countries}
                  placeholder="+60 (555) 000-0000"
                  onChange={handlePhoneNumberChange}
                />
              </div>{' '}
              <div>
                <Label>Email</Label>
                <div className="relative">
                  <Input
                    placeholder="info@gmail.com"
                    type="text"
                    className="pl-[62px]"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
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
                  onChange={(dates, currentDateString) => {
                    setDob(currentDateString)
                  }}
                />
              </div>
              <div>
                <Label>Gender</Label>
                <div className="relative">
                  <Select
                    options={genderOptions}
                    placeholder="Select an option"
                    onChange={handleGenderChange}
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
                    onChange={handleNationalityChange}
                    className="dark:bg-dark-900"
                  />
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                    <ChevronDownIcon />
                  </span>
                </div>
              </div>
              <div>
                <Label>Race</Label>
                <div className="relative">
                  <Select
                    options={raceOptions}
                    placeholder="Select an option"
                    onChange={handleRaceChange}
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
                    onChange={handleReligionChange}
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
                <input {...getInputProps()} ref={fileInputRef} />

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
          <ComponentCard title="Address">
            <div className="space-y-6">
              <div>
                <Label>Street</Label>
                <Input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-row gap-6">
              <div>
                <Label>City</Label>
                <Input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div>
                <Label>State</Label>
                <Input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-row gap-6">
              <div>
                <Label>Postcode</Label>
                <Input
                  type="text"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                />
              </div>
              <div>
                <Label>Country</Label>
                <div className="relative">
                  <Select
                    options={nationalityOptions}
                    placeholder="Select an option"
                    onChange={handleCountryChange}
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
        <button
          type="submit"
          className="bg-brand-500 hover:bg-brand-500/80 flex w-full items-center justify-center gap-2 rounded-lg border py-2 text-base font-medium text-white"
        >
          Register
        </button>
      </div>
    </form>
  )
}
