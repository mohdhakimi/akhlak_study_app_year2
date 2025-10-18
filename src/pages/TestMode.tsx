import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from '../contexts/UserContext'
import { TEXT } from '../constants/text'
import Layout from '../components/Layout'
import Card from '../components/Card'
import Button from '../components/Button'

const TestMode: React.FC = () => {
  const navigate = useNavigate()
  const { currentUser } = useUserContext()

  return (
    <Layout
      title={TEXT.TEST_MODE}
      subtitle="Mod Ujian - Ujian Lengkap"
      currentUser={currentUser?.name}
      onUserClick={() => navigate('/')}
      showUser={true}
    >
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center py-12">
            <div className="text-6xl mb-6">📝</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {TEXT.TEST_MODE}
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Mod Ujian akan datang tidak lama lagi! Di sini anda boleh mengambil ujian lengkap 30 soalan dari semua topik.
            </p>
            <div className="space-y-4">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-800 mb-2">Ciri-ciri yang akan datang:</h3>
                <ul className="text-purple-700 text-left space-y-1">
                  <li>• 30 soalan dari semua kategori</li>
                  <li>• Soalan dipilih secara rawak</li>
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

export default TestMode
