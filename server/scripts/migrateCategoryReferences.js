/**
 * Migration script to convert existing string-based categories to ObjectId references
 * This handles the transition from hardcoded categories to database-backed categories
 * Run: node scripts/migrateCategoryReferences.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');
const connectDB = require('../config/db');

dotenv.config();

const migrate = async () => {
  try {
    await connectDB();

    // Find all transactions with string categories
    const transactions = await Transaction.find({
      category: { $type: 'string' }
    });


    if (transactions.length === 0) {
      process.exit(0);
    }

    let updated = 0;
    let failed = 0;
    let notFound = [];

    // Migrate each transaction
    for (const transaction of transactions) {
      try {
        // Find the category by name
        const category = await Category.findOne({ name: transaction.category });

        if (!category) {
          notFound.push(transaction.category);
          failed++;
          continue;
        }

        // Update transaction with ObjectId
        transaction.category = category._id;
        await transaction.save();
        updated++;

      } catch (err) {
        failed++;
        console.error(`❌ Error migrating transaction ${transaction._id}:`, err.message);
      }
    }
    
    if (notFound.length > 0) {
      const uniqueNotFound = [...new Set(notFound)];
      uniqueNotFound.forEach(cat => console.log(`  - ${cat}`));
    }

    process.exit(0);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

// Run migration
migrate();
