import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, CreditCard, ChevronRight, MapPin } from 'lucide-react';

export default function CompleteProfile() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [driverId, setDriverId] = useState(null);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        gender: 'Male',
        licenseNumber: '',
        classOfVehicle: '',
        dateOfBirth: '',
        phone: '',
        address: '',
        province: 'Southern',
        district: '',
        city: '',
        licenseissue: '',
        licenseExpiry: '',
        registeredDate: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        const fetchExistingData = async () => {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');
            if (!userId || !token) return;

            try {
                const response = await fetch(`http://localhost:8080/api/Driver/getDriverByUserId/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const result = await response.json();
                if (result.success && result.data) {
                    const d = result.data;
                    setDriverId(d.id);
                    setIsUpdateMode(true);
                    setFormData({
                        firstName: d.firstName || '',
                        lastName: d.lastName || '',
                        gender: d.gender || 'Male',
                        licenseNumber: String(d.licenseNumber) || '',
                        dateOfBirth: d.dateOfBirth || '',
                        phone: d.phone || '',
                        address: d.address || '',
                        province: d.province || 'Southern',
                        district: d.district || '',
                        city: d.city || '',
                        licenseissue: d.licenseissue || '',
                        licenseExpiry: d.licenseExpiry || '',
                        classOfVehicle: d.classOfVehicle || '',
                        registeredDate: d.registeredDate || new Date().toISOString().split('T')[0]
                    });
                }
            } catch (error) {
                console.error("Error fetching existing driver data:", error);
            }
        };
        fetchExistingData();
    }, []);

    const provinces = [
        'Central', 'Eastern', 'North_Central', 'Northern', 
        'North_Western', 'Sabaragamuwa', 'Southern', 'Uva', 'Western'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.firstName) newErrors.firstName = 'First Name is required';
        if (!formData.lastName) newErrors.lastName = 'Last Name is required';
        if (!formData.licenseNumber) newErrors.licenseNumber = 'License ID is required';
        if (!formData.phone) newErrors.phone = 'Phone number is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Birthday is required';
        if (!formData.licenseissue) newErrors.licenseissue = 'Issue date is required';
        if (!formData.licenseExpiry) newErrors.licenseExpiry = 'Expiry date is required';
        if (!formData.classOfVehicle) newErrors.classOfVehicle = 'Vehicle class is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            
            const submissionData = {
                ...formData,
                user: parseInt(userId),
                licenseNumber: parseInt(String(formData.licenseNumber).replace(/\D/g, '')) || 0,
                dateOfBirth: formData.dateOfBirth || null,
                licenseissue: formData.licenseissue || null,
                licenseExpiry: formData.licenseExpiry || null,
                registeredDate: formData.registeredDate || new Date().toISOString().split('T')[0]
            };

            const url = isUpdateMode 
                ? `http://localhost:8080/api/Driver/updateDriver/${driverId}`
                : "http://localhost:8080/api/Driver/saveDriver";
            
            const method = isUpdateMode ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(submissionData),
            });

            const result = await response.json().catch(() => ({}));

            if (response.ok) {
                navigate('/dashboard/driver');
            } else {
                console.error("Server Error Details:", result);
                if (result.data && typeof result.data === 'object') {
                    setErrors(result.data);
                    alert("Validation failed. Please check the marked fields.");
                } else {
                    alert(result.message || "Failed to save profile.");
                }
            }
            
        } catch (error) {
            console.error("Connection Error:", error);
            alert("Network error. Make sure your Spring Boot backend is running.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 py-12"
             style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)' }}>
            
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 2px, transparent 2px)', backgroundSize: '50px 50px' }}></div>
            </div>

            <div className="w-full max-w-4xl relative z-10 animate-fadeIn">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                        {isUpdateMode ? 'Update Your Profile' : 'Complete Your Profile'}
                    </h1>
                    <p className="text-blue-100 opacity-80">
                        {isUpdateMode ? 'Update your driving credentials and information' : 'Please enter your credentials to access your account'}
                    </p>
                </div>

                <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-[2rem] p-4 lg:p-8">
                    <div className="bg-white rounded-2xl p-6 lg:p-10 shadow-2xl">
                        
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                                
                                <div className="space-y-5">
                                    <div className="flex items-center gap-2 text-blue-600 font-bold border-b border-gray-100 pb-2">
                                        <UserCircle size={20} />
                                        <span className="text-sm tracking-wide uppercase">Personal Details</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">First Name</label>
                                            <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange}
                                                   className={`w-full px-4 py-3 border ${errors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-xl focus:border-blue-600 focus:ring-3 focus:ring-blue-100 transition-all outline-none text-sm`} />
                                            {errors.firstName && <p className="text-[10px] text-red-500 ml-1">{errors.firstName}</p>}
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Last Name</label>
                                            <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange}
                                                   className={`w-full px-4 py-3 border ${errors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-xl focus:border-blue-600 focus:ring-3 focus:ring-blue-100 transition-all outline-none text-sm`} />
                                            {errors.lastName && <p className="text-[10px] text-red-500 ml-1">{errors.lastName}</p>}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Gender</label>
                                            <select name="gender" value={formData.gender} onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-600 focus:ring-3 focus:ring-blue-100 outline-none text-sm appearance-none cursor-pointer">
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">DOB</label>
                                            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange}
                                                   className={`w-full px-4 py-3 border ${errors.dateOfBirth ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-xl focus:border-blue-600 focus:ring-3 focus:ring-blue-100 outline-none text-sm`} />
                                            {errors.dateOfBirth && <p className="text-[10px] text-red-500 ml-1">{errors.dateOfBirth}</p>}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Phone Number</label>
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                                               className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-xl focus:border-blue-600 focus:ring-3 focus:ring-blue-100 outline-none text-sm`} placeholder="07XXXXXXXX" />
                                        {errors.phone && <p className="text-[10px] text-red-500 ml-1">{errors.phone}</p>}
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div className="flex items-center gap-2 text-amber-600 font-bold border-b border-gray-100 pb-2">
                                        <CreditCard size={20} />
                                        <span className="text-sm tracking-wide uppercase">License Information</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">License No</label>
                                            <input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleInputChange}
                                                   className={`w-full px-4 py-3 border ${errors.licenseNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-xl focus:border-blue-600 focus:ring-3 focus:ring-blue-100 outline-none text-sm`} placeholder="B842XXX" />
                                            {errors.licenseNumber && <p className="text-[10px] text-red-500 ml-1">{errors.licenseNumber}</p>}
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Vehicle Class</label>
                                            <input type="text" name="classOfVehicle" value={formData.classOfVehicle} onChange={handleInputChange}
                                                   className={`w-full px-4 py-3 border ${errors.classOfVehicle ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-xl focus:border-blue-600 focus:ring-3 focus:ring-blue-100 outline-none text-sm`} placeholder="A, B, C" />
                                            {errors.classOfVehicle && <p className="text-[10px] text-red-500 ml-1">{errors.classOfVehicle}</p>}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Issue Date</label>
                                            <input type="date" name="licenseissue" value={formData.licenseissue} onChange={handleInputChange}
                                                   className={`w-full px-4 py-3 border ${errors.licenseissue ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-xl focus:border-blue-600 focus:ring-3 focus:ring-blue-100 outline-none text-sm`} />
                                            {errors.licenseissue && <p className="text-[10px] text-red-500 ml-1">{errors.licenseissue}</p>}
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Expiry Date</label>
                                            <input type="date" name="licenseExpiry" value={formData.licenseExpiry} onChange={handleInputChange}
                                                   className={`w-full px-4 py-3 border ${errors.licenseExpiry ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-xl focus:border-blue-600 focus:ring-3 focus:ring-blue-100 outline-none text-sm`} />
                                            {errors.licenseExpiry && <p className="text-[10px] text-red-500 ml-1">{errors.licenseExpiry}</p>}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Registration Date</label>
                                        <input type="date" name="registeredDate" value={formData.registeredDate} readOnly
                                               className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-400 cursor-not-allowed text-sm" />
                                    </div>
                                </div>

                                <div className="md:col-span-2 space-y-5 pt-2">
                                    <div className="flex items-center gap-2 text-emerald-600 font-bold border-b border-gray-100 pb-2">
                                        <MapPin size={20} />
                                        <span className="text-sm tracking-wide uppercase">Address Details</span>
                                    </div>
                                    <div className="grid md:grid-cols-4 gap-4">
                                        <div className="md:col-span-1 space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Permanent Address</label>
                                            <input type="text" name="address" value={formData.address} onChange={handleInputChange}
                                                   className={`w-full px-4 py-3 border ${errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-xl focus:border-blue-600 focus:ring-3 focus:ring-blue-100 transition-all outline-none text-sm`} placeholder="123 Galle Rd" />
                                            {errors.address && <p className="text-[10px] text-red-500 ml-1">{errors.address}</p>}
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Province</label>
                                            <select name="province" value={formData.province} onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-600 focus:ring-3 focus:ring-blue-100 outline-none text-sm appearance-none cursor-pointer">
                                                {provinces.map(p => <option key={p} value={p}>{p.replace('_', ' ')}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">District</label>
                                            <input type="text" name="district" value={formData.district} onChange={handleInputChange}
                                                   className={`w-full px-4 py-3 border ${errors.district ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-xl focus:border-blue-600 focus:ring-3 focus:ring-blue-100 transition-all outline-none text-sm`} placeholder="Galle" />
                                            {errors.district && <p className="text-[10px] text-red-500 ml-1">{errors.district}</p>}
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">City</label>
                                            <input type="text" name="city" value={formData.city} onChange={handleInputChange}
                                                   className={`w-full px-4 py-3 border ${errors.city ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-xl focus:border-blue-600 focus:ring-3 focus:ring-blue-100 transition-all outline-none text-sm`} placeholder="Matara" />
                                            {errors.city && <p className="text-[10px] text-red-500 ml-1">{errors.city}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 flex flex-col items-center">
                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="w-full max-w-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group disabled:opacity-50"
                                >
                                    {isLoading ? (isUpdateMode ? 'Updating...' : 'Processing...') : (isUpdateMode ? 'UPDATE PROFILE' : 'CONFIRM & GET STARTED')} 
                                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <p className="text-gray-400 text-[10px] mt-4 uppercase tracking-[0.2em] font-bold">Official Traffic Management System</p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.8s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
