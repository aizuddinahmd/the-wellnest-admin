import React, { useRef, useState } from 'react'
import { Modal } from '../ui/modal'

interface CustomerRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  onNext: (data: any) => void
}

export default function CustomerRegistrationModal({
  isOpen,
  onClose,
  onNext,
}: CustomerRegistrationModalProps) {
  const [image, setImage] = useState<File | null>(null)
  const [name, setName] = useState('')
  const [nric, setNric] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [dob, setDob] = useState('')
  const [gender, setGender] = useState('')
  const [nationality, setNationality] = useState('')
  const [race, setRace] = useState('')
  const [religion, setReligion] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [postcode, setPostcode] = useState('')
  const [city, setCity] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      address1,
      address2,
      postcode,
      city,
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[900px] p-6 lg:p-10"
    >
      <h2 className="mb-6 text-center text-xl font-bold">
        Patient information
      </h2>
      <form onSubmit={handleNext}>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <div className="mb-2 flex h-20 w-20 items-center justify-center rounded bg-gray-100">
                  {image ? (
                    <img
                      src={URL.createObjectURL(image)}
                      alt="avatar"
                      className="h-full w-full rounded object-cover"
                    />
                  ) : (
                    <svg
                      width="48"
                      height="48"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="text-gray-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4a4 4 0 110 8 4 4 0 010-8zm0 12c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z"
                      />
                    </svg>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleImageClick}
                  className="rounded border px-4 py-1 text-sm font-medium"
                >
                  Add image
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded border px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                NRIC / Passport
              </label>
              <input
                type="text"
                value={nric}
                onChange={(e) => setNric(e.target.value)}
                className="w-full rounded border px-3 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Phone</label>
              <div className="flex gap-2">
                <span className="flex items-center rounded border bg-gray-50 px-2">
                  🇲🇾 +6
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded border px-3 py-2"
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded border px-3 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Date of birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full rounded border px-3 py-2"
              />
            </div>
          </div>
          {/* Right column */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded border px-3 py-2"
              >
                <option value="">Choose gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Nationality
              </label>
              <select
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="w-full rounded border px-3 py-2"
              >
                <option value="">Nationality</option>
                <option value="malaysian">Malaysian</option>
                <option value="foreigner">Foreigner</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Race</label>
              <select
                value={race}
                onChange={(e) => setRace(e.target.value)}
                className="w-full rounded border px-3 py-2"
              >
                <option value="">Race</option>
                <option value="malay">Malay</option>
                <option value="chinese">Chinese</option>
                <option value="indian">Indian</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Religion</label>
              <select
                value={religion}
                onChange={(e) => setReligion(e.target.value)}
                className="w-full rounded border px-3 py-2"
              >
                <option value="">Religion</option>
                <option value="islam">Islam</option>
                <option value="buddhism">Buddhism</option>
                <option value="hinduism">Hinduism</option>
                <option value="christianity">Christianity</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Address</label>
              <input
                type="text"
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
                className="mb-2 w-full rounded border px-3 py-2"
                placeholder="Address Line 1"
              />
              <input
                type="text"
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
                className="mb-2 w-full rounded border px-3 py-2"
                placeholder="Address Line 2"
              />
              <div className="mb-2 flex gap-2">
                <input
                  type="text"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  className="w-1/3 rounded border px-3 py-2"
                  placeholder="Postcode"
                />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-2/3 rounded border px-3 py-2"
                  placeholder="City"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 underline"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded bg-black px-8 py-2 font-medium text-white"
          >
            Next
          </button>
        </div>
      </form>
    </Modal>
  )
}
