const express = require('express');
const { body, validationResult, param } = require('express-validator');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/budget/:month
// @desc    Get budget for specific month
// @access  Private
router.get('/:month', auth, [
  param('month')
    .matches(/^\d{4}-\d{2}$/)
    .withMessage('Month must be in YYYY-MM format')
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

    const { month } = req.params;
    const budget = await Budget.getOrCreateBudget(req.user.id, month);

    // Get actual spending for the month
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

    const actualSpending = await Transaction.getCategoryBreakdown(
      req.user.id,
      'expense',
      startDate,
      endDate
    );

    // Update spent amounts in budget using findOneAndUpdate
    const updatedCategories = budget.categories.map(category => {
      const actualCategory = actualSpending.find(ac => ac.category === category.name);
      return {
        ...category.toObject(),
        spentAmount: actualCategory ? actualCategory.amount : 0
      };
    });

    const totalSpent = updatedCategories.reduce((sum, cat) => sum + cat.spentAmount, 0);

    const updatedBudget = await Budget.findOneAndUpdate(
      { user: req.user.id, month },
      {
        categories: updatedCategories,
        totalSpent
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false
      }
    );

    res.json({
      success: true,
      data: updatedBudget
    });

  } catch (error) {
    console.error('Get budget error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/budget
// @desc    Create or update budget
// @access  Private
router.post('/', auth, [
  body('month')
    .matches(/^\d{4}-\d{2}$/)
    .withMessage('Month must be in YYYY-MM format'),
  body('categories')
    .isArray({ min: 1 })
    .withMessage('Categories must be a non-empty array'),
  body('categories.*.name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Category name is required'),
  body('categories.*.budgetAmount')
    .isFloat({ min: 0 })
    .withMessage('Budget amount must be non-negative'),
  body('categories.*.color')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Color must be a valid hex color'),
  body('savingsGoal')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Savings goal must be non-negative')
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

    const { month, categories, savingsGoal = 0 } = req.body;

    // Find existing budget or create new one
    let budget = await Budget.findOne({ user: req.user.id, month });

    if (budget) {
      // Update existing budget using findOneAndUpdate to avoid version conflicts
      const updatedCategories = categories.map(cat => ({
        name: cat.name,
        budgetAmount: cat.budgetAmount,
        spentAmount: budget.categories.find(existing => existing.name === cat.name)?.spentAmount || 0,
        color: cat.color || Budget.getCategoryColor(cat.name)
      }));

      const totalBudget = updatedCategories.reduce((sum, cat) => sum + cat.budgetAmount, 0);
      const totalSpent = updatedCategories.reduce((sum, cat) => sum + cat.spentAmount, 0);

      budget = await Budget.findOneAndUpdate(
        { user: req.user.id, month },
        {
          categories: updatedCategories,
          savingsGoal,
          totalBudget,
          totalSpent
        },
        {
          new: true,
          runValidators: true,
          useFindAndModify: false
        }
      );
    } else {
      // Create new budget
      const newCategories = categories.map(cat => ({
        name: cat.name,
        budgetAmount: cat.budgetAmount,
        spentAmount: 0,
        color: cat.color || Budget.getCategoryColor(cat.name)
      }));

      const totalBudget = newCategories.reduce((sum, cat) => sum + cat.budgetAmount, 0);

      budget = new Budget({
        user: req.user.id,
        month,
        categories: newCategories,
        savingsGoal,
        totalBudget,
        totalSpent: 0
      });

      await budget.save();
    }

    res.json({
      success: true,
      message: budget.isNew ? 'Budget created successfully' : 'Budget updated successfully',
      data: budget
    });

  } catch (error) {
    console.error('Create/Update budget error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/budget/:month/category
// @desc    Update specific category budget
// @access  Private
router.put('/:month/category', auth, [
  param('month')
    .matches(/^\d{4}-\d{2}$/)
    .withMessage('Month must be in YYYY-MM format'),
  body('categoryName')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Category name is required'),
  body('budgetAmount')
    .isFloat({ min: 0 })
    .withMessage('Budget amount must be non-negative'),
  body('color')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Color must be a valid hex color')
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

    const { month } = req.params;
    const { categoryName, budgetAmount, color } = req.body;

    let budget = await Budget.findOne({ user: req.user.id, month });

    if (!budget) {
      // Create new budget if it doesn't exist
      budget = new Budget({
        user: req.user.id,
        month,
        categories: [{
          name: categoryName,
          budgetAmount,
          spentAmount: 0,
          color: color || Budget.getCategoryColor(categoryName)
        }],
        savingsGoal: 0
      });

      budget.calculateTotalBudget();
      budget.calculateTotalSpent();
      await budget.save();
    } else {
      // Update existing budget using findOneAndUpdate
      const categoryIndex = budget.categories.findIndex(cat => cat.name === categoryName);

      if (categoryIndex >= 0) {
        // Update existing category
        budget.categories[categoryIndex].budgetAmount = budgetAmount;
        if (color) budget.categories[categoryIndex].color = color;
      } else {
        // Add new category
        budget.categories.push({
          name: categoryName,
          budgetAmount,
          spentAmount: 0,
          color: color || Budget.getCategoryColor(categoryName)
        });
      }

      const totalBudget = budget.categories.reduce((sum, cat) => sum + cat.budgetAmount, 0);
      const totalSpent = budget.categories.reduce((sum, cat) => sum + cat.spentAmount, 0);

      budget = await Budget.findOneAndUpdate(
        { user: req.user.id, month },
        {
          categories: budget.categories,
          totalBudget,
          totalSpent
        },
        {
          new: true,
          runValidators: true,
          useFindAndModify: false
        }
      );
    }

    res.json({
      success: true,
      message: 'Category budget updated successfully',
      data: budget
    });

  } catch (error) {
    console.error('Update category budget error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/budget/:month/alerts
// @desc    Get budget alerts for specific month
// @access  Private
router.get('/:month/alerts', auth, [
  param('month')
    .matches(/^\d{4}-\d{2}$/)
    .withMessage('Month must be in YYYY-MM format')
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

    const { month } = req.params;
    const budget = await Budget.findOne({ user: req.user.id, month });

    if (!budget) {
      return res.json({
        success: true,
        data: []
      });
    }

    // Get unread alerts
    const unreadAlerts = budget.alerts.filter(alert => !alert.isRead);

    res.json({
      success: true,
      data: unreadAlerts
    });

  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/budget/:month/alerts/:alertId/read
// @desc    Mark alert as read
// @access  Private
router.put('/:month/alerts/:alertId/read', auth, [
  param('month')
    .matches(/^\d{4}-\d{2}$/)
    .withMessage('Month must be in YYYY-MM format'),
  param('alertId')
    .isMongoId()
    .withMessage('Alert ID must be valid')
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

    const { month, alertId } = req.params;
    const budget = await Budget.findOne({ user: req.user.id, month });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found'
      });
    }

    const alert = budget.alerts.id(alertId);
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    // Update the alert using findOneAndUpdate
    await Budget.findOneAndUpdate(
      {
        user: req.user.id,
        month,
        'alerts._id': alertId
      },
      {
        '$set': { 'alerts.$.isRead': true }
      },
      {
        new: true,
        useFindAndModify: false
      }
    );

    res.json({
      success: true,
      message: 'Alert marked as read'
    });

  } catch (error) {
    console.error('Mark alert read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/budget/summary/:year
// @desc    Get budget summary for the year
// @access  Private
router.get('/summary/:year', auth, [
  param('year')
    .isInt({ min: 2020, max: 2030 })
    .withMessage('Year must be between 2020 and 2030')
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

    const { year } = req.params;
    
    const budgets = await Budget.find({
      user: req.user.id,
      month: { $regex: `^${year}-` }
    }).sort({ month: 1 });

    const summary = {
      year: parseInt(year),
      months: budgets.map(budget => ({
        month: budget.month,
        totalBudget: budget.totalBudget,
        totalSpent: budget.totalSpent,
        remainingBudget: budget.remainingBudget,
        utilizationPercentage: budget.utilizationPercentage,
        savingsGoal: budget.savingsGoal,
        categories: budget.categories.length,
        alerts: budget.alerts.filter(alert => !alert.isRead).length
      })),
      totals: {
        totalBudgeted: budgets.reduce((sum, b) => sum + b.totalBudget, 0),
        totalSpent: budgets.reduce((sum, b) => sum + b.totalSpent, 0),
        totalSavingsGoal: budgets.reduce((sum, b) => sum + b.savingsGoal, 0),
        totalAlerts: budgets.reduce((sum, b) => sum + b.alerts.filter(alert => !alert.isRead).length, 0)
      }
    };

    res.json({
      success: true,
      data: summary
    });

  } catch (error) {
    console.error('Get budget summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
