import { useState } from 'react';
import { Mail, Lock, CheckCircle, Shield, AlertCircle, Users, Eye, EyeOff } from 'lucide-react';

/**
 * Register Component
 * A registration form with a clean, modern, and traffic-themed UI, including a Navigation Bar
 */
export default function Register() {
  // State for form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'DRIVER' // Default to Driver for most common use case
  });

  // State for UI/form status
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  // User types for the select dropdown with readable labels
  const userTypes = [
    { value: 'DRIVER', label: '🚗 Driver - Regular Driver Account' },
    { value: 'POLICEOFFICERS', label: '👮 Police Officer - Traffic Police' },
    { value: 'POLICEOIC', label: '👮‍♂️ Police OIC - Officer in Charge' },
    { value: 'USERS', label: '👤 General User - Public Access' },
  ];

  /**
   * Handles input changes in the form fields.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Handles the form submission.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccessMessage('');

    // --- Validation ---
    const newErrors = [];
    if (!formData.email.trim()) {
      newErrors.push('Email is required.');
    }
    if (!formData.password) {
      newErrors.push('Password is required.');
    }
    if (formData.password.length < 6) {
      newErrors.push('Password must be at least 6 characters long.');
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.push('Passwords do not match.');
    }
    if (!formData.userType) {
      newErrors.push('User Type is required.');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // --- API Call Simulation ---
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          userType: formData.userType
        }),
      });

      console.log('API Response:', response.data);

      if (response.ok) {
        window.location.href = '/auth/login';
      } else {
        const errorData = await response.json().catch(() => ({}));

        console.log('errorData:', errorData);


        setErrors([errorData.message || 'Registration failed. Please check the details and try again.']);
        setIsRegistered(false);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors(['Network error. Please check your connection and try again.']);
      setIsRegistered(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Main Registration Form UI
  return (
    <div className="min-h-screen relative"
      style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)'
      }}>

      {/* Navigation - ADDED HERE */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 backdrop-blur-md bg-white/10 border-b border-white/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <i className="fas fa-car text-blue-600 text-2xl"></i>
            </div>
            <span className="text-white text-xl font-bold">eTRAFFIC</span>
          </div>
          <div className="flex space-x-4 items-center">
            <a
              href="/" // Change this to your actual home route
              className="text-white hover:text-blue-200 transition-colors"
            >
              Home
            </a>
            <a
              href="/auth/login" // Change this to your actual login route
              className="bg-white text-blue-600 px-6 py-2 rounded-full font-medium hover:bg-blue-50 transition-all"
            >
              Login
            </a>
          </div>
        </div>
      </nav>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, white 2px, transparent 2px)',
            backgroundSize: '50px 50px'
          }}></div>
      </div>

      {/* Content Container - ADJUSTED padding top (pt-24) to account for fixed navbar */}
      <div className="w-full max-w-6xl mx-auto pt-24 pb-12 flex items-center justify-center min-h-screen relative z-10">

        <div className="w-full grid lg:grid-cols-2 gap-8 items-center">

          {/* Left Side - Branding */}
          <div className="text-white text-center lg:text-left animate-fadeIn">
            {/* Logo/Branding section removed from here as it is now in the nav bar */}

            <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Join the <br />
              <span className="bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent">
                eTRAFFIC System
              </span>
            </h2>

            <p className="text-xl text-blue-200 mb-8 leading-relaxed">
              Create an account to securely manage your traffic fines and access your profile.
            </p>

            {/* Benefits List */}
            <div className="hidden lg:block space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="text-green-400" size={20} />
                <span>Easy Fine Management</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="text-green-400" size={20} />
                <span>Personalized Dashboard Access</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="text-green-400" size={20} />
                <span>Fast & Secure Registration</span>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="w-full max-w-md mx-auto">
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-8 animate-floating">
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h3>
                  <p className="text-gray-600">Please fill in your details to register</p>
                </div>

                {/* Error Messages */}
                {errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    <div className="flex items-start">
                      <AlertCircle className="mr-2 flex-shrink-0 mt-0.5" size={18} />
                      <div>
                        {errors.map((error, index) => (
                          <p key={index} className="text-sm">{error}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {successMessage && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                    <div className="flex items-center">
                      <CheckCircle className="mr-2" size={18} />
                      <p className="text-sm">{successMessage}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-6">

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="inline mr-2 text-blue-600" size={16} />
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100 transition-all duration-200 disabled:bg-gray-100"
                      placeholder="Enter your email"
                    />
                  </div>

                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      <Lock className="inline mr-2 text-blue-600" size={16} />
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100 transition-all duration-200 pr-12 disabled:bg-gray-100"
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      <Lock className="inline mr-2 text-blue-600" size={16} />
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100 transition-all duration-200 pr-12 disabled:bg-gray-100"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={isLoading}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* User Type Field */}
                  <div>
                    <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-2">
                      <Users className="inline mr-2 text-blue-600" size={16} />
                      User Type
                    </label>
                    <div className="relative">
                      <select
                        id="userType"
                        name="userType"
                        value={formData.userType}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100 transition-all duration-200 disabled:bg-gray-100 cursor-pointer"
                      >
                        {userTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      {/* Custom Dropdown Arrow */}
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Select your account type based on your role</p>
                  </div>

                  {/* Register Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isLoading ? 'Registering...' : 'Register Account'}
                  </button>
                </div>
                {/* Login Link */}
                <div className="mt-8 text-center">
                  <p className="text-gray-600">
                    Already have an account? <a href="/auth/login" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">Sign In</a>
                  </p>
                </div>

              </form>

              {/* Security Notice */}
              <div className="mt-6 text-center">
                <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-4">
                  <div className="flex items-center justify-center space-x-2 text-white">
                    <Shield className="text-green-400" size={18} />
                    <span className="text-sm">Secured by 256-bit SSL encryption</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Font Awesome Link (as requested) */}
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
    </div>
  );
}