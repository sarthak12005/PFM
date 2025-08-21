const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  profilePhoto: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  membershipTier: {
    type: String,
    enum: ['free', 'premium', 'enterprise'],
    default: 'free'
  },
  membershipExpiry: {
    type: Date
  },
  settings: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    },
    notifications: {
      monthlyReport: { type: Boolean, default: true },
      highExpenseAlert: { type: Boolean, default: true },
      budgetAlert: { type: Boolean, default: true },
      emailNotifications: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: false }
    },
    budgetGoals: {
      monthlySavingsGoal: { type: Number, default: 10000 },
      categoryLimits: {
        type: Map,
        of: Number,
        default: new Map([
          ['Food', 5000],
          ['Transportation', 3000],
          ['Entertainment', 2000],
          ['Shopping', 4000],
          ['Utilities', 2500]
        ])
      }
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for user ID display
userSchema.virtual('userId').get(function() {
  return `USR${this._id.toString().slice(-6).toUpperCase()}`;
});

// Virtual for total transactions count
userSchema.virtual('totalTransactions', {
  ref: 'Transaction',
  localField: '_id',
  foreignField: 'user',
  count: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update last login
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save({ validateBeforeSave: false });
};

// Get user profile data
userSchema.methods.getProfileData = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    profilePhoto: this.profilePhoto,
    userId: this.userId,
    joinedDate: this.createdAt,
    lastLogin: this.lastLogin,
    settings: this.settings,
    isActive: this.isActive,
    role: this.role,
    membershipTier: this.membershipTier,
    membershipExpiry: this.membershipExpiry
  };
};

// Remove sensitive data from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
