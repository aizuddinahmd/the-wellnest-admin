'use client'
import React, { useState } from 'react'
import { formatDateTime, TimeFormat } from '@/utils/dateTime'
import Button from '../ui/button/Button'

interface TimeFormatSelectorProps {
  dateTime: string
  onFormatChange?: (format: TimeFormat) => void
  className?: string
}

export const TimeFormatSelector = ({
  dateTime,
  onFormatChange,
  className = '',
}: TimeFormatSelectorProps) => {
  const [selectedFormat, setSelectedFormat] = useState<TimeFormat>('full')

  const formats: { key: TimeFormat; label: string; description: string }[] = [
    { key: 'full', label: 'Full', description: 'Complete date and time' },
    { key: 'short', label: 'Short', description: 'Compact format' },
    { key: 'time-only', label: 'Time Only', description: 'Just the time' },
    { key: 'date-only', label: 'Date Only', description: 'Just the date' },
    { key: 'relative', label: 'Relative', description: 'Time ago format' },
  ]

  const handleFormatChange = (format: TimeFormat) => {
    setSelectedFormat(format)
    onFormatChange?.(format)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {formatDateTime(dateTime, selectedFormat)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {formats.find((f) => f.key === selectedFormat)?.description}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {formats.map((format) => (
          <Button
            key={format.key}
            size="sm"
            variant={selectedFormat === format.key ? 'primary' : 'outline'}
            onClick={() => handleFormatChange(format.key)}
            className="text-xs"
          >
            {format.label}
          </Button>
        ))}
      </div>

      <div className="space-y-2 text-sm">
        <div className="font-medium text-gray-700 dark:text-gray-300">
          All Format Examples:
        </div>
        {formats.map((format) => (
          <div
            key={format.key}
            className="flex justify-between rounded px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <span className="text-gray-600 dark:text-gray-400">
              {format.label}:
            </span>
            <span className="font-mono text-gray-800 dark:text-white/90">
              {formatDateTime(dateTime, format.key)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
