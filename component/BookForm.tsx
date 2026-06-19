"use client"

import { useUserLocation } from "@/hooks/useUserLocation"
import { useState, useEffect } from "react"
import { useQuoteCalculator } from "@/hooks/useQuoteCalculator"
import { getRoute, reverseGeocode } from "@/lib/geoapify"
import "leaflet/dist/leaflet.css"
import ConfirmModal from "./confirmModalWrapper"
import { useAutocomplete } from "@/hooks/useAutocomplete"
import RideStatusModal from "./RideStatusModal"







const BookForm = () => {


  const { quote, loading, error, calculateQuote } = useQuoteCalculator()
  const { location, getLocation } = useUserLocation()
  const [showModal, setShowModal] = useState(false)
  const [locating, setLocating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rideData, setRideData] = useState<any>(null)

  // passenger counter
  const [passengers, setPassengers] = useState(1)
  const incrementPassengers = () => setPassengers((prev) => Math.min(prev + 1, 5))
  const decrementPassengers = () => setPassengers((prev) => Math.max(prev - 1, 1))

  // form data inputs
  const [formData, setFormData] = useState({
    pickup: "",
    dropoff: "",
    name: "",
    phone: "",
    email: "",
    comment: "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // VALIDATION
  const validate = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.pickup.trim()) newErrors.pickup = "Pickup location is required"
    if (!formData.dropoff.trim()) newErrors.dropoff = "Dropoff location is required"
    if (!formData.name.trim()) newErrors.name = "Passenger name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^\+?\d{7,15}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid phone number"
    }

    return newErrors
  }


  // form handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }


  // AUtocomplete locations
  const {
      pickupSuggestions,
      dropoffSuggestions,
      getPickupSuggestions,
      getDropoffSuggestions,
      setPickupSuggestions,
      setDropoffSuggestions,
      handlePickupChange,
      handleDropoffChange,
    } = useAutocomplete()

  //animate polyline on price calculation  first here
  const [confirmedQuote, setConfirmedQuote] = useState<any>(null)
  const [animatedRoute, setAnimatedRoute] = useState<[number, number][]>([])
  // reset
  useEffect(() => {
    setAnimatedRoute([])
  }, [quote?.routeCoords])

  

  useEffect(() => {
    if (!showModal || !confirmedQuote?.routeCoords) return

    let i = 0
    let frameId: number

    const animate = () => {
      setAnimatedRoute((prev) => {
        if (i >= confirmedQuote.routeCoords.length) return prev

        const next = [...prev, confirmedQuote.routeCoords[i]]
        i++
        return next
      })

      if (i < confirmedQuote.routeCoords.length) {
        frameId = requestAnimationFrame(animate)
      }
    }

    frameId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(frameId)
  }, [showModal])


  // use my location fxn
  const handleUseMyLocation = async () => {
    try {
      setLocating(true)

      const coords = await getLocation()
      if (!coords) return

      const result = await reverseGeocode(coords)
      const address = result?.properties?.formatted

      if (address) {
        setFormData((prev) => ({
          ...prev,
          pickup: address,
        }))
      }
    } catch (err) {
      console.error("Location error:", err)
    } finally {
      setLocating(false)
    }
  }

  const [showConfirm, setShowConfirm] = useState(false)
  const [showRideStatus, setShowRideStatus] = useState(false) 


    // on submit fxn
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationErrors = validate()

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})

    // 👉 FIRST: calculate fresh quote
    const newQuote = await calculateQuote(formData.pickup, formData.dropoff)


     if (!newQuote) return

    setConfirmedQuote(newQuote)

    // 🔥 RESET animation BEFORE opening modal
    setAnimatedRoute([])
    // console.log("Form submitted:", {
    //   ...formData,
    //   passengers,
    //   price: quote?.price,
    // })

    // await calculateQuote(formData.pickup, formData.dropoff)

    setShowModal(true) 
    setIsSubmitting(false)
  }

  useEffect(() => {
    if (isSubmitting) return // 🚫 STOP interference

    if (!formData.pickup || !formData.dropoff) return

    const delay = setTimeout(() => {
      calculateQuote(formData.pickup, formData.dropoff)
    }, 3,500)

    return () => clearTimeout(delay)
  }, [formData.pickup, formData.dropoff, isSubmitting])


   // 📍 Coordinates
  const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(null)
  const [dropoffCoords, setDropoffCoords] = useState<[number, number] | null>(null)

  // 💰 Price
  

    // PRICE PREVIEW FROM API

    useEffect(() => {
      if (!formData.pickup || !formData.dropoff) return

      const delay = setTimeout(() => {
        calculateQuote(formData.pickup, formData.dropoff)
      }, 500) // debounce so it doesn’t spam API

      return () => clearTimeout(delay)
    }, [formData.pickup, formData.dropoff])

    
    // WHATSAPP HANDLING

    const formatPhoneForWhatsApp = (phone: string) => {
    let cleaned = phone.replace(/\s+/g, "") // remove spaces

    // If already international
    if (cleaned.startsWith("+")) {
      return cleaned.replace("+", "")
    }

    // If starts with 0 → convert to Belgium (+32)
    if (cleaned.startsWith("0")) {
      return "32" + cleaned.slice(1)
    }

    // fallback (just in case)
    return cleaned
  }

  const handleWhatsAppBooking = () => {
  const validationErrors = validate()

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors)
    return
  }

  const message = `🚖 *New Ride Request*

    👤 Name: ${formData.name}
    📞 Phone: ${formData.phone}
    👥 Passengers: ${passengers}

    📍 Pickup: ${formData.pickup}
    🏁 Drop-off: ${formData.dropoff}

    💰 Estimated Price: €${quote?.price?.toFixed(2) || "N/A"}

    💬 Comment: ${formData.comment || "None"}`

    // ⚠️ IMPORTANT: this is YOUR business number (not the user's)
    const businessNumber = "324915266777"

    const formattedUserPhone = formatPhoneForWhatsApp(formData.phone)

    const url = `https://wa.me/${businessNumber}?text=${encodeURIComponent(message)}`

    window.open(url, "_blank")
  }

  const resetForm = () => {
    setFormData({
      pickup: "",
      dropoff: "",
      name: "",
      phone: "",
      email: "",
      comment: "",
    })

    setPassengers(1)
    setConfirmedQuote(null)
    setAnimatedRoute([])
  }

  return (
    <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 w-full max-w-md mt-10 md:mt-0 shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-white">Where would you like to go?</h2>
      <form className="space-y-2" onSubmit={handleSubmit}>
        <div className="relative">

          {/* INPUT */}

          <label 
            htmlFor="pickup" 
            className="block text-sm text-slate-300"
          >
            Pick-up Location
          </label>

          <input
            type="text"
            id="pickup"
            value={formData.pickup}
            onChange={(e) => {
              handleChange(e)
              handlePickupChange(e.target.value)
            }}
            placeholder="Enter pick-up location"
            className={`mt-1 w-full px-4 py-2 rounded-lg bg-white/10 text-white 
              outline-none focus:bg-black/60 focus:ring-1 border-white/30 focus:ring-red-500
              transition ${errors.pickup ? "input-error" : ""}`}
          />
          {errors.pickup && <p className="text-red-400 text-sm float-end">{errors.pickup}</p>}
          
          <div className="absolute right-2 top-1/2 -translate-y-1/2 mt-2 group">

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
              pointer-events-none absolute right-10 top-1/2 -translate-y-1/2 
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
                absolute right-[-5px] top-1/2 -translate-y-1/2 
                w-2 h-2 bg-black/80 rotate-45
              "
              ></span>
            </span>

          </div>

          {pickupSuggestions.length > 0 && (
            <div className="absolute z-10 bg-white text-black w-full mt-1 rounded max-h-40 overflow-y-auto">
              {pickupSuggestions.map((item, i) => (
                <div
                  key={i}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      pickup: item.properties.formatted,
                    }))

                    setPickupCoords([
                      item.geometry.coordinates[1], // lat
                      item.geometry.coordinates[0], // lng
                    ])

                    setPickupSuggestions([])
                  }}
                >
                  {item.properties.formatted}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DROP_OFF */}

        <div className="relative">
          <label htmlFor="dropoff" className="block text-sm text-slate-300">
            Drop-off Location
          </label>
          <input
            type="text"
            id="dropoff"
            value={formData.dropoff}
            onChange={(e) => {
              handleChange(e)
              handleDropoffChange(e.target.value)
            }}
            placeholder="Enter destination"
            className={`mt-1 w-full px-4 py-2 rounded-lg bg-white/10 text-white 
              outline-none focus:bg-black/60 focus:ring-1 border-white/30 focus:ring-red-500
              transition ${errors.dropoff ? "input-error" : ""}`}
          />
          {errors.dropoff && <p className="text-red-400 text-sm float-end">{errors.dropoff}</p>}

          {dropoffSuggestions.length > 0 && (
            <div className="absolute z-10 bg-white text-black w-full mt-1 rounded max-h-40 overflow-y-auto">
              {dropoffSuggestions.map((item, i) => (
                <div
                  key={i}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      dropoff: item.properties.formatted,
                    }))
                    setDropoffCoords([
                      item.geometry.coordinates[1], // lat
                      item.geometry.coordinates[0], // lng
                    ])
                    setDropoffSuggestions([])
                  }}
                >
                  {item.properties.formatted}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PASSENGERS INFO */}
        <div className="relative">
          <label htmlFor="name" className="block text-sm text-slate-300">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className={`mt-1 w-full px-4 py-2 rounded-lg bg-white/10 text-white 
              outline-none focus:bg-black/60 focus:ring-1 border-white/30 focus:ring-red-500
              transition ${errors.name ? "input-error" : ""}`}
          />
          {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}
        </div>

        {/* PHONE + EMAIL */}

        <div className="relative flex gap-4">
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+32 471 23 45 67"
            className={`mt-1 w-1/2 placeholder:text-gray-500 px-4 py-2 rounded-lg bg-white/10 text-white 
              outline-none focus:bg-black/60 focus:ring-1 border-white/30 focus:ring-red-500
              transition ${errors.phone ? "input-error" : ""}`}
          />
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="E-mail"
            className={`mt-1 w-1/2 placeholder:text-gray-500 px-4 py-2 rounded-lg bg-white/10 text-white 
              outline-none focus:bg-black/60 focus:ring-1 border-white/30 focus:ring-red-500
              transition ${errors.email ? "input-error" : ""}`}

          />
        </div>

        {/* Passenger counter */}
          
        <div className="flex items-center gap-1">
          <button 
            type="button"   
            onClick={decrementPassengers} 
            className="px-[6px] py-1 text-red-400 font-extrabold bg-gray-900 rounded-full hover:bg-black/60" 
          >
            −
          </button>
          <span 
            className="text-white bg-slate-600 px-5 py-2 rounded-lg">
              {passengers}
            </span>
          <button 
            type="button" 
            onClick={incrementPassengers} 
            className="px-[6px] py-1 text-green-400 font-extrabold bg-gray-900 rounded-full hover:bg-black/60"
          >
            +
          </button>
         
        </div>

        {/* Comment */}

        <textarea
          id="comment"
          value={formData.comment}
          onChange={handleChange}
          placeholder="Add comment (optional)"
          className="mt-1 w-full px-4 py-2 rounded-lg bg-white/10 text-white resize-none"
        />

        {/* 💰 Price */}
        {/* {previewPrice && (
          <div className="text-center mb-4 text-white">
            €{previewPrice.toFixed(2)}
          </div>
        )} */}
        {loading && (
          <p className="text-sm text-gray-400 mt-2">Calculating fare...</p>
        )}

        {quote && !loading && (
          <div className="mt-2 text-white text-sm">
            <p>Estimated Price: €{quote.price.toFixed(2)}</p>
            <p>{quote.distance.toFixed(2)} km • {quote.duration} mins</p>
          </div>
        )}

        {/* BUTTONS */}

        <div className="flex gap-2">
          <button 
            type="button"  
            onClick={handleWhatsAppBooking}
            className="w-full flex-1 border border-green-500 overflow-hidden relative text-white text-base rounded-sm px-6 py-3 
                     before:transition before:absolute before:inset-0 before:bg-green-700
                     before:origin-bottom before:scale-y-0 before:duration-300 hover:before:scale-y-100"
          >
            <span className="relative">
              Book via WhatsApp
            </span>
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex-1 border border-red-500 overflow-hidden relative text-white text-base rounded-sm px-6 py-3 
                     before:transition before:absolute before:inset-0 before:bg-red-700
                     before:origin-bottom before:scale-y-0 before:duration-300 hover:before:scale-y-100"
          >
            <span className="flex relative items-center justify-center">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Calculating trip...
              </span>
            ) : (
              "Book ride"
            )}
          </span>
          </button>
        </div>
      </form>
      {/* QUOTE RESULT */}
      {error && <p className="text-red-400 mt-3">{error}</p>}
      
      {showModal && confirmedQuote && (
        <ConfirmModal
          quote={confirmedQuote}
          formData={formData}
          animatedRoute={animatedRoute}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false)
            setRideData({
              pickup: confirmedQuote?.pickup,
              dropoff: confirmedQuote?.dropoff,
              price: confirmedQuote?.price,
            })
            setShowRideStatus(true)

            setTimeout(() => {
              resetForm()
            }, 1000)
          }
        }
        />
      )}

      {/* Final Modal */}


      {showRideStatus && (
        <RideStatusModal
          driver={{
            name: "De Voc",
            avatar: "/Avatar.png",
            verified: true,
          }}
          car={{
            model: "MG ZS EV",
            color: "White",
            plate: "TXAV325",
          }}
          pickup={rideData.pickup}
          dropoff={rideData.dropoff}
          price={rideData.price || 0}
          onClose={() => setShowRideStatus(false)}
        />
      )}
    </div>
  )
}

export default BookForm

