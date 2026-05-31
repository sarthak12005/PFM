const express = require('express');
const router = express.Router();
const { body, query, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { adminAuth } = require('../middleware/admin');
const Category = require('../models/Category');

// ==========================================
// GET ENDPOINTS
// ==========================================

/**
 * @route   GET /api/categories
 * @desc    Get all categories with optional type filtering
 * @access  Private
 * @query   type - 'income' | 'expense' | undefined (both)
 * @query   isActive - true | false (default: true only)
 */
router.get('/', auth, [
  query('type').optional().isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  query('isActive').optional().isBoolean().withMessage('isActive must be boolean')
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

    const { type, isActive = true } = req.query;

    // Build query filter
    const filter = { isActive: JSON.parse(isActive) };
    if (type) {
      filter.type = type;
    }

    // Fetch categories from database
    const categories = await Category.find(filter).sort({ type: 1, name: 1 });

    res.json({
      success: true,
      count: categories.length,
      data: categories
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories'
    });
  }
});

// NOTE: single category route moved below to avoid shadowing static routes

// ==========================================
// POST ENDPOINTS
// ==========================================

/**
 * @route   POST /api/categories
 * @desc    Create new category (Admin only)
 * @access  Private/Admin
 */
router.post('/', auth, adminAuth, [
  body('id').trim().isLength({ min: 2 }).withMessage('ID must be at least 2 characters'),
  body('name').trim().isLength({ min: 1, max: 50 }).withMessage('Name must be 1-50 characters'),
  body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('icon').trim().isLength({ min: 1, max: 50 }).withMessage('Icon is required'),
  body('color').matches(/^#[0-9A-F]{6}$/i).withMessage('Color must be a valid hex code (e.g., #f87171)'),
  body('description').trim().isLength({ min: 1, max: 500 }).withMessage('Description must be 1-500 characters')
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

    const { id, name, type, icon, color, description, isDefault = false } = req.body;

    // Check if category with this ID already exists
    const existingCategory = await Category.findOne({ id: id.toLowerCase() });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this ID already exists'
      });
    }

    // Check if category with this name already exists
    const existingName = await Category.findOne({ name });
    if (existingName) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    // Create new category
    const newCategory = new Category({
      id: id.toLowerCase(),
      name,
      type,
      icon,
      color,
      description,
      isDefault,
      isActive: true
    });

    await newCategory.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: newCategory
    });

  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating category'
    });
  }
});

// ==========================================
// PUT ENDPOINTS
// ==========================================

/**
 * @route   PUT /api/categories/:id
 * @desc    Update category (Admin only)
 * @access  Private/Admin
 */
router.put('/:id', auth, adminAuth, [
  body('name').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Name must be 1-50 characters'),
  body('icon').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Icon is required'),
  body('color').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('Color must be a valid hex code'),
  body('description').optional().trim().isLength({ min: 1, max: 500 }).withMessage('Description must be 1-500 characters'),
  body('isActive').optional().isBoolean().withMessage('isActive must be boolean')
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

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Prevent modification of default categories
    if (category.isDefault && (req.body.name || req.body.type)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify default system categories'
      });
    }

    // Check for duplicate name if name is being updated
    if (req.body.name && req.body.name !== category.name) {
      const existingCategory = await Category.findOne({ 
        name: req.body.name,
        type: category.type,
        _id: { $ne: req.params.id }
      });

      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Category with this name already exists'
        });
      }
    }

    // Update only allowed fields
    if (req.body.name) category.name = req.body.name;
    if (req.body.icon) category.icon = req.body.icon;
    if (req.body.color) category.color = req.body.color;
    if (req.body.description) category.description = req.body.description;
    if (req.body.isActive !== undefined) category.isActive = req.body.isActive;

    await category.save();

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });

  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating category'
    });
  }
});

// ==========================================
// DELETE ENDPOINTS
// ==========================================

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete category (Admin only - cannot delete default categories)
 * @access  Private/Admin
 */
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Prevent deletion of default categories
    if (category.isDefault) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete default system categories'
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });

  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting category'
    });
  }
});

// ==========================================
// UTILITY ENDPOINTS
// ==========================================

/**
 * @route   GET /api/categories/stats/summary
 * @desc    Get categories summary statistics
 * @access  Private
 */
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });

    const stats = {
      totalCategories: categories.length,
      incomeCategories: categories.filter(c => c.type === 'income').length,
      expenseCategories: categories.filter(c => c.type === 'expense').length,
      defaultCategories: categories.filter(c => c.isDefault).length
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get categories stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching stats'
    });
  }
});

/**
 * @route   GET /api/categories/meta/icons
 * @desc    Get available icons for categories
 * @access  Public
 */
router.get('/meta/icons', async (req, res) => {
  try {
    const availableIcons = [
      { name: 'ShoppingBag', label: 'Shopping' },
      { name: 'Home', label: 'Home' },
      { name: 'Car', label: 'Transport' },
      { name: 'Utensils', label: 'Food' },
      { name: 'Gamepad2', label: 'Entertainment' },
      { name: 'Heart', label: 'Health' },
      { name: 'BookOpen', label: 'Education' },
      { name: 'Plane', label: 'Travel' },
      { name: 'Shield', label: 'Insurance' },
      { name: 'DollarSign', label: 'Finance' },
      { name: 'Briefcase', label: 'Work' },
      { name: 'Gift', label: 'Gifts' },
      { name: 'Zap', label: 'Utilities' },
      { name: 'TrendingUp', label: 'Business' },
      { name: 'BarChart3', label: 'Investment' }
    ];

    res.json({
      success: true,
      data: availableIcons
    });

  } catch (error) {
    console.error('Get icons error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching icons'
    });
  }
});

/**
 * @route   GET /api/categories/:id
 * @desc    Get single category by ID
 * @access  Private
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

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
      message: 'Server error while fetching category'
    });
  }
});

module.exports = router;
