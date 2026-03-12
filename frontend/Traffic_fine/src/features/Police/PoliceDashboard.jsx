import { useState, useEffect } from 'react';
import { Shield, FileText, Search, TrendingUp, Users, DollarSign, AlertCircle } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function PoliceDashboard() {
    const [stats, setStats] = useState({
        finesToday: 12,
        finesThisMonth: 156,
        amountCollected: 435000,
        pendingFines: 23,
        averageFine: 2500
    });

    // Mock officer data - replace with actual logged-in officer
    const officer = {
        name: 'Officer Perera',
        badgeNumber: 'P12345',
        rank: 'Sergeant',
        station: 'Colombo Traffic Police'
    };

    // Mock data for charts
    const dailyData = [
        { day: 'Mon', fines: 8 },
        { day: 'Tue', fines: 12 },
        { day: 'Wed', fines: 10 },
        { day: 'Thu', fines: 15 },
        { day: 'Fri', fines: 18 },
        { day: 'Sat', fines: 22 },
        { day: 'Sun', fines: 12 }
    ];

    const violationTypes = [
        { type: 'Speeding', count: 45 },
        { type: 'No Helmet', count: 32 },
        { type: 'Red Light', count: 28 },
        { type: 'Parking', count: 18 },
        { type: 'Others', count: 33 }
    ];

    const StatCard = ({ title, value, icon: Icon, gradient, subtitle }) => (
        <div className={`bg-gradient-to-br ${gradient} rounded-2xl shadow-xl p-6 text-white transition-all duration-300 transform hover:scale-105`}>
            <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                    <Icon className="w-8 h-8" />
                </div>
                <div className="text-right">
                    <p className="text-white/80 text-sm font-medium">{title}</p>
                    <p className="text-3xl font-bold mt-1">{value}</p>
                    {subtitle && <p className="text-white/70 text-xs mt-1">{subtitle}</p>}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-4 md:p-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-4 rounded-xl">
                                <Shield className="w-10 h-10 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-1">
                                    👮 Police Officer Dashboard
                                </h1>
                                <p className="text-blue-200">
                                    Welcome, {officer.name} • Badge: {officer.badgeNumber} • {officer.rank}
                                </p>
                                <p className="text-blue-300 text-sm">{officer.station}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-white/70 text-sm">Today's Date</p>
                            <p className="text-white font-semibold text-lg">
                                {new Date().toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Fines Today"
                        value={stats.finesToday}
                        icon={FileText}
                        gradient="from-blue-500 to-indigo-600"
                    />

                    <StatCard
                        title="This Month"
                        value={stats.finesThisMonth}
                        icon={TrendingUp}
                        gradient="from-purple-500 to-pink-600"
                    />

                    <StatCard
                        title="Amount Collected"
                        value={`Rs. ${(stats.amountCollected / 1000).toFixed(0)}K`}
                        icon={DollarSign}
                        gradient="from-green-500 to-emerald-600"
                        subtitle="This month"
                    />

                    <StatCard
                        title="Pending Fines"
                        value={stats.pendingFines}
                        icon={AlertCircle}
                        gradient="from-orange-500 to-red-600"
                    />
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-2xl p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">⚡ Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <a
                            href="/police/issue-fine"
                            className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl group"
                        >
                            <FileText className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            <div>
                                <p className="font-semibold">Issue New Fine</p>
                                <p className="text-xs text-blue-100">Create traffic fine</p>
                            </div>
                        </a>

                        <a
                            href="/police/search-driver"
                            className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl group"
                        >
                            <Search className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            <div>
                                <p className="font-semibold">Search Driver</p>
                                <p className="text-xs text-purple-100">Find driver details</p>
                            </div>
                        </a>

                        <a
                            href="/police/manage-fines"
                            className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl group"
                        >
                            <Users className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            <div>
                                <p className="font-semibold">Manage Fines</p>
                                <p className="text-xs text-green-100">View all fines</p>
                            </div>
                        </a>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Daily Fines Chart */}
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                            <h3 className="text-xl font-bold text-white">📊 Fines This Week</h3>
                            <p className="text-blue-100 text-sm">Daily trend</p>
                        </div>
                        <div className="p-6">
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={dailyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="day" stroke="#6b7280" />
                                    <YAxis stroke="#6b7280" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Bar dataKey="fines" fill="#4F46E5" name="Fines Issued" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Violation Types Chart */}
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                            <h3 className="text-xl font-bold text-white">🚦 Violation Types</h3>
                            <p className="text-purple-100 text-sm">This month breakdown</p>
                        </div>
                        <div className="p-6">
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={violationTypes} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis type="number" stroke="#6b7280" />
                                    <YAxis dataKey="type" type="category" stroke="#6b7280" width={80} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Bar dataKey="count" fill="#9333EA" name="Count" radius={[0, 8, 8, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl shadow-2xl p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">📋 Recent Activity</h3>
                    <div className="space-y-3">
                        {[
                            { time: '2 mins ago', action: 'Fine issued', detail: 'TF-2025-001234 - Speed Violation', status: 'success' },
                            { time: '15 mins ago', action: 'Driver searched', detail: 'License: B1234567', status: 'info' },
                            { time: '1 hour ago', action: 'Fine paid', detail: 'TF-2025-001230 - Rs. 2,500', status: 'success' },
                            { time: '2 hours ago', action: 'Fine issued', detail: 'TF-2025-001229 - No Helmet', status: 'success' },
                        ].map((activity, index) => (
                            <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className={`w-2 h-2 rounded-full ${activity.status === 'success' ? 'bg-green-500' : 'bg-blue-500'
                                    }`}></div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800">{activity.action}</p>
                                    <p className="text-sm text-gray-600">{activity.detail}</p>
                                </div>
                                <p className="text-xs text-gray-500">{activity.time}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Performance Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <p className="text-gray-600 text-sm font-medium mb-2">Average Fine Amount</p>
                        <p className="text-3xl font-bold text-gray-800">Rs. {stats.averageFine.toLocaleString()}</p>
                        <p className="text-sm text-green-600 mt-1">↑ 5% from last month</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <p className="text-gray-600 text-sm font-medium mb-2">Collection Rate</p>
                        <p className="text-3xl font-bold text-gray-800">85%</p>
                        <p className="text-sm text-blue-600 mt-1">On-time payments</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <p className="text-gray-600 text-sm font-medium mb-2">Your Rank</p>
                        <p className="text-3xl font-bold text-gray-800">#3</p>
                        <p className="text-sm text-purple-600 mt-1">In your station</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
