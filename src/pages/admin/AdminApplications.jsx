import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FiSearch, FiEye, FiCheck, FiX } from 'react-icons/fi';
import { getAllApplications, updateApplicationStatus, deleteApplication } from '../../services/apiServices';
import { dummyApplications } from '../../data/dummyData';
import { TableSkeleton } from '../../components/common/LoadingSpinner';

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-700', Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700', 'Under Review': 'bg-blue-100 text-blue-700',
};
const statuses = ['', 'Pending', 'Under Review', 'Approved', 'Rejected'];

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState(null);
  const [adminNote, setAdminNote] = useState('');

  useEffect(() => { fetchApps(); }, [page, statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchApps = async () => {
    setLoading(true);
    try {
      const { data } = await getAllApplications({ page, limit: 10, status: statusFilter, search });
      const result = data.applications?.length ? data.applications : dummyApplications;
      setApplications(result);
      setTotal(data.total || result.length);
    } catch {}
    setLoading(false);
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateApplicationStatus(id, { status, adminNote });
      toast.success(`Application ${status.toLowerCase()}`);
      setSelected(null);
      fetchApps();
    } catch { toast.error('Update failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    try { await deleteApplication(id); toast.success('Deleted'); fetchApps(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Applications</h1>
        <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm font-semibold px-3 py-1 rounded-full">{total} Total</span>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchApps()}
            placeholder="Search applications..." className="input-field pl-10" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="input-field sm:w-40">
          {statuses.map(s => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
        </select>
        <button onClick={() => fetchApps()} className="btn-primary px-5">Filter</button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        {loading ? <div className="p-6"><TableSkeleton /></div> : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {['Applicant', 'Course', 'Gender', 'Mobile', 'Status', 'Date', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">{app.fullName}</p>
                          <p className="text-gray-500 dark:text-gray-400 text-xs">{app.email}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{app.selectedCourse}</td>
                      <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{app.gender}</td>
                      <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{app.mobile}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[app.status]}`}>{app.status}</span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{new Date(app.createdAt).toLocaleDateString()}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => { setSelected(app); setAdminNote(app.adminNote || ''); }}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors" title="View & Update">
                            <FiEye size={15} />
                          </button>
                          <button onClick={() => handleDelete(app._id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors" title="Delete">
                            <FiX size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {applications.length === 0 && (
                    <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-500 dark:text-gray-400">No applications found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {total > 10 && (
              <div className="flex justify-center gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
                {Array.from({ length: Math.ceil(total / 10) }).map((_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)} className={`w-9 h-9 rounded-lg text-sm font-medium ${page === i + 1 ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>{i + 1}</button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white">Application Details</h2>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><FiX size={20} /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[['Name', selected.fullName], ['Email', selected.email], ['Mobile', selected.mobile], ['Course', selected.selectedCourse], ['Gender', selected.gender], ['DOB', new Date(selected.dateOfBirth).toLocaleDateString()]].map(([k, v]) => (
                  <div key={k}>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{k}:</span>
                    <p className="text-gray-600 dark:text-gray-400 mt-0.5">{v}</p>
                  </div>
                ))}
                <div className="col-span-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Address:</span>
                  <p className="text-gray-600 dark:text-gray-400 mt-0.5">{selected.address}</p>
                </div>
                <div className="col-span-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Previous Experience:</span>
                  <p className="text-gray-600 dark:text-gray-400 mt-0.5">{selected.previousExperience || 'None'}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Admin Note</label>
                <textarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)} rows={2} className="input-field resize-none" placeholder="Optional note to student..." />
              </div>
              <div className="flex gap-3">
                <button onClick={() => handleStatusUpdate(selected._id, 'Approved')} className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
                  <FiCheck size={15} /> Approve
                </button>
                <button onClick={() => handleStatusUpdate(selected._id, 'Under Review')} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
                  Under Review
                </button>
                <button onClick={() => handleStatusUpdate(selected._id, 'Rejected')} className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
                  <FiX size={15} /> Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
