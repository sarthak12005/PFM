const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Offer title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Offer description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Offer category is required'],
    enum: ['credit_card', 'savings_account', 'investment', 'insurance', 'loan', 'other']
  },
  type: {
    type: String,
    required: [true, 'Offer type is required'],
    enum: ['cashback', 'rewards', 'low_interest', 'high_yield', 'bonus', 'discount']
  },
  provider: {
    name: {
      type: String,
      required: [true, 'Provider name is required'],
      trim: true
    },
    logo: {
      type: String, // URL to logo image
      default: null
    },
    website: {
      type: String,
      trim: true
    }
  },
  features: [{
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
    icon: {
      type: String, // Icon name or URL
      default: 'star'
    }
  }],
  benefits: {
    primaryBenefit: {
      type: String,
      required: [true, 'Primary benefit is required'],
      trim: true
    },
    secondaryBenefits: [{
      type: String,
      trim: true
    }],
    cashbackRate: {
      type: Number,
      min: 0,
      max: 100 // Percentage
    },
    interestRate: {
      type: Number,
      min: 0,
      max: 100 // Percentage
    },
    bonusAmount: {
      type: Number,
      min: 0
    }
  },
  requirements: {
    minimumIncome: {
      type: Number,
      min: 0
    },
    creditScore: {
      type: Number,
      min: 300,
      max: 850
    },
    minimumDeposit: {
      type: Number,
      min: 0
    },
    eligibilityCriteria: [{
      type: String,
      trim: true
    }]
  },
  terms: {
    duration: {
      type: String, // e.g., "12 months", "Lifetime", "2 years"
      trim: true
    },
    fees: {
      annual: { type: Number, default: 0 },
      monthly: { type: Number, default: 0 },
      processing: { type: Number, default: 0 }
    },
    limitations: [{
      type: String,
      trim: true
    }]
  },
  applicationLink: {
    type: String,
    required: [true, 'Application link is required'],
    trim: true
  },
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  popularity: {
    views: {
      type: Number,
      default: 0
    },
    applications: {
      type: Number,
      default: 0
    },
    conversions: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'expired', 'pending'],
    default: 'active'
  },
  priority: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  validFrom: {
    type: Date,
    default: Date.now
  },
  validUntil: {
    type: Date
  },
  targetAudience: {
    membershipTiers: [{
      type: String,
      enum: ['free', 'premium', 'enterprise']
    }],
    incomeRange: {
      min: { type: Number, default: 0 },
      max: { type: Number }
    },
    ageRange: {
      min: { type: Number, default: 18 },
      max: { type: Number, default: 100 }
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

// Virtual for conversion rate
offerSchema.virtual('conversionRate').get(function() {
  if (this.popularity.views === 0) return 0;
  return ((this.popularity.conversions / this.popularity.views) * 100).toFixed(2);
});

// Index for better query performance
offerSchema.index({ category: 1, status: 1 });
offerSchema.index({ priority: -1, createdAt: -1 });
offerSchema.index({ 'targetAudience.membershipTiers': 1 });

// Method to increment views
offerSchema.methods.incrementViews = function() {
  this.popularity.views += 1;
  return this.save({ validateBeforeSave: false });
};

// Method to increment applications
offerSchema.methods.incrementApplications = function() {
  this.popularity.applications += 1;
  return this.save({ validateBeforeSave: false });
};

// Method to increment conversions
offerSchema.methods.incrementConversions = function() {
  this.popularity.conversions += 1;
  return this.save({ validateBeforeSave: false });
};

// Static method to get active offers for user
offerSchema.statics.getActiveOffersForUser = function(user) {
  const query = {
    status: 'active',
    validFrom: { $lte: new Date() },
    $or: [
      { validUntil: { $exists: false } },
      { validUntil: { $gte: new Date() } }
    ]
  };

  // Filter by membership tier if specified
  if (user.membershipTier) {
    query['targetAudience.membershipTiers'] = { $in: [user.membershipTier] };
  }

  return this.find(query)
    .sort({ priority: -1, createdAt: -1 })
    .populate('createdBy', 'name email');
};

module.exports = mongoose.model('Offer', offerSchema);
