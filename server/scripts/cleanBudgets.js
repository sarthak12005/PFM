const mongoose = require('mongoose');
const Budget = require('../models/Budget');
require('dotenv').config();

const cleanBudgets = async () => {
  try {
    console.log('🧹 Cleaning problematic budget documents...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    // Remove all budget documents to start fresh
    const result = await Budget.deleteMany({});
    console.log(`🗑️  Deleted ${result.deletedCount} budget documents`);

    console.log('✅ Budget cleanup completed successfully');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error cleaning budgets:', error);
    process.exit(1);
  }
};

cleanBudgets();
