import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Menu, UserPlus, Users, ChevronDown, LogOut,
    Bell
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
        { id: 'view-all', label: 'View All Drivers', icon: <Users size={22} /> },
    ];

    const handleNav = (id) => {
        if (id === 'dashboard') navigate('/dashboard/admin');
        if (id === 'add-traffic-officer') navigate('/dashboard/admin/add-traffic-officer');
        if (id === 'view-all') navigate('/dashboard/admin/view-all-drivers');
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Here you will handle API submission for adding a traffic officer.
        // For now preventing default and logging
        console.log("Form Submitted", formData);
        alert("Traffic Officer Added Successfully! (API integration pending)");
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
                        <div style={{ backgroundColor: '#dc2626', padding: '5px 7px', borderRadius: '6px', display: 'flex', alignItems: 'center' }}>
                            <Bell size={16} fill="white" color="white" />
                        </div>
                        <span style={{ color: 'white', fontWeight: '800', fontSize: '18px', letterSpacing: '2px' }}>STFMS</span>
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
                                        placeholder="Driver Password"  // Keeping as requested placeholder from image
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
