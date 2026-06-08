import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiClock, FiArrowRight } from 'react-icons/fi';
import { getMyApplications } from '../../services/apiServices';
import { dummyApplications } from '../../data/dummyData';
import { TableSkeleton } from '../../components/common/LoadingSpinner';

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  'Under Review': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

export default function StudentApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyApplications().then(({ data }) => setApplications(data.applications?.length ? data.applications : dummyApplications)).catch(() => setApplications(dummyApplications)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">My Applications</h1>
        <Link to="/apply" className="btn-primary text-sm flex items-center gap-2">Apply for Course <FiArrowRight size={14} /></Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6"><TableSkeleton /></div>
        ) : applications.length === 0 ? (
          <div className="p-12 text-center">
            <FiFileText size={40} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">No Applications Yet</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">Submit an application to start your dance journey.</p>
            <Link to="/apply" className="btn-primary text-sm">Apply Now</Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {applications.map((app) => (
              <div key={app._id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FiFileText size={18} className="text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{app.selectedCourse}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1.5 mt-0.5">
                        <FiClock size={12} /> Submitted {new Date(app.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                      {app.adminNote && <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg"><span className="font-medium">Note:</span> {app.adminNote}</p>}
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full flex-shrink-0 ${statusColors[app.status]}`}>{app.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
