const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  month: {
    type: String,
    required: [true, 'Month is required'],
    match: [/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format']
  },
  categories: [{
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true
    },
    budgetAmount: {
      type: Number,
      required: [true, 'Budget amount is required'],
      min: [0, 'Budget amount cannot be negative']
    },
    spentAmount: {
      type: Number,
      default: 0,
      min: [0, 'Spent amount cannot be negative']
    },
    color: {
      type: String,
      default: '#3B82F6'
    }
  }],
  totalBudget: {
    type: Number,
    required: [true, 'Total budget is required'],
    min: [0, 'Total budget cannot be negative']
  },
  totalSpent: {
    type: Number,
    default: 0,
    min: [0, 'Total spent cannot be negative']
  },
  savingsGoal: {
    type: Number,
    default: 0,
    min: [0, 'Savings goal cannot be negative']
  },
  alerts: [{
    category: String,
    type: {
      type: String,
      enum: ['warning', 'exceeded', 'goal_reached'],
      required: true
    },
    message: String,
    threshold: Number,
    isRead: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index for user and month
budgetSchema.index({ user: 1, month: 1 }, { unique: true });

// Virtual for remaining budget
budgetSchema.virtual('remainingBudget').get(function() {
  return Math.max(0, this.totalBudget - this.totalSpent);
});

// Virtual for budget utilization percentage
budgetSchema.virtual('utilizationPercentage').get(function() {
  return this.totalBudget > 0 ? (this.totalSpent / this.totalBudget) * 100 : 0;
});

// Virtual for savings progress
budgetSchema.virtual('savingsProgress').get(function() {
  const actualSavings = Math.max(0, this.remainingBudget);
  return this.savingsGoal > 0 ? (actualSavings / this.savingsGoal) * 100 : 0;
});

// Method to add or update category budget
budgetSchema.methods.updateCategoryBudget = function(categoryName, budgetAmount, color = '#3B82F6') {
  const existingCategory = this.categories.find(cat => cat.name === categoryName);
  
  if (existingCategory) {
    existingCategory.budgetAmount = budgetAmount;
    existingCategory.color = color;
  } else {
    this.categories.push({
      name: categoryName,
      budgetAmount: budgetAmount,
      color: color,
      spentAmount: 0
    });
  }
  
  this.calculateTotalBudget();
  return this;
};

// Method to update spent amount for a category
budgetSchema.methods.updateCategorySpent = async function(categoryName, amount, isIncrease = true) {
  const category = this.categories.find(cat => cat.name === categoryName);
  
  if (category) {
    if (isIncrease) {
      category.spentAmount += amount;
    } else {
      category.spentAmount = Math.max(0, category.spentAmount - amount);
    }
    
    this.calculateTotalSpent();
    await this.checkAndCreateAlerts(categoryName, category);
  }
  
  return this;
};

// Method to calculate total budget
budgetSchema.methods.calculateTotalBudget = function() {
  this.totalBudget = this.categories.reduce((total, category) => total + category.budgetAmount, 0);
  return this;
};

// Method to calculate total spent
budgetSchema.methods.calculateTotalSpent = function() {
  this.totalSpent = this.categories.reduce((total, category) => total + category.spentAmount, 0);
  return this;
};

// Method to check and create alerts
budgetSchema.methods.checkAndCreateAlerts = async function(categoryName, category) {
  const utilizationPercentage = category.budgetAmount > 0 ? (category.spentAmount / category.budgetAmount) * 100 : 0;
  
  // Remove existing alerts for this category
  this.alerts = this.alerts.filter(alert => alert.category !== categoryName);
  
  if (utilizationPercentage >= 100) {
    this.alerts.push({
      category: categoryName,
      type: 'exceeded',
      message: `You have exceeded your ${categoryName} budget by ₹${(category.spentAmount - category.budgetAmount).toFixed(2)}`,
      threshold: 100,
      isRead: false
    });
  } else if (utilizationPercentage >= 80) {
    this.alerts.push({
      category: categoryName,
      type: 'warning',
      message: `You have used ${utilizationPercentage.toFixed(1)}% of your ${categoryName} budget`,
      threshold: 80,
      isRead: false
    });
  }
  
  return this;
};

// Static method to get or create budget for user and month
budgetSchema.statics.getOrCreateBudget = async function(userId, month) {
  let budget = await this.findOne({ user: userId, month: month });
  
  if (!budget) {
    // Get user's default budget settings
    const User = mongoose.model('User');
    const user = await User.findById(userId);
    
    const categories = [];
    if (user && user.settings && user.settings.budgetGoals && user.settings.budgetGoals.categoryLimits) {
      for (const [name, amount] of user.settings.budgetGoals.categoryLimits) {
        categories.push({
          name: name,
          budgetAmount: amount,
          spentAmount: 0,
          color: this.getCategoryColor(name)
        });
      }
    }
    
    budget = new this({
      user: userId,
      month: month,
      categories: categories,
      totalBudget: categories.reduce((total, cat) => total + cat.budgetAmount, 0),
      totalSpent: 0,
      savingsGoal: user?.settings?.budgetGoals?.monthlySavingsGoal || 0
    });
    
    await budget.save();
  }
  
  return budget;
};

// Static method to get category color
budgetSchema.statics.getCategoryColor = function(categoryName) {
  const colorMap = {
    'Food': '#f87171',
    'Housing': '#60a5fa',
    'Transportation': '#34d399',
    'Entertainment': '#facc15',
    'Shopping': '#a78bfa',
    'Utilities': '#fb7185',
    'Healthcare': '#fbbf24',
    'Education': '#10b981',
    'Travel': '#06b6d4',
    'Insurance': '#8b5cf6'
  };
  
  return colorMap[categoryName] || '#6b7280';
};

// Static method to update budget based on transaction
budgetSchema.statics.updateBudgetFromTransaction = async function(transaction, isDelete = false) {
  if (transaction.type !== 'expense') return;
  
  const month = `${transaction.date.getFullYear()}-${String(transaction.date.getMonth() + 1).padStart(2, '0')}`;
  const budget = await this.getOrCreateBudget(transaction.user, month);
  
  await budget.updateCategorySpent(transaction.category, transaction.amount, !isDelete);
  await budget.save();
  
  return budget;
};

module.exports = mongoose.model('Budget', budgetSchema);
