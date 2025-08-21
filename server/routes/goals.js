const express = require('express');
const router = express.Router();
const { body, query, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

// Sample goals data (in production, this would come from a database)
const sampleGoals = [
  {
    _id: '1',
    user: 'demo-user-id',
    title: 'Emergency Fund',
    description: 'Build 6 months of expenses as emergency fund',
    targetAmount: 300000,
    currentAmount: 125000,
    type: 'emergency',
    targetDate: '2025-12-31',
    status: 'active',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-07-15T00:00:00Z'
  },
  {
    _id: '2',
    user: 'demo-user-id',
    title: 'Dream Vacation',
    description: 'Trip to Europe with family',
    targetAmount: 150000,
    currentAmount: 45000,
    type: 'vacation',
    targetDate: '2025-08-15',
    status: 'active',
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2025-07-20T00:00:00Z'
  },
  {
    _id: '3',
    user: 'demo-user-id',
    title: 'New Car',
    description: 'Save for down payment on new car',
    targetAmount: 200000,
    currentAmount: 200000,
    type: 'car',
    targetDate: '2025-06-30',
    status: 'completed',
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2025-06-30T00:00:00Z'
  }
];

// @route   GET /api/goals
// @desc    Get all goals for user
// @access  Private
router.get('/', auth, [
  query('status').optional().isIn(['active', 'completed', 'paused']).withMessage('Invalid status'),
  query('type').optional().trim()
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

    const { status, type } = req.query;

    // Filter goals by user
    let userGoals = sampleGoals.filter(goal => goal.user === req.user.id || goal.user === 'demo-user-id');

    // Apply filters
    if (status) {
      userGoals = userGoals.filter(goal => goal.status === status);
    }

    if (type) {
      userGoals = userGoals.filter(goal => goal.type === type);
    }

    // Sort by creation date (newest first)
    userGoals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      data: userGoals
    });

  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/goals/:id
// @desc    Get single goal by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const goal = sampleGoals.find(goal => 
      goal._id === id && (goal.user === req.user.id || goal.user === 'demo-user-id')
    );

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    res.json({
      success: true,
      data: goal
    });

  } catch (error) {
    console.error('Get goal error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/goals
// @desc    Create new goal
// @access  Private
router.post('/', auth, [
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title must be 1-100 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must be max 500 characters'),
  body('targetAmount').isFloat({ min: 1 }).withMessage('Target amount must be greater than 0'),
  body('type').isIn(['emergency', 'vacation', 'house', 'car', 'education', 'retirement', 'health', 'other']).withMessage('Invalid goal type'),
  body('targetDate').isISO8601().withMessage('Invalid target date'),
  body('currentAmount').optional().isFloat({ min: 0 }).withMessage('Current amount must be 0 or greater')
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
      title,
      description = '',
      targetAmount,
      type,
      targetDate,
      currentAmount = 0
    } = req.body;

    // Check if target date is in the future
    const targetDateObj = new Date(targetDate);
    if (targetDateObj <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Target date must be in the future'
      });
    }

    const newGoal = {
      _id: Date.now().toString(),
      user: req.user.id,
      title,
      description,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount),
      type,
      targetDate,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // In real app, save to database
    sampleGoals.push(newGoal);

    res.status(201).json({
      success: true,
      message: 'Goal created successfully',
      data: newGoal
    });

  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/goals/:id
// @desc    Update goal
// @access  Private
router.put('/:id', auth, [
  body('title').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Title must be 1-100 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must be max 500 characters'),
  body('targetAmount').optional().isFloat({ min: 1 }).withMessage('Target amount must be greater than 0'),
  body('currentAmount').optional().isFloat({ min: 0 }).withMessage('Current amount must be 0 or greater'),
  body('targetDate').optional().isISO8601().withMessage('Invalid target date'),
  body('status').optional().isIn(['active', 'completed', 'paused']).withMessage('Invalid status')
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
    const goalIndex = sampleGoals.findIndex(goal => 
      goal._id === id && (goal.user === req.user.id || goal.user === 'demo-user-id')
    );

    if (goalIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    // Update goal
    const updatedGoal = {
      ...sampleGoals[goalIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    // Auto-complete goal if current amount reaches target
    if (updatedGoal.currentAmount >= updatedGoal.targetAmount && updatedGoal.status === 'active') {
      updatedGoal.status = 'completed';
    }

    sampleGoals[goalIndex] = updatedGoal;

    res.json({
      success: true,
      message: 'Goal updated successfully',
      data: updatedGoal
    });

  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/goals/:id
// @desc    Delete goal
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const goalIndex = sampleGoals.findIndex(goal => 
      goal._id === id && (goal.user === req.user.id || goal.user === 'demo-user-id')
    );

    if (goalIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    sampleGoals.splice(goalIndex, 1);

    res.json({
      success: true,
      message: 'Goal deleted successfully'
    });

  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/goals/:id/progress
// @desc    Add progress to goal
// @access  Private
router.post('/:id/progress', auth, [
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('note').optional().trim().isLength({ max: 200 }).withMessage('Note must be max 200 characters')
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
    const { amount, note = '' } = req.body;

    const goalIndex = sampleGoals.findIndex(goal => 
      goal._id === id && (goal.user === req.user.id || goal.user === 'demo-user-id')
    );

    if (goalIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    const goal = sampleGoals[goalIndex];

    // Update current amount
    goal.currentAmount += parseFloat(amount);
    goal.updatedAt = new Date().toISOString();

    // Auto-complete goal if target is reached
    if (goal.currentAmount >= goal.targetAmount && goal.status === 'active') {
      goal.status = 'completed';
    }

    sampleGoals[goalIndex] = goal;

    res.json({
      success: true,
      message: 'Progress added successfully',
      data: goal
    });

  } catch (error) {
    console.error('Add progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/goals/stats/summary
// @desc    Get goals summary statistics
// @access  Private
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const userGoals = sampleGoals.filter(goal => goal.user === req.user.id || goal.user === 'demo-user-id');

    const stats = {
      totalGoals: userGoals.length,
      activeGoals: userGoals.filter(g => g.status === 'active').length,
      completedGoals: userGoals.filter(g => g.status === 'completed').length,
      pausedGoals: userGoals.filter(g => g.status === 'paused').length,
      totalTargetAmount: userGoals.reduce((sum, g) => sum + g.targetAmount, 0),
      totalCurrentAmount: userGoals.reduce((sum, g) => sum + g.currentAmount, 0),
      averageProgress: userGoals.length > 0 ? 
        userGoals.reduce((sum, g) => sum + (g.currentAmount / g.targetAmount * 100), 0) / userGoals.length : 0
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get goals stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
