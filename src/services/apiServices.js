import API from './api';

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const logout = () => API.post('/auth/logout');
export const getMe = () => API.get('/auth/me');
export const forgotPassword = (email) => API.post('/auth/forgot-password', { email });
export const resetPassword = (token, password) => API.put(`/auth/reset-password/${token}`, { password });
export const updatePassword = (data) => API.put('/auth/update-password', data);
export const verifyEmail = (token) => API.get(`/auth/verify-email/${token}`);

// Users
export const getAllUsers = (params) => API.get('/users', { params });
export const updateProfile = (data) => API.put('/users/profile/update', data);
export const uploadProfileImage = (formData) => API.post('/users/profile/image', formData);
export const updateUser = (id, data) => API.put(`/users/${id}`, data);
export const deleteUser = (id) => API.delete(`/users/${id}`);

// Classes
export const getClasses = (params) => API.get('/classes', { params });
export const getClass = (id) => API.get(`/classes/${id}`);
export const createClass = (formData) => API.post('/classes', formData);
export const updateClass = (id, formData) => API.put(`/classes/${id}`, formData);
export const deleteClass = (id) => API.delete(`/classes/${id}`);

// Faculty
export const getFaculty = (params) => API.get('/faculty', { params });
export const getFacultyMember = (id) => API.get(`/faculty/${id}`);
export const createFaculty = (formData) => API.post('/faculty', formData);
export const updateFaculty = (id, formData) => API.put(`/faculty/${id}`, formData);
export const deleteFaculty = (id) => API.delete(`/faculty/${id}`);

// Applications
export const submitApplication = (formData) => API.post('/applications', formData);
export const getMyApplications = () => API.get('/applications/my');
export const getAllApplications = (params) => API.get('/applications', { params });
export const getApplication = (id) => API.get(`/applications/${id}`);
export const updateApplicationStatus = (id, data) => API.put(`/applications/${id}/status`, data);
export const deleteApplication = (id) => API.delete(`/applications/${id}`);

// Enquiries
export const submitEnquiry = (data) => API.post('/enquiries', data);
export const getMyEnquiries = () => API.get('/enquiries/my');
export const getAllEnquiries = (params) => API.get('/enquiries', { params });
export const replyEnquiry = (id, reply) => API.put(`/enquiries/${id}/reply`, { reply });
export const deleteEnquiry = (id) => API.delete(`/enquiries/${id}`);

// Contacts
export const submitContact = (data) => API.post('/contacts', data);
export const getAllContacts = (params) => API.get('/contacts', { params });
export const updateContact = (id, data) => API.put(`/contacts/${id}`, data);
export const deleteContact = (id) => API.delete(`/contacts/${id}`);

// Notifications
export const getNotifications = () => API.get('/notifications');
export const getAllNotificationsAdmin = () => API.get('/notifications/admin/all');
export const createNotification = (data) => API.post('/notifications', data);
export const markNotificationRead = (id) => API.put(`/notifications/${id}/read`);
export const deleteNotification = (id) => API.delete(`/notifications/${id}`);

// Settings
export const getSettings = () => API.get('/settings');
export const updateSettings = (data) => API.put('/settings', data);

// FAQs
export const getFAQs = () => API.get('/faqs');
export const createFAQ = (data) => API.post('/faqs', data);
export const updateFAQ = (id, data) => API.put(`/faqs/${id}`, data);
export const deleteFAQ = (id) => API.delete(`/faqs/${id}`);

// Stats
export const getDashboardStats = () => API.get('/faqs/stats');
