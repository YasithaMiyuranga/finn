import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Menu, Users, ChevronDown, LogOut,
    Bell, Pencil, Trash2
} from 'lucide-react';

export default function ProvisionsDetails() {
    const navigate = useNavigate();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [provisions, setProvisions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false); // Make it false initially as we use dummy data

    const [formData, setFormData] = useState({
        fineId: '',
        sectionOfAct: '',
        provision: '',
        fineAmount: ''
    });

    // We can seed dummy data to look like the PHP screenshot
    useEffect(() => {
        setProvisions([
            { fineId: 100, sectionOfAct: 'Section 32', provision: 'Revenue License to be displayed on motor vehicles and produced when required.', fineAmount: '1500.00' },
            { fineId: 102, sectionOfAct: 'Section 128B', provision: 'Driving a special purpose vehicle without obtaining a licence.', fineAmount: '1000.00' },
            { fineId: 103, sectionOfAct: 'Section 128A', provision: 'Failure to obtain authorization to drive a vehicle loaded with chemicals, hazardous waste, &e.', fineAmount: '2000.00' },
            { fineId: 104, sectionOfAct: 'section 130', provision: 'Failure to have a Licence to drive a specific class of vehicles.', fineAmount: '1000.00' },
            { fineId: 105, sectionOfAct: 'Section 135', provision: 'Failure to carry a Driving Licence when driving.', fineAmount: '2000.00' },
        ]);
    }, []);

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
            id: 'view-all-traffic-officers', 
            label: 'View All Traffic Officers', 
            icon: (
                <svg viewBox="0 0 640 512" fill="currentColor" width="22" height="22">
                    <path d="M416 224c0-53-43-96-96-96s-96 43-96 96 43 96 96 96 96-43 96-96zm-171.7-86.3C213.6 109 177.3 96 144 96c-53 0-96 43-96 96s43 96 96 96c21.2 0 40.5-6.9 56.4-18.5-8.2-18.7-12.4-39-12.4-60.5 0-33 11.2-63.5 30.3-87.3zM224 352c-70.7 0-128 57.3-128 128 0 17.7 14.3 32 32 32h275.6c11.7-32.5 35.8-59 66.4-71.8V384h-.3c-11.4-19-31.5-32-54.1-32h-191.6zm403.9-39.7c2.4 12.8 2.4 25.8 0 38.6l32 25c2.9 2.2 3.6 6.2 1.6 9.4l-30.2 52.3c-2 3.5-6.4 4.8-10.1 3.5l-37.6-15.1c-11.8 9.5-25 17-39.2 22.2l-5.7 40C531.3 491.5 528 494 524 494h-60.4c-4 0-7.3-2.5-7.7-6.2l-5.7-40c-14.2-5.2-27.4-12.7-39.2-22.2l-37.6 15.1c-3.7 1.3-8.1 0-10.1-3.5l-30.2-52.3c-2-3.2-1.2-7.2 1.6-9.4l32-25c-2.4-12.8-2.4-25.8 0-38.6l-32-25c-2.9-2.2-3.6-6.2-1.6-9.4l30.2-52.3c2-3.5 6.4-4.8 10.1-3.5l37.6 15.1c11.8-9.5 25-17 39.2-22.2l5.7-40c.4-3.7 3.7-6.2 7.7-6.2h60.4c4 0 7.3 2.5 7.7 6.2l5.7 40c14.2 5.2 27.4 12.7 39.2 22.2l37.6-15.1c3.7-1.3 8.1 0 10.1 3.5l30.2 52.3c2 3.2 1.2 7.2-1.6 9.4l-32 25zM493.8 450c18.5 0 33.6-15.1 33.6-33.6s-15.1-33.6-33.6-33.6-33.6 15.1-33.6 33.6 15.1 33.6 33.6 33.6z"/>
                </svg>
            )
        },
        { 
            id: 'provisions-details', 
            label: 'Provisions Details', 
            icon: (
                <svg viewBox="0 0 384 512" fill="currentColor" width="22" height="22">
                    <path d="M0 512V48C0 21.49 21.49 0 48 0h288c26.51 0 48 21.49 48 48v464L333.3 459.3C328.6 454.6 322.4 452 316 452S303.4 454.6 298.7 459.3L256 502.1L213.3 459.3C208.6 454.6 202.4 452 196 452S183.4 454.6 178.7 459.3L136 502.1L93.25 459.3C88.63 454.6 82.37 452 76 452S63.37 454.6 58.75 459.3L16 502.1C10.25 507.8 0 503.8 0 496zM112 368C112 376.8 119.2 384 128 384H256C264.8 384 272 376.8 272 368C272 359.2 264.8 352 256 352H128C119.2 352 112 359.2 112 368zM272 304C272 295.2 264.8 288 256 288H128C119.2 288 112 295.2 112 304C112 312.8 119.2 320 128 320H256C264.8 320 272 312.8 272 304zM272 240C272 231.2 264.8 224 256 224H128C119.2 224 112 231.2 112 240C112 248.8 119.2 256 128 256H256C264.8 256 272 248.8 272 240zM128 192H256C264.8 192 272 184.8 272 176C272 167.2 264.8 160 256 160H128C119.2 160 112 167.2 112 176C112 184.8 119.2 192 128 192zM272 112C272 103.2 264.8 96 256 96H128C119.2 96 112 103.2 112 112C112 120.8 119.2 128 128 128H256C264.8 128 272 120.8 272 112z"/>
                </svg>
            )
        },
        { id: 'view-all', label: 'View All Drivers', icon: <Users size={22} /> },
    ];

    const handleNav = (id) => {
        if (id === 'dashboard') navigate('/dashboard/admin');
        if (id === 'add-traffic-officer') navigate('/dashboard/admin/add-traffic-officer');
        if (id === 'view-all-traffic-officers') navigate('/dashboard/admin/view-all-traffic-officers');
        if (id === 'provisions-details') navigate('/dashboard/admin/provisions-details');
        if (id === 'view-all') navigate('/dashboard/admin/view-all-drivers');
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddFineTicket = (e) => {
        e.preventDefault();
        alert("Fine Ticket Provision Added! (Backend integration pending)");
        setProvisions([...provisions, formData]);
        setFormData({
            fineId: '',
            sectionOfAct: '',
            provision: '',
            fineAmount: ''
        });
    };

    const filteredProvisions = (provisions || []).filter(p =>
        String(p.fineId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(p.sectionOfAct || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(p.provision || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sidebarWidth = sidebarOpen ? '220px' : '60px';

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
                        color: item.id === 'provisions-details' ? '#ffffff' : 'rgba(255,255,255,0.6)',
                        backgroundColor: item.id === 'provisions-details' ? '#1a7a7a' : 'transparent',
                        border: 'none', cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: sidebarOpen ? 'flex-start' : 'center',
                        gap: '14px', transition: 'all 0.2s', whiteSpace: 'nowrap',
                    }} className="hover:bg-white/10">
                        <span style={{ flexShrink: 0 }}>{item.icon}</span>
                        {sidebarOpen && (
                            <span style={{ fontSize: '14px', fontWeight: '500', color: item.id === 'provisions-details' ? '#fff' : 'rgba(255,255,255,0.8)' }}>
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
                    <h1 style={{ fontSize: '28px', fontWeight: '400', color: '#1e293b', marginBottom: '6px' }}>Provisions Details</h1>
                    
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
                        <span>Provisions Details</span>
                    </div>

                    {/* Add Details Card */}
                    <div style={{ backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.07)', border: '1px solid #e5e7eb', overflow: 'hidden', marginBottom: '32px' }}>
                        <div style={{ padding: '14px 20px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <svg viewBox="0 0 384 512" fill="currentColor" width="16" height="16" style={{ color: '#374151' }}>
                                <path d="M0 512V48C0 21.49 21.49 0 48 0h288c26.51 0 48 21.49 48 48v464L333.3 459.3C328.6 454.6 322.4 452 316 452S303.4 454.6 298.7 459.3L256 502.1L213.3 459.3C208.6 454.6 202.4 452 196 452S183.4 454.6 178.7 459.3L136 502.1L93.25 459.3C88.63 454.6 82.37 452 76 452S63.37 454.6 58.75 459.3L16 502.1C10.25 507.8 0 503.8 0 496zM112 368C112 376.8 119.2 384 128 384H256C264.8 384 272 376.8 272 368C272 359.2 264.8 352 256 352H128C119.2 352 112 359.2 112 368zM272 304C272 295.2 264.8 288 256 288H128C119.2 288 112 295.2 112 304C112 312.8 119.2 320 128 320H256C264.8 320 272 312.8 272 304zM272 240C272 231.2 264.8 224 256 224H128C119.2 224 112 231.2 112 240C112 248.8 119.2 256 128 256H256C264.8 256 272 248.8 272 240zM128 192H256C264.8 192 272 184.8 272 176C272 167.2 264.8 160 256 160H128C119.2 160 112 167.2 112 176C112 184.8 119.2 192 128 192zM272 112C272 103.2 264.8 96 256 96H128C119.2 96 112 103.2 112 112C112 120.8 119.2 128 128 128H256C264.8 128 272 120.8 272 112z"/>
                            </svg>
                            <span style={{ fontSize: '15px', color: '#1f2937', fontWeight: 600 }}>Add a Provision Details</span>
                        </div>

                        <div style={{ padding: '2rem' }}>
                            <form onSubmit={handleAddFineTicket} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {/* Row 1 */}
                                <div style={{ display: 'flex', gap: '2rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1rem', color: '#212529' }}>Provision ID</label>
                                        <input 
                                            type="text" 
                                            name="fineId" 
                                            value={formData.fineId} 
                                            onChange={handleInputChange} 
                                            placeholder="Provision ID" 
                                            style={{ width: '100%', padding: '0.375rem 0.75rem', fontSize: '1rem', lineHeight: 1.5, color: '#495057', backgroundColor: '#fff', border: '1px solid #ced4da', borderRadius: '0.25rem', outline: 'none' }} 
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1rem', color: '#212529' }}>Section of Act</label>
                                        <input 
                                            type="text" 
                                            name="sectionOfAct" 
                                            value={formData.sectionOfAct} 
                                            onChange={handleInputChange} 
                                            placeholder="Section of Act" 
                                            style={{ width: '100%', padding: '0.375rem 0.75rem', fontSize: '1rem', lineHeight: 1.5, color: '#495057', backgroundColor: '#fff', border: '1px solid #ced4da', borderRadius: '0.25rem', outline: 'none' }} 
                                        />
                                    </div>
                                </div>

                                {/* Row 2 */}
                                <div style={{ display: 'flex', gap: '2rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1rem', color: '#212529' }}>Provision</label>
                                        <input 
                                            type="text" 
                                            name="provision" 
                                            value={formData.provision} 
                                            onChange={handleInputChange} 
                                            placeholder="Provision" 
                                            style={{ width: '100%', padding: '0.375rem 0.75rem', fontSize: '1rem', lineHeight: 1.5, color: '#495057', backgroundColor: '#fff', border: '1px solid #ced4da', borderRadius: '0.25rem', outline: 'none' }} 
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1rem', color: '#212529' }}>Fine Amount</label>
                                        <input 
                                            type="number" 
                                            name="fineAmount" 
                                            value={formData.fineAmount} 
                                            onChange={handleInputChange} 
                                            placeholder="Fine Amount" 
                                            style={{ width: '100%', padding: '0.375rem 0.75rem', fontSize: '1rem', lineHeight: 1.5, color: '#495057', backgroundColor: '#fff', border: '1px solid #ced4da', borderRadius: '0.25rem', outline: 'none' }} 
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div>
                                    <button type="submit" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#0d6efd', color: '#fff', border: '1px solid #0d6efd', borderRadius: '0.25rem', padding: '0.375rem 0.75rem', fontSize: '1rem', lineHeight: 1.5, cursor: 'pointer', transition: 'all .15s ease-in-out' }} onMouseOver={(e) => e.target.style.backgroundColor='#0b5ed7'} onMouseOut={(e) => e.target.style.backgroundColor='#0d6efd'}>
                                        <svg viewBox="0 0 512 512" fill="white" width="14" height="14"><path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0 0 114.6 0 256s114.6 256 256 256zm-16-160v-80H160c-8.8 0-16-7.2-16-16v-16c0-8.8 7.2-16 16-16h80v-80c0-8.8 7.2-16 16-16h16c8.8 0 16 7.2 16 16v80h80c8.8 0 16 7.2 16 16v16c0 8.8-7.2 16-16 16h-80v80c0 8.8-7.2 16-16 16h-16c-8.8 0-16-7.2-16-16z"/></svg>
                                        Add Fine Ticket
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Table Card */}
                    <div style={{ backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.07)', border: '1px solid #e5e7eb', overflow: 'hidden' }}>

                        {/* Card Header */}
                        <div style={{ padding: '14px 20px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style={{ color: '#1f2937' }}>
                                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
                            </svg>
                            <span style={{ fontSize: '15px', color: '#1f2937', fontWeight: 600 }}>All Fine Tickets Details</span>
                        </div>

                        {/* Export Buttons */}
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {[
                                    { label: 'CSV', color: '#007bff', icon: '📄' },
                                    { label: 'Excel', color: '#28a745', icon: '📊' },
                                    { label: 'PDF', color: '#dc3545', icon: '📕' },
                                    { label: 'Print', color: '#343a40', icon: '🖨️' },
                                ].map(btn => (
                                    <button key={btn.label} style={{
                                        backgroundColor: btn.color, color: 'white', border: 'none',
                                        borderRadius: '0.25rem', padding: '0.375rem 0.75rem', fontSize: '0.875rem',
                                        fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                                    }} className="hover:opacity-90 transition-opacity">
                                        <span style={{ fontSize: '14px', marginRight: '4px' }}>{btn.icon}</span> {btn.label}
                                    </button>
                                ))}
                            </div>

                            {/* Search */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '14px', color: '#212529' }}>Search:</span>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        style={{
                                            border: '1px solid #ced4da', borderRadius: '0.25rem',
                                            padding: '0.25rem 0.5rem', fontSize: '0.875rem', outline: 'none',
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', borderBottom: '1px solid #dee2e6' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#ccc', color: '#000' }}>
                                        {['Action ⇅', 'Fine ID ⇅', 'Section of Act ⇅', 'Provision ⇅', 'Fine Amount ⇅'].map(h => (
                                            <th key={h} style={{
                                                padding: '12px 16px', textAlign: 'left', fontWeight: '700',
                                                borderBottom: '2px solid #dee2e6', whiteSpace: 'nowrap'
                                            }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>Loading tracking details...</td></tr>
                                    ) : filteredProvisions.length === 0 ? (
                                        <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>No provisions found</td></tr>
                                    ) : filteredProvisions.map((item, idx) => (
                                        <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
                                            <td style={{ padding: '10px 16px' }}>
                                                <div style={{ display: 'flex', gap: '6px' }}>
                                                    {/* Edit */}
                                                    <button onClick={() => { alert('Edit modal triggering pending backend integration') }}
                                                        style={{ backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 10px', cursor: 'pointer' }}
                                                        title="Edit">
                                                        <Pencil size={15} />
                                                    </button>
                                                    {/* Delete */}
                                                    <button onClick={() => { alert('Delete modal triggering pending backend integration') }}
                                                        style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 10px', cursor: 'pointer' }}
                                                        title="Delete">
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                            <td style={{ padding: '10px 16px', color: '#212529' }}>{item.fineId}</td>
                                            <td style={{ padding: '10px 16px', color: '#212529' }}>{item.sectionOfAct}</td>
                                            <td style={{ padding: '10px 16px', color: '#212529' }}>{item.provision}</td>
                                            <td style={{ padding: '10px 16px', color: '#212529' }}>{item.fineAmount}</td>
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
