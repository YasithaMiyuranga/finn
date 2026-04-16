import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle, Shield, AlertCircle, User, Lock, ArrowRight, Mail, Key } from 'lucide-react';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMessage('OTP sent to your email!');
        setStep(2);
      } else {
        setErrors([data.message || 'Failed to send OTP']);
      }
    } catch (error) {
      setErrors(['Network error. Please try again.']);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMessage('OTP verified! Please set your new password.');
        setStep(3);
      } else {
        setErrors([data.message || 'Invalid or expired OTP']);
      }
    } catch (error) {
      setErrors(['Network error. Please try again.']);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    if (password !== confirmPassword) {
      setErrors(['Passwords do not match']);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMessage('Password reset successfully! Redirecting to login...');
        setTimeout(() => navigate('/auth/login'), 3000);
      } else {
        setErrors([data.message || 'Failed to reset password']);
      }
    } catch (error) {
      setErrors(['Network error. Please try again.']);
    } finally {
      setIsLoading(false);
    }
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
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <i className="fas fa-car text-blue-600 text-xl"></i>
            </div>
            <div>
              <h2 className="text-2xl font-bold">eTRAFFIC</h2>
              <p className="text-blue-200 text-sm">Government of Sri Lanka</p>
            </div>
          </div>
          <br />
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Reset Your<br />
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Account Password
            </span>
          </h2>
          <p className="text-xl text-blue-200 mb-8 leading-relaxed">
            Follow the simple steps to regain access to your account and manage your traffic fines securely.
          </p>
        </div>
        
        {/* Right Side - Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-8 animate-floating">
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {step === 1 ? 'Forgot Password?' : step === 2 ? 'Verify OTP' : 'New Password'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {step === 1 ? 'Enter your email to receive a reset code' : 
                   step === 2 ? `Enter the 6-digit code sent to ${email}` : 
                   'Create a strong password for your account'}
                </p>
              </div>
              
              {/* Errors */}
              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  <div className="flex items-start">
                    <AlertCircle className="mr-2 flex-shrink-0 mt-0.5" size={18} />
                    <div className="text-sm">{errors[0]}</div>
                  </div>
                </div>
              )}
              
              {/* Success */}
              {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                  <div className="flex items-center">
                    <CheckCircle className="mr-2" size={18} />
                    <p className="text-sm">{successMessage}</p>
                  </div>
                </div>
              )}

              {/* Step 1: Email */}
              {step === 1 && (
                <form onSubmit={handleEmailSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="inline mr-2 text-blue-600" size={16} />
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="driver@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all"
                    />
                  </div>
                  <button 
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-all flex items-center justify-center group"
                  >
                    {isLoading ? 'Processing...' : 'Send OTP'}
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                  </button>
                </form>
              )}

              {/* Step 2: OTP */}
              {step === 2 && (
                <form onSubmit={handleOtpSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Key className="inline mr-2 text-blue-600" size={16} />
                      Verification Code
                    </label>
                    <input 
                      type="text" 
                      maxLength="6"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      placeholder="000000"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all text-center text-xl tracking-widest font-bold"
                    />
                  </div>
                  <button 
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-all"
                  >
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full text-blue-600 text-sm hover:underline"
                  >
                    Change Email
                  </button>
                </form>
              )}

              {/* Step 3: Password Reset */}
              {step === 3 && (
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Lock className="inline mr-2 text-blue-600" size={16} />
                      New Password
                    </label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Lock className="inline mr-2 text-blue-600" size={16} />
                      Confirm New Password
                    </label>
                    <input 
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all"
                    />
                  </div>
                  <button 
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all"
                  >
                    {isLoading ? 'Updating...' : 'Reset Password'}
                  </button>
                </form>
              )}

              <div className="mt-8 text-center">
                <a href="/auth/login" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Back to Sign In
                </a>
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
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floating {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out; }
        .animate-floating { animation: floating 3s ease-in-out infinite; }
      `}</style>

      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
    </div>
  );
}
