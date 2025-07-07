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
