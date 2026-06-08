import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FiUpload, FiUser, FiLock, FiSave } from 'react-icons/fi';
import { updateProfile, uploadProfileImage, updatePassword as updatePwd } from '../../services/apiServices';
import { updateUserLocal } from '../../store/authSlice';

export default function StudentProfile() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const [tab, setTab] = useState('profile');
  const [uploading, setUploading] = useState(false);

  const { register: regProfile, handleSubmit: handleProfile, formState: { isSubmitting: savingProfile } } = useForm({
    defaultValues: { name: user?.name, mobile: user?.mobile }
  });

  const { register: regPwd, handleSubmit: handlePwd, reset: resetPwd, watch, formState: { errors: pwdErrors, isSubmitting: savingPwd } } = useForm();
  const newPassword = watch('newPassword', '');

  const onProfileSave = async (data) => {
    try {
      const { data: res } = await updateProfile(data);
      dispatch(updateUserLocal(res.user));
      toast.success('Profile updated!');
    } catch { toast.error('Update failed'); }
  };

  const onImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const { data } = await uploadProfileImage(formData);
      dispatch(updateUserLocal({ profileImage: data.user.profileImage }));
      toast.success('Profile picture updated!');
    } catch { toast.error('Upload failed'); }
    setUploading(false);
  };

  const onPasswordChange = async (data) => {
    try {
      await updatePwd({ currentPassword: data.currentPassword, newPassword: data.newPassword });
      toast.success('Password changed successfully!');
      resetPwd();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to change password'); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">My Profile</h1>

      {/* Profile Picture */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 flex items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            {user?.profileImage ? <img src={user.profileImage} alt="" className="w-full h-full object-cover" /> : <FiUser size={32} className="text-primary-600" />}
          </div>
          {uploading && <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center"><div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /></div>}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{user?.name}</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{user?.email}</p>
          <label className="mt-2 inline-flex items-center gap-1.5 text-sm text-primary-600 cursor-pointer hover:underline">
            <FiUpload size={14} /> Change Photo
            <input type="file" accept="image/*" className="hidden" onChange={onImageUpload} />
          </label>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
        {[['profile', FiUser, 'Profile Info'], ['password', FiLock, 'Change Password']].map(([id, Icon, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === id ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}>
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {tab === 'profile' ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
          <form onSubmit={handleProfile(onProfileSave)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <input {...regProfile('name', { required: 'Required' })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email (read-only)</label>
              <input value={user?.email || ''} disabled className="input-field bg-gray-50 dark:bg-gray-700 cursor-not-allowed opacity-60" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Mobile Number</label>
              <input {...regProfile('mobile', { required: 'Required' })} className="input-field" />
            </div>
            <button type="submit" disabled={savingProfile} className="btn-primary flex items-center gap-2">
              {savingProfile ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiSave size={16} />} Save Changes
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
          <form onSubmit={handlePwd(onPasswordChange)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Current Password</label>
              <input type="password" {...regPwd('currentPassword', { required: 'Required' })} className="input-field" placeholder="••••••••" />
              {pwdErrors.currentPassword && <p className="text-red-500 text-xs mt-1">{pwdErrors.currentPassword.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">New Password</label>
              <input type="password" {...regPwd('newPassword', { required: 'Required', minLength: { value: 6, message: 'Min 6 chars' } })} className="input-field" placeholder="••••••••" />
              {pwdErrors.newPassword && <p className="text-red-500 text-xs mt-1">{pwdErrors.newPassword.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm New Password</label>
              <input type="password" {...regPwd('confirmPassword', { required: 'Required', validate: (v) => v === newPassword || 'Passwords do not match' })} className="input-field" placeholder="••••••••" />
              {pwdErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{pwdErrors.confirmPassword.message}</p>}
            </div>
            <button type="submit" disabled={savingPwd} className="btn-primary flex items-center gap-2">
              {savingPwd ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiLock size={16} />} Update Password
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
