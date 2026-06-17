// const API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_KEY

// export async function geocode(place: string) {
//   const res = await fetch(
//     `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
//       place
//     )}&apiKey=${API_KEY}`
//   )

//   const data = await res.json()

//   const coords = data.features?.[0]?.geometry?.coordinates

//   if (!coords) throw new Error("No coordinates found")

//   return coords as [number, number] // [lon, lat]
// }

// export async function getRoute(
//   pickup: [number, number],
//   dropoff: [number, number]
// ) {
//   const url = `https://api.geoapify.com/v1/routing?waypoints=${pickup.join(",")}|${dropoff.join(",")}&mode=drive&format=geojson&apiKey=YOUR_API_KEY`

//   console.log("ROUTE URL:", url)

//   const res = await fetch(url)
//   const data = await res.json()

//   console.log("ROUTE RESPONSE:", data)

//   if (!data.features || data.features.length === 0) {
//     throw new Error("No route found")
//   }

//   return data.features[0].geometry.coordinates
// }