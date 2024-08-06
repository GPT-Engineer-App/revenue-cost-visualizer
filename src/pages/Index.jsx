import React, { useState, useCallback } from 'react';
import Spreadsheet from 'react-spreadsheet';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const parseCsv = (csvContent) => {
  const rows = csvContent.split('\n');
  return rows.map(row => row.split(',').map(cell => ({ value: cell.trim() })));
};

const generateTemplateData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return [
    [{ value: 'Category' }, ...months.map(month => ({ value: month }))],
    [{ value: 'Item 1' }, ...Array(12).fill({ value: '' })],
    [{ value: 'Item 2' }, ...Array(12).fill({ value: '' })],
    [{ value: 'Item 3' }, ...Array(12).fill({ value: '' })],
  ];
};

const Index = () => {
  const [revenueData, setRevenueData] = useState(generateTemplateData());
  const [costData, setCostData] = useState(generateTemplateData());
  const [outlierAlerts, setOutlierAlerts] = useState({ revenue: [], cost: [] });

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

  const checkOutliers = (dataType) => {
    const data = dataType === 'revenue' ? revenueData : costData;
    const alerts = [];

    data.slice(1).forEach((row, rowIndex) => {
      const numbers = row.slice(1).map(cell => parseFloat(cell.value) || 0);
      const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
      const stdDev = Math.sqrt(numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / numbers.length);

      numbers.forEach((num, index) => {
        if (Math.abs(num - mean) > 2 * stdDev) {
          alerts.push(`Potential outlier in ${dataType}: ${row[0].value}, Month ${index + 1}`);
        }
      });
    });

    setOutlierAlerts(prev => ({ ...prev, [dataType]: alerts }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Revenue and Cost Tracker</h1>

      {outlierAlerts.revenue.length > 0 && (
        <Alert variant="warning" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {outlierAlerts.revenue.map((alert, index) => (
              <div key={index}>{alert}</div>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {outlierAlerts.cost.length > 0 && (
        <Alert variant="warning" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {outlierAlerts.cost.map((alert, index) => (
              <div key={index}>{alert}</div>
            ))}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Revenue</h2>
        <div className="flex items-center mb-4">
          <Input
            type="file"
            accept=".csv"
            onChange={(e) => handleFileUpload(e, 'revenue')}
            className="mr-2"
          />
          <Button className="mr-2">
            <Upload className="mr-2 h-4 w-4" /> Upload CSV
          </Button>
          <Button onClick={() => checkOutliers('revenue')}>
            <AlertTriangle className="mr-2 h-4 w-4" /> Check Outliers
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
          <Button className="mr-2">
            <Upload className="mr-2 h-4 w-4" /> Upload CSV
          </Button>
          <Button onClick={() => checkOutliers('cost')}>
            <AlertTriangle className="mr-2 h-4 w-4" /> Check Outliers
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
