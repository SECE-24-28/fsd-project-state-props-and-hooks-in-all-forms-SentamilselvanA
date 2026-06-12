import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FiBook, FiUsers, FiClock, FiDollarSign, FiBell, FiUser, FiMail, FiPhone, FiPlus, FiX, FiSend } from 'react-icons/fi';
import { getClasses, getNotifications, markNotificationRead, updateProfile, createNotification } from '../../services/apiServices';
import { dummyClasses, dummyFaculty } from '../../data/dummyData';
import { useForm } from 'react-hook-form';

function useMyClasses(userName) {
  const [myClasses, setMyClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userName) return;
    getClasses({ limit: 50 })
      .then(({ data }) => {
        const apiClasses = data.classes || [];
        const apiIds = new Set(apiClasses.map(c => c._id));
        const allClasses = [...dummyClasses.filter(c => !apiIds.has(c._id)), ...apiClasses];
        setMyClasses(allClasses.filter(c => {
          const name = c.instructor?.name || c.instructor || '';
          return name.toLowerCase() === userName.toLowerCase();
        }));
      })
      .catch(() => {
        const member = dummyFaculty.find(f => f.name.toLowerCase() === userName.toLowerCase());
        setMyClasses(member ? dummyClasses.filter(c => c.instructor?.name === member.name) : []);
      })
      .finally(() => setLoading(false));
  }, [userName]);

  return { myClasses, loading };
}

// ─── MY CLASSES ──────────────────────────────────────────────────────────────

export function FacultyClasses() {
  const { user } = useSelector((s) => s.auth);
  const { myClasses, loading } = useMyClasses(user?.name);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">My Classes</h1>
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-56 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />)}
        </div>
      ) : myClasses.length === 0 ? (
        <div className="text-center py-20 text-gray-500 dark:text-gray-400">
          <FiBook size={40} className="mx-auto mb-4 opacity-30" />
          <p>No classes assigned to you yet.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myClasses.map((cls) => (
            <div key={cls._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-40 bg-gray-100 dark:bg-gray-700">
                <img src={cls.image || 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=400&h=200&fit=crop'}
                  alt={cls.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">{cls.category}</span>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">{cls.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{cls.description}</p>
                <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400 pt-1">
                  <span className="flex items-center gap-1"><FiUsers size={13} className="text-primary-500" />{cls.ageGroup}</span>
                  <span className="flex items-center gap-1"><FiClock size={13} className="text-primary-500" />{cls.duration}</span>
                  <span className="flex items-center gap-1"><FiDollarSign size={13} className="text-primary-500" />₹{cls.fees}/mo</span>
                </div>
                {cls.schedule?.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {cls.schedule.map((s, i) => (
                      <span key={i} className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-0.5 rounded">
                        {s.day} {s.startTime}–{s.endTime}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MY STUDENTS ─────────────────────────────────────────────────────────────

export function FacultyStudents() {
  const { user } = useSelector((s) => s.auth);
  const { myClasses, loading } = useMyClasses(user?.name);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">My Students</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">Students enrolled in your classes.</p>
      {loading ? (
        <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />)}</div>
      ) : myClasses.length === 0 ? (
        <div className="text-center py-20 text-gray-500 dark:text-gray-400">
          <FiUsers size={40} className="mx-auto mb-4 opacity-30" />
          <p>No classes assigned yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {myClasses.map((cls) => (
            <div key={cls._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <FiBook size={16} className="text-primary-600" />
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{cls.title}</h3>
                <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">{cls.category}</span>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/40 rounded-lg">
                      <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                        <FiUser size={12} className="text-primary-600" />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400 truncate">Student {i + 1}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-3">* Student roster will appear once students enroll via applications.</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── NOTIFICATIONS ───────────────────────────────────────────────────────────

export function FacultyNotifications() {
  const { user } = useSelector((s) => s.auth);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { myClasses } = useMyClasses(user?.name);
  const { register, handleSubmit, reset, watch, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    getNotifications()
      .then(({ data }) => setNotifications(data.notifications || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const targetRole = watch('targetRole', 'student');

  const onSubmit = async (data) => {
    try {
      const payload = { ...data, targetRole: 'student' };
      await createNotification(payload);
      setShowForm(false);
      reset();
    } catch {}
  };

  const handleRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch {}
  };

  const typeColors = {
    Announcement: 'bg-purple-100 text-purple-700',
    Event: 'bg-blue-100 text-blue-700',
    General: 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Notifications</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 text-sm">
          <FiPlus size={16} /> Send to Students
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />)}</div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <FiBell size={32} className="mx-auto mb-3 opacity-30" />
            <p>No notifications yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.map((n) => (
              <div key={n._id} className={`p-4 flex items-start gap-3 ${!n.isRead ? 'bg-primary-50/40 dark:bg-primary-900/10' : ''}`}>
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${n.isRead ? 'bg-gray-300' : 'bg-primary-500'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{n.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${typeColors[n.type] || typeColors.General}`}>{n.type}</span>
                    {n.targetClass && <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 px-2 py-0.5 rounded-full">📚 {n.targetClass}</span>}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                </div>
                {!n.isRead && (
                  <button onClick={() => handleRead(n._id)} className="text-xs text-primary-600 hover:underline flex-shrink-0">Mark read</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Send Notification Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between mb-5">
              <h2 className="font-bold text-lg text-gray-900 dark:text-white">Send Notification to Students</h2>
              <button onClick={() => { setShowForm(false); reset(); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><FiX size={18} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Title *</label>
                <input {...register('title', { required: true })} className="input-field" placeholder="Notification title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message *</label>
                <textarea {...register('message', { required: true })} rows={3} className="input-field resize-none" placeholder="Your message to students..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Type</label>
                  <select {...register('type')} className="input-field">
                    <option value="General">General</option>
                    <option value="Announcement">Announcement</option>
                    <option value="Event">Event</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Target Class *</label>
                  <select {...register('targetClass', { required: true })} className="input-field">
                    <option value="">Select a class</option>
                    {myClasses.map(c => <option key={c._id} value={c.category}>{c.title} ({c.category})</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); reset(); }} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {isSubmitting ? 'Sending...' : <><FiSend size={14} /> Send</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PROFILE ─────────────────────────────────────────────────────────────────

export function FacultyProfile() {
  const { user } = useSelector((s) => s.auth);
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: { name: user?.name || '', email: user?.email || '', mobile: user?.mobile || '' },
  });

  const dummyInfo = dummyFaculty.find(f => f.name.toLowerCase() === user?.name?.toLowerCase());

  const onSubmit = async (data) => {
    try {
      await updateProfile(data);
    } catch {}
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">My Profile</h1>

      {/* Info Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 flex items-center gap-5">
        <img
          src={dummyInfo?.image || `https://i.pravatar.cc/150?u=${user?.email}`}
          alt={user?.name}
          className="w-20 h-20 rounded-full object-cover border-4 border-primary-100 dark:border-primary-900/30"
        />
        <div>
          <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">{user?.name}</h2>
          <p className="text-primary-600 text-sm font-medium">Faculty Member</p>
          {dummyInfo && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {dummyInfo.specialization.map(s => (
                <span key={s} className="bg-primary-50 dark:bg-primary-900/20 text-primary-600 text-xs px-2 py-0.5 rounded-full">{s}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contact Info */}
      {dummyInfo && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 space-y-3">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Contact Information</h3>
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <FiMail size={15} className="text-primary-500" />{dummyInfo.email}
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <FiPhone size={15} className="text-primary-500" />{dummyInfo.mobile}
          </div>
          {dummyInfo.bio && <p className="text-sm text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">{dummyInfo.bio}</p>}
        </div>
      )}

      {/* Edit Form */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Update Account Details</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
            <input {...register('name')} className="input-field" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <input {...register('email')} className="input-field" type="email" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Mobile</label>
              <input {...register('mobile')} className="input-field" />
            </div>
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-2.5">
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
