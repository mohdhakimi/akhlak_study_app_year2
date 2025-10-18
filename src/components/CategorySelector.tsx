import React from 'react'
import { QuizCategory } from '../types'
import Card from './Card'
import Button from './Button'
import { cn } from '../utils/cn'

export interface CategorySelectorProps {
  categories: QuizCategory[]
  onCategorySelect: (category: QuizCategory) => void
  onBack: () => void
  loading?: boolean
  className?: string
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  onCategorySelect,
  onBack,
  loading = false,
  className
}) => {
  if (loading) {
    return (
      <div className={cn('min-h-screen flex items-center justify-center', className)}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-lg text-primary-600">Memuatkan kategori kuiz...</p>
        </div>
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className={cn('min-h-screen flex items-center justify-center', className)}>
        <Card className="text-center py-12 max-w-md mx-auto">
          <div className="text-6xl mb-6">📚</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Tiada Kategori Kuiz
          </h2>
          <p className="text-gray-600 mb-6">
            Tiada kategori kuiz tersedia pada masa ini.
          </p>
          <Button onClick={onBack} variant="primary">
            Kembali ke Menu
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className={cn('min-h-screen py-8', className)}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Pilih Kategori Kuiz
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Pilih kategori yang ingin anda kuiz. Setiap kuiz mengandungi 10 soalan dengan pilihan jawapan.
          </p>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <Button
            onClick={onBack}
            variant="secondary"
            className="flex items-center space-x-2"
          >
            <span>←</span>
            <span>Kembali ke Menu</span>
          </Button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Card
              key={category.id}
              className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 hover:border-primary-300"
              onClick={() => onCategorySelect(category)}
            >
              <div className="p-6">
                {/* Category Icon */}
                <div className="text-center mb-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                    {category.icon || '📝'}
                  </div>
                </div>

                {/* Category Info */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary-700 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {category.description}
                  </p>

                  {/* Question Count */}
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <span className="font-medium">
                      {category.questions?.length || 0} Soalan
                    </span>
                    <span>•</span>
                    <span>10 minit</span>
                  </div>
                </div>

                {/* Start Button */}
                <div className="mt-6">
                  <Button
                    variant="primary"
                    className="w-full group-hover:bg-primary-700 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      onCategorySelect(category)
                    }}
                  >
                    Mula Kuiz
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-12">
          <Card className="bg-blue-50 border-blue-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">
                📋 Cara Mengambil Kuiz
              </h3>
              <ul className="text-blue-700 space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Pilih jawapan yang paling tepat untuk setiap soalan</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Anda akan mendapat maklum balas serta-merta selepas memilih jawapan</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Skor anda akan disimpan dan dipaparkan di papan markah</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Anda boleh menggunakan butang "Sebelum" untuk menukar jawapan</span>
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CategorySelector
