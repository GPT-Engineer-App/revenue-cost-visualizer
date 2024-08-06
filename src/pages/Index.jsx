import React, { useState, useCallback } from 'react';
import Spreadsheet from 'react-spreadsheet';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

const parseCsv = (csvContent) => {
  const rows = csvContent.split('\n');
  return rows.map(row => row.split(',').map(cell => ({ value: cell.trim() })));
};

const Index = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [costData, setCostData] = useState([]);

  const handleFileUpload = useCallback((event, dataType) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const parsedData = parseCsv(content);
      if (dataType === 'revenue') {
        setRevenueData(parsedData);
      } else {
        setCostData(parsedData);
      }
    };
    reader.readAsText(file);
  }, []);

  const renderSpreadsheet = (data, dataType) => (
    <Spreadsheet
      data={data}
      onChange={(newData) => dataType === 'revenue' ? setRevenueData(newData) : setCostData(newData)}
      className="w-full"
    />
  );

  const chartData = revenueData[0]?.slice(1).map((_, index) => ({
    name: revenueData[0][index + 1]?.value,
    revenue: revenueData.slice(1).reduce((sum, row) => sum + (parseFloat(row[index + 1]?.value) || 0), 0),
    cost: costData.slice(1).reduce((sum, row) => sum + (parseFloat(row[index + 1]?.value) || 0), 0),
  })) || [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Revenue and Cost Tracker</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Revenue</h2>
        <div className="flex items-center mb-4">
          <Input
            type="file"
            accept=".csv"
            onChange={(e) => handleFileUpload(e, 'revenue')}
            className="mr-2"
          />
          <Button>
            <Upload className="mr-2 h-4 w-4" /> Upload CSV
          </Button>
        </div>
        {renderSpreadsheet(revenueData, 'revenue')}
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Cost</h2>
        <div className="flex items-center mb-4">
          <Input
            type="file"
            accept=".csv"
            onChange={(e) => handleFileUpload(e, 'cost')}
            className="mr-2"
          />
          <Button>
            <Upload className="mr-2 h-4 w-4" /> Upload CSV
          </Button>
        </div>
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
