import React from 'react'

interface Event {
  id: string
  title: string
  startTime: string
  endTime: string
  instructor: string
  status: string
}

// Mock data for today's events
const today = new Date().toISOString().split('T')[0]
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Pilates Mastery',
    startTime: `${today}T09:00`,
    endTime: `${today}T10:00`,
    instructor: 'Amalina',
    status: 'Scheduled',
  },
  {
    id: '2',
    title: 'Strength Training',
    startTime: `${today}T11:00`,
    endTime: `${today}T12:00`,
    instructor: 'John',
    status: 'Scheduled',
  },
  {
    id: '3',
    title: 'Rehab Session',
    startTime: `${today}T14:00`,
    endTime: `${today}T15:00`,
    instructor: 'Nurul',
    status: 'Completed',
  },
]

function formatTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function EventsToday() {
  return (
    <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow">
      <div className="mb-4 text-xl font-bold">Events Scheduled for Today</div>
      <div className="overflow-x-auto">
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
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mockEvents.map((e) => (
              <tr key={e.id}>
                <td className="px-4 py-4 font-medium text-gray-900">
                  {e.title}
                </td>
                <td className="px-4 py-4 text-gray-700">
                  {formatTime(e.startTime)}
                </td>
                <td className="px-4 py-4 text-gray-700">
                  {formatTime(e.endTime)}
                </td>
                <td className="px-4 py-4 text-gray-700">{e.instructor}</td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-block rounded px-3 py-1 text-xs font-semibold ${e.status === 'Completed' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}
                  >
                    {e.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
