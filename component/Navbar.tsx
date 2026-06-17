

"use client"

import { NAV_LINKS } from "@/constants"
import Link from "next/link"
import Image from "next/image"
import MenuSvg from "./Menu"
import { useState, useEffect } from "react"
import Portal from "./Portal"
// import { useRouter, usePathname } from "next/navigation"
// import { useLocale } from "next-intl"
// import { useTranslations } from "next-intl"


const Navbar = () => {
  const [openNavigation, setOpenNavigation] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  // const [language, setLanguage] = useState("EN")
  // const [openLang, setOpenLang] = useState(false)
  
  // const LANGUAGES = ["EN", "DE", "FR", "ES"]
  // const router = useRouter()
  // const pathname = usePathname()
  // const currentLocale = useLocale()
  
  // const t = useTranslations("nav")
  
  // const changeLanguage = (lang: string) => {
  //   document.cookie = `NEXT_LOCALE=${lang}; path=/`
  //   window.location.reload()
  // }

  const toggleNavigation = () => setOpenNavigation((prev) => !prev)

  // Scroll lock
  useEffect(() => {
    document.body.style.overflow = openNavigation ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [openNavigation])

  // Scroll background
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Track active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "services"]
      let current = "home"

      sections.forEach((id) => {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            current = id
          }
        }
      })

      setActiveSection(current)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // useEffect(() => {
  //   const handleClickOutside = (e: MouseEvent) => {
  //     if (!(e.target as HTMLElement).closest(".lang-dropdown")) {
  //       setOpenLang(false)
  //     }
  //   }

  //   document.addEventListener("click", handleClickOutside)
  //   return () => document.removeEventListener("click", handleClickOutside)
  // }, [])

  return (
    <nav
      className={`sticky top-0 z-50 border-b border-white/10 transition-all duration-500
      ${scrolled ? "backdrop-blur-md bg-white/10" : "bg-gradient-to-b from-orange-700 to-red-950"}`}
    >
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-6 py-2">

        {/* Logo */}
        <Link href="#home">
          <div className="text-2xl font-bold flex-1">
            <span className="text-white">
              TAXI DE V<span className="text-red-600">O</span>C
            </span>
            <span className="text-amber-50 ml-2">{'{ Belgium }'}</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-16">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`relative pb-1 font-bold transition-colors 
                ${activeSection === link.key ? "text-red-500 after:w-full" : "text-white after:w-0"} 
                hover:text-red-500 hover:after:w-full
                after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:bg-red-500 after:transition-all after:duration-300`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Language dropdown */}

        {/* <div className="relative hidden md:block lang-dropdown">
          <button
            onClick={() => setOpenLang((prev) => !prev)}
            className="text-white font-bold px-3 py-2 hover:text-red-500 transition"
          >
            {language} ▾
          </button>

          <div
            className={`absolute right-0 mt-2 w-28 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 shadow-lg transition-all duration-300
            ${openLang ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}`}
          >
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  changeLanguage(lang.toLowerCase())
                  setOpenLang(false)
                }}
                className={`block w-full text-left px-4 py-2 text-sm transition
                ${language === lang ? "text-red-500" : "text-white"} 
                hover:text-red-500`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div> */}

        {/* Desktop Button */}
        <div className="hidden md:block">
          <button 
            onClick={() => {
              document.getElementById("schedule")?.scrollIntoView({ behavior: "smooth" })
            }}
            className="flex items-center gap-2 text-white px-6 py-2 font-bold transition hover:text-red-500"
          >
            Book now
            <Image src="/SignIn.svg" alt="sign in" width={20} height={20} />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={toggleNavigation} className="md:hidden ml-auto z-50">
          <MenuSvg openNavigation={openNavigation} />
        </button>
      </div>

      {/* Mobile Menu */}
      <Portal>
        <div
          className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ease-in-out
          ${openNavigation 
            ? "opacity-100 visible pointer-events-auto translate-y-0" 
            : "opacity-0 -translate-y-10 invisible pointer-events-none"}
          bg-[url('/dropdown.png')] bg-cover bg-center`}
        >
          <div className="flex flex-col items-center justify-center h-full space-y-12">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpenNavigation(false)}
                className={`text-2xl font-bold transition 
                ${activeSection === link.key ? "text-red-500" : "text-white"} 
                hover:text-red-500`}
              >
                {link.label}
              </Link>
            ))}

            {/* Language dropdown */}
            {/* <div className="flex flex-col items-center gap-4">
              <span className="text-white text-base font-semibold">LANGUAGE</span>

              <div className="flex gap-4">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      changeLanguage(lang.toLowerCase())
                      setOpenNavigation(false)
                    }}
                    className={`px-4 py-2 rounded-full border transition
                    ${language === lang 
                      ? "bg-red-700 text-white border-red-700" 
                      : "text-white border-white/30 hover:border-red-500 hover:text-red-500"}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div> */}
            <button className="flex items-center gap-2 text-white px-6 py-3 text-xl font-bold hover:text-red-500">
              Book now
              <Image src="/SignIn.svg" alt="sign in" width={20} height={20} />
            </button>
          </div>
        </div>
      </Portal>
    </nav>
  )
}

export default Navbar




