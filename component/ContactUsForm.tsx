"use client"

import { useState } from "react"



const ContactUsForm = () => {
    
      const [isSuccess, setIsSuccess] = useState(false)
      const [ formData, setFormData ] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
      })
      const [errors, setErrors] = useState<{ [key: string]: string}>({})
      const [isSubmitting, setIsSubmitting] = useState(false)
    
      // Handle input on value and textarea
      const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value}))
      }
    
      // From validation and errors logic 
      const validate = () => {
      const newErrors: { [key: string]: string } = {}
    
        if (!formData.name.trim()) {
          newErrors.name = "Name is required"
        }
    
        if (!formData.email.trim()) {
          newErrors.email = "Email is required"
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
          newErrors.email = "Invalid email format"
        }
    
        if (!formData.phone.trim()) {
          newErrors.phone = "Phone number is required"
        }
    
        if (!formData.message.trim()) {
          newErrors.message = "Message cannot be empty"
        }
    
        return newErrors
      }

        const [shakeKey, setShakeKey] = useState(0)
        // Trigger shake animation on error
    
      // Handle submit 
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const validationErrors = validate()
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        setErrors({})
        setIsSubmitting(true)

        try {
            const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
            })

            const data = await res.json()

            if (data.success) {
            setIsSuccess(true)
            setFormData({ 
                name: "", 
                email: "", 
                phone: "", 
                message: "" 
            })
            setTimeout(() => setIsSuccess(false), 2000)
            } else {
            setErrors({ api: "Could not send message. Please try again." })
            }
        } catch (err) {
            console.error(err)
            setErrors({ api: "Server error. Please try again." })
        } finally {
            setIsSubmitting(false)
        }
        }

  return (
    <div
          
          className="relative z-10 bg-white/10 backdrop-blur-lg rounded-xl p-8 w-full max-w-md shadow-xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Get in touch</h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Full name */}
            <div>
              <label className="block text-sm font-semibold text-gray-200">
                Full name
              </label>
              <input
              key={`name-${shakeKey}`} // Reset animation on error
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter name"
                
                className={`mt-1 w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-400 
                border border-transparent focus:border-black focus:bg-black/60 
                focus:ring-2 focus:ring-black outline-none transition-all duration-300 ${errors.name ? "input-error" : ""}`}
              />
              {/* {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>} */}
            </div>

            {/* Email & Phone */}
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                key={`email-${shakeKey}`}
                className={`flex-1 min-w-0 mt-1 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-400 
                border border-transparent focus:border-black focus:bg-black/60 
                focus:ring-2 focus:ring-black outline-none transition-all duration-300 ${errors.email ? "input-error" : ""}`}
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+32 4xx xx xx xx"
                key={`phone-${shakeKey}`}
                className={`flex-1 min-w-0 mt-1 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-400 
                border border-transparent focus:border-black focus:bg-black/60 
                focus:ring-2 focus:ring-black outline-none transition-all duration-300 ${errors.phone ? "input-error" : ""}`}
              />
            </div>

            {/* Message */}
            <textarea
            name="message"
              placeholder="Enter message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              key={`message-${shakeKey}`}
              className={`w-full mt-1 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-400 
              border border-transparent focus:border-black focus:bg-black/60 
              focus:ring-2 focus:ring-black outline-none transition-all duration-300 resize-none ${errors.message ? "input-error" : ""}`}
            />
            {/* {errors.message && <p className="text-red-400 text-xs mt-[-20px]">{errors.message}</p>} */}

            {/* Button */}
            
            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className="w-full bg-white overflow-hidden relative text-black font-semibold rounded-lg px-6 py-3 
                before:transition before:absolute before:inset-0 before:bg-gray-400
                before:origin-bottom before:scale-y-0 before:duration-300 hover:before:scale-y-100
                disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <span className="relative flex items-center justify-center">

                 {isSubmitting ? (
                  // 🔄 Spinner
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Please wait...
                    </span>

                    ) : isSuccess ? (
                      // ✅ Checkmark
                      <span className="flex items-center gap-2">
                        Message sent!
                        <svg
                        className="w-6 h-6 text-green-700"
                        viewBox="0 0 24 24"
                        fill="none"
                        >
                        <path
                            d="M5 13l4 4L19 7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                            strokeDasharray: 24,
                            strokeDashoffset: 24,
                            animation: "dash 0.5s ease-out forwards",
                            }}
                        />
                        </svg>
                      </span>

                  ) : (
                  "Contact us"
                )}

              </span>
            </button>
            {/* {isSuccess && (
              <div className="mt-4 text-center text-green-400 font-semibold animate-bounce">
                ✅ Message sent!
              </div>
            )} */}
          </form>
        </div>
  )
}

export default ContactUsForm

