import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { FiEye, FiEyeOff, FiCheck, FiX } from 'react-icons/fi';
import { registerUser } from '../../store/authSlice';

const passwordChecks = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'Contains uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'Contains number', test: (p) => /\d/.test(p) },
  { label: 'Contains special character', test: (p) => /[!@#$%^&*]/.test(p) },
];

export default function RegisterPage() {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { loading } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const password = watch('password', '');

  const getStrength = () => {
    const passed = passwordChecks.filter(c => c.test(password)).length;
    if (passed <= 1) return { label: 'Weak', color: 'bg-red-500', width: '25%' };
    if (passed <= 2) return { label: 'Fair', color: 'bg-yellow-500', width: '50%' };
    if (passed <= 3) return { label: 'Good', color: 'bg-blue-500', width: '75%' };
    return { label: 'Strong', color: 'bg-green-500', width: '100%' };
  };

  const onSubmit = async (data) => {
    const result = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(result)) {
      navigate('/student/dashboard');
    }
  };

  const strength = password ? getStrength() : null;

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-accent-600 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, white 0%, transparent 50%)' }} />
        <div className="relative text-center text-white">
          <div className="text-6xl mb-6">💃</div>
          <h2 className="font-display text-4xl font-bold mb-4">Start Your Journey</h2>
          <p className="text-white/80 text-lg leading-relaxed max-w-sm">Join hundreds of students who found their passion for dance at Rhythm Dance Academy.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-accent-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">R</span>
              </div>
              <span className="font-display font-bold text-xl text-gray-900 dark:text-white">Rhythm Dance</span>
            </Link>
            <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Create Account</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Already have an account? <Link to="/login" className="text-primary-600 hover:underline font-medium">Sign in</Link></p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name *</label>
              <input {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
                placeholder="Your full name" className="input-field" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address *</label>
              <input {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                placeholder="your@email.com" className="input-field" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Mobile Number *</label>
              <input {...register('mobile', { required: 'Mobile is required', pattern: { value: /^[0-9+\-\s]{7,15}$/, message: 'Invalid mobile' } })}
                placeholder="+91 00000 00000" className="input-field" />
              {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password *</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'}
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                  placeholder="••••••••" className="input-field pr-10" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}

              {/* Strength Indicator */}
              {password && strength && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500">Password strength</span>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{strength.label}</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full ${strength.color} transition-all duration-300 rounded-full`} style={{ width: strength.width }} />
                  </div>
                  <div className="grid grid-cols-2 gap-1 mt-2">
                    {passwordChecks.map(({ label, test }) => (
                      <div key={label} className={`flex items-center gap-1 text-xs ${test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                        {test(password) ? <FiCheck size={10} /> : <FiX size={10} />} {label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password *</label>
              <div className="relative">
                <input type={showConfirm ? 'text' : 'password'}
                  {...register('confirmPassword', {
                    required: 'Please confirm password',
                    validate: (val) => val === password || 'Passwords do not match',
                  })}
                  placeholder="••••••••" className="input-field pr-10" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            <Link to="/" className="hover:text-primary-600">← Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
