// "use client"

// import { useState } from "react"

// export const useUserLocation = () => {
//   const [location, setLocation] = useState<[number, number] | null>(null)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   const getLocation = (): Promise<[number, number] | null> => {
//     setLoading(true)
//     setError(null)

//     return new Promise((resolve) => {
//       if (!navigator.geolocation) {
//         setError("Geolocation not supported")
//         setLoading(false)
//         resolve(null)
//         return
//       }

//       navigator.geolocation.getCurrentPosition(
//         (pos) => {
//           const coords: [number, number] = [
//             pos.coords.latitude,
//             pos.coords.longitude,
//           ]

//           setLocation(coords)
//           setLoading(false)

//           resolve(coords) // 👈 THIS is the upgrade
//         },
//         (err) => {
//           setError(err.message)
//           setLoading(false)
//           resolve(null)
//         }
//       )
//     })
//   }

//   return { location, loading, error, getLocation }
// }


"use client"

import { useState } from "react"

type Coords = [number, number]

export const useUserLocation = () => {
  const [location, setLocation] = useState<Coords | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getLocation = (): Promise<Coords | null> => {
    setLoading(true)
    setError(null)

    let isMounted = true

    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        if (isMounted) {
          setError("Geolocation not supported")
          setLoading(false)
        }
        resolve(null)
        return
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: Coords = [pos.coords.latitude, pos.coords.longitude]
          if (isMounted) {
            setLocation(coords)
            setLoading(false)
          }
          resolve(coords)
        },
        (err) => {
          if (isMounted) {
            setError(err.message)
            setLoading(false)
          }
          resolve(null)
        },
        { enableHighAccuracy: true, timeout: 10000 }
      )
    })
  }

  return { location, loading, error, getLocation }
}

