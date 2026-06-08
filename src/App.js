import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { store } from './store/store';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute, PublicOnlyRoute } from './routes/ProtectedRoute';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import StudentLayout from './layouts/StudentLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import ClassesPage from './pages/public/ClassesPage';
import FacultyPage from './pages/public/FacultyPage';
import ContactPage from './pages/public/ContactPage';
import ApplyPage from './pages/public/ApplyPage';
import { FAQPage, PrivacyPolicyPage, TermsPage, EnquiryPage } from './pages/public/StaticPages';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import { ForgotPasswordPage, ResetPasswordPage } from './pages/auth/PasswordPages';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import StudentApplications from './pages/student/StudentApplications';
import { StudentEnquiries, StudentNotifications } from './pages/student/StudentPages';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from './pages/admin/AdminStudents';
import AdminClasses from './pages/admin/AdminClasses';
import AdminFaculty from './pages/admin/AdminFaculty';
import AdminApplications from './pages/admin/AdminApplications';
import { AdminEnquiries, AdminContacts, AdminNotifications, AdminFAQs, AdminSettings } from './pages/admin/AdminPages';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover theme="colored" />
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/classes" element={<ClassesPage />} />
              <Route path="/faculty" element={<FacultyPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/apply" element={<ApplyPage />} />
              <Route path="/enquiry" element={<EnquiryPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
            </Route>

            {/* Auth Routes (redirect if logged in) */}
            <Route element={<PublicOnlyRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

            {/* Student Routes */}
            <Route element={<ProtectedRoute role="student" />}>
              <Route element={<StudentLayout />}>
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/profile" element={<StudentProfile />} />
                <Route path="/student/applications" element={<StudentApplications />} />
                <Route path="/student/enquiries" element={<StudentEnquiries />} />
                <Route path="/student/notifications" element={<StudentNotifications />} />
              </Route>
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute role="admin" />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/students" element={<AdminStudents />} />
                <Route path="/admin/classes" element={<AdminClasses />} />
                <Route path="/admin/faculty" element={<AdminFaculty />} />
                <Route path="/admin/applications" element={<AdminApplications />} />
                <Route path="/admin/enquiries" element={<AdminEnquiries />} />
                <Route path="/admin/contacts" element={<AdminContacts />} />
                <Route path="/admin/notifications" element={<AdminNotifications />} />
                <Route path="/admin/faqs" element={<AdminFAQs />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
