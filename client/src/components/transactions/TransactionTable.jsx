import React from 'react'
import { Edit3, Trash2, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react'

const TransactionTable = ({ transactions, onEdit, onDelete, formatCurrency }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getCategoryIcon = (category) => {
    const iconMap = {
      'Food': '🍽️',
      'Housing': '🏠',
      'Transportation': '🚗',
      'Utilities': '⚡',
      'Job': '💼',
      'Freelance': '💻',
      'Investment': '📈',
      'Entertainment': '🎬',
      'Healthcare': '🏥',
      'Shopping': '🛍️',
      'Education': '📚',
      'Travel': '✈️',
      'Business': '🏢',
      'Rental': '🏘️',
      'Gift': '🎁',
      'Insurance': '🛡️',
      'Other Income': '💰',
      'Other Expense': '💸'
    }
    return iconMap[category] || '💰'
  }

  const getCategoryColor = (category) => {
    const colorMap = {
      'Food': 'bg-orange-100 text-orange-800',
      'Housing': 'bg-blue-100 text-blue-800',
      'Transportation': 'bg-green-100 text-green-800',
      'Utilities': 'bg-yellow-100 text-yellow-800',
      'Job': 'bg-purple-100 text-purple-800',
      'Freelance': 'bg-indigo-100 text-indigo-800',
      'Investment': 'bg-emerald-100 text-emerald-800',
      'Entertainment': 'bg-pink-100 text-pink-800',
      'Healthcare': 'bg-red-100 text-red-800',
      'Shopping': 'bg-cyan-100 text-cyan-800',
      'Education': 'bg-violet-100 text-violet-800',
      'Travel': 'bg-teal-100 text-teal-800',
      'Business': 'bg-slate-100 text-slate-800',
      'Rental': 'bg-lime-100 text-lime-800',
      'Gift': 'bg-rose-100 text-rose-800',
      'Insurance': 'bg-amber-100 text-amber-800',
      'Other Income': 'bg-green-100 text-green-800',
      'Other Expense': 'bg-gray-100 text-gray-800'
    }
    return colorMap[category] || 'bg-gray-100 text-gray-800'
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <Calendar size={48} className="mb-4 text-gray-300" />
        <p className="text-lg font-medium">No transactions found</p>
        <p className="text-sm">Add your first transaction to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Transaction</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Category</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Amount</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transaction.type === 'income' ? (
                          <ArrowUpRight size={16} className="text-green-600" />
                        ) : (
                          <ArrowDownRight size={16} className="text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.title}</p>
                        <p className="text-sm text-gray-500">{formatDate(transaction.createdAt)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.type === 'income' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type === 'income' ? '↗️ Income' : '↘️ Expense'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(transaction.category)}`}>
                      <span className="mr-1">{getCategoryIcon(transaction.category)}</span>
                      {transaction.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className={`font-semibold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => onEdit(transaction)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Edit transaction"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(transaction._id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete transaction"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {transactions.map((transaction) => (
          <div key={transaction._id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {transaction.type === 'income' ? (
                    <ArrowUpRight size={16} className="text-green-600" />
                  ) : (
                    <ArrowDownRight size={16} className="text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{transaction.title}</p>
                  <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                </div>
              </div>
              <span className={`font-semibold ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(transaction.category)}`}>
                  <span className="mr-1">{getCategoryIcon(transaction.category)}</span>
                  {transaction.category}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  transaction.type === 'income' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {transaction.type === 'income' ? '↗️ Income' : '↘️ Expense'}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEdit(transaction)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  title="Edit transaction"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => onDelete(transaction._id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  title="Delete transaction"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TransactionTable
