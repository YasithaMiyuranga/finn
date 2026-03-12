import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';
import { AlertTriangle, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import pointsService from '../../services/pointsService';
import toast, { Toaster } from 'react-hot-toast';

export default function PointsDashboard() {
    const [pointsData, setPointsData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Mock driver ID - replace with actual logged-in driver ID
    const driverId = 1;

    useEffect(() => {
        fetchPoints();
    }, []);

    const fetchPoints = async () => {
        try {
            const response = await pointsService.getDriverPoints(driverId);
            setPointsData(response.data);
        } catch (error) {
            console.error('Points Error:', error);
            toast.error('Failed to load points data');
        } finally {
            setLoading(false);
        }
    };

    // Sample data for charts (replace with real data from points history)
    const historyData = [
        { month: 'Jan', points: 0 },
        { month: 'Feb', points: 2 },
        { month: 'Mar', points: 5 },
        { month: 'Apr', points: 8 },
        { month: 'May', points: pointsData?.totalPoints || 0 }
    ];

    const getStatusInfo = (points) => {
        if (points >= 16) {
            return {
                status: 'SUSPENDED',
                color: 'red',
                icon: XCircle,
                bgClass: 'bg-red-500',
                textClass: 'text-red-700',
                borderClass: 'border-red-500',
                message: 'Your license is suspended! Contact authorities immediately.'
            };
        } else if (points >= 11) {
            return {
                status: 'WARNING',
                color: 'yellow',
                icon: AlertTriangle,
                bgClass: 'bg-yellow-500',
                textClass: 'text-yellow-700',
                borderClass: 'border-yellow-500',
                message: 'Warning! You are approaching suspension threshold.'
            };
        } else {
            return {
                status: 'ACTIVE',
                color: 'green',
                icon: CheckCircle,
                bgClass: 'bg-green-500',
                textClass: 'text-green-700',
                borderClass: 'border-green-500',
                message: 'Your license is in good standing.'
            };
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

    const totalPoints = pointsData?.totalPoints || 0;
    const statusInfo = getStatusInfo(totalPoints);
    const StatusIcon = statusInfo.icon;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-4 md:p-8">
            <Toaster position="top-right" />

            {/* Header */}
            <div className="max-w-7xl mx-auto mb-6">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <h1 className="text-3xl font-bold text-white mb-2">Driver Violation Points</h1>
                    <p className="text-blue-100">Track your violation points and license status</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                {/* Current Points Card */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden lg:col-span-2">
                    <div className={`h-2 ${statusInfo.bgClass}`}></div>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Current Violation Points</p>
                                <div className="flex items-end gap-2 mt-1">
                                    <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        {totalPoints}
                                    </p>
                                    <p className="text-gray-500 text-lg mb-1">/ 16</p>
                                </div>
                            </div>
                            <div className={`p-4 rounded-xl ${statusInfo.bgClass}`}>
                                <StatusIcon className="w-12 h-12 text-white" />
                            </div>
                        </div>

                        {/* Status Alert */}
                        <div className={`border-l-4 ${statusInfo.borderClass} bg-${statusInfo.color}-50 p-4 rounded-r-lg`}>
                            <div className="flex items-start gap-3">
                                <StatusIcon className={`w-5 h-5 ${statusInfo.textClass} mt-0.5`} />
                                <div>
                                    <p className={`font-semibold ${statusInfo.textClass}`}>{statusInfo.status}</p>
                                    <p className="text-sm text-gray-600 mt-1">{statusInfo.message}</p>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-6">
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Points Progress</span>
                                <span>{((totalPoints / 16) * 100).toFixed(0)}%</span>
                            </div>
                            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${statusInfo.bgClass} transition-all duration-500 rounded-full`}
                                    style={{ width: `${Math.min((totalPoints / 16) * 100, 100)}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span>0</span>
                                <span className="text-yellow-600">11 (Warning)</span>
                                <span className="text-red-600">16 (Suspension)</span>
                            </div>
                        </div>

                        {/* Points Chart */}
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-purple-600" />
                                Points Trend
                            </h3>
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={historyData}>
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
                                    <Line
                                        type="monotone"
                                        dataKey="points"
                                        stroke="#8b5cf6"
                                        strokeWidth={3}
                                        dot={{ fill: '#8b5cf6', r: 5 }}
                                    />
                                    {/* Warning line */}
                                    <Line
                                        type="monotone"
                                        dataKey={() => 11}
                                        stroke="#f59e0b"
                                        strokeDasharray="5 5"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                    {/* Suspension line */}
                                    <Line
                                        type="monotone"
                                        dataKey={() => 16}
                                        stroke="#ef4444"
                                        strokeDasharray="5 5"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="space-y-6">
                    {/* Last Updated */}
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <p className="text-gray-600 text-sm font-medium mb-2">Last Updated</p>
                        <p className="text-2xl font-bold text-gray-800">
                            {pointsData?.lastUpdated || 'N/A'}
                        </p>
                    </div>

                    {/* License Status */}
                    <div className={`bg-gradient-to-br ${totalPoints >= 16 ? 'from-red-500 to-red-600' :
                            totalPoints >= 11 ? 'from-yellow-500 to-yellow-600' :
                                'from-green-500 to-green-600'
                        } rounded-2xl shadow-xl p-6 text-white`}>
                        <p className="text-white/90 text-sm font-medium mb-2">License Status</p>
                        <p className="text-3xl font-bold mb-2">{statusInfo.status}</p>
                        <p className="text-white/90 text-sm">
                            {totalPoints >= 16 ? 'License Suspended' :
                                totalPoints >= 11 ? `${16 - totalPoints} points until suspension` :
                                    `${11 - totalPoints} points until warning`}
                        </p>
                    </div>

                    {/* Thresholds Info */}
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">Point Thresholds</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">0-10 Points</p>
                                    <p className="text-xs text-gray-600">Active - Good standing</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">11-15 Points</p>
                                    <p className="text-xs text-gray-600">Warning - Drive carefully</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">16+ Points</p>
                                    <p className="text-xs text-gray-600">Suspended - Contact authorities</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
