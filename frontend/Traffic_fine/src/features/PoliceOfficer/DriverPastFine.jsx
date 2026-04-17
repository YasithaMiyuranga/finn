import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Menu, ChevronDown, LogOut,
    PlusCircle, History, Flag, Gauge, Search, Loader2, AlertCircle
} from 'lucide-react';

export default function DriverPastFine() {
    const navigate = useNavigate();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    // Core search state
    const [licenseNo, setLicenseNo] = useState('');
    const [allFines, setAllFines] = useState([]);
    const [filteredFines, setFilteredFines] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [innerSearch, setInnerSearch] = useState('');

    const fetchFines = async () => {
        if (!licenseNo.trim()) return;
        
        setLoading(true);
        setHasSearched(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:8080/api/traffic_fine/getTrafficFine', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                const fines = data.data || [];
                // Filter by license number
                const filtered = fines.filter(f => 
                    String(f.licenseId || f.license_id || f.drivingLicenseNo).toLowerCase() === licenseNo.toLowerCase().trim()
                );
                setAllFines(filtered);
                setFilteredFines(filtered);
            }
        } catch (error) {
            console.error('Error fetching fines:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInnerSearch = (val) => {
        setInnerSearch(val);
        const searchFiltered = allFines.filter(f => 
            String(f.refNo || f.referenceNo).toLowerCase().includes(val.toLowerCase()) ||
            String(f.vehicleNo || f.vehicalNo).toLowerCase().includes(val.toLowerCase()) ||
            String(f.place).toLowerCase().includes(val.toLowerCase()) ||
            String(f.provisions || f.provision).toLowerCase().includes(val.toLowerCase())
        );
        setFilteredFines(searchFiltered);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/auth/login');
    };

    const handleNav = (id) => {
        if (id === 'dashboard') navigate('/dashboard/policeofficer');
        if (id === 'add-new-fine') navigate('/dashboard/policeofficer/add-new-fine');
        if (id === 'drivers-past-fine') navigate('/dashboard/policeofficer/driver-past-fines');
        if (id === 'view-reported-fine') navigate('/dashboard/policeofficer/view-reported-fine');
    };

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <Gauge size={22} /> },
        { id: 'add-new-fine', label: 'Add New Fine', icon: <PlusCircle size={22} /> },
        { id: 'drivers-past-fine', label: "Driver's Past Fine", icon: <History size={22} /> },
        { id: 'view-reported-fine', label: 'View Reported Fine', icon: <Flag size={22} /> },
    ];

    const sidebarWidth = sidebarOpen ? '250px' : '65px';

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
                                backgroundColor: item.id === 'drivers-past-fine' ? '#17a2b8' : 'transparent',
                                borderLeft: item.id === 'drivers-past-fine' ? '4px solid #fff' : '4px solid transparent',
                                transition: 'background-color 0.2s',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap'
                            }}
                            onMouseEnter={(e) => {
                                if (item.id !== 'drivers-past-fine') e.currentTarget.style.backgroundColor = '#1e3352';
                            }}
                            onMouseLeave={(e) => {
                                if (item.id !== 'drivers-past-fine') e.currentTarget.style.backgroundColor = 'transparent';
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
                        <div style={{ backgroundColor: 'white', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <i className="fas fa-car text-blue-600 text-lg"></i>
                        </div>
                        <span style={{ fontWeight: 'bold', fontSize: '20px', letterSpacing: '1px', color: 'white' }}>eTRAFFIC</span>
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
                        <h1 style={{ fontSize: '28px', color: '#212529', marginBottom: '8px', fontWeight: '400' }}>Driver's Past Fine</h1>
                        <div style={{ fontSize: '14px', color: '#6c757d' }}>
                            <span style={{ color: '#007bff' }}>Dashboard</span> / Driver's Past Fine
                        </div>
                    </div>

                    {/* Search Field Card */}
                    <div style={{ 
                        backgroundColor: '#fff', 
                        borderRadius: '4px', 
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        border: '1px solid rgba(0,0,0,.125)',
                        marginBottom: '30px'
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
                            <History size={16} />
                            Search Driver Past Fines
                        </div>
                        <div style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <input
                                    type="text"
                                    placeholder="Driving License No"
                                    value={licenseNo}
                                    onChange={(e) => setLicenseNo(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && fetchFines()}
                                    style={{
                                        padding: '8px 12px',
                                        border: '1px solid #ced4da',
                                        borderRadius: '4px',
                                        width: '280px',
                                        outline: 'none',
                                        fontSize: '14px'
                                    }}
                                />
                                <button
                                    onClick={fetchFines}
                                    style={{
                                        backgroundColor: '#007bff',
                                        color: 'white',
                                        padding: '8px 20px',
                                        borderRadius: '4px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                                    Check
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Table Card */}
                    <div style={{ 
                        backgroundColor: '#fff', 
                        borderRadius: '4px', 
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        border: '1px solid rgba(0,0,0,.125)'
                    }}>
                        <div style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <label style={{ fontSize: '14px', color: '#495057' }}>Search:</label>
                                    <input 
                                        type="text" 
                                        value={innerSearch}
                                        onChange={(e) => handleInnerSearch(e.target.value)}
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
                                            {['Reference No', 'Provision', 'Vehicle No', 'Place', 'Issue Date'].map((header, i) => (
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
                                        {filteredFines.length > 0 ? (
                                            filteredFines.map((fine, index) => (
                                                <tr key={index} style={{ borderBottom: '1px solid #dee2e6', backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa' }}>
                                                    <td style={{ padding: '12px', color: '#212529', fontSize: '14px' }}>{fine.refNo || fine.referenceNo}</td>
                                                    <td style={{ padding: '12px', color: '#212529', fontSize: '14px' }}>{fine.provisions || fine.provision}</td>
                                                    <td style={{ padding: '12px', color: '#212529', fontSize: '14px' }}>{fine.vehicleNo || fine.vehicalNo}</td>
                                                    <td style={{ padding: '12px', color: '#212529', fontSize: '14px' }}>{fine.place}</td>
                                                    <td style={{ padding: '12px', color: '#212529', fontSize: '14px' }}>{fine.issuedDate || fine.issueDate}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#6c757d' }}>
                                                    {!hasSearched ? (
                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                                                            <History size={32} style={{ opacity: 0.3 }} />
                                                            <span>Enter a driving license number to view past fines</span>
                                                        </div>
                                                    ) : loading ? (
                                                        "Searching records..."
                                                    ) : (
                                                        "No data available in table"
                                                    )}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
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
