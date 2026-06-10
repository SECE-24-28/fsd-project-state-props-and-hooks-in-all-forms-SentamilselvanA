import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiFileText, FiMessageSquare, FiBell, FiUser, FiClock } from 'react-icons/fi';
import { getMyApplications, getMyEnquiries, getNotifications } from '../../services/apiServices';

export default function StudentDashboard() {
  const { user } = useSelector((s) => s.auth);
  const [stats, setStats] = useState({ applications: 0, enquiries: 0, notifications: 0 });
  const [recentApps, setRecentApps] = useState([]);

  useEffect(() => {
    Promise.all([getMyApplications(), getMyEnquiries(), getNotifications()]).then(([apps, enqs, notifs]) => {
      const appList = apps.data.applications || [];
      setStats({
        applications: appList.length,
        enquiries: enqs.data.enquiries?.length || 0,
        notifications: notifs.data.notifications?.filter(n => !n.isRead).length || 0,
      });
      setRecentApps(appList.slice(0, 3));
    }).catch(() => {
      setStats({ applications: 0, enquiries: 0, notifications: 0 });
      setRecentApps([]);
    });
  }, []);

  const profileCompletion = Math.round([user?.name, user?.email, user?.mobile].filter(Boolean).length * (100 / 3));

  const cards = [
    { icon: FiFileText, label: 'Applications', value: stats.applications, to: '/student/applications', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' },
    { icon: FiMessageSquare, label: 'Enquiries', value: stats.enquiries, to: '/student/enquiries', color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600' },
    { icon: FiBell, label: 'Unread Notifs', value: stats.notifications, to: '/student/notifications', color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600' },
    { icon: FiUser, label: 'Profile %', value: `${profileCompletion}%`, to: '/student/profile', color: 'bg-green-50 dark:bg-green-900/20 text-green-600' },
  ];

  const statusColors = { Pending: 'bg-yellow-100 text-yellow-700', Approved: 'bg-green-100 text-green-700', Rejected: 'bg-red-100 text-red-700', 'Under Review': 'bg-blue-100 text-blue-700' };

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white">
        <h1 className="text-2xl font-display font-bold mb-1">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="text-primary-100">Manage your dance journey from here.</p>
        {profileCompletion < 100 && (
          <div className="mt-4 bg-white/10 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Profile Completion</span>
              <span className="text-sm font-semibold">{profileCompletion}%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all" style={{ width: `${profileCompletion}%` }} />
            </div>
            <Link to="/student/profile" className="text-xs text-white/80 hover:text-white mt-2 block">Complete your profile →</Link>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map(({ icon: Icon, label, value, to, color }) => (
          <Link key={label} to={to} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
              <Icon size={20} />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{label}</div>
          </Link>
        ))}
      </div>

      {/* Recent Applications */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white">Recent Applications</h2>
          <Link to="/student/applications" className="text-primary-600 text-sm hover:underline">View all</Link>
        </div>
        {recentApps.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <FiFileText size={32} className="mx-auto mb-3 opacity-30" />
            <p>No applications submitted yet.</p>
            <Link to="/apply" className="btn-primary text-sm mt-4 inline-block">Apply Now</Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentApps.map((app) => (
              <div key={app._id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                    <FiFileText size={16} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{app.selectedCourse}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs flex items-center gap-1">
                      <FiClock size={10} /> {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[app.status] || 'bg-gray-100 text-gray-700'}`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
