import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Menu, ChevronDown, LogOut, LayoutDashboard,
    Hourglass, Coins, FileText, User
} from 'lucide-react';

export default function PaymentProcess() {
    const { refNo } = useParams();
    const navigate = useNavigate();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [fine, setFine] = useState(null);
    const [driver, setDriver] = useState(null);
    const [loading, setLoading] = useState(true);

    const sidebarWidth = sidebarOpen ? '250px' : '70px';

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
        { id: 'pending-fine', label: "Driver's Pending Fine", icon: <Hourglass size={18} /> },
        { id: 'paid-fine', label: "Driver's Paid Fine", icon: <Coins size={18} /> },
        { id: 'violation-details', label: 'Violation Details', icon: <FileText size={18} /> },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const userId = localStorage.getItem('userId');
                if (!userId || !token) return;

                // 1. Fetch fine details
                const fineRes = await fetch('http://localhost:8080/api/traffic_fine/getTrafficFine', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (fineRes.ok) {
                    const data = await fineRes.json();
                    const matchedFine = data.data.find(f => String(f.refNo) === String(refNo));
                    setFine(matchedFine);
                }

                // 2. Fetch driver profile for name
                const driverRes = await fetch(`http://localhost:8080/api/Driver/getDriverByUserId/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (driverRes.ok) {
                    const driverData = await driverRes.json();
                    setDriver(driverData.data);
                }
            } catch (err) {
                console.error("Error fetching payment data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [refNo]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/auth/login');
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-100">Loading fine details...</div>;
    }

    if (!fine) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 flex-col gap-4">
                <span className="text-xl font-semibold text-gray-700">Fine record not found.</span>
                <button onClick={() => navigate(-1)} className="bg-blue-600 text-white px-4 py-2 rounded">Go Back</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f4f6f9] flex flex-col" style={{ fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
            {/* Top Navigation */}
            <nav className="bg-[#0e2238] text-white h-16 flex items-center justify-between px-4 fixed top-0 w-full z-50 shadow-lg">
                <div className="flex items-center gap-4">
                    <Menu className="cursor-pointer hover:opacity-80" size={24} onClick={() => setSidebarOpen(!sidebarOpen)} />
                    <div className="flex items-center gap-2">
                        <div className="bg-white p-1.5 rounded-full flex items-center justify-center w-10 h-10">
                            <i className="fas fa-car text-blue-600 text-xl"></i>
                        </div>
                        <span className="text-white text-xl font-bold">eTRAFFIC</span>
                    </div>
                </div>

                <div className="relative">
                    <div onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="flex items-center gap-2 cursor-pointer hover:bg-white/10 px-3 py-2 rounded-lg transition-all">
                        <span className="text-xs font-bold uppercase tracking-widest">Settings</span>
                        <ChevronDown size={14} className={`transition-transform duration-200 ${isSettingsOpen ? 'rotate-180' : ''}`} />
                    </div>
                    {isSettingsOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-[60]">
                            <button onClick={() => navigate('/dashboard/driver/complete-profile')} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                <User size={18} className="text-gray-500" />
                                <span className="font-medium">Edit Profile</span>
                            </button>
                            <div className="my-1 border-t border-gray-100"></div>
                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                <LogOut size={18} />
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            <div className="flex flex-1 pt-14 bg-[#f8f9fa]">
                {/* Main Content */}
                <main className="flex-1 p-8 flex justify-center items-start pt-10 transition-all duration-300">
                    <div className="w-full max-w-2xl shadow-2xl rounded-lg overflow-hidden border border-gray-100" style={{ backgroundColor: '#f9f9f9' }}>

                        {/* Gray Header Section */}
                        <div className="py-6 border-b border-gray-200" style={{ backgroundColor: '#eeeeee' }}>
                            <h2 className="text-2xl font-bold text-center text-[#333] uppercase tracking-wide" style={{ fontFamily: 'sans-serif' }}>
                                Pay your fine ticket through online
                            </h2>
                        </div>

                        <div className="p-8">
                            {/* Reference Number */}
                            <div className="mb-6">
                                <span className="text-sm font-medium text-gray-500">Reference No : </span>
                                <span className="text-sm font-bold text-gray-800">{fine.refNo}</span>
                            </div>

                            {/* Ticket Table */}
                            <div className="border border-gray-200 rounded-sm overflow-hidden mb-8" style={{ backgroundColor: '#f0f0f0' }}>
                                <table className="w-full text-[15px] border-collapse" style={{ backgroundColor: '#f0f0f0' }}>
                                    <tbody style={{ backgroundColor: '#f0f0f0' }}>
                                        {[
                                            { label: 'License ID', value: fine.licenseId },
                                            { label: 'Driver Name', value: driver ? `${driver.firstName} ${driver.lastName}` : 'N/A' },
                                            { label: 'Class of Vehicle', value: fine.classOfVehicle },
                                            { label: 'Provision', value: fine.provisions },
                                            { label: 'Vehicle No', value: fine.vehicleNo },
                                            { label: 'Place', value: fine.place },
                                            { label: 'Issue Date', value: fine.issuedDate },
                                            { label: 'Issue Time', value: fine.issuedTime },
                                            { label: 'Expire Date', value: fine.expireDate },
                                            { label: 'Court Date', value: fine.courtDate },
                                            { label: 'Court', value: fine.court },
                                        ].map((row, idx) => (
                                            <tr key={idx} className="border-b border-gray-200 transition-colors" style={{ backgroundColor: '#f0f0f0' }}>
                                                <td className="py-3 px-8 text-[#555] w-[40%] font-medium" style={{ backgroundColor: '#f0f0f0' }}>{row.label}</td>
                                                <td className="py-3 px-8 text-[#333]" style={{ backgroundColor: '#f0f0f0' }}>{row.value || '-'}</td>
                                            </tr>
                                        ))}
                                        <tr className="bg-[#dcdcdc] font-bold">
                                            <td className="py-3.5 px-8 text-[#333]">Total Amount</td>
                                            <td className="py-3.5 px-8 text-[#333]">{(parseFloat(fine.totalAmount) || 0).toFixed(2)} LKR</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Actions - Positioned bottom right */}
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="px-6 py-2 text-white rounded-[4px] font-medium transition-all shadow-sm"
                                    style={{ backgroundColor: '#95a5a6' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-6 py-2 text-white rounded-[4px] font-medium transition-all shadow-sm"
                                    style={{ backgroundColor: '#007bff' }}
                                >
                                    Confirm Pay
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
