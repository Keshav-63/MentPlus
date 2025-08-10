import { create } from "zustand";
import axios from "axios";

// Define API URLs
const API_URL =
  import.meta.env.MODE === "development"
    ? "https://mentplus-backend.onrender.com/api/auth"
    : "https://mentplus-backend.onrender.com/api/auth";
const TEST_API_URL =
  import.meta.env.MODE === "development"
    ? "https://mentplus-backend.onrender.com/api/test"
    : "https://mentplus-backend.onrender.com/api/test";

// Set axios to send cookies with every request
axios.defaults.withCredentials = true;

// CORRECTED: Added 'get' as the second parameter to the create function
export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,

  // --- SIGNUP & TEST FLOW ACTIONS ---

  signup: async (email, password, name, role) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
        role,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error signing up";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  saveMentorDomain: async (domain) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.patch(`${API_URL}/save-domain`, { domain });
      set({ user: response.data.user, isLoading: false });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error saving domain";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  getTestQuestions: async (domain) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${TEST_API_URL}/questions/${domain}`);
      set({ isLoading: false });
      return response.data.questions;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error fetching questions";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  submitTest: async (answers) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${TEST_API_URL}/submit`, { answers });
      set((state) => ({
        user: {
          ...state.user,
          testScore: response.data.score,
          testPassed: response.data.passed,
        },
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error submitting test";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  // --- STANDARD AUTH ACTIONS ---

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      set({ user: response.data.user, isLoading: false });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error verifying email";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error logging in";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = "Error logging out";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  checkAuth: async () => {
    // CORRECTED: The problematic guard clause `if (get().isCheckingAuth) return;` has been removed.
    // This ensures the check always runs on app load and sets isCheckingAuth to false.
    set({ isCheckingAuth: true });
    try {
      console.log(`Auth check response: ${API_URL}`);
      const response = await axios.get(`${API_URL}/check-auth`, {
        withCredentials: true, // THIS IS IMPORTANT FOR COOKIE TO BE SENT CROSS-ORIGIN
      });

      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isCheckingAuth: false });
    }
  },

  completeMentorProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    try {
      // The new backend endpoint is /api/profile/complete
      const response = await axios.post(
        "https://mentplus-backend.onrender.com/api/profile/complete",
        profileData
      );
      // Update the main user object in the store with the response from the server
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error completing profile";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error sending reset password email";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        password,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error resetting password";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },
  createGroupSession: async (sessionData) => {
    set({ isLoading: true, error: null });
    try {
      // The new backend endpoint is /api/sessions/create-group
      const response = await axios.post(
        "https://mentplus-backend.onrender.com/api/sessions/create-group",
        sessionData
      );
      set({ isLoading: false });
      return response.data; // Returns { success, message, session }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error creating session";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },
  // --- NEW ACTION FOR FETCHING SESSIONS ---
  getMySessions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        "https://mentplus-backend.onrender.com/api/sessions/my-sessions"
      );
      set({ isLoading: false });
      return response.data.sessions; // Returns the array of sessions
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error fetching sessions";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },
  submitContactForm: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        "https://mentplus-backend.onrender.com/api/contact/submit",
        formData
      );
      set({ isLoading: false });
      return response.data; // Returns { success, message }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error submitting message";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },
  getExploreData: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        "https://mentplus-backend.onrender.com/api/explore"
      );
      set({ isLoading: false });
      return response.data; // Returns { success, mentors, sessions }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error fetching explore data";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },
  // --- NEW ACTIONS FOR BOOKING & PAYMENT ---
  createBookingOrder: async (mentorId, requestedDateTime) => {
    // <<< Add parameter
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        "https://mentplus-backend.onrender.com/api/payments/create-order",
        { mentorId, requestedDateTime }
      ); // <<< Send in body
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      const msg =
        error.response?.data?.message || "Error creating booking order";
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  verifyBookingPayment: async (paymentData) => {
    set({ isLoading: true, error: null });
    try {
      console.log("Verifying payment with data:", paymentData);
      const response = await axios.post(
        "https://mentplus-backend.onrender.com/api/payments/verify-payment",
        paymentData
      );
      set({ isLoading: false });
      return response.data; // Returns { success, message }
    } catch (error) {
      const msg =
        error.response?.data?.message || "Payment verification failed";
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },
  // --- NEW ACTION FOR SAVING STUDENT SUBJECTS ---
  saveStudentSubjects: async (subjects) => {
    set({ isLoading: true, error: null });
    try {
      // The new backend endpoint is /api/student/save-subjects
      const response = await axios.post(
        "https://mentplus-backend.onrender.com/api/student/save-subjects",
        { subjects }
      );
      // Update the main user object in the store with the response from the server
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error saving subjects";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },
  // --- NEW ACTION FOR STUDENT DASHBOARD DATA ---
  getStudentDashboardData: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        "https://mentplus-backend.onrender.com/api/student/dashboard"
      );
      set({ isLoading: false });
      return response.data; // Returns { success, mentors, myBookings, myGroupSessions, myTransactions }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error fetching dashboard data";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },
  // --- NEW ACTIONS FOR MENTOR DASHBOARD ---
  getMentorDashboardData: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        "https://mentplus-backend.onrender.com/api/mentor/dashboard"
      );
      set({ isLoading: false });
      // Returns the full payload: { success, bookingRequests, notifications, stats, transactions }
      return response.data;
    } catch (error) {
      const msg =
        error.response?.data?.message || "Error fetching dashboard data";
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  handleBookingRequest: async (bookingId, action) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.patch(
        `https://mentplus-backend.onrender.com/api/mentor/bookings/${bookingId}`,
        { action }
      );
      set({ isLoading: false });
      return response.data; // Returns { success, message }
    } catch (error) {
      const msg = error.response?.data?.message || `Error ${action}ing booking`;
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  // --- CORRECTED: Fetches the secure ZIM token from the backend ---
  generateZimToken: async (userID) => {
    try {
      // Example with query param:
      // const response = await axios.get(`https://mentplus-backend.onrender.com/api/chat/token?userID=${userID}`);
      // Or with headers:
      const response = await axios.get(
        "https://mentplus-backend.onrender.com/api/chat/token",
        {
          headers: { userID: userID },
        }
      );
      return response.data.token;
    } catch (error) {
      console.error("Error fetching ZIM token:", error);
      throw new Error("Could not get chat authentication token.");
    }
  },

  getChatConnections: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        "https://mentplus-backend.onrender.com/api/chat/connections"
      );
      set({ isLoading: false });
      console.log("Chat connections fetched:", response.data.connections);
      return response.data.connections;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error fetching chat connections";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  // --- NEW ACTIONS FOR GROUP SESSION BOOKING ---
  createGroupSessionOrder: async (sessionId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        "https://mentplus-backend.onrender.com/api/payments/create-group-order",
        { sessionId }
      );
      set({ isLoading: false });
      return response.data; // Returns { success, order, bookingId }
    } catch (error) {
      const msg =
        error.response?.data?.message || "Error creating group session order";
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  verifyGroupSessionPayment: async (paymentData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        "https://mentplus-backend.onrender.com/api/payments/verify-group-payment",
        paymentData
      );
      set({ isLoading: false });
      return response.data; // Returns { success, message }
    } catch (error) {
      const msg =
        error.response?.data?.message || "Group payment verification failed";
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  // --- NEW ACTION TO FETCH AVAILABLE SESSIONS ---
  getAvailableGroupSessions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        "https://mentplus-backend.onrender.com/api/sessions/available-group"
      );
      set({ isLoading: false });
      return response.data.sessions;
    } catch (error) {
      const msg =
        error.response?.data?.message || "Error fetching available sessions";
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },
}));
