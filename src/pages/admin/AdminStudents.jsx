import React, { useEffect, useState } from 'react';
import { FiSearch, FiTrash2, FiUser } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { getAllUsers, updateUser, deleteUser } from '../../services/apiServices';
import { TableSkeleton } from '../../components/common/LoadingSpinner';

export default function AdminStudents() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => { fetchUsers(); }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await getAllUsers({ page, limit: 10, role: 'student', search });
      setUsers(data.users || []);
      setTotal(data.total || 0);
    } catch {}
    setLoading(false);
  };

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchUsers(); };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user ${name}?`)) return;
    try {
      await deleteUser(id);
      toast.success('User deleted');
      fetchUsers();
    } catch { toast.error('Failed to delete user'); }
  };

  const handleToggleActive = async (user) => {
    try {
      await updateUser(user._id, { isActive: !user.isActive });
      toast.success(`User ${user.isActive ? 'deactivated' : 'activated'}`);
      fetchUsers();
    } catch { toast.error('Update failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Student Management</h1>
        <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm font-semibold px-3 py-1 rounded-full">{total} Students</span>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..."
              className="input-field pl-10" />
          </div>
          <button type="submit" className="btn-primary px-5">Search</button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6"><TableSkeleton /></div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <FiUser size={40} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-500 dark:text-gray-400">No students found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {['Student', 'Email', 'Mobile', 'Status', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                          <span className="text-primary-600 font-semibold text-sm">{user.name?.[0]}</span>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white text-sm">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{user.email}</td>
                    <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{user.mobile}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleToggleActive(user)}
                          className={`text-xs font-medium px-2.5 py-1 rounded transition-colors ${user.isActive ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20' : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'}`}>
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button onClick={() => handleDelete(user._id, user.name)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors">
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {total > 10 && (
          <div className="flex justify-center gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
            {Array.from({ length: Math.ceil(total / 10) }).map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-lg text-sm font-medium ${page === i + 1 ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
