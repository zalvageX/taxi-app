"use client"

import { useLayoutEffect, useRef } from "react"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const AboutUs = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null)

  // TOP section refs
  const headingRef = useRef<HTMLHeadingElement | null>(null)
  const topImageRef = useRef<HTMLDivElement | null>(null)
  const topTextRefs = useRef<(HTMLElement)[]>([])

  // BOTTOM section refs
  const bottomSectionRef = useRef<HTMLDivElement | null>(null)
  const bottomImageRef = useRef<HTMLDivElement | null>(null)
  const bottomTextRefs = useRef<(HTMLElement)[]>([])

  const addToTopTextRefs = (el: HTMLElement | null) => {
    if (el && !topTextRefs.current.includes(el)) {
      topTextRefs.current.push(el)
    }
  }

  const addToBottomTextRefs = (el: HTMLElement | null) => {
    if (el && !bottomTextRefs.current.includes(el)) {
      bottomTextRefs.current.push(el)
    }
  }

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 🔝 TOP SECTION ANIMATION
      const topTL = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          once: true,
          // markers: true,
        },
      })

      topTL
        .from(headingRef.current, {
          opacity: 0,
          y: -50,
          duration: 1,
          ease: "power2.out",
        })
        .from(
          topImageRef.current,
          {
            opacity: 0,
            y: 50,
            scale: 0.9,
            duration: 1,
            ease: "power2.out",
          },
          "-=0.5"
        )
        .from(
          topTextRefs.current,
          {
            opacity: 0,
            y: 30,
            duration: 1,
            stagger: 0.2,
            ease: "power2.out",
          },
          "-=0.5"
        )

      // 🔻 BOTTOM SECTION ANIMATION
      const bottomTL = gsap.timeline({
        scrollTrigger: {
          trigger: bottomSectionRef.current,
          start: "top 85%",
          once: true,
          // markers: true,
        },
      })

      bottomTL
        .from(bottomImageRef.current, {
          opacity: 0,
          y: 50,
          scale: 0.9,
          duration: 1,
          ease: "power2.out",
        })
        .from(
          bottomTextRefs.current,
          {
            opacity: 0,
            y: 30,
            duration: 1,
            stagger: 0.2,
            ease: "power2.out",
          },
          "-=0.5"
        )

      // Fix layout shifts
      ScrollTrigger.refresh()
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen bg-slate-200 overflow-hidden py-16"
    >
      <div className="max-w-screen-xl mx-auto px-6 md:px-10">
        {/* Heading */}
        <h1
          ref={headingRef}
          className="font-bold text-4xl md:text-5xl text-center mb-12"
        >
          About Us
        </h1>

        {/* 🔝 TOP SECTION */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-20">
          <div className="md:w-1/2 space-y-4 text-gray-700">
            <h2 
              ref={addToTopTextRefs}
             className="text-2xl font-semibold"
            >
              Reliable Rides by De Voc
            </h2>
            <p ref={addToTopTextRefs}>
              Rides by De Voc is a trusted, personal taxi service based entirely
              in Belgium and operated solely by De Voc. With a passion for safe
              and comfortable travel, De Voc provides a dedicated, one-on-one
              service across the country — from the bustling streets of Brussels
              to the historic lanes of Bruges, Antwerp, Ghent, and beyond.
            </p>
            <h3 className="text-xl font-semibold mt-4" ref={addToTopTextRefs}>
              Why Choose De Voc?
            </h3>

            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li ref={addToTopTextRefs}>Personalized service with De Voc as your dedicated driver</li>
              <li ref={addToTopTextRefs}>Clean, comfortable vehicles for a premium experience</li>
              <li ref={addToTopTextRefs}>Transparent pricing with no hidden fees</li>
              <li ref={addToTopTextRefs}>Available for airport transfers, city rides, and long-distance trips</li>
            </ul>
            <p ref={addToTopTextRefs} className="mt-4">
              Taxi De Voc is driven by commitment, professionalism, and a
              genuine desire to make every ride enjoyable. When you book with
              us, you’re not just getting a taxi — you’re getting De Voc’s full
              attention and expertise.
            </p>
          </div>

          <div ref={topImageRef} className="md:w-1/2 flex justify-center">
            <Image src="/about.png" alt="Driver" width={500} height={500} />
          </div>
        </div>

        {/* 🔻 BOTTOM SECTION */}
        <div
          ref={bottomSectionRef}
          className="flex flex-col md:flex-row items-center justify-between gap-10"
        >
          <div ref={bottomImageRef} className="md:w-1/2 flex justify-center">
            <Image src="/travel.png" alt="Travel" width={400} height={400} />
          </div>

          <div className="md:w-1/2 space-y-6 text-gray-700">
            <h3  
              ref={addToBottomTextRefs}
              className="text-xl font-semibold"  
            >
              Airport Transfers
            </h3>
            <p 
              ref={addToBottomTextRefs}
            >
              Whether you’re catching a flight or arriving from one, our 
              airport transfer service ensures a smooth, stress-free experience. 
              De Voc will be there to pick you up or drop you off on time, 
              with plenty of space for your luggage and a comfortable ride 
              to or from the airport.
            </p>

            <h3 
              ref={addToBottomTextRefs}
              className="text-xl font-semibold"
            >
              Long Distance
            </h3>
            <p ref={addToBottomTextRefs}>
              Planning a trip beyond city limits? Our long-distance service
              offers comfortable, private rides to out-of-town destinations.
              Enjoy spacious vehicles, courteous drivers, and flexible
              scheduling — ideal for weekend getaways or business travel.
            </p>

            <h3 
              ref={addToBottomTextRefs} 
              className="text-xl font-semibold"
            >
              City Rides
            </h3>
            <p ref={addToBottomTextRefs}>
              Need a quick ride across town? Our city ride service is perfect
              for daily commutes, errands, or spontaneous outings. With fast
              response times and flexible routes, we make navigating the city
              simple and efficient..
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutUs

