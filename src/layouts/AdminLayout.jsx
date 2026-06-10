import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { FiMenu, FiBell } from 'react-icons/fi';
import AdminSidebar from '../components/admin/AdminSidebar';
import { useSelector } from 'react-redux';
import RhythmDanceLogo from '../assets/rhythmdance.png';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((s) => s.auth);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
            <FiMenu size={22} />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white hidden lg:block">
            <img src={RhythmDanceLogo} alt="Rhythm Dance Academy" className="h-10 w-auto object-contain" />
          </h1>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 relative">
              <FiBell size={20} />
            </button>
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-semibold overflow-hidden">
              {user?.profileImage ? <img src={user.profileImage} alt="" className="w-full h-full object-cover" /> : user?.name?.[0]}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
