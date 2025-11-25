# SaveWise Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

### 2. Environment Setup

**Server `.env`:**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/savewise
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000
```

**Client `.env`:**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Database Setup

Start MongoDB and seed sample data:
```bash
cd server
npm run seed
```

### 4. Start Development Servers

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm start
```

### 5. Access Application

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## 🔑 Demo Login

**Email**: demo@savewise.com  
**Password**: demo123

## ✅ Features Implemented

### 🔐 Authentication
- [x] User registration and login
- [x] JWT authentication
- [x] Protected routes
- [x] Demo credentials

### 📊 Dashboard
- [x] Financial overview cards
- [x] Recent transactions
- [x] Quick actions
- [x] Responsive design

### 💰 Transactions
- [x] Add/Edit/Delete transactions
- [x] Category organization
- [x] Search and filter
- [x] Pagination

### 👤 Profile
- [x] User profile management
- [x] Financial summary
- [x] Expense breakdown chart
- [x] Activity timeline
- [x] Achievement system

### 📈 Budget Planner
- [x] Monthly budget creation
- [x] Category budget tracking
- [x] Progress visualization
- [x] Budget alerts
- [x] Savings goals
- [x] Interactive charts

### 🔄 Backend API
- [x] Complete REST API
- [x] MongoDB integration
- [x] Data validation
- [x] Error handling
- [x] Sample data seeding

## 📱 Application Structure

```
SaveWise/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   ├── services/       # API services
│   │   └── styles/         # CSS files
│   └── package.json
├── server/                 # Node.js Backend
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Auth middleware
│   ├── scripts/            # Seed scripts
│   └── package.json
└── README.md
```

## 🎯 Next Steps

The following features are ready to be implemented:

1. **Subscription Tracker** - Track recurring subscriptions
2. **Savings Goal Tracker** - Monitor savings progress
3. **Investment Portfolio** - Track investments
4. **Bill Reminders** - Payment notifications
5. **Data Export** - Export financial data
6. **Multi-currency** - Support multiple currencies

## 🔧 Development Tips

- Use `npm run dev` for backend development (auto-restart)
- Frontend hot-reloads automatically
- Check browser console for errors
- Use React DevTools for debugging
- MongoDB Compass for database inspection

## 🆘 Troubleshooting

**Backend won't start:**
- Check MongoDB is running
- Verify environment variables
- Check port 5000 is available

**Frontend won't connect:**
- Verify backend is running on port 5000
- Check REACT_APP_API_URL in .env
- Clear browser cache

**Database issues:**
- Ensure MongoDB is running
- Check connection string
- Try running seed script again

## 📊 Sample Data

The seed script creates:
- 1 demo user with profile
- 35+ sample transactions (6 months)
- Budget categories with amounts
- Achievement badges
- Activity timeline entries

## 🎨 UI Components

All major UI components are implemented:
- Responsive cards and layouts
- Interactive charts (Recharts)
- Form components with validation
- Loading states and animations
- Toast notifications
