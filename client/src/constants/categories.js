// Standardized categories - must match backend constants/categories.js exactly
// Users can ONLY select from these categories

export const STANDARD_CATEGORIES = {
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

// Helper function to get category names for a type
export const getCategoryNames = (type = 'expense') => {
  return (STANDARD_CATEGORIES[type] || []).map(cat => cat.name);
};

// Helper function to get all category names
export const getAllCategoryNames = () => {
  return [
    ...STANDARD_CATEGORIES.expense.map(cat => cat.name),
    ...STANDARD_CATEGORIES.income.map(cat => cat.name)
  ];
};

// Helper function to get category by name
export const getCategoryByName = (name) => {
  const allCategories = [
    ...STANDARD_CATEGORIES.expense,
    ...STANDARD_CATEGORIES.income
  ];
  return allCategories.find(cat => cat.name === name) || null;
};

// Helper function to validate category
export const isValidCategory = (categoryName, type = null) => {
  const allCategories = [
    ...STANDARD_CATEGORIES.expense.map(cat => ({ ...cat, type: 'expense' })),
    ...STANDARD_CATEGORIES.income.map(cat => ({ ...cat, type: 'income' }))
  ];
  
  if (type) {
    return allCategories.some(cat => cat.name === categoryName && cat.type === type);
  }
  return allCategories.some(cat => cat.name === categoryName);
};
