const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Membership name is required'],
    trim: true,
    unique: true
  },
  tier: {
    type: String,
    required: [true, 'Membership tier is required'],
    enum: ['free', 'premium', 'enterprise'],
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Membership description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  pricing: {
    monthly: {
      type: Number,
      required: [true, 'Monthly price is required'],
      min: 0
    },
    yearly: {
      type: Number,
      required: [true, 'Yearly price is required'],
      min: 0
    },
    currency: {
      type: String,
      default: 'INR'
    },
    discount: {
      percentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      validUntil: {
        type: Date
      }
    }
  },
  features: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    icon: {
      type: String,
      default: 'check'
    },
    isHighlight: {
      type: Boolean,
      default: false
    }
  }],
  limits: {
    transactions: {
      monthly: {
        type: Number,
        default: -1 // -1 means unlimited
      }
    },
    budgets: {
      count: {
        type: Number,
        default: -1
      }
    },
    goals: {
      count: {
        type: Number,
        default: -1
      }
    },
    categories: {
      custom: {
        type: Number,
        default: -1
      }
    },
    reports: {
      advanced: {
        type: Boolean,
        default: false
      },
      export: {
        type: Boolean,
        default: false
      }
    },
    support: {
      priority: {
        type: Boolean,
        default: false
      },
      phone: {
        type: Boolean,
        default: false
      },
      chat: {
        type: Boolean,
        default: false
      }
    }
  },
  benefits: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    value: {
      type: String, // e.g., "Unlimited", "24/7", "$100 bonus"
      trim: true
    }
  }],
  color: {
    primary: {
      type: String,
      default: '#3B82F6'
    },
    secondary: {
      type: String,
      default: '#EFF6FF'
    }
  },
  badge: {
    text: {
      type: String,
      trim: true
    },
    color: {
      type: String,
      default: '#10B981'
    }
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  statistics: {
    totalSubscribers: {
      type: Number,
      default: 0
    },
    activeSubscribers: {
      type: Number,
      default: 0
    },
    monthlyRevenue: {
      type: Number,
      default: 0
    },
    conversionRate: {
      type: Number,
      default: 0
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for effective monthly price (considering discount)
membershipSchema.virtual('effectiveMonthlyPrice').get(function() {
  const discount = this.pricing.discount;
  if (discount.percentage > 0 && discount.validUntil && discount.validUntil > new Date()) {
    return this.pricing.monthly * (1 - discount.percentage / 100);
  }
  return this.pricing.monthly;
});

// Virtual for effective yearly price (considering discount)
membershipSchema.virtual('effectiveYearlyPrice').get(function() {
  const discount = this.pricing.discount;
  if (discount.percentage > 0 && discount.validUntil && discount.validUntil > new Date()) {
    return this.pricing.yearly * (1 - discount.percentage / 100);
  }
  return this.pricing.yearly;
});

// Virtual for yearly savings
membershipSchema.virtual('yearlySavings').get(function() {
  return (this.effectiveMonthlyPrice * 12) - this.effectiveYearlyPrice;
});

// Index for better query performance
membershipSchema.index({ tier: 1 });
membershipSchema.index({ isActive: 1, order: 1 });

// Static method to get all active memberships
membershipSchema.statics.getActiveMemberships = function() {
  return this.find({ isActive: true })
    .sort({ order: 1 })
    .populate('createdBy', 'name email');
};

// Method to increment subscriber count
membershipSchema.methods.incrementSubscribers = function() {
  this.statistics.totalSubscribers += 1;
  this.statistics.activeSubscribers += 1;
  return this.save({ validateBeforeSave: false });
};

// Method to decrement active subscriber count
membershipSchema.methods.decrementActiveSubscribers = function() {
  this.statistics.activeSubscribers = Math.max(0, this.statistics.activeSubscribers - 1);
  return this.save({ validateBeforeSave: false });
};

// Method to update monthly revenue
membershipSchema.methods.updateMonthlyRevenue = function(amount) {
  this.statistics.monthlyRevenue += amount;
  return this.save({ validateBeforeSave: false });
};

module.exports = mongoose.model('Membership', membershipSchema);
