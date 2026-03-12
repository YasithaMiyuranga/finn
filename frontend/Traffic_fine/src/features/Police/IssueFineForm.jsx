import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Search, FileText, MapPin, Calendar, AlertCircle, Send, CheckCircle } from 'lucide-react';
import driverService from '../../services/driverService';
import violationTypeService from '../../services/violationTypeService';
import api from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';

export default function IssueFineForm() {
    const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm();
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [violationTypes, setViolationTypes] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [success, setSuccess] = useState(false);

    // Mock officer data - replace with actual logged-in officer
    const officerId = 1;

    useEffect(() => {
        fetchViolationTypes();
        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        setValue('violationDate', today);
    }, []);

    const fetchViolationTypes = async () => {
        try {
            // Mock violation types - replace with actual API call
            const mockTypes = [
                { typeId: 1, typeName: 'Speed Violation', fineAmount: 2500, description: 'Exceeding speed limit' },
                { typeId: 2, typeName: 'No Helmet', fineAmount: 1000, description: 'Riding without helmet' },
                { typeId: 3, typeName: 'Red Light Violation', fineAmount: 3000, description: 'Crossing red traffic light' },
                { typeId: 4, typeName: 'Wrong Parking', fineAmount: 1500, description: 'Parking in no-parking zone' },
                { typeId: 5, typeName: 'No Seat Belt', fineAmount: 1000, description: 'Not wearing seat belt' },
                { typeId: 6, typeName: 'Using Mobile While Driving', fineAmount: 2000, description: 'Mobile phone usage while driving' },
                { typeId: 7, typeName: 'DUI', fineAmount: 25000, description: 'Driving under influence' },
                { typeId: 8, typeName: 'No License', fineAmount: 5000, description: 'Driving without valid license' }
            ];
            setViolationTypes(mockTypes);
        } catch (error) {
            console.error('Error fetching violation types:', error);
            toast.error('Failed to load violation types');
        }
    };

    const searchDriver = async () => {
        const licenseNumber = watch('licenseNumber');
        if (!licenseNumber) {
            toast.error('Please enter a license number');
            return;
        }

        setSearchLoading(true);
        try {
            // Mock driver search - replace with actual API
            const mockDriver = {
                driverId: 1,
                licenseNumber: licenseNumber,
                fullName: 'Nimal Perera',
                nic: '199512345678',
                address: 'Colombo 05',
                phone: '0771234567'
            };

            setSelectedDriver(mockDriver);
            toast.success('Driver found!');
        } catch (error) {
            console.error('Error searching driver:', error);
            toast.error('Driver not found');
            setSelectedDriver(null);
        } finally {
            setSearchLoading(false);
        }
    };

    // Watch violation type to auto-fill amount
    const selectedViolationType = watch('violationTypeId');
    useEffect(() => {
        if (selectedViolationType) {
            const type = violationTypes.find(v => v.typeId === parseInt(selectedViolationType));
            if (type) {
                setValue('fineAmount', type.fineAmount);
            }
        }
    }, [selectedViolationType, violationTypes]);

    const onSubmit = async (data) => {
        if (!selectedDriver) {
            toast.error('Please search and select a driver first');
            return;
        }

        setLoading(true);
        try {
            const fineData = {
                driverId: selectedDriver.driverId,
                policeOfficerId: officerId,
                violationTypeId: parseInt(data.violationTypeId),
                fineAmount: parseFloat(data.fineAmount),
                location: data.location,
                violationDate: data.violationDate,
                notes: data.notes || '',
                paymentStatus: 'UNPAID'
            };

            // Submit to backend
            await api.post('/traffic_fine/saveTrafficFine', fineData);

            toast.success('Fine issued successfully!');
            setSuccess(true);

            // Reset form after 2 seconds
            setTimeout(() => {
                setSuccess(false);
                reset();
                setSelectedDriver(null);
            }, 2000);
        } catch (error) {
            console.error('Error issuing fine:', error);
            toast.error('Failed to issue fine. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-4 md:p-8">
            <Toaster position="top-right" />

            {/* Header */}
            <div className="max-w-4xl mx-auto mb-8">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-3 rounded-xl">
                            <FileText className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">📝 Issue Traffic Fine</h1>
                            <p className="text-blue-200">Create a new traffic violation fine</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Container */}
            <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    {/* Driver Search Section */}
                    <div className="bg-white rounded-2xl shadow-2xl p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">1. Search Driver</h3>

                        <div className="flex gap-3">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Driver License Number
                                </label>
                                <input
                                    type="text"
                                    {...register('licenseNumber', { required: 'License number is required' })}
                                    placeholder="Enter license number (e.g., B1234567)"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.licenseNumber && (
                                    <p className="text-red-500 text-sm mt-1">{errors.licenseNumber.message}</p>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={searchDriver}
                                disabled={searchLoading}
                                className="mt-7 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 font-medium disabled:opacity-50"
                            >
                                {searchLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                        Searching...
                                    </>
                                ) : (
                                    <>
                                        <Search className="w-5 h-5" />
                                        Search
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Driver Info Display */}
                        {selectedDriver && (
                            <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="font-semibold text-green-700">Driver Found!</p>
                                        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                                            <p><span className="font-medium">Name:</span> {selectedDriver.fullName}</p>
                                            <p><span className="font-medium">NIC:</span> {selectedDriver.nic}</p>
                                            <p><span className="font-medium">Phone:</span> {selectedDriver.phone}</p>
                                            <p><span className="font-medium">Address:</span> {selectedDriver.address}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Violation Details Section */}
                    <div className="bg-white rounded-2xl shadow-2xl p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">2. Violation Details</h3>

                        <div className="space-y-4">
                            {/* Violation Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Violation Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    {...register('violationTypeId', { required: 'Please select violation type' })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select violation type...</option>
                                    {violationTypes.map(type => (
                                        <option key={type.typeId} value={type.typeId}>
                                            {type.typeName} - Rs. {type.fineAmount.toLocaleString()}
                                        </option>
                                    ))}
                                </select>
                                {errors.violationTypeId && (
                                    <p className="text-red-500 text-sm mt-1">{errors.violationTypeId.message}</p>
                                )}
                            </div>

                            {/* Fine Amount (Auto-filled) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fine Amount (LKR) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    {...register('fineAmount', { required: 'Fine amount is required' })}
                                    readOnly
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none"
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <MapPin className="inline w-4 h-4 mr-1" />
                                    Location <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register('location', { required: 'Location is required' })}
                                    placeholder="Enter violation location (e.g., Galle Road, Colombo)"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.location && (
                                    <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                                )}
                            </div>

                            {/* Violation Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Calendar className="inline w-4 h-4 mr-1" />
                                    Violation Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    {...register('violationDate', { required: 'Date is required' })}
                                    max={new Date().toISOString().split('T')[0]}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.violationDate && (
                                    <p className="text-red-500 text-sm mt-1">{errors.violationDate.message}</p>
                                )}
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Additional Notes (Optional)
                                </label>
                                <textarea
                                    {...register('notes')}
                                    rows="3"
                                    placeholder="Add any additional details about the violation..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="bg-white rounded-2xl shadow-2xl p-6">
                        {success && (
                            <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    <p className="font-semibold text-green-700">Fine issued successfully!</p>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !selectedDriver}
                            className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-semibold text-lg"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                    Issuing Fine...
                                </>
                            ) : (
                                <>
                                    <Send className="w-6 h-6" />
                                    Issue Fine
                                </>
                            )}
                        </button>

                        {!selectedDriver && (
                            <p className="text-center text-gray-500 text-sm mt-2 flex items-center justify-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                Please search and select a driver first
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
