import React from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

const MonthSelector = ({ selectedMonth, onMonthChange }) => {
  const generateMonthOptions = () => {
    const options = []
    const currentDate = new Date()
    
    // Generate 12 months: 6 months back and 6 months forward
    for (let i = -6; i <= 6; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1)
      const monthValue = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const monthLabel = date.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      })
      
      options.push({
        value: monthValue,
        label: monthLabel,
        isCurrent: i === 0
      })
    }
    
    return options
  }

  const monthOptions = generateMonthOptions()

  const navigateMonth = (direction) => {
    const currentIndex = monthOptions.findIndex(option => option.value === selectedMonth)
    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1
    
    if (newIndex >= 0 && newIndex < monthOptions.length) {
      onMonthChange(monthOptions[newIndex].value)
    }
  }

  const getCurrentMonthLabel = () => {
    const option = monthOptions.find(option => option.value === selectedMonth)
    return option ? option.label : selectedMonth
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Desktop Month Selector */}
      <div className="hidden sm:flex items-center space-x-2">
        <div className="flex items-center space-x-2">
          <Calendar size={20} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Month:</span>
        </div>
        
        <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-50 transition-colors border-r border-gray-300"
            disabled={monthOptions.findIndex(option => option.value === selectedMonth) === 0}
          >
            <ChevronLeft size={16} className="text-gray-600" />
          </button>
          
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="px-3 py-2 bg-white border-none focus:outline-none focus:ring-0 text-sm font-medium text-gray-900 min-w-[140px]"
          >
            {monthOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
                {option.isCurrent && ' (Current)'}
              </option>
            ))}
          </select>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-50 transition-colors border-l border-gray-300"
            disabled={monthOptions.findIndex(option => option.value === selectedMonth) === monthOptions.length - 1}
          >
            <ChevronRight size={16} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Mobile Month Selector */}
      <div className="sm:hidden flex items-center space-x-2">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          disabled={monthOptions.findIndex(option => option.value === selectedMonth) === 0}
        >
          <ChevronLeft size={16} className="text-gray-600" />
        </button>
        
        <div className="flex-1 min-w-0">
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium text-gray-900"
          >
            {monthOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
                {option.isCurrent && ' (Current)'}
              </option>
            ))}
          </select>
        </div>
        
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          disabled={monthOptions.findIndex(option => option.value === selectedMonth) === monthOptions.length - 1}
        >
          <ChevronRight size={16} className="text-gray-600" />
        </button>
      </div>
    </div>
  )
}

export default MonthSelector
