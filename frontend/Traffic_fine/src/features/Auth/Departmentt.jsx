import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, TrendingUp, Calendar, CalendarCheck, BarChart3, Activity } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Departmentt = () => {
  const [counts, setCounts] = useState({
    registeredDrivers: 15245,
    last7DaysRegistered: 342,
    lastMonthRegistered: 1567,
    lastYearRegistered: 8934,
  });

  const [isLoggedIn] = useState(true);
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  // Monthly registration data
  const monthlyData = [
    { month: 'Jan', count: 734 },
    { month: 'Feb', count: 856 },
    { month: 'Mar', count: 923 },
    { month: 'Apr', count: 812 },
    { month: 'May', count: 1045 },
    { month: 'Jun', count: 1178 },
    { month: 'Jul', count: 945 },
    { month: 'Aug', count: 1089 },
    { month: 'Sep', count: 1234 },
    { month: 'Oct', count: 1156 },
    { month: 'Nov', count: 1342 },
    { month: 'Dec', count: 1567 }
  ];

  // Trend data
  const trendData = [
    { week: 'Week 1', registrations: 78 },
    { week: 'Week 2', registrations: 92 },
    { week: 'Week 3', registrations: 85 },
    { week: 'Week 4', registrations: 87 }
  ];

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/auth/login');
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    return null;
  }

  const StatCard = ({ title, count, icon: Icon, gradient, shadowColor }) => (
    <div className="group">
      <div className={`bg-gradient-to-br ${gradient} rounded-2xl shadow-xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`bg-white/20 backdrop-blur-sm p-3 rounded-xl`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div className="text-white/80 text-sm font-medium">
            <Activity className="w-5 h-5" />
          </div>
        </div>
        <h3 className="text-4xl font-bold text-white mb-2">
          {count.toLocaleString()}
        </h3>
        <p className="text-white/90 text-sm font-medium">{title}</p>
        <div className="mt-3 flex items-center text-white/80 text-xs">
          <TrendingUp className="w-4 h-4 mr-1" />
          <span>Active</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Motor Traffic Department
              </h1>
              <p className="text-blue-100">Dashboard Overview - {currentYear}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
              <p className="text-white text-sm font-medium">Account Holder</p>
              <p className="text-white/90 text-xs">MTD Admin</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Registered Drivers"
            count={counts.registeredDrivers}
            icon={Users}
            gradient="from-blue-500 to-indigo-600"
            shadowColor="blue"
          />

          <StatCard
            title="Last 7 Days"
            count={counts.last7DaysRegistered}
            icon={Calendar}
            gradient="from-purple-500 to-pink-600"
            shadowColor="purple"
          />

          <StatCard
            title="Last Month"
            count={counts.lastMonthRegistered}
            icon={CalendarCheck}
            gradient="from-orange-500 to-red-600"
            shadowColor="orange"
          />

          <StatCard
            title="Last Year"
            count={counts.lastYearRegistered}
            icon={BarChart3}
            gradient="from-green-500 to-emerald-600"
            shadowColor="green"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Registrations Chart */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Monthly Registrations {currentYear}
                  </h3>
                  <p className="text-blue-100 text-sm">Driver registration trends</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="count"
                    fill="#8b5cf6"
                    name="Registrations"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weekly Trend Chart */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Weekly Trend
                  </h3>
                  <p className="text-green-100 text-sm">Last 4 weeks performance</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="week" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="registrations"
                    stroke="#10b981"
                    strokeWidth={3}
                    name="Registrations"
                    dot={{ fill: '#10b981', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-xl">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Average Daily</p>
                <p className="text-2xl font-bold text-gray-800">
                  {Math.round(counts.last7DaysRegistered / 7)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-xl">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Growth Rate</p>
                <p className="text-2xl font-bold text-gray-800">+12.5%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-xl">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">System Status</p>
                <p className="text-2xl font-bold text-green-600">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Departmentt;