#!/usr/bin/env node

/**
 * SaveWise Setup Validation Script
 * This script checks if the project is properly configured and ready to run
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 SaveWise Setup Validation\n');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description} - Missing: ${filePath}`, 'red');
    return false;
  }
}

function checkDirectory(dirPath, description) {
  if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description} - Missing: ${dirPath}`, 'red');
    return false;
  }
}

let allChecks = true;

// Check project structure
log('📁 Checking Project Structure...', 'blue');
allChecks &= checkDirectory('client', 'Client directory exists');
allChecks &= checkDirectory('server', 'Server directory exists');
allChecks &= checkDirectory('docs', 'Documentation directory exists');

// Check essential files
log('\n📄 Checking Essential Files...', 'blue');
allChecks &= checkFile('README.md', 'Main README file');
allChecks &= checkFile('client/package.json', 'Client package.json');
allChecks &= checkFile('server/package.json', 'Server package.json');
allChecks &= checkFile('client/src/App.jsx', 'Main App component');
allChecks &= checkFile('server/server.js', 'Server entry point');

// Check configuration files
log('\n⚙️ Checking Configuration Files...', 'blue');
allChecks &= checkFile('client/vite.config.js', 'Vite configuration');
allChecks &= checkFile('client/tailwind.config.js', 'Tailwind configuration');
allChecks &= checkFile('client/postcss.config.js', 'PostCSS configuration');

// Check component organization
log('\n🧩 Checking Component Organization...', 'blue');
allChecks &= checkDirectory('client/src/components/layout', 'Layout components');
allChecks &= checkDirectory('client/src/components/ui', 'UI components');
allChecks &= checkDirectory('client/src/components/charts', 'Chart components');
allChecks &= checkDirectory('client/src/components/cards', 'Card components');
allChecks &= checkDirectory('client/src/components/forms', 'Form components');
allChecks &= checkDirectory('client/src/components/modals', 'Modal components');
allChecks &= checkDirectory('client/src/components/transactions', 'Transaction components');
allChecks &= checkDirectory('client/src/components/budget', 'Budget components');
allChecks &= checkDirectory('client/src/components/dashboard', 'Dashboard components');
allChecks &= checkDirectory('client/src/components/filters', 'Filter components');
allChecks &= checkDirectory('client/src/components/user', 'User components');

// Check server structure
log('\n🖥️ Checking Server Structure...', 'blue');
allChecks &= checkDirectory('server/models', 'Database models');
allChecks &= checkDirectory('server/routes', 'API routes');
allChecks &= checkDirectory('server/middleware', 'Middleware');
allChecks &= checkDirectory('server/config', 'Configuration');

// Check documentation
log('\n📚 Checking Documentation...', 'blue');
allChecks &= checkFile('docs/USER_GUIDE.md', 'User guide');
allChecks &= checkFile('docs/TROUBLESHOOTING.md', 'Troubleshooting guide');
allChecks &= checkFile('docs/DEPLOYMENT.md', 'Deployment guide');

// Check for node_modules (should exist after npm install)
log('\n📦 Checking Dependencies...', 'blue');
if (fs.existsSync('client/node_modules')) {
  log('✅ Client dependencies installed', 'green');
} else {
  log('⚠️ Client dependencies not installed - Run: cd client && npm install', 'yellow');
}

if (fs.existsSync('server/node_modules')) {
  log('✅ Server dependencies installed', 'green');
} else {
  log('⚠️ Server dependencies not installed - Run: cd server && npm install', 'yellow');
}

// Check environment files
log('\n🔐 Checking Environment Configuration...', 'blue');
if (fs.existsSync('server/.env')) {
  log('✅ Server environment file exists', 'green');
} else {
  log('⚠️ Server .env file missing - Create server/.env with required variables', 'yellow');
}

if (fs.existsSync('client/.env')) {
  log('✅ Client environment file exists', 'green');
} else {
  log('⚠️ Client .env file missing - Create client/.env with REACT_APP_API_URL', 'yellow');
}

// Final summary
log('\n📋 Validation Summary', 'blue');
if (allChecks) {
  log('🎉 All essential checks passed! Your SaveWise project is properly set up.', 'green');
  log('\n🚀 Next Steps:', 'blue');
  log('1. Make sure MongoDB is running', 'yellow');
  log('2. Start the server: cd server && npm run dev', 'yellow');
  log('3. Start the client: cd client && npm start', 'yellow');
  log('4. Visit http://localhost:3000 to use SaveWise', 'yellow');
} else {
  log('⚠️ Some issues were found. Please fix the missing files/directories above.', 'red');
}

log('\n💡 For help, check the documentation in the docs/ folder.', 'blue');
