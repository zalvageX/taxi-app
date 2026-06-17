"use client"

import { useState } from "react"
import { fetchAutocomplete } from "@/lib/geoapify"

export const useAutocomplete = () => {
  const [pickupSuggestions, setPickupSuggestions] = useState<any[]>([])
  const [dropoffSuggestions, setDropoffSuggestions] = useState<any[]>([])

  const getPickupSuggestions = async (value: string) => {
    if (value.length < 3) return
    const results = await fetchAutocomplete(value)
    setPickupSuggestions(results)
  }

  const getDropoffSuggestions = async (value: string) => {
    if (value.length < 3) return
    const results = await fetchAutocomplete(value)
    setDropoffSuggestions(results)
  }

  let timeout: NodeJS.Timeout

  const handlePickupChange = (value: string) => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    getPickupSuggestions(value)
  }, 300)
}

  const handleDropoffChange = (value: string) => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    getDropoffSuggestions(value)
  }, 300)
}

  return {
    pickupSuggestions,
    dropoffSuggestions,
    getPickupSuggestions,
    getDropoffSuggestions,
    setPickupSuggestions,
    setDropoffSuggestions,
    handlePickupChange,
    handleDropoffChange,
  }
}