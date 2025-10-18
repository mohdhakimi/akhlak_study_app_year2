import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from '../contexts/UserContext'
import { TEXT } from '../constants/text'
import Layout from '../components/Layout'
import Card from '../components/Card'
import Button from '../components/Button'

const Leaderboard: React.FC = () => {
  const navigate = useNavigate()
  const { currentUser } = useUserContext()

  return (
    <Layout
      title={TEXT.LEADERBOARD}
      subtitle="Papan Markah - Lihat Pencapaian"
      currentUser={currentUser?.name}
      onUserClick={() => navigate('/')}
      showUser={true}
    >
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center py-12">
            <div className="text-6xl mb-6">🏆</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {TEXT.LEADERBOARD}
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Papan Markah akan datang tidak lama lagi! Di sini anda boleh melihat markah tertinggi dan pencapaian anda.
            </p>
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">Ciri-ciri yang akan datang:</h3>
                <ul className="text-yellow-700 text-left space-y-1">
                  <li>• Lihat Top 10 markah tertinggi</li>
                  <li>• Filter mengikut kategori (Kuiz/Ujian)</li>
                  <li>• Susun mengikut markah tertinggi</li>
                  <li>• Tunjukkan nama, markah, dan tarikh</li>
                  <li>• Highlight markah anda sendiri</li>
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

export default Leaderboard
