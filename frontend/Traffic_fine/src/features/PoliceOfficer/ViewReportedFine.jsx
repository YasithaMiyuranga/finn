import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Menu, ChevronDown, LogOut,
    PlusCircle, History, FileText, Flag, Gauge, Bell, Search
} from 'lucide-react';

export default function ViewReportedFine() {
    const navigate = useNavigate();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [fines, setFines] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFines = async () => {
            try {
                const token = localStorage.getItem('token');
                const userId = localStorage.getItem('userId');

                // 1. Fetch Officer profile to know their DB ID
                let officerDbId = null;
                const offRes = await fetch('http://localhost:8080/api/police_officers/getPoliceOfficers', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (offRes.ok) {
                    const offData = await offRes.json();
                    const officers = offData.data || [];
                    const me = officers.find(o => 
                        String(o.userId) === String(userId) || 
                        String(o.user) === String(userId) || 
                        (o.user && String(o.user.id || o.user.userId || o.user) === String(userId)) ||
                        String(o.id) === String(userId)
                    );
                    if (me) officerDbId = me.id;
                }

                // 2. Fetch traffic fines
                const res = await fetch('http://localhost:8080/api/traffic_fine/getTrafficFine', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    let allFines = [];
                    if (Array.isArray(data.data)) {
                        allFines = data.data;
                    } else if (Array.isArray(data)) {
                        allFines = data;
                    }

                    // Show ALL fines to verify database saving
                    console.log("All fines from DB:", allFines);

                    // Map fields
                    const mappedFines = allFines.map(f => {
                        return {
                            referenceNo: f.id || "N/A",
                            drivingLicenseNo: f.licenseId || "N/A",
                            provision: f.provisions || f.violationType?.violationName || "N/A",
                            vehicleNo: f.vehicalNo || f.vehicleNo || "N/A",
                            totalAmount: f.totalAmount ? parseFloat(f.totalAmount).toFixed(2) : "0.00",
                            issueDate: f.issuedDate || "N/A"
                        };
                    });

                    setFines(mappedFines);
                } else {
                    console.error("Failed to fetch fines");
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFines();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/auth/login');
    };

    const handleNav = (id) => {
        if (id === 'dashboard') navigate('/dashboard/policeofficer');
        if (id === 'add-new-fine') navigate('/dashboard/policeofficer/add-new-fine');
        if (id === 'view-reported-fine') navigate('/dashboard/policeofficer/view-reported-fine');
    };

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <Gauge size={22} /> },
        { id: 'add-new-fine', label: 'Add New Fine', icon: <PlusCircle size={22} /> },
        { id: 'drivers-past-fine', label: "Driver's Past Fine", icon: <History size={22} /> },
        { id: 'revenue-license', label: 'Revenue License', icon: <FileText size={22} /> },
        { id: 'view-reported-fine', label: 'View Reported Fine', icon: <Flag size={22} /> },
    ];

    const sidebarWidth = sidebarOpen ? '250px' : '65px';

    const filteredFines = fines.filter(f => 
        String(f.referenceNo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(f.drivingLicenseNo || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen flex bg-gray-100" style={{ fontFamily: "'Segoe UI', Roboto, sans-serif" }}>

            {/* Sidebar */}
            <div 
                style={{ 
                    width: sidebarWidth, 
                    backgroundColor: '#0f2038', 
                    color: 'white', 
                    transition: 'width 0.3s', 
                    display: 'flex', 
                    flexDirection: 'column',
                    position: 'fixed',
                    height: '100vh',
                    zIndex: 1000
                }}
            >
                <div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center', borderBottom: '1px solid #1e3352' }}>
                    <Menu style={{ cursor: 'pointer' }} onClick={() => setSidebarOpen(!sidebarOpen)} />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px 0', flex: 1 }}>
                    {navItems.map(item => (
                        <div 
                            key={item.id}
                            onClick={() => handleNav(item.id)}
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                padding: '12px 20px', 
                                cursor: 'pointer',
                                backgroundColor: item.id === 'view-reported-fine' ? '#17a2b8' : 'transparent',
                                borderLeft: item.id === 'view-reported-fine' ? '4px solid #fff' : '4px solid transparent',
                                transition: 'background-color 0.2s',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap'
                            }}
                            onMouseEnter={(e) => {
                                if (item.id !== 'view-reported-fine') e.currentTarget.style.backgroundColor = '#1e3352';
                            }}
                            onMouseLeave={(e) => {
                                if (item.id !== 'view-reported-fine') e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                        >
                            <span style={{ minWidth: '30px' }}>{item.icon}</span>
                            {sidebarOpen && <span style={{ marginLeft: '10px', fontSize: '15px' }}>{item.label}</span>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, marginLeft: sidebarWidth, display: 'flex', flexDirection: 'column', transition: 'margin-left 0.3s' }}>
                
                {/* Navbar */}
                <div style={{ 
                    height: '60px', 
                    backgroundColor: '#162e4d', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '0 24px',
                    color: 'white'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ backgroundColor: '#dc3545', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Bell size={16} color="white" />
                        </div>
                        <span style={{ fontWeight: 'bold', fontSize: '20px', letterSpacing: '1px' }}>STFMS</span>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <div 
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
                            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                        >
                            SETTINGS
                            <ChevronDown size={16} />
                        </div>
                        {isSettingsOpen && (
                            <div style={{
                                position: 'absolute',
                                top: '40px',
                                right: '0',
                                backgroundColor: '#fff',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                borderRadius: '4px',
                                overflow: 'hidden',
                                zIndex: 1000,
                                minWidth: '150px'
                            }}>
                                <div 
                                    onClick={handleLogout}
                                    style={{ padding: '12px 16px', color: '#dc3545', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', transition: 'background 0.2s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                                >
                                    <LogOut size={16} />
                                    Logout
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Page Content */}
                <div style={{ padding: '30px 40px', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <h1 style={{ fontSize: '28px', color: '#212529', marginBottom: '8px', fontWeight: '400' }}>View Reported Fine</h1>
                        <div style={{ fontSize: '14px', color: '#6c757d' }}>
                            <span style={{ color: '#007bff' }}>Dashboard</span> / View Reported Fine
                        </div>
                    </div>

                    <div style={{ 
                        backgroundColor: '#fff', 
                        borderRadius: '4px', 
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        border: '1px solid #rgba(0,0,0,.125)'
                    }}>
                        <div style={{ 
                            padding: '12px 20px', 
                            backgroundColor: '#f8f9fa', 
                            borderBottom: '1px solid #dee2e6',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#495057',
                            fontSize: '15px'
                        }}>
                            <Menu size={16} />
                            You can sort data here
                        </div>

                        <div style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <label style={{ fontSize: '14px', color: '#495057' }}>Search:</label>
                                    <input 
                                        type="text" 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{
                                            padding: '6px 12px',
                                            border: '1px solid #ced4da',
                                            borderRadius: '4px',
                                            outline: 'none',
                                            fontSize: '14px'
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                                    <thead>
                                        <tr>
                                            {['Reference No', 'Driving License No', 'Provision', 'Vehicle No', 'Total Amount', 'Issue Date'].map((header, i) => (
                                                <th key={header} style={{ 
                                                    padding: '12px', 
                                                    borderBottom: '2px solid #dee2e6',
                                                    color: '#212529',
                                                    fontWeight: '700',
                                                    fontSize: '14px',
                                                    backgroundColor: i % 2 === 0 ? '#e9ecef' : '#fff'
                                                }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        {header}
                                                        <div style={{ display: 'flex', flexDirection: 'column', opacity: 0.3 }}>
                                                            <span style={{ fontSize: '8px', lineHeight: '8px' }}>▲</span>
                                                            <span style={{ fontSize: '8px', lineHeight: '8px' }}>▼</span>
                                                        </div>
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center' }}>Loading fines...</td></tr>
                                        ) : filteredFines.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>
                                                    No fines found.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredFines.map((fine, index) => (
                                                <tr key={index} style={{ borderBottom: '1px solid #dee2e6', backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa' }}>
                                                    <td style={{ padding: '12px', color: '#212529', fontSize: '14px' }}>{fine.referenceNo}</td>
                                                    <td style={{ padding: '12px', color: '#212529', fontSize: '14px' }}>{fine.drivingLicenseNo}</td>
                                                    <td style={{ padding: '12px', color: '#212529', fontSize: '14px' }}>{fine.provision}</td>
                                                    <td style={{ padding: '12px', color: '#212529', fontSize: '14px' }}>{fine.vehicleNo}</td>
                                                    <td style={{ padding: '12px', color: '#212529', fontSize: '14px' }}>{fine.totalAmount}</td>
                                                    <td style={{ padding: '12px', color: '#212529', fontSize: '14px' }}>{fine.issueDate}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            {['Reference No', 'Driving License No', 'Provision', 'Vehicle No', 'Total Amount', 'Issue Date'].map((header, i) => (
                                                <th key={header} style={{ 
                                                    padding: '12px', 
                                                    borderTop: '2px solid #dee2e6',
                                                    color: '#212529',
                                                    fontWeight: '700',
                                                    fontSize: '14px',
                                                    backgroundColor: i % 2 === 0 ? '#e9ecef' : '#fff'
                                                }}>
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                                <div style={{ fontSize: '14px', color: '#212529' }}>
                                    Showing {filteredFines.length > 0 ? 1 : 0} to {filteredFines.length} of {filteredFines.length} entries
                                </div>
                                <div style={{ display: 'flex', border: '1px solid #dee2e6', borderRadius: '4px', overflow: 'hidden' }}>
                                    <button style={{ padding: '6px 12px', backgroundColor: '#fff', border: 'none', color: '#6c757d', cursor: 'not-allowed', borderRight: '1px solid #dee2e6' }}>Previous</button>
                                    <button style={{ padding: '6px 12px', backgroundColor: '#007bff', border: 'none', color: '#fff', cursor: 'pointer', borderRight: '1px solid #dee2e6' }}>1</button>
                                    <button style={{ padding: '6px 12px', backgroundColor: '#fff', border: 'none', color: '#007bff', cursor: 'pointer' }}>Next</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
