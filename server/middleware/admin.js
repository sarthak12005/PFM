const User = require('../models/User');

// Middleware to check if user is admin
const adminAuth = async (req, res, next) => {
  try {
    // Check if user is authenticated (auth middleware should run first)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Authentication required.'
      });
    }

    // Get user with role information
    const user = await User.findById(req.user.id).select('+role');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. User not found.'
      });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    // Check if admin account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin account is inactive.'
      });
    }

    // Add admin user to request object
    req.admin = user;
    next();
  } catch (error) {
    // console.error('Admin auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during admin authentication'
    });
  }
};

// Middleware to check if user has specific admin permissions
const checkAdminPermission = (permission) => {
  return async (req, res, next) => {
    try {
      // For now, all admins have all permissions
      // In the future, you can implement granular permissions
      const adminPermissions = {
        'manage_users': true,
        'manage_offers': true,
        'manage_memberships': true,
        'view_analytics': true,
        'system_settings': true
      };

      if (!adminPermissions[permission]) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Permission '${permission}' required.`
        });
      }

      next();
    } catch (error) {
      // console.error('Admin permission check error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during permission check'
      });
    }
  };
};

// Helper function to check if email is admin
const isAdminEmail = (email) => {
  const adminEmails = ['sarthakjoshi12005@gmail.com'];
  return adminEmails.includes(email.toLowerCase());
};

// Helper function to promote user to admin (for initial setup)
const promoteToAdmin = async (email) => {
  try {
    if (!isAdminEmail(email)) {
      throw new Error('Email not authorized for admin access');
    }

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { role: 'admin' },
      { new: true }
    );

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  adminAuth,
  checkAdminPermission,
  isAdminEmail,
  promoteToAdmin
};
