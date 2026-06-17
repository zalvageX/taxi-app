"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import { useQuoteCalculator } from "@/hooks/useQuoteCalculator"
import { useAutocomplete } from "@/hooks/useAutocomplete"
import { useUserLocation } from "@/hooks/useUserLocation"
import { useEffect } from "react"
import { reverseGeocode } from "@/lib/geoapify"
import ChooseUsComp from "./ChooseUsComp"




const QuoteMap = dynamic(() => import("./QuoteMap"), { ssr: false })

const ChooseUs = () => {
  const [pickup, setPickup] = useState("")
  const [dropoff, setDropoff] = useState("")
  const [success, setSuccess] = useState(false)

  const {
    quote,
    loading,
    error,
    calculateQuote,
  } = useQuoteCalculator()

  const {
    pickupSuggestions,
    dropoffSuggestions,
    getPickupSuggestions,
    getDropoffSuggestions,
    setPickupSuggestions,
    setDropoffSuggestions,
  } = useAutocomplete()

  const { location, getLocation } = useUserLocation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await calculateQuote(pickup, dropoff)

    setPickup("")
    setDropoff("")
    setSuccess(true)

    setTimeout(() => setSuccess(false), 3000)
  }

  useEffect(() => {
  const fillPickup = async () => {
    if (!location) return

    const result = await reverseGeocode(location)

    if (result?.properties?.formatted) {
      setPickup(result.properties.formatted)
    }
  }

  fillPickup()
}, [location])

  return (
    <section 
      id="chooseUs"
      className="py-16 bg-slate-200"
    
    >
      <div className="max-w-screen-xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Why Choose us?
        </h2>
        <ChooseUsComp />

        <h3 className="text-2xl md:text-4xl font-semibold text-center mb-12">
          Planning a trip and want to get a quote?
        </h3>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-full md:flex-row gap-4 bg-slate-100 p-4 rounded-lg"
        >
          {/* PICKUP */}
          <div className="w-full relative">
            <input
              value={pickup}
              placeholder="Pick up"
              className="w-full p-3 border rounded"
              onChange={(e) => {
                setPickup(e.target.value)
                getPickupSuggestions(e.target.value)
              }}
            />
            <button
              type="button"
              onClick={getLocation}
              className="text-sm text-blue-600 mt-1 hover:text-blue-900 transition-all duration-200"
            >
              📍 Use my current location
            </button>

            {pickupSuggestions.length > 0 && (
              <div className="absolute bg-white border w-full z-10">
                {pickupSuggestions.map((item, i) => (
                  <div
                    key={i}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setPickup(item.properties.formatted)
                      setPickupSuggestions([])
                    }}
                  >
                    {item.properties.formatted}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* DROPOFF */}
          <div className="w-full relative">
            <input
              value={dropoff}
              placeholder="Drop-off"
              className="w-full p-3 border rounded"
              onChange={(e) => {
                setDropoff(e.target.value)
                getDropoffSuggestions(e.target.value)
              }}
            />

            {dropoffSuggestions.length > 0 && (
              <div className="absolute bg-white border w-full z-10">
                {dropoffSuggestions.map((item, i) => (
                  <div
                    key={i}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setDropoff(item.properties.formatted)
                      setDropoffSuggestions([])
                    }}
                  >
                    {item.properties.formatted}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="bg-red-600 text-white px-6 py-3 rounded"
            disabled={loading}
          >
            {loading ? "Calculating..." : "Get Quote →"}
          </button>
        </form>

        {/* ERROR */}
        {error && (
          <p className="text-red-500 mt-4 text-center">{error}</p>
        )}

        {/* SUCCESS */}
        {success && (
          <p className="text-green-600 mt-4 text-center">
            Quote ready!
          </p>
        )}

        {/* RESULT */}
        {quote && (
          <>
            <div className="mt-6 bg-white p-4 rounded shadow text-center">
              <p><b>Pickup:</b> {quote.pickup}</p>
              <p><b>Dropoff:</b> {quote.dropoff}</p>
              <p>{quote.distance.toFixed(2)} km</p>
              <p>{quote.duration} mins</p>
              <p className="text-red-600 font-bold">
                €{quote.price.toFixed(2)}
              </p>
            </div>

            <QuoteMap
              pickup={quote.pickupCoords}
              dropoff={quote.dropoffCoords}
              routeCoords={quote.routeCoords}
            />
          </>
        )}

      </div>
    </section>
  )
}

export default ChooseUs

