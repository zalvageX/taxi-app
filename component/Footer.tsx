import { FaFacebookF, FaInstagram, FaPhoneAlt } from "react-icons/fa"
import { FaMessage } from "react-icons/fa6"
import {  BsTwitterX } from "react-icons/bs";

const Footer = () => {
  return (
    <footer className="bg-[#1c1c1c] text-gray-300 py-10">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 flex flex-col md:flex-row justify-between gap-10">
        {/* Left: Logo + Socials */}
        <div className="flex flex-col items-start">
          <h2 className="text-3xl font-bold text-white mb-4">
            TAXI DE V<span className="text-red-600">O</span>C
          </h2>

          {/* Social icons */}
          <div className="flex items-center gap-4 mt-2">
            <a
              href="#"
              className="text-gray-400 hover:text-red-600 transition-colors duration-300 hover:animate-pulse"
              aria-label="Facebook"
            >
              <FaFacebookF size={20} />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-red-600 transition-colors duration-300 hover:animate-pulse"
              aria-label="Instagram"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-red-600 transition-colors duration-300 hover:animate-pulse"
              aria-label="Twitter X"
            >
              <BsTwitterX size={20} />
              {/* <FaTwitter size={20} /> */}
            </a>
          </div>
        </div>

        {/* Middle: Navigation links */}
        <div className="flex flex-wrap gap-16">
          <div className="space-y-3">
            <a href="#about" className="flex items-center gap-2 hover:text-red-600 transition hover:translate-x-3">
              <span className="font-extrabold">›</span> About us
            </a>
            <a href="#services" className="flex items-center gap-2 hover:text-red-600 transition hover:translate-x-3">
              <span className="font-extrabold">›</span> Our services
            </a>
            <a href="#chooseUs" className="flex items-center gap-2 hover:text-red-600 transition hover:translate-x-3">
              <span className="font-extrabold">›</span> Why choose us
            </a>
          </div>

          <div className="space-y-3">
            <a href="#schedule" className="flex items-center gap-2 hover:text-red-600 transition hover:translate-x-3">
              <span className="font-extrabold">›</span> Schedule a ride
            </a>
            <a href="#testimonial" className="flex items-center gap-2 hover:text-red-600 transition hover:translate-x-3">
              <span className="font-extrabold">›</span> Testimonials
            </a>
            <a href="#contactUs" className="flex items-center gap-2 hover:text-red-600 transition hover:translate-x-3">
              <span className="font-extrabold">›</span> Contact us
            </a>
          </div>
        </div>

        {/* Right: Contact info */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold mb-2">Contact US</h3>
          
          <a 
            href="tel:+324915266777" 
            className="flex items-center gap-2 hover:text-red-600 cursor-pointer"
          >
            <span><FaPhoneAlt /></span>
            <span>32 491 52 66777</span>
          </a>
          <p className="flex items-center gap-2 hover:text-red-600">
            <span className=""><FaMessage /> </span> taxidevoc@gmail.com
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm text-gray-400">
         &copy; 2026  De Vock, All Rights Reserved.{" "}
        <a href="#" className="text-red-600 hover:underline">
          Terms of use applied.
        </a>
      </div>
    </footer>
  )
}

export default Footer
