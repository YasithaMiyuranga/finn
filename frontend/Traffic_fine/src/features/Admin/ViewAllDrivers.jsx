import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Menu, UserPlus, Users, ChevronDown, LogOut,
    Bell, Info, Pencil, Trash2, Search, X
} from 'lucide-react';

export default function ViewAllDrivers() {
    const navigate = useNavigate();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [drivers, setDrivers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // View Modal
    const [viewModal, setViewModal] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);

    // Edit Modal
    const [editModal, setEditModal] = useState(false);
    const [editData, setEditData] = useState({});

    // Delete Modal
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:8080/api/Driver/getDrivers', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setDrivers(data.data || []);
            }
        } catch (err) {
            console.error('Error fetching drivers:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/auth/login');
    };

    const navItems = [
        {
            id: 'dashboard', label: 'Dashboard',
            icon: <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
        },
        { id: 'add-driver', label: 'Add Driver', icon: <UserPlus size={22} /> },
        { id: 'view-all', label: 'View All Drivers', icon: <Users size={22} /> },
    ];

    const handleNav = (id) => {
        if (id === 'dashboard') navigate('/dashboard/admin');
        if (id === 'view-all') navigate('/dashboard/admin/view-all-drivers');
    };

    const filteredDrivers = drivers.filter(d =>
        String(d.licenseNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        ((d.firstName || '') + ' ' + (d.lastName || '')).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (d.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEditSave = async () => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:8080/api/Driver/updateDriver/${editData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(editData)
            });
            setEditModal(false);
            fetchDrivers();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:8080/api/Driver/deleteDriver/${deleteId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            setDeleteModal(false);
            fetchDrivers();
        } catch (err) {
            console.error(err);
        }
    };

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
                        color: item.id === 'view-all' ? '#ffffff' : 'rgba(255,255,255,0.6)',
                        backgroundColor: item.id === 'view-all' ? '#1a7a7a' : 'transparent',
                        border: 'none', cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: sidebarOpen ? 'flex-start' : 'center',
                        gap: '14px', transition: 'all 0.2s', whiteSpace: 'nowrap',
                    }} className="hover:bg-white/10">
                        <span style={{ flexShrink: 0 }}>{item.icon}</span>
                        {sidebarOpen && (
                            <span style={{ fontSize: '14px', fontWeight: '500', color: item.id === 'view-all' ? '#fff' : 'rgba(255,255,255,0.8)' }}>
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
                    <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>View All Drivers</h1>
                    <div style={{ display: 'flex', gap: '6px', color: '#64748b', fontSize: '13px', marginBottom: '24px' }}>
                        <button onClick={() => navigate('/dashboard/admin')} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: 0, fontSize: '13px' }}>
                            Dashboard
                        </button>
                        <span>/</span>
                        <span>View All Drivers</span>
                    </div>

                    {/* Card */}
                    <div style={{ backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.07)', border: '1px solid #e5e7eb', overflow: 'hidden' }}>

                        {/* Card Header */}
                        <div style={{ padding: '14px 20px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style={{ color: '#64748b' }}>
                                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
                            </svg>
                            <span style={{ fontSize: '14px', color: '#374151' }}>You can sort data here</span>
                        </div>

                        {/* Export Buttons */}
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {[
                                    { label: 'CSV', color: '#1d6fa4', icon: '📄' },
                                    { label: 'Excel', color: '#1e7e34', icon: '📊' },
                                    { label: 'PDF', color: '#c0392b', icon: '📕' },
                                    { label: 'Print', color: '#495057', icon: '🖨️' },
                                ].map(btn => (
                                    <button key={btn.label} style={{
                                        backgroundColor: btn.color, color: 'white', border: 'none',
                                        borderRadius: '5px', padding: '6px 14px', fontSize: '13px',
                                        fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                                    }} className="hover:opacity-90 transition-opacity">
                                        {btn.icon} {btn.label}
                                    </button>
                                ))}
                            </div>

                            {/* Search */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '14px', color: '#374151' }}>Search:</span>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        style={{
                                            border: '1px solid #d1d5db', borderRadius: '6px',
                                            padding: '6px 32px 6px 10px', fontSize: '13px', outline: 'none',
                                        }}
                                        placeholder="Search drivers..."
                                    />
                                    {searchTerm && (
                                        <button onClick={() => setSearchTerm('')} style={{
                                            position: 'absolute', right: '8px', top: '50%',
                                            transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af'
                                        }}>
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#e9ecef' }}>
                                        {['Action', 'License ID', 'Driver Email', 'Driver Full Name', 'License Issue Date', 'License Expire Date'].map(h => (
                                            <th key={h} style={{
                                                padding: '12px 16px', textAlign: 'left', fontWeight: '600',
                                                color: '#374151', borderBottom: '2px solid #dee2e6', whiteSpace: 'nowrap'
                                            }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>Loading drivers...</td></tr>
                                    ) : filteredDrivers.length === 0 ? (
                                        <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>No drivers found</td></tr>
                                    ) : filteredDrivers.map((driver, idx) => (
                                        <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
                                            <td style={{ padding: '10px 16px' }}>
                                                <div style={{ display: 'flex', gap: '6px' }}>
                                                    {/* View */}
                                                    <button onClick={() => { setSelectedDriver(driver); setViewModal(true); }}
                                                        style={{ backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}
                                                        title="View">
                                                        <Info size={14} />
                                                    </button>
                                                    {/* Edit */}
                                                    <button onClick={() => { setEditData({ ...driver }); setEditModal(true); }}
                                                        style={{ backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}
                                                        title="Edit">
                                                        <Pencil size={14} />
                                                    </button>
                                                    {/* Delete */}
                                                    <button onClick={() => { setDeleteId(driver.id); setDeleteModal(true); }}
                                                        style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}
                                                        title="Delete">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                            <td style={{ padding: '10px 16px', color: '#374151' }}>{driver.licenseNumber || '-'}</td>
                                            <td style={{ padding: '10px 16px', color: '#3b82f6' }}>{driver.user?.email || driver.email || '-'}</td>
                                            <td style={{ padding: '10px 16px', color: '#374151' }}>{`${driver.firstName || ''} ${driver.lastName || ''}`.trim() || '-'}</td>
                                            <td style={{ padding: '10px 16px', color: '#374151' }}>{driver.licenseissue || '-'}</td>
                                            <td style={{ padding: '10px 16px', color: '#374151' }}>{driver.licenseExpiry || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* ======== VIEW MODAL ======== */}
            {viewModal && selectedDriver && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'white', borderRadius: '12px', width: '500px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
                        <div style={{ backgroundColor: '#17a2b8', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ color: 'white', margin: 0, fontWeight: '700' }}>👤 Driver All Details</h4>
                            <button onClick={() => setViewModal(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '20px' }}>×</button>
                        </div>
                        <div style={{ padding: '20px' }}>
                            {[
                                ['License ID', selectedDriver.licenseId],
                                ['Full Name', `${selectedDriver.firstName || ''} ${selectedDriver.lastName || ''}`],
                                ['Email', selectedDriver.email],
                                ['License Issue Date', selectedDriver.licenseIssueDate],
                                ['License Expire Date', selectedDriver.licenseExpireDate],
                                ['Address', selectedDriver.homeAddress],
                                ['Vehicle Class', selectedDriver.classOfVehicle],
                            ].map(([label, val]) => (
                                <div key={label} style={{ display: 'flex', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                                    <span style={{ width: '160px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>{label}</span>
                                    <span style={{ color: '#64748b', fontSize: '13px' }}>{val || '-'}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ padding: '12px 20px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={() => setViewModal(false)} style={{ backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 18px', cursor: 'pointer', fontWeight: '600' }}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ======== DELETE CONFIRM MODAL ======== */}
            {deleteModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'white', borderRadius: '12px', width: '420px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
                        <div style={{ backgroundColor: '#dc3545', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ color: 'white', margin: 0, fontWeight: '700' }}>🗑️ Delete Driver Details</h4>
                            <button onClick={() => setDeleteModal(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '20px' }}>×</button>
                        </div>
                        <div style={{ padding: '24px 20px' }}>
                            <p style={{ margin: 0, fontSize: '15px', color: '#374151' }}>Are you sure you want to delete this driver from the system?</p>
                        </div>
                        <div style={{ padding: '12px 20px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button onClick={() => setDeleteModal(false)} style={{ backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 18px', cursor: 'pointer', fontWeight: '600' }}>Close</button>
                            <button onClick={handleDelete} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 18px', cursor: 'pointer', fontWeight: '600' }}>Confirm Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
