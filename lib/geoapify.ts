// const API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_KEY

// const assertKey = () => {
//   if (!API_KEY) {
//     throw new Error("Missing Geoapify API key")
//   }
// }

// // 🔎 AUTOCOMPLETE
// export const fetchAutocomplete = async (text: string) => {
//   try {
//     assertKey()

//     const res = await fetch(
//       `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
//         text
//       )}&apiKey=${API_KEY}`
//     )

//     if (!res.ok) throw new Error("Autocomplete request failed")

//     const data = await res.json()
//     return data.features || []
//   } catch (err) {
//     console.error("fetchAutocomplete error:", err)
//     return []
//   }
// }

// // 📍 GEOCODE
// export const geocode = async (text: string) => {
//   try {
//     assertKey()

//     const res = await fetch(
//       `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
//         text
//       )}&apiKey=${API_KEY}`
//     )

//     if (!res.ok) throw new Error("Geocode failed")

//     const data = await res.json()
//     return data.features?.[0]
//   } catch (err) {
//     console.error("geocode error:", err)
//     return null
//   }
// }

// // 🚗 ROUTE
// export const getRoute = async (
//   from: [number, number],
//   to: [number, number]
// ) => {
//   try {
//     assertKey()

//     const res = await fetch(
//       `https://api.geoapify.com/v1/routing?waypoints=${from[0]},${from[1]}|${to[0]},${to[1]}&mode=drive&apiKey=${API_KEY}`
//     )

//     if (!res.ok) throw new Error("Route request failed")

//     const data = await res.json()
//     return data.features?.[0] || null
//   } catch (err) {
//     console.error("route error:", err)
//     return null
//   }
// }

// // 📍 REVERSE GEOCODE
// export const reverseGeocode = async (coords: [number, number]) => {
//   try {
//     assertKey()

//     const res = await fetch(
//       `https://api.geoapify.com/v1/geocode/reverse?lat=${coords[0]}&lon=${coords[1]}&apiKey=${API_KEY}`
//     )

//     if (!res.ok) throw new Error("Reverse geocode failed")

//     const data = await res.json()
//     return data.features?.[0] || null
//   } catch (err) {
//     console.error("reverseGeocode error:", err)
//     return null
//   }
// }


const API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_KEY

const assertKey = () => {
  if (!API_KEY) {
    throw new Error("Missing Geoapify API key")
  }
}

// 🔎 AUTOCOMPLETE
export const fetchAutocomplete = async (text: string) => {
  try {
    assertKey()
    const res = await fetch(
      `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
        text
      )}&apiKey=${API_KEY}`
    )
    if (!res.ok) throw new Error(`Autocomplete failed: ${res.status}`)
    const data = await res.json()
    return data.features || []
  } catch (err) {
    console.error("fetchAutocomplete error:", err)
    return []
  }
}

// 📍 GEOCODE
export const geocode = async (text: string) => {
  try {
    assertKey()
    const res = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
        text
      )}&apiKey=${API_KEY}`
    )
    if (!res.ok) throw new Error(`Geocode failed: ${res.status}`)
    const data = await res.json()
    return data.features?.[0] || null
  } catch (err) {
    console.error("geocode error:", err)
    return null
  }
}

// 🚗 ROUTE
export const getRoute = async (from: [number, number], to: [number, number]) => {
  try {
    assertKey()
    const res = await fetch(
      `https://api.geoapify.com/v1/routing?waypoints=${from[0]},${from[1]}|${to[0]},${to[1]}&mode=drive&apiKey=${API_KEY}`
    )
    if (!res.ok) throw new Error(`Route request failed: ${res.status}`)
    const data = await res.json()
    return data // return full response, not just one feature
  } catch (err) {
    console.error("route error:", err)
    return null
  }
}

// 📍 REVERSE GEOCODE
export const reverseGeocode = async (coords: [number, number]) => {
  try {
    assertKey()
    const res = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${coords[0]}&lon=${coords[1]}&apiKey=${API_KEY}`
    )
    if (!res.ok) throw new Error(`Reverse geocode failed: ${res.status}`)
    const data = await res.json()
    return data.features?.[0] || null
  } catch (err) {
    console.error("reverseGeocode error:", err)
    return null
  }
}
