import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from '../contexts/UserContext'
import { useContentData } from '../hooks/useContentData'
import { useQuizMode } from '../hooks/useQuizMode'
import { useScores } from '../hooks/useScores'
import { TEXT } from '../constants/text'
import Layout from '../components/Layout'
import CategorySelector from '../components/CategorySelector'
import QuestionCard from '../components/QuestionCard'
import QuizResults from '../components/QuizResults'
import Card from '../components/Card'
import Button from '../components/Button'
import { QuizResult } from '../components/QuizResults'

const QuizMode: React.FC = () => {
  const navigate = useNavigate()
  const { currentUser } = useUserContext()
  const { quizCategories, loading: contentLoading, error: contentError } = useContentData()
  const { saveScore } = useScores()
  
  const {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    selectedAnswers,
    isAnswered,
    isRevealed,
    score,
    timeSpent,
    isComplete,
    startQuiz,
    selectAnswer,
    goToNext,
    goToPrevious,
    finishQuiz,
    resetQuiz,
    canGoNext,
    canGoPrevious,
    progress
  } = useQuizMode()

  const [quizResults, setQuizResults] = useState<QuizResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<any>(null)

  const handleBackToMenu = () => {
    resetQuiz()
    setQuizResults([])
    setShowResults(false)
    setSelectedCategory(null)
    navigate('/')
  }

  const handleCategorySelect = (category: any) => {
    try {
      startQuiz(category)
      setSelectedCategory(category)
      setShowResults(false)
    } catch (error) {
      console.error('Error starting quiz:', error)
      // Handle error - could show a toast or error message
    }
  }

  const handleAnswerSelect = (answerIndex: number) => {
    selectAnswer(answerIndex)
  }

  const handleNext = () => {
    if (isComplete) {
      // Quiz is finished, show results
      const results = finishQuiz()
      setQuizResults(results)
      setShowResults(true)
      
      // Save score to localStorage
      if (currentUser && selectedCategory) {
        saveScore({
          id: `quiz-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          userId: currentUser.id,
          userName: currentUser.name,
          quizId: selectedCategory.id,
          quizName: selectedCategory.name,
          score: score + 1, // +1 because we're about to finish
          totalQuestions,
          percentage: Math.round(((score + 1) / totalQuestions) * 100),
          timestamp: new Date().toISOString(),
          type: 'quiz',
          answers: quizResults.map(result => ({
            questionId: result.question.id,
            userAnswer: result.userAnswer,
            correctAnswer: result.correctAnswer,
            isCorrect: result.isCorrect
          }))
        })
      }
    } else {
      goToNext()
    }
  }

  const handlePrevious = () => {
    goToPrevious()
  }

  const handleRetakeQuiz = () => {
    if (selectedCategory) {
      handleCategorySelect(selectedCategory)
    }
  }

  const handleViewLeaderboard = () => {
    navigate('/leaderboard')
  }

  // Show loading state
  if (contentLoading) {
    return (
      <Layout
        title={TEXT.QUIZ_MODE}
        subtitle="Mod Kuiz - Uji Pengetahuan Anda"
        currentUser={currentUser?.name}
        onUserClick={() => navigate('/')}
        showUser={true}
      >
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
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
        title={TEXT.QUIZ_MODE}
        subtitle="Mod Kuiz - Uji Pengetahuan Anda"
        currentUser={currentUser?.name}
        onUserClick={() => navigate('/')}
        showUser={true}
      >
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-8">
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

  // Show results
  if (showResults && quizResults.length > 0) {
    return (
      <Layout
        title={TEXT.QUIZ_MODE}
        subtitle={`Keputusan - ${selectedCategory?.name || 'Kuiz'}`}
        currentUser={currentUser?.name}
        onUserClick={() => navigate('/')}
        showUser={true}
      >
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
          <QuizResults
            results={quizResults}
            score={score}
            totalQuestions={totalQuestions}
            categoryName={selectedCategory?.name || 'Kuiz'}
            timeSpent={timeSpent || undefined}
            onRetake={handleRetakeQuiz}
            onBackToMenu={handleBackToMenu}
            onViewLeaderboard={handleViewLeaderboard}
          />
        </div>
      </Layout>
    )
  }

  // Show question card
  if (currentQuestion && totalQuestions > 0) {
    return (
      <Layout
        title={TEXT.QUIZ_MODE}
        subtitle={`${selectedCategory?.name || 'Kuiz'} - Soalan ${currentQuestionIndex + 1}`}
        currentUser={currentUser?.name}
        onUserClick={() => navigate('/')}
        showUser={true}
      >
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <QuestionCard
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={totalQuestions}
              selectedAnswer={selectedAnswers[currentQuestionIndex]}
              correctAnswer={0} // This will be handled by the QuestionCard component
              isAnswered={isAnswered}
              isRevealed={isRevealed}
              onAnswerSelect={handleAnswerSelect}
              onNext={handleNext}
              onPrevious={handlePrevious}
              canGoNext={canGoNext}
              canGoPrevious={canGoPrevious}
            />
          </div>
        </div>
      </Layout>
    )
  }

  // Show category selector
  return (
    <Layout
      title={TEXT.QUIZ_MODE}
      subtitle="Mod Kuiz - Uji Pengetahuan Anda"
      currentUser={currentUser?.name}
      onUserClick={() => navigate('/')}
      showUser={true}
    >
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        <CategorySelector
          categories={quizCategories}
          onCategorySelect={handleCategorySelect}
          onBack={handleBackToMenu}
          loading={contentLoading}
        />
      </div>
    </Layout>
  )
}

export default QuizMode