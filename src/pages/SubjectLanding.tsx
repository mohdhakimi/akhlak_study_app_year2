import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import Card from '../components/Card'
import PageTransition from '../components/PageTransition'
import { useUserContext } from '../contexts/UserContext'
import { useBilingual } from '../contexts/BilingualContext'
import { useAnalytics } from '../hooks/useAnalytics'
import { cn } from '../utils/cn'

const SubjectLanding: React.FC = () => {
  const navigate = useNavigate()
  const { subjectId } = useParams<{ subjectId: 'akhlak' | 'feqah' }>()
  const { currentUser } = useUserContext()
  const { formatText } = useBilingual()
  const { trackPageView } = useAnalytics(currentUser?.name)

  useEffect(() => {
    trackPageView('subject_landing', { subject: subjectId })
  }, [trackPageView, subjectId])

  const modes = [
    {
      id: 'study',
      title: 'مود بلاجر | Mod Belajar',
      desc: 'باچ نوتا مودول | Baca nota modul',
      icon: '📚',
      color: 'bg-blue-500',
      route: `/${subjectId}/study`,
    },
    // Hide Doa for Feqah
    ...(subjectId === 'akhlak'
      ? [{
          id: 'doa',
          title: 'مود دعاء | Mod Doa',
          desc: 'دعاء دان ذکر | Doa dan zikir',
          icon: '🤲',
          color: 'bg-amber-500',
          route: '/doa', // existing route retained
        }]
      : []),
    {
      id: 'quiz',
      title: 'مود کويز | Mod Kuiz',
      desc: 'اوجي ڤنڬتاهوان | Uji pengetahuan',
      icon: '🧩',
      color: 'bg-green-500',
      route: `/${subjectId}/quiz`,
    },
    {
      id: 'test',
      title: 'مود اوجيان | Mod Ujian',
      desc: 'اوجيان لڠکڤ | Ujian lengkap',
      icon: '📝',
      color: 'bg-purple-500',
      route: `/${subjectId}/test`,
    },
    {
      id: 'leaderboard',
      title: 'ڤڤن مرقه | Papan Markah',
      desc: 'ليهت مارقه ترتيڠڬي | Lihat markah tertinggi',
      icon: '🏆',
      color: 'bg-yellow-500',
      route: `/${subjectId}/leaderboard`,
    },
  ]

  return (
    <Layout
      title={formatText('ڤيليه مود | Pilih Mod')}
      subtitle={formatText(subjectId === 'feqah' ? 'فقه | Feqah' : 'اخالق | Akhlak')}
      currentUser={currentUser?.name}
      showUser
      showBilingualToggle
    >
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <PageTransition animation="fade">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {modes.map(mode => (
                <Card
                  key={mode.id}
                  className={cn('group cursor-pointer border-0 overflow-hidden')}
                  onClick={() => navigate(mode.route)}
                >
                  <div className={cn('h-32 flex flex-col items-center justify-center text-white', mode.color)}>
                    <div className="text-4xl mb-2">{mode.icon}</div>
                    <h3 className="text-lg font-black">{formatText(mode.title)}</h3>
                    <p className="text-sm font-semibold opacity-90">{formatText(mode.desc)}</p>
                  </div>
                </Card>
              ))}
            </div>
          </PageTransition>
        </div>
      </div>
    </Layout>
  )
}

export default SubjectLanding


