import Image from "next/image"

type RideStatusProps = {
  driver: {
    name: string
    avatar: string
    verified: boolean
  }
  car: {
    model: string
    color: string
    plate: string
  }
  pickup: string
  dropoff: string
  price: number
  onClose: () => void
}

const RideStatusModal = ({ driver, car, pickup, dropoff, price, onClose }: RideStatusProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-md p-6 text-gray-900 relative shadow-xl">
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-gray-500 px-2 py-1 hover:bg-gray-200 rounded-full transition text-sm">
          ✕
        </button>
        <div className="flex items-center mb-4 border-b border-gray-100 pb-4">
          <div> 
            <h2 className="text-lg font-bold text-black/80 mb-1">Arriving in 5 mins</h2>
            <p className="text-sm text-gray-500">{car.model}, {car.color} [{car.plate}]</p>
          </div>
          <Image  
            src="/heroCarBg.png" 
            alt="car" 
            width={90} 
            height={90} 
            className="ml-auto"
          />
        </div>

        <div className="flex items-center justify-between mt-2 mb-1 bg-slate-100 p-4 rounded-xl">
          <div className="text-center gap-2 flex flex-col">
            <Image 
              src={driver.avatar} 
              alt={driver.name} 
              width={60} 
              height={60} 
              className="rounded-full"
            />
            <div>
              <p className="text-xs text-gray-400">DRIVER</p>
              <p className="font-medium">{driver.name}</p>
              {/* {driver.verified && <span className="text-xs text-green-600">✔ Verified</span>} */}
            </div>
          </div>
          <div 
            onClick={() => window.location.href = "tel:+324915266777"}
            className="gap-2 max-w-[70] cursor-pointer flex flex-col items-center"
          >
              <Image 
                src="/phoneBook.png" 
                alt="rating" 
                width={70} 
                height={70} 
                />
              <p className="text-sm text-center font-semibold text-gray-500">Reach Devoc</p>
          </div>
          <div
            onClick={() => window.open("https://wa.me/324915266777", "_blank")}
            className="gap-2 max-w-[70] cursor-pointer flex flex-col items-center"
          >
            <Image 
              src="/whatsapp.png" 
              alt="whatsapp" 
              width={50} 
              height={50}
            />
            <p className="text-sm text-center font-semibold text-gray-500">
              Chat Devoc
            </p>
          </div>

        </div>

        <div className="pt-3 space-y-1 text-sm text-black/80">
          <p><strong>Pickup:</strong> {pickup}</p>
          <p><strong>Dropoff:</strong> {dropoff}</p>
        </div>

        <div className="mt-4  p-4 rounded-xl flex justify-between items-center bg-red-100">
          <div className="flex items-center gap-2 text-black/80">
            <span className="bg-gray-100 p-2 rounded">💳 Fee</span>
            <p className="font-bold">€ {price}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RideStatusModal
