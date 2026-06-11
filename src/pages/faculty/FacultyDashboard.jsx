import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiBook, FiUsers, FiBell, FiClock } from 'react-icons/fi';
import { getClasses, getNotifications } from '../../services/apiServices';
import { dummyClasses, dummyFaculty } from '../../data/dummyData';

export default function FacultyDashboard() {
  const { user } = useSelector((s) => s.auth);
  const [myClasses, setMyClasses] = useState([]);
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getClasses({ limit: 50 }), getNotifications()])
      .then(([classRes, notifRes]) => {
        const apiClasses = classRes.data.classes || [];
        const apiIds = new Set(apiClasses.map(c => c._id));
        const allClasses = [...dummyClasses.filter(c => !apiIds.has(c._id)), ...apiClasses];
        const assigned = allClasses.filter(c => {
          const name = c.instructor?.name || c.instructor || '';
          return name.toLowerCase() === user?.name?.toLowerCase();
        });
        setMyClasses(assigned);
        setUnreadNotifs(notifRes.data.notifications?.filter(n => !n.isRead).length || 0);
      })
      .catch(() => {
        const dummyMember = dummyFaculty.find(f => f.name.toLowerCase() === user?.name?.toLowerCase());
        if (dummyMember) {
          setMyClasses(dummyClasses.filter(c => c.instructor?.name === dummyMember.name));
        }
      })
      .finally(() => setLoading(false));
  }, [user]);

  const totalStudents = myClasses.length * 12; // estimated avg per class

  const cards = [
    { icon: FiBook, label: 'My Classes', value: myClasses.length, to: '/faculty/classes', color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600' },
    { icon: FiUsers, label: 'Est. Students', value: totalStudents, to: '/faculty/students', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' },
    { icon: FiBell, label: 'Unread Notifs', value: unreadNotifs, to: '/faculty/notifications', color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-accent-600 to-primary-700 rounded-2xl p-8 text-white">
        <h1 className="text-2xl font-display font-bold mb-1">Welcome, {user?.name?.split(' ')[0]}! 🎭</h1>
        <p className="text-white/80">Here's an overview of your classes and activity.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {cards.map(({ icon: Icon, label, value, to, color }) => (
          <Link key={label} to={to} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
              <Icon size={20} />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {loading ? <div className="h-7 w-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /> : value}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{label}</div>
          </Link>
        ))}
      </div>

      {/* Assigned Classes */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white">My Assigned Classes</h2>
          <Link to="/faculty/classes" className="text-primary-600 text-sm hover:underline">View all</Link>
        </div>
        {loading ? (
          <div className="p-6 space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-14 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />)}</div>
        ) : myClasses.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <FiBook size={32} className="mx-auto mb-3 opacity-30" />
            <p>No classes assigned yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {myClasses.slice(0, 5).map((cls) => (
              <div key={cls._id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                    <FiBook size={16} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{cls.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{cls.category} · {cls.ageGroup}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="bg-primary-50 dark:bg-primary-900/20 text-primary-600 text-xs px-2 py-1 rounded-full">{cls.duration}</span>
                  {cls.schedule?.[0] && (
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1 justify-end">
                      <FiClock size={10} /> {cls.schedule[0].day} {cls.schedule[0].startTime}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
