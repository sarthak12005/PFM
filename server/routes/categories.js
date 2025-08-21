const express = require('express');
const router = express.Router();
const { body, query, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

// Sample categories data
const sampleCategories = [
  {
    _id: '1',
    user: 'demo-user-id',
    name: 'Food & Dining',
    type: 'expense',
    icon: 'Utensils',
    color: 'red',
    description: 'Restaurants, groceries, and food delivery',
    transactionCount: 45,
    totalAmount: 25000,
    isDefault: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    _id: '2',
    user: 'demo-user-id',
    name: 'Transportation',
    type: 'expense',
    icon: 'Car',
    color: 'blue',
    description: 'Fuel, public transport, and vehicle maintenance',
    transactionCount: 23,
    totalAmount: 15000,
    isDefault: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    _id: '3',
    user: 'demo-user-id',
    name: 'Salary',
    type: 'income',
    icon: 'DollarSign',
    color: 'green',
    description: 'Monthly salary and bonuses',
    transactionCount: 6,
    totalAmount: 270000,
    isDefault: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    _id: '4',
    user: 'demo-user-id',
    name: 'Entertainment',
    type: 'expense',
    icon: 'Gamepad2',
    color: 'purple',
    description: 'Movies, games, and recreational activities',
    transactionCount: 18,
    totalAmount: 8500,
    isDefault: false,
    createdAt: '2025-01-15T00:00:00Z'
  },
  {
    _id: '5',
    user: 'demo-user-id',
    name: 'Shopping',
    type: 'expense',
    icon: 'ShoppingBag',
    color: 'pink',
    description: 'Clothing, electronics, and general shopping',
    transactionCount: 32,
    totalAmount: 18500,
    isDefault: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    _id: '6',
    user: 'demo-user-id',
    name: 'Utilities',
    type: 'expense',
    icon: 'Home',
    color: 'orange',
    description: 'Electricity, water, gas, and internet bills',
    transactionCount: 8,
    totalAmount: 12000,
    isDefault: true,
    createdAt: '2025-01-01T00:00:00Z'
  }
];

// @route   GET /api/categories
// @desc    Get all categories for user
// @access  Private
router.get('/', auth, [
  query('type').optional().isIn(['income', 'expense']).withMessage('Invalid type'),
  query('includeStats').optional().isBoolean().withMessage('Invalid includeStats value')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { type, includeStats = true } = req.query;

    // Filter categories by user
    let userCategories = sampleCategories.filter(cat => 
      cat.user === req.user.id || cat.user === 'demo-user-id'
    );

    // Apply type filter
    if (type) {
      userCategories = userCategories.filter(cat => cat.type === type);
    }

    // Sort by usage (transaction count) and then by name
    userCategories.sort((a, b) => {
      if (b.transactionCount !== a.transactionCount) {
        return b.transactionCount - a.transactionCount;
      }
      return a.name.localeCompare(b.name);
    });

    // Remove stats if not requested
    if (!includeStats) {
      userCategories = userCategories.map(cat => {
        const { transactionCount, totalAmount, ...categoryWithoutStats } = cat;
        return categoryWithoutStats;
      });
    }

    res.json({
      success: true,
      data: userCategories
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/categories/:id
// @desc    Get single category by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const category = sampleCategories.find(cat => 
      cat._id === id && (cat.user === req.user.id || cat.user === 'demo-user-id')
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: category
    });

  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/categories
// @desc    Create new category
// @access  Private
router.post('/', auth, [
  body('name').trim().isLength({ min: 1, max: 50 }).withMessage('Name must be 1-50 characters'),
  body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('icon').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Invalid icon'),
  body('color').optional().isIn(['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'indigo', 'orange', 'teal', 'gray']).withMessage('Invalid color'),
  body('description').optional().trim().isLength({ max: 200 }).withMessage('Description must be max 200 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      name,
      type,
      icon = 'Tag',
      color = 'gray',
      description = ''
    } = req.body;

    // Check if category name already exists for this user
    const existingCategory = sampleCategories.find(cat => 
      cat.name.toLowerCase() === name.toLowerCase() && 
      cat.type === type &&
      (cat.user === req.user.id || cat.user === 'demo-user-id')
    );

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    const newCategory = {
      _id: Date.now().toString(),
      user: req.user.id,
      name,
      type,
      icon,
      color,
      description,
      transactionCount: 0,
      totalAmount: 0,
      isDefault: false,
      createdAt: new Date().toISOString()
    };

    // In real app, save to database
    sampleCategories.push(newCategory);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: newCategory
    });

  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/categories/:id
// @desc    Update category
// @access  Private
router.put('/:id', auth, [
  body('name').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Name must be 1-50 characters'),
  body('icon').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Invalid icon'),
  body('color').optional().isIn(['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'indigo', 'orange', 'teal', 'gray']).withMessage('Invalid color'),
  body('description').optional().trim().isLength({ max: 200 }).withMessage('Description must be max 200 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const categoryIndex = sampleCategories.findIndex(cat => 
      cat._id === id && (cat.user === req.user.id || cat.user === 'demo-user-id')
    );

    if (categoryIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const category = sampleCategories[categoryIndex];

    // Check if it's a default category and restrict certain updates
    if (category.isDefault && req.body.name) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change name of default category'
      });
    }

    // Check for duplicate name if name is being updated
    if (req.body.name && req.body.name !== category.name) {
      const existingCategory = sampleCategories.find(cat => 
        cat.name.toLowerCase() === req.body.name.toLowerCase() && 
        cat.type === category.type &&
        cat._id !== id &&
        (cat.user === req.user.id || cat.user === 'demo-user-id')
      );

      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Category with this name already exists'
        });
      }
    }

    // Update category
    const updatedCategory = {
      ...category,
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    sampleCategories[categoryIndex] = updatedCategory;

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory
    });

  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/categories/:id
// @desc    Delete category
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const categoryIndex = sampleCategories.findIndex(cat => 
      cat._id === id && (cat.user === req.user.id || cat.user === 'demo-user-id')
    );

    if (categoryIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const category = sampleCategories[categoryIndex];

    // Prevent deletion of default categories
    if (category.isDefault) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete default category'
      });
    }

    // Check if category has transactions
    if (category.transactionCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with existing transactions. Please reassign transactions first.'
      });
    }

    sampleCategories.splice(categoryIndex, 1);

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });

  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/categories/stats/summary
// @desc    Get categories summary statistics
// @access  Private
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const userCategories = sampleCategories.filter(cat => 
      cat.user === req.user.id || cat.user === 'demo-user-id'
    );

    const stats = {
      totalCategories: userCategories.length,
      incomeCategories: userCategories.filter(c => c.type === 'income').length,
      expenseCategories: userCategories.filter(c => c.type === 'expense').length,
      customCategories: userCategories.filter(c => !c.isDefault).length,
      defaultCategories: userCategories.filter(c => c.isDefault).length,
      totalTransactions: userCategories.reduce((sum, c) => sum + c.transactionCount, 0),
      totalAmount: userCategories.reduce((sum, c) => sum + c.totalAmount, 0),
      mostUsedCategory: userCategories.reduce((max, cat) => 
        cat.transactionCount > (max?.transactionCount || 0) ? cat : max, null
      ),
      topSpendingCategory: userCategories
        .filter(c => c.type === 'expense')
        .reduce((max, cat) => 
          cat.totalAmount > (max?.totalAmount || 0) ? cat : max, null
        )
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get categories stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/categories/icons
// @desc    Get available icons for categories
// @access  Private
router.get('/meta/icons', auth, async (req, res) => {
  try {
    const availableIcons = [
      { name: 'ShoppingBag', label: 'Shopping', category: 'general' },
      { name: 'Home', label: 'Home', category: 'general' },
      { name: 'Car', label: 'Transport', category: 'transport' },
      { name: 'Utensils', label: 'Food', category: 'food' },
      { name: 'Gamepad2', label: 'Entertainment', category: 'entertainment' },
      { name: 'Heart', label: 'Health', category: 'health' },
      { name: 'GraduationCap', label: 'Education', category: 'education' },
      { name: 'Plane', label: 'Travel', category: 'travel' },
      { name: 'Shield', label: 'Insurance', category: 'finance' },
      { name: 'DollarSign', label: 'Finance', category: 'finance' },
      { name: 'Briefcase', label: 'Work', category: 'work' },
      { name: 'Gift', label: 'Gifts', category: 'general' },
      { name: 'Coffee', label: 'Coffee', category: 'food' },
      { name: 'Fuel', label: 'Fuel', category: 'transport' },
      { name: 'Smartphone', label: 'Technology', category: 'technology' }
    ];

    res.json({
      success: true,
      data: availableIcons
    });

  } catch (error) {
    console.error('Get icons error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
