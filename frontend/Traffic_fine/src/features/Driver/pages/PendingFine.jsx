import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Menu, Settings, Megaphone, Hourglass, ListOrdered, 
    Coins, LayoutDashboard, FileText, CreditCard, 
    Bell, User, ChevronDown, LogOut, Info
} from 'lucide-react';

export default function PendingFine() {
    const navigate = useNavigate();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    // Adjusted sidebar width to match the PHP version perfectly
    const sidebarWidth = sidebarOpen ? '250px' : '70px';

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
        { id: 'pending-fine', label: "Driver's Pending Fine", icon: <Hourglass size={18} /> },
        { id: 'paid-fine', label: "Driver's Paid Fine", icon: <Coins size={18} /> },
        { id: 'provision-details', label: 'Provision Details', icon: <FileText size={18} /> },
    ];

    const handleNav = (id) => {
        if (id === 'dashboard') navigate('/dashboard/driver');
        if (id === 'pending-fine') navigate('/dashboard/driver/pending-fine');
        if (id === 'paid-fine') navigate('/dashboard/driver/paid-fine');
        // Add more routes as they are created
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userType');
        navigate('/auth/login');
    };

    // Dummy data mimicking the PHP table screenshot
    const pendingFines = [
        {
            refNo: "10025",
            provision: "108",
            vehicleNo: "t5555",
            issueDate: "2026-03-12",
            expireDate: "2026-04-02",
            courtDate: "2026-04-02",
            amount: "3000.00"
        }
    ];

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
                                    backgroundColor: item.id === 'pending-fine' ? '#17a2b8' : 'transparent',
                                    color: item.id === 'pending-fine' ? '#ffffff' : '#b2c3d4',
                                }}
                            >
                                <span className="flex-shrink-0" style={{ color: item.id === 'pending-fine' ? '#ffffff' : '#b2c3d4' }}>{item.icon}</span>
                                {sidebarOpen && <span style={{ fontSize: '15px', fontWeight: '500' }}>{item.label}</span>}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6 transition-all duration-300" style={{ marginLeft: sidebarWidth }}>
                    <div className="container-fluid mx-auto max-w-7xl">
                        <h1 className="text-3xl font-normal text-gray-800 mb-2 mt-4">Driver's Pending Fine</h1>
                        
                        <div className="flex items-center text-sm text-gray-500 mb-6">
                            <span 
                                className="cursor-pointer text-blue-500 hover:underline"
                                onClick={() => navigate('/dashboard/driver')}
                            >
                                Dashboard
                            </span>
                            <span className="mx-2">/</span>
                            <span>Driver's Pending Fine</span>
                        </div>

                        <div className="bg-white rounded shadow-sm border border-gray-200 border-t-0 border-l-0 border-r-0 mb-4">
                            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 text-gray-700 flex items-center gap-2">
                                <ListOrdered size={18} />
                                <span>You can sort data here</span>
                            </div>
                            
                            <div className="p-4">
                                <div className="flex justify-end mb-4">
                                    <div className="flex items-center gap-2">
                                        <label className="text-sm text-gray-600">Search:</label>
                                        <input 
                                            type="text" 
                                            className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:border-blue-400"
                                        />
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-200 text-gray-700 text-sm font-bold text-left border-b border-gray-300">
                                                <th className="py-2.5 px-3 border-r border-white w-48">Action</th>
                                                <th className="py-2.5 px-3 border-r border-white">Reference No</th>
                                                <th className="py-2.5 px-3 border-r border-white">Provision</th>
                                                <th className="py-2.5 px-3 border-r border-white">Vehicle No</th>
                                                <th className="py-2.5 px-3 border-r border-white">Issue Date</th>
                                                <th className="py-2.5 px-3 border-r border-white">Expire Date</th>
                                                <th className="py-2.5 px-3 border-r border-white">Court Date</th>
                                                <th className="py-2.5 px-3">Amount LKR</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pendingFines.map((fine, index) => (
                                                <tr key={index} className="border-b border-gray-200 text-sm text-gray-700 hover:bg-gray-50">
                                                    <td className="py-3 px-3">
                                                        <div className="flex items-center gap-1.5">
                                                            <button className="bg-[#17a2b8] hover:bg-[#138496] text-white p-1.5 rounded transition-colors" title="View">
                                                                <Info size={16} />
                                                            </button>
                                                            <button className="bg-[#ffc107] hover:bg-[#e0a800] text-gray-900 px-2.5 py-1.5 rounded text-xs font-bold transition-colors shadow-sm flex items-center gap-1">
                                                                Pay Now <Coins size={14} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-3">{fine.refNo}</td>
                                                    <td className="py-3 px-3">{fine.provision}</td>
                                                    <td className="py-3 px-3">{fine.vehicleNo}</td>
                                                    <td className="py-3 px-3">{fine.issueDate}</td>
                                                    <td className="py-3 px-3">{fine.expireDate}</td>
                                                    <td className="py-3 px-3">{fine.courtDate}</td>
                                                    <td className="py-3 px-3">{fine.amount}</td>
                                                </tr>
                                            ))}
                                            {pendingFines.length === 0 && (
                                                <tr>
                                                    <td colSpan="8" className="py-4 text-center text-gray-500 text-sm">No data available in table</td>
                                                </tr>
                                            )}
                                        </tbody>
                                        <tfoot className="bg-gray-300 text-gray-700 text-sm font-bold text-left border-t border-gray-300">
                                            <tr>
                                                <th className="py-2.5 px-3 border-r border-white">Action</th>
                                                <th className="py-2.5 px-3 border-r border-white">Reference No</th>
                                                <th className="py-2.5 px-3 border-r border-white">Provision</th>
                                                <th className="py-2.5 px-3 border-r border-white">Vehicle No</th>
                                                <th className="py-2.5 px-3 border-r border-white">Issue Date</th>
                                                <th className="py-2.5 px-3 border-r border-white">Expire Date</th>
                                                <th className="py-2.5 px-3 border-r border-white">Court Date</th>
                                                <th className="py-2.5 px-3">Amount LKR</th>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                                
                                <div className="flex justify-between items-center mt-4">
                                    <div className="text-sm text-gray-600">
                                        Showing 1 to {pendingFines.length} of {pendingFines.length} entries
                                    </div>
                                    <div className="flex border border-gray-300 rounded text-sm overflow-hidden shadow-sm">
                                        <button className="px-3 py-1.5 text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
                                        <button className="px-3 py-1.5 bg-[#007bff] text-white border-l border-r border-blue-600">1</button>
                                        <button className="px-3 py-1.5 text-blue-500 bg-white hover:bg-gray-50 border-l border-gray-300 disabled:opacity-50" disabled>Next</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
