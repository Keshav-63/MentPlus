import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/authStore';
import { User, Phone, MapPin, Calendar, DollarSign, Clock } from 'lucide-react';
import ChatBot from '../components/ChatBot'; // Assuming ChatBot is a component that handles chat interactions

const ProfileCompletion = () => {
  const navigate = useNavigate();
  
  // Get the new action and state from the store
  const { completeMentorProfile, isLoading, user } = useAuthStore();

  const [formData, setFormData] = useState({
    fullName: user?.name || '', // Pre-fill name from the user object
    phone: '',
    location: '',
    experience: '',
    hourlyRate: '',
    bio: '',
    availability: {
      monday: { available: false, start: '09:00', end: '17:00' },
      tuesday: { available: false, start: '09:00', end: '17:00' },
      wednesday: { available: false, start: '09:00', end: '17:00' },
      thursday: { available: false, start: '09:00', end: '17:00' },
      friday: { available: false, start: '09:00', end: '17:00' },
      saturday: { available: false, start: '09:00', end: '17:00' },
      sunday: { available: false, start: '09:00', end: '17:00' }
    }
  });

  // Redirect if the user is not a mentor who has passed the test
  useEffect(() => {
    if (user?.role !== 'mentor' || !user?.testPassed) {
        toast.error("You must pass the mentor qualification test first.");
        navigate('/domain-selection');
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvailabilityChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: { ...prev.availability[day], [field]: value }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call the action from the store to make the API request
      await completeMentorProfile(formData);
      
      toast.success('Profile completed successfully! Welcome to MentorHub!');
      navigate('/mentor-dashboard');
    } catch (error) {
      const storeError = useAuthStore.getState().error;
      toast.error(storeError || 'Something went wrong. Please try again.');
    }
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="min-h-screen py-20 px-4">
      <ChatBot /> {/* Assuming ChatBot is a component that handles chat interactions */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 pt-8">
          <h2 className="text-4xl font-bold text-white mb-4">Complete Your Mentor Profile</h2>
          <p className="text-xl text-gray-300">
            Tell us more about yourself to start mentoring students.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="gradient-card p-8 rounded-2xl">
            <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <User className="w-6 h-6 mr-3 text-yellow-400" />
              Personal Information
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Location *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                    placeholder="City, Country"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Years of Experience *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                    placeholder="e.g., 5"
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Bio *</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 resize-none"
                placeholder="Tell students about your expertise and teaching style..."
                required
              ></textarea>
            </div>
          </div>

          {/* Pricing */}
          <div className="gradient-card p-8 rounded-2xl">
            <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <DollarSign className="w-6 h-6 mr-3 text-yellow-400" />
              Pricing
            </h3>
            <div className="max-w-md">
              <label className="block text-sm font-medium text-gray-300 mb-2">Hourly Rate (USD) *</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                  placeholder="25"
                  min="1"
                  required
                />
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="gradient-card p-8 rounded-2xl">
            <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <Clock className="w-6 h-6 mr-3 text-yellow-400" />
              Availability
            </h3>
            <div className="space-y-4">
              {days.map((day) => (
                <div key={day} className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-800/50 rounded-lg">
                  <div className="w-32">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.availability[day].available}
                        onChange={(e) => handleAvailabilityChange(day, 'available', e.target.checked)}
                        className="w-4 h-4 text-yellow-400 bg-gray-800 border-gray-600 rounded focus:ring-yellow-400 focus:ring-2"
                      />
                      <span className="ml-2 text-white capitalize">{day}</span>
                    </label>
                  </div>
                  {formData.availability[day].available && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="time"
                        value={formData.availability[day].start}
                        onChange={(e) => handleAvailabilityChange(day, 'start', e.target.value)}
                        className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-yellow-400"
                      />
                      <span className="text-gray-400">to</span>
                      <input
                        type="time"
                        value={formData.availability[day].end}
                        onChange={(e) => handleAvailabilityChange(day, 'end', e.target.value)}
                        className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-yellow-400"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary text-lg px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
            >
              {isLoading ? (
                <>
                  <div className="spinner mr-2"></div>
                  Completing Profile...
                </>
              ) : (
                'Complete Profile & Start Mentoring'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileCompletion;
