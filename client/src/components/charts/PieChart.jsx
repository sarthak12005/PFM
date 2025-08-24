import React from 'react'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { autoTransformChartData } from '../../utils/chartHelpers'

ChartJS.register(ArcElement, Tooltip, Legend)

const PieChart = ({
  data,
  title = "Pie Chart",
  height = 400,
  showLegend = true,
  colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'],
  isMobile = false
}) => {
  // Detect mobile screen size
  const [screenSize, setScreenSize] = React.useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768
  })

  React.useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isSmallScreen = screenSize.width < 768
  const isMediumScreen = screenSize.width < 1024
  // Auto-transform data to Chart.js format
  const transformedData = autoTransformChartData(data, 'pie', colors)

  // Handle undefined or invalid data
  if (!transformedData || !transformedData.datasets || !Array.isArray(transformedData.datasets) || transformedData.datasets.length === 0) {
    return (
      <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div style={{ height: `${height}px` }} className="flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 mb-2">📊</div>
            <p className="text-gray-500 text-sm">No data available</p>
          </div>
        </div>
      </div>
    )
  }
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: isSmallScreen ? 'bottom' : 'right',
        labels: {
          usePointStyle: true,
          padding: isSmallScreen ? 10 : 20,
          font: {
            size: isSmallScreen ? 10 : 12,
            family: 'Inter, sans-serif'
          },
          generateLabels: function(chart) {
            const data = chart.data
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const dataset = data.datasets[0]
                const value = dataset.data[i]
                const total = dataset.data.reduce((sum, val) => sum + val, 0)
                const percentage = ((value / total) * 100).toFixed(1)
                
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: dataset.backgroundColor[i],
                  strokeStyle: dataset.borderColor?.[i] || dataset.backgroundColor[i],
                  lineWidth: dataset.borderWidth || 0,
                  hidden: false,
                  index: i
                }
              })
            }
            return []
          }
        }
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: isSmallScreen ? 14 : 16,
          weight: 'bold',
          family: 'Inter, sans-serif'
        },
        padding: {
          top: isSmallScreen ? 5 : 10,
          bottom: isSmallScreen ? 15 : 30
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const label = context.label || ''
            const value = context.parsed
            const total = context.dataset.data.reduce((sum, val) => sum + val, 0)
            const percentage = ((value / total) * 100).toFixed(1)
            return `${label}: ₹${value.toLocaleString()} (${percentage}%)`
          }
        }
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: isSmallScreen ? 500 : 1000,
      easing: 'easeInOutQuart'
    },
    interaction: {
      intersect: false,
      mode: 'nearest'
    },
    onHover: (event, elements) => {
      if (elements.length > 0 && 'vibrate' in navigator) {
        navigator.vibrate(10) // Haptic feedback on mobile
      }
    }
  }

  // Process data to add colors
  const processedData = {
    ...transformedData,
    datasets: transformedData.datasets.map((dataset, index) => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || colors,
      borderColor: dataset.borderColor || colors.map(color => color),
      borderWidth: dataset.borderWidth || 2,
      hoverBorderWidth: dataset.hoverBorderWidth || 3,
      hoverOffset: dataset.hoverOffset || 4
    }))
  }

  // Adjust height for mobile
  const adjustedHeight = isSmallScreen ? Math.min(height, 300) : height

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-2 sm:p-4">
      <div style={{ height: `${adjustedHeight}px` }} className="touch-manipulation">
        <Pie data={processedData} options={options} />
      </div>
    </div>
  )
}

// Specialized pie chart for expenses
export const ExpensePieChart = ({ data, title = "Expense Breakdown" }) => {
  const expenseColors = ['#EF4444', '#F59E0B', '#F97316', '#EC4899', '#8B5CF6', '#6366F1', '#14B8A6', '#10B981']
  
  return (
    <PieChart
      data={data}
      title={title}
      colors={expenseColors}
      height={250}
    />
  )
}

// Specialized doughnut chart
export const DoughnutChart = ({ data, title, height = 400, colors = ['#EF4444', '#F59E0B', '#F97316', '#EC4899', '#8B5CF6'] }) => {
  // Auto-transform data to Chart.js format
  const transformedData = autoTransformChartData(data, 'doughnut', colors)

  // Handle undefined or invalid data
  if (!transformedData || !transformedData.datasets || !Array.isArray(transformedData.datasets) || transformedData.datasets.length === 0) {
    return (
      <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div style={{ height: `${height}px` }} className="flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 mb-2">🍩</div>
            <p className="text-gray-500 text-sm">No data available</p>
          </div>
        </div>
      </div>
    )
  }

  // Process data to add colors and doughnut-specific properties
  const processedData = {
    ...transformedData,
    datasets: transformedData.datasets.map((dataset, index) => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || colors,
      borderColor: dataset.borderColor || colors.map(color => color),
      borderWidth: dataset.borderWidth || 2,
      hoverBorderWidth: dataset.hoverBorderWidth || 3,
      hoverOffset: dataset.hoverOffset || 4,
      cutout: '60%' // This makes it a doughnut
    }))
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: 'Inter, sans-serif'
          }
        }
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 16,
          weight: 'bold',
          family: 'Inter, sans-serif'
        },
        padding: {
          top: 10,
          bottom: 30
        }
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
      easing: 'easeInOutQuart'
    }
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div style={{ height: `${height}px` }}>
        <Pie data={processedData} options={options} />
      </div>
    </div>
  )
}

export default PieChart
