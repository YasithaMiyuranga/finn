import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Menu, ChevronDown, User, LogOut, Check, LayoutDashboard, Hourglass, Coins, FileText } from 'lucide-react';

const PayFine = () => {
    const { refNo } = useParams();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [fine, setFine] = useState(null);
    const [driver, setDriver] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentParams, setPaymentParams] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const userId = localStorage.getItem('userId');
                if (!token || !userId) {
                    console.error("Auth data missing");
                    return;
                }

                // 1. Fetch payment parameters (and hash) from backend
                const response = await fetch(`http://localhost:8080/api/traffic_fine/payment-params/${refNo}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                console.log("Raw Response Status:", response.status);

                if (response.ok) {
                    const result = await response.json();
                    console.log("Response Result Data:", result);

                    if (result.success && result.data) {
                        setPaymentParams(result.data);
                        setFine(result.data.fineDetails);
                        
                        // 2. Fetch driver profile
                        const driverRes = await fetch(`http://localhost:8080/api/Driver/getDriverByUserId/${userId}`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        if (driverRes.ok) {
                            const driverData = await driverRes.json();
                            setDriver(driverData.data);
                        }
                    }
                }
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [refNo]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handleConfirmPay = () => {
        if (!window.payhere || !paymentParams) {
            alert("Payment system is still loading. Please try again in a moment.");
            return;
        }

        // PayHere Payment Object
        const payment = {
            sandbox: true,
            merchant_id: paymentParams.merchantId,
            return_url: "http://localhost:5173/dashboard/driver/paid-fine",
            cancel_url: "http://localhost:5173/dashboard/driver/pending-fine",
            notify_url: "http://localhost:8080/api/traffic_fine/notify", // This won't work on localhost but is required
            order_id: paymentParams.orderId,
            items: "Traffic Fine #" + paymentParams.orderId,
            amount: paymentParams.amount,
            currency: paymentParams.currency,
            hash: paymentParams.hash,
            first_name: driver ? driver.firstName : "Driver",
            last_name: driver ? driver.lastName : "",
            email: "driver@example.com",
            phone: driver ? driver.mobileNo : "0112345678",
            address: "N/A",
            city: "Colombo",
            country: "Sri Lanka",
            delivery_address: "N/A",
            delivery_city: "Colombo",
            delivery_country: "Sri Lanka",
            custom_1: "",
            custom_2: ""
        };

        // PayHere Callbacks
        window.payhere.onCompleted = async function onCompleted(orderId) {
            console.log("Payment completed. OrderID:" + orderId);
            try {
                const token = localStorage.getItem('token');
                // Call backend to update status to PAID
                await fetch(`http://localhost:8080/api/traffic_fine/pay-fine/${orderId}`, {
                    method: 'PUT',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                navigate('/dashboard/driver/paid-fine');
            } catch (err) {
                console.error("Fail to update DB:", err);
                navigate('/dashboard/driver/paid-fine');
            }
        };

        window.payhere.onDismissed = function onDismissed() {
            console.log("Payment dismissed");
        };

        window.payhere.onError = function onError(error) {
            console.log("Error:"  + error);
        };

        // Start Payment
        window.payhere.startPayment(payment);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium">Loading secure payment portal...</p>
            </div>
        );
    }

    if (!fine) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-center">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i className="fas fa-exclamation-triangle text-red-500 text-3xl"></i>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Ticket Error</h2>
                    <p className="text-gray-500 mb-8 px-4 text-sm leading-relaxed">Failed to initialize payment parameters. Please try again from the dashboard.</p>
                    <button onClick={() => navigate('/dashboard/driver/pending-fine')} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg">Back to Dashboard</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f4f6f9] flex flex-col font-sans">
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
                    <div onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="flex items-center gap-2 cursor-pointer hover:bg-white/10 px-3 py-2 rounded-lg transition-all">
                        <span className="text-xs font-bold uppercase tracking-widest">Settings</span>
                        <ChevronDown size={14} className={`transition-transform duration-200 ${isSettingsOpen ? 'rotate-180' : ''}`} />
                    </div>
                    {isSettingsOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-[60]">
                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                <LogOut size={18} />
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            <div className="flex flex-1 pt-14 bg-[#f8f9fa]">
                <main className="flex-1 p-8 flex justify-center items-start pt-10">
                    <div className="w-full max-w-2xl shadow-2xl rounded-lg overflow-hidden border border-gray-100 animate-slideUp" style={{ backgroundColor: '#f9f9f9' }}>
                        <div className="py-6 border-b border-gray-200" style={{ backgroundColor: '#eeeeee' }}>
                            <h2 className="text-2xl font-bold text-center text-[#333] uppercase tracking-wide">
                                Pay your fine ticket through PayHere
                            </h2>
                        </div>

                        <div className="p-8">
                            <div className="mb-6">
                                <span className="text-sm font-medium text-gray-500">Reference No : </span>
                                <span className="text-sm font-bold text-gray-800">{fine.refNo}</span>
                            </div>

                            <div className="border border-gray-200 rounded-sm overflow-hidden mb-8" style={{ backgroundColor: '#f0f0f0' }}>
                                <table className="w-full text-[15px] border-collapse">
                                    <tbody>
                                        {[
                                            { label: 'License ID', value: fine.licenseId },
                                            { label: 'Driver Name', value: driver ? `${driver.firstName} ${driver.lastName}` : 'N/A' },
                                            { label: 'Class of Vehicle', value: fine.classOfVehicle },
                                            { label: 'Provision', value: fine.provisions },
                                            { label: 'Vehicle No', value: fine.vehicleNo },
                                            { label: 'Place', value: fine.place },
                                            { label: 'Issue Date', value: fine.issuedDate },
                                            { label: 'Total Amount', value: `${(parseFloat(fine.totalAmount) || 0).toFixed(2)} LKR` },
                                        ].map((row, idx) => (
                                            <tr key={idx} className="border-b border-gray-200 transition-colors" style={{ backgroundColor: idx % 2 === 0 ? '#f0f0f0' : '#f5f5f5' }}>
                                                <td className="py-3 px-8 text-[#555] w-[40%] font-medium">{row.label}</td>
                                                <td className="py-3 px-8 text-[#333] font-semibold">{row.value || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex flex-col items-center gap-4 bg-blue-50/50 p-6 rounded-xl border border-blue-100 mb-8">
                                <div className="flex items-center gap-3 text-blue-700 font-bold">
                                    <i className="fas fa-shield-alt text-xl"></i>
                                    <span>Secure Payment with PayHere Sandbox</span>
                                </div>
                                <p className="text-xs text-gray-500 text-center">You will be redirected to the secure PayHere payment gateway to complete your transaction using test card details.</p>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button onClick={() => navigate(-1)} className="px-6 py-2 text-white rounded-[4px] font-medium transition-all shadow-sm" style={{ backgroundColor: '#95a5a6' }}>
                                    Cancel
                                </button>
                                <button onClick={handleConfirmPay} className="px-8 py-2 text-white rounded-[4px] font-bold transition-all shadow-lg active:scale-95 flex items-center gap-2" style={{ backgroundColor: '#007bff' }}>
                                    <i className="fas fa-credit-card"></i>
                                    Confirm & Pay
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PayFine;
