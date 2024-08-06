import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const initialData = [
  { item: 'Product A', ...Object.fromEntries(months.map(month => [month, 0])) },
  { item: 'Product B', ...Object.fromEntries(months.map(month => [month, 0])) },
  { item: 'Product C', ...Object.fromEntries(months.map(month => [month, 0])) },
];

const Index = () => {
  const [revenueData, setRevenueData] = useState(initialData);
  const [costData, setCostData] = useState(initialData);

  const handleDataChange = (dataType, rowIndex, columnName, value) => {
    const updateFunction = dataType === 'revenue' ? setRevenueData : setCostData;
    updateFunction(prevData => {
      const newData = [...prevData];
      newData[rowIndex] = { ...newData[rowIndex], [columnName]: parseFloat(value) || 0 };
      return newData;
    });
  };

  const renderTable = (data, dataType) => (
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          {months.map(month => <TableHead key={month}>{month}</TableHead>)}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow key={row.item}>
            <TableCell>{row.item}</TableCell>
            {months.map(month => (
              <TableCell key={month}>
                <Input
                  type="number"
                  value={row[month]}
                  onChange={(e) => handleDataChange(dataType, rowIndex, month, e.target.value)}
                  className="w-full"
                />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const chartData = months.map(month => ({
    name: month,
    revenue: revenueData.reduce((sum, row) => sum + row[month], 0),
    cost: costData.reduce((sum, row) => sum + row[month], 0),
  }));

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Revenue and Cost Tracker</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Revenue</h2>
        {renderTable(revenueData, 'revenue')}
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Cost</h2>
        {renderTable(costData, 'cost')}
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
