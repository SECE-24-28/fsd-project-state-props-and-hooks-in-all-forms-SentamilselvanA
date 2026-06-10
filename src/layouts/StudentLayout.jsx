import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiHome, FiUser, FiFileText, FiMessageSquare, FiBell, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { logoutUser } from '../store/authSlice';
import { useTheme } from '../context/ThemeContext';
import RhythmDanceLogo from '../assets/rhythmdance.png';
import { FiMoon, FiSun } from 'react-icons/fi';

const navItems = [
  { to: '/student/dashboard', icon: FiHome, label: 'Dashboard' },
  { to: '/student/profile', icon: FiUser, label: 'My Profile' },
  { to: '/student/applications', icon: FiFileText, label: 'My Applications' },
  { to: '/student/enquiries', icon: FiMessageSquare, label: 'My Enquiries' },
  { to: '/student/notifications', icon: FiBell, label: 'Notifications' },
];

export default function StudentLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => { dispatch(logoutUser()); navigate('/'); };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {isOpen && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setIsOpen(false)} />}

      <aside className={`fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-30 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
          <img src={RhythmDanceLogo} alt="Rhythm Dance Academy" className="h-10 w-auto object-contain" />
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-500"><FiX size={20} /></button>
        </div>

        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <span className="text-primary-600 font-semibold">{user?.name?.[0]}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}>
              <Icon size={18} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-200 dark:border-gray-800 space-y-1">
          <button onClick={toggleTheme} className="admin-sidebar-link w-full">
            {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}<span>{isDark ? 'Light' : 'Dark'} Mode</span>
          </button>
          <button onClick={handleLogout} className="admin-sidebar-link w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
            <FiLogOut size={18} /><span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:ml-64 flex flex-col">
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setIsOpen(true)} className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300">
            <FiMenu size={22} />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Student Portal</h1>
          <NavLink to="/" className="text-sm text-primary-600 hover:text-primary-700 font-medium">← Back to Site</NavLink>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
