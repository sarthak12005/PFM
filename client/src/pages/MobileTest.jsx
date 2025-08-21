import React, { useState } from 'react'
import {
  Smartphone,
  Tablet,
  Monitor,
  RotateCcw,
  Zap,
  Wifi,
  Battery,
  Hand,
  Eye,
  Settings
} from 'lucide-react'
import { PieChart, BarChart } from '../components/charts'
import { SummaryCard } from '../components/cards'
import AddTransactionForm from '../components/forms/AddTransactionForm'
import { EditTransactionModal } from '../components/modals'
import toast from 'react-hot-toast'

const MobileTest = () => {
  const [showModal, setShowModal] = useState(false)
  const [testData] = useState({
    pieData: {
      labels: ['Food', 'Transport', 'Entertainment', 'Bills'],
      datasets: [{
        data: [300, 150, 100, 200],
        backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']
      }]
    },
    barData: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [{
        label: 'Income',
        data: [3000, 3200, 2800, 3500, 3100],
        backgroundColor: '#10B981'
      }, {
        label: 'Expenses',
        data: [2500, 2800, 2200, 2900, 2600],
        backgroundColor: '#EF4444'
      }]
    }
  })

  const handleFormSubmit = (data) => {
    console.log('Form submitted:', data)
    toast.success('Transaction added successfully!', {
      duration: 3000,
      position: 'top-center'
    })
  }

  const testSections = [
    {
      title: 'Touch Targets',
      description: 'Testing minimum 44px touch targets',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button className="btn btn-primary touch-target">Primary</button>
            <button className="btn btn-secondary touch-target">Secondary</button>
            <button className="btn btn-danger touch-target">Danger</button>
            <button className="btn btn-success touch-target">Success</button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="p-2 bg-gray-100 rounded-lg touch-target">
              <Smartphone size={20} />
            </button>
            <button className="p-2 bg-gray-100 rounded-lg touch-target">
              <Tablet size={20} />
            </button>
            <button className="p-2 bg-gray-100 rounded-lg touch-target">
              <Monitor size={20} />
            </button>
            <button className="p-2 bg-gray-100 rounded-lg touch-target">
              <Settings size={20} />
            </button>
          </div>
        </div>
      )
    },
    {
      title: 'Form Elements',
      description: 'Testing form responsiveness and mobile keyboards',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Text input" 
              className="input"
            />
            <input 
              type="email" 
              placeholder="Email input" 
              className="input"
            />
            <input 
              type="number" 
              placeholder="Number input" 
              className="input"
              inputMode="decimal"
            />
            <input 
              type="tel" 
              placeholder="Phone input" 
              className="input"
              inputMode="tel"
            />
          </div>
          <textarea 
            placeholder="Textarea for longer text" 
            className="input w-full h-24"
          />
          <select className="input w-full">
            <option>Select option 1</option>
            <option>Select option 2</option>
            <option>Select option 3</option>
          </select>
        </div>
      )
    },
    {
      title: 'Cards & Layout',
      description: 'Testing responsive card layouts',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <SummaryCard
            title="Total Income"
            value="₹45,000"
            subtitle="This month"
            trend={{ value: 12, isPositive: true }}
            icon={Zap}
            color="green"
          />
          <SummaryCard
            title="Total Expenses"
            value="₹32,000"
            subtitle="This month"
            trend={{ value: 8, isPositive: false }}
            icon={Battery}
            color="red"
          />
          <SummaryCard
            title="Net Savings"
            value="₹13,000"
            subtitle="This month"
            trend={{ value: 15, isPositive: true }}
            icon={Wifi}
            color="blue"
          />
        </div>
      )
    },
    {
      title: 'Charts',
      description: 'Testing chart responsiveness on different screen sizes',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium mb-3">Pie Chart</h4>
              <PieChart 
                data={testData.pieData} 
                title="Expense Categories"
                height={300}
              />
            </div>
            <div>
              <h4 className="text-lg font-medium mb-3">Bar Chart</h4>
              <BarChart 
                data={testData.barData} 
                title="Income vs Expenses"
                height={300}
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Modal & Overlays',
      description: 'Testing modal responsiveness and mobile behavior',
      content: (
        <div className="space-y-4">
          <button 
            onClick={() => setShowModal(true)}
            className="btn btn-primary"
          >
            Open Test Modal
          </button>
          <p className="text-sm text-gray-600">
            Modal should slide up from bottom on mobile and center on desktop
          </p>
        </div>
      )
    },
    {
      title: 'Full Form Test',
      description: 'Complete form with all mobile optimizations',
      content: (
        <AddTransactionForm 
          onSubmit={handleFormSubmit}
        />
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mobile Responsiveness Test
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            This page tests various components and interactions across different screen sizes.
            Use browser dev tools to simulate different devices.
          </p>
        </div>

        {/* Device Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
          <h2 className="text-lg font-semibold mb-3">Current Device Info</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Screen:</span>
              <br />
              {window.screen.width}×{window.screen.height}
            </div>
            <div>
              <span className="text-gray-500">Viewport:</span>
              <br />
              {window.innerWidth}×{window.innerHeight}
            </div>
            <div>
              <span className="text-gray-500">Pixel Ratio:</span>
              <br />
              {window.devicePixelRatio}x
            </div>
            <div>
              <span className="text-gray-500">Touch:</span>
              <br />
              {'ontouchstart' in window ? 'Supported' : 'Not Supported'}
            </div>
          </div>
        </div>

        {/* Test Sections */}
        <div className="space-y-8">
          {testSections.map((section, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {section.title}
                </h2>
                <p className="text-gray-600 text-sm">
                  {section.description}
                </p>
              </div>
              {section.content}
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">
            Testing Instructions
          </h2>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• Use browser dev tools to simulate different devices (iPhone, iPad, Android, etc.)</p>
            <p>• Test both portrait and landscape orientations</p>
            <p>• Verify touch targets are at least 44px and easy to tap</p>
            <p>• Check that forms work well with mobile keyboards</p>
            <p>• Ensure charts and modals adapt to screen size</p>
            <p>• Test scrolling behavior and viewport handling</p>
          </div>
        </div>
      </div>

      {/* Test Modal */}
      {showModal && (
        <EditTransactionModal
          transaction={{
            _id: 'test',
            title: 'Test Transaction',
            amount: 100,
            type: 'expense',
            category: 'Food & Dining',
            date: '2024-01-15',
            description: 'Test description'
          }}
          onSubmit={(data) => {
            console.log('Modal submitted:', data)
            setShowModal(false)
          }}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

export default MobileTest
