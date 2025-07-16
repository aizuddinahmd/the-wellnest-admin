export interface Booking {
  id: string
  event_id: string
  user: {
    full_name: string
    email: string
  }
  event: {
    title: string
    start_time: string
    service: {
      name: string
      service_pricing: {
        id: string
        price: number
      }[]
    }
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
  service_id: string
  service_name: string
  service_price: number
  start_time: string
  end_time: string
  color: string
  staff_id: string
  capacity: number
  waitlist: number
  repeat: boolean
  repeat_days: number[]
  created_at: string
  updated_at: string
  deleted_at: string
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
