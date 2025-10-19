import React from 'react'
import { LeaderboardEntry } from '../types'
import Card from './Card'
import { cn } from '../utils/cn'

export interface LeaderboardTableProps {
  entries: LeaderboardEntry[]
  currentUserName?: string
  type: 'quiz' | 'test' | 'all'
  loading?: boolean
  className?: string
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  entries,
  currentUserName,
  type,
  loading = false,
  className,
}) => {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return rank.toString()
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    if (rank === 2) return 'text-gray-600 bg-gray-50 border-gray-200'
    if (rank === 3) return 'text-orange-600 bg-orange-50 border-orange-200'
    return 'text-gray-700 bg-white border-gray-200'
  }

  const getTypeLabel = () => {
    switch (type) {
      case 'quiz':
        return 'Kuiz'
      case 'test':
        return 'Ujian'
      case 'all':
        return 'Semua'
      default:
        return 'Semua'
    }
  }

  if (loading) {
    return (
      <Card className={cn('p-8', className)}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-lg text-primary-600">Memuatkan papan markah...</p>
        </div>
      </Card>
    )
  }

  if (entries.length === 0) {
    return (
      <Card className={cn('p-8 text-center', className)}>
        <div className="text-6xl mb-6">📊</div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Tiada Markah Lagi
        </h3>
        <p className="text-gray-600 mb-6">
          Cuba ambil kuiz atau ujian untuk melihat markah anda di sini!
        </p>
        <div className="text-sm text-gray-500">Kategori: {getTypeLabel()}</div>
      </Card>
    )
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 px-6 py-4 border-b border-primary-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-primary-800">
            Papan Markah - {getTypeLabel()}
          </h3>
          <div className="text-sm text-primary-600">{entries.length} entri</div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kedudukan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Pemain
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Markah
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Peratusan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tarikh
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jenis
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entries.map((entry, index) => {
              const isCurrentUser =
                currentUserName && entry.userName === currentUserName

              return (
                <tr
                  key={`${entry.userName}-${entry.quizId}-${index}`}
                  className={cn(
                    'hover:bg-gray-50 transition-colors',
                    isCurrentUser && 'bg-blue-50 border-l-4 border-blue-500'
                  )}
                >
                  {/* Rank */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={cn(
                        'flex items-center justify-center w-8 h-8 rounded-full border-2 font-bold text-sm',
                        getRankColor(entry.rank)
                      )}
                    >
                      {getRankIcon(entry.rank)}
                    </div>
                  </td>

                  {/* Player Name */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-700">
                            {entry.userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <div
                          className={cn(
                            'text-sm font-medium',
                            isCurrentUser ? 'text-blue-700' : 'text-gray-900'
                          )}
                        >
                          {entry.userName}
                          {isCurrentUser && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              Anda
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Score */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {entry.score}
                    </div>
                  </td>

                  {/* Percentage */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-semibold text-gray-900">
                        {entry.percentage}%
                      </div>
                      <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={cn(
                            'h-2 rounded-full transition-all duration-300',
                            entry.percentage >= 90
                              ? 'bg-green-500'
                              : entry.percentage >= 80
                                ? 'bg-blue-500'
                                : entry.percentage >= 70
                                  ? 'bg-yellow-500'
                                  : entry.percentage >= 60
                                    ? 'bg-orange-500'
                                    : 'bg-red-500'
                          )}
                          style={{
                            width: `${Math.min(entry.percentage, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.date}
                  </td>

                  {/* Type */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={cn(
                        'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                        entry.quizId === 'test'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                      )}
                    >
                      {entry.quizId === 'test' ? 'Ujian' : 'Kuiz'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <div className="text-sm text-gray-500 text-center">
          Papan markah dikemas kini secara automatik
        </div>
      </div>
    </Card>
  )
}

export default LeaderboardTable
