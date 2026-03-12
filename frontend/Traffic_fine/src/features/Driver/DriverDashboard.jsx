import { useState, useEffect } from 'react';
import { 
    Car, FileText, CreditCard, TrendingUp, AlertCircle, 
    DollarSign, Award, CheckCircle, ShieldAlert, 
    MessageSquare, Clock, ArrowRight 
} from 'lucide-react';
import { 
    PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, 
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
    ResponsiveContainer, AreaChart, Area 
} from 'recharts';

import Header from '../../context/Header';
import TopNav from '../../context/TopNav';
import LeftSidebar from '../../context/LeftSidebar';
import Footer from '../../context/Footer';

export default function DriverDashboard() {
    // Mock data based on the business logic seen in the old PHP project and new requirements
    const [stats, setStats] = useState({
        pendingFineCount: 1,
        pendingFineAmount: 3000,
        paidFineCount: 4,
        paidFineAmount: 5500,
        totalPoints: 12,
        licenseStatus: 'Active', // Active, Warning, Suspended
        licenseStatusColor: 'text-emerald-400'
    });

    const driver = {
        name: 'Nimal Perera',
        licenseNumber: 'B842000000',
        nic: '199512345678',
        licenseExpiry: '2026-12-31'
    };

    const recentFines = [
        { id: 'TF-2025-001', type: 'High Speed', amount: 2500, status: 'PENDING', date: '2025-03-01' },
        { id: 'TF-2025-002', type: 'No Helmet', amount: 1000, status: 'PAID', date: '2025-02-15' },
        { id: 'TF-2025-003', type: 'Traffic Light', amount: 3000, status: 'PAID', date: '2025-01-20' },
        { id: 'TF-2025-004', type: 'Illegal Parking', amount: 1500, status: 'PAID', date: '2025-01-05' }
    ];

    const fineTrends = [
        { month: 'Jan', fines: 1 },
        { month: 'Feb', fines: 0 },
        { month: 'Mar', fines: 1 },
        { month: 'Apr', fines: 0 },
        { month: 'May', fines: 0 },
        { month: 'Jun', fines: 0 }
    ];

    const pointsTrend = [
        { month: 'Jan', points: 4 },
        { month: 'Feb', points: 6 },
        { month: 'Mar', points: 12 },
        { month: 'Apr', points: 12 },
        { month: 'May', points: 12 },
        { month: 'Jun', points: 12 }
    ];

    const StatCard = ({ title, value, icon: Icon, color, subtitle, delay }) => (
        <div className={`relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 transition-all duration-300 hover:transform hover:scale-[1.03] hover:shadow-2xl group animate-[fadeIn_0.5s_ease-out]`}>
            <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${color} opacity-20 rounded-full blur-2xl group-hover:opacity-40 transition-opacity`}></div>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-blue-100 text-sm font-medium mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
                    {subtitle && <p className="text-blue-200/60 text-xs mt-1">{subtitle}</p>}
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${color} text-white shadow-lg`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex">
            {/* Components from context */}
            <LeftSidebar />
            
            <div className="flex-1 flex flex-col ml-64 min-w-0">
                <TopNav />
                
                <main className="flex-1 p-6 space-y-8 overflow-y-auto">
                    {/* Welcome Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
                                    Driver ID : {driver.licenseNumber}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                    Status: {stats.licenseStatus}
                                </span>
                            </div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                                Welcome back, {driver.name}
                            </h1>
                        </div>
                        
                        {/* AI Law Assistant Button */}
                        <a 
                            href="/dashboard/ai-chat"
                            className="flex items-center gap-3 bg-gradient-to-r from-orange-500 to-yellow-500 px-6 py-3 rounded-2xl font-bold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transform hover:-translate-y-1 transition-all"
                        >
                            <MessageSquare className="w-5 h-5" />
                            <span>Ask AI Legal Assistant</span>
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </a>
                    </div>

                    {/* Main Stats Grid - Similar to Old Project but with Points & Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard 
                            title="Pending Fine Count" 
                            value={stats.pendingFineCount} 
                            icon={AlertCircle} 
                            color="from-red-500 to-rose-600"
                            subtitle="Fines awaiting payment"
                        />
                        <StatCard 
                            title="Pending Amount" 
                            value={`Rs. ${stats.pendingFineAmount.toLocaleString()}`} 
                            icon={DollarSign} 
                            color="from-orange-500 to-amber-600"
                            subtitle="Total due amount"
                        />
                        <StatCard 
                            title="Paid Fine Count" 
                            value={stats.paidFineCount} 
                            icon={CheckCircle} 
                            color="from-emerald-500 to-teal-600"
                            subtitle="Fines settled successfully"
                        />
                        <StatCard 
                            title="Violation Points" 
                            value={stats.totalPoints} 
                            icon={Award} 
                            color="from-purple-500 to-indigo-600"
                            subtitle="License risk: Medium"
                        />
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Fine Tickets Distribution - Modern replacement for the old line chart */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <TrendingUp className="text-blue-400" /> Fine Tickets Count 2026
                                </h3>
                                <select className="bg-white/10 border-none rounded-lg text-sm px-3 py-1 outline-none focus:ring-1 focus:ring-blue-500">
                                    <option>Monthly</option>
                                    <option>Weekly</option>
                                </select>
                            </div>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={fineTrends}>
                                        <defs>
                                            <linearGradient id="colorFines" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Area type="monotone" dataKey="fines" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorFines)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Violation Points Trend - New feature visualization */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <ShieldAlert className="text-purple-400" /> Violation Points Trend
                                </h3>
                            </div>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={pointsTrend}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                        <Tooltip 
                                            cursor={{fill: '#ffffff05'}}
                                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
                                        />
                                        <Bar dataKey="points" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={30} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Content: Recent Fines Table */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm">
                        <div className="p-6 border-b border-white/10 flex items-center justify-between">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <FileText className="text-amber-400" /> Recent Fines History
                            </h3>
                            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                                View All Fine Details
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 text-blue-200/60 text-xs uppercase font-bold">
                                    <tr>
                                        <th className="px-6 py-4">Reference No</th>
                                        <th className="px-6 py-4">Violation Type</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Amount</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {recentFines.map((fine, idx) => (
                                        <tr key={idx} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4 font-mono text-blue-300">{fine.id}</td>
                                            <td className="px-6 py-4 font-semibold">{fine.type}</td>
                                            <td className="px-6 py-4 text-blue-100/60">{fine.date}</td>
                                            <td className="px-6 py-4 font-bold">Rs. {fine.amount.toLocaleString()}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                    fine.status === 'PAID' 
                                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                                                }`}>
                                                    {fine.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {fine.status === 'PENDING' ? (
                                                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all transform group-hover:scale-105 shadow-lg shadow-blue-600/20">
                                                        Pay Now
                                                    </button>
                                                ) : (
                                                    <button className="border border-white/20 hover:bg-white/10 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all">
                                                        Details
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* AI Chatbot Floating Prompt (Sneak peek for the user) */}
                    <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                            <ShieldAlert className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold">Confused about a traffic rule?</h2>
                        <p className="text-blue-200 max-w-2xl mx-auto">
                            Our AI Legal Assistant is trained on Sri Lankan traffic laws. 
                            Ask about specific fine amounts, violation points, or your rights as a driver.
                        </p>
                        <div className="flex items-center gap-4 w-full max-w-md">
                            <input 
                                type="text" 
                                placeholder="e.g., What is the fine for speeding in Colombo?"
                                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                            <button className="bg-white text-[#0f172a] p-3 rounded-xl font-bold hover:bg-blue-50 transition-colors">
                                <ArrowRight className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </main>
                
                <Footer />
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
