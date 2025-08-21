import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { autoTransformChartData } from '../../utils/chartHelpers'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const LineChart = ({
  data,
  title = "Line Chart",
  height = 400,
  showLegend = true,
  showGrid = true,
  colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
  fill = false,
  tension = 0.4
}) => {
  // Auto-transform data to Chart.js format
  const transformedData = autoTransformChartData(data, 'line', colors)

  // Handle undefined or invalid data
  if (!transformedData || !transformedData.datasets || !Array.isArray(transformedData.datasets) || transformedData.datasets.length === 0) {
    return (
      <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div style={{ height: `${height}px` }} className="flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 mb-2">📈</div>
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
        position: 'top',
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
            const value = context.parsed.y
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
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
        borderWidth: 2,
        hoverBorderWidth: 3
      },
      line: {
        tension: tension,
        borderWidth: 3
      }
    }
  }

  // Process data to add colors and styling
  const processedData = {
    ...transformedData,
    datasets: transformedData.datasets.map((dataset, index) => ({
      ...dataset,
      borderColor: dataset.borderColor || colors[index % colors.length],
      backgroundColor: fill 
        ? dataset.backgroundColor || `${colors[index % colors.length]}20`
        : dataset.backgroundColor || colors[index % colors.length],
      pointBackgroundColor: dataset.pointBackgroundColor || colors[index % colors.length],
      pointBorderColor: dataset.pointBorderColor || '#ffffff',
      pointHoverBackgroundColor: dataset.pointHoverBackgroundColor || colors[index % colors.length],
      pointHoverBorderColor: dataset.pointHoverBorderColor || '#ffffff',
      fill: dataset.fill !== undefined ? dataset.fill : fill,
      tension: dataset.tension !== undefined ? dataset.tension : tension
    }))
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div style={{ height: `${height}px` }}>
        <Line data={processedData} options={options} />
      </div>
    </div>
  )
}

// Specialized line chart for savings trend
export const SavingsLineChart = ({ data, title = "Savings Trend" }) => {
  return (
    <LineChart
      data={data}
      title={title}
      colors={['#10B981']} // Green for savings
      fill={true}
      height={300}
    />
  )
}

// Specialized line chart for income vs expenses
export const IncomeExpenseLineChart = ({ data, title = "Income vs Expenses Trend" }) => {
  return (
    <LineChart
      data={data}
      title={title}
      colors={['#10B981', '#EF4444']} // Green for income, red for expenses
      height={350}
    />
  )
}

// Area chart variant
export const AreaChart = ({ data, title, height = 400 }) => {
  return (
    <LineChart
      data={data}
      title={title}
      fill={true}
      height={height}
      tension={0.4}
    />
  )
}

export default LineChart
