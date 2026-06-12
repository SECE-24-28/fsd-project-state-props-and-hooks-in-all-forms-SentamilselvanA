import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiX, FiSend, FiTrash2, FiPlus, FiEdit2, FiMessageSquare } from 'react-icons/fi';
import { getAllEnquiries, replyEnquiry, deleteEnquiry, getAllContacts, updateContact, deleteContact, getAllNotificationsAdmin, createNotification, deleteNotification, getFAQs, createFAQ, updateFAQ, deleteFAQ, getSettings, updateSettings, getClasses } from '../../services/apiServices';
import { dummyClasses, dummyFaculty } from '../../data/dummyData';

// ─── ENQUIRIES ──────────────────────────────────────────────────────────────

export function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchEnquiries(); }, []);

  const fetchEnquiries = async () => {
    setLoading(true);
    try { const { data } = await getAllEnquiries(); setEnquiries(data.enquiries); } catch {}
    setLoading(false);
  };

  const handleReply = async () => {
    if (!reply.trim()) return;
    setSubmitting(true);
    try {
      await replyEnquiry(selected._id, reply);
      setSelected(null);
      setReply('');
      fetchEnquiries();
    } catch {}
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    try { await deleteEnquiry(id); fetchEnquiries(); } catch {}
  };

  const statusColors = { New: 'bg-blue-100 text-blue-700', Read: 'bg-gray-100 text-gray-700', Replied: 'bg-green-100 text-green-700' };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Enquiries</h1>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        {loading ? <div className="p-8 text-center"><div className="w-8 h-8 border-2 border-gray-200 border-t-primary-600 rounded-full animate-spin mx-auto" /></div> : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {enquiries.length === 0 ? <p className="p-8 text-center text-gray-500 dark:text-gray-400">No enquiries found.</p> :
              enquiries.map((enq) => (
                <div key={enq._id} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{enq.name}</h3>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusColors[enq.status]}`}>{enq.status}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{enq.email} · {enq.mobile} · {enq.courseInterested}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{enq.message}</p>
                      {enq.reply && <div className="mt-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300"><span className="font-medium text-primary-600">Reply: </span>{enq.reply}</div>}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => { setSelected(enq); setReply(''); }} className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"><FiSend size={15} /></button>
                      <button onClick={() => handleDelete(enq._id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><FiTrash2 size={15} /></button>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg text-gray-900 dark:text-white">Reply to Enquiry</h2>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><FiX size={18} /></button>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-4 text-sm text-gray-700 dark:text-gray-300">
              <p className="font-medium mb-1">{selected.name} — {selected.courseInterested}</p>
              <p>{selected.message}</p>
            </div>
            <textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={4} className="input-field resize-none mb-4" placeholder="Type your reply..." />
            <div className="flex gap-3">
              <button onClick={() => setSelected(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleReply} disabled={submitting || !reply.trim()} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {submitting ? 'Sending...' : <><FiSend size={14} /> Send Reply</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CONTACTS ───────────────────────────────────────────────────────────────

export function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [response, setResponse] = useState('');

  useEffect(() => { getAllContacts().then(({ data }) => setContacts(data.contacts)).catch(() => {}).finally(() => setLoading(false)); }, []);

  const handleRespond = async () => {
    try {
      await updateContact(selected._id, { status: 'Responded', response });
      setSelected(null);
      getAllContacts().then(({ data }) => setContacts(data.contacts)).catch(() => {});
    } catch {}
  };

  const handleDelete = async (id) => {
    try { await deleteContact(id); setContacts(prev => prev.filter(c => c._id !== id)); } catch {}
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Contact Messages</h1>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        {loading ? <div className="p-8 text-center"><div className="w-8 h-8 border-2 border-gray-200 border-t-primary-600 rounded-full animate-spin mx-auto" /></div> : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {contacts.length === 0 ? <p className="p-8 text-center text-gray-500 dark:text-gray-400">No messages found.</p> :
              contacts.map((c) => (
                <div key={c._id} className="p-5 flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{c.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${c.status === 'New' ? 'bg-blue-100 text-blue-700' : c.status === 'Responded' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{c.status}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{c.email} · {c.subject}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{c.message}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setSelected(c); setResponse(c.response || ''); }} className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"><FiMessageSquare size={15} /></button>
                    <button onClick={() => handleDelete(c._id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><FiTrash2 size={15} /></button>
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between mb-4"><h2 className="font-bold text-lg text-gray-900 dark:text-white">Message Details</h2><button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><FiX size={18} /></button></div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-4 text-sm space-y-1">
              <p><strong>From:</strong> {selected.name} ({selected.email})</p>
              <p><strong>Subject:</strong> {selected.subject}</p>
              <p className="mt-2">{selected.message}</p>
            </div>
            <textarea value={response} onChange={(e) => setResponse(e.target.value)} rows={3} className="input-field resize-none mb-4" placeholder="Internal note or response..." />
            <div className="flex gap-3">
              <button onClick={() => setSelected(null)} className="btn-secondary flex-1">Close</button>
              <button onClick={handleRespond} className="btn-primary flex-1">Save Response</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── NOTIFICATIONS ──────────────────────────────────────────────────────────

export function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [classes, setClasses] = useState([]);
  const { register, handleSubmit, reset, watch, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    getAllNotificationsAdmin().then(({ data }) => setNotifications(data.notifications)).catch(() => {});
    getClasses({ limit: 50 }).then(({ data }) => {
      const apiClasses = data.classes || [];
      const apiIds = new Set(apiClasses.map(c => c._id));
      const merged = [...dummyClasses.filter(c => !apiIds.has(c._id)), ...apiClasses];
      setClasses(merged);
    }).catch(() => setClasses(dummyClasses));
  }, []);

  const targetRole = watch('targetRole', 'all');

  const onSubmit = async (data) => {
    try {
      const payload = { ...data };
      if (payload.targetRole !== 'student') delete payload.targetClass;
      const { data: res } = await createNotification(payload);
      setNotifications(prev => [res.notification, ...prev]);
      setShowForm(false);
      reset();
    } catch {}
  };

  const handleDelete = async (id) => {
    try { await deleteNotification(id); setNotifications(prev => prev.filter(n => n._id !== id)); }
    catch {}
  };

  const typeColors = { Announcement: 'bg-purple-100 text-purple-700', Event: 'bg-blue-100 text-blue-700', General: 'bg-gray-100 text-gray-700' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Notifications</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 text-sm"><FiPlus size={16} /> Create</button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {notifications.length === 0 ? <p className="p-8 text-center text-gray-500 dark:text-gray-400">No notifications yet.</p> :
            notifications.map((n) => (
              <div key={n._id} className="flex items-start justify-between gap-3 p-5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{n.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${typeColors[n.type]}`}>{n.type}</span>
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">→ {n.targetRole}</span>
                    {n.targetClass && <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-2 py-0.5 rounded-full">📚 {n.targetClass}</span>}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                </div>
                <button onClick={() => handleDelete(n._id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><FiTrash2 size={15} /></button>
              </div>
            ))
          }
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between mb-5"><h2 className="font-bold text-lg text-gray-900 dark:text-white">Create Notification</h2><button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><FiX size={18} /></button></div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Title *</label>
                <input {...register('title', { required: true })} className="input-field" placeholder="Notification title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message *</label>
                <textarea {...register('message', { required: true })} rows={3} className="input-field resize-none" placeholder="Notification message..." />
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Send To</label>
                  <select {...register('targetRole')} className="input-field">
                    <option value="all">All</option>
                    <option value="student">Students</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              {targetRole === 'student' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Target Class <span className="text-gray-400 font-normal">(optional — leave blank for all students)</span></label>
                  <select {...register('targetClass')} className="input-field">
                    <option value="">All Students</option>
                    {['Bharatanatyam', 'Classical Dance', 'Western Dance', 'Hip Hop', 'Contemporary', 'Folk Dance'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">{isSubmitting ? 'Creating...' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── FAQs ────────────────────────────────────────────────────────────────────

export function AdminFAQs() {
  const [faqs, setFaqs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const { register, handleSubmit, reset, setValue, formState: { isSubmitting } } = useForm();

  useEffect(() => { getFAQs().then(({ data }) => setFaqs(data.faqs)).catch(() => {}); }, []);

  const openForm = (item = null) => {
    setEditItem(item);
    if (item) { setValue('question', item.question); setValue('answer', item.answer); setValue('category', item.category); } else reset();
    setShowForm(true);
  };

  const onSubmit = async (data) => {
    try {
      if (editItem) { const { data: res } = await updateFAQ(editItem._id, data); setFaqs(prev => prev.map(f => f._id === editItem._id ? res.faq : f)); }
      else { const { data: res } = await createFAQ(data); setFaqs(prev => [...prev, res.faq]); }
      setShowForm(false); reset();
    } catch {}
  };

  const handleDelete = async (id) => {
    try { await deleteFAQ(id); setFaqs(prev => prev.filter(f => f._id !== id)); } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">FAQ Management</h1>
        <button onClick={() => openForm()} className="btn-primary flex items-center gap-2 text-sm"><FiPlus size={16} /> Add FAQ</button>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {faqs.length === 0 ? <p className="p-8 text-center text-gray-500 dark:text-gray-400">No FAQs yet.</p> :
            faqs.map((faq) => (
              <div key={faq._id} className="flex items-start justify-between gap-3 p-5">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{faq.question}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{faq.answer}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openForm(faq)} className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"><FiEdit2 size={15} /></button>
                  <button onClick={() => handleDelete(faq._id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><FiTrash2 size={15} /></button>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between mb-5"><h2 className="font-bold text-lg text-gray-900 dark:text-white">{editItem ? 'Edit FAQ' : 'Add FAQ'}</h2><button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><FiX size={18} /></button></div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Question *</label>
                <input {...register('question', { required: true })} className="input-field" placeholder="FAQ question" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Answer *</label>
                <textarea {...register('answer', { required: true })} rows={4} className="input-field resize-none" placeholder="FAQ answer..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
                <input {...register('category')} className="input-field" placeholder="e.g., General, Fees, Classes" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">{isSubmitting ? 'Saving...' : editItem ? 'Update' : 'Add FAQ'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SETTINGS ────────────────────────────────────────────────────────────────

export function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    getSettings().then(({ data }) => { reset(data.settings); }).catch(() => {}).finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async (data) => {
    try {
      await updateSettings(data);
    } catch {}
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-gray-200 border-t-primary-600 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Settings</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-2">Academy Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Academy Name</label><input {...register('academyName')} className="input-field" /></div>
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tagline</label><input {...register('tagline')} className="input-field" /></div>
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label><input {...register('email')} className="input-field" type="email" /></div>
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone</label><input {...register('phone')} className="input-field" /></div>
            <div className="sm:col-span-2"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Address</label><textarea {...register('address')} rows={2} className="input-field resize-none" /></div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-2">Social Media</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {['facebook', 'instagram', 'youtube', 'twitter'].map(platform => (
              <div key={platform}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 capitalize">{platform}</label>
                <input {...register(`socialMedia.${platform}`)} className="input-field" placeholder={`https://${platform}.com/...`} />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3">
          {isSubmitting ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
