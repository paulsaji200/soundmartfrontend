import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../../config/axiosConfig';

const Card = ({ children, className }) => <div className={`bg-white shadow rounded-lg ${className}`}>{children}</div>;
const CardHeader = ({ children, className }) => <div className={`p-4 border-b ${className}`}>{children}</div>;
const CardContent = ({ children, className }) => <div className={`p-4 ${className}`}>{children}</div>;



const SaleChart = () => {
  const [period, setPeriod] = useState('WEEKLY');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      try{
        const response = await api.get(`dashboard/sales-chart?period=${period}`)
        setChartData(response.data);
      }catch(error){
        console.log(error)
      }
    }
    fetchSalesData()
  }, [period])

  return (
    <div className="w-full">
      <Card className="">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Sale Graph</h2>
          <div className="flex gap-2">
            {['WEEKLY', 'MONTHLY', 'YEARLY'].map((item) => (
              <button
                key={item}
                onClick={() => setPeriod(item)}
                className={`px-4 py-1 rounded-full text-sm ${
                  period === item
                    ? 'bg-black text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent width="100%">
          <ResponsiveContainer width="" height={300}>
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#888', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#888', fontSize: 12 }}
                tickFormatter={(value) => `₹${value}`} 
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#4F46E5"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default SaleChart;