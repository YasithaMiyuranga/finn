import { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, DollarSign, Users, MapPin, Download } from 'lucide-react';
import reportsService from '../../services/reportsService';
import toast, { Toaster } from 'react-hot-toast';

const COLORS = ['#4F46E5', '#9333EA', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EF4444', '#14B8A6'];

export default function ReportsDashboard() {
    const [provinceData, setProvinceData] = useState([]);
    const [collectionData, setCollectionData] = useState([]);
    const [registrationData, setRegistrationData] = useState([]);
    const [stats, setStats] = useState({
        totalFines: 5234,
        totalCollection: 12500000,
        totalDrivers: 8456,
        activeViolations: 342
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReportsData();
    }, []);

    const fetchReportsData = async () => {
        try {
            // Mock data - Replace with actual API calls
            setProvinceData([
                { name: 'Western', fines: 1234, value: 1234 },
                { name: 'Southern', fines: 876, value: 876 },
                { name: 'Central', fines: 654, value: 654 },
                { name: 'Northern', fines: 432, value: 432 },
                { name: 'Eastern', fines: 543, value: 543 },
                { name: 'Sabaragamuwa', fines: 321, value: 321 },
                { name: 'North Western', fines: 456, value: 456 },
                { name: 'Uva', fines: 234, value: 234 },
                { name: 'North Central', fines: 484, value: 484 }
            ]);

            setCollectionData([
                { month: 'Jan', amount: 1200000 },
                { month: 'Feb', amount: 1450000 },
                { month: 'Mar', amount: 1300000 },
                { month: 'Apr', amount: 1600000 },
                { month: 'May', amount: 1800000 },
                { month: 'Jun', amount: 2100000 }
            ]);

            setRegistrationData([
                { month: 'Jan', drivers: 120 },
                { month: 'Feb', drivers: 145 },
                { month: 'Mar', drivers: 180 },
                { month: 'Apr', drivers: 156 },
                { month: 'May', drivers: 198 },
                { month: 'Jun', drivers: 210 }
            ]);

            setLoading(false);
        } catch (error) {
            console.error('Reports Error:', error);
            toast.error('Failed to load reports data');
            setLoading(false);
        }
    };

    const exportReport = async (type) => {
        try {
            toast.success(`Exporting ${type} report...`);
            // await reportsService.exportReport(type);
        } catch (error) {
            toast.error('Failed to export report');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-4 md:p-8">
            <Toaster position="top-right" />

            {/* Header */}
            <div className="max-w-7xl mx-auto mb-6">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Analytics & Reports</h1>
                        <p className="text-blue-100">Comprehensive system statistics and insights</p>
                    </div>
                    <button
                        onClick={() => exportReport('pdf')}
                        className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-lg text-white rounded-xl transition-all flex items-center gap-2 font-medium border border-white/30"
                    >
                        <Download className="w-5 h-5" />
                        Export PDF
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto space-y-6">

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-white/20 p-3 rounded-xl">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <span className="text-xs bg-white/20 px-3 py-1 rounded-full">Total</span>
                        </div>
                        <p className="text-3xl font-bold">{stats.totalFines.toLocaleString()}</p>
                        <p className="text-blue-100 text-sm mt-1">Total Fines Issued</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-white/20 p-3 rounded-xl">
                                <DollarSign className="w-6 h-6" />
                            </div>
                            <span className="text-xs bg-white/20 px-3 py-1 rounded-full">Revenue</span>
                        </div>
                        <p className="text-3xl font-bold">Rs. {(stats.totalCollection / 1000000).toFixed(1)}M</p>
                        <p className="text-green-100 text-sm mt-1">Total Collection</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-white/20 p-3 rounded-xl">
                                <Users className="w-6 h-6" />
                            </div>
                            <span className="text-xs bg-white/20 px-3 py-1 rounded-full">Users</span>
                        </div>
                        <p className="text-3xl font-bold">{stats.totalDrivers.toLocaleString()}</p>
                        <p className="text-purple-100 text-sm mt-1">Registered Drivers</p>
                    </div>

                    <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-xl p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-white/20 p-3 rounded-xl">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <span className="text-xs bg-white/20 px-3 py-1 rounded-full">Active</span>
                        </div>
                        <p className="text-3xl font-bold">{stats.activeViolations}</p>
                        <p className="text-orange-100 text-sm mt-1">Active Violations</p>
                    </div>
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Province Distribution */}
                    <div className="bg-white rounded-2xl shadow-2xl p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Province-wise Distribution</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={provinceData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={(entry) => entry.name}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {provinceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Monthly Collections */}
                    <div className="bg-white rounded-2xl shadow-2xl p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Monthly Collections</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={collectionData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="month" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px'
                                    }}
                                    formatter={(value) => `Rs. ${(value / 1000).toFixed(0)}K`}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#10B981"
                                    strokeWidth={3}
                                    name="Collection (LKR)"
                                    dot={{ fill: '#10B981', r: 5 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 gap-6">
                    {/* Driver Registrations */}
                    <div className="bg-white rounded-2xl shadow-2xl p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Driver Registration Trends</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={registrationData}>
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
                                <Bar dataKey="drivers" fill="#8B5CF6" name="New Drivers" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
