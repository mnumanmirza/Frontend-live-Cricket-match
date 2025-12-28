// Frontend/common/api.js
import axios from 'axios';

axios.defaults.withCredentials = true;  // ✅ globally set once

// Use local backend when developing in VS Code (localhost/127.0.0.1).
// Change `localBackend` if your backend runs on a different port or IP.
const defaultBackend = "backend-live-cricket-match-production.up.railway.app";
const localBackend = "http://127.0.0.1:8080";

const isLocalRun = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
);

const backendDomin = isLocalRun ? localBackend : defaultBackend;

const SummaryApi = {
  signUP: {
    url: `${backendDomin}/api/signup`,
    method: "post"
  },

  signIn: {
    url: `${backendDomin}/api/signin`,
    method: "post"
  },

  current_user: {
    url: `${backendDomin}/api/user-details`,
    method: "get"
  },

  logout_user: {
    url: `${backendDomin}/api/userLogout`,
    method: 'get'
  },

  allUser: {
    url: `${backendDomin}/api/all-user`,
    method: 'get'
  },

  updateUser: {
    url: `${backendDomin}/api/update-user`,
    method: "post"
  },

  deleteUser: {
    url: `${backendDomin}/api/delete-user`,
    method: "post"
  },

  // ✅ Forgot Password APIs
  sendOTP: {
    url: `${backendDomin}/api/send-otp`,
    method: "post"
  },
  verifyOTP: {
    url: `${backendDomin}/api/verify-otp`,
    method: "post"
  },
  sendPasswordResetOTP: {
    url: `${backendDomin}/api/send-password-reset-otp`,
    method: "POST"
  },
  verifyPasswordResetOTP: {
    url: `${backendDomin}/api/verify-password-reset-otp`,
    method: "POST"
  },
  resetPassword: {
    url: `${backendDomin}/api/reset-password`,
    method: "POST"
  },

  // ✅ Testimonials APIs
  add_testimonial: {
    url: `${backendDomin}/api/addtestimonial`,
    method: "post"
  },

  get_testimonials: {
    url: `${backendDomin}/api/testimonials`,
    method: "get"
  },
  update_testimonial: {
    url: `${backendDomin}/api/update-testimonial`,
    method: "put"
  },
  delete_testimonial: {
    url: `${backendDomin}/api/delete-testimonial`,
    method: "delete"
  },

  // ✅ Projects APIs (newly added)
  get_projects: {
    url: `${backendDomin}/api/projects`,
    method: "get"
  },
  add_project: {
    url: `${backendDomin}/api/projects`,
    method: "post"
  },
  update_project: {
    url: `${backendDomin}/api/projects`,
    method: "put"
  },
  delete_project: {
    url: `${backendDomin}/api/projects`, // This will be /api/projects/:id
    method: "delete"
  }
};

// Helper function to format the delete project URL
export const getDeleteProjectUrl = (id) => `${backendDomin}/api/projects/${id}`;

export default SummaryApi;
