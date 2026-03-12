import { useState, useEffect } from 'react';
import { CreditCard, Calendar, MapPin, AlertCircle, Check, Download } from 'lucide-react';
import paymentService from '../../services/paymentService';
import toast, { Toaster } from 'react-hot-toast';

export default function FinePaymentPage() {
    const [fines, setFines] = useState([]);
    const [selectedFines, setSelectedFines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('unpaid'); // 'all', 'unpaid', 'paid'
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    // Mock driver ID - replace with actual logged-in driver
    const driverId = 1;

    useEffect(() => {
        fetchFines();
    }, [filter]);

    const fetchFines = async () => {
        setLoading(true);
        try {
            let data;
            if (filter === 'unpaid') {
                data = await paymentService.getUnpaidFines(driverId);
            } else if (filter === 'paid') {
                data = await paymentService.getPaymentHistory(driverId);
            } else {
                data = await paymentService.getAllFines();
            }

            // Mock data for demonstration
            const mockFines = [
                {
                    fineId: 1,
                    fineNumber: 'TF-2025-001234',
                    violationType: 'Speed Violation',
                    violationDetails: 'Driving 80km/h in 50km/h zone',
                    fineAmount: 2500,
                    location: 'Galle Road, Colombo',
                    violationDate: '2025-01-15',
                    dueDate: '2025-02-15',
                    paymentStatus: 'UNPAID',
                    driverId: 1
                },
                {
                    fineId: 2,
                    fineNumber: 'TF-2025-001456',
                    violationType: 'No Helmet',
                    violationDetails: 'Riding motorcycle without helmet',
                    fineAmount: 1000,
                    location: 'Kandy Road',
                    violationDate: '2025-01-18',
                    dueDate: '2025-02-18',
                    paymentStatus: 'UNPAID',
                    driverId: 1
                },
                {
                    fineId: 3,
                    fineNumber: 'TF-2024-008765',
                    violationType: 'Red Light Violation',
                    violationDetails: 'Crossed red traffic light',
                    fineAmount: 3000,
                    location: 'Maradana Junction',
                    violationDate: '2024-12-20',
                    dueDate: '2025-01-20',
                    paymentStatus: 'PAID',
                    paymentDate: '2025-01-10',
                    driverId: 1
                }
            ];

            setFines(mockFines.filter(f =>
                filter === 'all' ||
                (filter === 'unpaid' && f.paymentStatus === 'UNPAID') ||
                (filter === 'paid' && f.paymentStatus === 'PAID')
            ));
        } catch (error) {
            console.error('Error fetching fines:', error);
            toast.error('Failed to load fines');
        } finally {
            setLoading(false);
        }
    };

    const toggleFineSelection = (fineId) => {
        setSelectedFines(prev =>
            prev.includes(fineId)
                ? prev.filter(id => id !== fineId)
                : [...prev, fineId]
        );
    };

    const getTotalAmount = () => {
        return fines
            .filter(f => selectedFines.includes(f.fineId))
            .reduce((sum, f) => sum + f.fineAmount, 0);
    };

    const handlePayment = async () => {
        setShowPaymentModal(true);
        // Payment processing logic will go here
    };

    const processPayment = async () => {
        try {
            for (const fineId of selectedFines) {
                await paymentService.processFinePayment(fineId, {
                    paymentMethod: 'Credit Card',
                    paymentDate: new Date().toISOString()
                });
            }
            toast.success('Payment successful!');
            setShowPaymentModal(false);
            setSelectedFines([]);
            fetchFines();
        } catch (error) {
            toast.error('Payment failed. Please try again.');
        }
    };

    const FineCard = ({ fine }) => {
        const isPaid = fine.paymentStatus === 'PAID';
        const isSelected = selectedFines.includes(fine.fineId);
        const isOverdue = new Date(fine.dueDate) < new Date() && !isPaid;

        return (
            <div
                className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.02] border-2 ${isSelected ? 'border-blue-500' : 'border-transparent'
                    }`}
            >
                {/* Status Bar */}
                <div className={`h-2 ${isPaid ? 'bg-green-500' :
                        isOverdue ? 'bg-red-500' :
                            'bg-orange-500'
                    }`}></div>

                <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg font-bold text-gray-800">
                                    {fine.fineNumber}
                                </span>
                                {isPaid && (
                                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                        <Check className="w-3 h-3" />
                                        PAID
                                    </span>
                                )}
                                {isOverdue && (
                                    <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        OVERDUE
                                    </span>
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                                {fine.violationType}
                            </h3>
                            <p className="text-gray-600 text-sm">{fine.violationDetails}</p>
                        </div>

                        {!isPaid && (
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleFineSelection(fine.fineId)}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                            />
                        )}
                    </div>

                    <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600 text-sm">
                            <MapPin className="w-4 h-4 mr-2" />
                            {fine.location}
                        </div>
                        <div className="flex items-center text-gray-600 text-sm">
                            <Calendar className="w-4 h-4 mr-2" />
                            Violation Date: {new Date(fine.violationDate).toLocaleDateString()}
                        </div>
                        {!isPaid && (
                            <div className="flex items-center text-gray-600 text-sm">
                                <Calendar className="w-4 h-4 mr-2" />
                                Due Date: {new Date(fine.dueDate).toLocaleDateString()}
                            </div>
                        )}
                        {isPaid && (
                            <div className="flex items-center text-green-600 text-sm">
                                <Check className="w-4 h-4 mr-2" />
                                Paid: {new Date(fine.paymentDate).toLocaleDateString()}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Amount</p>
                            <p className="text-3xl font-bold text-red-600">
                                Rs. {fine.fineAmount.toLocaleString()}
                            </p>
                        </div>
                        {isPaid && (
                            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                Receipt
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-4 md:p-8">
            <Toaster position="top-right" />

            {/* Header */}
            <div className="max-w-7xl mx-auto mb-6">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">💰 My Traffic Fines</h1>
                            <p className="text-blue-100">View and pay your traffic fines online</p>
                        </div>
                        <div className="flex gap-2">
                            {['all', 'unpaid', 'paid'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === f
                                            ? 'bg-white text-blue-600'
                                            : 'bg-white/20 text-white hover:bg-white/30'
                                        }`}
                                >
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent"></div>
                    </div>
                ) : fines.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center">
                        <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">No Fines Found</h3>
                        <p className="text-gray-600">You don't have any {filter} fines.</p>
                    </div>
                ) : (
                    <>
                        {/* Fines Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {fines.map(fine => (
                                <FineCard key={fine.fineId} fine={fine} />
                            ))}
                        </div>

                        {/* Payment Summary */}
                        {selectedFines.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-2xl p-6 sticky bottom-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 mb-1">
                                            {selectedFines.length} fine(s) selected
                                        </p>
                                        <p className="text-3xl font-bold text-gray-800">
                                            Total: Rs. {getTotalAmount().toLocaleString()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={handlePayment}
                                        className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold text-lg"
                                    >
                                        <CreditCard className="w-6 h-6" />
                                        Pay Now
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Confirm Payment</h3>
                        <p className="text-gray-600 mb-6">
                            You are about to pay <span className="font-bold text-red-600">Rs. {getTotalAmount().toLocaleString()}</span> for {selectedFines.length} fine(s).
                        </p>

                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
                            <p className="text-sm text-blue-800">
                                <AlertCircle className="w-4 h-4 inline mr-2" />
                                This is a demo payment. No actual transaction will occur.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={processPayment}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-medium"
                            >
                                Confirm Payment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
