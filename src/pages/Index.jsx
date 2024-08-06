import React, { useState } from 'react';
import Spreadsheet from 'react-spreadsheet';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const initialData = [
  [{ value: 'Item' }, ...months.map(month => ({ value: month }))],
  ['Product A', ...Array(12).fill({ value: 0 })],
  ['Product B', ...Array(12).fill({ value: 0 })],
  ['Product C', ...Array(12).fill({ value: 0 })],
];

const Index = () => {
  const [revenueData, setRevenueData] = useState(initialData);
  const [costData, setCostData] = useState(initialData);

  const handleDataChange = (dataType, newData) => {
    const updateFunction = dataType === 'revenue' ? setRevenueData : setCostData;
    updateFunction(newData);
  };

  const renderSpreadsheet = (data, dataType) => (
    <Spreadsheet
      data={data}
      onChange={(newData) => handleDataChange(dataType, newData)}
      className="w-full"
    />
  );

  const chartData = months.map((month, index) => ({
    name: month,
    revenue: revenueData.slice(1).reduce((sum, row) => sum + (parseFloat(row[index + 1]?.value) || 0), 0),
    cost: costData.slice(1).reduce((sum, row) => sum + (parseFloat(row[index + 1]?.value) || 0), 0),
  }));

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Revenue and Cost Tracker</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Revenue</h2>
        {renderSpreadsheet(revenueData, 'revenue')}
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Cost</h2>
        {renderSpreadsheet(costData, 'cost')}
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold mb-4">Trends</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue" />
            <Line type="monotone" dataKey="cost" stroke="#82ca9d" name="Cost" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Index;
