

"use client"

import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet"
import type { LatLngExpression } from "leaflet"
import L from "leaflet"
import { useEffect } from "react"

// ✅ Fix marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

type Coordinate = [number, number]

type Props = {
  pickup: Coordinate
  dropoff: Coordinate
  routeCoords?: Coordinate[]
}

// ✅ Handles resizing inside modal
const ResizeMap = () => {
  const map = useMap()

  useEffect(() => {
    const t1 = setTimeout(() => map.invalidateSize(), 200)
    const t2 = setTimeout(() => map.invalidateSize(), 600)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [map])

  return null
}

// ✅ Safely fit route into view
const FitBounds = ({ coords }: { coords: Coordinate[] }) => {
  const map = useMap()

  useEffect(() => {
    if (!coords || coords.length < 2) return

    const timer = setTimeout(() => {
      map.fitBounds(coords, { padding: [40, 40] })
    }, 500)

    return () => clearTimeout(timer)
  }, [coords, map])

  return null
}

const QuoteMap = ({ pickup, dropoff, routeCoords }: Props) => {
  // 🔍 Debug (optional)
  useEffect(() => {
    console.log("ROUTE COORDS:", routeCoords)
  }, [routeCoords])

  return (
    <div className="w-full h-full overflow-hidden rounded-t-2xl [&_.leaflet-container]:!h-full [&_.leaflet-container]:!w-full">
      
      <MapContainer
        center={pickup as LatLngExpression}
        zoom={12}
        scrollWheelZoom={false}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
      >
        <ResizeMap />

        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <Marker position={pickup as LatLngExpression} />
        <Marker position={dropoff as LatLngExpression} />

        {routeCoords && routeCoords.length > 0 && (
          <>
            <Polyline
              positions={routeCoords}
              pathOptions={{ color: "#2563eb", weight: 5 }}
            />
            <FitBounds coords={routeCoords} />
          </>
        )}
      </MapContainer>
    </div>
  )
}

export default QuoteMap
