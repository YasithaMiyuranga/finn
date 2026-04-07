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
    const [selectedViolations, setSelectedViolations] = useState([]); // List of added violations

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
        issuedDate: new Date().toISOString().split('T')[0],
        issuedTime: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        expireDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        courtDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        court: "",
        currentSelectedViolation: "" // Temporary selection
    });

    const handleAddViolation = () => {
        if (!fineInfo.currentSelectedViolation) {
            alert("Please select a violation first.");
            return;
        }

        const violation = violationTypes.find(v => String(v.id) === String(fineInfo.currentSelectedViolation));
        if (violation) {
            // Check if already added
            if (selectedViolations.find(v => v.id === violation.id)) {
                alert("This violation is already added.");
                return;
            }

            setSelectedViolations([...selectedViolations, violation]);
            setFineInfo({ ...fineInfo, currentSelectedViolation: "" });
        }
    };

    const handleRemoveViolation = (id) => {
        setSelectedViolations(selectedViolations.filter(v => v.id !== id));
    };

    const totalFineAmount = selectedViolations.reduce((sum, v) => sum + (parseFloat(v.amount) || 0), 0);

    useEffect(() => {
        if (officerDetails.court) {
            setFineInfo(prev => ({ ...prev, court: officerDetails.court }));
        }
    }, [officerDetails.court]);

    useEffect(() => {
        // Fetch currently logged in police officer details
        const fetchOfficerProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const userId = localStorage.getItem('userId');
                if (!userId || !token) return;

                console.log("Fetching profile for user ID:", userId);

                const res = await fetch('http://localhost:8080/api/police_officers/getPoliceOfficers', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    const officers = data.data || (Array.isArray(data) ? data : []);

                    // Match logged in user with an officer record
                    const me = officers.find(o => {
                        const oUserId = o.userId || (o.user && (o.user.id || o.user.userId || o.user));
                        return String(oUserId) === String(userId);
                    });

                    if (me) {
                        console.log("Matched officer record details:", me);
                        const dbId = me.id || me.officerId || me.policeid;
                        setOfficerDetails({
                            officerDbId: dbId,
                            officerId: me.policeid || me.id || "",
                            officerName: me.fullName || me.officerName || "",
                            policeStation: me.policeStation || "",
                            court: me.court || ""
                        });
                        console.log("Internal Officer DB ID Set to:", dbId);
                    } else {
                        console.warn("No officer record found for user ID:", userId);
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
            const res = await fetch(`http://localhost:8080/api/Driver/getByLicense/${searchQuery.trim()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                const result = await res.json();
                const matched = result.data;

                if (matched) {
                    setDriverDetails({
                        driverId: matched.id,
                        licenseId: matched.licenseNumber || "",
                        fullName: `${matched.firstName || ''} ${matched.lastName || ''}`.trim(),
                        address: matched.address || "",
                        vehicleClass: matched.classOfVehicle || "Not specified"
                    });
                } else {
                    alert('Driver not found for the entered license number.');
                    setDriverDetails({ driverId: "", licenseId: "", fullName: "", address: "", vehicleClass: "" });
                }
            } else {
                alert('Driver details not found.');
                setDriverDetails({ driverId: "", licenseId: "", fullName: "", address: "", vehicleClass: "" });
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
        if (!driverDetails.driverId) {
            alert("Please search for a driver first using a valid license number.");
            return;
        }
        if (!officerDetails.officerDbId) {
            alert("Police officer details not fully loaded. Please refresh or re-login.");
            return;
        }
        if (selectedViolations.length === 0) {
            alert("Please add at least one violation.");
            return;
        }

        console.log("--- Issuing Multiple Fines ---");
        const token = localStorage.getItem('token');
        let successCount = 0;
        let failCount = 0;

        // Loop through each selected violation and send a separate request
        for (const violation of selectedViolations) {
            const payload = {
                policeId: String(officerDetails.officerId),
                licenseId: String(driverDetails.licenseId),
                vehicleNo: String(fineInfo.vehicleNo || "N/A"),
                classOfVehicle: String(driverDetails.vehicleClass || "Not specified"),
                place: String(fineInfo.place || "Unknown"),
                issuedDate: fineInfo.issuedDate,
                issuedTime: fineInfo.issuedTime.includes(':') && fineInfo.issuedTime.split(':').length === 2 ? fineInfo.issuedTime + ":00" : fineInfo.issuedTime,
                expireDate: fineInfo.expireDate,
                court: String(fineInfo.court || officerDetails.court || "Kegalla"),
                courtDate: fineInfo.courtDate,
                provisions: String(violation.id || violation.violation_id || ""), // Send individual ID as string
                totalAmount: parseFloat(violation.amount) || 0, // Send individual amount
                status: "pending",

                // IDs for relations in backend
                driverId: parseInt(driverDetails.driverId),
                officerId: parseInt(officerDetails.officerDbId),
                violationId: parseInt(violation.id)
            };

            console.log(`Submitting fine for: ${violation.violationDescription}`, payload);

            try {
                const res = await fetch('http://localhost:8080/api/traffic_fine/saveTrafficFine', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });

                const result = await res.json().catch(() => ({}));
                if (res.ok && result.success !== false) {
                    successCount++;
                } else {
                    console.error(`Failed to issue fine for ${violation.violationDescription}:`, result);
                    failCount++;
                }
            } catch (err) {
                console.error("Fetch Error:", err);
                failCount++;
            }
        }

        if (failCount === 0) {
            alert(`Successfully issued ${successCount} fine(s)!`);
            navigate('/dashboard/policeofficer/view-reported-fine');
        } else if (successCount > 0) {
            alert(`Issued ${successCount} fine(s) successfully, but ${failCount} failed. Please check the reported fines.`);
            navigate('/dashboard/policeofficer/view-reported-fine');
        } else {
            alert("Failed to issue fines. Please check your input validation.");
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
                        <div style={{ backgroundColor: 'white', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <i className="fas fa-car text-blue-600 text-lg"></i>
                        </div>
                        <span style={{ color: 'white', fontWeight: '800', fontSize: '20px', letterSpacing: '2px' }}>eTRAFFIC</span>
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
                                {renderInput("Court", "Court", false, "text", fineInfo.court, (e) => setFineInfo({ ...fineInfo, court: e.target.value }))}
                            </div>
                        </div>

                        {/* Dates & Time */}
                        <div style={{ marginBottom: '32px' }}>
                            <h3 style={{ fontSize: '24px', fontWeight: '400', marginBottom: '16px' }}>Dates & Time</h3>
                            <div style={{ display: 'flex', gap: '24px', marginBottom: '16px' }}>
                                {renderInput("Issue Date", "Issue Date", false, "date", fineInfo.issuedDate, (e) => setFineInfo({ ...fineInfo, issuedDate: e.target.value }))}
                                {renderInput("Issue Time", "Issue Time", false, "time", fineInfo.issuedTime, (e) => setFineInfo({ ...fineInfo, issuedTime: e.target.value }))}
                            </div>
                            <div style={{ display: 'flex', gap: '24px' }}>
                                {renderInput("Expire Date", "Expire Date", false, "date", fineInfo.expireDate, (e) => setFineInfo({ ...fineInfo, expireDate: e.target.value }))}
                                {renderInput("Court Date", "Court Date", false, "date", fineInfo.courtDate, (e) => setFineInfo({ ...fineInfo, courtDate: e.target.value }))}
                            </div>
                        </div>

                        {/* Fine Information */}
                        <div style={{ marginBottom: '40px' }}>
                            <h3 style={{ fontSize: '24px', fontWeight: '400', marginBottom: '16px' }}>Fine Information</h3>
                            <div style={{ display: 'flex', gap: '24px', marginBottom: '16px' }}>
                                {renderInput("Place", "Place", false, "text", fineInfo.place, (e) => setFineInfo({ ...fineInfo, place: e.target.value }))}
                                {renderInput("Vehicle No", "Vehicle No", false, "text", fineInfo.vehicleNo, (e) => setFineInfo({ ...fineInfo, vehicleNo: e.target.value }))}
                            </div>
                            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-end', marginBottom: '24px' }}>
                                <div style={{ flex: 2 }}>
                                    {renderSelect(
                                        "Select Provision",
                                        [
                                            { label: "Please Select Provision", value: "" },
                                            ...violationTypes.map(v => ({
                                                label: `${v.slLawReference} - ${v.violationDescription} (Rs. ${v.amount})`,
                                                value: v.id
                                            }))
                                        ],
                                        fineInfo.currentSelectedViolation,
                                        (e) => setFineInfo({ ...fineInfo, currentSelectedViolation: e.target.value })
                                    )}
                                </div>
                                <button 
                                    onClick={handleAddViolation}
                                    style={{
                                        backgroundColor: '#28a745',
                                        color: 'white',
                                        border: 'none',
                                        padding: '10px 24px',
                                        borderRadius: '4px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        height: '42px'
                                    }}
                                >
                                    Add Violation
                                </button>
                            </div>

                            {/* Violations Table */}
                            {selectedViolations.length > 0 && (
                                <div style={{ border: '1px solid #dee2e6', borderRadius: '4px', overflow: 'hidden', marginBottom: '24px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
                                        <thead>
                                            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
                                                <th style={{ textAlign: 'left', padding: '12px', fontSize: '14px' }}>Violation</th>
                                                <th style={{ textAlign: 'right', padding: '12px', fontSize: '14px' }}>Amount (Rs.)</th>
                                                <th style={{ textAlign: 'center', padding: '12px', fontSize: '14px' }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedViolations.map((v, idx) => (
                                                <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                                                    <td style={{ padding: '12px', fontSize: '14px' }}>{v.violationDescription}</td>
                                                    <td style={{ textAlign: 'right', padding: '12px', fontSize: '14px' }}>{parseFloat(v.amount).toLocaleString()}.00</td>
                                                    <td style={{ textAlign: 'center', padding: '12px' }}>
                                                        <button 
                                                            onClick={() => handleRemoveViolation(v.id)}
                                                            style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', fontSize: '18px' }}
                                                            title="Remove"
                                                        >
                                                            &times;
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr style={{ backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>
                                                <td style={{ padding: '12px', fontSize: '14px' }}>Total Amount</td>
                                                <td style={{ textAlign: 'right', padding: '12px', fontSize: '16px', color: '#007bff' }}>{totalFineAmount.toLocaleString()}.00</td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '24px' }}>
                                {renderInput("Total Fine Amount (Auto)", "Total Amount will appear here", true, "text", `${totalFineAmount.toLocaleString()}.00`)}
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
