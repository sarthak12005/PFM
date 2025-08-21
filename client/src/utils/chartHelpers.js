// Chart.js data transformation utilities

/**
 * Transform raw category data to Chart.js pie chart format
 * @param {Array} data - Array of {category, amount} objects
 * @param {Array} colors - Array of color strings
 * @returns {Object} Chart.js formatted data
 */
export const transformToPieChartData = (data, colors = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6',
  '#EC4899', '#14B8A6', '#F97316'
]) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return { labels: [], datasets: [] }
  }

  return {
    labels: data.map(item => item.category || item.name || item.label || 'Unknown'),
    datasets: [
      {
        label: 'Amount',
        data: data.map(item => item.amount || item.value || item.data || 0),
        backgroundColor: colors.slice(0, data.length),
        borderColor: colors.slice(0, data.length),
        borderWidth: 2
      }
    ]
  }
}

/**
 * Transform raw monthly data to Chart.js bar chart format
 * @param {Array} data - Array of {month, income, expenses} objects
 * @returns {Object} Chart.js formatted data
 */
export const transformToBarChartData = (data) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return { labels: [], datasets: [] }
  }

  return {
    labels: data.map(item => {
      if (item.month) {
        const [year, month] = item.month.split('-')
        const date = new Date(year, month - 1)
        return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      }
      return item.month || 'Unknown'
    }),
    datasets: [
      {
        label: 'Income',
        data: data.map(item => item.income || 0),
        backgroundColor: '#10B981',
        borderColor: '#10B981',
      },
      {
        label: 'Expenses',
        data: data.map(item => item.expenses || 0),
        backgroundColor: '#EF4444',
        borderColor: '#EF4444',
      }
    ]
  }
}

/**
 * Transform raw savings data to Chart.js line chart format
 * @param {Array} data - Array of {month, savings} objects
 * @returns {Object} Chart.js formatted data
 */
export const transformToLineChartData = (data) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return { labels: [], datasets: [] }
  }

  return {
    labels: data.map(item => {
      if (item.month) {
        const [year, month] = item.month.split('-')
        const date = new Date(year, month - 1)
        return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      }
      return item.month || 'Unknown'
    }),
    datasets: [
      {
        label: 'Savings',
        data: data.map(item => item.savings || 0),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }
}

/**
 * Transform raw data to Chart.js doughnut chart format
 * @param {Array} data - Array of {category, amount} objects
 * @param {Array} colors - Array of color strings
 * @returns {Object} Chart.js formatted data
 */
export const transformToDoughnutChartData = (data, colors = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'
]) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return { labels: [], datasets: [] }
  }

  return {
    labels: data.map(item => item.category || item.name || 'Unknown'),
    datasets: [
      {
        label: 'Amount',
        data: data.map(item => item.amount || item.value || 0),
        backgroundColor: colors.slice(0, data.length),
        borderColor: colors.slice(0, data.length),
        borderWidth: 2,
        cutout: '60%'
      }
    ]
  }
}

/**
 * Check if data is already in Chart.js format
 * @param {*} data - Data to check
 * @returns {boolean} True if data has Chart.js structure
 */
export const isChartJsFormat = (data) => {
  return data && 
         typeof data === 'object' && 
         Array.isArray(data.labels) && 
         Array.isArray(data.datasets)
}

/**
 * Auto-transform data to Chart.js format based on data structure
 * @param {*} data - Raw data or Chart.js formatted data
 * @param {string} chartType - Type of chart ('pie', 'bar', 'line', 'doughnut')
 * @param {Array} colors - Color array for charts
 * @returns {Object} Chart.js formatted data
 */
export const autoTransformChartData = (data, chartType = 'pie', colors) => {
  // If already in Chart.js format, return as-is
  if (isChartJsFormat(data)) {
    return data
  }

  // If data is an array, transform based on chart type
  if (Array.isArray(data)) {
    switch (chartType) {
      case 'pie':
        return transformToPieChartData(data, colors)
      case 'bar':
        return transformToBarChartData(data)
      case 'line':
        return transformToLineChartData(data)
      case 'doughnut':
        return transformToDoughnutChartData(data, colors)
      default:
        return transformToPieChartData(data, colors)
    }
  }

  // If data is an object but not Chart.js format, try to convert
  if (typeof data === 'object' && data !== null) {
    // Convert object to array format
    const arrayData = Object.entries(data).map(([key, value]) => ({
      category: key,
      amount: typeof value === 'number' ? value : value.amount || 0
    }))
    return autoTransformChartData(arrayData, chartType, colors)
  }

  // Return empty chart data for invalid input
  return { labels: [], datasets: [] }
}

export default {
  transformToPieChartData,
  transformToBarChartData,
  transformToLineChartData,
  transformToDoughnutChartData,
  isChartJsFormat,
  autoTransformChartData
}
