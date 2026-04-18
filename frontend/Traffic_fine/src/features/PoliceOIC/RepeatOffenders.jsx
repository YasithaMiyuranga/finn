import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Menu, Users, ChevronDown, LogOut,
    Search, UserCheck, ShieldAlert
} from 'lucide-react';

export default function RepeatOffenders() {
    const navigate = useNavigate();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const activeNav = 'repeat-offenders';

    const [suspendedDrivers, setSuspendedDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        fetchSuspendedDrivers();
    }, []);

    const fetchSuspendedDrivers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:8080/api/Driver/suspended', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setSuspendedDrivers(data.data);
            }
        } catch (err) {
            console.error('Error fetching suspended drivers:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleReactivate = async (licenseNumber) => {
        if (!window.confirm(`Are you sure you want to reactivate driver account ${licenseNumber}?`)) return;

        setProcessingId(licenseNumber);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:8080/api/Driver/reactivate/${licenseNumber}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                alert('Driver account reactivated successfully!');
                fetchSuspendedDrivers();
            } else {
                alert('Failed to reactivate: ' + data.message);
            }
        } catch (err) {
            console.error('Reactivation error:', err);
            alert('An error occurred during reactivation.');
        } finally {
            setProcessingId(null);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/auth/login');
    };

    const handleNav = (id) => {
        if (id === 'dashboard') navigate('/dashboard/police-oic');
        if (id === 'add-traffic-officer') navigate('/dashboard/police-oic/add-traffic-officer');
        if (id === 'view-all-traffic-officers') navigate('/dashboard/police-oic/view-all-traffic-officers');
        if (id === 'view-all-drivers') navigate('/dashboard/police-oic/view-all-drivers');
        if (id === 'repeat-offenders') navigate('/dashboard/police-oic/repeat-offenders');
    };

    const navItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                </svg>
            )
        },
        {
            id: 'add-traffic-officer',
            label: 'Add Traffic Officer',
            icon: (
                <svg viewBox="0 0 512 512" fill="currentColor" width="22" height="22">
                    <path d="M0 128C0 92.7 28.7 64 64 64H448c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM176 256a64 64 0 1 0 0-128 64 64 0 1 0 0 128zM80 352c0 35.3 28.7 64 64 64H208c35.3 0 64-28.7 64-64v-16c0-17.7-14.3-32-32-32H112c-17.7 0-32 14.3-32 32v16zM320 160c-8.8 0-16 7.2-16 16s7.2 16 16 16H432c8.8 0 16-7.2 16-16s-7.2-16-16-16H320zm0 64c-8.8 0-16 7.2-16 16s7.2 16 16 16H432c8.8 0 16-7.2 16-16s-7.2-16-16-16H320zm0 64c-8.8 0-16 7.2-16 16s7.2 16 16 16H432c8.8 0 16-7.2 16-16s-7.2-16-16-16H320z"/>
                </svg>
            )
        },
        { 
            id: 'view-all-traffic-officers', 
            label: 'View All Traffic Officers', 
            icon: (
                <svg viewBox="0 0 640 512" fill="currentColor" width="22" height="22">
                    <path d="M416 224c0-53-43-96-96-96s-96 43-96 96 43 96 96 96 96-43 96-96zm-171.7-86.3C213.6 109 177.3 96 144 96c-53 0-96 43-96 96s43 96 96 96c21.2 0 40.5-6.9 56.4-18.5-8.2-18.7-12.4-39-12.4-60.5 0-33 11.2-63.5 30.3-87.3zM224 352c-70.7 0-128 57.3-128 128 0 17.7 14.3 32 32 32h275.6c11.7-32.5 35.8-59 66.4-71.8V384h-.3c-11.4-19-31.5-32-54.1-32h-191.6zm403.9-39.7c2.4 12.8 2.4 25.8 0 38.6l32 25c2.9 2.2 3.6 6.2 1.6 9.4l-30.2 52.3c-2 3.5-6.4 4.8-10.1 3.5l-37.6-15.1c-11.8 9.5-25 17-39.2 22.2l-5.7 40C531.3 491.5 528 494 524 494h-60.4c-4 0-7.3-2.5-7.7-6.2l-5.7-40c-14.2-5.2-27.4-12.7-39.2-22.2l-37.6 15.1c-3.7 1.3-8.1 0-10.1-3.5l-30.2-52.3c-2-3.2-1.2-7.2 1.6-9.4l32-25c-2.4-12.8-2.4-25.8 0-38.6l-32-25c-2.9-2.2-3.6-6.2-1.6-9.4l30.2-52.3c2-3.5 6.4-4.8 10.1-3.5l37.6 15.1c11.8-9.5 25-17 39.2-22.2l5.7-40c.4-3.7 3.7-6.2 7.7-6.2h60.4c4 0 7.3 2.5 7.7 6.2l5.7 40c14.2 5.2 27.4 12.7 39.2 22.2l37.6-15.1c3.7-1.3 8.1 0-10.1 3.5l30.2 52.3c2 3.2 1.2 7.2-1.6 9.4l-32 25zM493.8 450c18.5 0 33.6-15.1 33.6-33.6s-15.1-33.6-33.6-33.6-33.6 15.1-33.6 33.6 15.1 33.6 33.6 33.6z"/>
            </svg>
            )
        },
        { id: 'view-all-drivers', label: 'View All Drivers', icon: <Users size={22} /> },
        { 
            id: 'repeat-offenders', 
            label: 'Repeat Offenders', 
            icon: <ShieldAlert size={22} /> 
        },
    ];

    const filteredDrivers = suspendedDrivers.filter(d => 
        String(d.licenseNumber).includes(searchTerm) ||
        `${d.firstName} ${d.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const suspendedCount = suspendedDrivers.filter(d => !d.isReactivated).length;
    const reactivatedCount = suspendedDrivers.filter(d => d.isReactivated).length;

    return (
        <div className="min-h-screen flex bg-gray-100" style={{ fontFamily: "'Segoe UI', Roboto, sans-serif" }}>

            {/* ======== LEFT SIDEBAR ======== */}
            <aside style={{ 
                width: sidebarOpen ? '220px' : '60px',
                backgroundColor: '#0e2238',
                minHeight: '100vh',
                position: 'fixed',
                top: 0, left: 0,
                zIndex: 50,
                transition: 'width 0.25s ease',
                overflow: 'hidden'
            }}
                className="flex flex-col shadow-xl">

                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    style={{
                        width: '100%',
                        padding: '16px 0',
                        color: 'rgba(255,255,255,0.85)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: sidebarOpen ? 'flex-start' : 'center',
                        paddingLeft: sidebarOpen ? '19px' : '0',
                        gap: '12px',
                        whiteSpace: 'nowrap',
                    }}
                    title="Toggle Menu"
                >
                    <Menu size={22} style={{ flexShrink: 0 }} />
                </button>

                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => handleNav(item.id)}
                        title={item.label}
                        style={{
                            width: '100%',
                            padding: '14px 0',
                            paddingLeft: sidebarOpen ? '18px' : '0',
                            color: activeNav === item.id ? '#ffffff' : 'rgba(255,255,255,0.6)',
                            backgroundColor: activeNav === item.id ? '#1a7a7a' : 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: sidebarOpen ? 'flex-start' : 'center',
                            gap: '14px',
                            transition: 'all 0.2s',
                            whiteSpace: 'nowrap',
                            textAlign: 'left',
                        }}
                        className="hover:bg-white/10"
                    >
                        <span style={{ flexShrink: 0 }}>{item.icon}</span>
                        {sidebarOpen && (
                            <span style={{ fontSize: '14px', fontWeight: '500', color: activeNav === item.id ? '#fff' : 'rgba(255,255,255,0.8)' }}>
                                {item.label}
                            </span>
                        )}
                    </button>
                ))}
            </aside>

            {/* ======== MAIN AREA ======== */}
            <div style={{ marginLeft: sidebarOpen ? '220px' : '60px', flex: 1, display: 'flex', flexDirection: 'column', transition: 'margin-left 0.25s ease' }}>

                {/* ======== TOP NAV ======== */}
                <nav style={{
                    backgroundColor: '#0e2238',
                    height: '56px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 20px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 40,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ backgroundColor: 'white', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <i className="fas fa-car text-blue-600 text-lg"></i>
                        </div>
                        <span style={{ color: 'white', fontWeight: '800', fontSize: '18px', letterSpacing: '2px' }}>eTRAFFIC</span>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                color: 'white', background: 'none', border: 'none',
                                cursor: 'pointer', padding: '6px 12px', borderRadius: '6px',
                                fontSize: '13px', fontWeight: '700', letterSpacing: '1px',
                                textTransform: 'uppercase',
                            }}
                            className="hover:bg-white/10 transition-all"
                        >
                            SETTINGS
                            <ChevronDown size={14} style={{ transform: isSettingsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                        </button>

                        {isSettingsOpen && (
                            <div style={{
                                position: 'absolute', right: 0, top: '110%',
                                backgroundColor: 'white', borderRadius: '10px',
                                boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                                border: '1px solid #e5e7eb',
                                minWidth: '160px', padding: '6px 0', zIndex: 100
                            }}>
                                <button
                                    onClick={handleLogout}
                                    style={{
                                        width: '100%', textAlign: 'left', padding: '10px 16px',
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        color: '#ef4444', fontSize: '14px', fontWeight: '600',
                                        display: 'flex', alignItems: 'center', gap: '8px'
                                    }}
                                    className="hover:bg-red-50 transition-colors"
                                >
                                    <LogOut size={14} /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </nav>

                {/* ======== PAGE CONTENT ======== */}
                <div style={{ padding: '24px', flex: 1 }}>

                    {/* Breadcrumbs */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '14px', color: '#64748b' }}>
                        <span style={{ cursor: 'pointer', color: '#3b82f6' }} onClick={() => navigate('/dashboard/police-oic')}>Dashboard</span>
                        <span>/</span>
                        <span style={{ fontWeight: '600', color: '#1e293b' }}>Repeat Offenders</span>
                    </div>

                    <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Repeat Offenders Tracking</h1>
                    <p style={{ color: '#64748b', marginBottom: '24px' }}>Identify and manage drivers with high violation points who are currently suspended.</p>

                    {/* ======== STAT CARDS ======== */}
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '32px', flexWrap: 'wrap' }}>
                        {/* Suspended Card */}
                        <div style={{
                            flex: '1', minWidth: '300px', maxWidth: '350px',
                            backgroundColor: '#991b1b', borderRadius: '12px',
                            padding: '32px 24px', color: 'white',
                            boxShadow: '0 10px 25px rgba(153,27,27,0.3)',
                            display: 'flex', alignItems: 'center', gap: '20px'
                        }}>
                            <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '10px' }}>
                                <ShieldAlert size={32} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '36px', fontWeight: '800', margin: 0, lineHeight: 1 }}>
                                    {suspendedCount}
                                </h3>
                                <p style={{ margin: 0, fontSize: '14px', opacity: 0.9, fontWeight: '500' }}>Drivers Currently Suspended</p>
                            </div>
                        </div>

                        {/* Reactivated Card */}
                        <div style={{
                            flex: '1', minWidth: '300px', maxWidth: '350px',
                            backgroundColor: '#065f46', borderRadius: '12px',
                            padding: '32px 24px', color: 'white',
                            boxShadow: '0 10px 25px rgba(6,95,70,0.3)',
                            display: 'flex', alignItems: 'center', gap: '20px'
                        }}>
                            <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '10px' }}>
                                <UserCheck size={32} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '36px', fontWeight: '800', margin: 0, lineHeight: 1 }}>
                                    {reactivatedCount}
                                </h3>
                                <p style={{ margin: 0, fontSize: '14px', opacity: 0.9, fontWeight: '500' }}>Drivers Currently Reactivated</p>
                            </div>
                        </div>
                    </div>

                    {/* ======== TABLE AREA ======== */}
                    <div style={{
                        backgroundColor: 'white', borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        border: '1px solid #e2e8f0', overflow: 'hidden'
                    }}>
                        {/* Header & Search */}
                        <div style={{
                            padding: '20px 24px', borderBottom: '1px solid #f1f5f9',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            backgroundColor: '#f8fafc'
                        }}>
                            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#334155' }}>Suspended Driver List</h3>
                            <div style={{ position: 'relative', width: '300px' }}>
                                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    type="text"
                                    placeholder="Search License or Name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{
                                        width: '100%', padding: '8px 12px 8px 40px',
                                        borderRadius: '8px', border: '1px solid #e2e8f0',
                                        fontSize: '14px', outline: 'none',
                                        transition: 'border-color 0.2s'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                />
                            </div>
                        </div>

                        {/* Table */}
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f1f5f9' }}>
                                        <th style={{ padding: '14px 24px', fontSize: '13px', fontWeight: '700', color: '#475569', textTransform: 'uppercase' }}>License Number</th>
                                        <th style={{ padding: '14px 24px', fontSize: '13px', fontWeight: '700', color: '#475569', textTransform: 'uppercase' }}>Driver Name</th>
                                        <th style={{ padding: '14px 24px', fontSize: '13px', fontWeight: '700', color: '#475569', textTransform: 'uppercase' }}>Phone</th>
                                        <th style={{ padding: '14px 24px', fontSize: '13px', fontWeight: '700', color: '#475569', textTransform: 'uppercase' }}>Violation Points</th>
                                        <th style={{ padding: '14px 24px', fontSize: '13px', fontWeight: '700', color: '#475569', textTransform: 'uppercase' }}>Status</th>
                                        <th style={{ padding: '14px 24px', fontSize: '13px', fontWeight: '700', color: '#475569', textTransform: 'uppercase' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading suspended drivers...</td></tr>
                                    ) : filteredDrivers.length === 0 ? (
                                        <tr><td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No repeat offenders found.</td></tr>
                                    ) : filteredDrivers.map((driver) => (
                                        <tr key={driver.id} style={{ borderBottom: '1px solid #f1f5f9' }} className="hover:bg-slate-50 transition-colors">
                                            <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{driver.licenseNumber}</td>
                                            <td style={{ padding: '16px 24px', fontSize: '14px', color: '#475569' }}>{driver.firstName} {driver.lastName}</td>
                                            <td style={{ padding: '16px 24px', fontSize: '14px', color: '#475569' }}>{driver.phone}</td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <span style={{
                                                    backgroundColor: '#fee2e2', color: '#991b1b',
                                                    padding: '4px 12px', borderRadius: '50px',
                                                    fontSize: '13px', fontWeight: '700'
                                                }}>
                                                    {driver.points} pts
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                {driver.isReactivated ? (
                                                    <span style={{ color: '#059669', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                         Reactivated
                                                    </span>
                                                ) : (
                                                    <span style={{ color: '#dc2626', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                         Suspended
                                                    </span>
                                                )}
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                {!driver.isReactivated && (
                                                    <button
                                                        onClick={() => handleReactivate(driver.licenseNumber)}
                                                        disabled={processingId === driver.licenseNumber}
                                                        style={{
                                                            backgroundColor: '#1a7a7a', color: 'white',
                                                            padding: '8px 16px', borderRadius: '8px',
                                                            border: 'none', cursor: 'pointer', fontSize: '13px',
                                                            fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px',
                                                            transition: 'all 0.2s',
                                                            boxShadow: '0 2px 4px rgba(26,122,122,0.2)'
                                                        }}
                                                        onMouseOver={(e) => {
                                                            e.target.style.backgroundColor = '#145d5d';
                                                            e.target.style.transform = 'translateY(-1px)';
                                                        }}
                                                        onMouseOut={(e) => {
                                                            e.target.style.backgroundColor = '#1a7a7a';
                                                            e.target.style.transform = 'translateY(0)';
                                                        }}
                                                    >
                                                        {processingId === driver.licenseNumber ? 'Processing...' : (
                                                            <>
                                                                Reactivate
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}
