/**
 * Utility functions for date and time formatting
 */

export type TimeFormat =
  | 'full'
  | 'time-only'
  | 'date-only'
  | 'relative'
  | 'short'

/**
 * Format a date/time string into different readable formats
 * @param dateTimeString - ISO date string or date object
 * @param format - The format type to return
 * @returns Formatted date/time string
 */
export function formatDateTime(
  dateTimeString: string | Date,
  format: TimeFormat = 'full',
): string {
  const date = new Date(dateTimeString)

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date'
  }

  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor(diffMs / (1000 * 60))

  switch (format) {
    case 'time-only':
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })

    case 'date-only':
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })

    case 'short':
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })

    case 'relative':
      if (diffMinutes < 1) {
        return 'Just now'
      } else if (diffMinutes < 60) {
        return `${diffMinutes}m ago`
      } else if (diffHours < 24) {
        return `${diffHours}h ago`
      } else if (diffDays === 1) {
        return 'Yesterday'
      } else if (diffDays < 7) {
        return `${diffDays}d ago`
      } else {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })
      }

    case 'full':
    default:
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
  }
}

/**
 * Get a readable time range string
 * @param startTime - Start time string
 * @param endTime - End time string (optional)
 * @returns Formatted time range
 */
export function formatTimeRange(startTime: string, endTime?: string): string {
  const start = formatDateTime(startTime, 'time-only')

  if (!endTime) {
    return start
  }

  const end = formatDateTime(endTime, 'time-only')
  return `${start} - ${end}`
}

/**
 * Check if a date is today
 * @param dateTimeString - Date string to check
 * @returns True if the date is today
 */
export function isToday(dateTimeString: string): boolean {
  const date = new Date(dateTimeString)
  const today = new Date()

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

/**
 * Check if a date is tomorrow
 * @param dateTimeString - Date string to check
 * @returns True if the date is tomorrow
 */
export function isTomorrow(dateTimeString: string): boolean {
  const date = new Date(dateTimeString)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  return (
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear()
  )
}

/**
 * Get a smart date label (Today, Tomorrow, or formatted date)
 * @param dateTimeString - Date string
 * @returns Smart date label
 */
export function getSmartDateLabel(dateTimeString: string): string {
  if (isToday(dateTimeString)) {
    return 'Today'
  } else if (isTomorrow(dateTimeString)) {
    return 'Tomorrow'
  } else {
    return formatDateTime(dateTimeString, 'date-only')
  }
}

/**
 * Format booking time with smart labels
 * @param startTime - Booking start time
 * @param endTime - Booking end time (optional)
 * @returns Formatted booking time string
 */
export function formatBookingTime(startTime: string, endTime?: string): string {
  const dateLabel = getSmartDateLabel(startTime)
  const timeRange = formatTimeRange(startTime, endTime)

  return `${dateLabel} at ${timeRange}`
}
