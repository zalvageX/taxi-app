"use client"

import React, { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import ContactUsForm from "./ContactUsForm"
import Image from "next/image"

gsap.registerPlugin(ScrollTrigger)

const ContactUs = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const slicesRef = useRef<(HTMLDivElement | null)[]>([])
  const formRef = useRef<HTMLDivElement | null>(null)
  const bgRef = useRef<HTMLDivElement | null>(null)
  const carRef = useRef<HTMLImageElement | null>(null)



  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      
      // SLICES
      gsap.from(
        slicesRef.current.filter((el): el is HTMLDivElement => el !== null),
        {
        opacity: 0,
        y: (i) => (i === 1 ? 80 : -80),
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      })

      gsap.to(carRef.current, {
      y: -10,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    })

      // BACKGROUND (RIGHT)
      gsap.from(bgRef.current, {
        x: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      })

      // FORM SCALE
      gsap.from(formRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 1,
        ease: "back.out(1.7)",
        delay: 0.3,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section 
      id="contactUs"
      ref={sectionRef} 
      className="flex flex-col bg-gradient-to-b from-gray-300 to-black md:flex-row min-h-screen"
    >
      {/* First div  */}
      {/* LEFT SLICES */}
      <div className="hidden mt-8 md:flex md:w-3/5 h-screen items-center">
        <div className="flex relative w-full h-[94%] px-10">
          <div
            className="flex-1 absolute md:bottom-[90px] lg:bottom-0"
          >
            <Image
                      ref={carRef}
                      src="/carContact.png"
                      alt="contact Car bg"
                      width={1200}
                      height={1200}
                      className="object-contain pointer-events-none select-none"
                    />
          </div>

          {/* Left */}
          {/* <div
            ref={(el) => { if (el) (slicesRef.current[0] = el)}}
            className="flex-1 bg-[url('/coLcar1.png')] bg-cover bg-center relative translate-y-4 will-change-transform"
          >
            <div className="absolute inset-0" />
          </div> */}

          {/* Middle */}
          {/* <div
            ref={(el) => { if (el) (slicesRef.current[1] = el)}}

            className="flex-1 bg-[url('/coLcar2.png')] bg-cover bg-center relative -translate-y-4 will-change-transform"
          >
            <div className="absolute inset-0" />
          </div> */}

          {/* Right */}
          {/* <div
            ref={(el) => { if (el) (slicesRef.current[2] = el)}}

            className="flex-1 bg-[url('/coLcar3.png')] bg-cover bg-center relative translate-y-2 will-change-transform"
          >
            <div className="absolute inset-0" />
          </div> */}

        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-full md:w-2/5 relative flex items-center justify-center p-8 h-screen">

        {/* Background */}
        <div
          ref={bgRef}
          // className="absolute inset-0 bg-[url('/chauffer@.png')] bg-cover bg-center"
        />

        {/* Overlay */}
        <div className="absolute bg-[url('/chauffer.png')]  bg-cover bg-center md:hidden inset-0" />

        {/* Form */}
        <div 
          ref={formRef}
          className="w-full"
        >
          <ContactUsForm />
        </div>
      </div>
    </section>
  )
}

export default ContactUs

