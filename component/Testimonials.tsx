import { testimonials } from '@/constants'
import Image from 'next/image'

const Testimonials = () => {
  return (
    <section 
      id='testimonial' 
      className="relative overflow-hidden py-16 bg-slate-100"
    >
      <div className="mx-auto px-6 md:px-10">
        <h1 className="text-3xl md:text-4xl text-center font-bold mb-12">
          Testimonials
        </h1>
        <div className="flex flex-wrap items-start justify-center gap-10 text-center">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className={`max-w-[23rem] rounded-lg shadow-md p-3 ${
                index === 0
                  ? "bg-blue-100"
                  : index === 1
                  ? "bg-pink-100"
                  : "bg-yellow-100"
              }`}
            >
              <p className="text-gray-500 mb-4 leading-relaxed">
                {item.subtext}
              </p>
              <h3 className="font-semibold text-gray-900 mb-4">
                {item.label}
              </h3>
              <Image 
                src={item.imgURL}
                alt='stars'
                width={80}
                height={80}
                className="object-contain mx-auto"
              />

            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials

