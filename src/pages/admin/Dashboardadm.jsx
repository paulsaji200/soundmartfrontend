import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import api from "../../utils/axios";
import {
  Calendar,
  BarChart2,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const AdminDashboard = () => {
  const [monthlySalesData, setMonthlySalesData] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [bestSellingCategories, setBestSellingCategories] = useState([]);
  const [timePeriod, setTimePeriod] = useState("monthly");

  const monthNames = [
    "", // Placeholder for index 0
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const salesResponse = await api.get(`/admin/salesdata/${timePeriod}`);
        setMonthlySalesData(salesResponse.data);

        const productsResponse = await api.get("/admin/sales/best-products");
        setBestSellingProducts(productsResponse.data);

        const categoriesResponse = await api.get("/admin/sales/best-categories");
        setBestSellingCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, [timePeriod]);

  const totalSales = monthlySalesData.reduce((acc, curr) => acc + curr.totalSales, 0);
  const totalOrders = monthlySalesData.reduce((acc, curr) => acc + curr.totalOrders, 0);
  const averageOrderValue = totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : 0;

  const statsCards = [
    {
      title: "Total Sales",
      value: `$${totalSales.toLocaleString()}`,
      change: "+12.5%",
      isIncrease: true,
    },
    {
      title: "Total Orders",
      value: `${totalOrders.toLocaleString()}`,
      change: "+5.2%",
      isIncrease: true,
    },
    {
      title: "Average Order Value",
      value: `$${averageOrderValue}`,
      change: "+2.4%",
      isIncrease: true,
    },
  ];

  const chartConfig = {
    margin: { top: 20, right: 30, left: 20, bottom: 65 },
    tooltipStyle: {
      contentStyle: {
        backgroundColor: "white",
        border: "1px solid #e5e7eb",
        borderRadius: "0.5rem",
        padding: "0.5rem",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>

        {/* Filter Dropdown */}
        <div className="flex justify-end mb-4">
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            className="border border-gray-300 rounded-lg p-2"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">{stat.title}</span>
                {index === 0 ? (
                  <BarChart2 className="text-blue-600" size={20} />
                ) : index === 1 ? (
                  <Calendar className="text-green-600" size={20} />
                ) : (
                  <PieChart className="text-purple-600" size={20} />
                )}
              </div>
              <div className="mt-2">
                <span className="text-2xl font-bold">{stat.value}</span>
                <div className="flex items-center mt-1">
                  {stat.isIncrease ? (
                    <ArrowUpRight className="text-green-500" size={16} />
                  ) : (
                    <ArrowDownRight className="text-red-500" size={16} />
                  )}
                  <span className={`text-sm ${stat.isIncrease ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)} Sales
          </h3>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlySalesData} margin={chartConfig.margin}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey={timePeriod === 'yearly' ? "year" : timePeriod === 'monthly' ? "month" : "week"}
                  height={60}
                  angle={-45}
                  textAnchor="end"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  tickFormatter={(value) =>
                    timePeriod === 'yearly'
                      ? `Year ${value}`
                      : timePeriod === 'monthly'
                      ? monthNames[value]
                      : `Week ${value}`
                  }
                />
                <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
                <Tooltip {...chartConfig.tooltipStyle} />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Line
                  type="monotone"
                  dataKey="totalSales"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ fill: "#6366f1", stroke: "#fff", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Best Selling Products Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top 10 Best-Selling Products
          </h3>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bestSellingProducts} margin={chartConfig.margin}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="_id.productName"
                  tickFormatter={(name) => (name.length > 15 ? `${name.slice(0, 15)}...` : name)}
                  height={60}
                  angle={-45}
                  textAnchor="end"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                />
                <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
                <Tooltip {...chartConfig.tooltipStyle} />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Bar dataKey="totalQuantity" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Best Selling Categories */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top 10 Best-Selling Categories
          </h3>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bestSellingCategories} margin={chartConfig.margin}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="_id"
                  height={60}
                  angle={-45}
                  textAnchor="end"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                />
                <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
                <Tooltip {...chartConfig.tooltipStyle} />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Bar dataKey="totalQuantity" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
