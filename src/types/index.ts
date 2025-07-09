export interface Booking {
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

export interface Event {
  id: string
  title: string
  start_time: string
  end_time: string
  color: string
  instructor: string
  class_pax: number
  waitlist: number
  repeat: string
  repeat_days: number[]
}

export interface User {
  id: string
  full_name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  country: string
  postcode: string
  gender: string
  race: string
  religion: string
  dob: string
  nationality: string
  nric: string
  created_at: string
  updated_at: string
}
