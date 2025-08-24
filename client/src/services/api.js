import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT || 'http://localhost:5001/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return console.log(error);
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (passwordData) => api.put('/auth/password', passwordData),
  getActivity: () => api.get('/auth/activity'),
}

// Transactions API
export const transactionsAPI = {
  getAll: (params) => api.get('/transactions', { params }),
  getById: (id) => api.get(`/transactions/${id}`),
  create: (transaction) => api.post('/transactions', transaction),
  update: (id, transaction) => api.put(`/transactions/${id}`, transaction),
  delete: (id) => api.delete(`/transactions/${id}`),
  getSummary: (params) => api.get('/transactions/summary', { params }),
  getCategories: (params) => api.get('/transactions/categories', { params }),
  getMonthlyData: (params) => api.get('/transactions/monthly', { params }),
}

// Budget API
export const budgetAPI = {
  getBudget: (month) => api.get(`/budget/${month}`),
  createOrUpdateBudget: (budgetData) => api.post('/budget', budgetData),
  updateCategoryBudget: (month, categoryData) => api.put(`/budget/${month}/category`, categoryData),
  getAlerts: (month) => api.get(`/budget/${month}/alerts`),
  markAlertRead: (month, alertId) => api.put(`/budget/${month}/alerts/${alertId}/read`),
  getBudgetSummary: (year) => api.get(`/budget/summary/${year}`),
}

// User API
export const userAPI = {
  getSettings: () => api.get('/auth/me'),
  updateSettings: (settings) => api.put('/auth/profile', settings),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
}

// Offers API
export const offersAPI = {
  getAll: (params) => api.get('/offers', { params }),
  getById: (id) => api.get(`/offers/${id}`),
  claim: (id) => api.post(`/offers/${id}/claim`),
  getCategories: () => api.get('/offers/meta/categories'),
}

// Goals API
export const goalsAPI = {
  getAll: (params) => api.get('/goals', { params }),
  getById: (id) => api.get(`/goals/${id}`),
  create: (goalData) => api.post('/goals', goalData),
  update: (id, goalData) => api.put(`/goals/${id}`, goalData),
  delete: (id) => api.delete(`/goals/${id}`),
  addProgress: (id, progressData) => api.post(`/goals/${id}/progress`, progressData),
  getStats: () => api.get('/goals/stats/summary'),
}



// Categories API
export const categoriesAPI = {
  getAll: (params) => api.get('/categories', { params }),
  getById: (id) => api.get(`/categories/${id}`),
  create: (categoryData) => api.post('/categories', categoryData),
  update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  delete: (id) => api.delete(`/categories/${id}`),
  getStats: () => api.get('/categories/stats/summary'),
  getIcons: () => api.get('/categories/meta/icons'),
}

// Notifications API
export const notificationsAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  getUnreadCount: () => api.get('/notifications/unread/count'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
  create: (notificationData) => api.post('/notifications', notificationData),
  getSettings: () => api.get('/notifications/settings'),
  updateSettings: (settings) => api.put('/notifications/settings', settings),
}

export default api
