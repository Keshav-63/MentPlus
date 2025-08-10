import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";

// Component Imports
import Navbar from "./components/Navbar";
import LoadingSpinner from "./components/LoadingSpinner";
// Page Imports
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import EmailVerificationPage from "./pages/EmailVerificationPage"; 
import SubjectSelection from "./pages/SubjectSelection";
import DomainSelection from "./pages/DomainSelection";
import MentorTest from "./pages/MentorTest";
import ProfileCompletion from "./pages/ProfileCompletion";
import StudentDashboard from "./pages/StudentDashboard";
import MentorDashboard from "./pages/MentorDashboard";
import VideoCallPage from "./pages/VideoCallPage";
import ChatPage from "./pages/ChatPage";
import JoyRideTour from "./tour/JoyRideTour";

// --- Route Protection Components ---
// Protects routes that require a specific user role (e.g., 'student' or 'mentor')
const RoleProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user?.role) {
      toast.error("Please login first.");
      navigate("/login", { replace: true });
    } else {
      const allowedRoles = Array.isArray(roles) ? roles : [roles];
      if (!allowedRoles.includes(user.role)) {
        toast.error("Access denied.");
        navigate("/", { replace: true });
      }
    }
  }, [isAuthenticated, user, roles, navigate]);

  // Prevent rendering children while redirecting
  if (!isAuthenticated || !user?.role) return null;

  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  if (!allowedRoles.includes(user.role)) return null;

  return children;
};

// Redirects users who are already logged in away from auth pages (Login, Signup)
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    // If user is already logged in, redirect them to the home page
    return <Navigate to="/" replace />;
  }

  return children;
};

// --- Main App Component ---

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  // On initial app load, check if the user has a valid session
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Show a loading spinner while the auth check is in progress
  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-navy-900 to-gray-800">
      <Navbar />
      <JoyRideTour />
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route
          path="/chat"
          element={
            <RoleProtectedRoute roles={["mentor", "student"]}>
              <ChatPage />
            </RoleProtectedRoute>
          }
        />
        <Route path="/contact" element={<ContactPage />} />

        {/* --- Auth & Signup Flow Routes (for logged-out users) --- */}
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <SignupPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <RedirectAuthenticatedUser>
              <ForgotPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <RedirectAuthenticatedUser>
              <ResetPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />

        {/* These are part of the signup flow, so they should be accessible before being fully authenticated */}
        <Route path="/otp-verification" element={<EmailVerificationPage />} />
        <Route path="/subject-selection" element={<SubjectSelection />} />
        <Route path="/domain-selection" element={<DomainSelection />} />
        <Route path="/mentor-test" element={<MentorTest />} />
        <Route path="/profile-completion" element={<ProfileCompletion />} />
        <Route path="/session/:roomId" element={<VideoCallPage />} />
        {/* --- Protected Routes (for logged-in users with specific roles) --- */}
        <Route
          path="/student-dashboard"
          element={
            <RoleProtectedRoute roles={["student"]}>
              <StudentDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/mentor-dashboard"
          element={
            <RoleProtectedRoute roles={["mentor"]}>
              <MentorDashboard />
            </RoleProtectedRoute>
          }
        />

        {/* --- Catch-all Route --- */}
        {/* Redirects any unknown URL to the home page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default App;
