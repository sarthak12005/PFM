const express = require('express');
const { body, validationResult } = require('express-validator');
const Membership = require('../models/Membership');
const auth = require('../middleware/auth');
const { adminAuth, checkAdminPermission } = require('../middleware/admin');

const router = express.Router();

// @route   GET /api/memberships
// @desc    Get all active memberships (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const memberships = await Membership.getActiveMemberships();
    
    res.json({
      success: true,
      data: { memberships }
    });
  } catch (error) {
    console.error('Get memberships error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching memberships'
    });
  }
});

// @route   GET /api/memberships/:tier
// @desc    Get specific membership by tier
// @access  Public
router.get('/:tier', async (req, res) => {
  try {
    const { tier } = req.params;
    
    const membership = await Membership.findOne({ 
      tier, 
      isActive: true 
    }).populate('createdBy', 'name email');
    
    if (!membership) {
      return res.status(404).json({
        success: false,
        message: 'Membership tier not found'
      });
    }
    
    res.json({
      success: true,
      data: { membership }
    });
  } catch (error) {
    console.error('Get membership error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching membership'
    });
  }
});

// Admin routes (require authentication and admin privileges)
router.use(auth);
router.use(adminAuth);

// @route   POST /api/memberships
// @desc    Create new membership (admin only)
// @access  Private (Admin only)
router.post('/', [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Name is required and must be less than 100 characters'),
  body('tier').isIn(['free', 'premium', 'enterprise']).withMessage('Tier must be free, premium, or enterprise'),
  body('description').trim().isLength({ min: 1, max: 500 }).withMessage('Description is required and must be less than 500 characters'),
  body('pricing.monthly').isNumeric({ min: 0 }).withMessage('Monthly price must be a positive number'),
  body('pricing.yearly').isNumeric({ min: 0 }).withMessage('Yearly price must be a positive number'),
  body('features').isArray({ min: 1 }).withMessage('At least one feature is required'),
  body('features.*.name').trim().isLength({ min: 1 }).withMessage('Feature name is required'),
  body('features.*.description').trim().isLength({ min: 1 }).withMessage('Feature description is required')
], checkAdminPermission('manage_memberships'), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const membershipData = {
      ...req.body,
      createdBy: req.admin._id
    };

    const membership = new Membership(membershipData);
    await membership.save();

    res.status(201).json({
      success: true,
      data: { membership },
      message: 'Membership created successfully'
    });
  } catch (error) {
    console.error('Create membership error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Membership tier already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating membership'
    });
  }
});

// @route   PUT /api/memberships/:id
// @desc    Update membership (admin only)
// @access  Private (Admin only)
router.put('/:id', [
  body('name').optional().trim().isLength({ min: 1, max: 100 }),
  body('tier').optional().isIn(['free', 'premium', 'enterprise']),
  body('description').optional().trim().isLength({ min: 1, max: 500 }),
  body('pricing.monthly').optional().isNumeric({ min: 0 }),
  body('pricing.yearly').optional().isNumeric({ min: 0 }),
  body('features').optional().isArray({ min: 1 }),
  body('isActive').optional().isBoolean()
], checkAdminPermission('manage_memberships'), async (req, res) => {
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
    const updates = {
      ...req.body,
      lastModifiedBy: req.admin._id
    };

    const membership = await Membership.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('createdBy lastModifiedBy', 'name email');

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: 'Membership not found'
      });
    }

    res.json({
      success: true,
      data: { membership },
      message: 'Membership updated successfully'
    });
  } catch (error) {
    console.error('Update membership error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Membership tier already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating membership'
    });
  }
});

// @route   DELETE /api/memberships/:id
// @desc    Delete membership (admin only)
// @access  Private (Admin only)
router.delete('/:id', checkAdminPermission('manage_memberships'), async (req, res) => {
  try {
    const { id } = req.params;

    const membership = await Membership.findByIdAndDelete(id);

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: 'Membership not found'
      });
    }

    res.json({
      success: true,
      message: 'Membership deleted successfully'
    });
  } catch (error) {
    console.error('Delete membership error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting membership'
    });
  }
});

// @route   GET /api/memberships/admin/all
// @desc    Get all memberships including inactive (admin only)
// @access  Private (Admin only)
router.get('/admin/all', checkAdminPermission('manage_memberships'), async (req, res) => {
  try {
    const memberships = await Membership.find()
      .sort({ order: 1, createdAt: -1 })
      .populate('createdBy lastModifiedBy', 'name email');
    
    res.json({
      success: true,
      data: { memberships }
    });
  } catch (error) {
    console.error('Get all memberships error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching memberships'
    });
  }
});

// @route   POST /api/memberships/:id/subscribers/increment
// @desc    Increment subscriber count (admin only)
// @access  Private (Admin only)
router.post('/:id/subscribers/increment', checkAdminPermission('manage_memberships'), async (req, res) => {
  try {
    const { id } = req.params;
    
    const membership = await Membership.findById(id);
    if (!membership) {
      return res.status(404).json({
        success: false,
        message: 'Membership not found'
      });
    }
    
    await membership.incrementSubscribers();
    
    res.json({
      success: true,
      data: { membership },
      message: 'Subscriber count updated'
    });
  } catch (error) {
    console.error('Increment subscribers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating subscriber count'
    });
  }
});

module.exports = router;
