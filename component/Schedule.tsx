"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useScheduleRide } from "@/hooks/useScheduleRide"
import { useLocationSearch } from "@/hooks/useLocationSearch"
import { getRoute } from "@/lib/geoapify"
import { useUserLocation } from "@/hooks/useUserLocation"
import { reverseGeocode } from "@/lib/geoapify"



gsap.registerPlugin(ScrollTrigger)

const ScheduleRide = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const formRef = useRef<HTMLFormElement | null>(null)

  // 📍 Location search hooks
  const pickupSearch = useLocationSearch()
  const dropoffSearch = useLocationSearch()

  const [distanceKm, setDistanceKm] = useState<number | null>(null)
  const [durationMin, setDurationMin] = useState<number | null>(null) 

  // 📍 Coordinates
  const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(null)
  const [dropoffCoords, setDropoffCoords] = useState<[number, number] | null>(null)

  // 💰 Price
  const [previewPrice, setPreviewPrice] = useState<number | null>(null)

  // modals

  const [showChoice, setShowChoice] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [paying, setPaying] = useState(false)
  const [message, setMessage] = useState("Please wait...")
  const [confirmingBooking, setConfirmingBooking] = useState(false)

  // setTimeout(() => {
  //   setMessage("Redirecting to secure payment...")
  // }, 1000)

  // 🎯 Form UI state
  const [luggage, setLuggage] = useState(false)
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [pickup, setPickup] = useState("")
  const [dropoff, setDropoff] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] =useState("")
  const [comment, setComment] = useState("")
  const [confirming, setConfirming] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  

  const [shakeKey, setShakeKey] = useState(0)

  // ⚙️ Business logic
  const { submitRide, loading, validateRide, success, errors } = useScheduleRide()

  // Use my location pin
  const { getLocation, loading: locating } = useUserLocation()

  const handleUseMyLocation = async () => {
    const coords = await getLocation()

    if (!coords) return

    try {
      const result = await reverseGeocode(coords)
      const address = result?.properties?.formatted

      if (address) {
        setPickup(address) // ✅ correct state
        setPickupCoords(coords) // keep [lat, lon] order from geolocation
      }
    } catch (err) {
      console.error("Reverse geocoding failed:", err)
    }
  }


  // 🚗 REAL route pricing
  useEffect(() => {
    const fetchRoute = async () => {
      if (!pickupCoords || !dropoffCoords) return

      try {
        console.log("FROM:", pickupCoords)
        console.log("TO:", dropoffCoords)

        const route = await getRoute(pickupCoords, dropoffCoords)

        if (!route?.features?.length) {
          console.error("No route found", route)
          return
        }

        const props = route.features[0].properties

        const distanceKmVal = props.distance / 1000
        const durationMinVal = props.time / 60

        const price = 5 + distanceKmVal * 1.5

        setPreviewPrice(price)
        setDistanceKm(distanceKmVal)
        setDurationMin(durationMinVal)
      } catch (err) {
        console.error("Route error:", err)
      }
    }

    fetchRoute()
  }, [pickupCoords, dropoffCoords])

  // 🎬 Animation
  useEffect(() => {
    if (!sectionRef.current || !formRef.current) return

    const ctx = gsap.context(() => {
      gsap.from(formRef.current, {
        opacity: 0,
        y: 50,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // 🚀 Submit

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const isValid = validateRide({
      luggage,
      date,
      time,
      from: pickup,
      to: dropoff,
      name,
      phone,
      email,
      comment,
      previewPrice,
    })

    if (!isValid) {
      setShakeKey(prev => prev + 1)
      return
    }

    setShowChoice(true)
  }

  const resetForm = () => {
    setLuggage(false)
    setDate("")
    setTime("")
    setPickup("")
    setDropoff("")
    setName("")
    setPhone("")
    setEmail("")
    setComment("")
    setPreviewPrice(null)
  }

  const handleFinalSubmit = async () => {
    const ok = await submitRide({
      luggage,
      date,
      time,
      from: pickup,
      to: dropoff,
      name,
      phone,
      email,
      comment,
      previewPrice,
    })

    if (ok) {
      resetForm()
      return true
    }

    return false
  }


  
  // Card Payment

  const bookingData = {
    price: previewPrice,
    pickup,
    dropoff,
  }

  const handleCardPayment = async () => {
    try {
      if (!previewPrice || !pickup || !dropoff) {
        alert("Missing booking details")
        return
      }

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      })

      if (!res.ok) {
        throw new Error("Failed to create checkout session")
      }

      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("No checkout URL returned")
      }
    } catch (err) {
      console.error("Error creating checkout session:", err)
      alert("There was an error processing your payment. Please try again.")
    }
  }


  return (
    <section
    id="schedule"
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
    >
      <Image
        src="/toyota.png"
        alt="Car background"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/30" />



      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="relative z-10 bg-white/10 backdrop-blur-md rounded-xl p-8 w-[90%] md:w-[450px] text-white"
      >
        <h2 className="text-2xl font-bold mb-6">Schedule a ride</h2>

        {/* 🧳 Luggage */}
        <label className="flex items-center justify-between mb-6 cursor-pointer">
          <span className="text-sm">I have luggage</span>

          <div className="relative">
            <input
              type="checkbox"
              checked={luggage}
              onChange={(e) => setLuggage(e.target.checked)}
              className="sr-only peer"
            />

            {/* Track */}
            <div className="w-10 h-5 bg-gray-400 rounded-full peer-checked:bg-red-600 transition-colors" />

            {/* Thumb */}
            <div className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full shadow-md transform peer-checked:translate-x-5 transition-transform" />
          </div>
        </label>

        {/* 📅 Date + Time */}
        <div className="flex gap-3 mb-4">
          <input
            key={`date-${shakeKey}`}
            type="date"
            value={date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDate(e.target.value)}
            className={`w-1/2 bg-transparent border rounded px-3 py-2 
              outline-none focus:bg-black/60 border-white/30 focus:ring-2 focus:ring-red-500
              transition ${errors.date ? "input-error" : ""}`}
          />
          <input
            key={`time-${shakeKey}`}
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={`w-1/2 bg-transparent border rounded px-3 py-2 
              outline-none focus:bg-black/60 border-white/30 focus:ring-2 focus:ring-red-500
              transition ${errors.time ? "input-error" : ""}`}
          />
        </div>

        {/* 📍 Pickup */}
        <div className="relative mb-4">
          <input
            key={`pickup-${shakeKey}`}
            value={pickup}
            placeholder="Pickup"
            onChange={(e) => {
              setPickup(e.target.value)
              pickupSearch.search(e.target.value)
            }}
            className={`w-full bg-transparent border rounded px-3 py-2 outline-none focus:bg-black/60 border-white/30 focus:ring-2 focus:ring-red-500
              transition ${errors.from ? "input-error" : ""}`}
          />
          <div className="absolute right-2 top-2 -translate-y-1/2 mt-2 group">

            {/* BUTTON */}
            <button
              type="button"
              onClick={handleUseMyLocation}
              disabled={locating}
              className="relative flex items-center justify-center w-8 h-8"
            >
              {locating ? (
                // 🔄 Spinner
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                // 📍 Icon
                <span className="text-lg transition-transform group-hover:scale-110">
                  📍
                </span>
              )}
            </button>

            {/* TOOLTIP */}
            <span
              className="
              pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 
              whitespace-nowrap text-xs px-3 py-1.5 rounded-md

              bg-black/80 backdrop-blur-md text-white shadow-lg

              opacity-0 scale-95 translate-x-2
              group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0

              transition-all duration-200 ease-out
            "
            >
              Use my location

              {/* 🔻 Arrow (chef’s kiss) */}
              <span
                className="
                absolute left-[-5px] top-1/2 -translate-y-1/2 
                w-2 h-2 bg-black/80 rotate-45
              "
              ></span>
            </span>

          </div>

          {pickupSearch.results.length > 0 && (
            <div className="absolute z-50 bg-white text-black w-full rounded shadow">
              {pickupSearch.results.map((item, i) => (
                <div
                  key={i}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    const [lon, lat] = item.geometry.coordinates

                    setPickup(item.properties.formatted)
                    setPickupCoords([lat, lon]) // store [lat, lon] for routing
                    pickupSearch.clear()
                  }}
                >
                  {item.properties.formatted}
                </div>
              ))}
            </div>
          )}

          {errors.from && <p className="text-red-400 text-xs">{errors.from}</p>}
        </div>

        {/* 📍 Dropoff */}
        <div className="relative mb-4">
          <input
            key={`dropoff-${shakeKey}`}
            value={dropoff}
            placeholder="Drop-off"
            onChange={(e) => {
              setDropoff(e.target.value)
              dropoffSearch.search(e.target.value)
            }}
            className={`w-full bg-transparent border rounded px-3 py-2 
              outline-none focus:bg-black/60 border-white/30 focus:ring-2 focus:ring-red-500
              transition ${errors.to ? "input-error" : ""}`}
          />

          {dropoffSearch.results.length > 0 && (
            <div className="absolute z-50 bg-white text-black w-full rounded shadow">
              {dropoffSearch.results.map((item, i) => (
                <div
                  key={i}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    const [lon, lat] = item.geometry.coordinates

                    setDropoff(item.properties.formatted)
                    setDropoffCoords([lat, lon]) // store [lat, lon] for routing
                    dropoffSearch.clear()
                  }}
                >
                  {item.properties.formatted}
                </div>
              ))}
            </div>
          )}

          {errors.to && <p className="text-red-400 text-xs">{errors.to}</p>}
        </div>

        {/* 👤 Name */}
        <input
          key={`name-${shakeKey}`}
          placeholder="Passenger name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`w-full mb-3 bg-transparent border rounded px-3 py-2 
            outline-none focus:bg-black/60 border-white/30 focus:ring-2 focus:ring-red-500
            transition ${errors.name ? "input-error" : ""}`}
        />

        {/* 📞 Phone + email */}
        <div className="flex gap-3">
          <input
            key={`phone-${shakeKey}`}
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`w-1/2 mb-3 bg-transparent border rounded px-3 py-2 
              outline-none focus:bg-black/60 border-white/30 focus:ring-2 focus:ring-red-500
              transition ${errors.phone ? "input-error" : ""}`}
          />
          <input
            key={`email-${shakeKey}`}
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-1/2 mb-3 bg-transparent border rounded px-3 py-2 
              outline-none focus:bg-black/60 border-white/30 focus:ring-2 focus:ring-red-500
              transition ${errors.email ? "input-error" : ""}`}
          />

        </div>

        {/* 💬 Comment */}
        <textarea
          placeholder="Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full mb-4 bg-transparent border rounded px-3 py-2 resize-none
            outline-none focus:bg-black/60 border-white/30 focus:ring-2 focus:ring-red-500"
        />

        {/* 💰 Price */}
        {previewPrice !== null && (
          <div className="mb-4 p-4 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 text-center space-y-2">

            <p className="text-lg font-semibold">
              Estimated Price: €{previewPrice.toFixed(2)}
            </p>

            <div className="flex justify-center gap-4 text-sm text-gray-300">
              {distanceKm !== null && (
                <span>🚗 {distanceKm.toFixed(2)} km</span>
              )}
              {durationMin !== null && (
                <span>⏱️ {Math.ceil(durationMin)} mins</span>
              )}
            </div>

          </div>
        )}

        {/* 🚀 Submit */}
        <button
          type="submit"
          // onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-white overflow-hidden relative text-black font-semibold rounded-lg px-6 py-3 
                     before:transition before:absolute before:inset-0 before:bg-gray-400
                     before:origin-bottom before:scale-y-0 before:duration-300 hover:before:scale-y-100"
        >
          <span className="flex relative items-center justify-center">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Please wait...
              </span>
            ) : success ? (
              <span className="flex items-center gap-2">
                    Booked
                    <svg
                      className="w-6 h-6 text-red-700"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                          strokeDasharray: 24,
                          strokeDashoffset: 24,
                          animation: "dash 0.5s ease-out forwards",
                        }}
                      />
                    </svg>
              </span>
               // ✅ Checkmark
            ) : (
              "Book now"
            )}
          </span>
        </button>
      </form>


      {/* Modals */}

      {/* Choice modal */}
      
      {showChoice && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white text-black w-[90%] max-w-md rounded-xl p-6 space-y-4 animate-fadeIn">

        <h3 className="text-lg font-bold text-center">
          Choose booking option
        </h3>

        <p className="text-sm text-gray-600 text-center">
          Secure now with payment or just reserve your date
        </p>

        <button
          onClick={() => {
            setShowChoice(false)
            setShowPayment(true)
          }}
          className="w-full overflow-hidden relative bg-blue-500 text-white py-3 rounded-lg 
            before:transition before:absolute before:inset-0 before:bg-blue-600
            before:origin-bottom before:scale-y-0 before:duration-300 hover:before:scale-y-100 
            "
        >
          <span className="relative items-center">
            💳 Reserve now & Secure your date
          </span>
        </button>

        <button
          onClick={() => {
            setShowChoice(false)
            setShowConfirm(true)
          }}
          className="w-full border overflow-hidden relative border-black/45 py-3 rounded-lg 
            before:transition before:absolute before:inset-0 before:bg-gray-200
            before:origin-bottom before:scale-y-0 before:duration-300 hover:before:scale-y-100"
        >
         <span className="relative items-center">
            Just book for that date
          </span>   
        </button>

        <button
          onClick={() => setShowChoice(false)}
          className="w-full text-sm text-gray-500 hover:text-black"
        >
          Cancel
        </button>
      </div>
    </div>
  )}

  {/* Payment Modal */}

  {showPayment && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white text-black w-[90%] max-w-md rounded-xl p-6 space-y-4 animate-fadeIn">

        <h3 className="text-lg font-bold text-center">
          Secure your ride
        </h3>

        <p className="text-sm text-gray-600 text-center">
          You’ll proceed with payment in the next step
        </p>

          {/* Button Redirecting to Stripe Checkout (mocked for now) */}
          <button
            onClick={async () => {
              setPaying(true)
              setMessage("Please wait...")

              // ⏱️ Place it HERE
              setTimeout(() => {
                setMessage("Redirecting to secure payment...")
              }, 1000)

              try {
                await handleCardPayment()
              } catch (err) {
                console.error(err)
                setPaying(false)
                setMessage("Pay securely (card / Bancontact)")
              }
            }}
            disabled={paying}
            className="w-full relative overflow-hidden py-3 rounded-lg bg-yellow-600 text-white
              before:absolute before:inset-0 before:bg-yellow-700 before:scale-y-0 before:origin-bottom
              before:transition before:duration-300 hover:before:scale-y-100
              disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span className="relative flex items-center justify-center gap-2">
              {paying ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {message}
                </>
              ) : (
                "💳 Pay securely (card / Bancontact)"
              )}
            </span>
          </button>
       

        <button
          onClick={async () => {
            setConfirmingBooking(true)

            const ok = await handleFinalSubmit()

            setConfirmingBooking(false)

            if (ok) {
              setShowPayment(false) // close payment modal
              setShowSuccessPopup(true)

              setTimeout(() => {
                setShowSuccessPopup(false)
              }, 4000)
            }
          }}
          disabled={confirmingBooking}
          className="w-full relative overflow-hidden py-3 rounded-lg border
            before:absolute before:inset-0 before:bg-gray-200 before:scale-y-0 before:origin-bottom
            before:transition before:duration-300 hover:before:scale-y-100
            disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span className="relative flex items-center justify-center gap-2">
            {confirmingBooking ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Confirming your booking...
              </>
            ) : (
              "🕒 Pay Later"
            )}
          </span>
        </button>
      </div>
    </div>
  )}

  {/* Confirm Modal */}

  {showConfirm && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white text-black w-[90%] max-w-md rounded-xl p-6 space-y-4 animate-fadeIn">

        <h3 className="text-lg font-bold text-center">
          Confirm booking
        </h3>

        <p className="text-sm text-gray-600 text-center">
          Your ride will be scheduled without payment
        </p>

        {/* <button
          onClick={async () => {
            await handleFinalSubmit() // ✅ uses hook
            setShowConfirm(false)
          }}
          className="w-full overflow-hidden relative py-3 rounded-lg bg-blue-600 text-white
            before:transition before:absolute before:inset-0 before:bg-blue-700
            before:origin-bottom before:scale-y-0 before:duration-300 hover:before:scale-y-100"
        >
          <span className="relative">
            Confirm Booking
          </span>
        </button> */}

        <button
          onClick={async () => {
            setConfirming(true)

            const ok = await handleFinalSubmit()

            setConfirming(false)

            if (ok) { // your hook returns truthy on success
              setShowConfirm(false)
              setShowSuccessPopup(true)

              setTimeout(() => {
                setShowSuccessPopup(false)
              }, 7000)
            }
          }}
          disabled={confirming}
          className="w-full overflow-hidden relative py-3 rounded-lg bg-blue-600 text-white
            before:transition before:absolute before:inset-0 before:bg-blue-700
            before:origin-bottom before:scale-y-0 before:duration-300 hover:before:scale-y-100
            disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span className="relative flex items-center justify-center gap-2">
            {confirming ? (
              <>
                Confirming
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </>
            ) : (
              "Confirm Booking"
            )}
          </span>
        </button>

        <button
          onClick={() => setShowConfirm(false)}
          className="w-full text-sm text-gray-500 font-semibold hover:text-black"
        >
          Back
        </button>
      </div>
    </div>
  )}

  {showSuccessPopup && (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] 
      bg-black/50 text-white px-6 py-3 rounded-lg shadow-lg animate-fadeIn">
      <h3 className="mb-4 text-center">
        BOOKING SUCCESSFUL
      </h3>
      <p className="text-center">
        You'll receive an email confirming your booking 📩
      </p>
    </div>
  )}
    </section>
  )
}

export default ScheduleRide

