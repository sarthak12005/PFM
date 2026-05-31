/**
 * Seeds the database with default categories
 * Run this file to populate initial categories into MongoDB
 * Usage: node seeds/seedCategories.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');
const connectDB = require('../config/db');

dotenv.config();

const DEFAULT_CATEGORIES = {
  expense: [
    {
      id: 'food',
      name: 'Food',
      icon: 'Utensils',
      color: '#f87171',
      description: 'Groceries, restaurants, food delivery'
    },
    {
      id: 'housing',
      name: 'Housing',
      icon: 'Home',
      color: '#60a5fa',
      description: 'Rent, mortgage, home maintenance'
    },
    {
      id: 'transportation',
      name: 'Transportation',
      icon: 'Car',
      color: '#34d399',
      description: 'Fuel, public transport, vehicle maintenance'
    },
    {
      id: 'entertainment',
      name: 'Entertainment',
      icon: 'Gamepad2',
      color: '#facc15',
      description: 'Movies, games, recreational activities'
    },
    {
      id: 'shopping',
      name: 'Shopping',
      icon: 'ShoppingBag',
      color: '#a78bfa',
      description: 'Clothing, electronics, general shopping'
    },
    {
      id: 'utilities',
      name: 'Utilities',
      icon: 'Zap',
      color: '#fb7185',
      description: 'Electricity, water, gas, internet'
    },
    {
      id: 'healthcare',
      name: 'Healthcare',
      icon: 'Heart',
      color: '#fbbf24',
      description: 'Medical expenses, medicines, doctor visits'
    },
    {
      id: 'education',
      name: 'Education',
      icon: 'BookOpen',
      color: '#10b981',
      description: 'School, books, courses, training'
    },
    {
      id: 'travel',
      name: 'Travel',
      icon: 'Plane',
      color: '#06b6d4',
      description: 'Flights, hotels, vacation expenses'
    },
    {
      id: 'insurance',
      name: 'Insurance',
      icon: 'Shield',
      color: '#8b5cf6',
      description: 'Health, car, home insurance'
    }
  ],
  income: [
    {
      id: 'salary',
      name: 'Salary',
      icon: 'DollarSign',
      color: '#10b981',
      description: 'Monthly salary and bonuses'
    },
    {
      id: 'freelance',
      name: 'Freelance',
      icon: 'Briefcase',
      color: '#3b82f6',
      description: 'Freelance work and side projects'
    },
    {
      id: 'business',
      name: 'Business',
      icon: 'TrendingUp',
      color: '#f59e0b',
      description: 'Business income and revenue'
    },
    {
      id: 'investment',
      name: 'Investment',
      icon: 'BarChart3',
      color: '#8b5cf6',
      description: 'Investment returns and dividends'
    },
    {
      id: 'gift',
      name: 'Gift',
      icon: 'Gift',
      color: '#ec4899',
      description: 'Gifts and monetary gifts'
    }
  ]
};

const seedCategories = async () => {
  try {
    // Connect to database
    await connectDB();
    
    console.log('🌱 Starting category seed...');

    // Clear existing categories
    const deleted = await Category.deleteMany({});
    console.log(`🗑️  Deleted ${deleted.deletedCount} existing categories`);

    // Prepare categories for insertion
    const categoriesToInsert = [];
    
    Object.entries(DEFAULT_CATEGORIES).forEach(([type, categories]) => {
      categories.forEach(cat => {
        categoriesToInsert.push({
          ...cat,
          type,
          isDefault: true,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      });
    });

    // Insert all categories
    const inserted = await Category.insertMany(categoriesToInsert);
    console.log(`✅ Successfully seeded ${inserted.length} categories`);

    // Display summary
    const expenseCount = inserted.filter(cat => cat.type === 'expense').length;
    const incomeCount = inserted.filter(cat => cat.type === 'income').length;
    
    console.log(`\n📊 Category Summary:`);
    console.log(`  💰 Expense Categories: ${expenseCount}`);
    console.log(`  💵 Income Categories: ${incomeCount}`);
    console.log(`  📝 Total: ${inserted.length}\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    process.exit(1);
  }
};

// Run the seed function
seedCategories();
