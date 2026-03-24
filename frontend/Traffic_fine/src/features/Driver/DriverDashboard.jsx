import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Menu, Settings, Megaphone, Hourglass, ListOrdered, 
    Coins, LayoutDashboard, FileText, CreditCard, 
    Bell, User, ChevronDown, LogOut
} from 'lucide-react';
import { 
    PieChart, Pie, Cell, AreaChart, Area, 
    XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer 
} from 'recharts';

export default function DriverDashboard() {
    const navigate = useNavigate();
    const [driverData, setDriverData] = useState(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    // Adjusted sidebar width to match the PHP version perfectly
    const sidebarWidth = sidebarOpen ? '250px' : '70px';

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
        { id: 'pending-fine', label: "Driver's Pending Fine", icon: <Hourglass size={18} /> },
        { id: 'paid-fine', label: "Driver's Paid Fine", icon: <Coins size={18} /> },
        { id: 'violation-details', label: 'Violation Details', icon: <FileText size={18} /> },
    ];

    const handleNav = (id) => {
        if (id === 'dashboard') navigate('/dashboard/driver');
        if (id === 'pending-fine') navigate('/dashboard/driver/pending-fine');
        if (id === 'paid-fine') navigate('/dashboard/driver/paid-fine');
        if (id === 'violation-details') navigate('/dashboard/driver/violation-details');
        // Add more routing later based on user requests
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userType');
        navigate('/auth/login');
    };

    useEffect(() => {
        const fetchDriverData = async () => {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            if (!userId) return;

            try {
                const response = await fetch(`http://localhost:8080/api/Driver/getDriverByUserId/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const result = await response.json();
                if (result.success) {
                    setDriverData(result.data);
                }
            } catch (error) {
                console.error("Error fetching driver data:", error);
            }
        };
        fetchDriverData();
    }, []);

    const stats = {
        pendingFineCount: 1,
        pendingFineAmount: 3000,
        paidFineCount: 0,
        paidFineAmount: 0,
    };
// ... trend data same ...
    const fineTrendData = [
        { month: 'January', fines: 0 },
        { month: 'February', fines: 0 },
        { month: 'March', fines: 1.0 },
        { month: 'April', fines: 0 },
        { month: 'May', fines: 0 },
        { month: 'June', fines: 0 },
        { month: 'August', fines: 0 },
        { month: 'September', fines: 0 },
        { month: 'October', fines: 0 },
        { month: 'November', fines: 0 },
        { month: 'December', fines: 0 },
    ];
// ... skip to return skip ...
    const amountPieData = [
        { name: 'Paid Fine Amount (LKR)', value: 0, color: '#4d2c80' },
        { name: 'Pending Fine Amount (LKR)', value: 3000, color: '#e67e22' },
    ];

    const countPieData = [
        { name: 'Pending Fine Count', value: 1, color: '#f05050' },
        { name: 'Paid Fine Count', value: 0, color: '#1abc9c' },
    ];

    const StatCard = ({ title, value, unit, icon: Icon, bgColor }) => (
        <div className={`${bgColor} text-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center text-center relative overflow-hidden transition-transform hover:scale-105`}>
            <div className="mb-4">
                <Icon size={48} strokeWidth={1.5} />
            </div>
            <div className="text-4xl font-bold mb-1">{value}</div>
            <div className="text-sm font-medium opacity-90">{title}</div>
            {unit && <div className="text-xs opacity-75">({unit})</div>}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f4f6f9] flex flex-col">
            {/* Top Navigation */}
            <nav className="bg-[#0e2238] text-white h-16 flex items-center justify-between px-4 fixed top-0 w-full z-50 shadow-lg">
                <div className="flex items-center gap-4">
                    <Menu className="cursor-pointer hover:opacity-80" size={24} onClick={() => setSidebarOpen(!sidebarOpen)} />
                    <div className="flex items-center gap-2">
                        <div className="bg-red-600 p-1.5 rounded-lg">
                            <Bell size={20} className="text-white" fill="white" />
                        </div>
                        <span className="text-xl font-bold tracking-wider">STFMS</span>
                    </div>
                </div>
                
                <div className="relative">
                    <div 
                        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                        className="flex items-center gap-2 cursor-pointer hover:bg-white/10 px-3 py-2 rounded-lg transition-all"
                    >
                        <span className="text-xs font-bold uppercase tracking-widest">Settings</span>
                        <ChevronDown size={14} className={`transition-transform duration-200 ${isSettingsOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {/* Settings Dropdown */}
                    {isSettingsOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 animate-fadeIn z-[60]">
                            <button 
                                onClick={() => navigate('/dashboard/driver/complete-profile')}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <User size={18} className="text-gray-500" />
                                <span className="font-medium">Edit Profile</span>
                            </button>
                            <div className="my-1 border-t border-gray-100"></div>
                            <button 
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut size={18} />
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            <div className="flex flex-1 pt-16">
                {/* Sidebar */}
                <aside 
                    className="flex flex-col items-center py-2 fixed h-full left-0 z-40 transition-all duration-300"
                    style={{ width: sidebarWidth, backgroundColor: '#0f2439', borderTop: '1px solid #1c344d', overflowX: 'hidden' }}
                >
                    <div className="flex flex-col w-full mt-2">
                        {navItems.map(item => (
                            <button 
                                key={item.id} 
                                onClick={() => handleNav(item.id)} 
                                title={item.label}
                                className="w-full flex items-center transition-colors cursor-pointer"
                                style={{
                                    padding: '16px 20px',
                                    paddingLeft: sidebarOpen ? '20px' : '26px',
                                    justifyContent: 'flex-start',
                                    gap: '15px', 
                                    whiteSpace: 'nowrap', 
                                    border: 'none',
                                    backgroundColor: item.id === 'dashboard' ? '#17a2b8' : 'transparent',
                                    color: item.id === 'dashboard' ? '#ffffff' : '#b2c3d4',
                                }}
                            >
                                <span className="flex-shrink-0" style={{ color: item.id === 'dashboard' ? '#ffffff' : '#b2c3d4' }}>{item.icon}</span>
                                {sidebarOpen && <span style={{ fontSize: '15px', fontWeight: '500' }}>{item.label}</span>}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6 transition-all duration-300" style={{ marginLeft: sidebarWidth }}>
                    {/* Account Holder Info */}
                    <div className="bg-white rounded-lg shadow-sm p-5 mb-6 border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                <User size={24} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-800 tracking-tight">
                                    Account Holder : <span className="text-blue-600">{driverData ? `${driverData.firstName} ${driverData.lastName}` : "Loading..."}</span>
                                </h2>
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                                    License No : <span className="text-gray-700">{driverData ? driverData.licenseNumber : "..."}</span>
                                </p>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <div className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100 flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                Profile Verified
                            </div>
                        </div>
                    </div>

                    {/* Stat Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard 
                            title="Pending Fine Count" 
                            value={stats.pendingFineCount} 
                            icon={Megaphone} 
                            bgColor="bg-[#f05050]" 
                        />
                        <StatCard 
                            title="Pending Fine Amount" 
                            unit="LKR"
                            value={stats.pendingFineAmount.toFixed(2)} 
                            icon={Hourglass} 
                            bgColor="bg-[#e67e22]" 
                        />
                        <StatCard 
                            title="Paid Fine Count" 
                            value={stats.paidFineCount} 
                            icon={ListOrdered} 
                            bgColor="bg-[#1abc9c]" 
                        />
                        <StatCard 
                            title="Paid Fine Amount" 
                            unit="LKR"
                            value={stats.paidFineAmount} 
                            icon={Coins} 
                            bgColor="bg-[#4d2c80]" 
                        />
                    </div>

                    {/* Main Chart Container */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-100">
                        <h3 className="text-xl text-gray-700 text-center mb-6">Fine Tickets Count 2026</h3>
                        <div className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={fineTrendData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '4px' }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="fines" 
                                        stroke="#5cb85c" 
                                        strokeWidth={3}
                                        fill="#5cb85c" 
                                        fillOpacity={0.7} 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Bottom Pie Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 flex flex-col items-center">
                            <h3 className="text-lg text-gray-700 mb-6 font-medium">Pending Fine and Paid Fine Amount</h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={amountPieData}
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={0}
                                            dataKey="value"
                                        >
                                            {amountPieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex gap-4 mt-4 text-xs">
                                {amountPieData.map((item, i) => (
                                    <div key={i} className="flex items-center gap-1.5">
                                        <div className="w-3 h-3" style={{backgroundColor: item.color}}></div>
                                        <span className="text-gray-600">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 flex flex-col items-center">
                            <h3 className="text-lg text-gray-700 mb-6 font-medium">Pending Fine Count & Paid Fine Count</h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={countPieData}
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={0}
                                            dataKey="value"
                                        >
                                            {countPieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex gap-4 mt-4 text-xs">
                                {countPieData.map((item, i) => (
                                    <div key={i} className="flex items-center gap-1.5">
                                        <div className="w-3 h-3" style={{backgroundColor: item.color}}></div>
                                        <span className="text-gray-600">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
