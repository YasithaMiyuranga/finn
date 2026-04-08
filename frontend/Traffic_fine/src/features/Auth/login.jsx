import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Car, CheckCircle, Shield, AlertCircle, User, Lock, Phone, HelpCircle } from 'lucide-react';


export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccessMessage('');
    
    // Validation
    const newErrors = [];
    if (!formData.email.trim()) {
      newErrors.push('Email is required');
    }
    if (!formData.password) {
      newErrors.push('Password is required');
    }
    
    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Send data to Spring Boot backend
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: formData.email, 
          password: formData.password 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Full Response data:", data);
        
        const token = data.data?.token || data.token;
        const detectedUserType = data.data?.userType || data.userType || data.role;
        
        console.log("Detected Token:", token ? "Exist" : "Missing");
        console.log("Detected Role:", detectedUserType);

        if (token) {
          localStorage.setItem('token', token);
          const userId = data.data?.id || data.id;
          if (userId) {
            localStorage.setItem('userId', userId);
          }
          if (detectedUserType) {
            localStorage.setItem('userType', detectedUserType);
          }
          
          setIsLoggedIn(true);
          setSuccessMessage('Login successful!');
          
          const role = String(detectedUserType).toUpperCase();
          const isProfileComplete = data.data?.profileComplete ?? data.profileComplete;

          if (role === 'DRIVER') {
            if (isProfileComplete) {
              navigate('/dashboard/driver');
            } else {
              navigate('/dashboard/driver/complete-profile');
            }
          } else if (role === 'POLICEOIC') {
            navigate('/dashboard/police-oic');
          } else if (role === 'USERS') {
            navigate('/dashboard/user');
          } else if (role === 'POLICEOFFICERS') {
            navigate('/dashboard/policeofficer');
          } else if (role === 'ADMIN') {
            navigate('/dashboard/admin');
          } else {
            navigate('/dashboard/driver');
          }
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        setErrors([errorData.message || 'Login failed: Invalid email or password']);
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors(['Network error. Please check your connection and try again.']);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setFormData({ email: '', password: '', rememberMe: false });
    setSuccessMessage('');
  };


  return (
    <div className="min-h-screen relative flex items-center justify-center p-4" 
         style={{
           background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)'
         }}>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" 
             style={{
               backgroundImage: 'radial-gradient(circle at 25% 25%, white 2px, transparent 2px)',
               backgroundSize: '50px 50px'
             }}></div>
      </div>
      
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        
        {/* Left Side - Branding */}
        <div className="text-white text-center lg:text-left animate-fadeIn">
          <div className="flex items-center space-x-3">
            <div className="w-15 h-15 bg-white rounded-full flex items-center justify-center">
              <i className="fas fa-car text-blue-600 text-2xl"></i>
            </div>
            <div>
              <h2 className="text-3xl font-bold">eTRAFFIC</h2>
              <p className="text-blue-200">Government of Sri Lanka</p>
            </div>
          </div>
          <br></br>

          <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Welcome Back to<br />
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              eTRAFFIC System
            </span>
          </h2>
          
          <p className="text-xl text-blue-200 mb-8 leading-relaxed">
            Access your account to manage traffic fines, make payments, and track your driving record securely.
          </p>
          
          {/* Features List */}
          <div className="hidden lg:block space-y-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="text-green-400" size={20} />
              <span>Secure online payments</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="text-green-400" size={20} />
              <span>Real-time fine tracking</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="text-green-400" size={20} />
              <span>Digital receipt download</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="text-green-400" size={20} />
              <span>24/7 system availability</span>
            </div>
          </div>
        </div>
        
        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-8 animate-floating">
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h3>
                <p className="text-gray-600">Enter your credentials to access your account</p>
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
              
              <div onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline mr-2 text-blue-600" size={16} />
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
                      placeholder="Enter your password"
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
                
                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                    Forgot password?
                  </a>
                </div>
                
                {/* Login Button */}
                <button 
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </div>
              
              {/* Register Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Don't have an account? <a href="/auth/register" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">Register here</a>
                </p>
              </div>
              
              {/* Support Links */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-center space-x-6 text-sm text-gray-500">
                  <button 
                    onClick={() => console.log('Help')}
                    className="hover:text-gray-700 transition-colors flex items-center"
                  >
                    <HelpCircle size={16} className="mr-1" />
                    Help
                  </button>
                  <button 
                    onClick={() => console.log('Contact')}
                    className="hover:text-gray-700 transition-colors flex items-center"
                  >
                    <Phone size={16} className="mr-1" />
                    Contact
                  </button>
                </div>
              </div>
            </div>
          </div>
          
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

      <style>{`
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes floating {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 1s ease-in;
        }
        
        .animate-floating {
          animation: floating 3s ease-in-out infinite;
        }
      `}</style>

      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
    </div>
  );
}