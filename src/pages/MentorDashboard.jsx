// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuthStore } from "../store/authStore";
// import {
//   Calendar,
//   Clock,
//   DollarSign,
//   Users,
//   Star,
//   Bell,
//   CheckCircle,
//   XCircle,
//   Video,
//   MessageCircle,
//   CreditCard,
// } from "lucide-react";
// import { toast } from "react-toastify";
// import LoadingSpinner from "../components/LoadingSpinner";

// const MentorDashboard = () => {
//     const navigate = useNavigate();
//   const { user, createGroupSession, getMentorDashboardData, handleBookingRequest: handleRequestActionApi, isLoading } = useAuthStore();
  
//   // Data states
//   const [bookingRequests, setBookingRequests] = useState([]);
//   const [upcomingSessions, setUpcomingSessions] = useState([]);
//   const [ongoingSessions, setOngoingSessions] = useState([]);
//   const [completedSessions, setCompletedSessions] = useState([]);
//   const [stats, setStats] = useState({});
//   const [notifications, setNotifications] = useState([]);
//   const [transactions, setTransactions] = useState([]);
  
//   // UI states
//   const [activeTab, setActiveTab] = useState('requests');
//   const [isFetchingData, setIsFetchingData] = useState(true);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [confirmedDateTime, setConfirmedDateTime] = useState("");
//   const [sessionForm, setSessionForm] = useState({
//     title: "", description: "", date: "", time: "",
//     duration: "60", maxParticipants: "10", pricePerStudent: "15",
//   });

//   // Function to fetch all data
//   const fetchData = async () => {
//     try {
//       const data = await getMentorDashboardData();
//       setBookingRequests(data.bookingRequests || []);
//       setStats(data.stats || {});
//       setNotifications(data.notifications || []);
//       setTransactions(data.transactions || []);
//       setUpcomingSessions(data.upcomingSessions || []);
//       setOngoingSessions(data.ongoingSessions || []);
//       setCompletedSessions(data.completedSessions || []);
//     } catch (error) {
//       toast.error("Failed to load dashboard data.");
//     } finally {
//       setIsFetchingData(false);
//     }
//   };

//   // Fetch data on component mount
//   useEffect(() => {
//     fetchData();
//   }, []);

//   const openApprovalModal = (request) => {
//     setSelectedBooking(request);
//     const requestedDate = new Date(request.requestedDateTime).toISOString().slice(0, 16);
//     setConfirmedDateTime(requestedDate);
//     setIsApprovalModalOpen(true);
//   };

//   const handleConfirmApproval = async () => {
//     if (!confirmedDateTime) {
//         toast.error("Please set a time for the session.");
//         return;
//     }
//     try {
//         await handleRequestActionApi(selectedBooking._id, 'approve', confirmedDateTime);
//         toast.success("Session approved and student notified!");
//         setIsApprovalModalOpen(false);
//         fetchData(); // Refresh all dashboard data
//     } catch (error) {
//         toast.error(useAuthStore.getState().error || "Approval failed.");
//     }
//   };

//   const handleRejectRequest = async (bookingId) => {
//     try {
//         await handleRequestActionApi(bookingId, 'reject');
//         toast.info("Session rejected and student has been refunded.");
//         fetchData(); // Refresh data
//     } catch (error) {
//         toast.error(useAuthStore.getState().error || "Action failed.");
//     }
//   };

//   const handleCreateGroupSession = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await createGroupSession(sessionForm);
//       toast.success(response.message);
//       setUpcomingSessions(prev => [response.session, ...prev]);
//       setSessionForm({ title: '', description: '', date: '', time: '', duration: '60', maxParticipants: '10', pricePerStudent: '15' });
//       setActiveTab('sessions');
//     } catch (error) {
//       toast.error(useAuthStore.getState().error || "Failed to create session.");
//     }
//   };

//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setSessionForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const isSessionActive = (dateTime) => {
//       const sessionTime = new Date(dateTime).getTime();
//       const now = new Date().getTime();
//       return now >= sessionTime - 5 * 60 * 1000;
//   };

//   if (isFetchingData) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <div className="min-h-screen py-20 px-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Header with Notification Bell */}
//         <div className="mb-8 pt-8 flex justify-between items-center">
//           <div>
//             <h1 className="text-4xl font-bold text-white mb-2">
//               Mentor Dashboard
//             </h1>
//             <p className="text-gray-300 text-lg">
//               Welcome back, {user?.name || "Mentor"}!
//             </p>
//           </div>
//           <div className="relative">
//             <button
//               onClick={() => setShowNotifications(!showNotifications)}
//               className="relative text-gray-300 hover:text-white"
//             >
//               <Bell size={24} />
//               {notifications.length > 0 && (
//                 <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-gray-900">
//                   {notifications.length}
//                 </span>
//               )}
//             </button>
//             {showNotifications && (
//               <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-20">
//                 <div className="p-4 font-bold text-white border-b border-gray-700">
//                   Notifications
//                 </div>
//                 {notifications.length > 0 ? (
//                   notifications.map((notif) => (
//                     <div
//                       key={notif._id}
//                       className="p-4 border-b border-gray-700 text-sm text-gray-300 hover:bg-gray-700"
//                     >
//                       {notif.message}
//                       <p className="text-xs text-gray-500 mt-1">
//                         {new Date(notif.createdAt).toLocaleString()}
//                       </p>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="p-4 text-gray-400">No new notifications.</p>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Stats Cards (Now with live data) */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
//           <div className="gradient-card p-6 rounded-2xl text-center">
//             <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
//               <Video className="w-6 h-6 text-blue-400" />
//             </div>
//             <div className="text-2xl font-bold text-white mb-1">
//               {stats.totalSessions}
//             </div>
//             <div className="text-gray-300 text-sm">Completed Sessions</div>
//           </div>
//           <div className="gradient-card p-6 rounded-2xl text-center">
//             <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
//               <DollarSign className="w-6 h-6 text-green-400" />
//             </div>
//             <div className="text-2xl font-bold text-white mb-1">
//               ₹{stats.totalEarnings?.toFixed(2)}
//             </div>
//             <div className="text-gray-300 text-sm">Total Earnings</div>
//           </div>
//           <div className="gradient-card p-6 rounded-2xl text-center">
//             <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
//               <Star className="w-6 h-6 text-yellow-400" />
//             </div>
//             <div className="text-2xl font-bold text-white mb-1">
//               {stats.averageRating}
//             </div>
//             <div className="text-gray-300 text-sm">Average Rating</div>
//           </div>
//           <div className="gradient-card p-6 rounded-2xl text-center">
//             <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
//               <Users className="w-6 h-6 text-purple-400" />
//             </div>
//             <div className="text-2xl font-bold text-white mb-1">
//               {stats.totalStudents}
//             </div>
//             <div className="text-gray-300 text-sm">Unique Students</div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="flex flex-wrap space-x-1 mb-8 bg-gray-800/50 p-1 rounded-lg w-fit">
//           <button
//             onClick={() => setActiveTab("requests")}
//             className={`px-6 py-3 rounded-md font-medium transition-colors flex items-center gap-2 ${
//               activeTab === "requests"
//                 ? "bg-yellow-400 text-navy-900"
//                 : "text-gray-300 hover:text-white"
//             }`}
//           >
//             <Bell size={16} /> Booking Requests{" "}
//             {bookingRequests.length > 0 && (
//               <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
//                 {bookingRequests.length}
//               </span>
//             )}
//           </button>
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
//             onClick={() => setActiveTab("create")}
//             className={`px-6 py-3 rounded-md font-medium transition-colors flex items-center gap-2 ${
//               activeTab === "create"
//                 ? "bg-yellow-400 text-navy-900"
//                 : "text-gray-300 hover:text-white"
//             }`}
//           >
//             {" "}
//             <Video size={16} /> Create Session
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
//             <CreditCard size={16} /> Transactions
//           </button>
//         </div>

//         {/* --- BOOKING REQUESTS TAB --- */}
//         {activeTab === 'requests' && (
//           <div className="space-y-6">
//             <h2 className="text-3xl font-bold text-white">1-on-1 Session Requests</h2>
//             {bookingRequests.length > 0 ? (
//               bookingRequests.map((request) => (
//                 <div key={request._id} className="gradient-card p-6 rounded-2xl">
//                   <div className="flex flex-wrap items-start justify-between gap-4">
//                     <div className="flex-1">
//                       <h3 className="text-xl font-semibold text-white">{request.studentId.name}</h3>
//                       <p className="text-gray-400 text-sm mb-4">{request.studentId.email}</p>
//                       <div className="bg-gray-800/50 p-3 rounded-lg text-sm">
//                         <p className="text-gray-300">Requested Time:</p>
//                         <p className="font-semibold text-white">{new Date(request.requestedDateTime).toLocaleString()}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-3">
//                       <button onClick={() => openApprovalModal(request)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"><CheckCircle size={16} /><span>Approve</span></button>
//                       <button onClick={() => handleRejectRequest(request._id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"><XCircle size={16} /><span>Reject</span></button>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-12 gradient-card rounded-2xl"><Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" /><p className="text-gray-300 text-lg">No pending booking requests.</p></div>
//             )}
//           </div>
//         )}

//         {activeTab === 'sessions' && (
//           <div className="space-y-8">
//             {/* ONGOING SESSIONS */}
//             <div>
//               <h3 className="text-2xl font-bold text-yellow-400 mb-4">Ongoing Sessions</h3>
//               {ongoingSessions.length > 0 ? (
//                 ongoingSessions.map(session => (
//                   <div key={session._id} className="gradient-card p-6 rounded-2xl border-l-4 border-yellow-400">
//                     <div className="flex flex-wrap items-center justify-between gap-4">
//                       <div>
//                         <h3 className="text-xl font-semibold text-white mb-1">{session.title || session.sessionDetails?.title}</h3>
//                         <p className="text-gray-300 mb-2">{session.sessionType === 'group' ? `Group Session` : `1-on-1 with ${session.studentId?.name}`}</p>
//                       </div>
//                       <button onClick={() => navigate(`/session/${session.roomId}`)} className="btn-primary text-sm px-4 py-2 flex items-center space-x-2">
//                         <Video className="w-4 h-4" />
//                         <span>Start Now</span>
//                       </button>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-gray-400">No sessions currently ongoing.</p>
//               )}
//             </div>

//             {/* UPCOMING SESSIONS */}
//             <div>
//               <h3 className="text-2xl font-bold text-white mb-4">Upcoming Sessions</h3>
//               {upcomingSessions.length > 0 ? (
//                 <div className="space-y-4">
//                   {upcomingSessions.map(session => (
//                     <div key={session._id} className="gradient-card p-6 rounded-2xl">
//                       <div className="flex flex-wrap items-center justify-between gap-4">
//                         <div>
//                           <h3 className="text-xl font-semibold text-white mb-1">{session.title || session.sessionDetails?.title}</h3>
//                           <p className="text-gray-300 mb-2">{session.sessionType === 'group' ? `Group Session` : `1-on-1 with ${session.studentId?.name}`}</p>
//                           <div className="flex items-center space-x-4 text-sm text-gray-400">
//                             <div className="flex items-center"><Calendar className="w-4 h-4 mr-1" />{new Date(session.dateTime || session.scheduledTime).toLocaleDateString()}</div>
//                             <div className="flex items-center"><Clock className="w-4 h-4 mr-1" />{new Date(session.dateTime || session.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
//                           </div>
//                         </div>
//                         <button className="btn-secondary text-sm px-4 py-2" disabled>Starts Soon</button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-400">No new sessions scheduled.</p>
//               )}
//             </div>

//             {/* COMPLETED SESSIONS */}
//             <div>
//               <h3 className="text-2xl font-bold text-white mb-4">Completed Sessions</h3>
//               {completedSessions.length > 0 ? (
//                 <div className="space-y-4">
//                   {completedSessions.map(session => (
//                     <div key={session._id} className="gradient-card p-6 rounded-2xl opacity-60">
//                       <h3 className="text-xl font-semibold text-white mb-1">{session.title || session.sessionDetails?.title}</h3>
//                       <p className="text-gray-300">with {session.studentId?.name || "Group"}</p>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-400">No sessions completed yet.</p>
//               )}
//             </div>
//           </div>
//         )}

//         {/* --- CREATE SESSION TAB --- */}
//         {activeTab === "create" && (
//           <div className="max-w-2xl mx-auto">
//             <div className="gradient-card p-8 rounded-2xl">
//               <h3 className="text-2xl font-semibold text-white mb-6 text-center">
//                 Create a New Group Session
//               </h3>
//               <form onSubmit={handleCreateGroupSession} className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">
//                     Session Title
//                   </label>
//                   <input
//                     type="text"
//                     name="title"
//                     value={sessionForm.title}
//                     onChange={handleFormChange}
//                     className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
//                     placeholder="e.g., Advanced C++ Concepts"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">
//                     Description
//                   </label>
//                   <textarea
//                     rows="4"
//                     name="description"
//                     value={sessionForm.description}
//                     onChange={handleFormChange}
//                     className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 resize-none"
//                     placeholder="Describe what students will learn..."
//                     required
//                   ></textarea>
//                 </div>
//                 <div className="grid md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-300 mb-2">
//                       Date
//                     </label>
//                     <input
//                       type="date"
//                       name="date"
//                       value={sessionForm.date}
//                       onChange={handleFormChange}
//                       className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-300 mb-2">
//                       Time
//                     </label>
//                     <input
//                       type="time"
//                       name="time"
//                       value={sessionForm.time}
//                       onChange={handleFormChange}
//                       className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
//                       required
//                     />
//                   </div>
//                 </div>
//                 <div className="grid md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-300 mb-2">
//                       Duration (minutes)
//                     </label>
//                     <input
//                       type="number"
//                       name="duration"
//                       value={sessionForm.duration}
//                       onChange={handleFormChange}
//                       min="30"
//                       max="180"
//                       step="15"
//                       className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-300 mb-2">
//                       Max Participants
//                     </label>
//                     <input
//                       type="number"
//                       name="maxParticipants"
//                       value={sessionForm.maxParticipants}
//                       onChange={handleFormChange}
//                       min="2"
//                       max="20"
//                       className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
//                       required
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">
//                     Price per Student ($)
//                   </label>
//                   <input
//                     type="number"
//                     name="pricePerStudent"
//                     value={sessionForm.pricePerStudent}
//                     onChange={handleFormChange}
//                     min="5"
//                     className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
//                     required
//                   />
//                 </div>
//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className="w-full btn-primary text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//                 >
//                   {isLoading ? (
//                     <>
//                       <div className="spinner mr-2"></div>
//                       Creating...
//                     </>
//                   ) : (
//                     "Create Group Session"
//                   )}
//                 </button>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* --- TRANSACTIONS TAB --- */}
//         {activeTab === "transactions" && (
//           <div>
//             <h2 className="text-3xl font-bold text-white mb-6">
//               Your Earnings & Transactions
//             </h2>
//             <div className="gradient-card p-6 rounded-2xl">
//               <div className="flex flex-wrap justify-between items-center gap-4 mb-6 bg-gray-800/50 p-4 rounded-lg">
//                 <div>
//                   <p className="text-gray-400">
//                     Total Earnings (Completed Sessions)
//                   </p>
//                   <p className="text-2xl font-bold text-white">
//                     ₹{stats.totalEarnings?.toFixed(2)}
//                   </p>
//                 </div>
//                 <button
//                   className="btn-primary"
//                   onClick={() => toast.info("Withdrawal feature coming soon!")}
//                 >
//                   Withdraw Funds
//                 </button>
//               </div>
//               <h3 className="text-xl font-semibold text-white mb-4">
//                 Transaction History
//               </h3>
//               <div className="overflow-x-auto">
//                 <table className="w-full text-left">
//                   <thead>
//                     <tr className="border-b border-gray-700">
//                       <th className="p-4 text-gray-300">Date Completed</th>
//                       <th className="p-4 text-gray-300">Student</th>
//                       <th className="p-4 text-gray-300">Amount Earned</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {transactions.length > 0 ? (
//                       transactions.map((tx) => (
//                         <tr key={tx._id} className="border-b border-gray-800">
//                           <td className="p-4 text-white">
//                             {new Date(tx.date).toLocaleDateString()}
//                           </td>
//                           <td className="p-4 text-white">{tx.studentName}</td>
//                           <td className="p-4 text-green-400 font-medium">
//                             + ₹{tx.amount.toFixed(2)}
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td
//                           colSpan="3"
//                           className="text-center py-12 text-gray-400"
//                         >
//                           No completed transactions found.
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         )}

//               {/* --- APPROVAL MODAL --- */}
//       {isApprovalModalOpen && selectedBooking && (
//         <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
//           <div className="gradient-card p-8 rounded-2xl max-w-md w-full relative">
//             <button onClick={() => setIsApprovalModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><XCircle /></button>
//             <h2 className="text-2xl font-bold text-white mb-4">Confirm Session Time</h2>
//             <p className="text-gray-300 mb-6">Confirm or adjust the session time for your 1-on-1 with <span className="font-semibold text-yellow-400">{selectedBooking.studentId.name}</span>.</p>
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">Scheduled Date & Time</label>
//               <input type="datetime-local" value={confirmedDateTime} onChange={(e) => setConfirmedDateTime(e.target.value)} className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white" />
//             </div>
//             <div className="mt-6 flex gap-4">
//               <button onClick={() => setIsApprovalModalOpen(false)} className="w-full btn-secondary py-3">Cancel</button>
//               <button onClick={handleConfirmApproval} disabled={isLoading} className="w-full btn-primary py-3 disabled:opacity-50">{isLoading ? 'Confirming...' : 'Confirm & Approve'}</button>
//             </div>
//           </div>
//         </div>
//       )}
//       </div>
//     </div>
//   );
// };

// export default MentorDashboard;
















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
  CreditCard,
} from "lucide-react";
import { toast } from "react-toastify";
import ChatBot from "../components/ChatBot";
import LoadingSpinner from "../components/LoadingSpinner";
import JoyRideTour from "../tour/JoyRideTour"; // Ensure this path is correct

const MentorDashboard = () => {
  const navigate = useNavigate();
  const {
    user,
    createGroupSession,
    getMentorDashboardData,
    handleBookingRequest: handleRequestActionApi,
    isLoading,
  } = useAuthStore();

  // Data states
  const [bookingRequests, setBookingRequests] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [ongoingSessions, setOngoingSessions] = useState([]);
  const [completedSessions, setCompletedSessions] = useState([]);
  const [stats, setStats] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // UI states
  const [activeTab, setActiveTab] = useState("requests");
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [confirmedDateTime, setConfirmedDateTime] = useState("");
  const [sessionForm, setSessionForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: "60",
    maxParticipants: "10",
    pricePerStudent: "15",
  });

  // Function to fetch all data
  const fetchData = async () => {
    try {
      const data = await getMentorDashboardData();
      setBookingRequests(data.bookingRequests || []);
      setStats(data.stats || {});
      setNotifications(data.notifications || []);
      setTransactions(data.transactions || []);
      setUpcomingSessions(data.upcomingSessions || []);
      setOngoingSessions(data.ongoingSessions || []);
      setCompletedSessions(data.completedSessions || []);
    } catch (error) {
      toast.error("Failed to load dashboard data.");
    } finally {
      setIsFetchingData(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openApprovalModal = (request) => {
    setSelectedBooking(request);
    const requestedDate = new Date(request.requestedDateTime).toISOString().slice(0, 16);
    setConfirmedDateTime(requestedDate);
    setIsApprovalModalOpen(true);
  };

  const handleConfirmApproval = async () => {
    if (!confirmedDateTime) {
      toast.error("Please set a time for the session.");
      return;
    }
    try {
      await handleRequestActionApi(selectedBooking._id, "approve", confirmedDateTime);
      toast.success("Session approved and student notified!");
      setIsApprovalModalOpen(false);
      fetchData(); // Refresh all dashboard data
    } catch (error) {
      toast.error(useAuthStore.getState().error || "Approval failed.");
    }
  };

  const handleRejectRequest = async (bookingId) => {
    try {
      await handleRequestActionApi(bookingId, "reject");
      toast.info("Session rejected and student has been refunded.");
      fetchData(); // Refresh data
    } catch (error) {
      toast.error(useAuthStore.getState().error || "Action failed.");
    }
  };

  const handleCreateGroupSession = async (e) => {
    e.preventDefault();
    try {
      const response = await createGroupSession(sessionForm);
      toast.success(response.message);
      setUpcomingSessions((prev) => [response.session, ...prev]);
      setSessionForm({
        title: "",
        description: "",
        date: "",
        time: "",
        duration: "60",
        maxParticipants: "10",
        pricePerStudent: "15",
      });
      setActiveTab("sessions");
    } catch (error) {
      toast.error(useAuthStore.getState().error || "Failed to create session.");
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setSessionForm((prev) => ({ ...prev, [name]: value }));
  };

  const isSessionActive = (dateTime) => {
    const sessionTime = new Date(dateTime).getTime();
    const now = new Date().getTime();
    return now >= sessionTime - 5 * 60 * 1000;
  };

  if (isFetchingData) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen py-20 px-4">
      {/* JoyRide Tour component (runs on first render) */}
      <JoyRideTour />

      {/* Chatbot widget - add class for tour */}
      <div className="chatbot-widget fixed bottom-6 right-6 z-40">
        <ChatBot />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header with Notification Bell */}
        <section
          aria-labelledby="mentor-dashboard-welcome"
          className="mentor-dashboard-welcome mb-8 pt-8 flex justify-between items-center"
        >
          <div>
            <h1 id="mentor-dashboard-welcome" className="text-4xl font-bold text-white mb-2">
              Mentor Dashboard
            </h1>
            <p className="text-gray-300 text-lg">
              Welcome back, {user?.name || "Mentor"}!
            </p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative text-gray-300 hover:text-white"
              aria-label="Toggle notifications"
            >
              <Bell size={24} />
              {notifications.length > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-gray-900">
                  {notifications.length}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-20">
                <div className="p-4 font-bold text-white border-b border-gray-700">Notifications</div>
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div
                      key={notif._id}
                      className="p-4 border-b border-gray-700 text-sm text-gray-300 hover:bg-gray-700"
                    >
                      {notif.message}
                      <p className="text-xs text-gray-500 mt-1">{new Date(notif.createdAt).toLocaleString()}</p>
                    </div>
                  ))
                ) : (
                  <p className="p-4 text-gray-400">No new notifications.</p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Stats Cards (Now with live data) */}
        <section aria-label="Mentor stats" className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="gradient-card p-6 rounded-2xl text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Video className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stats.totalSessions}</div>
              <div className="text-gray-300 text-sm">Completed Sessions</div>
            </div>
            <div className="gradient-card p-6 rounded-2xl text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">₹{stats.totalEarnings?.toFixed(2)}</div>
              <div className="text-gray-300 text-sm">Total Earnings</div>
            </div>
            <div className="gradient-card p-6 rounded-2xl text-center">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stats.averageRating}</div>
              <div className="text-gray-300 text-sm">Average Rating</div>
            </div>
            <div className="gradient-card p-6 rounded-2xl text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stats.totalStudents}</div>
              <div className="text-gray-300 text-sm">Unique Students</div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section aria-label="Dashboard tabs" className="mb-8">
          <div className="dashboard-tabs flex flex-wrap space-x-1 bg-gray-800/50 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab("requests")}
              className={`px-6 py-3 rounded-md font-medium transition-colors flex items-center gap-2 ${
                activeTab === "requests" ? "bg-yellow-400 text-navy-900" : "text-gray-300 hover:text-white"
              }`}
            >
              <Bell size={16} /> Booking Requests{" "}
              {bookingRequests.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {bookingRequests.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("sessions")}
              className={`px-6 py-3 rounded-md font-medium transition-colors flex items-center gap-2 ${
                activeTab === "sessions" ? "bg-yellow-400 text-navy-900" : "text-gray-300 hover:text-white"
              }`}
            >
              <Calendar size={16} /> My Sessions
            </button>
            <button
              onClick={() => setActiveTab("create")}
              className={`px-6 py-3 rounded-md font-medium transition-colors flex items-center gap-2 ${
                activeTab === "create" ? "bg-yellow-400 text-navy-900" : "text-gray-300 hover:text-white"
              }`}
            >
              <Video size={16} /> Create Session
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`px-6 py-3 rounded-md font-medium transition-colors flex items-center gap-2 ${
                activeTab === "transactions" ? "bg-yellow-400 text-navy-900" : "text-gray-300 hover:text-white"
              }`}
            >
              <CreditCard size={16} /> Transactions
            </button>
            {/* add settings quick access for the tour */}
            <button
              onClick={() => toast.info("Open settings panel (not implemented in this component)")}
              className="px-4 py-3 rounded-md text-gray-300 hover:text-white"
            >
              Settings
            </button>
          </div>
        </section>

        {/* --- BOOKING REQUESTS TAB --- */}
        {activeTab === "requests" && (
          <section
            aria-labelledby="mentor-requests-heading"
            className="mentor-student-requests space-y-6"
          >
            <h2 id="mentor-requests-heading" className="text-3xl font-bold text-white">
              1-on-1 Session Requests
            </h2>
            {bookingRequests.length > 0 ? (
              bookingRequests.map((request) => (
                <div key={request._id} className="gradient-card p-6 rounded-2xl">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white">{request.studentId.name}</h3>
                      <p className="text-gray-400 text-sm mb-4">{request.studentId.email}</p>
                      <div className="bg-gray-800/50 p-3 rounded-lg text-sm">
                        <p className="text-gray-300">Requested Time:</p>
                        <p className="font-semibold text-white">{new Date(request.requestedDateTime).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => openApprovalModal(request)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                      >
                        <CheckCircle size={16} />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                      >
                        <XCircle size={16} />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 gradient-card rounded-2xl">
                <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 text-lg">No pending booking requests.</p>
              </div>
            )}
          </section>
        )}

        {/* --- SESSIONS TAB --- */}
        {activeTab === "sessions" && (
          <section aria-labelledby="mentor-sessions-heading" className="mentor-sessions-list space-y-8">
            <h2 id="mentor-sessions-heading" className="sr-only">Sessions</h2>

            {/* ONGOING SESSIONS */}
            <div aria-labelledby="ongoing-sessions-heading" className="sessions-ongoing">
              <h3 id="ongoing-sessions-heading" className="text-2xl font-bold text-yellow-400 mb-4">Ongoing Sessions</h3>
              {ongoingSessions.length > 0 ? (
                ongoingSessions.map((session) => (
                  <div key={session._id} className="gradient-card p-6 rounded-2xl border-l-4 border-yellow-400">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1">{session.title || session.sessionDetails?.title}</h3>
                        <p className="text-gray-300 mb-2">{session.sessionType === "group" ? `Group Session` : `1-on-1 with ${session.studentId?.name}`}</p>
                      </div>
                      <button onClick={() => navigate(`/session/${session.roomId}`)} className="btn-primary text-sm px-4 py-2 flex items-center space-x-2">
                        <Video className="w-4 h-4" />
                        <span>Start Now</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No sessions currently ongoing.</p>
              )}
            </div>

            {/* UPCOMING SESSIONS */}
            <div aria-labelledby="upcoming-sessions-heading" className="sessions-upcoming mentor-calendar">
              <h3 id="upcoming-sessions-heading" className="text-2xl font-bold text-white mb-4">Upcoming Sessions</h3>
              {upcomingSessions.length > 0 ? (
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div key={session._id} className="gradient-card p-6 rounded-2xl">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-1">{session.title || session.sessionDetails?.title}</h3>
                          <p className="text-gray-300 mb-2">{session.sessionType === "group" ? `Group Session` : `1-on-1 with ${session.studentId?.name}`}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <div className="flex items-center"><Calendar className="w-4 h-4 mr-1" />{new Date(session.dateTime || session.scheduledTime).toLocaleDateString()}</div>
                            <div className="flex items-center"><Clock className="w-4 h-4 mr-1" />{new Date(session.dateTime || session.scheduledTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                          </div>
                        </div>
                        <button className="btn-secondary text-sm px-4 py-2" disabled>Starts Soon</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No new sessions scheduled.</p>
              )}
            </div>

            {/* COMPLETED SESSIONS */}
            <div aria-labelledby="completed-sessions-heading" className="sessions-completed">
              <h3 id="completed-sessions-heading" className="text-2xl font-bold text-white mb-4">Completed Sessions</h3>
              {completedSessions.length > 0 ? (
                <div className="space-y-4">
                  {completedSessions.map((session) => (
                    <div key={session._id} className="gradient-card p-6 rounded-2xl opacity-60">
                      <h3 className="text-xl font-semibold text-white mb-1">{session.title || session.sessionDetails?.title}</h3>
                      <p className="text-gray-300">with {session.studentId?.name || "Group"}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No sessions completed yet.</p>
              )}
            </div>
          </section>
        )}

        {/* --- CREATE SESSION TAB --- */}
        {activeTab === "create" && (
          <section aria-labelledby="create-session-heading" className="max-w-2xl mx-auto">
            <div className="gradient-card p-8 rounded-2xl">
              <h3 id="create-session-heading" className="text-2xl font-semibold text-white mb-6 text-center">
                Create a New Group Session
              </h3>
              <form onSubmit={handleCreateGroupSession} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Session Title</label>
                  <input
                    type="text"
                    name="title"
                    value={sessionForm.title}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                    placeholder="e.g., Advanced C++ Concepts"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    rows="4"
                    name="description"
                    value={sessionForm.description}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 resize-none"
                    placeholder="Describe what students will learn..."
                    required
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={sessionForm.date}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Time</label>
                    <input
                      type="time"
                      name="time"
                      value={sessionForm.time}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                      required
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Duration (minutes)</label>
                    <input
                      type="number"
                      name="duration"
                      value={sessionForm.duration}
                      onChange={handleFormChange}
                      min="30"
                      max="180"
                      step="15"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Max Participants</label>
                    <input
                      type="number"
                      name="maxParticipants"
                      value={sessionForm.maxParticipants}
                      onChange={handleFormChange}
                      min="2"
                      max="20"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price per Student ($)</label>
                  <input
                    type="number"
                    name="pricePerStudent"
                    value={sessionForm.pricePerStudent}
                    onChange={handleFormChange}
                    min="5"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="spinner mr-2" />
                      Creating...
                    </>
                  ) : (
                    "Create Group Session"
                  )}
                </button>
              </form>
            </div>
          </section>
        )}

        {/* --- TRANSACTIONS TAB --- */}
        {activeTab === "transactions" && (
          <section aria-labelledby="mentor-earnings-heading" className="mentor-earnings">
            <h2 id="mentor-earnings-heading" className="text-3xl font-bold text-white mb-6">Your Earnings & Transactions</h2>
            <div className="gradient-card p-6 rounded-2xl">
              <div className="flex flex-wrap justify-between items-center gap-4 mb-6 bg-gray-800/50 p-4 rounded-lg">
                <div>
                  <p className="text-gray-400">Total Earnings (Completed Sessions)</p>
                  <p className="text-2xl font-bold text-white">₹{stats.totalEarnings?.toFixed(2)}</p>
                </div>
                <button className="btn-primary" onClick={() => toast.info("Withdrawal feature coming soon!")}>
                  Withdraw Funds
                </button>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Transaction History</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left transactions-table">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="p-4 text-gray-300">Date Completed</th>
                      <th className="p-4 text-gray-300">Student</th>
                      <th className="p-4 text-gray-300">Amount Earned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length > 0 ? (
                      transactions.map((tx) => (
                        <tr key={tx._id} className="border-b border-gray-800">
                          <td className="p-4 text-white">{new Date(tx.date).toLocaleDateString()}</td>
                          <td className="p-4 text-white">{tx.studentName}</td>
                          <td className="p-4 text-green-400 font-medium">+ ₹{tx.amount.toFixed(2)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center py-12 text-gray-400">No completed transactions found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* --- ADDITIONAL SECTIONS FOR TOUR TARGETS --- */}
        <section aria-label="reviews" className="mentor-reviews mt-10">
          <h3 className="text-xl font-semibold text-white mb-4">Student Reviews</h3>
          <div className="gradient-card p-6 rounded-2xl text-gray-300">No reviews to display here yet.</div>
        </section>

        <section aria-label="settings" className="mentor-settings mt-8">
          <h3 className="text-xl font-semibold text-white mb-4">Settings</h3>
          <div className="gradient-card p-6 rounded-2xl text-gray-300">
            Quick links to update profile, set availability, and manage preferences.
          </div>
        </section>

        {/* --- APPROVAL MODAL --- */}
        {isApprovalModalOpen && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="gradient-card p-8 rounded-2xl max-w-md w-full relative">
              <button onClick={() => setIsApprovalModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                <XCircle />
              </button>
              <h2 className="text-2xl font-bold text-white mb-4">Confirm Session Time</h2>
              <p className="text-gray-300 mb-6">
                Confirm or adjust the session time for your 1-on-1 with{" "}
                <span className="font-semibold text-yellow-400">{selectedBooking.studentId.name}</span>.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Scheduled Date & Time</label>
                <input
                  type="datetime-local"
                  value={confirmedDateTime}
                  onChange={(e) => setConfirmedDateTime(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div className="mt-6 flex gap-4">
                <button onClick={() => setIsApprovalModalOpen(false)} className="w-full btn-secondary py-3">Cancel</button>
                <button onClick={handleConfirmApproval} disabled={isLoading} className="w-full btn-primary py-3 disabled:opacity-50">
                  {isLoading ? "Confirming..." : "Confirm & Approve"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorDashboard;