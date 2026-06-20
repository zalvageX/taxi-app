"use client"

import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet"
import { useEffect, useState } from "react"
import L from "leaflet"
import Image from "next/image"
import toast, { Toaster } from "react-hot-toast"

type Props = {
  quote: any
  formData: any // ✅ ADD THIS
  animatedRoute: [number, number][]
  onClose: () => void
  onSuccess: () => void
}


const ConfirmModal = ({ quote, formData, animatedRoute, onClose, onSuccess }: Props) => {
  const [sending, setSending] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)

  const pickupIcon = new L.Icon({
    iconUrl: "/homeLoc.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  })

  const dropoffIcon = new L.Icon({
    iconUrl: "/dropLoc.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  })

  const FitBounds = ({ coords }: { coords: [number, number][] }) => {
    const map = useMap()

    useEffect(() => {
      if (coords.length > 0) {
        map.fitBounds(coords)
      }
    }, [coords, map])

    return null
  }

  if (!quote) return null

  // ✅ FIXED handler
  const handleConfirm = async () => {
    try {
      setSending(true)

      const res = await fetch("/api/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData, // ✅ real user data
          price: quote.price,
          distance: quote.distance,
          duration: quote.duration,
          pickup: quote.pickup,
          dropoff: quote.dropoff,
        }),
      })

      if (!res.ok) throw new Error("Booking failed")


      const paymentRes =await fetch("/api/create-payment-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          pickup: quote.pickup,
          dropoff: quote.dropoff,
          date: formData.date,
          time: formData.time,
          price: quote.price,
        }),
      })

      if (!paymentRes.ok) throw new Error("Payment link failed")

      // ✅ REAL TOAST
      toast.success("Ride booked successfully 🚗")

        onSuccess()
        // setShowRideStatus(true)
        // onClose()
        
        setShowSuccessPopup(true)

      // hide after 5 seconds
      setTimeout(() => {
        setShowSuccessPopup(false)
      }, 5000)

    } catch (err) {
      console.error(err)
      toast.error("Something went wrong")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      
      {/* ✅ TOASTER */}

      <div className="bg-black/80 rounded-xl w-full max-w-lg p-6 text-white shadow-2xl relative">

        {/* CLOSE BUTTON */}
        <div className="absolute top-3 right-3 group">
          <button onClick={onClose} className="text-white text-lg">✕</button>
        </div>

        <h2 className="text-xl font-bold mb-4">Confirm Your Ride</h2>

        {/* DETAILS */}
        <div className="space-y-1 text-sm mb-4">
          <p><strong>Pickup:</strong> {quote.pickup}</p>
          <p><strong>Dropoff:</strong> {quote.dropoff}</p>
        </div>

        {/* PRICE CARD */}
        <div className="py-2 px-4 flex rounded-xl justify-between items-center shadow-[0_0_10px_rgba(220,38,38,0.7)]
          bg-gradient-to-b from-red-900 to-black border border-red-900 mb-4">

          <div className="flex items-center gap-1">
            <Image src="/heroCarBg.png" alt="car" width={90} height={90} />
            <div>
              <p className="font-semibold text-white">Luxury Rider</p>
              <p className="text-xs text-gray-400">
                {quote.duration} mins • {quote.distance?.toFixed(2)} km
              </p>
            </div>
          </div>

          <p className="font-bold text-lg text-white">
            €{quote.price?.toFixed(2)}
          </p>
        </div>

        {/* MAP */}
        <div className="h-56 w-full rounded-lg overflow-hidden mb-4">
          <MapContainer center={quote.pickupCoords} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {quote.routeCoords.length > 0 && (
              <>
                <Polyline positions={animatedRoute} color="blue" />
                <FitBounds coords={quote.routeCoords} />
              </>
            )}

            <Marker position={quote.pickupCoords} icon={pickupIcon}>
              <Popup>Pickup</Popup>
            </Marker>

            <Marker position={quote.dropoffCoords} icon={dropoffIcon}>
              <Popup>Dropoff</Popup>
            </Marker>
          </MapContainer>
        </div>

        {/* ✅ BUTTON WITH LOADING */}
        <button
          onClick={handleConfirm}
          disabled={sending}
          className="w-full border border-red-500 relative text-white px-6 py-3 rounded-sm animate-pulse
          before:absolute before:inset-0 before:bg-red-700 shadow-[0_0_10px_rgba(220,38,38,0.7)]
          before:scale-y-0 hover:before:scale-y-100 before:origin-bottom before:transition"
        >
          <span className="relative">
            {sending ? "Booking..." : "Confirm Ride"}
          </span>
        </button>
      </div>

      {showSuccessPopup && (
        <div className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] 
          bg-black/50 text-white px-6 py-3 rounded-lg shadow-lg animate-fadeIn">
          <h3 className="mb-4 text-center">
            RIDE PLACED
          </h3>
          <p className="text-center">
            You'll receive an email with your ride details 📩
          </p>
        </div>
      )}
     

    </div>
  )
}

export default ConfirmModal

 