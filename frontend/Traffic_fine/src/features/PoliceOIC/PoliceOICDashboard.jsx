import { useState } from 'react';
import { Shield, Users, FileText, TrendingUp, Award, BarChart3 } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function PoliceOICDashboard() {
    const [stats] = useState({
        totalOfficers: 25,
        activeCases: 145,
        monthlyFines: 234,
        revenue: 585000,
        topOfficer: 'Officer Silva'
    });

    const oic = {
        name: 'Inspector Bandara',
        badgeNumber: 'OIC-001',
        station: 'Colombo Traffic Police',
        rank: 'Inspector'
    };

    const officerPerformance = [
        { name: 'Officer Silva', fines: 45 },
        { name: 'Officer Perera', fines: 38 },
        { name: 'Officer Fernando', fines: 32 },
        { name: 'Officer Dias', fines: 28 },
        { name: 'Officer Kumar', fines: 25 }
    ];

    const monthlyTrend = [
        { month: 'Aug', fines: 180 },
        { month: 'Sep', fines: 195 },
        { month: 'Oct', fines: 210 },
        { month: 'Nov', fines: 225 },
        { month: 'Dec', fines: 220 },
        { month: 'Jan', fines: 234 }
    ];

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
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-4 md:p-8">
            <div className="max-w-7xl mx-auto mb-8">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-4 rounded-xl">
                            <Shield className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-1">
                                👮‍♂️ Officer in Charge Dashboard
                            </h1>
                            <p className="text-blue-200">
                                {oic.name} • Badge: {oic.badgeNumber} • {oic.rank}
                            </p>
                            <p className="text-blue-300 text-sm">{oic.station}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Officers"
                        value={stats.totalOfficers}
                        icon={Users}
                        gradient="from-blue-500 to-indigo-600"
                        subtitle="Under supervision"
                    />

                    <StatCard
                        title="Active Cases"
                        value={stats.activeCases}
                        icon={FileText}
                        gradient="from-purple-500 to-pink-600"
                        subtitle="This month"
                    />

                    <StatCard
                        title="Monthly Fines"
                        value={stats.monthlyFines}
                        icon={TrendingUp}
                        gradient="from-green-500 to-emerald-600"
                        subtitle="Issued this month"
                    />

                    <StatCard
                        title="Revenue"
                        value={`Rs. ${(stats.revenue / 1000).toFixed(0)}K`}
                        icon={BarChart3}
                        gradient="from-orange-500 to-red-600"
                        subtitle="This month collection"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Officer Performance */}
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                            <h3 className="text-xl font-bold text-white">🏆 Officer Performance</h3>
                            <p className="text-blue-100 text-sm">Top performers this month</p>
                        </div>
                        <div className="p-6">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={officerPerformance} layout="horizontal">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" width={100} />
                                    <Tooltip />
                                    <Bar dataKey="fines" fill="#4F46E5" name="Fines Issued" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Monthly Trend */}
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                            <h3 className="text-xl font-bold text-white">📈 Monthly Trend</h3>
                            <p className="text-purple-100 text-sm">Station performance</p>
                        </div>
                        <div className="p-6">
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={monthlyTrend}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="fines"
                                        stroke="#9333EA"
                                        strokeWidth={3}
                                        dot={{ fill: '#9333EA', r: 5 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-2xl p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">⚡ Management Tools</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <a href="/police/manage-fines" className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg">
                            <FileText className="w-6 h-6" />
                            <div>
                                <p className="font-semibold">Manage All Fines</p>
                                <p className="text-xs text-blue-100">View and manage fines</p>
                            </div>
                        </a>

                        <a href="/dashboard/reports" className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg">
                            <BarChart3 className="w-6 h-6" />
                            <div>
                                <p className="font-semibold">Station Reports</p>
                                <p className="text-xs text-purple-100">Analytics & stats</p>
                            </div>
                        </a>

                        <a href="/police/dashboard" className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg">
                            <Users className="w-6 h-6" />
                            <div>
                                <p className="font-semibold">Officer Management</p>
                                <p className="text-xs text-green-100">Manage your team</p>
                            </div>
                        </a>
                    </div>
                </div>

                {/* Top Performer Highlight */}
                <div className="bg-white rounded-2xl shadow-2xl p-6">
                    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-500 p-4 rounded-r">
                        <div className="flex items-center gap-3">
                            <Award className="w-8 h-8 text-yellow-600" />
                            <div>
                                <p className="font-bold text-yellow-800 text-lg">Top Performer This Month</p>
                                <p className="text-yellow-700 mt-1">
                                    <strong>{stats.topOfficer}</strong> has issued the most fines this month with excellent performance!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
