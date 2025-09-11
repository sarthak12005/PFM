import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { categoriesAPI } from '../services/api'
import toast from 'react-hot-toast'
import { useAuth } from './AuthContext'  // Your auth hook
import { useLocation } from 'react-router-dom'


const CategoriesContext = createContext()

export const useCategories = () => {
  const context = useContext(CategoriesContext)
  if (!context) {
    throw new Error('useCategories must be used within a CategoriesProvider')
  }
  return context
}

export const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastFetch, setLastFetch] = useState(null)

  const { user, token } = useAuth()  // Assuming Auth context gives you user/token
  const location = useLocation()

  // Cache categories for 5 minutes
  const CACHE_DURATION = 5 * 60 * 1000

  const fetchCategories = async (force = false) => {
    // Check if we need to fetch (force or cache expired)
    if (!force && lastFetch && Date.now() - lastFetch < CACHE_DURATION) {
      return categories
    }

    setLoading(true)
    try {
      const response = await categoriesAPI.getAll({ includeStats: true })
      if (response.data.success) {
        const categoriesData = response.data.data || []
        setCategories(categoriesData)
        setLastFetch(Date.now())
        return categoriesData
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
    return categories
  }

  const addCategory = async (categoryData) => {
    try {
      const response = await categoriesAPI.create(categoryData)
      if (response.data.success) {
        const newCategory = response.data.data
        setCategories(prev => [...prev, newCategory])
        toast.success('Category created successfully!')
        return newCategory
      }
    } catch (error) {
      console.error('Error creating category:', error)
      toast.error(error.response?.data?.message || 'Failed to create category')
      throw error
    }
  }

  const updateCategory = async (categoryId, categoryData) => {
    try {
      const response = await categoriesAPI.update(categoryId, categoryData)
      if (response.data.success) {
        const updatedCategory = response.data.data
        setCategories(prev => prev.map(cat =>
          cat._id === categoryId ? updatedCategory : cat
        ))
        toast.success('Category updated successfully!')
        return updatedCategory
      }
    } catch (error) {
      console.error('Error updating category:', error)
      toast.error(error.response?.data?.message || 'Failed to update category')
      throw error
    }
  }

  const deleteCategory = async (categoryId) => {
    try {
      const response = await categoriesAPI.delete(categoryId)
      if (response.data.success) {
        setCategories(prev => prev.filter(cat => cat._id !== categoryId))
        toast.success('Category deleted successfully!')
        return true
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error(error.response?.data?.message || 'Failed to delete category')
      throw error
    }
  }

  const getCategoriesByType = (type) => {
    return categories.filter(cat => cat.type === type)
  }

  const getCategoryByName = (name) => {
    return categories.find(cat => cat.name === name)
  }

  const getCategoryNames = (type = null) => {
    const filteredCategories = type ? getCategoriesByType(type) : categories
    return filteredCategories.map(cat => cat.name)
  }

  const refreshCategories = () => {
    return fetchCategories(true)
  }

  // Initial fetch
  // ✅ Key fix: Conditional fetching
  useEffect(() => {
    const isAuthPage = ['/login', '/signup'].includes(location.pathname)

    if (token && !isAuthPage) {
      fetchCategories()
    }
  }, [token, location.pathname])


  const value = useMemo(() => ({
    categories,
    loading,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoriesByType,
    getCategoryByName,
    getCategoryNames,
    refreshCategories,

    // Computed values
    expenseCategories: getCategoriesByType('expense'),
    incomeCategories: getCategoriesByType('income'),
    expenseCategoryNames: getCategoryNames('expense'),
    incomeCategoryNames: getCategoryNames('income'),
    allCategoryNames: getCategoryNames()
  }), [categories, loading]);



  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  )
}

export default CategoriesContext
