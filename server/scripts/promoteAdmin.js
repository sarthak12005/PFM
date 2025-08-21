const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const promoteToAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'sarthakjoshi12005@gmail.com';

    // Find the user
    const user = await User.findOne({ email: adminEmail });
    
    if (!user) {
      console.log(`❌ User with email ${adminEmail} not found.`);
      console.log('Please register this email first, then run this script again.');
      return;
    }

    // Check current role
    console.log(`Current user role: ${user.role}`);

    if (user.role === 'admin') {
      console.log('✅ User is already an admin!');
      return;
    }

    // Promote to admin
    user.role = 'admin';
    await user.save();

    console.log('✅ Successfully promoted user to admin!');
    console.log(`📧 Admin email: ${user.email}`);
    console.log(`👤 Admin name: ${user.name}`);
    console.log(`🔑 Role: ${user.role}`);
    
  } catch (error) {
    console.error('❌ Error promoting user to admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the promotion
promoteToAdmin();
