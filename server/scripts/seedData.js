const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/savewise', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected for seeding...');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Demo user credentials
const DEMO_USER = {
  name: 'Sarthak Demo',
  email: 'demo@savewise.com',
  password: 'demo123'
};

// Sample transactions data
const sampleTransactions = [
  // January 2025
  { title: 'Salary', amount: 45000, type: 'income', category: 'Job', date: '2025-01-15' },
  { title: 'Freelance Project', amount: 12000, type: 'income', category: 'Freelance', date: '2025-01-20' },
  { title: 'Investment Return', amount: 8000, type: 'income', category: 'Investment', date: '2025-01-28' },
  { title: 'Rent Payment', amount: 15000, type: 'expense', category: 'Housing', date: '2025-01-01' },
  { title: 'Groceries - BigBasket', amount: 3200, type: 'expense', category: 'Food', date: '2025-01-18' },
  { title: 'Electricity Bill', amount: 1800, type: 'expense', category: 'Utilities', date: '2025-01-22' },
  { title: 'Uber Rides', amount: 850, type: 'expense', category: 'Transportation', date: '2025-01-25' },
  { title: 'Restaurant - Zomato', amount: 1200, type: 'expense', category: 'Food', date: '2025-01-30' },
  { title: 'Netflix Subscription', amount: 649, type: 'expense', category: 'Entertainment', date: '2025-01-31' },
  { title: 'Amazon Shopping', amount: 2400, type: 'expense', category: 'Shopping', date: '2025-01-21' },
  
  // December 2024
  { title: 'Salary', amount: 45000, type: 'income', category: 'Job', date: '2024-12-15' },
  { title: 'Bonus', amount: 20000, type: 'income', category: 'Job', date: '2024-12-31' },
  { title: 'Rent Payment', amount: 15000, type: 'expense', category: 'Housing', date: '2024-12-01' },
  { title: 'Holiday Shopping', amount: 8500, type: 'expense', category: 'Shopping', date: '2024-12-20' },
  { title: 'Travel - Goa Trip', amount: 12000, type: 'expense', category: 'Travel', date: '2024-12-25' },
  { title: 'Groceries', amount: 4200, type: 'expense', category: 'Food', date: '2024-12-10' },
  { title: 'Petrol', amount: 2800, type: 'expense', category: 'Transportation', date: '2024-12-05' },
  
  // November 2024
  { title: 'Salary', amount: 45000, type: 'income', category: 'Job', date: '2024-11-15' },
  { title: 'Consulting Work', amount: 15000, type: 'income', category: 'Freelance', date: '2024-11-25' },
  { title: 'Rent Payment', amount: 15000, type: 'expense', category: 'Housing', date: '2024-11-01' },
  { title: 'Car Insurance', amount: 8000, type: 'expense', category: 'Insurance', date: '2024-11-10' },
  { title: 'Medical Checkup', amount: 2500, type: 'expense', category: 'Healthcare', date: '2024-11-18' },
  { title: 'Groceries', amount: 3800, type: 'expense', category: 'Food', date: '2024-11-12' },
  
  // October 2024
  { title: 'Salary', amount: 45000, type: 'income', category: 'Job', date: '2024-10-15' },
  { title: 'Rent Payment', amount: 15000, type: 'expense', category: 'Housing', date: '2024-10-01' },
  { title: 'Diwali Shopping', amount: 6500, type: 'expense', category: 'Shopping', date: '2024-10-20' },
  { title: 'Groceries', amount: 3500, type: 'expense', category: 'Food', date: '2024-10-08' },
  { title: 'Movie Tickets', amount: 800, type: 'expense', category: 'Entertainment', date: '2024-10-14' },
  
  // September 2024
  { title: 'Salary', amount: 45000, type: 'income', category: 'Job', date: '2024-09-15' },
  { title: 'Rent Payment', amount: 15000, type: 'expense', category: 'Housing', date: '2024-09-01' },
  { title: 'Groceries', amount: 3600, type: 'expense', category: 'Food', date: '2024-09-10' },
  { title: 'Gym Membership', amount: 2000, type: 'expense', category: 'Healthcare', date: '2024-09-05' },
  
  // August 2024
  { title: 'Salary', amount: 45000, type: 'income', category: 'Job', date: '2024-08-15' },
  { title: 'Rent Payment', amount: 15000, type: 'expense', category: 'Housing', date: '2024-08-01' },
  { title: 'Groceries', amount: 3400, type: 'expense', category: 'Food', date: '2024-08-12' },
  { title: 'Online Course', amount: 1500, type: 'expense', category: 'Education', date: '2024-08-20' }
];

// Sample budget data
const sampleBudgets = [
  {
    month: '2025-01',
    categories: [
      { name: 'Food', budgetAmount: 5000, color: '#f87171' },
      { name: 'Housing', budgetAmount: 15000, color: '#60a5fa' },
      { name: 'Transportation', budgetAmount: 3000, color: '#34d399' },
      { name: 'Entertainment', budgetAmount: 2000, color: '#facc15' },
      { name: 'Shopping', budgetAmount: 4000, color: '#a78bfa' },
      { name: 'Utilities', budgetAmount: 2500, color: '#fb7185' },
      { name: 'Healthcare', budgetAmount: 3000, color: '#fbbf24' },
      { name: 'Travel', budgetAmount: 5000, color: '#06b6d4' }
    ],
    savingsGoal: 15000
  },
  {
    month: '2024-12',
    categories: [
      { name: 'Food', budgetAmount: 5000, color: '#f87171' },
      { name: 'Housing', budgetAmount: 15000, color: '#60a5fa' },
      { name: 'Transportation', budgetAmount: 3000, color: '#34d399' },
      { name: 'Entertainment', budgetAmount: 2000, color: '#facc15' },
      { name: 'Shopping', budgetAmount: 8000, color: '#a78bfa' }, // Higher for holidays
      { name: 'Travel', budgetAmount: 15000, color: '#06b6d4' } // Higher for holidays
    ],
    savingsGoal: 10000
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting fresh database setup...');

    // Clear existing data completely
    await User.deleteMany({});
    await Transaction.deleteMany({});
    await Budget.deleteMany({});
    console.log('🗑️  Cleared all existing data');

    // Create demo user
    const demoUser = new User({
      name: DEMO_USER.name,
      email: DEMO_USER.email,
      password: DEMO_USER.password,
      settings: {
        theme: 'light',
        notifications: {
          monthlyReport: true,
          highExpenseAlert: true,
          budgetAlert: true,
          emailNotifications: true,
          pushNotifications: false
        },
        budgetGoals: {
          monthlySavingsGoal: 15000,
          categoryLimits: new Map([
            ['Food', 5000],
            ['Housing', 15000],
            ['Transportation', 3000],
            ['Entertainment', 2000],
            ['Shopping', 4000],
            ['Utilities', 2500],
            ['Healthcare', 3000],
            ['Travel', 5000]
          ])
        }
      }
    });

    await demoUser.save();
    console.log('👤 Created demo user');
    console.log(`📧 Email: ${DEMO_USER.email}`);
    console.log(`🔑 Password: ${DEMO_USER.password}`);

    // Skip creating sample transactions - let user add their own
    console.log('💰 Database ready for user transactions');

    // Skip creating sample budgets - let user create their own
    console.log('📊 Database ready for user budgets');

    console.log('✅ Database seeding completed successfully!');
    console.log('\n🚀 You can now start the server and login with:');
    console.log(`📧 Email: ${DEMO_USER.email}`);
    console.log(`🔑 Password: ${DEMO_USER.password}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📦 Database connection closed');
    process.exit(0);
  }
};

// Run the seeding
connectDB().then(() => {
  seedDatabase();
});
