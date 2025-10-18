import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from '../contexts/UserContext'
import { TEXT } from '../constants/text'
import Layout from '../components/Layout'
import Card from '../components/Card'
import Button from '../components/Button'

const QuizMode: React.FC = () => {
  const navigate = useNavigate()
  const { currentUser } = useUserContext()

  return (
    <Layout
      title={TEXT.QUIZ_MODE}
      subtitle="Mod Kuiz - Uji Pengetahuan"
      currentUser={currentUser?.name}
      onUserClick={() => navigate('/')}
      showUser={true}
    >
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center py-12">
            <div className="text-6xl mb-6">🧩</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {TEXT.QUIZ_MODE}
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Mod Kuiz akan datang tidak lama lagi! Di sini anda boleh menguji pengetahuan dengan kuiz pendek 10 soalan.
            </p>
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">Ciri-ciri yang akan datang:</h3>
                <ul className="text-green-700 text-left space-y-1">
                  <li>• Pilih kategori kuiz yang diminati</li>
                  <li>• 10 soalan pilihan berganda</li>
                  <li>• Jawapan diacak setiap kali</li>
                  <li>• Maklum balas serta-merta</li>
                  <li>• Simpan markah ke papan markah</li>
                </ul>
              </div>
              <Button
                onClick={() => navigate('/')}
                variant="primary"
                className="mt-6"
              >
                Kembali ke Menu Utama
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

export default QuizMode
