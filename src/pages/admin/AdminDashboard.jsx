import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiBook, FiFileText, FiMessageSquare, FiUserCheck, FiAlertCircle } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getDashboardStats, getAllApplications } from '../../services/apiServices';

const COLORS = ['#10b981', '#f97316', '#ef4444', '#06b6d4'];
const STATUS_ORDER = ['Approved', 'Pending', 'Rejected', 'Under Review'];

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
  'Under Review': 'bg-blue-100 text-blue-700',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0, totalClasses: 0, totalApplications: 0,
    totalEnquiries: 0, totalFaculty: 0, pendingApplications: 0,
  });
  const [studentsByClass, setStudentsByClass] = useState([]);
  const [applicationStatus, setApplicationStatus] = useState([]);
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboardStats(), getAllApplications({ limit: 5 })])
      .then(([dash, apps]) => {
        if (dash.data.success) {
          setStats(dash.data.stats);
          setStudentsByClass(dash.data.studentsByClass || []);
          // Sort pie data in consistent order
          const sorted = STATUS_ORDER
            .map(name => dash.data.applicationStatus?.find(s => s.name === name))
            .filter(Boolean);
          setApplicationStatus(sorted);
        }
        setRecentApps(apps.data.applications || []);
      })
      .catch(() => {
        setStats({ totalStudents: 0, totalClasses: 0, totalApplications: 0, totalEnquiries: 0, totalFaculty: 0, pendingApplications: 0 });
        setStudentsByClass([]);
        setApplicationStatus([]);
        setRecentApps([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Total Students',  value: stats.totalStudents,      icon: FiUsers,       color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',     to: '/admin/students' },
    { label: 'Active Classes',  value: stats.totalClasses,       icon: FiBook,        color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20', to: '/admin/classes' },
    { label: 'Applications',    value: stats.totalApplications,  icon: FiFileText,    color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20', to: '/admin/applications' },
    { label: 'Enquiries',       value: stats.totalEnquiries,     icon: FiMessageSquare, color: 'text-teal-600 bg-teal-50 dark:bg-teal-900/20',    to: '/admin/enquiries' },
    { label: 'Faculty',         value: stats.totalFaculty,       icon: FiUserCheck,   color: 'text-pink-600 bg-pink-50 dark:bg-pink-900/20',       to: '/admin/faculty' },
    { label: 'Pending Apps',    value: stats.pendingApplications, icon: FiAlertCircle, color: 'text-red-600 bg-red-50 dark:bg-red-900/20',         to: '/admin/applications' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        {statCards.map(({ label, value, icon: Icon, color, to }) => (
          <Link key={label} to={to} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
              <Icon size={20} />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {loading
                ? <div className="h-7 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                : value}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</div>
          </Link>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Bar Chart — Students by Class */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
          <h2 className="font-display font-bold text-gray-900 dark:text-white mb-5">Students by Class</h2>
          {loading ? (
            <div className="h-60 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse" />
          ) : studentsByClass.length === 0 ? (
            <div className="h-60 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
              No class enrollment data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={studentsByClass} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="students" fill="#d946ef" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie Chart — Application Status */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
          <h2 className="font-display font-bold text-gray-900 dark:text-white mb-5">Application Status</h2>
          {loading ? (
            <div className="h-44 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse" />
          ) : applicationStatus.length === 0 ? (
            <div className="h-44 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
              No application data available
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={applicationStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {applicationStatus.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, name]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-3">
                {applicationStatus.map(({ name, value }, i) => (
                  <div key={name} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i] }} />
                    {name}: {value}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-display font-bold text-gray-900 dark:text-white">Recent Applications</h2>
          <Link to="/admin/applications" className="text-primary-600 text-sm hover:underline">View all</Link>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : recentApps.length === 0 ? (
            <p className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm">No applications yet.</p>
          ) : recentApps.map((app) => (
            <div key={app._id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">{app.fullName}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  {app.selectedCourse} · {new Date(app.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[app.status]}`}>
                {app.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
