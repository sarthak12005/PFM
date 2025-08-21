import React from 'react'
import { Search, Filter, X, Calendar } from 'lucide-react'

const FiltersBar = ({ filters, setFilters, onClearFilters, transactions }) => {
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // Get unique categories from transactions
  const categories = [...new Set(transactions.map(t => t.category))].sort()

  const hasActiveFilters = Object.values(filters).some(value => value !== '')

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-600" />
            <h3 className="font-semibold text-gray-900">Filters</h3>
          </div>
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 transition-colors"
            >
              <X size={16} />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>
      
      <div className="card-content">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                id="search"
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input pl-9 text-sm"
                placeholder="Search transactions..."
              />
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              id="type"
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="input text-sm"
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="input text-sm"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={16} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="input pl-9 text-sm"
                  placeholder="From"
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={16} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="input pl-9 text-sm"
                  placeholder="To"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Search: "{filters.search}"
                  <button
                    onClick={() => handleFilterChange('search', '')}
                    className="ml-1 hover:text-blue-600"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              
              {filters.type && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Type: {filters.type}
                  <button
                    onClick={() => handleFilterChange('type', '')}
                    className="ml-1 hover:text-green-600"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              
              {filters.category && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Category: {filters.category}
                  <button
                    onClick={() => handleFilterChange('category', '')}
                    className="ml-1 hover:text-purple-600"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              
              {filters.dateFrom && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  From: {filters.dateFrom}
                  <button
                    onClick={() => handleFilterChange('dateFrom', '')}
                    className="ml-1 hover:text-orange-600"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              
              {filters.dateTo && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  To: {filters.dateTo}
                  <button
                    onClick={() => handleFilterChange('dateTo', '')}
                    className="ml-1 hover:text-orange-600"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FiltersBar
