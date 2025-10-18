import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from '../contexts/UserContext'
import { TEXT } from '../constants/text'
import Layout from '../components/Layout'
import Card from '../components/Card'
import Button from '../components/Button'

const StudyMode: React.FC = () => {
  const navigate = useNavigate()
  const { currentUser } = useUserContext()

  return (
    <Layout
      title={TEXT.STUDY_MODE}
      subtitle="Mod Belajar - Baca dan Pelajari"
      currentUser={currentUser?.name}
      onUserClick={() => navigate('/')}
      showUser={true}
    >
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center py-12">
            <div className="text-6xl mb-6">📚</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {TEXT.STUDY_MODE}
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Mod Belajar akan datang tidak lama lagi! Di sini anda boleh membaca dan mempelajari nota-nota penting tentang Akhlak.
            </p>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Ciri-ciri yang akan datang:</h3>
                <ul className="text-blue-700 text-left space-y-1">
                  <li>• Pilih topik yang ingin dipelajari</li>
                  <li>• Baca nota dalam bahagian kecil</li>
                  <li>• Navigasi mudah dengan butang Seterusnya/Sebelum</li>
                  <li>• Petunjuk kemajuan pembelajaran</li>
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

export default StudyMode
