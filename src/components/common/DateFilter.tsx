import React, { useState } from 'react'
import DatePicker from '../form/date-picker'
import { DateOption } from 'flatpickr/dist/types/options'

// Flatpickr DateOption type
// Date | string | number | Array<Date | string | number> | undefined
// https://flatpickr.js.org/options/

const PRESETS = [
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Last 7 days', value: 'last7' },
  { label: 'Last 30 days', value: 'last30' },
  { label: 'Last 90 days', value: 'last90' },
  { label: 'This week', value: 'thisWeek' },
  { label: 'This month', value: 'thisMonth' },
  { label: 'This year', value: 'thisYear' },
  { label: 'Last week', value: 'lastWeek' },
  { label: 'Last month', value: 'lastMonth' },
  { label: 'Custom', value: 'custom' },
]

interface DateFilterProps {
  onDateChange?: (range: {
    preset: string
    start?: string
    end?: string
  }) => void
}

const getToday = () => {
  const d = new Date()
  return d.toISOString().slice(0, 10)
}

const DateFilter: React.FC<DateFilterProps> = ({ onDateChange }) => {
  const [selectedPreset, setSelectedPreset] = useState('yesterday')
  const [customRange, setCustomRange] = useState<{
    start: string
    end: string
  }>({
    start: getToday(),
    end: getToday(),
  })

  const handlePresetChange = (value: string) => {
    setSelectedPreset(value)
    if (value !== 'custom' && onDateChange) {
      onDateChange({ preset: value })
    }
  }

  const handleCustomDateChange = (dates: Date[]) => {
    if (dates && dates.length > 0) {
      const start = dates[0]?.toISOString().slice(0, 10)
      const end = dates[1]?.toISOString().slice(0, 10) || start
      setCustomRange({ start, end })
      if (onDateChange) {
        onDateChange({ preset: 'custom', start, end })
      }
    }
  }

  return (
    <div className="flex w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-md dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Sidebar presets */}
      <div className="w-60 border-r border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-4 text-lg font-semibold">Date Filter</div>
        <ul className="space-y-2">
          {PRESETS.map((preset) => (
            <li key={preset.value}>
              <label className="flex cursor-pointer items-center gap-3 text-gray-800 dark:text-white/90">
                <input
                  type="radio"
                  name="date-preset"
                  value={preset.value}
                  checked={selectedPreset === preset.value}
                  onChange={() => handlePresetChange(preset.value)}
                  className="h-4 w-4 accent-black"
                />
                <span>{preset.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
      {/* Main calendar area */}
      <div className="flex-1 p-6">
        <div className="mb-4 text-sm text-gray-500">
          {selectedPreset === 'custom'
            ? `${customRange.start} - ${customRange.end}`
            : PRESETS.find((p) => p.value === selectedPreset)?.label}
        </div>

        <DatePicker
          id="date-filter-picker"
          mode="single"
          defaultDate={
            customRange.start && customRange.end
              ? ([
                  new Date(customRange.start),
                  new Date(customRange.end),
                ] as unknown as DateOption)
              : undefined
          }
          onChange={handleCustomDateChange}
          label="Select date range"
        />
      </div>
    </div>
  )
}

export default DateFilter
