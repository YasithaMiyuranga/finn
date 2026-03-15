import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Menu, ChevronDown, LogOut,
    PlusCircle, History, FileText, Flag, Gauge, Bell, Search
} from 'lucide-react';

export default function AddNewFine() {
    const navigate = useNavigate();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [officerDetails, setOfficerDetails] = useState({
        officerId: "",
        officerName: "",
        policeStation: "",
        court: ""
    });

    const [driverDetails, setDriverDetails] = useState({
        driverId: "",
        licenseId: "",
        fullName: "",
        address: "",
        vehicleClass: ""
    });

    const [violationTypes, setViolationTypes] = useState([]);

    const [fineInfo, setFineInfo] = useState({
        place: "",
        vehicleNo: "",
        provisionId: "",
        amount: ""
    });

    useEffect(() => {
        // Fetch currently logged in police officer details
        const fetchOfficerProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const userId = localStorage.getItem('userId');
                if (!userId || !token) return;

                const res = await fetch('http://localhost:8080/api/police_officers/getPoliceOfficers', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (res.ok) {
                    const data = await res.json();
                    const officers = data.data || (Array.isArray(data) ? data : []);
                    
                    // Match either userId (ModelMapper mapped), user (direct object), or user.id
                    const me = officers.find(o => 
                        String(o.userId) === String(userId) || 
                        String(o.user) === String(userId) || 
                        (o.user && String(o.user.id || o.user.userId || o.user) === String(userId)) ||
                        String(o.id) === String(userId) // fallback if the officer ID somehow matches log-in ID
                    );

                    if (me) {
                        setOfficerDetails({
                            officerDbId: me.id,
                            officerId: me.policeid || me.id || "",
                            officerName: me.fullName || me.officerName || "",
                            policeStation: me.policeStation || "",
                            court: me.court || ""
                        });
                    }
                }
            } catch (err) {
                console.error("Failed to load officer details", err);
            }
        };

        const fetchViolations = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:8080/api/Violation/getViolationTypes', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setViolationTypes(data.data || []);
                }
            } catch (err) {
                console.error("Failed to load violations", err);
            }
        };

        fetchOfficerProfile();
        fetchViolations();
    }, []);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:8080/api/Driver/getDrivers', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                const drivers = data.data || [];
                const matched = drivers.find(d => String(d.licenseNumber).toLowerCase() === searchQuery.trim().toLowerCase());
                
                if (matched) {
                    setDriverDetails({
                        driverId: matched.id,
                        licenseId: matched.licenseNumber || "",
                        fullName: `${matched.firstName || ''} ${matched.lastName || ''}`.trim(),
                        address: matched.address || matched.homeAddress || "",
                        vehicleClass: matched.classOfVehicle || matched.vehicleClass || "A1, B" // fallback
                    });
                } else {
                    alert('Driver not found for the entered license number.');
                    setDriverDetails({ driverId: "", licenseId: "", fullName: "", address: "", vehicleClass: "" });
                }
            }
        } catch (err) {
            console.error("Search failed", err);
            alert('Error occurred while searching for driver.');
        }
    };

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <Gauge size={22} /> },
        { id: 'add-new-fine', label: 'Add New Fine', icon: <PlusCircle size={22} /> },
        { id: 'drivers-past-fine', label: "Driver's Past Fine", icon: <History size={22} /> },
        { id: 'revenue-license', label: 'Revenue License', icon: <FileText size={22} /> },
        { id: 'view-reported-fine', label: 'View Reported Fine', icon: <Flag size={22} /> },
    ];

    const handleNav = (id) => {
        if (id === 'dashboard') navigate('/dashboard/policeofficer');
        if (id === 'add-new-fine') navigate('/dashboard/policeofficer/add-new-fine');
        if (id === 'view-reported-fine') navigate('/dashboard/policeofficer/view-reported-fine');
        // Add more routing later
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/auth/login');
    };

    const sidebarWidth = sidebarOpen ? '250px' : '65px';

    const renderInput = (label, placeholder, disabled = false, type = "text", value = "", onChange = undefined) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
            <label style={{ fontSize: '14px', color: '#212529', fontWeight: '500' }}>{label}</label>
            <input 
                type={type} 
                placeholder={placeholder} 
                disabled={disabled}
                readOnly={disabled || (value !== undefined && onChange === undefined)}
                value={value}
                onChange={onChange}
                style={{
                    padding: '10px 14px',
                    borderRadius: '4px',
                    border: '1px solid #ced4da',
                    backgroundColor: disabled ? '#e9ecef' : '#fff',
                    color: disabled ? '#6c757d' : '#495057',
                    outline: 'none',
                    fontSize: '14px',
                    width: '100%'
                }}
            />
        </div>
    );

    const renderSelect = (label, options, value, onChange) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
            <label style={{ fontSize: '14px', color: '#212529', fontWeight: '500' }}>{label}</label>
            <select 
                value={value}
                onChange={onChange}
                style={{
                    padding: '10px 14px',
                    borderRadius: '4px',
                    border: '1px solid #ced4da',
                    backgroundColor: '#fff',
                    color: '#495057',
                    outline: 'none',
                    fontSize: '14px',
                    width: '100%',
                    appearance: 'auto'
                }}
            >
                {options.map((opt, i) => {
                    const val = typeof opt === 'object' ? opt.value : opt;
                    const display = typeof opt === 'object' ? opt.label : opt;
                    return (
                        <option key={i} value={val}>{display}</option>
                    )
                })}
            </select>
        </div>
    );

    const handleIssueFine = async () => {
        if (!driverDetails.driverId || !officerDetails.officerDbId || !fineInfo.provisionId || !fineInfo.amount) {
            alert("Please complete driver search, ensure officer is loaded, and select a provision.");
            return;
        }

        const payload = {
            fineNumber: "FN-" + Date.now().toString().slice(-6),
            issueDate: new Date().toISOString().split('T')[0],
            issueTime: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ":00",
            location: (fineInfo.place || "On Road") + (fineInfo.vehicleNo ? ` (Veh: ${fineInfo.vehicleNo})` : ""),
            fineAmount: parseInt(fineInfo.amount) || 0,
            outstandingAmount: parseInt(fineInfo.amount) || 0,
            paymentStatus: "UNPAID",
            paymentDueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            isNotificationSent: false,
            driver: driverDetails.driverId,
            policeOfficer: officerDetails.officerDbId,
            violationType: parseInt(fineInfo.provisionId)
        };

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:8080/api/traffic_fine/saveTrafficFine', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("Fine issued successfully!");
                navigate('/dashboard/policeofficer/view-reported-fine');
            } else {
                const data = await res.json().catch(() => ({}));
                alert("Failed to issue fine: " + (data.message || res.statusText));
            }
        } catch (err) {
            console.error(err);
            alert("Network error issuing fine.");
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-100" style={{ fontFamily: "'Segoe UI', Roboto, sans-serif" }}>

            {/* ======== SIDEBAR ======== */}
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
                    paddingLeft: sidebarOpen ? '20px' : '0', gap: '12px', whiteSpace: 'nowrap',
                }} title="Toggle Menu">
                    <Menu size={22} style={{ flexShrink: 0 }} />
                </button>

                {navItems.map(item => (
                    <button key={item.id} onClick={() => handleNav(item.id)} title={item.label} style={{
                        width: '100%', padding: '16px 0',
                        paddingLeft: sidebarOpen ? '20px' : '0',
                        color: item.id === 'add-new-fine' ? '#ffffff' : 'rgba(255,255,255,0.7)',
                        backgroundColor: item.id === 'add-new-fine' ? '#17a2b8' : 'transparent',
                        border: 'none', cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: sidebarOpen ? 'flex-start' : 'center',
                        gap: '14px', transition: 'all 0.2s', whiteSpace: 'nowrap',
                    }} className="hover:bg-white/10">
                        <span style={{ flexShrink: 0 }}>{item.icon}</span>
                        {sidebarOpen && (
                            <span style={{ fontSize: '15px', fontWeight: '500', color: item.id === 'add-new-fine' ? '#fff' : 'rgba(255,255,255,0.9)' }}>
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
                    backgroundColor: '#0e2238', height: '60px', display: 'flex',
                    alignItems: 'center', justifyContent: 'space-between',
                    padding: '0 24px', position: 'sticky', top: 0, zIndex: 40,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ backgroundColor: '#dc2626', padding: '6px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center' }}>
                            <Bell size={18} fill="white" color="white" />
                        </div>
                        <span style={{ color: 'white', fontWeight: '800', fontSize: '20px', letterSpacing: '2px' }}>STFMS</span>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} style={{
                            display: 'flex', alignItems: 'center', gap: '6px', color: 'white',
                            background: 'none', border: 'none', cursor: 'pointer', padding: '8px 12px',
                            borderRadius: '6px', fontSize: '14px', fontWeight: '700',
                            letterSpacing: '1px', textTransform: 'uppercase',
                        }} className="hover:bg-white/10 transition-all">
                            SETTINGS <ChevronDown size={14} style={{ transform: isSettingsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                        </button>
                        {isSettingsOpen && (
                            <div style={{
                                position: 'absolute', right: 0, top: '110%', backgroundColor: 'white',
                                borderRadius: '10px', boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                                border: '1px solid #e5e7eb', minWidth: '160px', padding: '8px 0', zIndex: 100
                            }}>
                                <button onClick={handleLogout} style={{
                                    width: '100%', textAlign: 'left', padding: '10px 16px',
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: '#ef4444', fontSize: '14px', fontWeight: '600',
                                    display: 'flex', alignItems: 'center', gap: '8px'
                                }} className="hover:bg-red-50 transition-colors">
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </nav>

                {/* PAGE CONTENT */}
                <div style={{ padding: '24px 32px' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: '400', marginBottom: '16px', color: '#212529' }}>Add New Fine</h1>
                    
                    {/* Breadcrumb */}
                    <div style={{ 
                        backgroundColor: '#e9ecef', padding: '12px 16px', borderRadius: '4px',
                        marginBottom: '24px', fontSize: '15px', color: '#6c757d'
                    }}>
                        <a href="/dashboard/policeofficer" style={{ color: '#007bff', textDecoration: 'none' }}>Dashboard</a> / Add New Fine
                    </div>

                    {/* Main Form Card */}
                    <div style={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid rgba(0,0,0,.125)', 
                        borderRadius: '4px',
                        padding: '40px 48px'
                    }}>

                        {/* Search Driver Details */}
                        <div style={{ marginBottom: '32px' }}>
                            <h3 style={{ fontSize: '24px', fontWeight: '400', marginBottom: '16px' }}>Search Driver Details</h3>
                            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', maxWidth: '50%' }}>
                                <input 
                                    type="text" 
                                    placeholder="Driving Licence No" 
                                    style={{
                                        flex: 1,
                                        padding: '10px 14px',
                                        borderRadius: '4px',
                                        border: '1px solid #ced4da',
                                        outline: 'none',
                                        fontSize: '14px'
                                    }}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <button onClick={handleSearch} style={{
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '4px',
                                fontSize: '15px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                cursor: 'pointer'
                            }}>
                                <Search size={16} /> Search
                            </button>
                        </div>

                        {/* Driver Details */}
                        <div style={{ marginBottom: '32px' }}>
                            <h3 style={{ fontSize: '24px', fontWeight: '400', marginBottom: '16px' }}>Driver Details</h3>
                            <div style={{ display: 'flex', gap: '24px', marginBottom: '16px' }}>
                                {renderInput("Licence ID", "Licence ID", true, "text", driverDetails.licenseId)}
                                {renderInput("Driver Full Name", "Driver Full Name", true, "text", driverDetails.fullName)}
                            </div>
                            <div style={{ display: 'flex', gap: '24px' }}>
                                {renderInput("Driver Address", "Driver Address", true, "text", driverDetails.address)}
                                {renderInput("Class of Vehicle", "Example: A1, A, B1, B, C1, C,...etc", true, "text", driverDetails.vehicleClass)}
                            </div>
                        </div>

                        {/* Police Officer Details */}
                        <div style={{ marginBottom: '32px' }}>
                            <h3 style={{ fontSize: '24px', fontWeight: '400', marginBottom: '16px' }}>Police Officer Details</h3>
                            <div style={{ display: 'flex', gap: '24px', marginBottom: '16px' }}>
                                {renderInput("Police Officer ID", "Police Officer ID", true, "text", officerDetails.officerId)}
                                {renderInput("Police Officer Name", "Police Officer Name", true, "text", officerDetails.officerName)}
                            </div>
                            <div style={{ display: 'flex', gap: '24px' }}>
                                {renderInput("Police Station", "Police Station", true, "text", officerDetails.policeStation)}
                                {renderInput("Court", "Court", true, "text", officerDetails.court)}
                            </div>
                        </div>

                        {/* Dates & Time */}
                        <div style={{ marginBottom: '32px' }}>
                            <h3 style={{ fontSize: '24px', fontWeight: '400', marginBottom: '16px' }}>Dates & Time</h3>
                            <div style={{ display: 'flex', gap: '24px', marginBottom: '16px' }}>
                                {renderInput("Issue Date", "Issue Date", true, "date", new Date().toISOString().split('T')[0])}
                                {renderInput("Issue Time", "Issue Time", true, "time", new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }))}
                            </div>
                            <div style={{ display: 'flex', gap: '24px' }}>
                                {renderInput("Expire Date", "Expire Date", true, "date", new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])}
                                {renderInput("Court Date", "Court Date", true, "date", new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])}
                            </div>
                        </div>

                        {/* Fine Information */}
                        <div style={{ marginBottom: '40px' }}>
                            <h3 style={{ fontSize: '24px', fontWeight: '400', marginBottom: '16px' }}>Fine Information</h3>
                            <div style={{ display: 'flex', gap: '24px', marginBottom: '16px' }}>
                                {renderInput("Place", "Place", false, "text", fineInfo.place, (e) => setFineInfo({...fineInfo, place: e.target.value}))}
                                {renderInput("Vehicle No", "Vehicle No", false, "text", fineInfo.vehicleNo, (e) => setFineInfo({...fineInfo, vehicleNo: e.target.value}))}
                            </div>
                            <div style={{ display: 'flex', gap: '24px' }}>
                                {renderSelect(
                                    "Select Provision", 
                                    [
                                        { label: "Please Select Provision", value: "" }, 
                                        ...violationTypes.map(v => ({
                                            label: `${v.slLawReference} - ${v.violationDescription}`,
                                            value: v.id
                                        }))
                                    ], 
                                    fineInfo.provisionId, 
                                    (e) => {
                                        const selectedId = e.target.value;
                                        const found = violationTypes.find(v => String(v.id) === String(selectedId));
                                        setFineInfo({...fineInfo, provisionId: selectedId, amount: found ? found.amount : ""});
                                    }
                                )}
                                {renderInput("Total Fine Amount", "Amount", true, "text", fineInfo.amount)}
                            </div>
                        </div>

                        {/* Issue Fine Button */}
                        <button 
                            onClick={handleIssueFine}
                            style={{
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '4px',
                            fontSize: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer'
                        }}>
                            <PlusCircle size={18} /> Issue Fine
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
}
