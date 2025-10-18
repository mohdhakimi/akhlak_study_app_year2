import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from '../contexts/UserContext'
import { TEXT } from '../constants/text'
import Layout from '../components/Layout'
import Card from '../components/Card'
import Button from '../components/Button'
import { cn } from '../utils/cn'

const MainMenu: React.FC = () => {
  const navigate = useNavigate()
  const { currentUser, openUserSelectionModal } = useUserContext()

  const menuItems = [
    {
      id: 'study',
      title: TEXT.STUDY_MODE,
      description: 'Baca dan pelajari nota-nota penting',
      icon: '📚',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      route: '/study'
    },
    {
      id: 'quiz',
      title: TEXT.QUIZ_MODE,
      description: 'Uji pengetahuan dengan kuiz pendek',
      icon: '🧩',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      route: '/quiz'
    },
    {
      id: 'test',
      title: TEXT.TEST_MODE,
      description: 'Ujian lengkap 30 soalan',
      icon: '📝',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      route: '/test'
    },
    {
      id: 'leaderboard',
      title: TEXT.LEADERBOARD,
      description: 'Lihat markah tertinggi',
      icon: '🏆',
      color: 'bg-yellow-500',
      hoverColor: 'hover:bg-yellow-600',
      route: '/leaderboard'
    }
  ]

  const handleMenuClick = (route: string) => {
    navigate(route)
  }

  const handleUserClick = () => {
    openUserSelectionModal()
  }

  return (
    <Layout
      title={TEXT.APP_TITLE}
      subtitle={TEXT.APP_SUBTITLE}
      currentUser={currentUser?.name}
      onUserClick={handleUserClick}
      showUser={true}
    >
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-primary-100 rounded-full mb-6">
              <span className="text-4xl">🐾</span>
            </div>
            <h1 className="text-4xl font-bold text-primary-800 mb-4">
              {currentUser ? `Selamat Datang, ${currentUser.name}!` : TEXT.WELCOME}
            </h1>
            <p className="text-xl text-primary-600 max-w-2xl mx-auto">
              Mari belajar Akhlak dengan cara yang menyeronokkan! Pilih mod pembelajaran yang anda suka.
            </p>
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {menuItems.map((item) => (
              <Card
                key={item.id}
                className={cn(
                  'group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl',
                  'border-0 overflow-hidden'
                )}
                onClick={() => handleMenuClick(item.route)}
              >
                <div className={cn(
                  'h-32 flex flex-col items-center justify-center text-white relative overflow-hidden',
                  item.color,
                  item.hoverColor
                )}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-white opacity-20"></div>
                    <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-white opacity-30"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white opacity-10"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10 text-center">
                    <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm opacity-90">
                      {item.description}
                    </p>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </div>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleUserClick}
              variant="outline"
              className="min-w-[200px]"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {currentUser ? TEXT.SWITCH_USER : TEXT.SELECT_USER}
            </Button>
            
            <Button
              onClick={() => window.location.reload()}
              variant="secondary"
              className="min-w-[200px]"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Muat Semula
            </Button>
          </div>

          {/* Mascot Message */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center bg-white rounded-full px-6 py-3 shadow-lg">
              <span className="text-2xl mr-3">🐾</span>
              <p className="text-gray-700 font-medium">
                "Jom belajar bersama-sama! Pilih mod yang anda suka untuk mula belajar."
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default MainMenu
