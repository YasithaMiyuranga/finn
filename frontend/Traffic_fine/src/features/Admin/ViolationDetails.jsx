import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Menu, Users, ChevronDown, LogOut,
    Bell, Pencil, Trash2, CheckSquare, Pause, ShieldCheck
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function ViolationDetails() {
    const navigate = useNavigate();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [violations, setViolations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        fineId: '',
        sectionOfAct: '',
        violationDescription: '',
        amount: '',
        points: '',
        severityLevel: 'LOW'
    });

    // Edit Modal
    const [editModal, setEditModal] = useState(false);
    const [editData, setEditData] = useState({});

    // Delete Modal
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const fetchViolations = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/Violation/getViolationTypes', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                console.error('Failed to fetch violations:', response.status);
                if (response.status === 401 || response.status === 403) {
                    alert('Session expired or unauthorized. Please login again.');
                }
                return;
            }

            const textResponse = await response.text();
            let data;
            try {
                data = JSON.parse(textResponse);
            } catch (err) {
                console.error("Non-JSON response received:", textResponse);
                return;
            }

            if (data.success) {
                const mappedData = data.data.map(item => ({
                    fineId: item.id || '',
                    sectionOfAct: item.slLawReference || '',
                    violationDescription: item.violationDescription || '',
                    amount: item.amount || 0,
                    points: item.points || 0,
                    severityLevel: item.severityLevel || 'LOW'
                }));
                setViolations(mappedData);
            }
        } catch (error) {
            console.error('Error fetching violations:', error);
        }
    };

    useEffect(() => {
        fetchViolations();
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
            id: 'add-oic',
            label: 'Add Oic',
            icon: <ShieldCheck size={22} />
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
        { id: 'view-all-drivers', label: 'View All Drivers', icon: <Users size={22} /> },
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
        if (id === 'paid-fine-tickets') navigate('/dashboard/admin/paid-fine-tickets');
        if (id === 'pending-fine-tickets') navigate('/dashboard/admin/pending-fine-tickets');
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddViolation = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const payload = {
                slLawReference: formData.sectionOfAct,
                violationDescription: formData.violationDescription,
                amount: parseInt(formData.amount) || 0,
                points: parseInt(formData.points) || 0,
                severityLevel: formData.severityLevel
            };

            const response = await fetch('http://localhost:8080/api/Violation/saveViolationTypes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            
            if (response.ok && data.success) {
                alert("Violation Details Added Successfully!");
                fetchViolations();
                setFormData({
                    fineId: '',
                    sectionOfAct: '',
                    violationDescription: '',
                    amount: '',
                    points: '',
                    severityLevel: 'LOW'
                });
            } else {
                alert(`Error: ${data.message || 'Failed to add violation details'}`);
            }
        } catch (error) {
            console.error('Error adding violation:', error);
            alert('Failed to add violation. Please try again.');
        }
    };

    const filteredViolations = (violations || []).filter(v =>
        String(v.sectionOfAct || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(v.violationDescription || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(v.fineId || '').includes(searchTerm)
    );

    const handleEditSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const payload = {
                id: editData.fineId,
                slLawReference: editData.sectionOfAct,
                violationDescription: editData.violationDescription,
                amount: parseInt(editData.amount) || 0,
                points: parseInt(editData.points) || 0,
                severityLevel: editData.severityLevel
            };

            const res = await fetch(`http://localhost:8080/api/Violation/updateViolationTypes/${editData.fineId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                setEditModal(false);
                fetchViolations();
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:8080/api/Violation/deleteViolationTypes/${deleteId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setDeleteModal(false);
                fetchViolations();
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleCSV = () => {
        const headers = ['Fine ID', 'Section', 'Violation Description', 'Points', 'Severity', 'Amount'];
        const rows = filteredViolations.map(v => [
            v.fineId || '-',
            v.sectionOfAct || '-',
            v.violationDescription || '-',
            v.points || '0',
            v.severityLevel || 'LOW',
            v.amount || '0'
        ]);

        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "violation_details.csv");
        link.click();
    };

    const handleExcel = () => {
        const headers = ['Fine ID', 'Section', 'Violation Description', 'Points', 'Severity', 'Amount'];
        const rows = filteredViolations.map(v => [
            v.fineId || '-',
            v.sectionOfAct || '-',
            v.violationDescription || '-',
            v.points || '0',
            v.severityLevel || 'LOW',
            v.amount || '0'
        ]);

        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Violations");
        XLSX.writeFile(workbook, "violation_details.xlsx");
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        const content = `
            <html>
                <head>
                    <title>Violation Details | Motor Traffic Department</title>
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
                        <h1>Violation Details | Motor Traffic Department</h1>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Fine ID</th>
                                <th>Section</th>
                                <th>Violation Description</th>
                                <th>Points</th>
                                <th>Severity</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredViolations.map(v => `
                                <tr>
                                    <td>${v.fineId || '-'}</td>
                                    <td>${v.sectionOfAct || '-'}</td>
                                    <td>${v.violationDescription || '-'}</td>
                                    <td>${v.points || '0'}</td>
                                    <td>${v.severityLevel || 'LOW'}</td>
                                    <td>${v.amount || '0'}</td>
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
        doc.text('Violation Details | Motor Traffic Department', 14, 20);
        doc.setFontSize(10);
        doc.text(`Generated on ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, 28);

        const headers = [['Fine ID', 'Section', 'Violation Description', 'Points', 'Severity', 'Amount']];
        const rows = filteredViolations.map(v => [
            v.fineId || '-',
            v.sectionOfAct || '-',
            v.violationDescription || '-',
            v.points || '0',
            v.severityLevel || 'LOW',
            v.amount || '0'
        ]);

        autoTable(doc, {
            startY: 35,
            head: headers,
            body: rows,
            theme: 'grid',
            headStyles: { fillColor: [14, 34, 56], textColor: [255, 255, 255] },
            styles: { fontSize: 9 }
        });

        doc.save("violation_details.pdf");
    };

    const getSeverityColor = (severity) => {
        switch(severity) {
            case 'LOW': return '#28a745';
            case 'MEDIUM': return '#ffc107';
            case 'HIGH': return '#fd7e14';
            case 'CRITICAL': return '#dc3545';
            default: return '#6c757d';
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
                        color: item.id === 'violation-details' ? '#ffffff' : 'rgba(255,255,255,0.6)',
                        backgroundColor: item.id === 'violation-details' ? '#1a7a7a' : 'transparent',
                        border: 'none', cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: sidebarOpen ? 'flex-start' : 'center',
                        gap: '14px', transition: 'all 0.2s', whiteSpace: 'nowrap',
                    }} className="hover:bg-white/10">
                        <span style={{ flexShrink: 0 }}>{item.icon}</span>
                        {sidebarOpen && (
                            <span style={{ fontSize: '14px', fontWeight: '500', color: item.id === 'violation-details' ? '#fff' : 'rgba(255,255,255,0.8)' }}>
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
                    <h1 style={{ fontSize: '28px', fontWeight: '400', color: '#1e293b', marginBottom: '6px' }}>Violation Details</h1>
                    
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
                        <span>Violation Details</span>
                    </div>

                    {/* Add violation Card */}
                    <div style={{ backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.07)', border: '1px solid #e5e7eb', overflow: 'hidden', marginBottom: '32px' }}>
                        <div style={{ padding: '14px 20px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '8px' }}>
                             <Pencil size={16} />
                            <span style={{ fontSize: '15px', color: '#1f2937', fontWeight: 600 }}>Add Violation Details</span>
                        </div>

                        <div style={{ padding: '2rem' }}>
                            <form onSubmit={handleAddViolation} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', gap: '2rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1rem', color: '#212529' }}>Fine ID</label>
                                        <input 
                                            type="text" 
                                            name="fineId" 
                                            value={formData.fineId} 
                                            onChange={handleInputChange} 
                                            placeholder="Ex: 100" 
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
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1rem', color: '#212529' }}>Violation Description</label>
                                        <input 
                                            type="text" 
                                            name="violationDescription" 
                                            value={formData.violationDescription} 
                                            onChange={handleInputChange} 
                                            placeholder="Violation Description" 
                                            style={{ width: '100%', padding: '0.375rem 0.75rem', fontSize: '1rem', lineHeight: 1.5, color: '#495057', backgroundColor: '#fff', border: '1px solid #ced4da', borderRadius: '0.25rem', outline: 'none' }} 
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '2rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1rem', color: '#212529' }}>Fine Amount (LKR)</label>
                                        <input 
                                            type="number" 
                                            name="amount" 
                                            value={formData.amount} 
                                            onChange={handleInputChange} 
                                            placeholder="Ex: 2000" 
                                            style={{ width: '100%', padding: '0.375rem 0.75rem', fontSize: '1rem', lineHeight: 1.5, color: '#495057', backgroundColor: '#fff', border: '1px solid #ced4da', borderRadius: '0.25rem', outline: 'none' }} 
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1rem', color: '#212529' }}>Penalty Points</label>
                                        <input 
                                            type="number" 
                                            name="points" 
                                            value={formData.points} 
                                            onChange={handleInputChange} 
                                            placeholder="Ex: 5" 
                                            style={{ width: '100%', padding: '0.375rem 0.75rem', fontSize: '1rem', lineHeight: 1.5, color: '#495057', backgroundColor: '#fff', border: '1px solid #ced4da', borderRadius: '0.25rem', outline: 'none' }} 
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1rem', color: '#212529' }}>Severity Level</label>
                                        <select 
                                            name="severityLevel" 
                                            value={formData.severityLevel} 
                                            onChange={handleInputChange}
                                            style={{ width: '100%', padding: '0.375rem 0.75rem', fontSize: '1rem', lineHeight: 1.5, color: '#495057', backgroundColor: '#fff', border: '1px solid #ced4da', borderRadius: '0.25rem', outline: 'none' }}
                                        >
                                            <option value="LOW">LOW</option>
                                            <option value="MEDIUM">MEDIUM</option>
                                            <option value="HIGH">HIGH</option>
                                            <option value="CRITICAL">CRITICAL</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <button type="submit" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#0d6efd', color: '#fff', border: '1px solid #0d6efd', borderRadius: '0.25rem', padding: '0.375rem 0.75rem', fontSize: '1rem', lineHeight: 1.5, cursor: 'pointer', transition: 'all .15s ease-in-out' }}>
                                        Add Violation
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Table Card */}
                    <div style={{ backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.07)', border: '1px solid #e5e7eb', overflow: 'hidden' }}>

                        <div style={{ padding: '14px 20px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '8px' }}>
                             <Menu size={16} />
                            <span style={{ fontSize: '15px', color: '#1f2937', fontWeight: 600 }}>All Violation Details</span>
                        </div>

                        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={handleCSV} style={{ backgroundColor: '#1d6fa4', color: 'white', border: 'none', borderRadius: '5px', padding: '6px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} className="hover:opacity-90 transition-opacity">
                                    📄 CSV
                                </button>
                                <button onClick={handleExcel} style={{ backgroundColor: '#1e7e34', color: 'white', border: 'none', borderRadius: '5px', padding: '6px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} className="hover:opacity-90 transition-opacity">
                                    📊 Excel
                                </button>
                                <button onClick={handlePDF} style={{ backgroundColor: '#c0392b', color: 'white', border: 'none', borderRadius: '5px', padding: '6px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} className="hover:opacity-90 transition-opacity">
                                    📕 PDF
                                </button>
                                <button onClick={handlePrint} style={{ backgroundColor: '#495057', color: 'white', border: 'none', borderRadius: '5px', padding: '6px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} className="hover:opacity-90 transition-opacity">
                                    🖨️ Print
                                </button>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '14px', color: '#212529' }}>Search:</span>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    style={{ border: '1px solid #ced4da', borderRadius: '0.25rem', padding: '0.25rem 0.5rem', fontSize: '0.875rem', outline: 'none' }}
                                />
                            </div>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#ccc', color: '#000' }}>
                                        {['Action ⇅', 'Fine ID ⇅', 'Section ⇅', 'Violation Description ⇅', 'Points ⇅', 'Severity ⇅', 'Amount ⇅'].map(h => (
                                            <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '700', borderBottom: '2px solid #dee2e6' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredViolations.map((v, idx) => (
                                        <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
                                            <td style={{ padding: '10px 16px' }}>
                                                <div style={{ display: 'flex', gap: '6px' }}>
                                                    <button 
                                                        onClick={() => { setEditData({ ...v }); setEditModal(true); }}
                                                        style={{ backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', padding: '6px', cursor: 'pointer' }}
                                                        title="Edit"
                                                    >
                                                        <Pencil size={14} />
                                                    </button>
                                                    <button 
                                                        onClick={() => { setDeleteId(v.fineId); setDeleteModal(true); }}
                                                        style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', padding: '6px', cursor: 'pointer' }}
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                            <td style={{ padding: '10px 16px' }}>{v.fineId}</td>
                                            <td style={{ padding: '10px 16px' }}>{v.sectionOfAct}</td>
                                            <td style={{ padding: '10px 16px' }}>{v.violationDescription}</td>
                                            <td style={{ padding: '10px 16px', fontWeight: 'bold' }}>{v.points}</td>
                                            <td style={{ padding: '10px 16px' }}>
                                                <span style={{ backgroundColor: getSeverityColor(v.severityLevel), color: v.severityLevel === 'MEDIUM' ? '#000' : '#fff', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>
                                                    {v.severityLevel}
                                                </span>
                                            </td>
                                            <td style={{ padding: '10px 16px' }}>{v.amount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ======== EDIT MODAL ======== */}
                    {editModal && (
                        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ background: 'white', borderRadius: '12px', width: '650px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
                                <div style={{ backgroundColor: '#28a745', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h4 style={{ color: 'white', margin: 0, fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Pencil size={18} /> Edit Violation Details
                                    </h4>
                                    <button onClick={() => setEditModal(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '24px', lineHeight: 1 }}>×</button>
                                </div>

                                <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div className="flex flex-col gap-1.5">
                                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#4b5563' }}>Fine ID</label>
                                        <input
                                            type="text"
                                            value={editData.fineId || ''}
                                            readOnly
                                            style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #e5e7eb', backgroundColor: '#f3f4f6', color: '#6b7280', fontSize: '14px', outline: 'none', cursor: 'not-allowed' }}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#4b5563' }}>Section</label>
                                        <input
                                            type="text"
                                            value={editData.sectionOfAct || ''}
                                            onChange={(e) => setEditData({ ...editData, sectionOfAct: e.target.value })}
                                            style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none' }}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5" style={{ gridColumn: 'span 2' }}>
                                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#4b5563' }}>Violation Description</label>
                                        <input
                                            type="text"
                                            value={editData.violationDescription || ''}
                                            onChange={(e) => setEditData({ ...editData, violationDescription: e.target.value })}
                                            style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none' }}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#4b5563' }}>Points</label>
                                        <input
                                            type="number"
                                            value={editData.points || ''}
                                            onChange={(e) => setEditData({ ...editData, points: e.target.value })}
                                            style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none' }}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#4b5563' }}>Severity</label>
                                        <select
                                            value={editData.severityLevel || 'LOW'}
                                            onChange={(e) => setEditData({ ...editData, severityLevel: e.target.value })}
                                            style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none' }}
                                        >
                                            <option value="LOW">LOW</option>
                                            <option value="MEDIUM">MEDIUM</option>
                                            <option value="HIGH">HIGH</option>
                                            <option value="CRITICAL">CRITICAL</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#4b5563' }}>Amount</label>
                                        <input
                                            type="number"
                                            value={editData.amount || ''}
                                            onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                                            style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ padding: '16px 24px', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'flex-end', gap: '12px', backgroundColor: '#fafafa' }}>
                                    <button
                                        onClick={handleEditSave}
                                        style={{ backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '6px', padding: '10px 24px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}
                                    >
                                        Update
                                    </button>
                                    <button
                                        onClick={() => setEditModal(false)}
                                        style={{ backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', padding: '10px 24px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ======== DELETE MODAL ======== */}
                    {deleteModal && (
                        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ background: 'white', borderRadius: '12px', width: '420px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
                                <div style={{ backgroundColor: '#dc3545', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h4 style={{ color: 'white', margin: 0, fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Trash2 size={18} /> Delete Violation
                                    </h4>
                                    <button onClick={() => setDeleteModal(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '24px', lineHeight: 1 }}>×</button>
                                </div>
                                <div style={{ padding: '24px 20px' }}>
                                    <p style={{ margin: 0, fontSize: '15px', color: '#374151' }}>Are you sure you want to delete this violation record from the system?</p>
                                </div>
                                <div style={{ padding: '12px 20px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end', gap: '10px', backgroundColor: '#fafafa' }}>
                                    <button onClick={() => setDeleteModal(false)} style={{ backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 18px', cursor: 'pointer', fontWeight: '600' }}>Close</button>
                                    <button onClick={handleDelete} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 18px', cursor: 'pointer', fontWeight: '600' }}>Confirm Delete</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
