import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiHome, FiUsers, FiBook, FiUserCheck, FiFileText, FiMessageSquare,
  FiPhone, FiBell, FiSettings, FiLogOut, FiX, FiHelpCircle, FiMoon, FiSun
} from 'react-icons/fi';
import { logoutUser } from '../../store/authSlice';
import { useTheme } from '../../context/ThemeContext';

const navItems = [
  { to: '/admin/dashboard', icon: FiHome, label: 'Dashboard' },
  { to: '/admin/students', icon: FiUsers, label: 'Students' },
  { to: '/admin/classes', icon: FiBook, label: 'Classes' },
  { to: '/admin/faculty', icon: FiUserCheck, label: 'Faculty' },
  { to: '/admin/applications', icon: FiFileText, label: 'Applications' },
  { to: '/admin/enquiries', icon: FiMessageSquare, label: 'Enquiries' },
  { to: '/admin/contacts', icon: FiPhone, label: 'Contacts' },
  { to: '/admin/notifications', icon: FiBell, label: 'Notifications' },
  { to: '/admin/faqs', icon: FiHelpCircle, label: 'FAQs' },
  { to: '/admin/settings', icon: FiSettings, label: 'Settings' },
];

export default function AdminSidebar({ isOpen, setIsOpen }) {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setIsOpen(false)} />}

      <aside className={`fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-30 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">R</span>
            </div>
            <span className="font-display font-bold text-gray-900 dark:text-white">Admin Panel</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400">
            <FiX size={20} />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center overflow-hidden">
              {user?.profileImage ? (
                <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-primary-600 font-semibold text-sm">{user?.name?.[0]}</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-primary-600 dark:text-primary-400">Administrator</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-800 space-y-1">
          <button onClick={toggleTheme} className="admin-sidebar-link w-full">
            {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
            <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button onClick={handleLogout} className="admin-sidebar-link w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
            <FiLogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
