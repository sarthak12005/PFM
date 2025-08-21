const express = require('express');
const router = express.Router();
const { body, query, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

// Sample notifications data
const sampleNotifications = [
  {
    _id: '1',
    user: 'demo-user-id',
    title: 'Budget Alert: Food Category',
    message: 'You have spent 85% of your food budget for this month.',
    type: 'budget',
    priority: 'high',
    isRead: false,
    createdAt: '2025-08-01T10:30:00Z',
    data: { category: 'Food', percentage: 85, budgetId: 'budget-1' }
  },
  {
    _id: '2',
    user: 'demo-user-id',
    title: 'Goal Achievement',
    message: 'Congratulations! You have reached 50% of your vacation savings goal.',
    type: 'goal',
    priority: 'medium',
    isRead: false,
    createdAt: '2025-08-01T09:15:00Z',
    data: { goalName: 'Vacation', percentage: 50, goalId: 'goal-2' }
  },
  {
    _id: '3',
    user: 'demo-user-id',
    title: 'Large Transaction Detected',
    message: 'A transaction of ₹25,000 was recorded in your account.',
    type: 'transaction',
    priority: 'medium',
    isRead: true,
    createdAt: '2025-07-31T16:45:00Z',
    data: { amount: 25000, category: 'Shopping', transactionId: 'txn-123' }
  },
  {
    _id: '4',
    user: 'demo-user-id',
    title: 'Monthly Report Ready',
    message: 'Your July financial report is now available for download.',
    type: 'system',
    priority: 'low',
    isRead: true,
    createdAt: '2025-07-31T08:00:00Z',
    data: { reportType: 'monthly', month: 'July', reportId: 'report-july-2025' }
  },
  {
    _id: '5',
    user: 'demo-user-id',
    title: 'Bill Reminder',
    message: 'Your electricity bill is due in 3 days.',
    type: 'reminder',
    priority: 'high',
    isRead: false,
    createdAt: '2025-07-30T12:00:00Z',
    data: { billType: 'Electricity', dueDate: '2025-08-03', amount: 2500 }
  },
  {
    _id: '6',
    user: 'demo-user-id',
    title: 'Savings Milestone',
    message: 'You\'ve saved ₹50,000 this year! Keep up the great work.',
    type: 'achievement',
    priority: 'medium',
    isRead: false,
    createdAt: '2025-07-29T14:20:00Z',
    data: { milestone: 50000, year: 2025 }
  }
];

// @route   GET /api/notifications
// @desc    Get all notifications for user
// @access  Private
router.get('/', auth, [
  query('type').optional().isIn(['budget', 'goal', 'transaction', 'reminder', 'system', 'achievement']).withMessage('Invalid type'),
  query('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  query('isRead').optional().isBoolean().withMessage('Invalid isRead value'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
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
      type,
      priority,
      isRead,
      page = 1,
      limit = 20
    } = req.query;

    // Filter notifications by user
    let userNotifications = sampleNotifications.filter(notif => 
      notif.user === req.user.id || notif.user === 'demo-user-id'
    );

    // Apply filters
    if (type) {
      userNotifications = userNotifications.filter(notif => notif.type === type);
    }

    if (priority) {
      userNotifications = userNotifications.filter(notif => notif.priority === priority);
    }

    if (isRead !== undefined) {
      userNotifications = userNotifications.filter(notif => notif.isRead === (isRead === 'true'));
    }

    // Sort by creation date (newest first)
    userNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedNotifications = userNotifications.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedNotifications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(userNotifications.length / limit),
        totalNotifications: userNotifications.length,
        hasNext: endIndex < userNotifications.length,
        hasPrev: startIndex > 0
      }
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/notifications/unread/count
// @desc    Get unread notifications count
// @access  Private
router.get('/unread/count', auth, async (req, res) => {
  try {
    const userNotifications = sampleNotifications.filter(notif => 
      (notif.user === req.user.id || notif.user === 'demo-user-id') && !notif.isRead
    );

    res.json({
      success: true,
      data: {
        count: userNotifications.length,
        byType: {
          budget: userNotifications.filter(n => n.type === 'budget').length,
          goal: userNotifications.filter(n => n.type === 'goal').length,
          transaction: userNotifications.filter(n => n.type === 'transaction').length,
          reminder: userNotifications.filter(n => n.type === 'reminder').length,
          system: userNotifications.filter(n => n.type === 'system').length,
          achievement: userNotifications.filter(n => n.type === 'achievement').length
        },
        byPriority: {
          high: userNotifications.filter(n => n.priority === 'high').length,
          medium: userNotifications.filter(n => n.priority === 'medium').length,
          low: userNotifications.filter(n => n.priority === 'low').length
        }
      }
    });

  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const notificationIndex = sampleNotifications.findIndex(notif => 
      notif._id === id && (notif.user === req.user.id || notif.user === 'demo-user-id')
    );

    if (notificationIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    sampleNotifications[notificationIndex].isRead = true;
    sampleNotifications[notificationIndex].readAt = new Date().toISOString();

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: sampleNotifications[notificationIndex]
    });

  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put('/read-all', auth, async (req, res) => {
  try {
    let updatedCount = 0;
    const readAt = new Date().toISOString();

    sampleNotifications.forEach(notif => {
      if ((notif.user === req.user.id || notif.user === 'demo-user-id') && !notif.isRead) {
        notif.isRead = true;
        notif.readAt = readAt;
        updatedCount++;
      }
    });

    res.json({
      success: true,
      message: `${updatedCount} notifications marked as read`,
      data: { updatedCount }
    });

  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const notificationIndex = sampleNotifications.findIndex(notif => 
      notif._id === id && (notif.user === req.user.id || notif.user === 'demo-user-id')
    );

    if (notificationIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    sampleNotifications.splice(notificationIndex, 1);

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });

  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/notifications
// @desc    Create new notification (system use)
// @access  Private
router.post('/', auth, [
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title must be 1-100 characters'),
  body('message').trim().isLength({ min: 1, max: 500 }).withMessage('Message must be 1-500 characters'),
  body('type').isIn(['budget', 'goal', 'transaction', 'reminder', 'system', 'achievement']).withMessage('Invalid type'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('data').optional().isObject().withMessage('Data must be an object')
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
      message,
      type,
      priority = 'medium',
      data = {}
    } = req.body;

    const newNotification = {
      _id: Date.now().toString(),
      user: req.user.id,
      title,
      message,
      type,
      priority,
      isRead: false,
      createdAt: new Date().toISOString(),
      data
    };

    // In real app, save to database
    sampleNotifications.push(newNotification);

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: newNotification
    });

  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/notifications/settings
// @desc    Get notification preferences
// @access  Private
router.get('/settings', auth, async (req, res) => {
  try {
    // Sample notification settings
    const settings = {
      email: {
        budgetAlerts: true,
        goalUpdates: true,
        largeTransactions: true,
        weeklyReports: false,
        monthlyReports: true,
        systemUpdates: false
      },
      push: {
        budgetAlerts: true,
        goalUpdates: true,
        largeTransactions: false,
        weeklyReports: false,
        monthlyReports: false,
        systemUpdates: true
      },
      inApp: {
        budgetAlerts: true,
        goalUpdates: true,
        largeTransactions: true,
        weeklyReports: true,
        monthlyReports: true,
        systemUpdates: true
      },
      thresholds: {
        budgetAlert: 80, // percentage
        largeTransaction: 10000, // amount
        goalMilestone: 25 // percentage
      }
    };

    res.json({
      success: true,
      data: settings
    });

  } catch (error) {
    console.error('Get notification settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/notifications/settings
// @desc    Update notification preferences
// @access  Private
router.put('/settings', auth, [
  body('email').optional().isObject().withMessage('Email settings must be an object'),
  body('push').optional().isObject().withMessage('Push settings must be an object'),
  body('inApp').optional().isObject().withMessage('In-app settings must be an object'),
  body('thresholds').optional().isObject().withMessage('Thresholds must be an object')
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

    // In real app, update user's notification preferences in database
    const updatedSettings = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'Notification settings updated successfully',
      data: updatedSettings
    });

  } catch (error) {
    console.error('Update notification settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
