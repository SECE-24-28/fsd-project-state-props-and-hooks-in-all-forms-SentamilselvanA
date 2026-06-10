import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiMenu, FiX, FiMoon, FiSun, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import { logoutUser } from '../../store/authSlice';
import { useTheme } from '../../context/ThemeContext';
import RhythmDanceLogo from '../../assets/rhythmdance.png';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/classes', label: 'Classes' },
  { to: '/faculty', label: 'Faculty' },
  { to: '/apply', label: 'Apply' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
    setDropdownOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={RhythmDanceLogo} alt="Rhythm Dance Academy" className="h-10 w-auto object-contain" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink key={to} to={to} end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-800'}`
                }>
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            {user ? (
              <div className="relative">
                <button onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-primary-600 text-white px-3 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                  <FiUser size={16} />
                  <span className="max-w-20 truncate">{user.name.split(' ')[0]}</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <Link to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <FiSettings size={15} /> Dashboard
                    </Link>
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                      <FiLogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300">
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-3 space-y-1">
          {navLinks.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-lg text-sm font-medium ${isActive ? 'text-primary-600 bg-primary-50' : 'text-gray-700 dark:text-gray-300'}`}>
              {label}
            </NavLink>
          ))}
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-2">
            <button onClick={toggleTheme} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300">
              {isDark ? <FiSun size={16} /> : <FiMoon size={16} />} {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>
            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} onClick={() => setIsOpen(false)} className="btn-primary text-sm text-center">Dashboard</Link>
                <button onClick={handleLogout} className="text-red-600 text-sm font-medium py-2">Logout</button>
              </>
            ) : (
              <>
                <Link to="/register" onClick={() => setIsOpen(false)} className="btn-primary text-sm text-center">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
