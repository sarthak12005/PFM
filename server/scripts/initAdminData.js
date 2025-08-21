const mongoose = require('mongoose');
const User = require('../models/User');
const Offer = require('../models/Offer');
const Membership = require('../models/Membership');
require('dotenv').config();

const initAdminData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find or create admin user
    let adminUser = await User.findOne({ email: 'sarthakjoshi12005@gmail.com' });
    
    if (!adminUser) {
      console.log('Admin user not found. Please register with sarthakjoshi12005@gmail.com first.');
      return;
    }

    // Update user to admin role
    adminUser.role = 'admin';
    await adminUser.save();
    console.log('Admin user role updated');

    // Create sample memberships
    const memberships = [
      {
        name: 'Free Plan',
        tier: 'free',
        description: 'Perfect for getting started with personal finance management',
        pricing: {
          monthly: 0,
          yearly: 0,
          currency: 'INR'
        },
        features: [
          {
            name: 'Basic Transaction Tracking',
            description: 'Track up to 100 transactions per month',
            icon: 'check',
            isHighlight: false
          },
          {
            name: 'Simple Budgeting',
            description: 'Create up to 3 budget categories',
            icon: 'check',
            isHighlight: false
          },
          {
            name: 'Basic Reports',
            description: 'Monthly spending summaries',
            icon: 'check',
            isHighlight: false
          }
        ],
        limits: {
          transactions: { monthly: 100 },
          budgets: { count: 3 },
          goals: { count: 2 },
          categories: { custom: 5 },
          reports: { advanced: false, export: false },
          support: { priority: false, phone: false, chat: false }
        },
        benefits: [
          {
            title: 'Free Forever',
            description: 'No hidden costs or time limits',
            value: 'Always Free'
          }
        ],
        color: {
          primary: '#6B7280',
          secondary: '#F3F4F6'
        },
        isPopular: false,
        isActive: true,
        order: 1,
        createdBy: adminUser._id
      },
      {
        name: 'Premium Plan',
        tier: 'premium',
        description: 'Advanced features for serious financial planning',
        pricing: {
          monthly: 299,
          yearly: 2999,
          currency: 'INR',
          discount: {
            percentage: 17,
            validUntil: new Date('2025-12-31')
          }
        },
        features: [
          {
            name: 'Unlimited Transactions',
            description: 'Track unlimited transactions and categories',
            icon: 'infinity',
            isHighlight: true
          },
          {
            name: 'Advanced Analytics',
            description: 'Detailed insights and trend analysis',
            icon: 'chart',
            isHighlight: true
          },
          {
            name: 'Goal Tracking',
            description: 'Set and monitor financial goals',
            icon: 'target',
            isHighlight: false
          },
          {
            name: 'Export Reports',
            description: 'Download reports in PDF and Excel',
            icon: 'download',
            isHighlight: false
          },
          {
            name: 'Priority Support',
            description: '24/7 chat support with priority response',
            icon: 'support',
            isHighlight: false
          }
        ],
        limits: {
          transactions: { monthly: -1 },
          budgets: { count: -1 },
          goals: { count: -1 },
          categories: { custom: -1 },
          reports: { advanced: true, export: true },
          support: { priority: true, phone: false, chat: true }
        },
        benefits: [
          {
            title: 'Advanced Analytics',
            description: 'Deep insights into spending patterns',
            value: 'Unlimited'
          },
          {
            title: 'Goal Tracking',
            description: 'Monitor progress towards financial goals',
            value: 'Unlimited Goals'
          },
          {
            title: 'Priority Support',
            description: 'Get help when you need it most',
            value: '24/7 Chat'
          }
        ],
        color: {
          primary: '#3B82F6',
          secondary: '#EFF6FF'
        },
        badge: {
          text: 'Most Popular',
          color: '#10B981'
        },
        isPopular: true,
        isActive: true,
        order: 2,
        createdBy: adminUser._id
      },
      {
        name: 'Enterprise Plan',
        tier: 'enterprise',
        description: 'Complete financial management solution for power users',
        pricing: {
          monthly: 999,
          yearly: 9999,
          currency: 'INR',
          discount: {
            percentage: 20,
            validUntil: new Date('2025-12-31')
          }
        },
        features: [
          {
            name: 'Everything in Premium',
            description: 'All premium features included',
            icon: 'check',
            isHighlight: false
          },
          {
            name: 'Investment Tracking',
            description: 'Monitor stocks, mutual funds, and portfolios',
            icon: 'trending-up',
            isHighlight: true
          },
          {
            name: 'Tax Planning',
            description: 'Advanced tax optimization tools',
            icon: 'calculator',
            isHighlight: true
          },
          {
            name: 'Phone Support',
            description: 'Direct phone line to financial experts',
            icon: 'phone',
            isHighlight: true
          },
          {
            name: 'Custom Reports',
            description: 'Build personalized financial reports',
            icon: 'file-text',
            isHighlight: false
          }
        ],
        limits: {
          transactions: { monthly: -1 },
          budgets: { count: -1 },
          goals: { count: -1 },
          categories: { custom: -1 },
          reports: { advanced: true, export: true },
          support: { priority: true, phone: true, chat: true }
        },
        benefits: [
          {
            title: 'Investment Tracking',
            description: 'Complete portfolio management',
            value: 'Unlimited Assets'
          },
          {
            title: 'Tax Optimization',
            description: 'Maximize your tax savings',
            value: 'Advanced Tools'
          },
          {
            title: 'Expert Support',
            description: 'Direct access to financial advisors',
            value: 'Phone + Chat'
          }
        ],
        color: {
          primary: '#8B5CF6',
          secondary: '#F3E8FF'
        },
        badge: {
          text: 'Enterprise',
          color: '#8B5CF6'
        },
        isPopular: false,
        isActive: true,
        order: 3,
        createdBy: adminUser._id
      }
    ];

    // Clear existing memberships and create new ones
    await Membership.deleteMany({});
    await Membership.insertMany(memberships);
    console.log('Sample memberships created');

    // Create sample offers
    const offers = [
      {
        title: 'HDFC Cashback Credit Card - 5% Cashback',
        description: 'Earn 5% cashback on online shopping and 1% on all other purchases. No annual fee for the first year.',
        category: 'credit_card',
        type: 'cashback',
        provider: {
          name: 'HDFC Bank',
          logo: 'https://example.com/hdfc-logo.png',
          website: 'https://www.hdfcbank.com'
        },
        features: [
          {
            title: '5% Cashback Online',
            description: 'Earn 5% cashback on online shopping up to ₹1000 per month',
            icon: 'percent'
          },
          {
            title: 'No Annual Fee',
            description: 'Free for the first year, then ₹500 annually',
            icon: 'gift'
          },
          {
            title: 'Instant Approval',
            description: 'Get approved instantly with digital KYC',
            icon: 'zap'
          }
        ],
        benefits: {
          primaryBenefit: '5% cashback on online shopping',
          secondaryBenefits: [
            '1% cashback on all other purchases',
            'Welcome bonus of ₹500',
            'Fuel surcharge waiver'
          ],
          cashbackRate: 5,
          bonusAmount: 500
        },
        requirements: {
          minimumIncome: 300000,
          creditScore: 650,
          eligibilityCriteria: [
            'Age between 21-60 years',
            'Minimum income ₹3 lakhs per annum',
            'Good credit score (650+)'
          ]
        },
        terms: {
          duration: 'Lifetime',
          fees: {
            annual: 0,
            processing: 0
          },
          limitations: [
            'Cashback capped at ₹1000 per month for online shopping',
            'Annual fee waiver only for first year'
          ]
        },
        applicationLink: 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/cashback-credit-card',
        rating: {
          average: 4.2,
          count: 1250
        },
        popularity: {
          views: 15420,
          applications: 892,
          conversions: 234
        },
        status: 'active',
        priority: 9,
        validFrom: new Date(),
        validUntil: new Date('2025-12-31'),
        targetAudience: {
          membershipTiers: ['free', 'premium', 'enterprise'],
          incomeRange: { min: 300000, max: 2000000 },
          ageRange: { min: 21, max: 60 }
        },
        createdBy: adminUser._id
      },
      {
        title: 'SBI High Yield Savings Account - 7% Interest',
        description: 'Earn up to 7% interest on your savings with SBI\'s premium savings account. Zero balance requirement.',
        category: 'savings_account',
        type: 'high_yield',
        provider: {
          name: 'State Bank of India',
          logo: 'https://example.com/sbi-logo.png',
          website: 'https://www.sbi.co.in'
        },
        features: [
          {
            title: '7% Interest Rate',
            description: 'Earn up to 7% per annum on your savings',
            icon: 'trending-up'
          },
          {
            title: 'Zero Balance',
            description: 'No minimum balance requirement',
            icon: 'dollar-sign'
          },
          {
            title: 'Digital Banking',
            description: 'Complete digital banking experience',
            icon: 'smartphone'
          }
        ],
        benefits: {
          primaryBenefit: 'Up to 7% interest rate',
          secondaryBenefits: [
            'Zero minimum balance',
            'Free debit card',
            'Mobile banking',
            'Internet banking'
          ],
          interestRate: 7
        },
        requirements: {
          minimumDeposit: 0,
          eligibilityCriteria: [
            'Age 18 years and above',
            'Valid KYC documents',
            'PAN card mandatory'
          ]
        },
        terms: {
          duration: 'Ongoing',
          fees: {
            annual: 0,
            monthly: 0
          },
          limitations: [
            'Interest rate subject to balance slab',
            'Terms and conditions apply'
          ]
        },
        applicationLink: 'https://www.sbi.co.in/web/personal-banking/accounts/savings-account',
        rating: {
          average: 4.0,
          count: 2100
        },
        popularity: {
          views: 8750,
          applications: 445,
          conversions: 178
        },
        status: 'active',
        priority: 8,
        validFrom: new Date(),
        validUntil: new Date('2025-06-30'),
        targetAudience: {
          membershipTiers: ['free', 'premium', 'enterprise'],
          incomeRange: { min: 0, max: 5000000 },
          ageRange: { min: 18, max: 100 }
        },
        createdBy: adminUser._id
      }
    ];

    // Clear existing offers and create new ones
    await Offer.deleteMany({});
    await Offer.insertMany(offers);
    console.log('Sample offers created');

    console.log('✅ Admin data initialization completed successfully!');
    console.log('🔑 Admin login: sarthakjoshi12005@gmail.com / sarthak@2005');
    
  } catch (error) {
    console.error('Error initializing admin data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the initialization
initAdminData();
