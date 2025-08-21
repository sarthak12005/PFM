# 📁 Components Folder Structure

This document outlines the organized structure of the SaveWise components folder.

## 🎯 **Folder Organization**

### 📂 **`layout/`** - Layout & Navigation Components
- `Navbar.jsx` - Main navigation bar with responsive menu
- `Footer.jsx` - Application footer with links and company info
- `ProtectedRoute.jsx` - Route protection wrapper component

### 📂 **`ui/`** - Basic UI Components
- `LoadingSpinner.jsx` - Loading indicators and spinners
- `ThemeSwitcher.jsx` - Theme selection and customization
- `AlertBanner.jsx` - Alert and notification banners
- `NotificationToggles.jsx` - Notification preference toggles

### 📂 **`charts/`** - Data Visualization Components
- `BarChart.jsx` - Bar chart with specialized variants
- `PieChart.jsx` - Pie chart with doughnut variants
- `LineChart.jsx` - Line chart with area chart variants
- Legacy chart components for backward compatibility

### 📂 **`cards/`** - Card-based UI Components
- `DashboardCard.jsx` - Main dashboard summary cards
- `SummaryCard.jsx` - General purpose summary cards
- Specialized card variants (Income, Expense, Savings)

### 📂 **`forms/`** - Form Components
- `AddTransactionForm.jsx` - Transaction creation form
- Form validation and input handling components

### 📂 **`modals/`** - Modal & Popup Components
- `QuickAddModal.jsx` - Quick transaction addition modal
- `EditTransactionModal.jsx` - Transaction editing modal

### 📂 **`tables/`** - Table & List Components
- `TransactionTable.jsx` - Transaction data table
- Data display and pagination components

### 📂 **`filters/`** - Filter & Search Components
- `FiltersBar.jsx` - General filtering interface
- `AnalyticsFilters.jsx` - Analytics-specific filters
- `MonthSelector.jsx` - Date/month selection component

### 📂 **`dashboard/`** - Dashboard-specific Components
- `FinancialSnapshot.jsx` - Financial overview component
- `ActivityTimeline.jsx` - Recent activity timeline
- `AchievementBadge.jsx` - Achievement and milestone badges

### 📂 **`budget/`** - Budget Management Components
- `BudgetGoalsForm.jsx` - Budget goal setting form
- `BudgetInputForm.jsx` - Budget input and editing
- `BudgetProgressBar.jsx` - Budget progress visualization
- `BudgetSummaryCard.jsx` - Budget summary display

### 📂 **`transactions/`** - Transaction Components
- `RecentTransactions.jsx` - Recent transactions list
- Transaction-specific UI components

### 📂 **`analytics/`** - Analytics Components
- Analytics-specific visualization components
- Report generation components

## 🔄 **Import Structure**

### **Organized Imports (Recommended)**
```javascript
// Import from specific folders
import { Navbar, Footer, ProtectedRoute } from '../components/layout'
import { LoadingSpinner, ThemeSwitcher } from '../components/ui'
import { BarChart, PieChart, LineChart } from '../components/charts'
import { DashboardCard, SummaryCard } from '../components/cards'
import { QuickAddModal, EditTransactionModal } from '../components/modals'
```

### **Master Import (Alternative)**
```javascript
// Import everything from master index
import { 
  Navbar, 
  Footer, 
  LoadingSpinner, 
  BarChart, 
  DashboardCard,
  QuickAddModal 
} from '../components'
```

## 📋 **Migration Status**

### ✅ **Completed**
- [x] Layout components (`layout/`)
- [x] UI components (`ui/`)
- [x] Chart components (`charts/`)
- [x] Card components (`cards/`)
- [x] Form components (`forms/`)
- [x] Modal components (`modals/`)

### 🔄 **In Progress**
- [ ] Budget components (`budget/`)
- [ ] Transaction components (`transactions/`)
- [ ] Dashboard components (`dashboard/`)
- [ ] Filter components (`filters/`)
- [ ] Analytics components (`analytics/`)

### 📝 **To Do**
- [ ] User profile components (`user/`)
- [ ] Settings components (`settings/`)
- [ ] Notification components (`notifications/`)

## 🎨 **Component Standards**

### **Naming Convention**
- Use PascalCase for component names
- Use descriptive, specific names
- Include component type in name when helpful (e.g., `Modal`, `Card`, `Form`)

### **File Structure**
```
ComponentName.jsx
├── Imports
├── Component Definition
├── PropTypes/TypeScript (if used)
├── Default Props
├── Styled Components (if used)
└── Export
```

### **Export Pattern**
```javascript
// Named exports for variants
export const SpecializedComponent = (props) => (
  <BaseComponent {...props} variant="special" />
)

// Default export for main component
export default BaseComponent
```

## 🔧 **Development Guidelines**

1. **Keep components focused** - Each component should have a single responsibility
2. **Use composition** - Create specialized variants through composition
3. **Maintain backward compatibility** - Keep legacy exports during migration
4. **Document props** - Add clear prop documentation and examples
5. **Test components** - Ensure each component has appropriate tests

## 🚀 **Benefits of This Structure**

- **Better Organization** - Easy to find and maintain components
- **Improved Developer Experience** - Clear import paths and structure
- **Scalability** - Easy to add new components in appropriate folders
- **Code Reusability** - Shared components are easily discoverable
- **Team Collaboration** - Clear ownership and responsibility areas

## 📚 **Usage Examples**

### **Dashboard Page**
```javascript
import { 
  DashboardCard, 
  FinancialSnapshot, 
  RecentTransactions 
} from '../components/dashboard'
import { BarChart, PieChart } from '../components/charts'
import { LoadingSpinner } from '../components/ui'
```

### **Transaction Management**
```javascript
import { TransactionTable } from '../components/tables'
import { AddTransactionForm } from '../components/forms'
import { QuickAddModal, EditTransactionModal } from '../components/modals'
import { FiltersBar } from '../components/filters'
```

This structure provides a clean, maintainable, and scalable foundation for the SaveWise component library.
