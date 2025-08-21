const express = require('express');
const { body, validationResult, query } = require('express-validator');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Offer = require('../models/Offer');
const Membership = require('../models/Membership');
const auth = require('../middleware/auth');
const { adminAuth, checkAdminPermission } = require('../middleware/admin');

const router = express.Router();

// Apply auth and adminAuth middleware to all admin routes
router.use(auth);
router.use(adminAuth);

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin only)
router.get('/dashboard', async (req, res) => {
  try {
    console.log('Admin dashboard request from user:', req.admin.email);

    // Get basic user statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });

    // Get basic transaction statistics (with error handling)
    let totalTransactions = 0;
    let totalIncome = 0;
    let totalExpenses = 0;

    try {
      totalTransactions = await Transaction.countDocuments();

      const incomeResult = await Transaction.aggregate([
        { $match: { type: 'income' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      totalIncome = incomeResult[0]?.total || 0;

      const expenseResult = await Transaction.aggregate([
        { $match: { type: 'expense' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      totalExpenses = expenseResult[0]?.total || 0;
    } catch (transactionError) {
      console.log('Transaction queries failed, using defaults:', transactionError.message);
    }

    // Get basic offer statistics
    let totalOffers = 0;
    let activeOffers = 0;

    try {
      totalOffers = await Offer.countDocuments();
      activeOffers = await Offer.countDocuments({ status: 'active' });
    } catch (offerError) {
      console.log('Offer queries failed, using defaults:', offerError.message);
    }

    // Get basic membership statistics
    let membershipStats = [];
    try {
      membershipStats = await User.aggregate([
        { $group: { _id: '$membershipTier', count: { $sum: 1 } } }
      ]);
    } catch (membershipError) {
      console.log('Membership queries failed, using defaults:', membershipError.message);
    }

    // Get recent users (simplified)
    let recentUsers = [];
    try {
      recentUsers = await User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email createdAt membershipTier');
    } catch (userError) {
      console.log('Recent users query failed, using defaults:', userError.message);
    }

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          newThisMonth: 0, // Simplified for now
          growth: []
        },
        transactions: {
          total: totalTransactions,
          thisMonth: 0, // Simplified for now
          totalIncome,
          totalExpenses,
          netSavings: totalIncome - totalExpenses
        },
        offers: {
          total: totalOffers,
          active: activeOffers
        },
        memberships: membershipStats,
        recentActivity: {
          users: recentUsers,
          transactions: [] // Simplified for now
        }
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admin dashboard data',
      error: error.message
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with pagination and filters
// @access  Private (Admin only)
router.get('/users', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().trim(),
  query('membershipTier').optional().isIn(['free', 'premium', 'enterprise']),
  query('isActive').optional().isBoolean()
], checkAdminPermission('manage_users'), async (req, res) => {
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
      search,
      membershipTier,
      isActive
    } = req.query;

    // Build query
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (membershipTier) query.membershipTier = membershipTier;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const skip = (page - 1) * limit;
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user (admin can modify any user)
// @access  Private (Admin only)
router.put('/users/:id', [
  body('name').optional().trim().isLength({ min: 1, max: 50 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('membershipTier').optional().isIn(['free', 'premium', 'enterprise']),
  body('isActive').optional().isBoolean(),
  body('role').optional().isIn(['user', 'admin'])
], checkAdminPermission('manage_users'), async (req, res) => {
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
    const updates = req.body;

    // Prevent admin from demoting themselves
    if (id === req.admin._id.toString() && updates.role === 'user') {
      return res.status(400).json({
        success: false,
        message: 'Cannot demote yourself from admin role'
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { ...updates, lastModifiedBy: req.admin._id },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user },
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Admin update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user'
    });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user (soft delete by setting isActive to false)
// @access  Private (Admin only)
router.delete('/users/:id', checkAdminPermission('manage_users'), async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (id === req.admin._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own admin account'
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { isActive: false, lastModifiedBy: req.admin._id },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user },
      message: 'User deactivated successfully'
    });
  } catch (error) {
    console.error('Admin delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deactivating user'
    });
  }
});

module.exports = router;
