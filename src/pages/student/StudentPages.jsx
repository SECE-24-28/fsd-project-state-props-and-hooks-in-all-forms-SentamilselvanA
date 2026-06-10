import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMessageSquare, FiBell, FiCheckCircle, FiRefreshCw } from 'react-icons/fi';
import { getMyEnquiries, getNotifications, markNotificationRead } from '../../services/apiServices';

export function StudentEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEnquiries = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const { data } = await getMyEnquiries();
      setEnquiries(data.enquiries || []);
    } catch {}
    if (!silent) setLoading(false);
    else setRefreshing(false);
  };

  useEffect(() => {
    fetchEnquiries();
    // poll every 30 s so replies appear automatically
    const timer = setInterval(() => fetchEnquiries(true), 30000);
    return () => clearInterval(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const statusColors = {
    New: 'bg-blue-100 text-blue-700',
    Read: 'bg-gray-100 text-gray-700',
    Replied: 'bg-green-100 text-green-700',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">My Enquiries</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchEnquiries(true)}
            disabled={refreshing}
            className="btn-secondary text-sm flex items-center gap-1.5"
          >
            <FiRefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
          <Link to="/enquiry" className="btn-primary text-sm">New Enquiry</Link>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center"><div className="w-8 h-8 border-2 border-gray-200 border-t-primary-600 rounded-full animate-spin mx-auto" /></div>
        ) : enquiries.length === 0 ? (
          <div className="p-12 text-center">
            <FiMessageSquare size={40} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">No Enquiries Yet</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">Have questions? Submit an enquiry!</p>
            <Link to="/enquiry" className="btn-primary text-sm">Submit Enquiry</Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {enquiries.map((enq) => (
              <div key={enq._id} className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{enq.courseInterested}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{new Date(enq.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[enq.status]}`}>{enq.status}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">{enq.message}</p>
                {enq.reply && (
                  <div className="mt-3 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-3">
                    <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 mb-1">Admin Reply:</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{enq.reply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function StudentNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications().then(({ data }) => setNotifications(data.notifications)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleMarkRead = async (id) => {
    await markNotificationRead(id).catch(() => {});
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
  };

  const typeColors = { Announcement: 'bg-purple-50 text-purple-600', Event: 'bg-blue-50 text-blue-600', General: 'bg-gray-100 text-gray-600' };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Notifications</h1>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center"><div className="w-8 h-8 border-2 border-gray-200 border-t-primary-600 rounded-full animate-spin mx-auto" /></div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center">
            <FiBell size={40} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-500 dark:text-gray-400">No notifications yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.map((notif) => (
              <div key={notif._id} className={`p-5 flex gap-4 ${!notif.isRead ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`}>
                <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${typeColors[notif.type] || 'bg-gray-100 text-gray-600'}`}>
                  <FiBell size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`font-semibold text-gray-900 dark:text-white ${!notif.isRead ? 'text-primary-700 dark:text-primary-400' : ''}`}>{notif.title}</h3>
                    <span className="text-xs text-gray-400 flex-shrink-0">{new Date(notif.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notif.message}</p>
                  {!notif.isRead && (
                    <button onClick={() => handleMarkRead(notif._id)} className="flex items-center gap-1 text-xs text-primary-600 hover:underline mt-2">
                      <FiCheckCircle size={12} /> Mark as read
                    </button>
                  )}
                </div>
                {!notif.isRead && <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-2" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
