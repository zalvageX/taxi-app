"use client"

import { useState } from "react"
import { fetchAutocomplete } from "@/lib/geoapify"

export const useLocationSearch = () => {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])

  const clear = () => setResults([])

  const search = async (text: string) => {
    if (!text.trim()) return

    setLoading(true)

    try {
      const data = await fetchAutocomplete(text)
      setResults(data)
    } finally {
      setLoading(false)
    }
  }

  return {
    search,
    results,
    loading,
    clear,
  }
}