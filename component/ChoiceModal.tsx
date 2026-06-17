"use client"

type Props = {
  onReserve: () => void
  onBook: () => void
  onClose: () => void
}

const ChoiceModal = ({ onReserve, onBook, onClose }: Props) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-black/80 text-white p-6 rounded-xl w-full max-w-md relative">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-6 text-center">
          How would you like to proceed?
        </h2>

        <div className="space-y-4">

          {/* RESERVE */}
          <button
            onClick={onReserve}
            className="w-full p-4 border border-green-500 rounded-lg text-left hover:bg-green-900/30 transition"
          >
            <p className="font-semibold">💳 Reserve now</p>
            <p className="text-sm text-gray-400">
              Secure your journey with payment options
            </p>
          </button>

          {/* BOOK */}
          <button
            onClick={onBook}
            className="w-full p-4 border border-blue-500 rounded-lg text-left hover:bg-blue-900/30 transition"
          >
            <p className="font-semibold">🗓️ Just book me</p>
            <p className="text-sm text-gray-400">
              No payment, reserve for that date
            </p>
          </button>

        </div>
      </div>
    </div>
  )
}

export default ChoiceModal