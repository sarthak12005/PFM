const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/transactions
// @desc    Get all transactions for user
// @access  Private
router.get('/', auth, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 1000 }).withMessage('Limit must be between 1 and 1000'),
  query('type').optional().custom(value => !value || ['income', 'expense'].includes(value)).withMessage('Type must be income or expense'),
  query('category').optional().trim(),
  query('startDate').optional().custom(value => !value || !isNaN(Date.parse(value))).withMessage('Start date must be valid'),
  query('endDate').optional().custom(value => !value || !isNaN(Date.parse(value))).withMessage('End date must be valid')
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
      page = 1,
      limit = 20,
      type,
      category,
      startDate,
      endDate,
      search
    } = req.query;

    // Build query
    const query = { user: req.user.id };

    if (type) query.type = type;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const transactions = await Transaction.find(query)
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/transactions/summary
// @desc    Get transaction summary for user
// @access  Private
router.get('/summary', auth, [
  query('startDate').optional().isISO8601().withMessage('Start date must be valid'),
  query('endDate').optional().isISO8601().withMessage('End date must be valid')
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

    const { startDate, endDate } = req.query;

    const summary = await Transaction.getUserSummary(req.user.id, startDate, endDate);

    res.json({
      success: true,
      data: summary
    });

  } catch (error) {
    console.error('Get summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/transactions/categories
// @desc    Get category breakdown
// @access  Private
router.get('/categories', auth, [
  query('type').optional().isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  query('startDate').optional().isISO8601().withMessage('Start date must be valid'),
  query('endDate').optional().isISO8601().withMessage('End date must be valid')
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

    const { type = 'expense', startDate, endDate } = req.query;

    const categories = await Transaction.getCategoryBreakdown(req.user.id, type, startDate, endDate);

    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/transactions/monthly
// @desc    Get monthly transaction data
// @access  Private
router.get('/monthly', auth, [
  query('months').optional().isInt({ min: 1, max: 24 }).withMessage('Months must be between 1 and 24')
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

    const { months = 6 } = req.query;

    const monthlyData = await Transaction.getMonthlyData(req.user.id, parseInt(months));

    res.json({
      success: true,
      data: monthlyData
    });

  } catch (error) {
    console.error('Get monthly data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/transactions
// @desc    Create new transaction
// @access  Private
router.post('/', auth, [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('type')
    .isIn(['income', 'expense'])
    .withMessage('Type must be income or expense'),
  body('category')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Category is required'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be valid'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot be more than 500 characters')
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

    const transactionData = {
      ...req.body,
      user: req.user.id,
      date: req.body.date || new Date()
    };

    const transaction = new Transaction(transactionData);
    await transaction.save();

    // Update budget if it's an expense
    if (transaction.type === 'expense') {
      await Budget.updateBudgetFromTransaction(transaction);
    }

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: transaction
    });

  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/transactions/:id
// @desc    Update transaction
// @access  Private
router.put('/:id', auth, [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('amount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('type')
    .optional()
    .isIn(['income', 'expense'])
    .withMessage('Type must be income or expense'),
  body('category')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Category is required'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be valid'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot be more than 500 characters')
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

    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Store old values for budget update
    const oldTransaction = { ...transaction.toObject() };

    // Update transaction
    Object.assign(transaction, req.body);
    await transaction.save();

    // Update budget if expense category or amount changed
    if (transaction.type === 'expense' || oldTransaction.type === 'expense') {
      // Remove old budget impact
      if (oldTransaction.type === 'expense') {
        await Budget.updateBudgetFromTransaction(oldTransaction, true);
      }
      // Add new budget impact
      if (transaction.type === 'expense') {
        await Budget.updateBudgetFromTransaction(transaction);
      }
    }

    res.json({
      success: true,
      message: 'Transaction updated successfully',
      data: transaction
    });

  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/transactions/:id
// @desc    Delete transaction
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Update budget if it's an expense
    if (transaction.type === 'expense') {
      await Budget.updateBudgetFromTransaction(transaction, true);
    }

    await transaction.deleteOne();

    res.json({
      success: true,
      message: 'Transaction deleted successfully'
    });

  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
