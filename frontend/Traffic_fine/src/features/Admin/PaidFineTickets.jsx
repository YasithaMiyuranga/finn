import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Menu, UserPlus, Users, ChevronDown, LogOut,
    Edit, Bell, CheckSquare, Info, Pause, ShieldCheck
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function PaidFineTickets() {
    const navigate = useNavigate();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [tickets, setTickets] = useState([]);
    const [rawData, setRawData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchPaidFines = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/traffic_fine/getTrafficFine', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                console.error('Failed to fetch paid fines:', response.status);
                return;
            }

            const data = await response.json();
            if (data && data.success) {
                setRawData(data.data || []);
                // Filter for PAID status and map to display format
                const paidFines = (data.data || []).filter(v => v.status === 'PAID').map(v => ({
                    id: v.refNo, // Use refNo or unique ID if available for finding in rawData
                    referenceNo: v.refNo || '',
                    licenseId: v.licenseId || '',
                    policeId: v.policeId || '',
                    totalAmount: v.totalAmount ? parseFloat(v.totalAmount).toFixed(2) : '0.00'
                }));
                setTickets(paidFines);
            }
        } catch (error) {
            console.error('Error fetching paid fines:', error);
        }
    };

    useEffect(() => {
        fetchPaidFines();
    }, []);

    const handleShowDetails = (ticketId) => {
        const fullItem = rawData.find(v => v.refNo === ticketId);
        if (fullItem) {
            setSelectedTicket(fullItem);
            setIsModalOpen(true);
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
                    <path d="M416 224c0-53-43-96-96-96s-96 43-96 96 43 96 96 96 96-43 96-96zm-171.7-86.3C213.6 109 177.3 96 144 96c-53 0-96 43-96 96s43 96 96 96c21.2 0 40.5-6.9 56.4-18.5-8.2-18.7-12.4-39-12.4-60.5 0-33 11.2-63.5 30.3-87.3zM224 352c-70.7 0-128 57.3-128 128 0 17.7 14.3 32 32 32h275.6c11.7-32.5 35.8-59 66.4-71.8V384h-.3c-11.4-19-31.5-32-54.1-32h-191.6zm403.9-39.7c2.4 12.8 2.4 25.8 0 38.6l32 25c2.9 2.2 3.6 6.2 1.6 9.4l-30.2 52.3c-2 3.5-6.4 4.8-10.1 3.5l-37.6-15.1c-11.8 9.5-25 17-39.2 22.2l-5.7 40C531.3 491.5 528 494 524 494h-60.4c-4 0-7.3-2.5-7.7-6.2l-5.7-40c-14.2-5.2-27.4-12.7-39.2-22.2l-37.6 15.1c-3.7 1.3-8.1 0-10.1 3.5l-30.2-52.3c-2-3.2-1.2-7.2 1.6-9.4l32-25c-2.4-12.8-2.4-25.8 0-38.6l-32-25c-2.9-2.2-3.6-6.2-1.6-9.4l30.2-52.3c2-3.5 6.4-4.8 10.1-3.5l37.6 15.1c11.8-9.5 25-17 39.2-22.2l5.7-40c.4-3.7 3.7-6.2 7.7-6.2h60.4c4 0 7.3 2.5 7.7 6.2l5.7 40c14.2 5.2 27.4 12.7 39.2 22.2l37.6-15.1c3.7-1.3 8.1 0-10.1 3.5l30.2 52.3c2 3.2 1.2 7.2-1.6 9.4l-32 25zM493.8 450c18.5 0 33.6-15.1 33.6-33.6s-15.1-33.6-33.6-33.6-33.6 15.1-33.6 33.6 15.1 33.6 33.6 33.6z"/>
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

    const filteredTickets = (tickets || []).filter(v =>
        String(v.referenceNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(v.licenseId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(v.policeId || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCSV = () => {
        const headers = ['Reference No.', 'License ID', 'Police ID', 'Total Amount'];
        const rows = filteredTickets.map(v => [
            v.referenceNo || '-',
            v.licenseId || '-',
            v.policeId || '-',
            v.totalAmount || '0.00'
        ]);

        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "paid_fine_tickets.csv");
        link.click();
    };

    const handleExcel = () => {
        const headers = ['Reference No.', 'License ID', 'Police ID', 'Total Amount'];
        const rows = filteredTickets.map(v => [
            v.referenceNo || '-',
            v.licenseId || '-',
            v.policeId || '-',
            v.totalAmount || '0.00'
        ]);

        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "PaidFines");
        XLSX.writeFile(workbook, "paid_fine_tickets.xlsx");
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        const content = `
            <html>
                <head>
                    <title>Paid Fine Tickets | Motor Traffic Department</title>
                    <style>
                        @page { size: portrait; margin: 20mm; }
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; color: #333; }
                        .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
                        .header h1 { margin: 0; font-size: 24px; font-weight: normal; }
                        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                        th, td { border: 1px solid #ccc; padding: 10px; text-align: left; font-size: 13px; }
                        th { background-color: #f8f9fa; font-weight: bold; border-bottom: 2px solid #333; }
                        tr:nth-child(even) { background-color: #f9f9f9; }
                        .footer { margin-top: 20px; font-size: 10px; color: #888; text-align: right; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Paid Fine Tickets | Motor Traffic Department</h1>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Reference No.</th>
                                <th>License ID</th>
                                <th>Police ID</th>
                                <th>Total Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredTickets.map(v => `
                                <tr>
                                    <td>${v.referenceNo || '-'}</td>
                                    <td>${v.licenseId || '-'}</td>
                                    <td>${v.policeId || '-'}</td>
                                    <td>${v.totalAmount || '0.00'}</td>
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
        const doc = new jsPDF('portrait');
        doc.setFontSize(18);
        doc.text('Paid Fine Tickets | Motor Traffic Department', 14, 20);
        doc.setFontSize(10);
        doc.text(`Generated on ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, 28);

        const headers = [['Reference No.', 'License ID', 'Police ID', 'Total Amount']];
        const rows = filteredTickets.map(v => [
            v.referenceNo || '-',
            v.licenseId || '-',
            v.policeId || '-',
            v.totalAmount || '0.00'
        ]);

        autoTable(doc, {
            startY: 35,
            head: headers,
            body: rows,
            theme: 'grid',
            headStyles: { fillColor: [14, 34, 56], textColor: [255, 255, 255] },
            styles: { fontSize: 10 }
        });

        doc.save("paid_fine_tickets.pdf");
    };

    const sidebarWidth = sidebarOpen ? '220px' : '60px';

    return (
        <div className="min-h-screen flex bg-gray-100" style={{ fontFamily: "'Segoe UI', Roboto, sans-serif" }}>

            {/* ======== DETAILS MODAL ======== */}
            {isModalOpen && selectedTicket && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center',
                    alignItems: 'center', zIndex: 1000, padding: '20px'
                }}>
                    <div style={{
                        backgroundColor: 'white', width: '100%', maxWidth: '600px',
                        borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                    }}>
                        {/* Modal Header */}
                        <div style={{
                            backgroundColor: '#17a2b8', color: 'white', padding: '12px 20px',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '18px' }}>
                                <Users size={20} /> Paid Fine Tickets
                            </div>
                            <button onClick={() => setIsModalOpen(false)} style={{
                                background: 'none', border: 'none', color: 'white',
                                cursor: 'pointer', fontSize: '20px', fontWeight: 'bold'
                            }}>&times;</button>
                        </div>
                        
                        {/* Modal Body */}
                        <div style={{ padding: '0', maxHeight: '70vh', overflowY: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <tbody>
                                    {[
                                        { label: 'Reference No', value: selectedTicket.refNo },
                                        { label: 'Police ID', value: selectedTicket.policeId },
                                        { label: 'License ID', value: selectedTicket.licenseId },
                                        { label: 'Vehicle No', value: selectedTicket.vehicleNo },
                                        { label: 'Place', value: selectedTicket.place },
                                        { label: 'Issued Date', value: selectedTicket.issuedDate },
                                        { label: 'Issued Time', value: selectedTicket.issuedTime },
                                        { label: 'Expire Date', value: selectedTicket.expireDate },
                                        { label: 'Court', value: selectedTicket.court },
                                        { label: 'Court Date', value: selectedTicket.courtDate },
                                        { label: 'Fine ID', value: selectedTicket.provisions },
                                        { label: 'Total Amount', value: selectedTicket.totalAmount },
                                        { label: 'Status', value: selectedTicket.status },
                                    ].map((row, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '12px 20px', fontWeight: '600', width: '40%', color: '#333' }}>{row.label}</td>
                                            <td style={{ padding: '12px 20px', color: '#555' }}>{row.value || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Modal Footer */}
                        <div style={{ padding: '15px 20px', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #eee' }}>
                            <button onClick={() => setIsModalOpen(false)} style={{
                                backgroundColor: '#6c757d', color: 'white', border: 'none',
                                padding: '8px 20px', borderRadius: '4px', cursor: 'pointer',
                                fontWeight: '600'
                            }}>Close</button>
                        </div>
                    </div>
                </div>
            )}

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
                        color: item.id === 'paid-fine-tickets' ? '#ffffff' : 'rgba(255,255,255,0.6)',
                        backgroundColor: item.id === 'paid-fine-tickets' ? '#1a7a7a' : 'transparent',
                        border: 'none', cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: sidebarOpen ? 'flex-start' : 'center',
                        gap: '14px', transition: 'all 0.2s', whiteSpace: 'nowrap',
                    }} className="hover:bg-white/10">
                        <span style={{ flexShrink: 0 }}>{item.icon}</span>
                        {sidebarOpen && (
                            <span style={{ fontSize: '14px', fontWeight: '500', color: item.id === 'paid-fine-tickets' ? '#fff' : 'rgba(255,255,255,0.8)' }}>
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
                    <h1 style={{ fontSize: '28px', fontWeight: '400', color: '#1e293b', marginBottom: '6px' }}>Paid Fine Tickets</h1>
                    
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
                        <span>Paid Fine Tickets</span>
                    </div>

                    {/* Table Card */}
                    <div style={{ backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.07)', border: '1px solid #e5e7eb', overflow: 'hidden' }}>

                        <div style={{ padding: '14px 20px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '8px' }}>
                             <Menu size={16} />
                            <span style={{ fontSize: '15px', color: '#1f2937', fontWeight: 600 }}>You can sort data here</span>
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
                                        {['Action ⇅', 'Reference No. ⇅', 'License ID ⇅', 'Police ID ⇅', 'Total Amount ⇅'].map(h => (
                                            <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '700', borderBottom: '2px solid #dee2e6' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTickets.length > 0 ? filteredTickets.map((v, idx) => (
                                        <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
                                            <td style={{ padding: '10px 16px' }}>
                                                <div style={{ display: 'flex', gap: '6px' }}>
                                                    <button onClick={() => handleShowDetails(v.referenceNo)} style={{ backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', padding: '6px', cursor: 'pointer' }}><Info size={14} /></button>
                                                </div>
                                            </td>
                                            <td style={{ padding: '10px 16px' }}>{v.referenceNo}</td>
                                            <td style={{ padding: '10px 16px' }}>{v.licenseId}</td>
                                            <td style={{ padding: '10px 16px' }}>{v.policeId}</td>
                                            <td style={{ padding: '10px 16px' }}>{v.totalAmount}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>No data available in table</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', fontSize: '14px', color: '#212529' }}>
                            <div>Showing {filteredTickets.length > 0 ? 1 : 0} to {filteredTickets.length} of {filteredTickets.length} entries</div>
                            <div style={{ display: 'flex' }}>
                                <button style={{ border: '1px solid #dee2e6', backgroundColor: '#fff', padding: '6px 12px', cursor: 'not-allowed', color: '#6c757d', borderTopLeftRadius: '0.25rem', borderBottomLeftRadius: '0.25rem' }} disabled>Previous</button>
                                <button style={{ border: '1px solid #dee2e6', backgroundColor: '#fff', padding: '6px 12px', cursor: 'not-allowed', color: '#6c757d', marginLeft: '-1px', borderTopRightRadius: '0.25rem', borderBottomRightRadius: '0.25rem' }} disabled>Next</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
