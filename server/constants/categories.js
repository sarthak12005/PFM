// Standardized categories for the entire application
// These categories are used across transactions, budgets, and all features
// Users can ONLY select from these - no custom categories allowed

const CATEGORIES = {
  expense: [
    {
      id: 'food',
      name: 'Food',
      icon: 'Utensils',
      color: '#f87171',
      description: 'Groceries, restaurants, food delivery'
    },
    {
      id: 'housing',
      name: 'Housing',
      icon: 'Home',
      color: '#60a5fa',
      description: 'Rent, mortgage, home maintenance'
    },
    {
      id: 'transportation',
      name: 'Transportation',
      icon: 'Car',
      color: '#34d399',
      description: 'Fuel, public transport, vehicle maintenance'
    },
    {
      id: 'entertainment',
      name: 'Entertainment',
      icon: 'Gamepad2',
      color: '#facc15',
      description: 'Movies, games, recreational activities'
    },
    {
      id: 'shopping',
      name: 'Shopping',
      icon: 'ShoppingBag',
      color: '#a78bfa',
      description: 'Clothing, electronics, general shopping'
    },
    {
      id: 'utilities',
      name: 'Utilities',
      icon: 'Zap',
      color: '#fb7185',
      description: 'Electricity, water, gas, internet'
    },
    {
      id: 'healthcare',
      name: 'Healthcare',
      icon: 'Heart',
      color: '#fbbf24',
      description: 'Medical expenses, medicines, doctor visits'
    },
    {
      id: 'education',
      name: 'Education',
      icon: 'BookOpen',
      color: '#10b981',
      description: 'School, books, courses, training'
    },
    {
      id: 'travel',
      name: 'Travel',
      icon: 'Plane',
      color: '#06b6d4',
      description: 'Flights, hotels, vacation expenses'
    },
    {
      id: 'insurance',
      name: 'Insurance',
      icon: 'Shield',
      color: '#8b5cf6',
      description: 'Health, car, home insurance'
    }
  ],
  income: [
    {
      id: 'salary',
      name: 'Salary',
      icon: 'DollarSign',
      color: '#10b981',
      description: 'Monthly salary and bonuses'
    },
    {
      id: 'freelance',
      name: 'Freelance',
      icon: 'Briefcase',
      color: '#3b82f6',
      description: 'Freelance work and side projects'
    },
    {
      id: 'business',
      name: 'Business',
      icon: 'TrendingUp',
      color: '#f59e0b',
      description: 'Business income and revenue'
    },
    {
      id: 'investment',
      name: 'Investment',
      icon: 'BarChart3',
      color: '#8b5cf6',
      description: 'Investment returns and dividends'
    },
    {
      id: 'gift',
      name: 'Gift',
      icon: 'Gift',
      color: '#ec4899',
      description: 'Gifts and monetary gifts'
    }
  ]
};

// Helper function to get all categories
const getAllCategories = () => {
  return [
    ...CATEGORIES.expense.map(cat => ({ ...cat, type: 'expense' })),
    ...CATEGORIES.income.map(cat => ({ ...cat, type: 'income' }))
  ];
};

// Helper function to get categories by type
const getCategoriesByType = (type) => {
  return (CATEGORIES[type] || []).map(cat => ({ ...cat, type }));
};

// Helper function to validate category name
const isValidCategory = (categoryName, type = null) => {
  const allCats = getAllCategories();
  if (type) {
    return allCats.some(cat => cat.name === categoryName && cat.type === type);
  }
  return allCats.some(cat => cat.name === categoryName);
};

// Get category details by name
const getCategoryByName = (categoryName) => {
  return getAllCategories().find(cat => cat.name === categoryName) || null;
};

module.exports = {
  CATEGORIES,
  getAllCategories,
  getCategoriesByType,
  isValidCategory,
  getCategoryByName
};
