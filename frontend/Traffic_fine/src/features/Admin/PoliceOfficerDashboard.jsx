import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Menu, UserPlus, Users, ChevronDown, LogOut,
    Edit, Bell, CheckSquare, Pause, ShieldCheck, 
    PieChart as PieIcon, BarChart as BarIcon, 
    Layers, Landmark
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

export default function AdminOfficerDashboard() {
    const navigate = useNavigate();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const activeNav = 'officer-dashboard';

    const [stats, setStats] = useState({
        officerCount: 0,
        pendingAmount: 0,
        paidAmount: 0,
        provisionsCount: 0,
        totalDrivers: 0,
        policeStations: 0
    });

    const [fineDistribution, setFineDistribution] = useState([
        { name: 'Paid Fine Amount (LKR)', value: 0, color: '#20b2a0' },
        { name: 'Pending Fine Amount (LKR)', value: 0, color: '#e88025' }
    ]);

    const [userDistribution, setUserDistribution] = useState([
        { name: 'Number of Drivers', value: 0, color: '#007bff' },
        { name: 'Number of Traffic Police Officers', value: 0, color: '#e05555' }
    ]);

    const [monthlyFines, setMonthlyFines] = useState(
        Array.from({ length: 12 }, (_, i) => ({
            month: new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(2026, i, 1)),
            count: 0
        }))
    );

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            // 1. Fetch Officers (for Count & Police Stations)
            const offRes = await fetch('http://localhost:8080/api/police_officers/getPoliceOfficers', { headers });
            const offData = await offRes.json();
            const officers = offData.data || offData || [];
            
            // 2. Fetch Drivers
            const drvRes = await fetch('http://localhost:8080/api/Driver/getDrivers', { headers });
            const drvData = await drvRes.json();
            const drivers = drvData.data || drvData || [];

            // 3. Fetch Fines
            const fineRes = await fetch('http://localhost:8080/api/traffic_fine/getTrafficFine', { headers });
            const fineData = await fineRes.json();
            const fines = fineData.data || fineData || [];

            // 4. Fetch Violations
            const vioRes = await fetch('http://localhost:8080/api/Violation/getViolationTypes', { headers });
            const vioData = await vioRes.json();
            const violations = vioData.data || vioData || [];

            // --- Aggregation logic ---
            let pendingAmt = 0;
            let paidAmt = 0;
            const updatedMonthly = Array.from({ length: 12 }, (_, i) => ({
                month: new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(2026, i, 1)),
                count: 0
            }));

            fines.forEach(f => {
                const amt = parseFloat(f.totalAmount || f.fineAmount || 0);
                if (String(f.status).toUpperCase() === 'PAID') paidAmt += amt;
                else pendingAmt += amt;

                // Monthly count (assuming year 2026)
                const d = f.issuedDate || f.issued_date || f.issueDate;
                let monthIdx = -1;
                if (Array.isArray(d) && d.length >= 3) {
                    if (d[0] === 2026) monthIdx = d[1] - 1;
                } else if (d) {
                    const dobj = new Date(d);
                    if (dobj.getFullYear() === 2026) monthIdx = dobj.getMonth();
                }
                if (monthIdx >= 0) updatedMonthly[monthIdx].count += 1;
            });

            // Unique police stations
            const stations = new Set(officers.map(o => o.policeStation).filter(s => s));

            setStats({
                officerCount: officers.length,
                pendingAmount: pendingAmt,
                paidAmount: paidAmt,
                provisionsCount: violations.length,
                totalDrivers: drivers.length,
                policeStations: stations.size
            });

            setFineDistribution([
                { name: 'Paid Fine Amount (LKR)', value: paidAmt, color: '#20b2a0' },
                { name: 'Pending Fine Amount (LKR)', value: pendingAmt, color: '#e88025' }
            ]);

            setUserDistribution([
                { name: 'Number of Drivers', value: drivers.length, color: '#007bff' },
                { name: 'Number of Traffic Police Officers', value: officers.length, color: '#e05555' }
            ]);

            setMonthlyFines(updatedMonthly);

        } catch (err) {
            console.error("Dashboard agg error:", err);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/auth/login');
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
            id: 'officer-dashboard',
            label: 'Officer Dashboard',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                    <path d="M11 2v20c-5.07 0-9.44-3.39-10.8-8h2.1c1.23 3.48 4.54 6 8.35 6 4.97 0 9-4.03 9-9 0-4.63-3.5-8.44-8-8.94V1h2c5.52 0 10 4.48 10 10s-4.48 10-10 10V1h-2z"/>
                    <path d="M11 11.5v-1h-2v1h-2v2h2v1h2v-1h2v-2h-2z"/>
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
            id: 'add-oic',
            label: 'Add Oic',
            icon: <ShieldCheck size={22} />
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
        { id: 'view-all', label: 'View All Drivers', icon: <Users size={22} /> },
        { id: 'view-all-oic', label: 'View All Police Oic', icon: <ShieldCheck size={22} /> },
        { 
            id: 'violation-details', 
            label: 'Violation Details', 
            icon: (
                <svg viewBox="0 0 384 512" fill="currentColor" width="22" height="22">
                    <path d="M0 512V48C0 21.49 21.49 0 48 0h288c26.51 0 48 21.49 48 48v464L333.3 459.3C328.6 454.6 322.4 452 316 452S303.4 454.6 298.7 459.3L256 502.1L213.3 459.3C208.6 454.6 202.4 452 196 452S183.4 454.6 178.7 459.3L136 502.1L93.25 459.3C88.63 454.6 82.37 452 76 452S63.37 454.6 58.75 459.3L16 502.1C10.25 507.8 0 503.8 0 496zM112 368C112 376.8 119.2 384 128 384H256C264.8 384 272 376.8 272 368C272 359.2 264.8 352 256 352H128C119.2 352 112 359.2 112 368zM272 304C272 295.2 264.8 288 256 288H128C119.2 288 112 295.2 112 304C112 312.8 119.2 320 128 320H256C264.8 320 272 312.8 272 304zM272 240C272 231.2 264.8 224 256 224H128C119.2 224 112 231.2 112 240C112 248.8 119.2 256 128 256H256C264.8 256 272 248.8 272 240zM128 192H256C264.8 192 272 184.8 272 176C272 167.2 264.8 160 256 160H128C119.2 160 112 167.2 112 176C112 184.8 119.2 192 128 192zM272 112C272 103.2 264.8 96 256 96H128C119.2 96 112 103.2 112 112C112 120.8 119.2 128 128 128H256C264.8 128 272 120.8 272 112z"/>
                </svg>
            )
        },
        { 
            id: 'paid-fine-tickets', 
            label: 'Paid Fine Tickets', 
            icon: <CheckSquare size={22} /> 
        },
        { 
            id: 'pending-fine-tickets', 
            label: 'Pending Fine Tickets', 
            icon: <Pause size={22} /> 
        },
    ];

    const handleNav = (id) => {
        if (id === 'dashboard') navigate('/dashboard/admin');
        if (id === 'officer-dashboard') navigate('/dashboard/admin/officer-dashboard');
        if (id === 'add-traffic-officer') navigate('/dashboard/admin/add-traffic-officer');
        if (id === 'add-oic') navigate('/dashboard/admin/add-oic');
        if (id === 'view-all-traffic-officers') navigate('/dashboard/admin/view-all-traffic-officers');
        if (id === 'violation-details') navigate('/dashboard/admin/violation-details');
        if (id === 'paid-fine-tickets') navigate('/dashboard/admin/paid-fine-tickets');
        if (id === 'pending-fine-tickets') navigate('/dashboard/admin/pending-fine-tickets');
        if (id === 'view-all') navigate('/dashboard/admin/view-all-drivers');
        if (id === 'view-all-oic') navigate('/dashboard/admin/view-all-police-oic');
    };

    const sidebarWidth = sidebarOpen ? '220px' : '60px';

    return (
        <div className="min-h-screen flex bg-gray-100" style={{ fontFamily: "'Segoe UI', Roboto, sans-serif" }}>

            {/* ======== LEFT SIDEBAR ======== */}
            <aside style={{ 
                width: sidebarWidth, backgroundColor: '#0e2238', minHeight: '100vh',
                position: 'fixed', top: 0, left: 0, zIndex: 50, transition: 'width 0.25s ease', overflow: 'hidden'
            }} className="flex flex-col shadow-xl">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
                    width: '100%', padding: '16px 0', color: 'rgba(255,255,255,0.85)',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-start' : 'center',
                    paddingLeft: sidebarOpen ? '19px' : '0', gap: '12px', whiteSpace: 'nowrap',
                }} title="Toggle Menu">
                    <Menu size={22} style={{ flexShrink: 0 }} />
                </button>

                {navItems.map(item => (
                    <button key={item.id} onClick={() => handleNav(item.id)} title={item.label} style={{
                        width: '100%', padding: '14px 0', paddingLeft: sidebarOpen ? '18px' : '0',
                        color: activeNav === item.id ? '#ffffff' : 'rgba(255,255,255,0.6)',
                        backgroundColor: activeNav === item.id ? '#1a7a7a' : 'transparent',
                        border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
                        justifyContent: sidebarOpen ? 'flex-start' : 'center', gap: '14px',
                        transition: 'all 0.2s', whiteSpace: 'nowrap',
                    }} className="hover:bg-white/10">
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
            <div style={{ marginLeft: sidebarWidth, flex: 1, display: 'flex', flexDirection: 'column', transition: 'margin-left 0.25s ease' }}>

                {/* TOP NAV */}
                <nav style={{
                    backgroundColor: '#0e2238', height: '56px', display: 'flex', alignItems: 'center', 
                    justifyContent: 'space-between', padding: '0 20px', position: 'sticky', top: 0, 
                    zIndex: 40, boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ backgroundColor: 'white', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <i className="fas fa-car text-blue-600 text-lg"></i>
                        </div>
                        <span style={{ color: 'white', fontWeight: '800', fontSize: '18px', letterSpacing: '2px' }}>eTRAFFIC</span>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} style={{
                            display: 'flex', alignItems: 'center', gap: '6px', color: 'white', background: 'none', border: 'none',
                            cursor: 'pointer', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: '700',
                            letterSpacing: '1px', textTransform: 'uppercase',
                        }} className="hover:bg-white/10 transition-all">
                            SETTINGS <ChevronDown size={14} style={{ transform: isSettingsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                        </button>
                        {isSettingsOpen && (
                            <div style={{
                                position: 'absolute', right: 0, top: '110%', backgroundColor: 'white', borderRadius: '10px',
                                boxShadow: '0 8px 30px rgba(0,0,0,0.15)', border: '1px solid #e5e7eb', minWidth: '160px', padding: '6px 0', zIndex: 100
                            }}>
                                <button onClick={handleLogout} style={{
                                    width: '100%', textAlign: 'left', padding: '10px 16px', background: 'none', border: 'none', 
                                    cursor: 'pointer', color: '#ef4444', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px'
                                }} className="hover:bg-red-50 transition-colors">
                                    <LogOut size={14} /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </nav>

                {/* PAGE CONTENT */}
                <div style={{ padding: '20px', flex: 1 }}>

                    {/* Account Holder Badge */}
                    <div style={{ display: 'inline-block', backgroundColor: '#f8f9fa', border: '1px solid #e2e8f0', borderRadius: '50px', padding: '8px 18px', marginBottom: '20px', fontSize: '13px', fontWeight: '600', color: '#374151' }}>
                        Account Holder : Motor Traffic Department
                    </div>

                    {/* ======== STAT CARDS ======== */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px' }}>

                        {/* Card 1 - Red - Traffic Officer Count */}
                        <Card bgColor="#e05555" count={stats.officerCount} label="Traffic Officer Count" shadow="rgba(224,85,85,0.35)">
                            <Users size={48} />
                        </Card>

                        {/* Card 2 - Orange - Pending Fine Amount */}
                        <Card bgColor="#e88025" count={stats.pendingAmount.toFixed(2)} label="Pending Fine Amount (LKR)" shadow="rgba(232,128,37,0.35)">
                            <Pause size={48} />
                        </Card>

                        {/* Card 3 - Teal - Paid Fine Amount */}
                        <Card bgColor="#20b2a0" count={stats.paidAmount.toFixed(2)} label="Paid Fine Amount (LKR)" shadow="rgba(32,178,160,0.35)">
                            <CheckSquare size={48} />
                        </Card>

                        {/* Card 4 - Purple - Provisions Count */}
                        <Card bgColor="#6b3fa0" count={stats.provisionsCount} label="Provisions Count" shadow="rgba(107,63,160,0.35)">
                            <Layers size={48} />
                        </Card>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                        {/* Card 5 - Blue - Total Drivers */}
                        <Card bgColor="#007bff" count={stats.totalDrivers} label="Total Drivers Count" shadow="rgba(0,123,255,0.35)">
                            <Users size={48} />
                        </Card>

                        {/* Card 6 - Green - Police Stations */}
                        <Card bgColor="#28a745" count={stats.policeStations} label="Total Police Station" shadow="rgba(40,167,69,0.35)">
                            <Landmark size={48} />
                        </Card>
                    </div>

                    {/* ======== CHARTS SECTION ======== */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                        
                        {/* Pie Chart 1 - Fine Distribution */}
                        <ChartContainer title="Pending Fine and Paid Fine Amount">
                            <ResponsiveContainer width="100%" height={280}>
                                <PieChart>
                                    <Pie data={fineDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                                        {fineDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="top" height={36}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>

                        {/* Pie Chart 2 - User Distribution */}
                        <ChartContainer title="Total Driver Count and TPO Count">
                            <ResponsiveContainer width="100%" height={280}>
                                <PieChart>
                                    <Pie data={userDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                                        {userDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="top" height={36}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </div>

                    {/* Bar Chart - Monthly Fines */}
                    <ChartContainer title="Number of Issued Fine 2026">
                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart data={monthlyFines}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                <YAxis tick={{ fontSize: 11 }} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#28a745" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>

                </div>
            </div>
        </div>
    );
}

function Card({ bgColor, count, label, shadow, children }) {
    return (
        <div style={{
            backgroundColor: bgColor, borderRadius: '10px', padding: '24px 20px',
            textAlign: 'center', color: 'white', boxShadow: `0 4px 15px ${shadow}`,
            transition: 'transform 0.2s', cursor: 'pointer'
        }} className="hover:scale-105">
            <div style={{ marginBottom: '8px', opacity: 0.85, display: 'flex', justifyContent: 'center' }}>
                {children}
            </div>
            <h3 style={{ fontSize: '36px', fontWeight: '800', margin: '0 0 4px 0' }}>{count}</h3>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: '500', opacity: 0.9 }}>{label}</p>
        </div>
    );
}

function ChartContainer({ title, children }) {
    return (
        <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', textAlign: 'center', marginBottom: '15px' }}>{title}</h3>
            {children}
        </div>
    );
}
