import { choose } from '@/constants'

const ChooseUsComp = () => {
  return (
    <div className="flex flex-wrap items-start justify-center gap-10 text-center mb-12">
              {choose.map((item, index) => (
                <div
                  key={index}
                  className="max-w-[23rem] rounded-lg shadow-md p-3 overflow-hidden relative before:transition before:absolute before:inset-0 before:bg-white transition-transform hover:before:ease-linear before:origin-bottom before:scale-y-0 before:duration-300 hover:before:scale-y-100 hover:-translate-y-2"
                   
                >
                  {/* <Image 
                    src={item.imgURL}
                    alt='stars'
                    width={80}
                    height={80}
                    className="object-contain mx-auto mb-4 relative"
                  /> */}
                  {item.icon && (
                    <div className="flex justify-center mb-4 text-red-600 relative">
                      <item.icon size={40} />
                    </div>
                  )}
                  <h3 className="relative font-semibold text-gray-900 mb-4">
                    {item.label}
                  </h3>
                  <p className="relative text-gray-500 mb-4 leading-relaxed">
                    {item.subtext}
                  </p>
    
                </div>
              ))}
            </div>
  )
}

export default ChooseUsComp