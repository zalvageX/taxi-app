
import { useState } from "react"



type ScheduleRideData = {
  luggage: boolean
  date: string
  time: string
  from: string
  to: string
  name: string
  phone: string
  email: string
  comment: string
  previewPrice: number | null
}

export const useScheduleRide = () => {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validate = (data: ScheduleRideData) => {
    const newErrors: { [key: string]: string } = {}

    if (!data.date) newErrors.date = "Date is required"
    if (!data.time) newErrors.time = "Time is required"
    if (!data.from.trim()) newErrors.from = "Pickup location is required"
    if (!data.to.trim()) newErrors.to = "Drop-off location is required"
    if (!data.name.trim()) newErrors.name = "Passenger name is required"
    if (!data.phone.trim()) newErrors.phone = "Phone number is required"
    if (!data.email.trim()) newErrors.email = "Email is required"

    return newErrors
  }

  const validateRide = (data: ScheduleRideData) => {
    const newErrors = validate(data)
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const submitRide = async (data: ScheduleRideData) => {
    const validationErrors = validate(data)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return false
    }

    setErrors({})
    setLoading(true)

    try {
      const res = await fetch("/api/ride", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (result.success) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
        return true
      } else {
        setErrors({ api: "Could not send booking. Please try again." })
        return false
      }
    } catch (err) {
      console.error(err)
      setErrors({ api: "Server error. Please try again." })
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    submitRide,
    validateRide, // ✅ now exported
    loading,
    success,
    errors,
  }
}


