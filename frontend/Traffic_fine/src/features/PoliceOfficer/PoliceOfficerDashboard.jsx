import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Menu, ChevronDown, LogOut,
    PlusCircle, History, FileText, Flag, Gauge, Bell
} from 'lucide-react';
import {
    BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';

export default function PoliceOfficerDashboard() {
    const navigate = useNavigate();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [officerInfo, setOfficerInfo] = useState({
        officerId: "Loading...",
        policeStation: "Loading...",
        court: "Loading..."
    });

    const [stats, setStats] = useState({
        reportedFineCount: 0,
        reportedFineAmount: 0.00
    });

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <Gauge size={22} /> },
        { id: 'add-new-fine', label: 'Add New Fine', icon: <PlusCircle size={22} /> },
        { id: 'drivers-past-fine', label: "Driver's Past Fine", icon: <History size={22} /> },
        { id: 'revenue-license', label: 'Revenue License', icon: <FileText size={22} /> },
        { id: 'view-reported-fine', label: 'View Reported Fine', icon: <Flag size={22} /> },
    ];

    const handleNav = (id) => {
        if (id === 'dashboard') navigate('/dashboard/policeofficer');
        if (id === 'add-new-fine') navigate('/dashboard/policeofficer/add-new-fine');
        if (id === 'view-reported-fine') navigate('/dashboard/policeofficer/view-reported-fine');
        // Add more routing later
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/auth/login');
    };

    const initChartData = () => [
        { name: 'January', c: 0, amt: 0 },
        { name: 'February', c: 0, amt: 0 },
        { name: 'March', c: 0, amt: 0 },
        { name: 'April', c: 0, amt: 0 },
        { name: 'May', c: 0, amt: 0 },
        { name: 'June', c: 0, amt: 0 },
        { name: 'July', c: 0, amt: 0 },
        { name: 'August', c: 0, amt: 0 },
        { name: 'September', c: 0, amt: 0 },
        { name: 'October', c: 0, amt: 0 },
        { name: 'November', c: 0, amt: 0 },
        { name: 'December', c: 0, amt: 0 },
    ];

    const [chartData, setChartData] = useState(initChartData());

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                const userId = localStorage.getItem('userId');
                if (!userId || !token) return;

                // 1. Fetch Officer profile
                let officerPoliceId = null;
                const offRes = await fetch('http://localhost:8080/api/police_officers/getPoliceOfficers', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (offRes.ok) {
                    const offData = await offRes.json();
                    const officers = offData.data || offData || [];
                    const me = officers.find(o => 
                        String(o.user?.userId || o.user?.user_id || o.user?.id || o.userId || o.user) === String(userId)
                    );
                    
                    if (me) {
                        officerPoliceId = String(me.policeid);
                        setOfficerInfo({
                            officerId: me.policeid || "N/A",
                            policeStation: me.policeStation || "N/A",
                            court: me.court || "N/A"
                        });
                    }
                }

                // 2. Fetch traffic fines to calculate stats & charts
                const res = await fetch('http://localhost:8080/api/traffic_fine/getTrafficFine', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.ok && officerPoliceId) {
                    const data = await res.json();
                    let allFines = [];
                    if (Array.isArray(data.data)) allFines = data.data;
                    else if (Array.isArray(data)) allFines = data;

                    // Filter fines for THIS officer
                    let myFines = allFines.filter(f => {
                        const fPoliceId = String(f.policeId || f.police_id || f.policeid || "");
                        return fPoliceId === officerPoliceId;
                    });

                    let totalAmt = 0;
                    let cData = initChartData();

                    myFines.forEach(f => {
                        const amt = parseFloat(f.totalAmount || f.fineAmount || 0);
                        totalAmt += amt;

                        // Robust Date Parsing for Chart
                        let dateObj = null;
                        const d = f.issuedDate || f.issued_date || f.issueDate;
                        
                        if (Array.isArray(d) && d.length >= 3) {
                            dateObj = new Date(d[0], d[1] - 1, d[2]);
                        } else if (d) {
                            dateObj = new Date(d);
                        }

                        if (dateObj && !isNaN(dateObj.getTime())) {
                            const monthIdx = dateObj.getMonth();
                            if (monthIdx >= 0 && monthIdx < 12) {
                                cData[monthIdx].c += 1;
                                cData[monthIdx].amt += amt;
                            }
                        }
                    });

                    setStats({
                        reportedFineCount: myFines.length,
                        reportedFineAmount: totalAmt
                    });
                    setChartData(cData);
                }
            } catch (err) {
                console.error("Dashboard fetch error:", err);
            }
        };

        fetchDashboardData();
    }, []);

    const sidebarWidth = sidebarOpen ? '250px' : '65px';

    return (
        <div className="min-h-screen flex bg-gray-100" style={{ fontFamily: "'Segoe UI', Roboto, sans-serif" }}>

            {/* ======== SIDEBAR ======== */}
            <aside style={{
                width: sidebarWidth, backgroundColor: '#0e2238',
                minHeight: '100vh', position: 'fixed', top: 0, left: 0,
                zIndex: 50, transition: 'width 0.25s ease', overflow: 'hidden'
            }} className="flex flex-col shadow-xl">

                {/* Hamburger */}
                <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
                    width: '100%', padding: '16px 0', color: 'rgba(255,255,255,0.85)',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center',
                    justifyContent: sidebarOpen ? 'flex-start' : 'center',
                    paddingLeft: sidebarOpen ? '20px' : '0', gap: '12px', whiteSpace: 'nowrap',
                }} title="Toggle Menu">
                    <Menu size={22} style={{ flexShrink: 0 }} />
                </button>

                {navItems.map(item => (
                    <button key={item.id} onClick={() => handleNav(item.id)} title={item.label} style={{
                        width: '100%', padding: '16px 0',
                        paddingLeft: sidebarOpen ? '20px' : '0',
                        color: item.id === 'dashboard' ? '#ffffff' : 'rgba(255,255,255,0.7)',
                        backgroundColor: item.id === 'dashboard' ? '#17a2b8' : 'transparent',
                        border: 'none', cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: sidebarOpen ? 'flex-start' : 'center',
                        gap: '14px', transition: 'all 0.2s', whiteSpace: 'nowrap',
                    }} className="hover:bg-white/10">
                        <span style={{ flexShrink: 0 }}>{item.icon}</span>
                        {sidebarOpen && (
                            <span style={{ fontSize: '15px', fontWeight: '500', color: item.id === 'dashboard' ? '#fff' : 'rgba(255,255,255,0.9)' }}>
                                {item.label}
                            </span>
                        )}
                    </button>
                ))}
            </aside>

            {/* ======== MAIN ======== */}
            <div style={{ marginLeft: sidebarWidth, flex: 1, display: 'flex', flexDirection: 'column', transition: 'margin-left 0.25s ease' }}>

                {/* TOP NAV */}
                <nav style={{
                    backgroundColor: '#0e2238', height: '60px', display: 'flex',
                    alignItems: 'center', justifyContent: 'space-between',
                    padding: '0 24px', position: 'sticky', top: 0, zIndex: 40,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ backgroundColor: 'white', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <i className="fas fa-car text-blue-600 text-lg"></i>
                        </div>
                        <span style={{ color: 'white', fontWeight: '800', fontSize: '20px', letterSpacing: '2px' }}>eTRAFFIC</span>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} style={{
                            display: 'flex', alignItems: 'center', gap: '6px', color: 'white',
                            background: 'none', border: 'none', cursor: 'pointer', padding: '8px 12px',
                            borderRadius: '6px', fontSize: '14px', fontWeight: '700',
                            letterSpacing: '1px', textTransform: 'uppercase',
                        }} className="hover:bg-white/10 transition-all">
                            SETTINGS <ChevronDown size={14} style={{ transform: isSettingsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                        </button>
                        {isSettingsOpen && (
                            <div style={{
                                position: 'absolute', right: 0, top: '110%', backgroundColor: 'white',
                                borderRadius: '10px', boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                                border: '1px solid #e5e7eb', minWidth: '160px', padding: '8px 0', zIndex: 100
                            }}>
                                <button onClick={handleLogout} style={{
                                    width: '100%', textAlign: 'left', padding: '10px 16px',
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: '#ef4444', fontSize: '14px', fontWeight: '600',
                                    display: 'flex', alignItems: 'center', gap: '8px'
                                }} className="hover:bg-red-50 transition-colors">
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </nav>

                {/* PAGE CONTENT */}
                <div style={{ padding: '24px' }}>

                    {/* Top ID Badge */}
                    <div style={{ 
                        backgroundColor: '#f8f9fa', color: '#212529', 
                        display: 'inline-block', padding: '6px 12px', 
                        borderRadius: '4px', fontSize: '12px', fontWeight: '700',
                        marginBottom: '20px', border: '1px solid #dee2e6' 
                    }}>
                        Police Officer ID : <span style={{ color: '#0d6efd' }}>{officerInfo.officerId}</span>
                    </div>

                    {/* Stats Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                        
                        {/* Reported Fine Count */}
                        <div style={{ backgroundColor: '#d9534f', color: 'white', borderRadius: '10px', padding: '24px', textAlign: 'center', boxShadow: '0 4px 12px rgba(217, 83, 79, 0.2)' }}>
                            <div style={{ fontSize: '40px', marginBottom: '10px' }}><Flag size={48} /></div>
                            <h3 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0 0 10px 0' }}>{stats.reportedFineCount}</h3>
                            <p style={{ fontSize: '16px', margin: 0, opacity: 0.9 }}>Reported Fine Count</p>
                        </div>

                        {/* Reported Fine Amount */}
                        <div style={{ backgroundColor: '#e67e22', color: 'white', borderRadius: '10px', padding: '24px', textAlign: 'center', boxShadow: '0 4px 12px rgba(230, 126, 34, 0.2)' }}>
                            <div style={{ fontSize: '40px', marginBottom: '10px' }}><svg viewBox="0 0 512 512" width="48" height="48" fill="currentColor"><path d="M512 80c0 18-14.3 34.6-38.4 48-29.1 16.1-72.5 27.5-122.3 30.9-3.7-1.8-7.4-3.5-11.3-5C300.6 137.4 248.2 128 192 128c-8.3 0-16.4 .2-24.5 .6l-1.1-.6C142.3 114.6 128 98 128 80c0-44.2 86-80 192-80S512 35.8 512 80zM160.7 161.1c10.2-.7 20.7-1.1 31.3-1.1c62.2 0 117.4 12.3 152.5 31.4C369.3 204.9 384 221.7 384 240c0 4-.7 7.9-2.1 11.7c-4.6 13.2-17 25.3-35 35.5c0 0 0 0 0 0c-.1 .1-.3 .1-.4 .2l0 0 0 0c-.3 .2-.6 .3-.9 .5c-35 19.4-90.8 32-153.6 32c-59.6 0-112.9-11.3-148.2-29.1c-1.9-.9-3.7-1.9-5.5-2.9C14.3 274.6 0 258 0 240c0-34.8 53.4-64.5 128-75.4c10.5-1.5 21.4-2.7 32.7-3.5zM416 240c0-21.9-10.6-39.9-24.1-53.4c28.3-4.4 54.2-11.4 76.2-20.5c16.3-6.8 31.5-15.2 43.9-25.5V176c0 19.3-16.5 37.1-43.8 50.9c-14.6 7.4-32.4 13.7-52.4 18.5c.1-1.8 .2-3.5 .2-5.3zm-32 96c0 18-14.3 34.6-38.4 48c-1.8 1-3.6 1.9-5.5 2.9C304.9 404.7 251.6 416 192 416c-62.8 0-118.6-12.6-153.6-32C14.3 370.6 0 354 0 336V300.6c12.5 10.3 27.6 18.7 43.9 25.5C83.4 342.6 135.8 352 192 352s108.6-9.4 148.1-25.9c16.3-6.8 31.5-15.2 43.9-25.5V336zm0 96c0 18-14.3 34.6-38.4 48c-1.8 1-3.6 1.9-5.5 2.9C304.9 500.7 251.6 512 192 512c-62.8 0-118.6-12.6-153.6-32C14.3 466.6 0 450 0 432V396.6c12.5 10.3 27.6 18.7 43.9 25.5C83.4 438.6 135.8 448 192 448s108.6-9.4 148.1-25.9c16.3-6.8 31.5-15.2 43.9-25.5V432zM416 278.1c53.4 11.1 96 30.5 96 53.9V368c0 19.3-16.5 37.1-43.8 50.9c-14.6 7.4-32.4 13.7-52.4 18.5c.1-1.8 .2-3.5 .2-5.3c0-21.9-10.6-39.9-24.1-53.4c28.3-4.4 54.2-11.4 76.2-20.5c16.3-6.8 31.5-15.2 43.9-25.5V299.8c-17 11.1-38.7 20-63.5 25.8c-10.4 2.4-21.2 4.6-32.3 6.4v-42.6c13.8-3.4 27.1-7.3 39.8-11.4z"/></svg></div>
                            <h3 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0 0 10px 0' }}>{stats.reportedFineAmount.toFixed(2)}</h3>
                            <p style={{ fontSize: '16px', margin: 0, opacity: 0.9 }}>Reported Fine Amount (LKR)</p>
                        </div>

                        {/* Police Station */}
                        <div style={{ backgroundColor: '#20c997', color: 'white', borderRadius: '10px', padding: '24px', textAlign: 'center', boxShadow: '0 4px 12px rgba(32, 201, 151, 0.2)' }}>
                            <div style={{ fontSize: '40px', marginBottom: '10px' }}><svg viewBox="0 0 512 512" width="48" height="48" fill="currentColor"><path d="M480 32c0-17.7-14.3-32-32-32H64C46.3 0 32 14.3 32 32V640H480V32zM352 160H160c-17.7 0-32-14.3-32-32s14.3-32 32-32h192c17.7 0 32 14.3 32 32s-14.3 32-32 32zM160 224H352c17.7 0 32 14.3 32 32s-14.3 32-32 32H160c-17.7 0-32-14.3-32-32s14.3-32 32-32zm192 128H160c-17.7 0-32-14.3-32-32s14.3-32 32-32h192c17.7 0 32 14.3 32 32s-14.3 32-32 32zM160 480H352c17.7 0 32 14.3 32 32s-14.3 32-32 32H160c-17.7 0-32-14.3-32-32s14.3-32 32-32z"/></svg></div>
                            <h3 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0 0 10px 0' }}>{officerInfo.policeStation}</h3>
                            <p style={{ fontSize: '16px', margin: 0, opacity: 0.9 }}>Police Station</p>
                        </div>

                        {/* Court */}
                        <div style={{ backgroundColor: '#6f42c1', color: 'white', borderRadius: '10px', padding: '24px', textAlign: 'center', boxShadow: '0 4px 12px rgba(111, 66, 193, 0.2)' }}>
                            <div style={{ fontSize: '40px', marginBottom: '10px' }}><svg viewBox="0 0 512 512" width="48" height="48" fill="currentColor"><path d="M128 320c-17.7 0-32-14.3-32-32s14.3-32 32-32h256c17.7 0 32 14.3 32 32s-14.3 32-32 32H128zm0 64h256c17.7 0 32 14.3 32 32s-14.3 32-32 32H128c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0-192c-17.7 0-32-14.3-32-32s14.3-32 32-32h256c17.7 0 32 14.3 32 32s-14.3 32-32 32H128zM31.2 55.4l128 64c9.1 4.5 9.1 17.5 0 22.1l-128 64c-12.7 6.4-27.5-2.8-27.5-16.7V72.1c0-13.9 14.8-23.1 27.5-16.7zM424.3 72l128 64c12.7 6.4 12.7 25 0 31.4l-128 64c-11.8 5.9-25.5-2.8-25.5-15.7V87.7c0-12.9 13.7-21.6 25.5-15.7z" /></svg></div>
                            <h3 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0 0 10px 0' }}>{officerInfo.court}</h3>
                            <p style={{ fontSize: '16px', margin: 0, opacity: 0.9 }}>Court</p>
                        </div>
                    </div>

                    {/* Chart: Reported Fine Count */}
                    <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '0', marginBottom: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f8f9fa' }}>
                            <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b', fontWeight: '500', textAlign: 'center' }}>Reported Fine Count 2026</h3>
                        </div>
                        <div style={{ padding: '24px', height: '350px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid stroke="#e5e5e5" />
                                    <XAxis dataKey="name" axisLine={{ stroke: '#cccccc' }} tickLine={{ stroke: '#cccccc' }} tick={{ fontSize: 12, fill: '#64748b' }} />
                                    <YAxis axisLine={{ stroke: '#cccccc' }} tickLine={{ stroke: '#cccccc' }} tick={{ fontSize: 12, fill: '#64748b' }} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="c" stroke="#d9534f" strokeWidth={2} dot={{ fill: '#d9534f', r: 3 }} activeDot={{ r: 5 }} fill="#d9534f" fillOpacity={0.8} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Chart: Reported Fine Amount */}
                    <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '0', marginBottom: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f8f9fa' }}>
                            <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b', fontWeight: '500', textAlign: 'center' }}>Reported Fine Amount 2026</h3>
                        </div>
                        <div style={{ padding: '24px', height: '350px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid stroke="#e5e5e5" />
                                    <XAxis dataKey="name" axisLine={{ stroke: '#cccccc' }} tickLine={{ stroke: '#cccccc' }} tick={{ fontSize: 12, fill: '#64748b' }} />
                                    <YAxis axisLine={{ stroke: '#cccccc' }} tickLine={{ stroke: '#cccccc' }} tick={{ fontSize: 12, fill: '#64748b' }} />
                                    <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                                    <Bar dataKey="amt" fill="#e67e22" radius={0} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
