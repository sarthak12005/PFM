const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'Category ID is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    unique: true
  },
  type: {
    type: String,
    required: [true, 'Category type is required'],
    enum: {
      values: ['income', 'expense'],
      message: 'Type must be either income or expense'
    }
  },
  icon: {
    type: String,
    required: [true, 'Icon is required']
  },
  color: {
    type: String,
    required: [true, 'Color is required'],
    match: [/^#[0-9A-F]{6}$/i, 'Color must be a valid hex code']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  isDefault: {
    type: Boolean,
    default: true,
    description: 'Indicates if this is a default system category'
  },
  isActive: {
    type: Boolean,
    default: true,
    description: 'Can be used to deactivate categories'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
categorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
categorySchema.index({ type: 1, isActive: 1 });
categorySchema.index({ name: 1 });

module.exports = mongoose.model('Category', categorySchema);
