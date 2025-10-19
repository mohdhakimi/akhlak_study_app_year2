/**
 * =============================================================================
 * SIMPLE CHART COMPONENT
 * =============================================================================
 * A simple chart component for displaying analytics data.
 * 
 * Features:
 * - Bar charts
 * - Line charts
 * - Pie charts
 * - Responsive design
 * - Custom styling
 */

import React from 'react'
import { cn } from '../../utils/cn'

export interface ChartData {
  label: string
  value: number
  color?: string
}

export interface SimpleChartProps {
  data: ChartData[]
  type?: 'bar' | 'line' | 'pie'
  title?: string
  height?: number
  showValues?: boolean
  className?: string
}

const SimpleChart: React.FC<SimpleChartProps> = ({
  data,
  type = 'bar',
  title,
  height = 200,
  showValues = true,
  className
}) => {
  const maxValue = Math.max(...data.map(d => d.value))
  const totalValue = data.reduce((sum, d) => sum + d.value, 0)

  const getBarChart = () => (
    <div className="flex items-end space-x-2 h-full">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div
            className="w-full bg-primary-500 rounded-t transition-all duration-300 hover:bg-primary-600"
            style={{
              height: `${(item.value / maxValue) * (height - 40)}px`,
              backgroundColor: item.color || '#3B82F6'
            }}
            title={`${item.label}: ${item.value}`}
          />
          {showValues && (
            <div className="text-xs text-gray-600 mt-1 text-center">
              {item.value}
            </div>
          )}
          <div className="text-xs text-gray-700 mt-1 text-center break-words">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  )

  const getLineChart = () => (
    <div className="relative h-full">
      <svg width="100%" height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
          points={data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100
            const y = 100 - (item.value / maxValue) * 80
            return `${x}%,${y}%`
          }).join(' ')}
        />
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 100
          const y = 100 - (item.value / maxValue) * 80
          return (
            <circle
              key={index}
              cx={`${x}%`}
              cy={`${y}%`}
              r="4"
              fill="#3B82F6"
              className="hover:r-6 transition-all duration-200"
            />
          )
        })}
      </svg>
      <div className="flex justify-between text-xs text-gray-600 mt-2">
        {data.map((item, index) => (
          <div key={index} className="text-center">
            <div className="font-medium">{item.value}</div>
            <div className="text-gray-500">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  )

  const getPieChart = () => {
    let currentAngle = 0
    const radius = 60
    const centerX = 50
    const centerY = 50

    return (
      <div className="flex items-center justify-center">
        <svg width="200" height="200" className="transform -rotate-90">
          {data.map((item, index) => {
            const percentage = item.value / totalValue
            const angle = percentage * 360
            const startAngle = currentAngle
            const endAngle = currentAngle + angle
            
            const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180)
            const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180)
            const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180)
            const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180)
            
            const largeArcFlag = angle > 180 ? 1 : 0
            
            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ')

            currentAngle += angle

            return (
              <path
                key={index}
                d={pathData}
                fill={item.color || `hsl(${(index * 137.5) % 360}, 70%, 50%)`}
                className="hover:opacity-80 transition-opacity duration-200"
              />
            )
          })}
        </svg>
        <div className="ml-4 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded"
                style={{
                  backgroundColor: item.color || `hsl(${(index * 137.5) % 360}, 70%, 50%)`
                }}
              />
              <span className="text-sm text-gray-700">
                {item.label}: {item.value} ({Math.round((item.value / totalValue) * 100)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderChart = () => {
    switch (type) {
      case 'line':
        return getLineChart()
      case 'pie':
        return getPieChart()
      default:
        return getBarChart()
    }
  }

  return (
    <div className={cn('bg-white rounded-lg p-4 shadow-sm border', className)}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      )}
      <div style={{ height: `${height}px` }}>
        {data.length > 0 ? renderChart() : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No data available
          </div>
        )}
      </div>
    </div>
  )
}

export default SimpleChart
