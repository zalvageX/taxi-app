

"use client"

import { useState } from "react"
import { geocode, getRoute } from "@/lib/geoapify"

export type QuoteType = {
  pickup: string
  dropoff: string
  distance: number
  duration: number
  price: number
  pickupCoords: [number, number]
  dropoffCoords: [number, number]
  routeCoords: [number, number][]
}

export const useQuoteCalculator = () => {
  const [quote, setQuote] = useState<QuoteType | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Calculate quote using either:
   * - pickup/dropoff strings (geocoded), OR
   * - pickupCoords directly from user location
   */
  // const calculateQuote = async (
  //   pickup: string | null,
  //   dropoff: string,
  //   pickupCoordsOverride?: [number, number]
  // ) => {
  //   setLoading(true)
  //   setError(null)

  //   try {
  //     let pickupCoords: [number, number] | null = null
  //     let dropoffCoords: [number, number] | null = null

  //     // If we already have GPS coords, use them
  //     if (pickupCoordsOverride) {
  //       pickupCoords = [pickupCoordsOverride[1], pickupCoordsOverride[0]] // flip to [lon, lat]
  //     } else if (pickup) {
  //       const pickupData = await geocode(pickup)
  //       pickupCoords = pickupData?.geometry?.coordinates || null
  //     }

  //     const dropoffData = await geocode(dropoff)
  //     dropoffCoords = dropoffData?.geometry?.coordinates || null

  //     if (!pickupCoords || !dropoffCoords) {
  //       throw new Error("Invalid locations")
  //     }

  //     // Geoapify expects [lat, lon]
  //     const route = await getRoute(
  //       [pickupCoords[1], pickupCoords[0]],
  //       [dropoffCoords[1], dropoffCoords[0]]
  //     )

  //     const routeFeature = route?.features?.[0]
  //     const distance = routeFeature?.properties?.distance
  //     const duration = routeFeature?.properties?.time
  //     const coords = routeFeature?.geometry?.coordinates || []

  //     if (!distance || !duration || coords.length === 0) {
  //       throw new Error("Route data incomplete")
  //     }

  //     const routeCoords = coords.flat().map((c: [number, number]) => [c[1], c[0]])

  //     const distanceKm = distance / 1000
  //     const durationMin = Math.round(duration / 60)

  //     const baseFare = 5
  //     const pricePerKm = 1.5
  //     const price = baseFare + distanceKm * pricePerKm

  //     const newQuote: QuoteType = {
  //       pickup: pickup || "Current Location",
  //       dropoff,
  //       distance: distanceKm,
  //       duration: durationMin,
  //       price,
  //       pickupCoords: [pickupCoords[1], pickupCoords[0]],
  //       dropoffCoords: [dropoffCoords[1], dropoffCoords[0]],
  //       routeCoords,
  //     }

  //     setQuote(newQuote)

  //     return newQuote

  //   } catch (err) {
  //     setError("Could not calculate quote")
  //     console.error(err)
  //   } finally {
  //     setLoading(false)
  //   }
  // }
  const calculateQuote = async (
  pickup: string | null,
  dropoff: string,
  pickupCoordsOverride?: [number, number]
): Promise<QuoteType | null> => {
  setLoading(true)
  setError(null)

  try {
    let pickupCoords: [number, number] | null = null
    let dropoffCoords: [number, number] | null = null

    if (pickupCoordsOverride) {
      pickupCoords = [pickupCoordsOverride[1], pickupCoordsOverride[0]]
    } else if (pickup) {
      const pickupData = await geocode(pickup)
      pickupCoords = pickupData?.geometry?.coordinates || null
    }

    const dropoffData = await geocode(dropoff)
    dropoffCoords = dropoffData?.geometry?.coordinates || null

    if (!pickupCoords || !dropoffCoords) {
      throw new Error("Invalid locations")
    }

    const route = await getRoute(
      [pickupCoords[1], pickupCoords[0]],
      [dropoffCoords[1], dropoffCoords[0]]
    )

    const routeFeature = route?.features?.[0]
    const distance = routeFeature?.properties?.distance
    const duration = routeFeature?.properties?.time
    const coords = routeFeature?.geometry?.coordinates || []

    if (!distance || !duration || coords.length === 0) {
      throw new Error("Route data incomplete")
    }

    const routeCoords = coords.flat().map((c: [number, number]) => [c[1], c[0]])

    const distanceKm = distance / 1000
    const durationMin = Math.round(duration / 60)

    const baseFare = 5
    const pricePerKm = 1.5
    const price = baseFare + distanceKm * pricePerKm

    const newQuote: QuoteType = {
      pickup: pickup || "Current Location",
      dropoff,
      distance: distanceKm,
      duration: durationMin,
      price,
      pickupCoords: [pickupCoords[1], pickupCoords[0]],
      dropoffCoords: [dropoffCoords[1], dropoffCoords[0]],
      routeCoords,
    }

    setQuote(newQuote)

    return newQuote
  } catch (err) {
    setError("Could not calculate quote")
    console.error(err)
    return null // ✅ fix
  } finally {
    setLoading(false)
  }
}

  return { quote, loading, error, calculateQuote }
}


