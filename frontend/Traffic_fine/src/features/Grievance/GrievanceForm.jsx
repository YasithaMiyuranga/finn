import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AlertCircle, Send, CheckCircle2 } from 'lucide-react';
import grievanceService from '../../services/grievanceService';
import toast, { Toaster } from 'react-hot-toast';

export default function GrievanceForm() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // Add driver ID (replace with actual logged-in driver)
            const grievanceData = {
                reporterDriverId: 1, // Replace with actual driver ID
                accusedOfficerId: data.officerId || null,
                complaintDetails: data.complaintDetails,
                status: 'PENDING'
            };

            await grievanceService.submitGrievance(grievanceData);
            toast.success('Grievance submitted successfully!');
            setSuccess(true);
            reset();

            // Reset success message after 3 seconds
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error('Grievance Error:', error);
            toast.error('Failed to submit grievance. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-4 md:p-8">
            <Toaster position="top-right" />

            {/* Header */}
            <div className="max-w-3xl mx-auto mb-6">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-red-500 to-pink-500 p-3 rounded-xl">
                            <AlertCircle className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Report Grievance</h1>
                            <p className="text-blue-100">Submit a complaint against misconduct</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Container */}
            <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6">
                        <h2 className="text-xl font-bold text-white">Complaint Details</h2>
                        <p className="text-red-50 text-sm mt-1">All grievances are taken seriously and investigated thoroughly</p>
                    </div>

                    <div className="p-8 space-y-6">
                        {/* Success Message */}
                        {success && (
                            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-green-700">Grievance Submitted Successfully!</p>
                                        <p className="text-sm text-green-600 mt-1">Your complaint has been registered and will be investigated.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Officer ID (Optional) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Police Officer ID (Optional)
                            </label>
                            <input
                                type="number"
                                {...register('officerId')}
                                placeholder="Enter officer ID if known"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            />
                            <p className="text-sm text-gray-500 mt-1">Leave empty if you don't know the officer ID</p>
                        </div>

                        {/* Complaint Details */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Complaint Details <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                {...register('complaintDetails', {
                                    required: 'Please provide details about your complaint',
                                    minLength: {
                                        value: 20,
                                        message: 'Please provide at least 20 characters'
                                    }
                                })}
                                rows="8"
                                placeholder="Describe the incident in detail... Include date, time, location, and what happened."
                                className={`w-full px-4 py-3 bg-gray-50 border ${errors.complaintDetails ? 'border-red-500' : 'border-gray-300'
                                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none`}
                            ></textarea>
                            {errors.complaintDetails && (
                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.complaintDetails.message}
                                </p>
                            )}
                        </div>

                        {/* Important Notice */}
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-blue-700">Important Notice</p>
                                    <ul className="text-sm text-blue-600 mt-2 space-y-1 list-disc list-inside">
                                        <li>All grievances are confidential</li>
                                        <li>False reports may result in legal action</li>
                                        <li>You will be notified of investigation progress</li>
                                        <li>Average resolution time: 7-14 days</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-semibold text-lg"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Submit Grievance
                                </>
                            )}
                        </button>

                        {/* Disclaimer */}
                        <p className="text-xs text-gray-500 text-center">
                            By submitting this form, you confirm that the information provided is accurate to the best of your knowledge.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
