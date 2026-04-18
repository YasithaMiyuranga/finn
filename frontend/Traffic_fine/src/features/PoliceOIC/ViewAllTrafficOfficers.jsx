import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Menu, Users, ChevronDown, LogOut,
    Pencil, Trash2, X, ShieldAlert
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function ViewAllTrafficOfficers() {
    const navigate = useNavigate();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [officers, setOfficers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const [editModal, setEditModal] = useState(false);
    const [editData, setEditData] = useState({});

    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        fetchOfficers();
    }, []);

    const fetchOfficers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:8080/api/police_officers/getPoliceOfficers', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    setOfficers(data.data || []);
                } else if (Array.isArray(data)) {
                    setOfficers(data);
                }
            } else {
                setOfficers([]);
            }
        } catch (err) {
            console.error('Error fetching officers:', err);
            setOfficers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleEditSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:8080/api/police_officers/updatePoliceOfficer/${editData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(editData)
            });
            const data = await res.json();
            if (data.success) {
                setEditModal(false);
                fetchOfficers();
            } else {
                alert(data.message || 'Failed to update officer');
            }
        } catch (err) {
            console.error('Error updating officer:', err);
            alert('An error occurred while updating the officer');
        }
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:8080/api/police_officers/deletePoliceOfficer/${deleteId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setDeleteModal(false);
                fetchOfficers();
            } else {
                alert(data.message || 'Failed to delete officer');
            }
        } catch (err) {
            console.error('Error deleting officer:', err);
            alert('An error occurred while deleting the officer');
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


    const handleExcel = () => {
        const headers = ['Officer ID', 'Traffic Officer Name', 'Police Station', 'Court', 'Traffic Officer Email', 'Registered Date'];
        const rows = officers.map(o => [
            `P${String(o.policeid || '').padStart(5, '0')}`,
            o.fullName || '-',
            o.policeStation || '-',
            o.court || '-',
            o.userEmail || '-',
            o.registeredDate || '-'
        ]);

        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Officers List");
        XLSX.writeFile(workbook, "traffic_officers_list.xlsx");
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        const content = `
            <html>
                <head>
                    <title>View All Traffic Officers | Police Oic</title>
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
                    <div class="header">
                        <h1>View All Traffic Officers | Police Oic</h1>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Officer ID</th>
                                <th>Traffic Officer Name</th>
                                <th>Police Station</th>
                                <th>Court</th>
                                <th>Traffic Officer Email</th>
                                <th>Registered Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${officers.map(o => `
                                <tr>
                                    <td>P${String(o.policeid || '').padStart(5, '0')}</td>
                                    <td>${o.fullName || '-'}</td>
                                    <td>${o.policeStation || '-'}</td>
                                    <td>${o.court || '-'}</td>
                                    <td>${o.userEmail || '-'}</td>
                                    <td>${o.registeredDate || '-'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div class="footer">Generated on ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</div>
                    <script>
                        window.onload = function() { 
                            setTimeout(function() {
                                window.print(); 
                                window.close(); 
                            }, 500);
                        }
                    </script>
                </body>
            </html>
        `;
        printWindow.document.write(content);
        printWindow.document.close();
    };

    const handlePDF = () => {
        const doc = new jsPDF('landscape');
        doc.setFontSize(18);
        doc.text('View All Traffic Officers | Police Oic', 14, 20);
        doc.setFontSize(10);
        doc.text(`Generated on ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, 28);

        const headers = [['Officer ID', 'Traffic Officer Name', 'Police Station', 'Court', 'Traffic Officer Email', 'Registered Date']];
        const rows = officers.map(o => [
            `P${String(o.policeid || '').padStart(5, '0')}`,
            o.fullName || '-',
            o.policeStation || '-',
            o.court || '-',
            o.userEmail || '-',
            o.registeredDate || '-'
        ]);

        autoTable(doc, {
            startY: 35,
            head: headers,
            body: rows,
            theme: 'grid',
            headStyles: { fillColor: [14, 34, 56], textColor: [255, 255, 255] },
            styles: { fontSize: 9 }
        });

        doc.save("traffic_officers_list.pdf");
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
                        color: item.id === 'view-all-traffic-officers' ? '#ffffff' : 'rgba(255,255,255,0.6)',
                        backgroundColor: item.id === 'view-all-traffic-officers' ? '#1a7a7a' : 'transparent',
                        border: 'none', cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: sidebarOpen ? 'flex-start' : 'center',
                        gap: '14px', transition: 'all 0.2s', whiteSpace: 'nowrap',
                    }} className="hover:bg-white/10">
                        <span style={{ flexShrink: 0 }}>{item.icon}</span>
                        {sidebarOpen && (
                            <span style={{ fontSize: '14px', fontWeight: '500', color: item.id === 'view-all-traffic-officers' ? '#fff' : 'rgba(255,255,255,0.8)' }}>
                                {item.label}
                            </span>
                        )}
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

                <div style={{ padding: '24px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: '400', color: '#1e293b', marginBottom: '6px' }}>View All Traffic Officers</h1>
                    
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
                        <button onClick={() => navigate('/dashboard/police-oic')} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', padding: 0, fontSize: '15px' }}>
                            Dashboard
                        </button>
                        <span>/</span>
                        <span>View All Traffic Officers</span>
                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.07)', border: '1px solid #e5e7eb', overflow: 'hidden' }}>

                        <div style={{ padding: '14px 20px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style={{ color: '#64748b' }}>
                                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
                            </svg>
                            <span style={{ fontSize: '14px', color: '#374151', fontWeight: 600 }}>You can sort data here</span>
                        </div>

                        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={handleExcel} style={{ backgroundColor: '#1e7e34', color: 'white', border: 'none', borderRadius: '5px', padding: '6px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} className="hover:opacity-90 transition-opacity">📊 Excel</button>
                                <button onClick={handlePDF} style={{ backgroundColor: '#c0392b', color: 'white', border: 'none', borderRadius: '5px', padding: '6px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} className="hover:opacity-90 transition-opacity">📕 PDF</button>
                                <button onClick={handlePrint} style={{ backgroundColor: '#495057', color: 'white', border: 'none', borderRadius: '5px', padding: '6px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} className="hover:opacity-90 transition-opacity">🖨️ Print</button>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '14px', color: '#212529' }}>Search:</span>
                                <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ border: '1px solid #ced4da', borderRadius: '0.25rem', padding: '0.25rem 0.5rem', fontSize: '0.875rem', outline: 'none' }} />
                            </div>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', borderBottom: '1px solid #dee2e6' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#e9ecef' }}>
                                        {['Action ⇅', 'Officer ID ⇅', 'Name ⇅', 'Station ⇅', 'Court ⇅', 'Email ⇅', 'Date ⇅'].map(h => (
                                            <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '700', color: '#212529', borderBottom: '2px solid #dee2e6', whiteSpace: 'nowrap' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>Loading officers...</td></tr>
                                    ) : officers.length === 0 ? (
                                        <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>No officers found</td></tr>
                                    ) : officers.filter(o => 
                                        String(o.policeid || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        String(o.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        (o.userEmail || '').toLowerCase().includes(searchTerm.toLowerCase())
                                    ).map((officer, idx) => (
                                        <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
                                            <td style={{ padding: '10px 16px' }}>
                                                <div style={{ display: 'flex', gap: '6px' }}>
                                                    <button onClick={() => { setEditData({ ...officer }); setEditModal(true); }} style={{ backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}><Pencil size={14} /></button>
                                                    <button onClick={() => { setDeleteId(officer.id); setDeleteModal(true); }} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}><Trash2 size={14} /></button>
                                                </div>
                                            </td>
                                            <td style={{ padding: '10px 16px', color: '#212529' }}>P{String(officer.policeid || '').padStart(5, '0')}</td>
                                            <td style={{ padding: '10px 16px', color: '#212529' }}>{officer.fullName || '-'}</td>
                                            <td style={{ padding: '10px 16px', color: '#212529' }}>{officer.policeStation || '-'}</td>
                                            <td style={{ padding: '10px 16px', color: '#212529' }}>{officer.court || '-'}</td>
                                            <td style={{ padding: '10px 16px', color: '#212529' }}>{officer.userEmail || '-'}</td>
                                            <td style={{ padding: '10px 16px', color: '#212529' }}>{officer.registeredDate || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {editModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'white', borderRadius: '12px', width: '650px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
                        <div style={{ backgroundColor: '#28a745', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ color: 'white', margin: 0, fontWeight: '700' }}>✏️ Edit Traffic Officer</h4>
                            <button onClick={() => setEditModal(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '24px' }}>×</button>
                        </div>
                        <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="flex flex-col gap-1.5"><label style={{ fontSize: '13px', fontWeight: '600' }}>Officer ID</label><input type="text" value={editData.policeid ? `P${String(editData.policeid).padStart(5, '0')}` : ''} readOnly style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#eee' }} /></div>
                            <div className="flex flex-col gap-1.5"><label style={{ fontSize: '13px', fontWeight: '600' }}>Email</label><input type="email" value={editData.userEmail || ''} onChange={(e) => setEditData({ ...editData, userEmail: e.target.value })} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} /></div>
                            <div className="flex flex-col gap-1.5"><label style={{ fontSize: '13px', fontWeight: '600' }}>Name</label><input type="text" value={editData.fullName || ''} onChange={(e) => setEditData({ ...editData, fullName: e.target.value })} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} /></div>
                            <div className="flex flex-col gap-1.5"><label style={{ fontSize: '13px', fontWeight: '600' }}>Station</label><input type="text" value={editData.policeStation || ''} onChange={(e) => setEditData({ ...editData, policeStation: e.target.value })} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} /></div>
                            <div className="flex flex-col gap-1.5"><label style={{ fontSize: '13px', fontWeight: '600' }}>Court</label><input type="text" value={editData.court || ''} onChange={(e) => setEditData({ ...editData, court: e.target.value })} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} /></div>
                        </div>
                        <div style={{ padding: '16px 24px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button onClick={handleEditSave} style={{ backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 20px', cursor: 'pointer', fontWeight: '600' }}>Update</button>
                            <button onClick={() => setEditModal(false)} style={{ backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 20px', cursor: 'pointer', fontWeight: '600' }}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {deleteModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'white', borderRadius: '12px', width: '420px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
                        <div style={{ backgroundColor: '#dc3545', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ color: 'white', margin: 0, fontWeight: '700' }}>🗑️ Delete Traffic Officer</h4>
                            <button onClick={() => setDeleteModal(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '20px' }}>×</button>
                        </div>
                        <div style={{ padding: '24px 20px' }}><p style={{ margin: 0, fontSize: '15px', color: '#374151' }}>Are you sure you want to delete this officer?</p></div>
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
