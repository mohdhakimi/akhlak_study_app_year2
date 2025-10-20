/**
 * Doa Mode Component - Islamic Prayers Learning Module
 * 
 * This component provides an interactive interface for learning Islamic prayers (doa)
 * organized by categories based on different aspects of daily life and Islamic practices.
 * 
 * Features:
 * - Category-based organization of doas
 * - Bilingual support (Arabic, Jawi, Malay)
 * - Interactive doa cards with expandable details
 * - Search and filter functionality
 * - Responsive design following app guidelines
 * 
 * Categories include:
 * - Adab Makan dan Minum (Eating and Drinking Etiquette)
 * - Adab Tidur (Sleeping Etiquette)
 * - Adab Berkenderaan (Transportation Etiquette)
 * - Adab di Masjid (Mosque Etiquette)
 * - Adab Belajar (Learning Etiquette)
 * - Adab dengan Mushaf Al-Quran (Quran Reading Etiquette)
 */

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from '../contexts/UserContext'
import { useBilingual } from '../contexts/BilingualContext'
import { useAnalytics } from '../hooks/useAnalytics'
import { useHaptic } from '../hooks/useHaptic'
import { TEXT } from '../constants/text'
import Layout from '../components/Layout'
import Card from '../components/Card'
import Button from '../components/Button'
import BackToMenuButton from '../components/BackToMenuButton'
import PageTransition from '../components/PageTransition'
import { cn } from '../utils/cn'
import doaData from '../data/doa_db.json'

interface Doa {
  id: string
  title: string
  arabic: string
  jawi: string
  malay: string
  context: string
  order: number
}

interface DoaCategory {
  id: string
  name: string
  description: string
  icon: string
  color: string
  hoverColor: string
  doas: Doa[]
}

const DoaMode: React.FC = () => {
  // Navigation hook for routing
  const navigate = useNavigate()
  
  // User context for current user
  const { currentUser } = useUserContext()
  
  // Bilingual context for text formatting
  const { formatText, formatTextWithStyling } = useBilingual()
  
  // Analytics hook for tracking user interactions
  const { trackPageView, trackEvent } = useAnalytics(currentUser?.name)
  
  // Haptic feedback hook
  const { buttonPress, navigation } = useHaptic()
  
  // Local state management
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedDoa, setExpandedDoa] = useState<string | null>(null)
  
  // Get categories from doa data
  const categories: DoaCategory[] = doaData.categories

  // Track page view on component mount
  useEffect(() => {
    trackPageView('doa_mode', {
      user: currentUser?.name,
      timestamp: Date.now()
    })
  }, [trackPageView, currentUser?.name])

  /**
   * Handle category selection
   * @param categoryId - The ID of the selected category
   */
  const handleCategorySelect = (categoryId: string) => {
    buttonPress() // Haptic feedback for category selection
    setSelectedCategory(categoryId)
    trackEvent('user_action', 'navigation', 'category_select', categoryId, undefined, {
      user: currentUser?.name,
      timestamp: Date.now()
    })
  }

  /**
   * Handle doa expansion toggle
   * @param doaId - The ID of the doa to expand/collapse
   */
  const handleDoaToggle = (doaId: string) => {
    buttonPress() // Haptic feedback for doa toggle
    setExpandedDoa(expandedDoa === doaId ? null : doaId)
    trackEvent('user_action', 'interaction', 'doa_toggle', doaId, undefined, {
      user: currentUser?.name,
      timestamp: Date.now()
    })
  }

  /**
   * Handle search input change
   * @param value - The search term
   */
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    trackEvent('user_action', 'search', 'doa_search', value, undefined, {
      user: currentUser?.name,
      timestamp: Date.now()
    })
  }

  /**
   * Filter doas based on search term
   * @param doas - Array of doas to filter
   * @returns Filtered array of doas
   */
  const filterDoas = (doas: Doa[]): Doa[] => {
    if (!searchTerm) return doas
    
    return doas.filter(doa => 
      doa.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doa.arabic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doa.malay.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  /**
   * Get the selected category data
   */
  const selectedCategoryData = selectedCategory 
    ? categories.find(cat => cat.id === selectedCategory)
    : null

  /**
   * Get filtered doas for the selected category
   */
  const filteredDoas = selectedCategoryData 
    ? filterDoas(selectedCategoryData.doas)
    : []

  return (
    <Layout
      title={formatText(TEXT.DOA_MODE)}
      subtitle={formatText('دعاء دان ذکر | Doa dan Zikir')}
      currentUser={currentUser?.name}
      showUser={true}
      showBilingualToggle={true}
    >
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <PageTransition animation="fade">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-primary-800 mb-4">
                {formatText(TEXT.DOA_MODE)}
              </h1>
              <p className="text-xl text-primary-600 max-w-2xl mx-auto">
                {formatText(
                  'بلاجر دعاء دان ذکر براساس ادب اسلامي | Belajar doa dan zikir berdasarkan adab Islami'
                )}
              </p>
            </div>
          </PageTransition>

          {/* Back to Menu Button */}
          <div className="mb-6">
            <BackToMenuButton onClick={() => navigate('/')} />
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder={formatText('چاري دعاء... | Cari doa...')}
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full px-4 py-3 pl-10 pr-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Category Selection or Doa Display */}
          {!selectedCategory ? (
            /* Category Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map(category => (
                <Card
                  key={category.id}
                  className={cn(
                    'group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl',
                    'border-0 overflow-hidden'
                  )}
                  onClick={() => handleCategorySelect(category.id)}
                >
                  <div
                    className={cn(
                      'h-40 flex flex-col items-center justify-center text-white relative overflow-hidden',
                      category.color,
                      category.hoverColor
                    )}
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-white opacity-20"></div>
                      <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-white opacity-30"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white opacity-10"></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-20 text-center">
                      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                        {category.icon}
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-white drop-shadow-2xl">
                        {formatTextWithStyling(category.name)}
                      </h3>
                      <p className="text-sm text-white font-medium drop-shadow-lg px-4">
                        {formatTextWithStyling(category.description)}
                      </p>
                      <div className="mt-2 text-xs text-white opacity-90">
                        {category.doas.length} {formatText('دعاء | doa')}
                      </div>
                    </div>

                    {/* Dark overlay for better contrast */}
                    <div className="absolute inset-0 bg-black bg-opacity-30"></div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            /* Doa List for Selected Category */
            <div>
              {/* Category Header */}
              <div className="mb-6">
                <Button
                  onClick={() => setSelectedCategory(null)}
                  variant="outline"
                  className="mb-4"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {formatText('کمبالي | Kembali')}
                </Button>
                
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-primary-800 mb-2">
                    {formatText(selectedCategoryData?.name || '')}
                  </h2>
                  <p className="text-lg text-primary-600">
                    {formatText(selectedCategoryData?.description || '')}
                  </p>
                </div>
              </div>

              {/* Doa List */}
              <div className="space-y-4">
                {filteredDoas.length > 0 ? (
                  filteredDoas.map(doa => (
                    <Card key={doa.id} className="overflow-hidden">
                      <div
                        className="p-6 cursor-pointer"
                        onClick={() => handleDoaToggle(doa.id)}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-bold text-primary-800 mb-2">
                            {formatTextWithStyling(doa.title)}
                          </h3>
                          <div className="text-2xl text-primary-600">
                            {expandedDoa === doa.id ? '−' : '+'}
                          </div>
                        </div>
                        
                        {expandedDoa === doa.id && (
                          <div className="mt-4 space-y-4 animate-fade-in">
                            {/* Arabic Text */}
                            <div className="bg-gray-50 p-6 rounded-lg">
                              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                                {formatText('متن عرب | Matan Arab')}
                              </h4>
                              <p className="arabic-text-large text-center text-3xl text-gray-800">
                                {doa.arabic}
                              </p>
                            </div>

                            {/* Malay Translation */}
                            <div className="bg-green-50 p-4 rounded-lg">
                              <h4 className="text-sm font-semibold text-green-700 mb-2">
                                {formatText('ترجمهأن ملايو | Terjemahan Melayu')}
                              </h4>
                              <p className="text-lg text-green-800 leading-relaxed">
                                {doa.malay}
                              </p>
                            </div>

                            {/* Context */}
                            {doa.context && (
                              <div className="bg-yellow-50 p-4 rounded-lg">
                                <h4 className="text-sm font-semibold text-yellow-700 mb-2">
                                  {formatText('نوتا | Nota')}
                                </h4>
                                <p className="text-yellow-800">
                                  {doa.context}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      {formatText('تيدق دچاري | Tidak dijumpai')}
                    </h3>
                    <p className="text-gray-500">
                      {formatText('چوبا چاري دغن کاتا کنجي لاءين | Cuba cari dengan kata kunci lain')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default DoaMode
