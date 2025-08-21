import React, { useEffect, useRef } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { autoTransformChartData } from '../../utils/chartHelpers'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const BarChart = ({
  data,
  title = "Bar Chart",
  height = 400,
  showLegend = true,
  showGrid = true,
  colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
  horizontal = false
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
  const transformedData = autoTransformChartData(data, 'bar', colors)

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
  const chartRef = useRef()

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? 'y' : 'x',
    plugins: {
      legend: {
        display: showLegend,
        position: isSmallScreen ? 'bottom' : 'top',
        labels: {
          usePointStyle: true,
          padding: isSmallScreen ? 10 : 20,
          font: {
            size: isSmallScreen ? 10 : 12,
            family: 'Inter, sans-serif'
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
            const label = context.dataset.label || ''
            const value = context.parsed.y || context.parsed.x
            return `${label}: ₹${value.toLocaleString()}`
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: showGrid,
          color: 'rgba(0, 0, 0, 0.1)',
          lineWidth: 1
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter, sans-serif'
          },
          color: '#6B7280'
        }
      },
      y: {
        display: true,
        grid: {
          display: showGrid,
          color: 'rgba(0, 0, 0, 0.1)',
          lineWidth: 1
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter, sans-serif'
          },
          color: '#6B7280',
          callback: function(value) {
            return '₹' + value.toLocaleString()
          }
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  }

  // Process data to add colors
  const processedData = {
    ...transformedData,
    datasets: transformedData.datasets.map((dataset, index) => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || colors[index % colors.length],
      borderColor: dataset.borderColor || colors[index % colors.length],
      borderWidth: dataset.borderWidth || 0,
      borderRadius: dataset.borderRadius || 4,
      borderSkipped: false,
    }))
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div style={{ height: `${height}px` }}>
        <Bar 
          ref={chartRef}
          data={processedData} 
          options={options} 
        />
      </div>
    </div>
  )
}

// Specialized bar chart for income vs expenses
export const IncomeExpenseBarChart = ({ data, title = "Income vs Expenses" }) => {
  return (
    <BarChart
      data={data}
      title={title}
      colors={['#10B981', '#EF4444']} // Green for income, red for expenses
      height={350}
    />
  )
}

// Specialized bar chart for category breakdown
export const CategoryBarChart = ({ data, title = "Category Breakdown", horizontal = true }) => {
  return (
    <BarChart
      data={data}
      title={title}
      horizontal={horizontal}
      colors={['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316']}
      height={400}
    />
  )
}

export default BarChart
