import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from '../contexts/UserContext'
import { useBilingual } from '../contexts/BilingualContext'
import { useContentData } from '../hooks/useContentData'
import { useStudyMode } from '../hooks/useStudyMode'
import { useAnalytics } from '../hooks/useAnalytics'
import { TEXT } from '../constants/text'
import Layout from '../components/Layout'
import TopicSelector from '../components/TopicSelector'
import StudyCard from '../components/StudyCard'
import Card from '../components/Card'
import Button from '../components/Button'
import BackToMenuButton from '../components/BackToMenuButton'
import { useParams } from 'react-router-dom'
import { getSubjectTheme } from '../utils/theme'

const StudyMode: React.FC = () => {
  const navigate = useNavigate()
  const { currentUser } = useUserContext()
  const { subjectId } = useParams<{ subjectId: 'akhlak' | 'feqah' }>()
  const { formatText, formatTextWithStyling } = useBilingual()
  const {
    topics,
    loading: contentLoading,
    error: contentError,
  } = useContentData(subjectId === 'feqah' ? 'feqah' : 'akhlak')
  const {
    currentTopic,
    currentNote,
    isStudying,
    canGoNext,
    canGoPrevious,
    totalNotes,
    actions: { startStudying, goToNext, goToPrevious, resetStudy, setError },
  } = useStudyMode()
  const { trackPageView, trackStudySession } = useAnalytics(currentUser?.name)

  // Subject badge styling
  const subject = subjectId === 'feqah' ? 'feqah' : 'akhlak'
  const theme = getSubjectTheme(subject)
  const subjectBadge = (
    <span
      className={
        subject === 'feqah'
          ? 'inline-flex items-center px-12 py-4 rounded-full text-2xl font-extrabold bg-emerald-100 text-emerald-700 border border-emerald-200'
          : 'inline-flex items-center px-12 py-4 rounded-full text-2xl font-extrabold bg-blue-100 text-blue-700 border border-blue-200'
      }
    >
      {formatText(subject === 'feqah' ? 'فقه | Feqah' : 'اخالق | Akhlak')}
    </span>
  )

  // Track page view on component mount
  useEffect(() => {
    trackPageView('study_mode', {
      user: currentUser?.name,
      timestamp: Date.now()
    })
  }, [trackPageView, currentUser?.name])

  // Track study session when topic is selected
  useEffect(() => {
    if (currentTopic && isStudying) {
      const startTime = Date.now()
      
      // Track study session start
      trackStudySession(currentTopic.name, 0, {
        topicId: currentTopic.id,
        user: currentUser?.name,
        timestamp: startTime
      })

      // Track study session end when component unmounts or topic changes
      return () => {
        const duration = Date.now() - startTime
        trackStudySession(currentTopic.name, duration, {
          topicId: currentTopic.id,
          user: currentUser?.name,
          timestamp: Date.now(),
          duration: duration
        })
      }
    }
  }, [currentTopic, isStudying, trackStudySession, currentUser?.name])

  const handleBackToMenu = () => {
    resetStudy()
    navigate('/')
  }

  const handleTopicSelect = (topic: any) => {
    startStudying(topic)
  }

  const handleBackToTopics = () => {
    resetStudy()
  }

  // Show loading state
  if (contentLoading) {
    return (
      <Layout
        title={TEXT.STUDY_MODE}
        subtitle="Mod Belajar - Baca dan Pelajari"
        currentUser={currentUser?.name}
        onUserClick={() => navigate('/')}
        showUser={true}
      >
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-lg text-primary-600">{TEXT.LOADING}</p>
          </div>
        </div>
      </Layout>
    )
  }

  // Show error state
  if (contentError) {
    return (
      <Layout
        title={TEXT.STUDY_MODE}
        subtitle="Mod Belajar - Baca dan Pelajari"
        currentUser={currentUser?.name}
        onUserClick={() => navigate('/')}
        showUser={true}
      >
        <div className={`min-h-screen bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientTo} py-8`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="text-center py-12">
              <div className="text-6xl mb-6">❌</div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Ralat Memuatkan Kandungan
              </h1>
              <p className="text-lg text-gray-600 mb-8">{contentError}</p>
              <div className="mt-6">
                <BackToMenuButton
                  onClick={handleBackToMenu}
                  variant="primary"
                  size="lg"
                  position="center"
                />
              </div>
            </Card>
          </div>
        </div>
      </Layout>
    )
  }

  // Show study card if studying
  if (isStudying && currentTopic && currentNote) {
    return (
      <Layout
        title={formatText(TEXT.STUDY_MODE)}
        subtitle={formatText(
          `${currentTopic.name} - نوتا ${currentNote.order} | Nota ${currentNote.order}`
        )}
        currentUser={currentUser?.name}
        onUserClick={() => navigate('/')}
        showUser={true}
        showBilingualToggle={true}
        showKeluarButton={true}
        onKeluarClick={handleBackToTopics}
      >
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-4">{subjectBadge}</div>
            <StudyCard
              note={currentNote}
              currentIndex={currentNote.order - 1}
              totalNotes={totalNotes}
              onNext={goToNext}
              onPrevious={goToPrevious}
              onBack={handleBackToTopics}
              canGoNext={canGoNext}
              canGoPrevious={canGoPrevious}
            />
          </div>
        </div>
      </Layout>
    )
  }

  // Show topic selector
  return (
      <Layout
        title={formatText(TEXT.STUDY_MODE)}
        subtitle={formatText(
          'مود بلاجر - باچ دان ڤلاجري | Mod Belajar - Baca dan Pelajari'
        )}
        currentUser={currentUser?.name}
        onUserClick={() => navigate('/')}
        showUser={true}
        showBilingualToggle={true}
        showKeluarButton={true}
        onKeluarClick={handleBackToMenu}
      >
      <div className={`min-h-screen bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientTo} py-8`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">{subjectBadge}</div>
          <TopicSelector
            topics={topics}
            onTopicSelect={handleTopicSelect}
            onBack={handleBackToMenu}
            loading={contentLoading}
          />
        </div>
      </div>
    </Layout>
  )
}

export default StudyMode
