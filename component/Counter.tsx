"use client"

import { useEffect, useRef, useState } from "react"
import { statistics } from "@/constants"
import Image from "next/image"
import CountUp from "react-countup"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const Counter = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const [startCount, setStartCount] = useState(false)

  useEffect(() => {
    if (sectionRef.current) {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%", // when section enters viewport
        once: true,       // only run once
        onEnter: () => setStartCount(true),
      })
    }
  }, [])

  return (
    <section 
      ref={sectionRef}
      className="relative w-full flex flex-col items-center justify-center py-10 px-6 md:px-16"
    >
      {/* 🔴 Top Right Banner */}
      <div className="absolute -top-6 md:right-14 bg-red-600 text-white px-8 py-2 shadow-2xl rounded-md">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <div className="flex items-center gap-3">
            <Image src="/clock.svg" alt="Clock icon" width={30} height={30} />
            <div>
              <p className="text-base">24/7 availability</p>
              <p className="font-thin text-[12px] text-slate-300">
                For your peace of mind
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Image src="/car.svg" alt="Car icon" width={50} height={50} />
            <div>
              <p className="text-base">Professional expertise</p>
              <p className="font-thin text-[12px] text-slate-300">
                Specialized skills in a profession
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 🧮 Stats Section */}
      <div className="relative flex flex-col items-center w-full mt-20">
        <div className="flex flex-wrap bg-slate-200 rounded-2xl py-4 max-w-[10rem] sm:max-w-[20rem] md:max-w-[60rem] md:px-10 md:py-10 justify-between gap-6 md:gap-2">
          {statistics.map((stat, index) => (
            <div
              key={stat.label}
              className={`flex-1 flex-col items-center text-center px-4 md:px-6 w-full sm:w-1/2 md:w-auto ${
                index !== statistics.length - 1 ? "md:border-r-4 md:border-red-500" : ""
              }`}
            >
              <p className="text-3xl md:text-3xl lg:text-4xl font-semibold text-gray-800 inline-block">
                {startCount && (
                  <CountUp start={0} end={Number(stat.value) || 0} duration={2} />
                )}{" "}
                {stat.tag}
              </p>
              <p className="text-gray-600 uppercase tracking-wide text-xs sm:text-sm md:text-base mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* 👔 Person Image Section */}
        <div className="absolute lg:right-[1rem] right-[-3rem] sm:right-[2rem] md:right-[-4rem] bottom-[-3rem] justify-center md:justify-end mt-10 md:mt-16 max-w-6xl">
          <Image
            src="/contImg.svg"
            alt="Professional driver"
            width={250}
            height={250}
            className=" flex-1object-contain h-[350px] w-[350px]"
          />
        </div>
      </div>
    </section>
  )
}

export default Counter
