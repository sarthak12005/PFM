# 💰 SaveWise - Personal Finance Manager

A modern, user-friendly personal finance management application built with React and Node.js. Track your income, expenses, set budgets, and gain insights into your financial habits.

## ✨ Features

### 📊 **Financial Tracking**
- **Income & Expense Management** - Add, edit, and categorize all your transactions
- **Real-time Dashboard** - Get instant overview of your financial status
- **Smart Categories** - Organize transactions with predefined and custom categories
- **Visual Analytics** - Beautiful charts and graphs to understand your spending patterns

### 💡 **Budget Management**
- **Budget Planning** - Set monthly budgets for different categories
- **Progress Tracking** - Monitor your spending against budget limits
- **Smart Alerts** - Get notified when approaching budget limits
- **Goal Setting** - Set and track financial goals

### 📱 **User Experience**
- **Mobile Responsive** - Works perfectly on all devices (phones, tablets, desktop)
- **Clean Interface** - Simple and intuitive design
- **Fast Performance** - Optimized for speed and efficiency
- **Secure** - Your financial data is protected with industry-standard security

### 🎯 **Advanced Features**
- **Data Management** - Comprehensive transaction and budget tracking
- **Goal Setting** - Set and track financial goals
- **Multi-user Support** - Admin panel for user management
- **Category Management** - Organize transactions with custom categories

## 🎉 Project Status

✅ **Complete and Ready for Use!**

This project has been fully cleaned up and optimized:
- ✅ Removed all dummy data and test pages
- ✅ Connected all pages to backend APIs
- ✅ Improved mobile responsiveness
- ✅ Organized component structure
- ✅ Created comprehensive documentation
- ✅ Validated all functionality

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/savewise.git
   cd savewise
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Set up environment variables**
   
   Create `.env` file in the `server` directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/savewise
   JWT_SECRET=your_jwt_secret_here
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```
   
   Create `.env` file in the `client` directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start the application**
   ```bash
   # Start the server (from server directory)
   npm run dev
   
   # Start the client (from client directory)
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📖 User Guide

### Getting Started
1. **Register** - Create your account with email and password
2. **Login** - Access your personal dashboard
3. **Add Transactions** - Start tracking your income and expenses
4. **Set Budgets** - Create monthly budgets for different categories
5. **Monitor Progress** - Use the dashboard to track your financial health

### Key Features Guide

#### 💳 **Managing Transactions**
- Click "Add Transaction" to record income or expenses
- Choose appropriate categories for better organization
- Add descriptions for detailed tracking
- Edit or delete transactions as needed

#### 📊 **Understanding Your Dashboard**
- **Total Income** - All money coming in
- **Total Expenses** - All money going out
- **Net Savings** - Income minus expenses
- **Recent Transactions** - Your latest financial activities

#### 🎯 **Setting Budgets**
- Go to Budget Planner
- Set monthly limits for each category
- Monitor progress with visual indicators
- Get alerts when approaching limits

#### 📈 **Analytics & Reports**
- View spending trends over time
- Analyze category-wise expenses
- Generate monthly/yearly reports
- Export data for external analysis

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library
- **Tailwind CSS** - Utility-first styling
- **Chart.js** - Data visualization
- **React Router** - Navigation
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
savewise/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── context/        # React context
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── config/             # Configuration files
│   └── package.json
└── README.md
```

## 🔧 Development

### Available Scripts

**Server:**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run seed` - Seed database with sample data

**Client:**
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

### API Documentation

The API follows RESTful conventions. Key endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/transactions` - Get user transactions
- `POST /api/transactions` - Create new transaction
- `GET /api/budget/:month` - Get monthly budget
- `POST /api/budget` - Create/update budget

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [User Guide](docs/USER_GUIDE.md)
2. Look at [Common Issues](docs/TROUBLESHOOTING.md)
3. Create an issue on GitHub
4. Contact support at support@savewise.com

## 🙏 Acknowledgments

- Icons by [Lucide React](https://lucide.dev/)
- Charts by [Chart.js](https://www.chartjs.org/)
- Styling by [Tailwind CSS](https://tailwindcss.com/)

---

Made with ❤️ by the SaveWise Team
