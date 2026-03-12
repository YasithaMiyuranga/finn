import { useState } from 'react';
import { Users, TrendingUp, Settings, FileText, Shield, BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function GeneralUserDashboard() {
    const [stats] = useState({
        totalUsers: 15245,
        activeUsers: 12340,
        systemHealth: 98.5,
        dailyActiveUsers: 3456
    });

    const user = {
        name: 'Admin User',
        role: 'General User',
        email: 'admin@trafficfine.lk'
    };

    const userData = [
        { name: 'Drivers', value: 8500 },
        { name: 'Police', value: 450 },
        { name: 'Officials', value: 120 },
        { name: 'Public', value: 6175 }
    ];

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];

    const StatCard = ({ title, value, icon: Icon, gradient, subtitle }) => (
        <div className={`bg-gradient-to-br ${gradient} rounded-2xl shadow-xl p-6 text-white`}>
            <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                    <Icon className="w-8 h-8" />
                </div>
            </div>
            <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
            <p className="text-4xl font-bold mb-2">{value}</p>
            {subtitle && <p className="text-white/70 text-xs">{subtitle}</p>}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 p-4 md:p-8">
            <div className="max-w-7xl mx-auto mb-8">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-gray-400 to-gray-600 p-4 rounded-xl">
                            <Users className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-1">👤 General Dashboard</h1>
                            <p className="text-gray-200">Welcome, {user.name} • {user.role}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Users"
                        value={stats.totalUsers.toLocaleString()}
                        icon={Users}
                        gradient="from-blue-500 to-indigo-600"
                    />

                    <StatCard
                        title="Active Users"
                        value={stats.activeUsers.toLocaleString()}
                        icon={TrendingUp}
                        gradient="from-green-500 to-emerald-600"
                    />

                    <StatCard
                        title="Daily Active"
                        value={stats.dailyActiveUsers.toLocaleString()}
                        icon={BarChart3}
                        gradient="from-purple-500 to-pink-600"
                    />

                    <StatCard
                        title="System Health"
                        value={`${stats.systemHealth}%`}
                        icon={Settings}
                        gradient="from-orange-500 to-red-600"
                        subtitle="All systems operational"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl shadow-2xl p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">📊 User Distribution</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={userData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={(entry) => `${entry.name}: ${entry.value}`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {userData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white rounded-2xl shadow-2xl p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">⚡ Quick Links</h3>
                        <div className="space-y-3">
                            <a href="/dashboard/reports" className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-6 h-6 text-blue-600" />
                                    <div>
                                        <p className="font-semibold text-gray-800">View Reports</p>
                                        <p className="text-sm text-gray-600">System analytics and statistics</p>
                                    </div>
                                </div>
                            </a>

                            <a href="/dashboard/ai-chat" className="block p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <Shield className="w-6 h-6 text-purple-600" />
                                    <div>
                                        <p className="font-semibold text-gray-800">AI Assistant</p>
                                        <p className="text-sm text-gray-600">Get help from AI chatbot</p>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
