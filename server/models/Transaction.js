const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  title: {
    type: String,
    required: [true, 'Transaction title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0']
  },
  type: {
    type: String,
    required: [true, 'Transaction type is required'],
    enum: {
      values: ['income', 'expense'],
      message: 'Type must be either income or expense'
    }
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Transaction date is required'],
    default: Date.now
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi', 'bank_transfer', 'other'],
    default: 'other'
  },
  tags: [{
    type: String,
    trim: true
  }],
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringDetails: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
      required: function() { return this.isRecurring; }
    },
    nextDate: {
      type: Date,
      required: function() { return this.isRecurring; }
    },
    endDate: Date
  },
  attachments: [{
    filename: String,
    url: String,
    uploadDate: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, type: 1 });
transactionSchema.index({ user: 1, category: 1 });
transactionSchema.index({ user: 1, createdAt: -1 });

// Virtual for formatted amount
transactionSchema.virtual('formattedAmount').get(function() {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(this.amount);
});

// Virtual for month-year grouping
transactionSchema.virtual('monthYear').get(function() {
  const date = new Date(this.date);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
});

// Static method to get user's transaction summary
transactionSchema.statics.getUserSummary = async function(userId, startDate, endDate) {
  const matchStage = {
    user: new mongoose.Types.ObjectId(userId)
  };

  if (startDate || endDate) {
    matchStage.date = {};
    if (startDate) matchStage.date.$gte = new Date(startDate);
    if (endDate) matchStage.date.$lte = new Date(endDate);
  }

  const summary = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);

  const result = {
    totalIncome: 0,
    totalExpenses: 0,
    netSavings: 0,
    transactionCount: 0,
    incomeCount: 0,
    expenseCount: 0
  };

  summary.forEach(item => {
    if (item._id === 'income') {
      result.totalIncome = item.total;
      result.incomeCount = item.count;
    } else if (item._id === 'expense') {
      result.totalExpenses = item.total;
      result.expenseCount = item.count;
    }
    result.transactionCount += item.count;
  });

  result.netSavings = result.totalIncome - result.totalExpenses;
  return result;
};

// Static method to get category-wise breakdown
transactionSchema.statics.getCategoryBreakdown = async function(userId, type = 'expense', startDate, endDate) {
  const matchStage = {
    user: new mongoose.Types.ObjectId(userId),
    type: type
  };

  if (startDate || endDate) {
    matchStage.date = {};
    if (startDate) matchStage.date.$gte = new Date(startDate);
    if (endDate) matchStage.date.$lte = new Date(endDate);
  }

  return await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
        avgAmount: { $avg: '$amount' }
      }
    },
    {
      $project: {
        category: '$_id',
        amount: '$total',
        count: 1,
        avgAmount: { $round: ['$avgAmount', 2] },
        _id: 0
      }
    },
    { $sort: { amount: -1 } }
  ]);
};

// Static method to get monthly data
transactionSchema.statics.getMonthlyData = async function(userId, months = 6) {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  return await this.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        date: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
          type: '$type'
        },
        total: { $sum: '$amount' }
      }
    },
    {
      $group: {
        _id: {
          year: '$_id.year',
          month: '$_id.month'
        },
        income: {
          $sum: {
            $cond: [{ $eq: ['$_id.type', 'income'] }, '$total', 0]
          }
        },
        expenses: {
          $sum: {
            $cond: [{ $eq: ['$_id.type', 'expense'] }, '$total', 0]
          }
        }
      }
    },
    {
      $project: {
        month: {
          $concat: [
            { $toString: '$_id.year' },
            '-',
            {
              $cond: [
                { $lt: ['$_id.month', 10] },
                { $concat: ['0', { $toString: '$_id.month' }] },
                { $toString: '$_id.month' }
              ]
            }
          ]
        },
        income: 1,
        expenses: 1,
        savings: { $subtract: ['$income', '$expenses'] },
        _id: 0
      }
    },
    { $sort: { month: 1 } }
  ]);
};

module.exports = mongoose.model('Transaction', transactionSchema);
