import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from '../contexts/UserContext'
import { useContentData } from '../hooks/useContentData'
import { useStudyMode } from '../hooks/useStudyMode'
import { TEXT } from '../constants/text'
import Layout from '../components/Layout'
import TopicSelector from '../components/TopicSelector'
import StudyCard from '../components/StudyCard'
import Card from '../components/Card'
import Button from '../components/Button'

const StudyMode: React.FC = () => {
  const navigate = useNavigate()
  const { currentUser } = useUserContext()
  const { topics, loading: contentLoading, error: contentError } = useContentData()
  const {
    currentTopic,
    currentNote,
    isStudying,
    canGoNext,
    canGoPrevious,
    totalNotes,
    actions: {
      startStudying,
      goToNext,
      goToPrevious,
      resetStudy,
      setError
    }
  } = useStudyMode()

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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="text-center py-12">
              <div className="text-6xl mb-6">❌</div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Ralat Memuatkan Kandungan
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                {contentError}
              </p>
              <Button
                onClick={handleBackToMenu}
                variant="primary"
                className="mt-6"
              >
                Kembali ke Menu Utama
              </Button>
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
        title={TEXT.STUDY_MODE}
        subtitle={`${currentTopic.name} - Nota ${currentNote.order}`}
        currentUser={currentUser?.name}
        onUserClick={() => navigate('/')}
        showUser={true}
      >
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
      title={TEXT.STUDY_MODE}
      subtitle="Mod Belajar - Baca dan Pelajari"
      currentUser={currentUser?.name}
      onUserClick={() => navigate('/')}
      showUser={true}
    >
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
