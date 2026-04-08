import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Menu, Users, ChevronDown, LogOut,
    Pencil, Trash2, X, ShieldCheck, CheckSquare, Pause
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function ViewAllPoliceOic() {
    const navigate = useNavigate();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [oicList, setOicList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // Edit Modal
    const [editModal, setEditModal] = useState(false);
    const [editData, setEditData] = useState({});

    // Delete Modal
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        fetchOICs();
    }, []);

    const fetchOICs = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:8080/api/police_oic/getPoliceOICs', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    setOicList(data.data || []);
                } else if (Array.isArray(data)) {
                    setOicList(data);
                }
            } else {
                setOicList([]);
            }
        } catch (err) {
            console.error('Error fetching OICs:', err);
            setOicList([]);
        } finally {
            setLoading(false);
        }
    };

    const handleEditSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:8080/api/police_oic/updatePoliceOIC/${editData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(editData)
            });
            
            if (!res.ok) {
                const errorText = await res.text();
                console.error('Update failed:', res.status, errorText);
                alert(`Failed to update OIC: ${res.status} ${res.statusText}`);
                return;
            }

            const data = await res.json();
            if (data.success) {
                setEditModal(false);
                fetchOICs();
            } else {
                alert(data.message || 'Failed to update OIC');
            }
        } catch (err) {
            console.error('Error updating OIC:', err);
            alert('An error occurred while updating the OIC. Please check the console for details.');
        }
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:8080/api/police_oic/deletePoliceOIC/${deleteId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setDeleteModal(false);
                fetchOICs();
            } else {
                alert(data.message || 'Failed to delete OIC');
            }
        } catch (err) {
            console.error('Error deleting OIC:', err);
            alert('An error occurred while deleting the OIC');
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
        { id: 'add-oic', label: 'Add Police Oic', icon: <ShieldCheck size={22} /> },
        { id: 'view-all-traffic-officers', label: 'View All Traffic Officers', icon: <Users size={22} /> },
        { id: 'view-all-drivers', label: 'View All Drivers', icon: <Users size={22} /> },
        { id: 'view-all-oic', label: 'View All Police Oic', icon: <ShieldCheck size={22} /> },
        { id: 'violation-details', label: 'Violation Details', icon: <CheckSquare size={22} /> },
        { id: 'paid-fine-tickets', label: 'Paid Fine Tickets', icon: <CheckSquare size={22} /> },
        { id: 'pending-fine-tickets', label: 'Pending Fine Tickets', icon: <Pause size={22} /> },
    ];

    const handleNav = (id) => {
        if (id === 'dashboard') navigate('/dashboard/admin');
        if (id === 'add-traffic-officer') navigate('/dashboard/admin/add-traffic-officer');
        if (id === 'add-oic') navigate('/dashboard/admin/add-oic');
        if (id === 'view-all-traffic-officers') navigate('/dashboard/admin/view-all-traffic-officers');
        if (id === 'view-all-drivers') navigate('/dashboard/admin/view-all-drivers');
        if (id === 'view-all-oic') navigate('/dashboard/admin/view-all-police-oic');
        if (id === 'violation-details') navigate('/dashboard/admin/violation-details');
        if (id === 'paid-fine-tickets') navigate('/dashboard/admin/paid-fine-tickets');
        if (id === 'pending-fine-tickets') navigate('/dashboard/admin/pending-fine-tickets');
    };

    const handleCSV = () => {
        const headers = ['Police ID', 'Full Name', 'OIC Email', 'Phone Number', 'Officer Rank', 'Registered Date'];
        const rows = oicList.map(o => [
            o.policeid || '-',
            o.fullName || '-',
            o.email || '-',
            o.phone || '-',
            o.officerRank || '-',
            o.registeredDate || '-'
        ]);

        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "police_oic_list.csv");
        link.click();
    };

    const handleExcel = () => {
        const headers = ['Police ID', 'Full Name', 'OIC Email', 'Phone Number', 'Officer Rank', 'Registered Date'];
        const rows = oicList.map(o => [
            o.policeid || '-',
            o.fullName || '-',
            o.email || '-',
            o.phone || '-',
            o.officerRank || '-',
            o.registeredDate || '-'
        ]);

        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "OIC List");
        XLSX.writeFile(workbook, "police_oic_list.xlsx");
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        const content = `
            <html>
                <head>
                    <title>View All Police OIC | Motor Traffic Department</title>
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
                        <h1>View All Police OIC | Motor Traffic Department</h1>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Police ID</th>
                                <th>Full Name</th>
                                <th>OIC Email</th>
                                <th>Phone Number</th>
                                <th>Officer Rank</th>
                                <th>Registered Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${oicList.map(o => `
                                <tr>
                                    <td>${o.policeid || '-'}</td>
                                    <td>${o.fullName || '-'}</td>
                                    <td>${o.email || '-'}</td>
                                    <td>${o.phone || '-'}</td>
                                    <td>${o.officerRank || '-'}</td>
                                    <td>${o.registeredDate || '-'}</td>
                                </tr>
                            `).join('')}
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
        doc.setFontSize(18);
        doc.text('View All Police OIC | Motor Traffic Department', 14, 20);
        const headers = [['Police ID', 'Full Name', 'OIC Email', 'Phone Number', 'Officer Rank', 'Registered Date']];
        const rows = oicList.map(o => [
            o.policeid || '-',
            o.fullName || '-',
            o.email || '-',
            o.phone || '-',
            o.officerRank || '-',
            o.registeredDate || '-'
        ]);

        autoTable(doc, {
            startY: 30,
            head: headers,
            body: rows,
            theme: 'grid',
            headStyles: { fillColor: [14, 34, 56], textColor: [255, 255, 255] }
        });

        doc.save("police_oic_list.pdf");
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
                        color: item.id === 'view-all-oic' ? '#ffffff' : 'rgba(255,255,255,0.6)',
                        backgroundColor: item.id === 'view-all-oic' ? '#1a7a7a' : 'transparent',
                        border: 'none', cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: sidebarOpen ? 'flex-start' : 'center',
                        gap: '14px', transition: 'all 0.2s', whiteSpace: 'nowrap',
                    }} className="hover:bg-white/10">
                        <span style={{ flexShrink: 0 }}>{item.icon}</span>
                        {sidebarOpen && (
                            <span style={{ fontSize: '14px', fontWeight: '500', color: item.id === 'view-all-oic' ? '#fff' : 'rgba(255,255,255,0.8)' }}>
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
                    <h1 style={{ fontSize: '28px', fontWeight: '400', color: '#1e293b', marginBottom: '6px' }}>View All Police OIC</h1>
                    
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
                        <span>View All Police OIC</span>
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
                                <button onClick={handleCSV} style={{ backgroundColor: '#1d6fa4', color: 'white', border: 'none', borderRadius: '5px', padding: '6px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }} className="hover:opacity-90">📄 CSV</button>
                                <button onClick={handleExcel} style={{ backgroundColor: '#1e7e34', color: 'white', border: 'none', borderRadius: '5px', padding: '6px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }} className="hover:opacity-90">📊 Excel</button>
                                <button onClick={handlePDF} style={{ backgroundColor: '#c0392b', color: 'white', border: 'none', borderRadius: '5px', padding: '6px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }} className="hover:opacity-90">📕 PDF</button>
                                <button onClick={handlePrint} style={{ backgroundColor: '#495057', color: 'white', border: 'none', borderRadius: '5px', padding: '6px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }} className="hover:opacity-90">🖨️ Print</button>
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
                                        {['Action ⇅', 'Police ID ⇅', 'Full Name ⇅', 'OIC Email ⇅', 'Phone Number ⇅', 'Officer Rank ⇅', 'Registered Date ⇅'].map(h => (
                                            <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '700', color: '#212529', borderBottom: '2px solid #dee2e6', whiteSpace: 'nowrap' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>Loading...</td></tr>
                                    ) : oicList.length === 0 ? (
                                        <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>No records found</td></tr>
                                    ) : oicList.filter(o => 
                                        String(o.policeid || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        String(o.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        (o.email || '').toLowerCase().includes(searchTerm.toLowerCase())
                                    ).map((oic, idx) => (
                                        <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
                                            <td style={{ padding: '10px 16px' }}>
                                                <div style={{ display: 'flex', gap: '6px' }}>
                                                    <button onClick={() => { setEditData({ ...oic }); setEditModal(true); }} style={{ backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}><Pencil size={14} /></button>
                                                    <button onClick={() => { setDeleteId(oic.id); setDeleteModal(true); }} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}><Trash2 size={14} /></button>
                                                </div>
                                            </td>
                                            <td style={{ padding: '10px 16px' }}>{oic.policeid || '-'}</td>
                                            <td style={{ padding: '10px 16px' }}>{oic.fullName || '-'}</td>
                                            <td style={{ padding: '10px 16px' }}>{oic.email || '-'}</td>
                                            <td style={{ padding: '10px 16px' }}>{oic.phone || '-'}</td>
                                            <td style={{ padding: '10px 16px' }}>{oic.officerRank || oic.rank || '-'}</td>
                                            <td style={{ padding: '10px 16px' }}>{oic.registeredDate || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* EDIT MODAL */}
            {editModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'white', borderRadius: '12px', width: '600px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
                        <div style={{ backgroundColor: '#28a745', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ color: 'white', margin: 0, fontWeight: '700' }}>✏️ Edit Police OIC</h4>
                            <button onClick={() => setEditModal(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '24px' }}>×</button>
                        </div>
                        <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="flex flex-col gap-1.5">
                                <label style={{ fontSize: '13px', fontWeight: '600' }}>Police ID</label>
                                <input 
                                    type="text" 
                                    value={editData.policeid || ''} 
                                    readOnly 
                                    style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f3f4f6', cursor: 'not-allowed' }} 
                                />
                            </div>
                            <div className="flex flex-col gap-1.5"><label style={{ fontSize: '13px', fontWeight: '600' }}>Full Name</label><input type="text" value={editData.fullName || ''} onChange={(e) => setEditData({ ...editData, fullName: e.target.value })} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} /></div>
                            <div className="flex flex-col gap-1.5"><label style={{ fontSize: '13px', fontWeight: '600' }}>Email</label><input type="email" value={editData.email || ''} onChange={(e) => setEditData({ ...editData, email: e.target.value })} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} /></div>
                            <div className="flex flex-col gap-1.5"><label style={{ fontSize: '13px', fontWeight: '600' }}>Phone</label><input type="text" value={editData.phone || ''} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} /></div>
                            <div className="flex flex-col gap-1.5">
                                <label style={{ fontSize: '13px', fontWeight: '600' }}>Rank</label>
                                <select value={editData.officerRank || editData.rank || ''} onChange={(e) => setEditData({ ...editData, officerRank: e.target.value })} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}>
                                    <option value="">Select Rank</option>
                                    <option value="IP">IP</option>
                                    <option value="CI">CI</option>
                                    <option value="ASP">ASP</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ padding: '16px 24px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button onClick={handleEditSave} style={{ backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 20px', cursor: 'pointer', fontWeight: '600' }}>Update</button>
                            <button onClick={() => setEditModal(false)} style={{ backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 20px', cursor: 'pointer', fontWeight: '600' }}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* DELETE MODAL */}
            {deleteModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'white', borderRadius: '12px', width: '400px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
                        <div style={{ backgroundColor: '#dc3545', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ color: 'white', margin: 0, fontWeight: '700' }}>🗑️ Delete OIC</h4>
                            <button onClick={() => setDeleteModal(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '20px' }}>×</button>
                        </div>
                        <div style={{ padding: '24px 20px' }}><p style={{ margin: 0 }}>Are you sure you want to delete this OIC?</p></div>
                        <div style={{ padding: '12px 20px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button onClick={() => setDeleteModal(false)} style={{ backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 18px', cursor: 'pointer' }}>Close</button>
                            <button onClick={handleDelete} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 18px', cursor: 'pointer' }}>Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
