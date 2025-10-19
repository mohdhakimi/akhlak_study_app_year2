import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from '../contexts/UserContext'
import { useBilingual } from '../contexts/BilingualContext'
import { useContentData } from '../hooks/useContentData'
import { useTestMode } from '../hooks/useTestMode'
import { useScores } from '../hooks/useScores'
import { useAnalytics } from '../hooks/useAnalytics'
import { TEXT } from '../constants/text'
import Layout from '../components/Layout'
import QuestionCard from '../components/QuestionCard'
import TestResults from '../components/TestResults'
import Card from '../components/Card'
import Button from '../components/Button'
import BackToMenuButton from '../components/BackToMenuButton'
import { TestResult } from '../components/TestResults'

const TestMode: React.FC = () => {
  const navigate = useNavigate()
  const { currentUser } = useUserContext()
  const { formatText } = useBilingual()
  const {
    quizCategories,
    loading: contentLoading,
    error: contentError,
  } = useContentData()
  const { saveScore } = useScores()
  const { trackPageView, trackTestStart, trackTestComplete } = useAnalytics(currentUser?.name)

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
    currentCorrectAnswer,
    currentShuffledOptions,
    startTest,
    selectAnswer,
    goToNext,
    goToPrevious,
    finishTest,
    resetTest,
    canGoNext,
    canGoPrevious,
    // progress
  } = useTestMode()

  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [testStarted, setTestStarted] = useState(false)

  // Track page view on component mount
  useEffect(() => {
    trackPageView('test_mode', {
      user: currentUser?.name,
      timestamp: Date.now()
    })
  }, [trackPageView, currentUser?.name])

  const handleBackToMenu = () => {
    resetTest()
    setTestResults([])
    setShowResults(false)
    setTestStarted(false)
    navigate('/')
  }

  const handleKeluar = () => {
    // Save current progress before exiting
    if (currentUser && score > 0) {
      saveScore({
        id: `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: currentUser.id,
        userName: currentUser.name,
        quizId: 'test-mode',
        quizName: 'Ujian Menyeluruh',
        score,
        totalQuestions,
        percentage: Math.round((score / totalQuestions) * 100),
        timestamp: new Date().toISOString(),
        type: 'test',
        answers: [], // Partial progress
      })
    }

    resetTest()
    setTestResults([])
    setShowResults(false)
    setTestStarted(false)
    navigate('/test') // Go back to test start screen
  }

  const handleStartTest = () => {
    try {
      startTest(quizCategories)
      setTestStarted(true)
      setShowResults(false)
      
      // Track test start
      trackTestStart({
        totalQuestions: quizCategories.reduce((sum, cat) => sum + (cat.questions?.length || 0), 0),
        user: currentUser?.name,
        timestamp: Date.now()
      })
    } catch (error) {
      console.error('Error starting test:', error)
      // Handle error - could show a toast or error message
    }
  }

  const handleAnswerSelect = (answerIndex: number) => {
    selectAnswer(answerIndex)
  }

  const handleNext = () => {
    if (isComplete) {
      // Test is finished, show results
      const results = finishTest()
      setTestResults(results)
      setShowResults(true)

      // Track test completion
      trackTestComplete(score + 1, totalQuestions, {
        user: currentUser?.name,
        timestamp: Date.now(),
        results: results
      })

      // Save score to localStorage
      if (currentUser) {
        saveScore({
          id: `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          userId: currentUser.id,
          userName: currentUser.name,
          quizId: 'test',
          quizName: 'Ujian Komprehensif',
          score: score + 1, // +1 because we're about to finish
          totalQuestions,
          percentage: Math.round(((score + 1) / totalQuestions) * 100),
          timestamp: new Date().toISOString(),
          type: 'test',
          answers: testResults.map(result => ({
            questionId: result.question.id,
            userAnswer: result.userAnswer,
            correctAnswer: result.correctAnswer,
            isCorrect: result.isCorrect,
          })),
        })
      }
    } else {
      goToNext()
    }
  }

  const handlePrevious = () => {
    goToPrevious()
  }

  const handleRetakeTest = () => {
    handleStartTest()
  }

  const handleViewLeaderboard = () => {
    navigate('/leaderboard')
  }

  // Show loading state
  if (contentLoading) {
    return (
      <Layout
        title={TEXT.TEST_MODE}
        subtitle="Mod Ujian - Ujian Komprehensif"
        currentUser={currentUser?.name}
        onUserClick={() => navigate('/')}
        showUser={true}
      >
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
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
        title={TEXT.TEST_MODE}
        subtitle="Mod Ujian - Ujian Komprehensif"
        currentUser={currentUser?.name}
        onUserClick={() => navigate('/')}
        showUser={true}
      >
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 py-8">
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

  // Show results
  if (showResults && testResults.length > 0) {
    return (
      <Layout
        title={TEXT.TEST_MODE}
        subtitle="Keputusan Ujian Komprehensif"
        currentUser={currentUser?.name}
        onUserClick={() => navigate('/')}
        showUser={true}
      >
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
          <TestResults
            results={testResults}
            score={score}
            totalQuestions={totalQuestions}
            timeSpent={timeSpent || undefined}
            onRetake={handleRetakeTest}
            onBackToMenu={handleBackToMenu}
            onViewLeaderboard={handleViewLeaderboard}
          />
        </div>
      </Layout>
    )
  }

  // Show question card
  if (testStarted && currentQuestion && totalQuestions > 0) {
    return (
      <Layout
        title={formatText(TEXT.TEST_MODE)}
        subtitle={formatText(
          `اوجيان کومڤرهنسيف - سوالن ${currentQuestionIndex + 1} | Ujian Komprehensif - Soalan ${currentQuestionIndex + 1}`
        )}
        currentUser={currentUser?.name}
        onUserClick={() => navigate('/')}
        showUser={true}
        showBilingualToggle={true}
        showKeluarButton={true}
        onKeluarClick={handleKeluar}
      >
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <QuestionCard
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={totalQuestions}
              selectedAnswer={selectedAnswers[currentQuestionIndex]}
              correctAnswer={currentCorrectAnswer}
              shuffledOptions={currentShuffledOptions}
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

  // Show test introduction
  return (
    <Layout
      title={formatText(TEXT.TEST_MODE)}
      subtitle={formatText(
        'مود اوجيان - اوجيان کومڤرهنسيف | Mod Ujian - Ujian Komprehensif'
      )}
      currentUser={currentUser?.name}
      onUserClick={() => navigate('/')}
      showUser={true}
      showBilingualToggle={true}
      showKeluarButton={true}
      onKeluarClick={handleBackToMenu}
    >
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Test Introduction */}
          <Card className="text-center py-12 mb-8">
            <div className="text-6xl mb-6">📝</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Ujian Komprehensif
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Ujian ini mengandungi 30 soalan yang dipilih secara rawak dari
              semua topik. Jawab semua soalan dengan teliti untuk mendapatkan
              markah yang terbaik.
            </p>

            {/* Test Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">30</div>
                <div className="text-sm text-blue-700">Soalan</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  Semua Topik
                </div>
                <div className="text-sm text-green-700">Kategori</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  Tiada Had Masa
                </div>
                <div className="text-sm text-purple-700">Masa</div>
              </div>
            </div>

            {/* Instructions */}
            <div className="text-left bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                📋 {formatText('أراهن اوجيان | Arahan Ujian')}
              </h3>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>Ujian ini mengandungi 30 soalan pilihan ganda</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>
                    Setiap soalan mempunyai 4 pilihan jawapan (A, B, C, D)
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>
                    Pilih jawapan yang paling tepat untuk setiap soalan
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>
                    Anda boleh menggunakan butang "Sebelum" untuk menukar
                    jawapan
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>
                    Markah anda akan disimpan dan dipaparkan di papan markah
                  </span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center">
              <Button
                onClick={handleStartTest}
                variant="primary"
                className="px-8 py-3 text-lg"
                disabled={quizCategories.length === 0}
              >
                Mula Ujian
              </Button>
            </div>

            {quizCategories.length === 0 && (
              <p className="text-red-600 text-sm mt-4">
                Tiada soalan tersedia untuk ujian. Sila cuba lagi nanti.
              </p>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  )
}

export default TestMode
