"use client";
import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { Search, CalendarIcon, Clock, ChevronDown } from "lucide-react";
import {
  EventInput,
  DateSelectArg,
  EventClickArg,
  EventContentArg,
} from "@fullcalendar/core";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
  };
}

const Calendar: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartDate, setEventStartDate] = useState<Date | null>(null);
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventLevel, setEventLevel] = useState("");
  const [dailyTime, setDailyTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDailyTimePicker, setShowDailyTimePicker] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const [repeat, setRepeat] = useState<"none" | "daily" | "weekly">("none");
  const [weeklyDays, setWeeklyDays] = useState<number[]>([]);
  const [instructor, setInstructor] = useState("");
  const [classPax, setClassPax] = useState(1);
  const [waitlist, setWaitlist] = useState(0);
  const [publish, setPublish] = useState<"now" | "later">("now");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const [startTime, setStartTime] = useState<Date | null>(
    new Date(new Date().setHours(8, 0, 0, 0))
  );

  const weekLabels = ["S", "M", "T", "W", "T", "F", "S"];

      // const calendarsEvents = {
      //   Danger: "danger",
      //   Success: "success",
      //   Primary: "primary",
      //   Warning: "warning",
      // };

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch('/api/events', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()

      // Transform the data to FullCalendar's expected format
      const formattedEvents = data.map(event => ({
        ...event,
        id: event.id,
        title: event.title,
        start: event.start_time, // must be ISO string
        end: event.end_time,     // must be ISO string
        allDay: false,
        extendedProps: {
          calendar: event.color,
          instructor: event.instructor,
          classPax: event.class_pax,
          waitlist: event.waitlist,
          repeat: event.repeat,
          repeatDays: event.repeat_days,
        },
      }))

      setEvents(formattedEvents)
      console.log("List of events:", formattedEvents)
    }
    fetchEvents()
    // Initialize with some events
    // setEvents([

    //   {
    //     id: "1",
    //     title: "Event Conf.",
    //     start: '2025-06-10T00:00:00.000Z',
    //     end: '2025-06-10T09:00:00.000Z',
    //     allDay: false,
    //     extendedProps: { calendar: "Danger",  },
    //   },
    //   {
    //     id: "2",
    //     title: "Meeting",
    //     start: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    //     extendedProps: { calendar: "Success" },
    //   },
    //   {
    //     id: "3",
    //     title: "Workshop",
    //     start: new Date(Date.now() + 172800000).toISOString().split("T")[0],
    //     end: new Date(Date.now() + 259200000).toISOString().split("T")[0],
    //     extendedProps: { calendar: "Primary" },
    //   },
    // ]);
  }, []);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields();
    setEventStartDate(selectInfo.startStr ? new Date(selectInfo.startStr) : null);
    setStartTime(selectInfo.startStr ? new Date(selectInfo.startStr) : null);
    setEventEndDate(selectInfo.endStr || selectInfo.startStr);
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    setSelectedEvent(clickInfo.event as unknown as CalendarEvent);
    setEventTitle(clickInfo.event.title);
    setEventStartDate(clickInfo.event.start ? new Date(clickInfo.event.start) : null);
    setEventEndDate(clickInfo.event.end ? clickInfo.event.end.toISOString().split("T")[0] : "");
    setEventLevel(clickInfo.event.extendedProps.calendar);
    openModal();
  };

  const getCombinedDateTime = () => {
    if (!eventStartDate || !startTime) return null
    const combined = new Date(eventStartDate)
    combined.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0)
    return combined
  }

  const handleAddOrUpdateEvent = async () => {
    const eventStart = getCombinedDateTime()
    const eventData = {
      title: eventTitle,
      start_time: eventStart ? eventStart.toISOString() : null,
      end_time: eventEndDate ? new Date(eventEndDate).toISOString() : null,
      instructor,
      class_pax: classPax,
      waitlist,
      color: eventLevel, // or your color state
      repeat,
      repeat_days: weeklyDays,
    }

    // Save to database
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      })
      if (!response.ok) throw new Error('Failed to save event')
      const savedEvent = await response.json()

      // Optionally, add the saved event to your local state
      setEvents(prev => [...prev, {
        ...savedEvent,
        start: savedEvent.start_time,
        end: savedEvent.end_time,
        allDay: false,
        extendedProps: { calendar: savedEvent.color },
      }])
    } catch (err) {
      // Handle error (show toast, etc)
      console.error(err)
    }

    closeModal()
    resetModalFields()
  }

  const resetModalFields = () => {
    setEventTitle("");
    setEventStartDate(null);
    setEventEndDate("");
    setEventLevel("");
    setColorOpen(false);
    setSelectedEvent(null);
  };

  const handleToggleDay = (day: number) => {
    setWeeklyDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  };

  return (
    <div className="rounded-2xl border  border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="custom-calendar">
        <FullCalendar
          ref={calendarRef}
          timeZone="local"
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next addEventButton",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
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
              text: "Add Event +",
              click: openModal,
            },
          }}
          businessHours={{
            daysOfWeek: [ 0, 1, 2, 3, 4, 5, 6 ],
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
        <div className="flex flex-col px-2 custom-scrollbar overflow-y-auto max-h-[80vh]">
          <h2 className="text-2xl font-bold mb-8">Add schedule</h2>
          {/* Class input */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Class</label>
            <div className="relative">
              <input
                type="text"
                className="w-full border rounded-lg px-4 py-2 pr-10 text-base"
                placeholder="Pilates Class"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>
          {/* Display name checkbox */}
          <div className="flex items-center mb-4">
            <input type="checkbox" id="displayName" className="mr-2" />
            <label htmlFor="displayName" className="text-sm">
              Use a different display name
            </label>
          </div>
          {/* Start date */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Start date</label>
            <div className="relative">
              <input
                type="text"
                className="w-full border rounded-lg px-4 py-2 pr-10 text-base cursor-pointer"
                placeholder="09/04/2024"
                value={eventStartDate ? eventStartDate.toLocaleDateString("en-GB") : ""}
                readOnly
                onClick={() => setShowDatePicker((v) => !v)}
              />
              <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              {showDatePicker && (
                <div className="absolute left-0 top-full mt-2 z-20">
                 <DatePicker
                    selected={eventStartDate}
                    onChange={date => setEventStartDate(date)}
                    dateFormat="dd/MM/yyyy"
                    inline
                  />
                </div>
              )}
            </div>
          </div>
          {/* Start time and duration */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1">Start time</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full border rounded-lg px-4 py-2 pr-10 text-base cursor-pointer"
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
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                {showTimePicker && (
                  <div className="absolute left-0 top-full mt-2 z-20">
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
              <label className="block font-semibold mb-1">Duration</label>
              <div className="flex items-center">
                <input
                  type="text"
                  className="w-full border rounded-lg px-4 py-2 text-base bg-gray-100"
                  value="60"
                  disabled
                />
                <span className="ml-2 text-gray-400">minutes</span>
              </div>
            </div>
          </div>
          {/* Calendar color */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Calendar color</label>
            <button
              type="button"
              className="w-16 h-12 border rounded-lg flex items-center justify-center relative"
              onClick={() => setColorOpen((v) => !v)}
            >
              <span className="w-6 h-6 rounded-full bg-teal-400 border" />
              <ChevronDown className="ml-2 text-gray-400 w-4 h-4" />
              {/* Color dropdown (demo only) */}
              {colorOpen && (
                <div className="absolute left-0 top-full mt-2 bg-white border rounded shadow p-2 z-10 flex gap-2">
                  <span className="w-6 h-6 rounded-full bg-teal-400 border cursor-pointer" />
                  <span className="w-6 h-6 rounded-full bg-pink-400 border cursor-pointer" />
                  <span className="w-6 h-6 rounded-full bg-yellow-400 border cursor-pointer" />
                </div>
              )}
            </button>
          </div>
          {/* Repeat rules */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Repeat rules</label>
            <div className="flex flex-col gap-2 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="repeat"
                  checked={repeat === "none"}
                  onChange={() => setRepeat("none")}
                />
                Doesn&apos;t repeat
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="repeat"
                  checked={repeat === "daily"}
                  onChange={() => setRepeat("daily")}
                />
                Daily
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="repeat"
                  checked={repeat === "weekly"}
                  onChange={() => setRepeat("weekly")}
                />
                Weekly
              </label>
              {/* Daily time picker */}
              {repeat === "daily" && (
                <div className="mt-4">
                  <label className="block font-medium mb-1">Time</label>
                  <div className="relative w-40">
                    <input
                      type="text"
                      className="w-full border rounded-lg px-4 py-2 text-base cursor-pointer"
                      value={
                        dailyTime
                          ? dailyTime.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })
                          : ""
                      }
                      readOnly
                      onClick={() => setShowDailyTimePicker((v) => !v)}
                    />
                    {showDailyTimePicker && (
                      <div className="absolute left-0 top-full mt-2 z-20">
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
              {repeat === "weekly" && (
                <div className="flex gap-2 mt-4">
                  {weekLabels.map((label, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`w-12 h-12 rounded-lg border flex items-center justify-center text-lg font-semibold transition-colors
                      ${
                        weeklyDays.includes(idx)
                          ? "bg-black text-white"
                          : "bg-white text-black border-gray-300"
                      }
                    `}
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
            <h3 className="text-lg font-bold mb-4">Class Details</h3>
            {/* Instructor */}
            <div className="mb-4">
              <label className="block font-semibold mb-1">Instructor</label>
              <input
                type="text"
                className="w-full border rounded-lg px-4 py-2 text-base"
                placeholder="Instructor name"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
              />
            </div>
            {/* Class pax and Waitlist */}
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label className="block font-semibold mb-1">Class pax</label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    className="w-full border rounded-lg px-4 py-2 text-base pr-10"
                    value={classPax}
                    min={1}
                    onChange={(e) => setClassPax(Number(e.target.value))}
                  />
                  <span className="absolute right-3 text-gray-400">pax</span>
                </div>
              </div>
              <div className="flex-1">
                <label className="block font-semibold mb-1">
                  Waitlist (Optional)
                </label>
                <div className="relative flex items-center gap-2">
                  <button
                    type="button"
                    className="w-8 h-8 rounded-full border flex items-center justify-center text-lg font-bold bg-gray-100 hover:bg-gray-200"
                    onClick={() => setWaitlist((w) => Math.max(0, w - 1))}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="w-12 border rounded-lg px-2 py-2 text-base text-center"
                    value={waitlist}
                    min={0}
                    onChange={(e) => setWaitlist(Number(e.target.value))}
                  />
                  <button
                    type="button"
                    className="w-8 h-8 rounded-full border flex items-center justify-center text-lg font-bold bg-gray-100 hover:bg-gray-200"
                    onClick={() => setWaitlist((w) => w + 1)}
                  >
                    +
                  </button>
                  <span className="text-gray-400 ml-2">pax</span>
                </div>
              </div>
            </div>
          </div>
          {/* Publish schedule */}
          <div className="border-t my-6 pt-6">
            <h4 className="font-bold mb-4">Publish schedule</h4>
            <div className="flex flex-col gap-2 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="publish"
                  checked={publish === "now"}
                  onChange={() => setPublish("now")}
                />
                Publish now
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="publish"
                  checked={publish === "later"}
                  onChange={() => setPublish("later")}
                />
                Publish later
              </label>
              {publish === "later" && (
                <input
                  type="text"
                  className="w-48 border rounded-lg px-4 py-2 text-base mt-2 text-gray-400 bg-gray-100"
                  value="Set visibility date"
                  disabled
                />
              )}
            </div>
          </div>
          {/* Modal footer */}
          <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
            <button
              onClick={closeModal}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
            >
              Close
            </button>
            <button
              onClick={handleAddOrUpdateEvent}
              type="button"
              className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
            >
              {selectedEvent ? "Update Changes" : "Add Event"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const renderEventContent = (eventInfo: EventContentArg) => {
  const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar.toLowerCase()}`;
  return (
    <div
      className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm`}
    >
      <div className="fc-daygrid-event-dot"></div>
      <div className="fc-event-time">{eventInfo.timeText}</div>
      <div className="fc-event-title">{eventInfo.event.title}</div>
    </div>
  );
};

export default Calendar;
