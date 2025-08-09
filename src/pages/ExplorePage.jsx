import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { Search, Filter, Star, Clock, DollarSign, Video, User, MapPin, UserCircle2, X } from 'lucide-react';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import ChatBot from '../components/ChatBot'; // Assuming ChatBot is a component that handles chat interactions

const ExplorePage = () => {
  const {
    user,
    getExploreData,
    createBookingOrder,
    verifyBookingPayment,
    isLoading,
  } = useAuthStore();

  const [mentors, setMentors] = useState([]);
    const [sessions, setSessions] = useState([]); // Added missing state for sessions
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  // Fetch data from backend on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getExploreData();
        setMentors(data.mentors);
        setSessions(data.sessions);
        setFilteredMentors(data.mentors); // Initially, show all mentors
      } catch (error) {
        toast.error("Failed to load mentor data. Please refresh the page.");
      }
    };
    fetchData();
  }, [getExploreData]);

  // Apply filters whenever filter criteria change
  useEffect(() => {
    let filtered = [...mentors];

    if (searchTerm) {
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.profile.bio.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedDomain !== "all") {
      filtered = filtered.filter((m) => m.domain === selectedDomain);
    }
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      filtered = filtered.filter((m) => {
        if (max)
          return m.profile.hourlyRate >= min && m.profile.hourlyRate <= max;
        return m.profile.hourlyRate >= min;
      });
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.profile.rating || 0) - (a.profile.rating || 0);
        case "price-low":
          return a.profile.hourlyRate - b.profile.hourlyRate;
        case "price-high":
          return b.profile.hourlyRate - a.profile.hourlyRate;
        case "experience":
          return b.profile.experience - a.profile.experience;
        default:
          return 0;
      }
    });

    setFilteredMentors(filtered);
  }, [searchTerm, selectedDomain, priceRange, sortBy, mentors]);

  // --- PAYMENT LOGIC ---
  const handleOpenBookingModal = (mentor) => {
    if (!user) {
      toast.error("Please log in to book a session.");
      return;
    }
    setSelectedMentor(mentor);
    setIsBookingModalOpen(true);
  };

  const handlePayment = async () => {
    // CORRECTED: Added a check to ensure the Razorpay script is loaded.
    if (!window.Razorpay) {
      toast.error("Razorpay SDK failed to load. Please check your internet connection and refresh the page.");
      return;
    }

    try {
        console.log("Step 1: Attempting to create booking order for mentor:", selectedMentor._id);
        const { order, bookingId } = await createBookingOrder(selectedMentor._id);
        console.log("Step 2: Order created successfully on backend.", order);

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: "MentorHub",
            description: `1-on-1 Session with ${selectedMentor.name}`,
            order_id: order.id,
            handler: async function (response) {
                console.log("Step 4: Razorpay payment successful. Handler function executed.");
                const data = {
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                    bookingId: bookingId,
                };
                try {
                    console.log("Step 5: Verifying payment with backend.");
                    const result = await verifyBookingPayment(data);
                    toast.success(result.message);
                    setIsBookingModalOpen(false);
                } catch (error) {
                    console.error("Payment verification failed:", error);
                    toast.error("Payment verification failed. Please contact support.");
                }
            },
            prefill: {
                name: user.name,
                email: user.email,
            },
            theme: {
                color: "#FFD700"
            },
            modal: {
                ondismiss: function () {
                    console.log("Step 4 (Alternative): User dismissed the payment modal.");
                    toast.info("Payment was not completed.");
                }
            }
        };
        
        console.log("Step 3: Opening Razorpay modal.");
        const rzp = new window.Razorpay(options);
        rzp.open();

    } catch (error) {
        console.error("Error during payment initiation (Step 1 or 2 failed):", error);
        const storeError = useAuthStore.getState().error;
        toast.error(storeError || "Could not initiate payment. Please check the console and ensure the backend is running correctly.");
    }
  };
  const handleBookSession = (mentorId, sessionType) => {
    toast.success(`${sessionType} session booking request sent!`);
  };

  const domains = [
    { value: "all", label: "All Domains" },
    { value: "programming", label: "Programming" },
    { value: "aiml", label: "AI/ML" },
    { value: "cybersecurity", label: "Cybersecurity" },
    { value: "dsa", label: "DSA" },
    { value: "blockchain", label: "Blockchain" },
  ];

  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "0-25", label: "$0 - $25" },
    { value: "25-35", label: "$25 - $35" },
    { value: "35-45", label: "$35 - $45" },
    { value: "45", label: "$45+" },
  ];

  const sortOptions = [
    { value: "rating", label: "Highest Rated" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "experience", label: "Most Experienced" },
  ];

  const getDomainLabel = (domain) => {
    const domainMap = {
      programming: "Programming",
      aiml: "AI/ML",
      cybersecurity: "Cybersecurity",
      dsa: "DSA",
      blockchain: "Blockchain",
    };
    return domainMap[domain] || domain;
  };
  if (isLoading && mentors.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <ChatBot /> {/* Assuming ChatBot is a component that handles chat interactions */}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Explore Expert <span className="text-yellow-400">Mentors</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Find the perfect mentor to guide your learning journey. Connect with
            industry experts across various domains.
          </p>
        </div>

        {/* Filters */}
        <div className="gradient-card p-6 rounded-2xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search mentors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors"
              />
            </div>

            {/* Domain Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="w-full pl-12 pr-8 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors appearance-none cursor-pointer"
              >
                {domains.map((domain) => (
                  <option key={domain.value} value={domain.value}>
                    {domain.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full pl-12 pr-8 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors appearance-none cursor-pointer"
              >
                {priceRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors appearance-none cursor-pointer"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-300">
            Showing {filteredMentors.length} mentor
            {filteredMentors.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Mentors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMentors.map((mentor) => (
            <div
              key={mentor._id}
              className="gradient-card p-6 rounded-2xl hover:scale-105 transition-all duration-300 group"
            >
              <div className="flex items-start mb-4">
                {mentor.profile.avatar ? (
                  <img
                    src={mentor.profile.avatar}
                    alt={mentor.name}
                    className="w-16 h-16 rounded-full mr-4"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full mr-4 bg-gray-700 flex items-center justify-center">
                    <UserCircle2 className="w-10 h-10 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {mentor.name}
                  </h3>
                  <p className="text-yellow-400 text-sm font-medium mb-1">
                    {getDomainLabel(mentor.domain)}
                  </p>
                  <div className="flex items-center text-sm text-gray-400">
                    <MapPin className="w-3 h-3 mr-1" />
                    {mentor.profile.location}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                  <span className="text-white font-medium">
                    {mentor.profile.rating || "New"}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-yellow-400 font-semibold">
                    ${mentor.profile.hourlyRate}/hr
                  </div>
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                {mentor.profile.bio}
              </p>
              <div className="flex items-center text-gray-300 text-sm mb-4">
                <Clock className="w-4 h-4 mr-1" />
                <span>{mentor.profile.experience} years experience</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleOpenBookingModal(mentor)}
                  className="..."
                >
                  <Video className="w-4 h-4 mr-1" />
                  1-on-1
                </button>


                <button
                  onClick={() => handleBookSession(mentor._id, "Group")}
                  className="flex-1 border border-yellow-400 text-yellow-400 font-semibold py-2 px-4 rounded-lg hover:bg-yellow-400 hover:text-navy-900 transition-colors flex items-center justify-center text-sm"
                >
                  <User className="w-4 h-4 mr-1" />
                  Group
                </button>
              </div>
            </div>
          ))}
        </div>
                      {/* --- BOOKING MODAL --- */}
      {isBookingModalOpen && selectedMentor && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="gradient-card p-8 rounded-2xl max-w-md w-full relative">
            <button onClick={() => setIsBookingModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X />
            </button>
            <h2 className="text-2xl font-bold text-white mb-4">Confirm Booking</h2>
            <p className="text-gray-300 mb-6">You are booking a 1-hour session with <span className="font-semibold text-yellow-400">{selectedMentor.name}</span>.</p>
            
            <div className="bg-gray-800/50 p-4 rounded-lg mb-6 space-y-2">
                <div className="flex justify-between text-gray-300">
                    <span>Mentor's Hourly Rate:</span>
                    <span>₹{selectedMentor.profile.hourlyRate.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                    <span>Platform Fee (5%):</span>
                    <span>₹{(selectedMentor.profile.hourlyRate * 0.05).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-600 my-2"></div>
                <div className="flex justify-between text-white font-bold text-lg">
                    <span>Total Amount:</span>
                    <span>₹{(selectedMentor.profile.hourlyRate * 1.05).toFixed(2)}</span>
                </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Request & Pay Now'}
            </button>
            <p className="text-xs text-gray-400 mt-4 text-center">Your payment will be held securely until the mentor approves the session.</p>
          </div>
        </div>
      )}
        {/* Upcoming Sessions Section */}
        {sessions.length > 0 && (
          <div className="mt-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Upcoming Group Sessions
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {sessions.map((session) => (
                <div
                  key={session._id}
                  className="gradient-card p-6 rounded-2xl"
                >
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {session.title}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    with {session.mentorId.name}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-300">
                      <p>{new Date(session.dateTime).toLocaleDateString()}</p>
                      <p>
                        {new Date(session.dateTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <button className="btn-primary text-sm">
                      Join Session
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredMentors.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">
              No mentors found
            </h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your search criteria or filters to find more
              mentors.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedDomain("all");
                setPriceRange("all");
                setSortBy("rating");
              }}
              className="btn-primary"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
