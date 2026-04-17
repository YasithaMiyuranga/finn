import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Menu, Settings, Megaphone, Hourglass, ListOrdered, 
    Coins, LayoutDashboard, FileText, CreditCard, 
    Bell, User, ChevronDown, LogOut, Info, Car
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function ViolationDetails() {
    const navigate = useNavigate();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [violations, setViolations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Adjusted sidebar width to match the PHP version perfectly
    const sidebarWidth = sidebarOpen ? '250px' : '70px';

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
        { id: 'pending-fine', label: "Driver's Pending Fine", icon: <Hourglass size={18} /> },
        { id: 'paid-fine', label: "Driver's Paid Fine", icon: <Coins size={18} /> },
        { id: 'violation-details', label: 'Violation Details', icon: <FileText size={18} /> },
    ];

    const handleNav = (id) => {
        if (id === 'dashboard') navigate('/dashboard/driver');
        if (id === 'pending-fine') navigate('/dashboard/driver/pending-fine');
        if (id === 'paid-fine') navigate('/dashboard/driver/paid-fine');
        if (id === 'violation-details') navigate('/dashboard/driver/violation-details');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userType');
        navigate('/auth/login');
    };

    useEffect(() => {
        const fetchViolations = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:8080/api/Violation/getViolationTypes', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        const mappedData = result.data.map(item => ({
                            id: item.id || '',
                            act: item.slLawReference || '',
                            provision: item.violationDescription || '',
                            points: item.points || 0,
                            severity: item.severityLevel || 'LOW',
                            amount: item.amount ? parseFloat(item.amount).toFixed(2) : "0.00"
                        }));
                        setViolations(mappedData);
                    }
                }
            } catch (error) {
                console.error("Error fetching violations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchViolations();
    }, []);

    const filteredViolations = violations.filter(v =>
        v.act.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.provision.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.id.toString().includes(searchTerm)
    );

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
                                    <td>${v.id || '-'}</td>
                                    <td>${v.act || '-'}</td>
                                    <td>${v.provision || '-'}</td>
                                    <td>${v.points || '0'}</td>
                                    <td>${v.severity || 'LOW'}</td>
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

    const handleCSV = () => {
        const headers = ['Fine ID', 'Section', 'Violation Description', 'Points', 'Severity', 'Amount'];
        const rows = filteredViolations.map(v => [
            v.id || '-',
            v.act || '-',
            v.provision || '-',
            v.points || '0',
            v.severity || 'LOW',
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
            v.id || '-',
            v.act || '-',
            v.provision || '-',
            v.points || '0',
            v.severity || 'LOW',
            v.amount || '0'
        ]);

        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Violations");
        XLSX.writeFile(workbook, "violation_details.xlsx");
    };

    const handlePDF = () => {
        const doc = new jsPDF('landscape');
        doc.setFontSize(18);
        doc.text('Violation Details | Motor Traffic Department', 14, 20);
        doc.setFontSize(10);
        doc.text(`Generated on ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, 28);

        const headers = [['Fine ID', 'Section', 'Violation Description', 'Points', 'Severity', 'Amount']];
        const rows = filteredViolations.map(v => [
            v.id || '-',
            v.act || '-',
            v.provision || '-',
            v.points || '0',
            v.severity || 'LOW',
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

    return (
        <div className="min-h-screen bg-[#f4f6f9] flex flex-col">
            {/* Top Navigation */}
            <nav className="bg-[#0e2238] text-white h-16 flex items-center justify-between px-4 fixed top-0 w-full z-50 shadow-lg">
                <div className="flex items-center gap-4">
                    <Menu className="cursor-pointer hover:opacity-80" size={24} onClick={() => setSidebarOpen(!sidebarOpen)} />
                    <div className="flex items-center gap-2">
                        <div className="bg-white p-1.5 rounded-full flex items-center justify-center w-10 h-10">
                            <i className="fas fa-car text-blue-600 text-xl"></i>
                        </div>
                        <span className="text-white text-xl font-bold">eTRAFFIC</span>
                    </div>
                </div>
                
                <div className="relative">
                    <div 
                        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                        className="flex items-center gap-2 cursor-pointer hover:bg-white/10 px-3 py-2 rounded-lg transition-all"
                    >
                        <span className="text-xs font-bold uppercase tracking-widest">Settings</span>
                        <ChevronDown size={14} className={`transition-transform duration-200 ${isSettingsOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {/* Settings Dropdown */}
                    {isSettingsOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 animate-fadeIn z-[60]">
                            <button 
                                onClick={() => navigate('/dashboard/driver/complete-profile')}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <User size={18} className="text-gray-500" />
                                <span className="font-medium">Edit Profile</span>
                            </button>
                            <div className="my-1 border-t border-gray-100"></div>
                            <button 
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut size={18} />
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            <div className="flex flex-1 pt-16">
                {/* Sidebar */}
                <aside 
                    className="flex flex-col items-center py-2 fixed h-full left-0 z-40 transition-all duration-300"
                    style={{ width: sidebarWidth, backgroundColor: '#0f2439', borderTop: '1px solid #1c344d', overflowX: 'hidden' }}
                >
                    <div className="flex flex-col w-full mt-2">
                        {navItems.map(item => (
                            <button 
                                key={item.id} 
                                onClick={() => handleNav(item.id)} 
                                title={item.label}
                                className="w-full flex items-center transition-colors cursor-pointer"
                                style={{
                                    padding: '16px 20px',
                                    paddingLeft: sidebarOpen ? '20px' : '26px',
                                    justifyContent: 'flex-start',
                                    gap: '15px', 
                                    whiteSpace: 'nowrap', 
                                    border: 'none',
                                    backgroundColor: item.id === 'violation-details' ? '#17a2b8' : 'transparent',
                                    color: item.id === 'violation-details' ? '#ffffff' : '#b2c3d4',
                                }}
                            >
                                <span className="flex-shrink-0" style={{ color: item.id === 'violation-details' ? '#ffffff' : '#b2c3d4' }}>{item.icon}</span>
                                {sidebarOpen && <span style={{ fontSize: '15px', fontWeight: '500' }}>{item.label}</span>}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6 transition-all duration-300" style={{ marginLeft: sidebarWidth }}>
                    <div className="container-fluid mx-auto max-w-7xl">
                        <h1 className="text-3xl font-normal text-gray-800 mb-2 mt-4">Violation Details</h1>
                        
                        <div className="flex items-center text-sm text-gray-500 mb-6">
                            <span 
                                className="cursor-pointer text-blue-500 hover:underline"
                                onClick={() => navigate('/dashboard/driver')}
                            >
                                Dashboard
                            </span>
                            <span className="mx-2">/</span>
                            <span>Violation Details</span>
                        </div>

                        <div className="bg-white rounded shadow-sm border border-gray-200 border-t-0 border-l-0 border-r-0 mb-4">
                            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 text-gray-700 flex items-center gap-2">
                                <ListOrdered size={18} />
                                <span>You can sort data here</span>
                            </div>
                            
                            <div className="p-4">
                                <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
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
                                    <div className="flex items-center gap-2 ml-auto">
                                        <label className="text-sm text-gray-600">Search:</label>
                                        <input 
                                            type="text" 
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:border-blue-400"
                                        />
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-200 text-gray-700 text-sm font-bold text-left border-b border-gray-300">
                                                <th className="py-2.5 px-3 border-r border-white w-24">Fine ID</th>
                                                <th className="py-2.5 px-3 border-r border-white w-48">Section of Act</th>
                                                <th className="py-2.5 px-3 border-r border-white">Provision</th>
                                                <th className="py-2.5 px-3 border-r border-white">Points</th>
                                                <th className="py-2.5 px-3 border-r border-white text-center">Severity</th>
                                                <th className="py-2.5 px-3">Fine Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loading ? (
                                                <tr>
                                                    <td colSpan="4" className="py-8 text-center text-gray-500 text-sm font-medium animate-pulse">Loading violation details...</td>
                                                </tr>
                                            ) : filteredViolations.length > 0 ? (
                                                filteredViolations.map((v, index) => (
                                                     <tr key={index} className="border-b border-gray-200 text-sm text-gray-700 hover:bg-gray-50">
                                                         <td className="py-3 px-3">{v.id}</td>
                                                         <td className="py-3 px-3">{v.act}</td>
                                                         <td className="py-3 px-3">{v.provision}</td>
                                                         <td className="py-3 px-3 font-semibold">{v.points}</td>
                                                         <td className="py-3 px-3 text-center">
                                                             <span style={{ 
                                                                 backgroundColor: getSeverityColor(v.severity), 
                                                                 color: v.severity === 'MEDIUM' ? '#000' : '#fff', 
                                                                 padding: '2px 10px', 
                                                                 borderRadius: '12px', 
                                                                 fontSize: '11px', 
                                                                 fontWeight: 'bold',
                                                                 display: 'inline-block',
                                                                 minWidth: '70px'
                                                            }}>
                                                                {v.severity}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-3">{v.amount}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="py-8 text-center text-gray-500 text-sm font-medium">No violation data found.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                        <tfoot className="bg-gray-300 text-gray-700 text-sm font-bold text-left border-t border-gray-300">
                                            <tr>
                                                <th className="py-2.5 px-3 border-r border-white">Fine ID</th>
                                                <th className="py-2.5 px-3 border-r border-white">Section of Act</th>
                                                <th className="py-2.5 px-3 border-r border-white">Provision</th>
                                                <th className="py-2.5 px-3 border-r border-white">Points</th>
                                                <th className="py-2.5 px-3 border-r border-white text-center">Severity</th>
                                                <th className="py-2.5 px-3">Fine Amount</th>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                                
                                <div className="flex justify-between items-center mt-4">
                                    <div className="text-sm text-gray-600">
                                        Showing {filteredViolations.length > 0 ? 1 : 0} to {filteredViolations.length} of {filteredViolations.length} entries
                                    </div>
                                    <div className="flex border border-gray-300 rounded text-sm overflow-hidden shadow-sm">
                                        <button className="px-3 py-1.5 text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
                                        <button className="px-3 py-1.5 bg-[#007bff] text-white border-l border-r border-blue-600">1</button>
                                        <button className="px-3 py-1.5 text-blue-500 bg-white hover:bg-gray-50 border-l border-gray-300 disabled:opacity-50" disabled>Next</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
