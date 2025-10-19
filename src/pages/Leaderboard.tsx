import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from '../contexts/UserContext'
import { useScores } from '../hooks/useScores'
import { TEXT } from '../constants/text'
import Layout from '../components/Layout'
import LeaderboardTable from '../components/LeaderboardTable'
import Card from '../components/Card'
import Button from '../components/Button'
import { cn } from '../utils/cn'

type FilterType = 'all' | 'quiz' | 'test'

const Leaderboard: React.FC = () => {
  const navigate = useNavigate()
  const { currentUser } = useUserContext()
  const { scores, loading, error } = useScores()
  const [filter, setFilter] = useState<FilterType>('all')

  const handleBackToMenu = () => {
    navigate('/')
  }

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter)
  }

  const formatDate = (date: Date): string => {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      return 'Hari ini'
    } else if (diffDays === 2) {
      return 'Semalam'
    } else if (diffDays <= 7) {
      return `${diffDays - 1} hari lepas`
    } else {
      return date.toLocaleDateString('ms-MY', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
  }

  // Process and sort scores
  const processedScores = useMemo(() => {
    if (!scores || scores.length === 0) return []

    // Filter scores based on selected filter
    let filteredScores = scores
    if (filter === 'quiz') {
      filteredScores = scores.filter(score => score.type === 'quiz')
    } else if (filter === 'test') {
      filteredScores = scores.filter(score => score.type === 'test')
    }

    // Sort by percentage (highest first), then by score, then by date (newest first)
    const sortedScores = filteredScores.sort((a, b) => {
      if (b.percentage !== a.percentage) {
        return b.percentage - a.percentage
      }
      if (b.score !== a.score) {
        return b.score - a.score
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })

    // Add rank and format date
    return sortedScores.map((score, index) => ({
      rank: index + 1,
      userName: score.userName,
      score: score.score,
      percentage: score.percentage,
      date: formatDate(new Date(score.timestamp)),
      quizId: score.quizId,
      quizName: score.quizName
    }))
  }, [scores, filter])

  const getFilterStats = () => {
    const totalScores = scores?.length || 0
    const quizScores = scores?.filter(s => s.type === 'quiz').length || 0
    const testScores = scores?.filter(s => s.type === 'test').length || 0

    return { totalScores, quizScores, testScores }
  }

  const stats = getFilterStats()

  // Show loading state
  if (loading) {
    return (
      <Layout
        title={TEXT.LEADERBOARD}
        subtitle="Papan Markah - Lihat Prestasi Terbaik"
        currentUser={currentUser?.name}
        onUserClick={() => navigate('/')}
        showUser={true}
      >
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-lg text-primary-600">{TEXT.LOADING}</p>
          </div>
        </div>
      </Layout>
    )
  }

  // Show error state
  if (error) {
    return (
      <Layout
        title={TEXT.LEADERBOARD}
        subtitle="Papan Markah - Lihat Prestasi Terbaik"
        currentUser={currentUser?.name}
        onUserClick={() => navigate('/')}
        showUser={true}
      >
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="text-center py-12">
              <div className="text-6xl mb-6">❌</div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Ralat Memuatkan Papan Markah
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                {error}
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

  return (
    <Layout
      title={TEXT.LEADERBOARD}
      subtitle="Papan Markah - Lihat Prestasi Terbaik"
      currentUser={currentUser?.name}
      onUserClick={() => navigate('/')}
      showUser={true}
    >
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Papan Markah
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Lihat prestasi terbaik pelajar dalam kuiz dan ujian
            </p>
          </div>

          {/* Back Button */}
          <div className="mb-6">
            <Button
              onClick={handleBackToMenu}
              variant="secondary"
              className="flex items-center space-x-2"
            >
              <span>←</span>
              <span>Kembali ke Menu</span>
            </Button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center p-6 bg-blue-50 border-blue-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {stats.totalScores}
              </div>
              <div className="text-sm text-blue-700">Jumlah Percubaan</div>
            </Card>
            <Card className="text-center p-6 bg-green-50 border-green-200">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {stats.quizScores}
              </div>
              <div className="text-sm text-green-700">Kuiz</div>
            </Card>
            <Card className="text-center p-6 bg-purple-50 border-purple-200">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {stats.testScores}
              </div>
              <div className="text-sm text-purple-700">Ujian</div>
            </Card>
          </div>

          {/* Filter Buttons */}
          <div className="mb-8">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                📊 Pilih Kategori
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => handleFilterChange('all')}
                  variant={filter === 'all' ? 'primary' : 'outline'}
                  className="flex items-center space-x-2"
                >
                  <span>📈</span>
                  <span>Semua ({stats.totalScores})</span>
                </Button>
                <Button
                  onClick={() => handleFilterChange('quiz')}
                  variant={filter === 'quiz' ? 'primary' : 'outline'}
                  className="flex items-center space-x-2"
                >
                  <span>🧩</span>
                  <span>Kuiz ({stats.quizScores})</span>
                </Button>
                <Button
                  onClick={() => handleFilterChange('test')}
                  variant={filter === 'test' ? 'primary' : 'outline'}
                  className="flex items-center space-x-2"
                >
                  <span>📝</span>
                  <span>Ujian ({stats.testScores})</span>
                </Button>
              </div>
            </Card>
          </div>

          {/* Leaderboard Table */}
          <LeaderboardTable
            entries={processedScores}
            currentUserName={currentUser?.name}
            type={filter}
            loading={loading}
          />

          {/* Encouragement Message */}
          {processedScores.length > 0 && (
            <div className="mt-8">
              <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                <div className="text-center">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Teruskan Berusaha!
                  </h3>
                  <p className="text-gray-600">
                    Setiap percubaan adalah langkah ke arah kecemerlangan. 
                    Jangan berputus asa dan teruskan belajar!
                  </p>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Leaderboard