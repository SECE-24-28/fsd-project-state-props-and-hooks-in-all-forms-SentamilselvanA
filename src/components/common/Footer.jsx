import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiYoutube, FiTwitter, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-accent-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="font-display font-bold text-xl text-white">Rhythm Dance</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed mb-5">Where every step tells a story. Join us and discover the joy of dance.</p>
          <div className="flex gap-3">
            {[FiFacebook, FiInstagram, FiYoutube, FiTwitter].map((Icon, i) => (
              <a key={i} href="/#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {[['/', 'Home'], ['/about', 'About Us'], ['/classes', 'Dance Classes'], ['/faculty', 'Faculty'], ['/apply', 'Apply Now'], ['/contact', 'Contact']].map(([to, label]) => (
              <li key={to}><Link to={to} className="text-gray-400 hover:text-primary-400 transition-colors text-sm">{label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Classes */}
        <div>
          <h3 className="text-white font-semibold mb-4">Dance Styles</h3>
          <ul className="space-y-2">
            {['Bharatanatyam', 'Classical Dance', 'Hip Hop', 'Western Dance', 'Contemporary', 'Folk Dance', 'Kids Dance'].map(s => (
              <li key={s}><Link to="/classes" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">{s}</Link></li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contact Us</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <FiMapPin className="text-primary-400 mt-0.5 flex-shrink-0" size={16} />
              <span className="text-gray-400 text-sm">123 Dance Avenue, Arts District, Chennai - 600001</span>
            </div>
            <div className="flex items-center gap-3">
              <FiPhone className="text-primary-400 flex-shrink-0" size={16} />
              <span className="text-gray-400 text-sm">+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-3">
              <FiMail className="text-primary-400 flex-shrink-0" size={16} />
              <span className="text-gray-400 text-sm">info@rhythmdance.com</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 text-sm">© 2024 Rhythm Dance Academy. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/privacy-policy" className="text-gray-500 hover:text-gray-300 text-sm">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-500 hover:text-gray-300 text-sm">Terms & Conditions</Link>
            <Link to="/faq" className="text-gray-500 hover:text-gray-300 text-sm">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
