import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Clock } from 'lucide-react';

const BudgetAllocation = ({ budgetData }) => {
  // Default colors for different categories
  const COLORS = {
    Food: '#FF6B6B',
    Travel: '#4ECDC4',
    Shopping: '#45B7D1',
    Education: '#96CEB4',
    Housing: '#FFEEAD',
    Entertainment: '#FFD93D',
    Healthcare: '#6C5B7B',
    Utilities: '#C06C84',
    Transportation: '#F8B195',
    Others: '#A8E6CF'
  };

  // Format data for the pie chart
  const formatData = (data) => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map(item => ({
      name: item.category,
      value: parseFloat(item.amount),
      percentage: item.percentage,
      color: COLORS[item.category] || '#808080'
    }));
  };

  const chartData = formatData(budgetData);

  if (!chartData.length) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Budget Allocation</h2>
        <p className="text-gray-500 text-center">No budget data available</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm text-gray-600">
            Amount: ${payload[0].value.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">
            {payload[0].payload.percentage}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Budget Allocation</h2>
        <p className="text-sm text-gray-600">How your budget is distributed</p>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              layout="vertical" 
              align="right"
              verticalAlign="middle"
              formatter={(value, entry) => (
                <span className="text-sm text-gray-700">
                  {value} ({entry.payload.percentage}%)
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BudgetAllocation;