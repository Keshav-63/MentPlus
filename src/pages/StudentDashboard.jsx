// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuthStore } from '../store/authStore';
// import { Calendar, Clock, DollarSign, Users, Star, Bell, CheckCircle, XCircle, Video, X,  MessageCircle, CreditCard, Search, Filter, MapPin, UserCircle2 } from 'lucide-react';
// import { toast } from 'react-toastify';
// import LoadingSpinner from '../components/LoadingSpinner';
// import CalendarView from '../components/CalendarView';

// const StudentDashboard = () => {
//   const navigate = useNavigate();
//   const {
//     user,
//     getStudentDashboardData,
//     createBookingOrder,
//     verifyBookingPayment,
//     isLoading,
//   } = useAuthStore();

//   // Data states
//   const [mentors, setMentors] = useState([]);
//   const [upcomingSessions, setUpcomingSessions] = useState([]);
//   const [ongoingSessions, setOngoingSessions] = useState([]);
//   const [completedSessions, setCompletedSessions] = useState([]);
//   const [myBookings, setMyBookings] = useState([]);
//   const [myGroupSessions, setMyGroupSessions] = useState([]);
//   const [myTransactions, setMyTransactions] = useState([]);
//   const [filteredMentors, setFilteredMentors] = useState([]);
//   const [requestedDateTime, setRequestedDateTime] = useState('');
//   // UI states
//   const [activeTab, setActiveTab] = useState("sessions");
//   const [isFetchingData, setIsFetchingData] = useState(true);
//   const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
//   const [selectedMentor, setSelectedMentor] = useState(null);

//   // Filter states for "Browse" tab
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedDomain, setSelectedDomain] = useState("all");

//   // Fetch all dashboard data on component mount
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const data = await getStudentDashboardData();
//         console.log("Dashboard data fetched:", data);
//         setMentors(data.mentors || []);
//         setFilteredMentors(data.mentors || []);
//         setUpcomingSessions(data.upcomingSessions || []);
//         setOngoingSessions(data.ongoingSessions || []);
//         setCompletedSessions(data.completedSessions || []);
//         setMyTransactions(data.myTransactions || []);
//         setMyBookings(data.myBookings || []);
//         setMyGroupSessions(data.myGroupSessions || []);
//       } catch (error) {
//         toast.error("Failed to load dashboard data. Please refresh.");
//       } finally {
//         setIsFetchingData(false);
//       }
//     };
//     fetchData();
//   }, [getStudentDashboardData]);
//   const allSchedulableSessions = [...upcomingSessions, ...ongoingSessions];

//   const isSessionActive = (session) => {
//       const now = new Date().getTime();
//       const sessionTime = new Date(session.scheduledTime || session.dateTime).getTime();
//       const duration = session.duration || session.sessionDetails?.duration || 60;
//       const endTime = sessionTime + duration * 60000;
//       return now >= sessionTime && now < endTime;
//   };
//   // Apply filters for the "Browse" tab
//   useEffect(() => {
//     let filtered = [...mentors];
//     if (searchTerm) {
//       filtered = filtered.filter((m) =>
//         m.name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }
//     if (selectedDomain !== "all") {
//       filtered = filtered.filter((m) => m.domain === selectedDomain);
//     }
//     setFilteredMentors(filtered);
//   }, [searchTerm, selectedDomain, mentors]);

//   // Combine 1-on-1 and group sessions for the calendar
//   const allMySessions = [...myBookings, ...myGroupSessions];

//   // --- PAYMENT LOGIC ---
//   const handleOpenBookingModal = (mentor) => {
//     if (!user) {
//       toast.error("Please log in to book a session.");
//       return;
//     }
//     setSelectedMentor(mentor);
//     setIsBookingModalOpen(true);
//   };

//   const handlePayment = async () => {
//         if (!requestedDateTime) {
//         toast.error("Please select a date and time for the session.");
//         return;
//     }
//     if (!window.Razorpay) {
//       toast.error(
//         "Payment gateway failed to load. Please check your connection and refresh."
//       );
//       return;
//     }
//     try {
//       const { order, bookingId } = await createBookingOrder(selectedMentor._id, requestedDateTime);

//       const options = {
//         key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//         amount: order.amount,
//         currency: order.currency,
//         name: "MentorHub",
//         description: `1-on-1 Session with ${selectedMentor.name}`,
//         order_id: order.id,
//         handler: async function (response) {
//           const data = {
//             razorpay_payment_id: response.razorpay_payment_id,
//             razorpay_order_id: response.razorpay_order_id,
//             razorpay_signature: response.razorpay_signature,
//             bookingId: bookingId,
//           };
//           try {
//             const result = await verifyBookingPayment(data);
//             toast.success(result.message);
//             setIsBookingModalOpen(false);
//           } catch (error) {
//             toast.error("Payment verification failed. Please contact support.");
//           }
//         },
//         prefill: { name: user.name, email: user.email },
//         theme: { color: "#FFD700" },
//         modal: { ondismiss: () => toast.info("Payment was not completed.") },
//       };
//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (error) {
//       toast.error("Could not initiate payment. Please try again.");
//     }
//   };

//   const domains = [
//     { value: "all", label: "All Domains" },
//     { value: "programming", label: "Programming" },
//     { value: "aiml", label: "AI/ML" },
//     { value: "cybersecurity", label: "Cybersecurity" },
//     { value: "dsa", label: "DSA" },
//     { value: "blockchain", label: "Blockchain" },
//   ];

//   const getDomainLabel = (domain) => {
//     const domainMap = {
//       programming: "Programming",
//       aiml: "AI/ML",
//       cybersecurity: "Cybersecurity",
//       dsa: "DSA",
//       blockchain: "Blockchain",
//     };
//     return domainMap[domain] || domain;
//   };

//   if (isFetchingData) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <div className="min-h-screen py-20 px-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8 pt-8">
//           <h1 className="text-4xl font-bold text-white mb-2">
//             Welcome back, {user?.name || "Student"}!
//           </h1>
//           <p className="text-gray-300 text-lg">
//             Your learning journey continues here.
//           </p>
//         </div>

//         {/* Tabs */}
//         <div className="flex flex-wrap space-x-1 mb-8 bg-gray-800/50 p-1 rounded-lg w-fit">
//           <button
//             onClick={() => setActiveTab("sessions")}
//             className={`px-6 py-3 rounded-md font-medium transition-colors flex items-center gap-2 ${
//               activeTab === "sessions"
//                 ? "bg-yellow-400 text-navy-900"
//                 : "text-gray-300 hover:text-white"
//             }`}
//           >
//             {" "}
//             <Calendar size={16} /> My Sessions
//           </button>
//           <button
//             onClick={() => setActiveTab("browse")}
//             className={`px-6 py-3 rounded-md font-medium transition-colors flex items-center gap-2 ${
//               activeTab === "browse"
//                 ? "bg-yellow-400 text-navy-900"
//                 : "text-gray-300 hover:text-white"
//             }`}
//           >
//             {" "}
//             <Search size={16} /> Browse Mentors
//           </button>
//           <button
//             onClick={() => setActiveTab("transactions")}
//             className={`px-6 py-3 rounded-md font-medium transition-colors flex items-center gap-2 ${
//               activeTab === "transactions"
//                 ? "bg-yellow-400 text-navy-900"
//                 : "text-gray-300 hover:text-white"
//             }`}
//           >
//             {" "}
//             <CreditCard size={16} /> My Transactions
//           </button>
//         </div>

//         {/* --- MY SESSIONS TAB --- */}
//         {activeTab === 'sessions' && (
//           <div>
//             <h2 className="text-3xl font-bold text-white mb-6">Your Schedule</h2>
//             <div className="grid lg:grid-cols-3 gap-8">
//               <div className="lg:col-span-2">
//                 <CalendarView sessions={allSchedulableSessions} />
//               </div>
//               <div className="space-y-8">
//                 {/* ONGOING SESSIONS */}
//                 <div>
//                     <h3 className="text-xl font-semibold text-yellow-400 mb-4">Ongoing Sessions</h3>
//                     {ongoingSessions.length > 0 ? (
//                         ongoingSessions.map(session => (
//                             <div key={session._id} className="gradient-card p-4 rounded-xl border-l-4 border-yellow-400">
//                                 <p className="font-bold text-white">{session.title || session.sessionDetails?.title}</p>
//                                 <p className="text-sm text-gray-300 mb-2">with {session.mentorId.name}</p>
//                                 <button onClick={() => navigate(`/session/${session.roomId}`)} className="w-full btn-primary text-sm mt-2 py-2">Join Now</button>
//                             </div>
//                         ))
//                     ) : ( <p className="text-gray-400 text-sm">No sessions currently ongoing.</p> )}
//                 </div>

//                 {/* UPCOMING SESSIONS */}
//                 <div>
//                     <h3 className="text-xl font-semibold text-white mb-4">Upcoming Sessions</h3>
//                     {upcomingSessions.length > 0 ? (
//                         upcomingSessions.map(session => (
//                             <div key={session._id} className="gradient-card p-4 rounded-xl mb-4">
//                                 <p className="font-bold text-white">{session.title || session.sessionDetails?.title}</p>
//                                 <p className="text-sm text-gray-300 mb-2">with {session.mentorId.name}</p>
//                                 <div className="text-xs text-gray-400 flex items-center gap-4">
//                                     <span>{new Date(session.dateTime || session.scheduledTime).toLocaleDateString()}</span>
//                                     <span>{new Date(session.dateTime || session.scheduledTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>
//                                 </div>
//                             </div>
//                         ))
//                     ) : ( <p className="text-gray-400 text-sm">No upcoming sessions scheduled.</p> )}
//                 </div>

//                 {/* COMPLETED SESSIONS */}
//                 <div>
//                     <h3 className="text-xl font-semibold text-white mb-4">Completed Sessions</h3>
//                     {completedSessions.length > 0 ? (
//                         completedSessions.map(session => (
//                             <div key={session._id} className="gradient-card p-4 rounded-xl mb-4 opacity-60">
//                                 <p className="font-bold text-white">{session.title || session.sessionDetails?.title}</p>
//                                 <p className="text-sm text-gray-300">with {session.mentorId.name}</p>
//                             </div>
//                         ))
//                     ) : ( <p className="text-gray-400 text-sm">No sessions completed yet.</p> )}
//                 </div>

//               </div>
//             </div>
//           </div>
//         )}
//         {/* --- BROWSE MENTORS TAB (Corrected and filled in) --- */}
//         {activeTab === "browse" && (
//           <div>
//             <div className="gradient-card p-6 rounded-2xl mb-8">
//               <div className="flex flex-col md:flex-row gap-4">
//                 <div className="flex-1 relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                   <input
//                     type="text"
//                     placeholder="Search mentors by name..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
//                   />
//                 </div>
//                 <div className="relative">
//                   <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                   <select
//                     value={selectedDomain}
//                     onChange={(e) => setSelectedDomain(e.target.value)}
//                     className="w-full pl-12 pr-8 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 appearance-none cursor-pointer"
//                   >
//                     {domains.map((domain) => (
//                       <option key={domain.value} value={domain.value}>
//                         {domain.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filteredMentors.map(
//                 (mentor) =>
//                   // CORRECTED: Added a check to ensure mentor.profile exists before rendering the card
//                   mentor.profile && (
//                     <div
//                       key={mentor._id}
//                       className="gradient-card p-6 rounded-2xl hover:scale-105 transition-transform"
//                     >
//                       <div className="flex items-start mb-4">
//                         <div className="w-16 h-16 rounded-full mr-4 bg-gray-700 flex items-center justify-center">
//                           <UserCircle2 className="w-10 h-10 text-gray-400" />
//                         </div>
//                         <div className="flex-1">
//                           <h3 className="text-xl font-semibold text-white mb-1">
//                             {mentor.name}
//                           </h3>
//                           <p className="text-yellow-400 text-sm font-medium mb-1">
//                             {getDomainLabel(mentor.domain)}
//                           </p>
//                           <div className="flex items-center text-sm text-gray-400">
//                             <MapPin className="w-3 h-3 mr-1" />
//                             {mentor.profile.location}
//                           </div>
//                         </div>
//                       </div>
//                       <div className="flex items-center justify-between mb-4">
//                         <div className="flex items-center">
//                           <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
//                           <span className="text-white font-medium">
//                             {mentor.profile.rating || "New"}
//                           </span>
//                         </div>
//                         <div className="text-yellow-400 font-semibold">
//                           ₹{mentor.profile.hourlyRate}/hr
//                         </div>
//                       </div>
//                       <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
//                         {mentor.profile.bio}
//                       </p>
//                       <div className="flex items-center text-gray-300 text-sm mb-4">
//                         <Clock className="w-4 h-4 mr-1" />
//                         <span>
//                           {mentor.profile.experience} years experience
//                         </span>
//                       </div>
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={() => handleOpenBookingModal(mentor)}
//                           className="flex-1 bg-yellow-400 text-navy-900 font-semibold py-2 px-4 rounded-lg hover:bg-yellow-500 transition-colors flex items-center justify-center text-sm"
//                         >
//                           <Video className="w-4 h-4 mr-1" />
//                           1-on-1
//                         </button>
//                         <button
//                           onClick={() =>
//                             toast.info("Group session booking is coming soon!")
//                           }
//                           className="flex-1 border border-yellow-400 text-yellow-400 font-semibold py-2 px-4 rounded-lg hover:bg-yellow-400 hover:text-navy-900 transition-colors flex items-center justify-center text-sm"
//                         >
//                           <Users className="w-4 h-4 mr-1" />
//                           Group
//                         </button>
//                       </div>
//                     </div>
//                   )
//               )}
//             </div>
//             {filteredMentors.length === 0 && (
//               <div className="text-center py-12 gradient-card rounded-2xl">
//                 <p className="text-gray-400">
//                   No mentors found matching your criteria.
//                 </p>
//               </div>
//             )}
//           </div>
//         )}

//       {/* --- MY TRANSACTIONS TAB (UPDATED) --- */}
//       {activeTab === 'transactions' && (
//         <div>
//           <h2 className="text-3xl font-bold text-white mb-6">Payment History</h2>
//           <div className="gradient-card p-6 rounded-2xl">
//             <div className="overflow-x-auto">
//               <table className="w-full text-left">
//                 <thead><tr className="border-b border-gray-700"><th className="p-4 text-gray-300">Date</th><th className="p-4 text-gray-300">Details</th><th className="p-4 text-gray-300">Amount</th><th className="p-4 text-gray-300">Status</th></tr></thead>
//                 <tbody>
//                   {myTransactions.length > 0 ? (
//                     myTransactions.map(tx => (
//                       <tr key={tx._id} className="border-b border-gray-800">
//                         <td className="p-4 text-white">{new Date(tx.createdAt).toLocaleDateString()}</td>
//                         <td className="p-4 text-white">{tx.paymentDetails.status === 'refunded' ? 'Refund for session' : 'Session with'} {tx.mentorId.name}</td>
//                         <td className={`p-4 font-medium ${tx.paymentDetails.status === 'refunded' ? 'text-green-400' : 'text-red-400'}`}>
//                           {tx.paymentDetails.status === 'refunded' ? '+' : '-'} ₹{(tx.paymentDetails.amount / 100).toFixed(2)}
//                         </td>
//                         <td className="p-4 text-gray-400 capitalize">{tx.paymentDetails.status}</td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr><td colSpan="4" className="text-center py-12 text-gray-400">No transactions found.</td></tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}
//       </div>

//       {/* --- BOOKING MODAL --- */}
//       {isBookingModalOpen && selectedMentor && (
//         <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
//           <div className="gradient-card p-8 rounded-2xl max-w-md w-full relative">
//             <button
//               onClick={() => setIsBookingModalOpen(false)}
//               className="absolute top-4 right-4 text-gray-400 hover:text-white"
//             >
//               <X />
//             </button>
//             <h2 className="text-2xl font-bold text-white mb-4">
//               Confirm Booking
//             </h2>
//             <p className="text-gray-300 mb-6">
//               You are booking a 1-hour session with{" "}
//               <span className="font-semibold text-yellow-400">
//                 {selectedMentor.name}
//               </span>
//               .
//             </p>
//                         {/* --- NEW DATE/TIME PICKER --- */}
//             <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Date & Time</label>
//                 <input
//                     type="datetime-local"
//                     value={requestedDateTime}
//                     onChange={(e) => setRequestedDateTime(e.target.value)}
//                     className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
//                 />
//             </div>
//             {/* --- END --- */}
//             <div className="bg-gray-800/50 p-4 rounded-lg mb-6 space-y-2">
//               <div className="flex justify-between text-gray-300">
//                 <span>Mentor's Hourly Rate:</span>
//                 <span>₹{selectedMentor.profile.hourlyRate.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between text-gray-300">
//                 <span>Platform Fee (5%):</span>
//                 <span>
//                   ₹{(selectedMentor.profile.hourlyRate * 0.05).toFixed(2)}
//                 </span>
//               </div>
//               <div className="border-t border-gray-600 my-2"></div>
//               <div className="flex justify-between text-white font-bold text-lg">
//                 <span>Total Amount:</span>
//                 <span>
//                   ₹{(selectedMentor.profile.hourlyRate * 1.05).toFixed(2)}
//                 </span>
//               </div>
//             </div>
//             <button
//               onClick={handlePayment}
//               disabled={isLoading}
//               className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50"
//             >
//               {isLoading ? "Processing..." : "Request & Pay Now"}
//             </button>
//             <p className="text-xs text-gray-400 mt-4 text-center">
//               Your payment will be held securely until the mentor approves the
//               session.
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StudentDashboard;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import {
  Calendar,
  Clock,
  DollarSign,
  Users,
  Star,
  Bell,
  CheckCircle,
  XCircle,
  Video,
  X,
  MessageCircle,
  CreditCard,
  Search,
  Filter,
  MapPin,
  UserCircle2,
} from "lucide-react";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";
import CalendarView from "../components/CalendarView";
import ChatBot from "../components/ChatBot";
import JoyRideTour from "../tour/JoyRideTour";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const {
    user,
    getStudentDashboardData,
    createBookingOrder,
    verifyBookingPayment,
    isLoading,
  } = useAuthStore();

  // Data states
  const [mentors, setMentors] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [ongoingSessions, setOngoingSessions] = useState([]);
  const [completedSessions, setCompletedSessions] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [myGroupSessions, setMyGroupSessions] = useState([]);
  const [myTransactions, setMyTransactions] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [requestedDateTime, setRequestedDateTime] = useState("");
  // UI states
  const [activeTab, setActiveTab] = useState("sessions");
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);

  // Filter states for "Browse" tab
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("all");

  // Fetch all dashboard data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStudentDashboardData();
        console.log("Dashboard data fetched:", data);
        setMentors(data.mentors || []);
        setFilteredMentors(data.mentors || []);
        setUpcomingSessions(data.upcomingSessions || []);
        setOngoingSessions(data.ongoingSessions || []);
        setCompletedSessions(data.completedSessions || []);
        setMyTransactions(data.myTransactions || []);
        setMyBookings(data.myBookings || []);
        setMyGroupSessions(data.myGroupSessions || []);
      } catch (error) {
        toast.error("Failed to load dashboard data. Please refresh.");
      } finally {
        setIsFetchingData(false);
      }
    };
    fetchData();
  }, [getStudentDashboardData]);

  const allSchedulableSessions = [...upcomingSessions, ...ongoingSessions];
  const allSessions = [
    ...upcomingSessions,
    ...ongoingSessions,
    ...completedSessions,
  ].map((s) => {
    let status = "upcoming";
    if (ongoingSessions.some((os) => os._id === s._id)) status = "ongoing";
    else if (completedSessions.some((cs) => cs._id === s._id))
      status = "completed";
    return { ...s, status };
  });

  const isSessionActive = (session) => {
    const now = new Date().getTime();
    const sessionTime = new Date(
      session.scheduledTime || session.dateTime
    ).getTime();
    const duration = session.duration || session.sessionDetails?.duration || 60;
    const endTime = sessionTime + duration * 60000;
    return now >= sessionTime && now < endTime;
  };

  // Apply filters for the "Browse" tab
  useEffect(() => {
    let filtered = [...mentors];
    if (searchTerm) {
      filtered = filtered.filter((m) =>
        (m.name || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedDomain !== "all") {
      filtered = filtered.filter((m) => m.domain === selectedDomain);
    }
    setFilteredMentors(filtered);
  }, [searchTerm, selectedDomain, mentors]);

  // Combine 1-on-1 and group sessions for the calendar
  const allMySessions = [...myBookings, ...myGroupSessions];

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
    if (!requestedDateTime) {
      toast.error("Please select a date and time for the session.");
      return;
    }
    if (!window.Razorpay) {
      toast.error(
        "Payment gateway failed to load. Please check your connection and refresh."
      );
      return;
    }
    try {
      const { order, bookingId } = await createBookingOrder(
        selectedMentor._id,
        requestedDateTime
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "MentorHub",
        description: `1-on-1 Session with ${selectedMentor.name}`,
        order_id: order.id,
        handler: async function (response) {
          const data = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            bookingId: bookingId,
          };
          try {
            const result = await verifyBookingPayment(data);
            toast.success(result.message);
            setIsBookingModalOpen(false);
          } catch (error) {
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: { name: user.name, email: user.email },
        theme: { color: "#FFD700" },
        modal: { ondismiss: () => toast.info("Payment was not completed.") },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Could not initiate payment. Please try again.");
    }
  };

  const domains = [
    { value: "all", label: "All Domains" },
    { value: "programming", label: "Programming" },
    { value: "aiml", label: "AI/ML" },
    { value: "cybersecurity", label: "Cybersecurity" },
    { value: "dsa", label: "DSA" },
    { value: "blockchain", label: "Blockchain" },
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

  if (isFetchingData) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen py-20 px-4">
      {/* JoyRide tour component (relies on class targets present below) */}
      <JoyRideTour />

      {/* Chatbot (give it the expected target class for the tour) */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="chatbot-widget" aria-hidden="false">
          <ChatBot />
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header / Welcome */}
        <section
          className="mb-8 pt-8 dashboard-welcome"
          aria-label="dashboard welcome"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user?.name || "Student"}!
          </h1>
          <p className="text-gray-300 text-lg">
            Your learning journey continues here.
          </p>
        </section>

        {/* Tabs */}
        <section
          className="flex flex-wrap space-x-1 mb-8 bg-gray-800/50 p-1 rounded-lg w-fit dashboard-tabs"
          role="tablist"
          aria-label="dashboard tabs"
        >
          <button
            onClick={() => setActiveTab("sessions")}
            role="tab"
            aria-selected={activeTab === "sessions"}
            className={`px-6 py-3 rounded-md font-medium transition-colors flex items-center gap-2 ${
              activeTab === "sessions"
                ? "bg-yellow-400 text-navy-900"
                : "text-gray-300 hover:text-white"
            }`}
          >
            <Calendar size={16} /> My Sessions
          </button>
          <button
            onClick={() => setActiveTab("browse")}
            role="tab"
            aria-selected={activeTab === "browse"}
            className={`px-6 py-3 rounded-md font-medium transition-colors flex items-center gap-2 ${
              activeTab === "browse"
                ? "bg-yellow-400 text-navy-900"
                : "text-gray-300 hover:text-white"
            }`}
          >
            <Search size={16} /> Browse Mentors
          </button>
          <button
            onClick={() => setActiveTab("transactions")}
            role="tab"
            aria-selected={activeTab === "transactions"}
            className={`px-6 py-3 rounded-md font-medium transition-colors flex items-center gap-2 ${
              activeTab === "transactions"
                ? "bg-yellow-400 text-navy-900"
                : "text-gray-300 hover:text-white"
            }`}
          >
            <CreditCard size={16} /> My Transactions
          </button>
        </section>

        {/* --- MY SESSIONS TAB --- */}
        {activeTab === "sessions" && (
          <section aria-label="my sessions" className="sessions-section">
            <h2 className="text-3xl font-bold text-white mb-6">
              Your Schedule
            </h2>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {/* Calendar view (target for JoyRide) */}
                <section
                  className="sessions-calendar"
                  aria-label="sessions calendar"
                >
                  <CalendarView sessions={allSessions} />
                </section>
              </div>

              <aside className="space-y-8">
                {/* ONGOING SESSIONS */}
                <section
                  className="sessions-ongoing"
                  aria-label="ongoing sessions"
                >
                  <h3 className="text-xl font-semibold text-yellow-400 mb-4">
                    Ongoing Sessions
                  </h3>
                  {ongoingSessions.length > 0 ? (
                    ongoingSessions.map((session) => (
                      <div
                        key={session._id}
                        className="gradient-card p-4 rounded-xl border-l-4 border-yellow-400 mb-4"
                      >
                        <p className="font-bold text-white">
                          {session.title || session.sessionDetails?.title}
                        </p>
                        <p className="text-sm text-gray-300 mb-2">
                          with {session.mentorId?.name}
                        </p>
                        <button
                          onClick={() => navigate(`/session/${session.roomId}`)}
                          className="w-full btn-primary text-sm mt-2 py-2"
                        >
                          Join Now
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">
                      No sessions currently ongoing.
                    </p>
                  )}
                </section>

                {/* UPCOMING SESSIONS */}
                <section
                  className="sessions-upcoming"
                  aria-label="upcoming sessions"
                >
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Upcoming Sessions
                  </h3>
                  {upcomingSessions.length > 0 ? (
                    upcomingSessions.map((session) => (
                      <div
                        key={session._id}
                        className="gradient-card p-4 rounded-xl mb-4"
                      >
                        <p className="font-bold text-white">
                          {session.title || session.sessionDetails?.title}
                        </p>
                        <p className="text-sm text-gray-300 mb-2">
                          with {session.mentorId?.name}
                        </p>
                        <div className="text-xs text-gray-400 flex items-center gap-4">
                          <span>
                            {new Date(
                              session.dateTime || session.scheduledTime
                            ).toLocaleDateString()}
                          </span>
                          <span>
                            {new Date(
                              session.dateTime || session.scheduledTime
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">
                      No upcoming sessions scheduled.
                    </p>
                  )}
                </section>

                {/* COMPLETED SESSIONS */}
                <section aria-label="completed sessions">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Completed Sessions
                  </h3>
                  {completedSessions.length > 0 ? (
                    completedSessions.map((session) => (
                      <div
                        key={session._id}
                        className="gradient-card p-4 rounded-xl mb-4 opacity-60"
                      >
                        <p className="font-bold text-white">
                          {session.title || session.sessionDetails?.title}
                        </p>
                        <p className="text-sm text-gray-300">
                          with {session.mentorId?.name}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">
                      No sessions completed yet.
                    </p>
                  )}
                </section>
              </aside>
            </div>
          </section>
        )}

        {/* --- BROWSE MENTORS TAB --- */}
        {activeTab === "browse" && (
          <section className="browse-mentors" aria-label="browse mentors">
            <div className="gradient-card p-6 rounded-2xl mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search mentors by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                    aria-label="search mentors"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    className="w-full pl-12 pr-8 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 appearance-none cursor-pointer"
                    aria-label="filter by domain"
                  >
                    {domains.map((domain) => (
                      <option key={domain.value} value={domain.value}>
                        {domain.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentors.map(
                (mentor) =>
                  mentor.profile && (
                    <article
                      key={mentor._id}
                      className="gradient-card p-6 rounded-2xl hover:scale-105 transition-transform"
                      aria-labelledby={`mentor-${mentor._id}-name`}
                    >
                      <div className="flex items-start mb-4">
                        <div className="w-16 h-16 rounded-full mr-4 bg-gray-700 flex items-center justify-center">
                          <UserCircle2 className="w-10 h-10 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <h3
                            id={`mentor-${mentor._id}-name`}
                            className="text-xl font-semibold text-white mb-1"
                          >
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
                        <div className="text-yellow-400 font-semibold">
                          ₹{mentor.profile.hourlyRate}/hr
                        </div>
                      </div>

                      <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                        {mentor.profile.bio}
                      </p>

                      <div className="flex items-center text-gray-300 text-sm mb-4">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>
                          {mentor.profile.experience} years experience
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleOpenBookingModal(mentor)}
                          className="flex-1 bg-yellow-400 text-navy-900 font-semibold py-2 px-4 rounded-lg hover:bg-yellow-500 transition-colors flex items-center justify-center text-sm"
                        >
                          <Video className="w-4 h-4 mr-1" />
                          1-on-1
                        </button>
                        <button
                          onClick={() =>
                            toast.info("Group session booking is coming soon!")
                          }
                          className="flex-1 border border-yellow-400 text-yellow-400 font-semibold py-2 px-4 rounded-lg hover:bg-yellow-400 hover:text-navy-900 transition-colors flex items-center justify-center text-sm"
                        >
                          <Users className="w-4 h-4 mr-1" />
                          Group
                        </button>
                      </div>
                    </article>
                  )
              )}
            </div>

            {filteredMentors.length === 0 && (
              <div className="text-center py-12 gradient-card rounded-2xl">
                <p className="text-gray-400">
                  No mentors found matching your criteria.
                </p>
              </div>
            )}
          </section>
        )}

        {/* --- MY TRANSACTIONS TAB (UPDATED) --- */}
        {activeTab === "transactions" && (
          <section className="transactions-section" aria-label="transactions">
            <h2 className="text-3xl font-bold text-white mb-6">
              Payment History
            </h2>
            <div className="gradient-card p-6 rounded-2xl">
              <div className="overflow-x-auto">
                <table
                  className="w-full text-left transactions-table"
                  aria-label="transactions table"
                >
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="p-4 text-gray-300">Date</th>
                      <th className="p-4 text-gray-300">Details</th>
                      <th className="p-4 text-gray-300">Amount</th>
                      <th className="p-4 text-gray-300">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myTransactions.length > 0 ? (
                      myTransactions.map((tx) => {
                        const amountValue =
                          tx?.paymentDetails?.amount != null
                            ? tx.paymentDetails.amount
                            : 0;
                        const status = tx?.paymentDetails?.status || "unknown";
                        return (
                          <tr key={tx._id} className="border-b border-gray-800">
                            <td className="p-4 text-white">
                              {new Date(tx.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-4 text-white">
                              {status === "refunded"
                                ? "Refund for session"
                                : "Session with"}{" "}
                              {tx.mentorId?.name}
                            </td>
                            <td
                              className={`p-4 font-medium ${
                                status === "refunded"
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {status === "refunded" ? "+" : "-"} ₹
                              {(amountValue / 100).toFixed(2)}
                            </td>
                            <td className="p-4 text-gray-400 capitalize">
                              {status}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="text-center py-12 text-gray-400"
                        >
                          No transactions found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* --- BOOKING MODAL --- */}
      {isBookingModalOpen && selectedMentor && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="gradient-card p-8 rounded-2xl max-w-md w-full relative">
            <button
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              aria-label="close booking modal"
            >
              <X />
            </button>

            <h2 className="text-2xl font-bold text-white mb-4">
              Confirm Booking
            </h2>
            <p className="text-gray-300 mb-6">
              You are booking a 1-hour session with{" "}
              <span className="font-semibold text-yellow-400">
                {selectedMentor.name}
              </span>
              .
            </p>

            {/* --- DATE/TIME PICKER --- */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Preferred Date & Time
              </label>
              <input
                type="datetime-local"
                value={requestedDateTime}
                onChange={(e) => setRequestedDateTime(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                aria-label="preferred date and time"
              />
            </div>

            <div className="bg-gray-800/50 p-4 rounded-lg mb-6 space-y-2">
              <div className="flex justify-between text-gray-300">
                <span>Mentor's Hourly Rate:</span>
                <span>
                  ₹
                  {selectedMentor?.profile?.hourlyRate != null
                    ? Number(selectedMentor.profile.hourlyRate).toFixed(2)
                    : "0.00"}
                </span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Platform Fee (5%):</span>
                <span>
                  ₹
                  {selectedMentor?.profile?.hourlyRate != null
                    ? (
                        Number(selectedMentor.profile.hourlyRate) * 0.05
                      ).toFixed(2)
                    : "0.00"}
                </span>
              </div>
              <div className="border-t border-gray-600 my-2"></div>
              <div className="flex justify-between text-white font-bold text-lg">
                <span>Total Amount:</span>
                <span>
                  ₹
                  {selectedMentor?.profile?.hourlyRate != null
                    ? (
                        Number(selectedMentor.profile.hourlyRate) * 1.05
                      ).toFixed(2)
                    : "0.00"}
                </span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50"
            >
              {isLoading ? "Processing..." : "Request & Pay Now"}
            </button>

            <p className="text-xs text-gray-400 mt-4 text-center">
              Your payment will be held securely until the mentor approves the
              session.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
