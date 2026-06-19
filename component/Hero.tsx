"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import BookForm from "./BookFormWrapper"

gsap.registerPlugin(ScrollTrigger)

const Hero = () => {
  const heroRef = useRef<HTMLDivElement | null>(null)
  const textRef = useRef<HTMLDivElement | null>(null)
  const carRef = useRef<HTMLImageElement | null>(null)
  const ctaRef = useRef<HTMLButtonElement | null>(null)
  const carWrapperRef = useRef<HTMLDivElement | null>(null)

 useEffect(() => {
  const ctx = gsap.context(() => {
    const tl = gsap.timeline()

    // TEXT REVEAL
    tl.from(textRef.current?.children || [], {
      opacity: 0,
      y: 40,
      duration: 1,
      ease: "power3.out",
      stagger: 0.2,
    })

    // CAR ENTER (slightly overlaps text)
    tl.from(
      carRef.current,
      {
        x: 120,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      },
      // "-=0.6"
    )

    
    // CTA POP (after text finishes)
    tl.fromTo(
      ctaRef.current,
      {
        scale: 0.85,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: "back.out(1.7)",
        clearProps: "transform,opacity",
      },
      "-=0.3"
    )
    
    // CAR FLOAT LOOP (independent, smooth)
    // gsap.to(carRef.current, {
    //   y: -10,
    //   duration: 3,
    //   repeat: -1,
    //   yoyo: true,
    //   ease: "sine.inOut",
    // })
    
    gsap.to(carRef.current, {
      y: -10,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    })

    // SCROLL (on wrapper ONLY)
    gsap.to(carWrapperRef.current, {
      x: 200,
      y: 60,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
      },
    })

    // CTA SUBTLE PULSE (idle animation)
    gsap.to(ctaRef.current, {
      scale: 1.04,
      duration: 1.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: tl.duration(), // starts AFTER intro animation
    })

    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative overflow-hidden bg-[url('/heroBg.png')] bg-cover bg-center bg-no-repeat min-h-screen"
    >
      {/* DARK GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/30 z-0" />

      {/* GLOW ORB (adds depth) */}
      <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-red-600/30 blur-[120px] rounded-full" />

      {/* CAR IMAGE */}
      <div ref={carWrapperRef} className="absolute bottom-[-20px] right-[-40px] w-[120%] md:w-[75%]">
        <Image
          ref={carRef}
          // src="/heroCarBg.png"
          src="/heroBgTwo.png"
          alt="hero Car bg"
          width={1200}
          height={1200}
          className="object-contain pointer-events-none select-none"
        />
      </div>
     

      {/* CONTENT */}
      <div className="flex flex-col md:flex-row z-10 max-w-screen-xl mx-auto items-center justify-between px-6 py-16 md:py-20 gap-12">

        {/* LEFT TEXT */}
        <div
          ref={textRef}
          className="relative z-20 max-w-[20rem] md:max-w-lg text-white space-y-8"
        >
          <h1 className="text-5xl md:text-5xl lg:text-7xl font-bold leading-tight">
            Your City{" "}
            <span className="text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.7)]">
              Your
            </span>{" "}
            Ride
          </h1>

          <p className="text-lg md:text-xl text-slate-300">
            Discover an experience tailored to your needs with affordable rates
            and a driver{" "}
            <span className="text-red-500 font-semibold">you can trust.</span>
          </p>

          {/* CTA */}
          
          <button
            ref={ctaRef}
            onClick={() => {
              document.getElementById("schedule")?.scrollIntoView({ behavior: "smooth" })
            }}
            className="relative z-30 opacity-100 overflow-hidden group h-12 border border-red-700 rounded-lg text-base px-10 md:px-16 w-full transition-all duration-300 ease-in-out hover:border-red-500 hover:shadow-[0_0_25px_rgba(220,38,38,0.5)]"
          >

            {/* shimmer */}
            <span className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

            {/* sliding text */}
            <div className="relative z-10 transition-transform duration-300 group-hover:-translate-y-12">
              <div className="h-12 flex items-center justify-center text-slate-100">
                Schedule a ride
              </div>
              <div className="h-12 flex items-center justify-center text-white">
                Book one now
              </div>
            </div>
          </button>
          
          
        </div>

        {/* RIGHT FORM */}

        <div className="relative z-10 md:w-[500px] w-auto">
          {/* <BookingForm /> */}
          <BookForm />
        </div>
      </div>
    </section>
  )
}

export default Hero

