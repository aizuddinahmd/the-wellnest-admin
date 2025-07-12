'use client'
import React, { useState, useRef, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Search, CalendarIcon, Clock, ChevronDown } from 'lucide-react'
import {
  EventInput,
  DateSelectArg,
  EventClickArg,
  EventContentArg,
} from '@fullcalendar/core'
import { useModal } from '@/hooks/useModal'
import { Modal } from '@/components/ui/modal'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Event } from '@/types'
import { toast } from 'sonner'
import Radio from '../form/input/Radio'

interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string
  }
}

type Appointment = {
  date: string
  start_datetime: string
  end_datetime: string
  day_of_week: number
}

const Calendar: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [eventTitle, setEventTitle] = useState('')
  const [eventStartDate, setEventStartDate] = useState<Date | null>(null)
  const [eventEndDate, setEventEndDate] = useState<Date | null>(null)
  const [eventLevel, setEventLevel] = useState('')
  const [dailyTime, setDailyTime] = useState<Date | null>(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [showDailyTimePicker, setShowDailyTimePicker] = useState(false)
  const [colorOpen, setColorOpen] = useState(false)
  const [repeat, setRepeat] = useState<'none' | 'daily' | 'weekly'>('none')
  const [weeklyDays, setWeeklyDays] = useState<number[]>([])
  const [instructor, setInstructor] = useState('')
  const [classPax, setClassPax] = useState(1)
  const [waitlist, setWaitlist] = useState(0)
  const [publish, setPublish] = useState<'now' | 'later'>('now')
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const calendarRef = useRef<FullCalendar>(null)
  const { isOpen, openModal, closeModal } = useModal()
  const [startTime, setStartTime] = useState<Date | null>(
    new Date(new Date().setHours(8, 0, 0, 0)),
  )
  const [serviceOptions, setServiceOptions] = useState<
    {
      service_id: string
      name: string
      duration_minutes: number
      base_price: number
    }[]
  >([])
  const [duration, setDuration] = useState(0)
  const [serviceId, setServiceId] = useState<string | null>(null)

  const weekLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  // const calendarsEvents = {
  //   Danger: "danger",
  //   Success: "success",
  //   Primary: "primary",
  //   Warning: "warning",
  // };

  useEffect(() => {
    console.log('eventEndDate:', eventEndDate)
  }, [eventEndDate])

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services', { method: 'GET' })
        const data = await res.json()
        if (Array.isArray(data)) {
          setServiceOptions(
            data.map((service) => ({
              name: service.name,
              duration_minutes: service.duration_minutes,
              service_id: service.id,
              base_price: service.base_price,
            })),
          )
        }
      } catch (err) {
        console.error('Failed to fetch services', err)
      }
    }
    fetchServices()
  }, [])

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch('/api/events', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()

      // Transform the data to FullCalendar's expected format
      const formattedEvents = data.map((event: Event) => ({
        ...event,
        id: event.id,
        title: event.title,
        service_id: event.service_id,
        service_price: event.service_price,
        start: event.start_time, // must be ISO string
        end: event.end_time, // must be ISO string
        allDay: false,
        extendedProps: {
          calendar: event.color,
          instructor: event.staff_id,
          classPax: event.capacity,
          waitlist: event.waitlist,
          repeat: event.repeat,
          repeatDays: event.repeat_days,
        },
      }))

      setEvents(formattedEvents)
    }
    fetchEvents()
  }, [])

  useEffect(() => {
    if (eventTitle) {
      const found = serviceOptions.find((s) => s.name === eventTitle)
      if (found) setDuration(found.duration_minutes)
    }
  }, [eventTitle, serviceOptions])

  useEffect(() => {
    console.log('eventEndDate:', eventEndDate)
  }, [eventEndDate])

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields()
    setEventStartDate(
      selectInfo.startStr ? new Date(selectInfo.startStr) : null,
    )
    setStartTime(selectInfo.startStr ? new Date(selectInfo.startStr) : null)
    setEventEndDate(selectInfo.endStr ? new Date(selectInfo.endStr) : null)
    openModal()
  }
  const generateAppointmentsForWeek = (): Appointment[] => {
    if (
      !eventStartDate ||
      !startTime ||
      repeat !== 'weekly' ||
      weeklyDays.length === 0
    ) {
      return []
    }

    // Get the base date (start of the week, or the selected date)
    const baseDate = new Date(eventStartDate)
    const startHour = startTime.getHours()
    const startMinute = startTime.getMinutes()

    return weeklyDays.map((dayIndex) => {
      // Clone base date and set to the correct weekday
      const date = new Date(baseDate)
      const currentDay = date.getDay()
      const diff = (dayIndex - currentDay + 7) % 7
      date.setDate(date.getDate() + diff)

      // Set start time
      const appointmentStart = new Date(date)
      appointmentStart.setHours(startHour, startMinute, 0, 0)

      // Set end time using duration
      const appointmentEnd = new Date(appointmentStart)
      appointmentEnd.setMinutes(appointmentEnd.getMinutes() + duration)

      return {
        date: date.toISOString().split('T')[0],
        start_datetime: appointmentStart.toISOString(),
        end_datetime: appointmentEnd.toISOString(),
        day_of_week: dayIndex,
      }
    })
  }

  const handleEventClick = (clickInfo: EventClickArg) => {
    setSelectedEvent(clickInfo.event as unknown as CalendarEvent)
    setEventTitle(clickInfo.event.title)
    setEventStartDate(
      clickInfo.event.start ? new Date(clickInfo.event.start) : null,
    )
    setEventEndDate(clickInfo.event.end ? new Date(clickInfo.event.end) : null)
    setEventLevel(clickInfo.event.extendedProps.calendar)
    openModal()
  }

  const getCombinedDateTime = () => {
    if (!eventStartDate || !startTime) return null
    const combined = new Date(eventStartDate)
    combined.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0)
    return combined
  }
  const getEndTime = () => {
    const start = getCombinedDateTime()
    if (!start || !duration) return null
    const end = new Date(start)
    end.setMinutes(end.getMinutes() + duration)
    return end
  }

  const handleAddOrUpdateEvent = async () => {
    if (repeat === 'weekly' && weeklyDays.length > 0) {
      // Generate all appointments for the selected week days
      const appointments = generateAppointmentsForWeek().map((appt) => ({
        title: eventTitle || 'Untitled Event',
        service_id: serviceId,
        start_time: appt.start_datetime,
        end_time: appt.end_datetime,
        capacity: classPax,
        waitlist,
        color: eventLevel,
        repeat,
        repeat_days: weeklyDays,
        staff_id: instructor,
        // add any other required fields here
      }))
      console.log('appointments:', appointments)
      // Send all appointments to your backend
      try {
        const response = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(appointments),
        })
        if (!response.ok) throw new Error('Failed to save appointments')
        toast.success('Appointments saved successfully')
        // Optionally, update your local state with the new events
        // setEvents([...events, ...appointments])
      } catch (err) {
        toast.error('Failed to save appointments')
        console.error(err)
      }
    } else {
      // Single event logic (as you already have)
      const eventStart = getCombinedDateTime()
      const eventEnd = getEndTime()
      const eventData = {
        title: eventTitle,
        service_id: serviceId,
        start_time: eventStart ? eventStart.toISOString() : null,
        end_time: eventEnd ? eventEnd.toISOString() : null,
        capacity: classPax,
        waitlist,
        color: eventLevel,
        repeat,
        repeat_days: weeklyDays,
      }
      try {
        const response = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventData),
        })
        if (!response.ok) throw new Error('Failed to save event')
        const savedEvent = await response.json()
        setEvents((prev) => [
          ...prev,
          {
            ...savedEvent,
            start: savedEvent.start_time,
            end: savedEvent.end_time,
            allDay: false,
            extendedProps: { calendar: savedEvent.color },
          },
        ])
        toast.success('Event saved successfully')
      } catch (err) {
        toast.error('Failed to save event')
        console.error(err)
      }
    }
    closeModal()
    resetModalFields()
  }
  const handleRadioChange = (value: string) => {
    setRepeat(value as 'none' | 'daily' | 'weekly')
  }

  const resetModalFields = () => {
    setEventTitle('')
    setEventStartDate(null)
    setEventEndDate(null)
    setEventLevel('')
    setColorOpen(false)
    setSelectedEvent(null)
  }

  const handleToggleDay = (day: number) => {
    setWeeklyDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    )
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="custom-calendar">
        <FullCalendar
          ref={calendarRef}
          timeZone="local"
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next addEventButton',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          slotMinTime="07:00:00"
          slotMaxTime="23:00:00"
          events={events}
          selectable={true}
          nowIndicator={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          customButtons={{
            addEventButton: {
              text: 'Add Event +',
              click: openModal,
            },
          }}
          businessHours={{
            daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
            startTime: '08:00',
            endTime: '20:00',
          }}
        />
      </div>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[700px] p-6 lg:p-10"
      >
        <div className="custom-scrollbar flex max-h-[80vh] flex-col overflow-y-auto px-2">
          <h2 className="mb-8 text-2xl font-bold">Add schedule</h2>
          {/* Class input as dropdown */}
          <div className="mb-4">
            <label className="mb-1 block font-semibold">Class</label>
            <div className="relative">
              <select
                className="w-full rounded-lg border px-4 py-2 pr-10 text-base"
                value={serviceId || ''}
                onChange={(e) => {
                  setServiceId(e.target.value)
                  // Optionally, set the event title for display or other logic
                  const selected = serviceOptions.find(
                    (s) => s.service_id === e.target.value,
                  )
                  setEventTitle(selected ? selected.name : '')
                  setDuration(selected ? selected.duration_minutes : 0)
                }}
              >
                <option value="">Select a class</option>
                {serviceOptions.map((service) => (
                  <option key={service.service_id} value={service.service_id}>
                    {service.name}
                  </option>
                ))}
              </select>
              <Search className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          {/* Display name checkbox */}
          <div className="mb-4 flex items-center">
            <input type="checkbox" id="displayName" className="mr-2" />
            <label htmlFor="displayName" className="text-sm">
              Use a different display name
            </label>
          </div>
          {/* Start date */}
          <div className="mb-4">
            <label className="mb-1 block font-semibold">Start date</label>
            <div className="relative">
              <input
                type="text"
                className="w-full cursor-pointer rounded-lg border px-4 py-2 pr-10 text-base"
                placeholder="09/04/2024"
                value={
                  eventStartDate
                    ? eventStartDate.toLocaleDateString('en-GB')
                    : ''
                }
                readOnly
                onClick={() => setShowDatePicker((v) => !v)}
              />
              <CalendarIcon className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              {showDatePicker && (
                <div className="absolute top-full left-0 z-20 mt-2">
                  <DatePicker
                    selected={eventStartDate}
                    onChange={(date) => setEventStartDate(date)}
                    dateFormat="dd/MM/yyyy"
                    inline
                  />
                </div>
              )}
            </div>
          </div>
          {/* Start time and duration */}
          <div className="mb-4 flex gap-4">
            <div className="flex-1">
              <label className="mb-1 block font-semibold">Start time</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full cursor-pointer rounded-lg border px-4 py-2 pr-10 text-base"
                  placeholder="08:00 AM"
                  value={
                    startTime
                      ? startTime.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })
                      : ''
                  }
                  readOnly
                  onClick={() => setShowTimePicker((v) => !v)}
                />
                <Clock className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                {showTimePicker && (
                  <div className="absolute top-full left-0 z-20 mt-2">
                    <DatePicker
                      selected={startTime}
                      onChange={(date) => {
                        setStartTime(date)
                        setShowTimePicker(false)
                      }}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                      inline
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1">
              <label className="mb-1 block font-semibold">Duration</label>
              <div className="flex items-center">
                <input
                  type="number"
                  className="w-full rounded-lg border bg-gray-100 px-4 py-2 text-base"
                  placeholder="Enter duration in minutes"
                  value={duration || ''}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  min="1"
                  required
                />
                <span className="ml-2 text-gray-400">minutes</span>
              </div>
            </div>
          </div>
          {/* Calendar color */}
          <div className="mb-4">
            <label className="mb-1 block font-semibold">Calendar color</label>
            <button
              type="button"
              className="relative flex h-12 w-16 items-center justify-center rounded-lg border"
              onClick={() => setColorOpen((v) => !v)}
            >
              <span className="h-6 w-6 rounded-full border bg-teal-400" />
              <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
              {/* Color dropdown (demo only) */}
              {colorOpen && (
                <div className="absolute top-full left-0 z-10 mt-2 flex gap-2 rounded border bg-white p-2 shadow">
                  <span className="h-6 w-6 cursor-pointer rounded-full border bg-teal-400" />
                  <span className="h-6 w-6 cursor-pointer rounded-full border bg-pink-400" />
                  <span className="h-6 w-6 cursor-pointer rounded-full border bg-yellow-400" />
                </div>
              )}
            </button>
          </div>
          {/* Repeat rules */}
          <div className="mb-4">
            <label className="mb-1 block font-semibold">Repeat rules</label>
            <div className="mt-2 flex flex-col gap-2">
              <Radio
                id="repeat-none"
                name="repeat"
                value="none"
                checked={repeat === 'none'}
                onChange={handleRadioChange}
                label="Doesn't repeat"
              />
              <Radio
                id="repeat-daily"
                name="repeat"
                value="daily"
                checked={repeat === 'daily'}
                onChange={handleRadioChange}
                label="Daily"
              />
              <Radio
                id="repeat-weekly"
                name="repeat"
                value="weekly"
                checked={repeat === 'weekly'}
                onChange={handleRadioChange}
                label="Weekly"
              />
              {/* Daily time picker */}
              {repeat === 'daily' && (
                <div className="mt-4">
                  <label className="mb-1 block font-medium">Time</label>
                  <div className="relative w-40">
                    <input
                      type="text"
                      className="w-full cursor-pointer rounded-lg border px-4 py-2 text-base"
                      value={
                        dailyTime
                          ? dailyTime.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
                            })
                          : ''
                      }
                      readOnly
                      onClick={() => setShowDailyTimePicker((v) => !v)}
                    />
                    {showDailyTimePicker && (
                      <div className="absolute top-full left-0 z-20 mt-2">
                        <DatePicker
                          selected={dailyTime}
                          onChange={(date) => {
                            setDailyTime(date)
                            setShowDailyTimePicker(false)
                          }}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="Time"
                          dateFormat="h:mm aa"
                          inline
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* Weekly day picker */}
              {repeat === 'weekly' && (
                <div className="mt-4 flex gap-2">
                  {weekLabels.map((label, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`flex h-12 w-12 items-center justify-center rounded-lg border text-lg font-semibold transition-colors ${
                        weeklyDays.includes(idx)
                          ? 'bg-black text-white'
                          : 'border-gray-300 bg-white text-black'
                      } `}
                      onClick={() => handleToggleDay(idx)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Class Details */}
          <div className="mt-8 border-t pt-8">
            <h3 className="mb-4 text-lg font-bold">Class Details</h3>
            {/* Instructor */}
            <div className="mb-4">
              <label className="mb-1 block font-semibold">Instructor</label>
              <input
                type="text"
                className="w-full rounded-lg border px-4 py-2 text-base"
                placeholder="Instructor name"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
              />
            </div>
            {/* Class pax and Waitlist */}
            <div className="mb-4 flex gap-4">
              <div className="flex-1">
                <label className="mb-1 block font-semibold">Class pax</label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    className="w-full rounded-lg border px-4 py-2 pr-10 text-base"
                    value={classPax}
                    min={1}
                    onChange={(e) => setClassPax(Number(e.target.value))}
                  />
                  <span className="absolute right-3 text-gray-400">pax</span>
                </div>
              </div>
              <div className="flex-1">
                <label className="mb-1 block font-semibold">
                  Waitlist (Optional)
                </label>
                <div className="relative flex items-center gap-2">
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-full border bg-gray-100 text-lg font-bold hover:bg-gray-200"
                    onClick={() => setWaitlist((w) => Math.max(0, w - 1))}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="w-12 rounded-lg border px-2 py-2 text-center text-base"
                    value={waitlist}
                    min={0}
                    onChange={(e) => setWaitlist(Number(e.target.value))}
                  />
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-full border bg-gray-100 text-lg font-bold hover:bg-gray-200"
                    onClick={() => setWaitlist((w) => w + 1)}
                  >
                    +
                  </button>
                  <span className="ml-2 text-gray-400">pax</span>
                </div>
              </div>
            </div>
          </div>
          {/* Publish schedule */}
          <div className="my-6 border-t pt-6">
            <h4 className="mb-4 font-bold">Publish schedule</h4>
            <div className="mt-2 flex flex-col gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="publish"
                  checked={publish === 'now'}
                  onChange={() => setPublish('now')}
                />
                Publish now
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="publish"
                  checked={publish === 'later'}
                  onChange={() => setPublish('later')}
                />
                Publish later
              </label>
              {publish === 'later' && (
                <input
                  type="text"
                  className="mt-2 w-48 rounded-lg border bg-gray-100 px-4 py-2 text-base text-gray-400"
                  value="Set visibility date"
                  disabled
                />
              )}
            </div>
          </div>
          {/* Modal footer */}
          <div className="modal-footer mt-6 flex items-center gap-3 sm:justify-end">
            <button
              onClick={closeModal}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
            >
              Close
            </button>
            <button
              onClick={handleAddOrUpdateEvent}
              type="button"
              className="btn btn-success btn-update-event bg-brand-500 hover:bg-brand-600 flex w-full justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-white sm:w-auto"
            >
              {selectedEvent ? 'Update Changes' : 'Add Event'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

const renderEventContent = (eventInfo: EventContentArg) => {
  const color = eventInfo.event.extendedProps.calendar || 'default'
  const colorClass = `fc-bg-${color.toLowerCase()}`
  return (
    <div
      className={`event-fc-color fc-event-main flex ${colorClass} flex-col rounded-sm p-1`}
    >
      <div className="fc-daygrid-event-dot"></div>
      <div className="fc-event-time">{eventInfo.timeText}</div>
      <div className="fc-event-title">{eventInfo.event.title}</div>
      <div className="fc-event-price">
        {eventInfo.event.extendedProps.classPax} pax
      </div>
    </div>
  )
}

export default Calendar
