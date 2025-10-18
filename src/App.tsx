import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary-800 mb-4">
          Akhlak Tahun Dua KSRI
        </h1>
        <p className="text-lg text-primary-600 mb-8">
          Aplikasi Pembelajaran Interaktif
        </p>
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Selamat Datang!
          </h2>
          <p className="text-gray-600 mb-6">
            Aplikasi ini sedang dalam pembangunan. Fasa 0 telah selesai!
          </p>
          <button
            onClick={() => setCount(count => count + 1)}
            className="btn btn-primary"
          >
            Klik untuk menguji: {count}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
