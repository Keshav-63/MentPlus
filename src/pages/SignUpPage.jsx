import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/authStore'; // Using Zustand store
import PasswordStrengthMeter from '../components/PasswordStrengthMeter'; // Importing from old component
import { User, GraduationCap, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import ChatBot from '../components/ChatBot'; // Assuming ChatBot is a component that handles chat interactions

const SignupPage = () => {
  // State for UI and form data from the new component
  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Get actions and state from the Zustand store
  const { signup, isLoading, error } = useAuthStore();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validations from the new component
    if (!role) {
      toast.error('Please select your role');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      // Calling the signup function from the store, like in the old component
      // NOTE: We are assuming the backend/store can handle the 'role' parameter.
      // You may need to update your authStore's signup function to pass the role.
      await signup(formData.email, formData.password, formData.name, role);
      
      // The new component stores temp data in localStorage, but a direct API call is better.
      // We'll follow the old component's pattern of navigating after the API call.
      // We use the new component's destination for the next step in the flow.
      toast.success('OTP will be sent to your email shortly!');
      navigate('/otp-verification'); 

    } catch (err) {
      // The store sets the error state, so we just need to notify the user.
      toast.error(error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4">
      <ChatBot /> {/* Assuming ChatBot is a component that handles chat interactions */}
      <div className="max-w-md w-full">
        <div className="gradient-card p-8 rounded-2xl shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-gray-300">Join our learning community</p>
          </div>

          {/* Role Selection UI from the new component */}
          {!role && (
            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-semibold text-white text-center mb-4">
                Choose your role
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setRole('student')}
                  className="p-6 border-2 border-gray-600 rounded-xl hover:border-yellow-400 hover:bg-yellow-400/10 transition-all duration-300 group"
                >
                  <User className="w-8 h-8 text-yellow-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <div className="text-white font-medium">Student</div>
                  <div className="text-gray-400 text-sm mt-1">Learn from experts</div>
                </button>
                <button
                  onClick={() => setRole('mentor')}
                  className="p-6 border-2 border-gray-600 rounded-xl hover:border-yellow-400 hover:bg-yellow-400/10 transition-all duration-300 group"
                >
                  <GraduationCap className="w-8 h-8 text-yellow-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <div className="text-white font-medium">Mentor</div>
                  <div className="text-gray-400 text-sm mt-1">Share your knowledge</div>
                </button>
              </div>
            </div>
          )}

          {/* Form UI from the new component */}
          {role && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  {role === 'student' ? (
                    <User className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <GraduationCap className="w-5 h-5 text-yellow-400" />
                  )}
                  <span className="text-white font-medium capitalize">{role}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setRole('')}
                  className="text-gray-400 hover:text-yellow-400 text-sm transition-colors"
                >
                  Change Role
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-12 pr-12 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors"
                    placeholder="Create a password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-12 pr-12 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Added PasswordStrengthMeter from the old component */}
              <PasswordStrengthMeter password={formData.password} />

              {/* Display error from the store */}
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <button
                type="submit"
                disabled={isLoading} // Use isLoading from the store
                className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="spinner mr-2"></div>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          )}

          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;