import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Menu, Users, ChevronDown, LogOut,
    Info, Trash2, X, ShieldAlert
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function ViewAllDrivers() {
    const navigate = useNavigate();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [drivers, setDrivers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const [viewModal, setViewModal] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);

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

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:8080/api/Driver/deleteDriver/${deleteId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setDeleteModal(false);
                fetchDrivers();
            } else {
                alert(data.message || 'Failed to delete driver');
            }
        } catch (err) {
            console.error('Error deleting driver:', err);
            alert('An error occurred while deleting the driver');
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
        { id: 'repeat-offenders', label: 'Repeat Offenders', icon: <ShieldAlert size={22} /> },
    ];

    const handleNav = (id) => {
        if (id === 'dashboard') navigate('/dashboard/police-oic');
        if (id === 'add-traffic-officer') navigate('/dashboard/police-oic/add-traffic-officer');
        if (id === 'view-all-traffic-officers') navigate('/dashboard/police-oic/view-all-traffic-officers');
        if (id === 'view-all-drivers') navigate('/dashboard/police-oic/view-all-drivers');
        if (id === 'repeat-offenders') navigate('/dashboard/police-oic/repeat-offenders');
    };

    const handleCSV = () => {
        const headers = ['License ID', 'Driver Email', 'Driver Full Name', 'License Issue Date', 'License Expire Date'];
        const rows = drivers.map(d => [
            d.licenseNumber || '-',
            d.user?.email || d.email || '-',
            `${d.firstName || ''} ${d.lastName || ''}`.trim() || '-',
            d.licenseissue || '-',
            d.licenseExpiry || '-'
        ]);

        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "drivers_list.csv");
        link.click();
    };

    const handleExcel = () => {
        const headers = ['License ID', 'Driver Email', 'Driver Full Name', 'License Issue Date', 'License Expire Date'];
        const rows = drivers.map(d => [
            d.licenseNumber || '-',
            d.user?.email || d.email || '-',
            `${d.firstName || ''} ${d.lastName || ''}`.trim() || '-',
            d.licenseissue || '-',
            d.licenseExpiry || '-'
        ]);

        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Drivers List");
        XLSX.writeFile(workbook, "drivers_list.xlsx");
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        const content = `
            <html>
                <head>
                    <title>View All Drivers | Police Oic</title>
                    <style>
                        @page { size: landscape; margin: 20mm; }
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; color: #333; }
                        .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
                        .header h1 { margin: 0; font-size: 24px; font-weight: normal; }
                        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                        th, td { border: 1px solid #ccc; padding: 10px; text-align: left; font-size: 13px; }
                        th { background-color: #ffffff; font-weight: bold; border-bottom: 2px solid #333; }
                        tr:nth-child(even) { background-color: #f9f9f9; }
                        .footer { margin-top: 20px; font-size: 10px; color: #888; text-align: right; }
                    </style>
                </head>
                <body>
                    <div class="header"><h1>View All Drivers | Police Oic</h1></div>
                    <table>
                        <thead>
                            <tr><th>License ID</th><th>Email</th><th>Name</th><th>Issue Date</th><th>Expire Date</th></tr>
                        </thead>
                        <tbody>
                            ${drivers.map(d => `<tr><td>${d.licenseNumber || '-'}</td><td>${d.user?.email || d.email || '-'}</td><td>${(`${d.firstName || ''} ${d.lastName || ''}`).trim() || '-'}</td><td>${d.licenseissue || '-'}</td><td>${d.licenseExpiry || '-'}</td></tr>`).join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `;
        printWindow.document.write(content);
        printWindow.document.close();
    };

    const handlePDF = () => {
        const doc = new jsPDF('landscape');
        doc.setFontSize(18); doc.text('View All Drivers | Police Oic', 14, 20);
        const headers = [['License ID', 'Email', 'Name', 'Issue Date', 'Expire Date']];
        const rows = drivers.map(d => [d.licenseNumber || '-', d.user?.email || d.email || '-', `${d.firstName || ''} ${d.lastName || ''}`.trim() || '-', d.licenseissue || '-', d.licenseExpiry || '-']);
        autoTable(doc, { startY: 30, head: headers, body: rows, theme: 'grid' });
        doc.save("drivers_list.pdf");
    };

    const sidebarWidth = sidebarOpen ? '220px' : '60px';

    return (
        <div className="min-h-screen flex bg-gray-100" style={{ fontFamily: "'Segoe UI', Roboto, sans-serif" }}>

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
                        color: item.id === 'view-all-drivers' ? '#ffffff' : 'rgba(255,255,255,0.6)',
                        backgroundColor: item.id === 'view-all-drivers' ? '#1a7a7a' : 'transparent',
                        border: 'none', cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: sidebarOpen ? 'flex-start' : 'center',
                        gap: '14px', transition: 'all 0.2s', whiteSpace: 'nowrap',
                    }} className="hover:bg-white/10">
                        <span style={{ flexShrink: 0 }}>{item.icon}</span>
                        {sidebarOpen && (<span style={{ fontSize: '14px', fontWeight: '500', color: item.id === 'view-all-drivers' ? '#fff' : 'rgba(255,255,255,0.8)' }}>{item.label}</span>)}
                    </button>
                ))}
            </aside>

            <div style={{ marginLeft: sidebarWidth, flex: 1, display: 'flex', flexDirection: 'column', transition: 'margin-left 0.25s ease' }}>

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
                        <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'white', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }} className="hover:bg-white/10 transition-all">SETTINGS <ChevronDown size={14} style={{ transform: isSettingsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} /></button>
                        {isSettingsOpen && (
                            <div style={{ position: 'absolute', right: 0, top: '110%', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 8px 30px rgba(0,0,0,0.15)', border: '1px solid #e5e7eb', minWidth: '160px', padding: '6px 0', zIndex: 100 }}>
                                <button onClick={handleLogout} style={{ width: '100%', textAlign: 'left', padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }} className="hover:bg-red-50 transition-colors"><LogOut size={14} /> Logout</button>
                            </div>
                        )}
                    </div>
                </nav>

                <div style={{ padding: '24px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>View All Drivers</h1>
                    <div style={{ display: 'flex', gap: '6px', color: '#64748b', fontSize: '13px', marginBottom: '24px' }}>
                        <button onClick={() => navigate('/dashboard/police-oic')} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: 0, fontSize: '13px' }}>Dashboard</button>
                        <span>/</span><span>View All Drivers</span>
                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.07)', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                        <div style={{ padding: '14px 20px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style={{ color: '#64748b' }}><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>
                            <span style={{ fontSize: '14px', color: '#374151' }}>You can sort data here</span>
                        </div>

                        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={handleCSV} style={{ backgroundColor: '#1d6fa4', color: 'white', border: 'none', borderRadius: '5px', padding: '6px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>📄 CSV</button>
                                <button onClick={handleExcel} style={{ backgroundColor: '#1e7e34', color: 'white', border: 'none', borderRadius: '5px', padding: '6px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>📊 Excel</button>
                                <button onClick={handlePDF} style={{ backgroundColor: '#c0392b', color: 'white', border: 'none', borderRadius: '5px', padding: '6px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>📕 PDF</button>
                                <button onClick={handlePrint} style={{ backgroundColor: '#495057', color: 'white', border: 'none', borderRadius: '5px', padding: '6px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>🖨️ Print</button>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '14px', color: '#374151' }}>Search:</span>
                                <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ border: '1px solid #d1d5db', borderRadius: '6px', padding: '6px 10px', fontSize: '13px', outline: 'none' }} placeholder="Search drivers..." />
                            </div>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#e9ecef' }}>
                                        {['Action', 'License ID', 'Email', 'Name', 'Issue Date', 'Expire Date'].map(h => (<th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '2px solid #dee2e6' }}>{h}</th>))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (<tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>Loading...</td></tr>) : drivers.length === 0 ? (<tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>No drivers found</td></tr>) : drivers.filter(d => String(d.licenseNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) || ((d.firstName || '') + ' ' + (d.lastName || '')).toLowerCase().includes(searchTerm.toLowerCase())).map((driver, idx) => (
                                        <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
                                            <td style={{ padding: '10px 16px' }}><div style={{ display: 'flex', gap: '6px' }}><button onClick={() => { setSelectedDriver(driver); setViewModal(true); }} style={{ backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}><Info size={14} /></button><button onClick={() => { setDeleteId(driver.id); setDeleteModal(true); }} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}><Trash2 size={14} /></button></div></td>
                                            <td style={{ padding: '10px 16px' }}>{driver.licenseNumber || '-'}</td>
                                            <td style={{ padding: '10px 16px', color: '#3b82f6' }}>{driver.user?.email || driver.email || '-'}</td>
                                            <td style={{ padding: '10px 16px' }}>{`${driver.firstName || ''} ${driver.lastName || ''}`.trim() || '-'}</td>
                                            <td style={{ padding: '10px 16px' }}>{driver.licenseissue || '-'}</td>
                                            <td style={{ padding: '10px 16px' }}>{driver.licenseExpiry || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {viewModal && selectedDriver && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'white', borderRadius: '12px', width: '500px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
                        <div style={{ backgroundColor: '#17a2b8', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><h4 style={{ color: 'white', margin: 0, fontWeight: '700' }}>👤 Driver Details</h4><button onClick={() => setViewModal(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '20px' }}>×</button></div>
                        <div style={{ padding: '20px' }}>
                             {[['License ID', selectedDriver.licenseNumber],['Full Name', `${selectedDriver.firstName || ''} ${selectedDriver.lastName || ''}`],['Email', selectedDriver.user?.email || selectedDriver.email],['Issue Date', selectedDriver.licenseissue],['Expire Date', selectedDriver.licenseExpiry],['Address', selectedDriver.address],['Vehicle Class', selectedDriver.classOfVehicle]].map(([label, val]) => (
                                <div key={label} style={{ display: 'flex', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}><span style={{ width: '160px', fontWeight: '600' }}>{label}</span><span>{val || '-'}</span></div>
                             ))}
                        </div>
                        <div style={{ padding: '12px 20px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end' }}><button onClick={() => setViewModal(false)} style={{ backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 18px', cursor: 'pointer' }}>Close</button></div>
                    </div>
                </div>
            )}

            {deleteModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'white', borderRadius: '12px', width: '420px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
                        <div style={{ backgroundColor: '#dc3545', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><h4 style={{ color: 'white', margin: 0, fontWeight: '700' }}>🗑️ Delete Driver</h4><button onClick={() => setDeleteModal(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '20px' }}>×</button></div>
                        <div style={{ padding: '24px 20px' }}><p style={{ margin: 0 }}>Are you sure you want to delete this driver?</p></div>
                        <div style={{ padding: '12px 20px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}><button onClick={() => setDeleteModal(false)} style={{ backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 18px', cursor: 'pointer' }}>Close</button><button onClick={handleDelete} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 18px', cursor: 'pointer' }}>Confirm Delete</button></div>
                    </div>
                </div>
            )}
        </div>
    );
}
