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
    
    console.log('🔄 Starting category reference migration...\n');

    // Find all transactions with string categories
    const transactions = await Transaction.find({
      category: { $type: 'string' }
    });

    console.log(`📊 Found ${transactions.length} transactions with string categories\n`);

    if (transactions.length === 0) {
      console.log('✅ No transactions to migrate. All categories are already ObjectIds.');
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
          console.log(`❌ Category not found: ${transaction.category} (Transaction ID: ${transaction._id})`);
          continue;
        }

        // Update transaction with ObjectId
        transaction.category = category._id;
        await transaction.save();
        updated++;

        console.log(`✅ Updated: "${transaction.title}" - ${transaction.category}`);
      } catch (err) {
        failed++;
        console.error(`❌ Error migrating transaction ${transaction._id}:`, err.message);
      }
    }

    console.log(`\n📋 Migration Summary:`);
    console.log(`  ✅ Successfully updated: ${updated}`);
    console.log(`  ❌ Failed/Not found: ${failed}`);
    
    if (notFound.length > 0) {
      const uniqueNotFound = [...new Set(notFound)];
      console.log(`\n⚠️  Categories not found in database:`);
      uniqueNotFound.forEach(cat => console.log(`  - ${cat}`));
      console.log(`\n💡 Tip: Run 'npm run seed:categories' to create the missing categories`);
    }

    console.log('\n✨ Migration complete!\n');
    process.exit(0);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

// Run migration
migrate();
