import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Menu, UserPlus, Users, ChevronDown, LogOut,
    Edit, Bell
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [activeNav, setActiveNav] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [stats, setStats] = useState({
        totalDrivers: 0,
        last7Days: 0,
        lastMonth: 0,
        lastYear: 0,
    });

    const [chartData, setChartData] = useState([
        { month: 'January',   count: 0 },
        { month: 'February',  count: 0 },
        { month: 'March',     count: 0 },
        { month: 'April',     count: 0 },
        { month: 'May',       count: 0 },
        { month: 'June',      count: 0 },
        { month: 'July',      count: 0 },
        { month: 'August',    count: 0 },
        { month: 'September', count: 0 },
        { month: 'October',   count: 0 },
        { month: 'November',  count: 0 },
        { month: 'December',  count: 0 },
    ]);

    useEffect(() => {
        fetchStats();
        fetchChartData();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:8080/api/Driver/getStats', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setStats(data.data);
            }
        } catch (err) {
            console.error('Stats fetch error:', err);
        }
    };

    const fetchChartData = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:8080/api/Driver/getMonthlyChart', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success && Array.isArray(data.data)) {
                setChartData(data.data);
            }
        } catch (err) {
            console.error('Chart fetch error:', err);
        }
    };

    const currentYear = new Date().getFullYear();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userType');
        navigate('/auth/login');
    };

    const handleNav = (id) => {
        if (id === 'dashboard') navigate('/dashboard/admin');
        if (id === 'add-traffic-officer') navigate('/dashboard/admin/add-traffic-officer');
        if (id === 'view-all-traffic-officers') navigate('/dashboard/admin/view-all-traffic-officers');
        if (id === 'view-all') navigate('/dashboard/admin/view-all-drivers');
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
                    <path d="M416 224c0-53-43-96-96-96s-96 43-96 96 43 96 96 96 96-43 96-96zm-171.7-86.3C213.6 109 177.3 96 144 96c-53 0-96 43-96 96s43 96 96 96c21.2 0 40.5-6.9 56.4-18.5-8.2-18.7-12.4-39-12.4-60.5 0-33 11.2-63.5 30.3-87.3zM224 352c-70.7 0-128 57.3-128 128 0 17.7 14.3 32 32 32h275.6c11.7-32.5 35.8-59 66.4-71.8V384h-.3c-11.4-19-31.5-32-54.1-32h-191.6zm403.9-39.7c2.4 12.8 2.4 25.8 0 38.6l32 25c2.9 2.2 3.6 6.2 1.6 9.4l-30.2 52.3c-2 3.5-6.4 4.8-10.1 3.5l-37.6-15.1c-11.8 9.5-25 17-39.2 22.2l-5.7 40C531.3 491.5 528 494 524 494h-60.4c-4 0-7.3-2.5-7.7-6.2l-5.7-40c-14.2-5.2-27.4-12.7-39.2-22.2l-37.6 15.1c-3.7 1.3-8.1 0-10.1-3.5l-30.2-52.3c-2-3.2-1.2-7.2 1.6-9.4l32-25c-2.4-12.8-2.4-25.8 0-38.6l-32-25c-2.9-2.2-3.6-6.2-1.6-9.4l30.2-52.3c2-3.5 6.4-4.8 10.1-3.5l37.6 15.1c11.8-9.5 25-17 39.2-22.2l5.7-40c.4-3.7 3.7-6.2 7.7-6.2h60.4c4 0 7.3 2.5 7.7 6.2l5.7 40c14.2 5.2 27.4 12.7 39.2 22.2l37.6-15.1c3.7-1.3 8.1 0 10.1 3.5l30.2 52.3c2 3.2 1.2 7.2-1.6 9.4l-32 25zM493.8 450c18.5 0 33.6-15.1 33.6-33.6s-15.1-33.6-33.6-33.6-33.6 15.1-33.6 33.6 15.1 33.6 33.6 33.6z"/>
                </svg>
            )
        },
        {
            id: 'view-all',
            label: 'View All Drivers',
            icon: <Users size={22} />
        },
    ];

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

                {/* Hamburger - toggle button */}
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

                {/* Navigation Items */}
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
                    {/* Logo only - no hamburger in navbar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ backgroundColor: '#dc2626', padding: '5px 7px', borderRadius: '6px', display: 'flex', alignItems: 'center' }}>
                            <Bell size={16} fill="white" color="white" />
                        </div>
                        <span style={{ color: 'white', fontWeight: '800', fontSize: '18px', letterSpacing: '2px' }}>STFMS</span>
                    </div>

                    {/* Settings Dropdown */}
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
                <div style={{ padding: '20px', flex: 1 }}>

                    {/* Account Holder Badge */}
                    <div style={{
                        display: 'inline-block',
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #e2e8f0',
                        borderRadius: '50px',
                        padding: '8px 18px',
                        marginBottom: '20px',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#374151',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                    }}>
                        Account Holder : <span style={{ color: '#374151' }}>Motor Traffic Department</span>
                    </div>

                    {/* ======== STAT CARDS ======== */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>

                        {/* Card 1 - Red - Registered Drivers */}
                        <div style={{
                            backgroundColor: '#e05555', borderRadius: '10px',
                            padding: '28px 20px', textAlign: 'center', color: 'white',
                            boxShadow: '0 4px 15px rgba(224,85,85,0.35)',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            cursor: 'pointer'
                        }}
                        className="hover:scale-105"
                        >
                            <div style={{ fontSize: '42px', marginBottom: '10px', opacity: 0.9 }}>
                                <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48" style={{ margin: '0 auto' }}>
                                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                                </svg>
                            </div>
                            <h3 style={{ fontSize: '42px', fontWeight: '800', margin: '0 0 6px 0', lineHeight: 1 }}>
                                {stats.totalDrivers}
                            </h3>
                            <p style={{ margin: 0, fontSize: '13px', opacity: 0.9, fontWeight: '500' }}>Registered Drivers</p>
                        </div>

                        {/* Card 2 - Orange - Last 7 Days */}
                        <div style={{
                            backgroundColor: '#e88025', borderRadius: '10px',
                            padding: '28px 20px', textAlign: 'center', color: 'white',
                            boxShadow: '0 4px 15px rgba(232,128,37,0.35)',
                            transition: 'transform 0.2s',
                            cursor: 'pointer'
                        }}
                        className="hover:scale-105"
                        >
                            <div style={{ marginBottom: '10px', opacity: 0.9 }}>
                                <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48" style={{ margin: '0 auto' }}>
                                    <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
                                </svg>
                            </div>
                            <h3 style={{ fontSize: '42px', fontWeight: '800', margin: '0 0 6px 0', lineHeight: 1 }}>
                                {stats.last7Days}
                            </h3>
                            <p style={{ margin: 0, fontSize: '13px', opacity: 0.9, fontWeight: '500' }}>Last 7 Days Registered</p>
                        </div>

                        {/* Card 3 - Teal - Last Month */}
                        <div style={{
                            backgroundColor: '#20b2a0', borderRadius: '10px',
                            padding: '28px 20px', textAlign: 'center', color: 'white',
                            boxShadow: '0 4px 15px rgba(32,178,160,0.35)',
                            transition: 'transform 0.2s',
                            cursor: 'pointer'
                        }}
                        className="hover:scale-105"
                        >
                            <div style={{ marginBottom: '10px', opacity: 0.9 }}>
                                <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48" style={{ margin: '0 auto' }}>
                                    <path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"/>
                                </svg>
                            </div>
                            <h3 style={{ fontSize: '42px', fontWeight: '800', margin: '0 0 6px 0', lineHeight: 1 }}>
                                {stats.lastMonth}
                            </h3>
                            <p style={{ margin: 0, fontSize: '13px', opacity: 0.9, fontWeight: '500' }}>Last Month Registered</p>
                        </div>

                        {/* Card 4 - Purple - Last Year */}
                        <div style={{
                            backgroundColor: '#6b3fa0', borderRadius: '10px',
                            padding: '28px 20px', textAlign: 'center', color: 'white',
                            boxShadow: '0 4px 15px rgba(107,63,160,0.35)',
                            transition: 'transform 0.2s',
                            cursor: 'pointer'
                        }}
                        className="hover:scale-105"
                        >
                            <div style={{ marginBottom: '10px', opacity: 0.9 }}>
                                <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48" style={{ margin: '0 auto' }}>
                                    <path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13zm-6-8l-4 3.99V12h-2v7h7v-2h-3.99L16 13z"/>
                                </svg>
                            </div>
                            <h3 style={{ fontSize: '42px', fontWeight: '800', margin: '0 0 6px 0', lineHeight: 1 }}>
                                {stats.lastYear}
                            </h3>
                            <p style={{ margin: 0, fontSize: '13px', opacity: 0.9, fontWeight: '500' }}>Last Year Registered</p>
                        </div>

                    </div>

                    {/* ======== BAR CHART ======== */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        padding: '24px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
                        border: '1px solid #e5e7eb'
                    }}>
                        <div style={{
                            borderBottom: '1px solid #f1f5f9',
                            paddingBottom: '14px',
                            marginBottom: '20px'
                        }}>
                            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: '#1e293b' }}>
                                Registered Drivers Count {currentYear}
                            </h3>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData} barSize={36}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                                    axisLine={{ stroke: '#e2e8f0' }}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                                    axisLine={false}
                                    tickLine={false}
                                    allowDecimals={false}
                                    tickCount={6}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(217,83,79,0.05)' }}
                                    contentStyle={{
                                        borderRadius: '8px',
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                        fontSize: '13px'
                                    }}
                                    formatter={(value) => [value, 'Drivers Registered']}
                                />
                                <Bar dataKey="count" fill="#d9534f" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                </div>
            </div>

        </div>
    );
}
