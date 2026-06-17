"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { airport, chauffer, city, hourly } from "../constants"

gsap.registerPlugin(ScrollTrigger)

const OurServices = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // Animate each service block separately
      const blocks = sectionRef.current!.querySelectorAll<HTMLDivElement>(".service-block")

      blocks.forEach((block) => {
        const heading = block.querySelector("h3") as HTMLHeadingElement | null
        const textEls = block.querySelectorAll("p, li") as NodeListOf<HTMLElement>
        const image = block.querySelector(".service-image") as HTMLDivElement | null

        if (heading) {
          gsap.from(heading, {
            scrollTrigger: {
              trigger: block,
              start: "top 85%",
              once: true,
            },
            opacity: 0,
            y: -30,
            duration: 0.8,
            ease: "power2.out",
          })
        }

        if (textEls.length > 0) {
          gsap.from(textEls, {
            scrollTrigger: {
              trigger: block,
              start: "top 85%",
              once: true,
            },
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.15,
          })
        }

        if (image) {
          gsap.from(image, {
            scrollTrigger: {
              trigger: block,
              start: "top 85%",
              once: true,
            },
            opacity: 0,
            y: 40,
            scale: 0.9,
            duration: 1,
            ease: "power2.out",
          })
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative min-h-screen overflow-hidden py-16 bg-slate-100"
    >
      <div className="max-w-screen-xl mx-auto px-6 md:px-10">
        {/* Decorative background */}
                <div className="absolute top-0 left-0 opacity-40">
                  <Image
                    src="/servicesBg.svg"
                    alt="Background pattern"
                    width={450}
                    height={450}
                  />
                </div>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Our Services
        </h2>

        {/* Service 1 */}
        <div className="service-block flex flex-col md:flex-row items-center justify-between gap-10 mb-20">
          <div className="md:w-1/2 space-y-4 text-gray-700">
            <h3 className="text-xl font-semibold text-red-600">
              City-to-city rides
            </h3>
            <p>Your stress-free solution for long-distance rides with a professional driver.</p>
            <ul className="list-disc list-inside space-y-2">
              {city.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Image src={item.image} alt="Check" width={20} height={20} />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="service-image md:w-1/2 flex justify-center">
            <Image
              src="/cityImg.png"
              alt="City-to-city ride"
              width={500}
              height={300}
              className="rounded-lg shadow-lg object-cover"
            />
          </div>
        </div>

        {/* Service 2 */}
        <div className="service-block flex flex-col md:flex-row-reverse items-center justify-between gap-10 mb-20">
          <div className="md:w-1/2 space-y-4 text-gray-700">
            <h3 className="text-xl font-semibold text-red-600">Chauffeur Hailing</h3>
            <p>Enjoy the quality of a traditional chauffeur, with the convenience of riding within minutes.</p>
            <ul className="list-disc list-inside space-y-2">
              {chauffer.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Image src={item.image} alt="Check" width={20} height={20} />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="service-image md:w-1/2 flex justify-center">
            <Image
              src="/chaufImg.png"
              alt="Chauffeur hailing"
              width={500}
              height={300}
              className="rounded-lg shadow-lg object-cover"
            />
          </div>
        </div>

        {/* Service 3 */}
        <div className="service-block flex flex-col md:flex-row items-center justify-between gap-10 mb-20">
          <div className="md:w-1/2 space-y-4 text-gray-700">
            <h3 className="text-xl font-semibold text-red-600">Airport Transfer</h3>
            <p>With additional wait time and flight tracking in case of delays, our service makes every airport transfer a breeze.</p>
            <ul className="list-disc list-inside space-y-2">
              {airport.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Image src={item.image} alt="Check" width={20} height={20} />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="service-image md:w-1/2 flex justify-center">
            <Image
              src="/airportImg.png"
              alt="Airport transfer"
              width={500}
              height={300}
              className="rounded-lg shadow-lg object-cover"
            />
          </div>
        </div>

        {/* Service 4 */}
        <div className="service-block flex flex-col md:flex-row-reverse items-center justify-between gap-10">
          <div className="md:w-1/2 space-y-4 text-gray-700">
            <h3 className="text-xl font-semibold text-red-600">Hourly and Full-Day Hire</h3>
            <p>For hourly booking or daily chauffeur hire, we offer fair rates and prioritize comfort.</p>
            <ul className="list-disc list-inside space-y-2">
              {hourly.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Image src={item.image} alt="Check" width={20} height={20} />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="service-image md:w-1/2 flex justify-center">
            <Image
              src="/hourlyImg.png"
              alt="Hourly and full day hire"
              width={500}
              height={300}
              className="rounded-lg shadow-lg object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default OurServices
