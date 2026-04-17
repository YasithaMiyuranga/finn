import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Menu, Users, ChevronDown, LogOut,
    Bell, CheckSquare, Pause, ShieldCheck, MapPin
} from 'lucide-react';

export default function AddOic() {
    const navigate = useNavigate();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [formData, setFormData] = useState({
        policeid: '',
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        officerRank: '',
        province: '',
        district: '',
        city: ''
    });

    const provinceToDistricts = {
        'Central': ['Kandy', 'Matale', 'Nuwara Eliya'],
        'Eastern': ['Ampara', 'Batticaloa', 'Trincomalee'],
        'North_Central': ['Anuradhapura', 'Polonnaruwa'],
        'Northern': ['Jaffna', 'Kilinochchi', 'Mannar', 'Mullaitivu', 'Vavuniya'],
        'North_Western': ['Kurunegala', 'Puttalam'],
        'Sabaragamuwa': ['Kegalle', 'Ratnapura'],
        'Southern': ['Galle', 'Hambantota', 'Matara'],
        'Uva': ['Badulla', 'Moneragala'],
        'Western': ['Colombo', 'Gampaha', 'Kalutara']
    };

    const provinces = Object.keys(provinceToDistricts);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/auth/login');
    };

    const navItems = [
        {
            id: 'dashboard', label: 'Dashboard',
            icon: <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
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
            label: 'Add Police Oic',
            icon: <ShieldCheck size={22} />
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
        { id: 'paid-fine-tickets', label: 'Paid Fine Tickets', icon: <CheckSquare size={22} /> },
        { id: 'pending-fine-tickets', label: 'Pending Fine Tickets', icon: <Pause size={22} /> },
    ];

    const handleNav = (id) => {
        if (id === 'dashboard') navigate('/dashboard/admin');
        if (id === 'officer-dashboard') navigate('/dashboard/admin/officer-dashboard');
        if (id === 'add-traffic-officer') navigate('/dashboard/admin/add-traffic-officer');
        if (id === 'add-oic') navigate('/dashboard/admin/add-oic');
        if (id === 'view-all-traffic-officers') navigate('/dashboard/admin/view-all-traffic-officers');
        if (id === 'view-all-oic') navigate('/dashboard/admin/view-all-police-oic');
        if (id === 'violation-details') navigate('/dashboard/admin/violation-details');
        if (id === 'view-all') navigate('/dashboard/admin/view-all-drivers');
        if (id === 'paid-fine-tickets') navigate('/dashboard/admin/paid-fine-tickets');
        if (id === 'pending-fine-tickets') navigate('/dashboard/admin/pending-fine-tickets');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'province') {
            setFormData({ ...formData, province: value, district: '' });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8080/api/police_oic/savePoliceOIC", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    policeid: parseInt(formData.policeid),
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                    officerRank: formData.officerRank,
                    province: formData.province,
                    district: formData.district,
                    city: formData.city
                }),
            });
            const data = await response.json();

            if (response.ok && data.success) {
                alert("Police OIC Added Successfully!");
                setFormData({
                    policeid: '',
                    fullName: '',
                    email: '',
                    phone: '',
                    password: '',
                    confirmPassword: '',
                    officerRank: '',
                    province: '',
                    district: '',
                    city: ''
                });
            } else {
                alert("Failed: " + (data.message || "Unknown error"));
            }
        } catch (error) {
            console.error("Error adding OIC:", error);
            alert("An error occurred while adding the OIC");
        }
    };

    const sidebarWidth = sidebarOpen ? '220px' : '60px';
    const todayDate = new Date().toISOString().split('T')[0];

    return (
        <div className="min-h-screen flex bg-gray-100" style={{ fontFamily: "'Segoe UI', Roboto, sans-serif" }}>

            {/* ======== SIDEBAR ======== */}
            <aside style={{
                width: sidebarWidth, backgroundColor: '#0e2238',
                minHeight: '100vh', position: 'fixed', top: 0, left: 0,
                zIndex: 50, transition: 'width 0.25s ease', overflow: 'hidden'
            }} className="flex flex-col shadow-xl">

                <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
                    width: '100%', padding: '16px 0', color: 'rgba(255,255,255,0.85)',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center',
                    justifyContent: sidebarOpen ? 'flex-start' : 'center',
                    paddingLeft: sidebarOpen ? '19px' : '0', gap: '12px', whiteSpace: 'nowrap',
                }} title="Toggle Menu">
                    <Menu size={22} style={{ flexShrink: 0 }} />
                </button>

                {navItems.map(item => (
                    <button key={item.id} onClick={() => handleNav(item.id)} title={item.label} style={{
                        width: '100%', padding: '14px 0',
                        paddingLeft: sidebarOpen ? '18px' : '0',
                        color: item.id === 'add-oic' ? '#ffffff' : 'rgba(255,255,255,0.6)',
                        backgroundColor: item.id === 'add-oic' ? '#1a7a7a' : 'transparent',
                        border: 'none', cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: sidebarOpen ? 'flex-start' : 'center',
                        gap: '14px', transition: 'all 0.2s', whiteSpace: 'nowrap',
                    }} className="hover:bg-white/10">
                        <span style={{ flexShrink: 0 }}>{item.icon}</span>
                        {sidebarOpen && (
                            <span style={{ fontSize: '14px', fontWeight: '500', color: item.id === 'add-oic' ? '#fff' : 'rgba(255,255,255,0.8)' }}>
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
                    backgroundColor: '#0e2238', height: '56px', display: 'flex',
                    alignItems: 'center', justifyContent: 'space-between',
                    padding: '0 20px', position: 'sticky', top: 0, zIndex: 40,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ backgroundColor: 'white', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <i className="fas fa-car text-blue-600 text-lg"></i>
                        </div>
                        <span style={{ color: 'white', fontWeight: '800', fontSize: '18px', letterSpacing: '2px' }}>eTRAFFIC</span>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} style={{
                            display: 'flex', alignItems: 'center', gap: '6px', color: 'white',
                            background: 'none', border: 'none', cursor: 'pointer', padding: '6px 12px',
                            borderRadius: '6px', fontSize: '13px', fontWeight: '700',
                            letterSpacing: '1px', textTransform: 'uppercase',
                        }} className="hover:bg-white/10 transition-all">
                            SETTINGS <ChevronDown size={14} style={{ transform: isSettingsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                        </button>
                        {isSettingsOpen && (
                            <div style={{
                                position: 'absolute', right: 0, top: '110%', backgroundColor: 'white',
                                borderRadius: '10px', boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                                border: '1px solid #e5e7eb', minWidth: '160px', padding: '6px 0', zIndex: 100
                            }}>
                                <button onClick={handleLogout} style={{
                                    width: '100%', textAlign: 'left', padding: '10px 16px',
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: '#ef4444', fontSize: '14px', fontWeight: '600',
                                    display: 'flex', alignItems: 'center', gap: '8px'
                                }} className="hover:bg-red-50 transition-colors">
                                    <LogOut size={14} /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </nav>

                {/* PAGE CONTENT */}
                <div style={{ padding: '24px' }}>

                    <h1 style={{ fontSize: '28px', fontWeight: '400', color: '#1e293b', marginBottom: '6px' }}>Add Police OIC</h1>
                    
                    <div style={{ 
                        backgroundColor: '#e9ecef', 
                        padding: '12px 16px',
                        borderRadius: '0.25rem',
                        display: 'flex', 
                        gap: '6px', 
                        color: '#6c757d', 
                        fontSize: '15px', 
                        marginBottom: '24px' 
                    }}>
                        <button onClick={() => navigate('/dashboard/admin')} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', padding: 0, fontSize: '15px' }}>
                            Dashboard
                        </button>
                        <span>/</span>
                        <span>Add Police OIC</span>
                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                        <form onSubmit={handleSubmit}>
                            {/* Form Body */}
                            <div style={{ padding: '24px', borderBottom: '1px solid #f3f4f6' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Service Number</label>
                                        <input type="text" name="policeid" value={formData.policeid} onChange={handleInputChange} placeholder="Ex: 504030" style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none' }} required />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Full Name</label>
                                        <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="OIC Name" style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none' }} required />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>OIC Email</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="email@example.com" style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none' }} required />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Phone Number</label>
                                        <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="07XXXXXXXX" style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none' }} required />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Password</label>
                                        <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="********" style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none' }} required />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Confirm Password</label>
                                        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} placeholder="********" style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none' }} required />
                                    </div>
                                </div>
                            </div>

                            {/* Police Station Details Section */}
                            <div style={{ padding: '24px', backgroundColor: '#fafafa', borderBottom: '1px solid #f3f4f6' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: '#1f2937' }}>
                                    <MapPin size={20} className="text-green-600" />
                                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Police Station Details</h3>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Officer Rank</label>
                                        <select name="officerRank" value={formData.officerRank} onChange={handleInputChange} style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none', backgroundColor: 'white' }} required>
                                            <option value="">Select Rank</option>
                                            <option value="IP">IP</option>
                                            <option value="CI">CI</option>
                                            <option value="ASP">ASP</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Province</label>
                                        <select name="province" value={formData.province} onChange={handleInputChange} style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none', backgroundColor: 'white' }} required>
                                            <option value="">Select Province</option>
                                            {provinces.map(p => <option key={p} value={p}>{p.replace('_', ' ')}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>District</label>
                                        <select name="district" value={formData.district} onChange={handleInputChange} style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none', backgroundColor: 'white' }} required disabled={!formData.province}>
                                            <option value="">Select District</option>
                                            {(provinceToDistricts[formData.province] || []).map(d => (
                                                <option key={d} value={d}>{d}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>City</label>
                                        <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Ex: Pettah" style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none' }} required />
                                    </div>
                                </div>
                            </div>

                            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ maxWidth: '300px' }}>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Registered Date</label>
                                    <input type="date" value={todayDate} disabled style={{ width: '100%', padding: '10px 12px', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', color: '#6b7280' }} />
                                </div>

                                <div style={{ textAlign: 'left', marginTop: '10px' }}>
                                    <button type="submit" style={{ backgroundColor: '#2563eb', color: 'white', padding: '12px 32px', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={(e) => e.target.style.backgroundColor='#1d4ed8'} onMouseOut={(e) => e.target.style.backgroundColor='#2563eb'}>
                                        Add Police Oic
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}
