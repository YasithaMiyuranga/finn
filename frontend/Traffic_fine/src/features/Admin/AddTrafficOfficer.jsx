import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Menu, UserPlus, Users, ChevronDown, LogOut,
    Bell, CheckSquare, Pause, ShieldCheck
} from 'lucide-react';

export default function AddTrafficOfficer() {
    const navigate = useNavigate();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [formData, setFormData] = useState({
        officerId: '',
        officerEmail: '',
        officerPassword: '',
        confirmPassword: '',
        officerName: '',
        policeStation: '',
        court: '',
    });

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
        { id: 'view-all-drivers', label: 'View All Drivers', icon: <Users size={22} /> },
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
        if (id === 'add-traffic-officer') navigate('/dashboard/admin/add-traffic-officer');
        if (id === 'add-oic') navigate('/dashboard/admin/add-oic');
        if (id === 'view-all-traffic-officers') navigate('/dashboard/admin/view-all-traffic-officers');
        if (id === 'violation-details') navigate('/dashboard/admin/violation-details');
        if (id === 'view-all-drivers') navigate('/dashboard/admin/view-all-drivers');
        if (id === 'view-all-oic') navigate('/dashboard/admin/view-all-police-oic');
        if (id === 'paid-fine-tickets') navigate('/dashboard/admin/paid-fine-tickets');
        if (id === 'pending-fine-tickets') navigate('/dashboard/admin/pending-fine-tickets');
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.officerPassword !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            // 1. Create User
            const authRes = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.officerEmail,
                    password: formData.officerPassword,
                    confirmPassword: formData.confirmPassword,
                    userType: "POLICEOFFICERS"
                }),
            });
            const authData = await authRes.json();
            
            if (!authRes.ok || !authData.success) {
                const errorMsg = typeof authData.data === 'string' ? authData.data : 
                                 (authData.data?.email ? authData.data.email : authData.message);
                alert("Failed to create user account: " + (errorMsg || "Unknown error"));
                return;
            }
            
            const userId = authData.data;

            // 2. Add Traffic Officer Profile
            const token = localStorage.getItem("token");
            const officerRes = await fetch("http://localhost:8080/api/police_officers/savePoliceOfficer", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    policeid: parseInt(formData.officerId),
                    fullName: formData.officerName,
                    policeStation: formData.policeStation,
                    court: formData.court,
                    userId: userId
                }),
            });
            const officerData = await officerRes.json();

            if (officerRes.ok && officerData.success) {
                alert("Traffic Officer Added Successfully!");
                setFormData({
                    officerId: '',
                    officerEmail: '',
                    officerPassword: '',
                    confirmPassword: '',
                    officerName: '',
                    policeStation: '',
                    court: '',
                });
                navigate('/dashboard/admin/view-all-traffic-officers');
            } else {
                alert("Failed to save officer details: " + (officerData.message || "Unknown error"));
            }
        } catch (error) {
            console.error("Error adding traffic officer:", error);
            alert("An error occurred while adding the traffic officer");
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

                {/* Hamburger */}
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
                        color: item.id === 'add-traffic-officer' ? '#ffffff' : 'rgba(255,255,255,0.6)',
                        backgroundColor: item.id === 'add-traffic-officer' ? '#1a7a7a' : 'transparent',
                        border: 'none', cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: sidebarOpen ? 'flex-start' : 'center',
                        gap: '14px', transition: 'all 0.2s', whiteSpace: 'nowrap',
                    }} className="hover:bg-white/10">
                        <span style={{ flexShrink: 0 }}>{item.icon}</span>
                        {sidebarOpen && (
                            <span style={{ fontSize: '14px', fontWeight: '500', color: item.id === 'add-traffic-officer' ? '#fff' : 'rgba(255,255,255,0.8)' }}>
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

                    {/* Title + Breadcrumb */}
                    <h1 style={{ fontSize: '28px', fontWeight: '400', color: '#1e293b', marginBottom: '6px' }}>Add Traffic Officer</h1>
                    
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
                        <span>Add Traffic Officer</span>
                    </div>

                    {/* Card */}
                    <div style={{ backgroundColor: 'white', borderRadius: '0.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.12)', border: '1px solid #e5e7eb', padding: '3rem' }}>
                        
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            
                            {/* Row 1 */}
                            <div style={{ display: 'flex', gap: '2rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1rem', color: '#212529' }}>Traffic Officer ID</label>
                                    <input 
                                        type="text" 
                                        name="officerId" 
                                        value={formData.officerId} 
                                        onChange={handleInputChange} 
                                        placeholder="Traffic Officer ID" 
                                        style={{ width: '100%', padding: '0.375rem 0.75rem', fontSize: '1rem', lineHeight: 1.5, color: '#495057', backgroundColor: '#fff', border: '1px solid #ced4da', borderRadius: '0.25rem', outline: 'none' }} 
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1rem', color: '#212529' }}>Traffic Officer Email</label>
                                    <input 
                                        type="email" 
                                        name="officerEmail" 
                                        value={formData.officerEmail} 
                                        onChange={handleInputChange} 
                                        placeholder="Traffic Officer Email" 
                                        style={{ width: '100%', padding: '0.375rem 0.75rem', fontSize: '1rem', lineHeight: 1.5, color: '#495057', backgroundColor: '#fff', border: '1px solid #ced4da', borderRadius: '0.25rem', outline: 'none' }} 
                                    />
                                </div>
                            </div>

                            {/* Row 2 */}
                            <div style={{ display: 'flex', gap: '2rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1rem', color: '#212529' }}>Traffic Officer Password</label>
                                    <input 
                                        type="password" 
                                        name="officerPassword" 
                                        value={formData.officerPassword} 
                                        onChange={handleInputChange} 
                                        placeholder="Traffic Officer Password" 
                                        style={{ width: '100%', padding: '0.375rem 0.75rem', fontSize: '1rem', lineHeight: 1.5, color: '#495057', backgroundColor: '#fff', border: '1px solid #ced4da', borderRadius: '0.25rem', outline: 'none' }} 
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1rem', color: '#212529' }}>Confirm Password</label>
                                    <input 
                                        type="password" 
                                        name="confirmPassword" 
                                        value={formData.confirmPassword} 
                                        onChange={handleInputChange} 
                                        placeholder="Confirm Password" 
                                        style={{ width: '100%', padding: '0.375rem 0.75rem', fontSize: '1rem', lineHeight: 1.5, color: '#495057', backgroundColor: '#fff', border: '1px solid #ced4da', borderRadius: '0.25rem', outline: 'none' }} 
                                    />
                                </div>
                            </div>

                            {/* Row 3 */}
                            <div style={{ display: 'flex', gap: '2rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1rem', color: '#212529' }}>Traffic Officer Name</label>
                                    <input 
                                        type="text" 
                                        name="officerName" 
                                        value={formData.officerName} 
                                        onChange={handleInputChange} 
                                        placeholder="Traffic Officer Name" 
                                        style={{ width: '100%', padding: '0.375rem 0.75rem', fontSize: '1rem', lineHeight: 1.5, color: '#495057', backgroundColor: '#fff', border: '1px solid #ced4da', borderRadius: '0.25rem', outline: 'none' }} 
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1rem', color: '#212529' }}>Police Station</label>
                                    <input 
                                        type="text" 
                                        name="policeStation" 
                                        value={formData.policeStation} 
                                        onChange={handleInputChange} 
                                        placeholder="Police Station" 
                                        style={{ width: '100%', padding: '0.375rem 0.75rem', fontSize: '1rem', lineHeight: 1.5, color: '#495057', backgroundColor: '#fff', border: '1px solid #ced4da', borderRadius: '0.25rem', outline: 'none' }} 
                                    />
                                </div>
                            </div>

                            {/* Row 4 */}
                            <div style={{ display: 'flex', gap: '2rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1rem', color: '#212529' }}>Court</label>
                                    <input 
                                        type="text" 
                                        name="court" 
                                        value={formData.court} 
                                        onChange={handleInputChange} 
                                        placeholder="Court" 
                                        style={{ width: '100%', padding: '0.375rem 0.75rem', fontSize: '1rem', lineHeight: 1.5, color: '#495057', backgroundColor: '#fff', border: '1px solid #ced4da', borderRadius: '0.25rem', outline: 'none' }} 
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1rem', color: '#212529' }}>Registered Date</label>
                                    <input 
                                        type="date" 
                                        value={todayDate} 
                                        disabled 
                                        style={{ width: '100%', padding: '0.375rem 0.75rem', fontSize: '1rem', lineHeight: 1.5, color: '#495057', backgroundColor: '#e9ecef', border: '1px solid #ced4da', borderRadius: '0.25rem', outline: 'none', cursor: 'not-allowed' }} 
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button type="submit" style={{ backgroundColor: '#007bff', color: '#fff', border: '1px solid #007bff', borderRadius: '0.25rem', padding: '0.375rem 0.75rem', fontSize: '1rem', lineHeight: 1.5, cursor: 'pointer', transition: 'color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out' }} onMouseOver={(e) => e.target.style.backgroundColor='#0069d9'} onMouseOut={(e) => e.target.style.backgroundColor='#007bff'}>
                                    Add Traffic Officer
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}
