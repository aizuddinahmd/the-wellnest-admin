import React, { useEffect, useState } from 'react'

interface Event {
  id: string
  title: string
  start_time: string
  end_time: string
  instructor?: string
  status?: string
  capacity?: number
}

function formatTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function isToday(dateStr: string) {
  const d = new Date(dateStr)
  const today = new Date()
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  )
}

export default function EventsToday() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/events')
        const data = await res.json()
        if (Array.isArray(data)) {
          // Filter events for today
          setEvents(data.filter((e) => isToday(e.start_time)))
        } else {
          setEvents([])
        }
      } catch (err) {
        setEvents([])
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  return (
    <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow">
      <div className="mb-4 text-xl font-bold">Events Scheduled for Today</div>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-4 text-gray-500">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="p-4 text-gray-500">
            No events scheduled for today.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-500">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-500">
                  Start Time
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-500">
                  End Time
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-500">
                  Instructor
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-500">
                  Capacity
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {events.map((e) => (
                <tr key={e.id}>
                  <td className="px-4 py-4 font-medium text-gray-900">
                    {e.title}
                  </td>
                  <td className="px-4 py-4 text-gray-700">
                    {formatTime(e.start_time)}
                  </td>
                  <td className="px-4 py-4 text-gray-700">
                    {formatTime(e.end_time)}
                  </td>
                  <td className="px-4 py-4 text-gray-700">
                    {e.instructor || '-'}
                  </td>
                  <td className="px-4 py-4 text-gray-700">
                    {e.capacity ?? '-'}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-block rounded px-3 py-1 text-xs font-semibold ${e.status === 'Completed' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}
                    >
                      {e.status || 'Scheduled'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
