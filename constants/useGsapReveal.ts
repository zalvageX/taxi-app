"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const AboutUs = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const headingRef = useRef<HTMLHeadingElement | null>(null)
  const imageRefs = useRef<HTMLDivElement[]>([])
  // const textRefs = useRef<HTMLDivElement[]>([])
const textRefs = useRef<(HTMLParagraphElement | HTMLHeadingElement | HTMLLIElement)[]>([])
  // ✅ Prevent duplicates in refs
  const addToImageRefs = (el: HTMLDivElement | null) => {
    if (el && !imageRefs.current.includes(el)) {
      imageRefs.current.push(el)
    }
  }

 

  // Reset before render to avoid stale refs
  textRefs.current = []

  const addToTextRefs = (el: HTMLParagraphElement | HTMLHeadingElement | HTMLLIElement | null) => {
    if (el && !textRefs.current.includes(el)) {
      textRefs.current.push(el)
    }
  }

  // parallax background ref (optional, for future use)
  const bgRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    // ✅ GSAP context for cleanup
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      })

      // Heading animation
      tl.from(headingRef.current, {
        opacity: 0,
        y: -50,
        duration: 1,
        ease: "power2.out",
      })
        // Images animation
        .from(
          imageRefs.current,
          {
            opacity: 0,
            y: 50,
            scale: 0.9,
            duration: 1.2,
            ease: "power2.out",
            stagger: 0.3,
          },
          "-=0.5"
        )
        // Text animation
        .from(
          textRefs.current,
          {
            opacity: 0,
            y: 30,
            duration: 1,
            ease: "power2.out",
            stagger: 0.2,
          },
          "-=0.5"
        )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

}