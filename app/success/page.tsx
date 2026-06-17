"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // redirect back to app flow
    setTimeout(() => {
      router.push("/")
    }, 2000)
  }, [])

  return (
    <div className="h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold">Payment Successful 🎉</h1>
    </div>
  )
}