'use client'
import React, { useState } from 'react'
import { Modal } from '../ui/modal'
import ComponentCard from '../common/ComponentCard'
import Button from '../ui/button/Button'
import Badge from '../ui/badge/Badge'
import Radio from '../form/input/Radio'
import { toast } from 'sonner'
import { Booking, Event } from '@/types'
import { formatBookingTime } from '@/utils/dateTime'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  booking: Booking | null
  events: Event[]
}

export const CheckoutModal = ({
  isOpen,
  onClose,
  booking,
  events,
}: CheckoutModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<string>('cash')

  const handlePaymentComplete = async () => {
    if (!booking) return

    try {
      const selectedEvent = events.find((e) => e.id === booking.event_id)
      const servicePrice =
        booking.event.service?.service_pricing?.[0]?.price || 0

      // Create transaction with items and payment
      const transactionData = {
        user_id: booking.user_id || null,
        booking_id: booking.id,
        total_amount: servicePrice,
        payment_method: paymentMethod,
        reference_id: `REF-${Date.now()}`, // Generate a simple reference ID
        items: [
          {
            service_id: selectedEvent?.service_id || booking.event_id,
            quantity: 1,
            unit_price: servicePrice,
            label: `${booking.event.service?.name || selectedEvent?.title || 'Service'} - 1 session`,
          },
        ],
      }

      console.log('Creating transaction:', transactionData)

      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData),
      })

      const result = await response.json()

      if (response.ok) {
        // Also update the booking status
        await fetch(`/api/bookings/${booking.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: 'confirmed',
            notes: `Payment completed via ${paymentMethod}`,
          }),
        })

        toast.success(
          `Payment completed successfully! Transaction ID: ${result.transaction.id}`,
        )
        onClose()
      } else {
        console.error('Transaction failed:', result)
        toast.error(result.error || 'Payment failed. Please try again.')
      }
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Payment failed. Please try again.')
    }
  }

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value)
  }

  if (!booking) return null

  const selectedEvent = events.find((e) => e.id === booking.event_id)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[600px] p-6 lg:p-10"
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Checkout
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Complete payment for booking
          </p>
        </div>

        <ComponentCard title="Booking Summary">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Customer:
              </span>
              <span className="font-medium text-gray-800 dark:text-white/90">
                {booking.user.full_name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Event:</span>
              <span className="font-medium text-gray-800 dark:text-white/90">
                {selectedEvent?.title || 'Event not found'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Time:</span>
              <span className="font-medium text-gray-800 dark:text-white/90">
                {formatBookingTime(booking.event.start_time)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Status:</span>
              <Badge size="sm" color="warning">
                {booking.status}
              </Badge>
            </div>
            <hr className="border-gray-200 dark:border-gray-700" />
            <div className="flex justify-between text-lg font-semibold">
              <span className="text-gray-800 dark:text-white/90">Total:</span>
              <span className="text-gray-800 dark:text-white/90">
                RM{' '}
                {booking.event.service?.service_pricing?.[0]?.price?.toFixed(
                  2,
                ) || '0.00'}
              </span>
            </div>
          </div>
        </ComponentCard>

        <ComponentCard title="Payment Method">
          <div className="space-y-4">
            <div className="flex gap-4">
              <Radio
                id="cash"
                name="payment-method"
                value="cash"
                checked={paymentMethod === 'cash'}
                label="Cash Payment"
                onChange={handlePaymentMethodChange}
              />
              <Radio
                id="card"
                name="payment-method"
                value="card"
                checked={paymentMethod === 'card'}
                label="Card Payment"
                onChange={handlePaymentMethodChange}
              />
              <Radio
                id="online"
                name="payment-method"
                value="online"
                checked={paymentMethod === 'online'}
                label="Online Transfer"
                onChange={handlePaymentMethodChange}
              />
            </div>
          </div>
        </ComponentCard>

        <div className="flex w-full justify-end gap-2">
          <Button
            variant="outline"
            className="cursor-pointer"
            size="sm"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="cursor-pointer bg-green-600 text-white hover:bg-green-700"
            size="sm"
            onClick={handlePaymentComplete}
          >
            Complete Payment
          </Button>
        </div>
      </div>
    </Modal>
  )
}
