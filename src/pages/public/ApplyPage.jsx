import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiUpload, FiCheckCircle } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { submitApplication } from '../../services/apiServices';
import heroBg from '../../assets/bg-rhythmdance.png';

const courses = ['Bharatanatyam', 'Classical Dance', 'Western Dance', 'Hip Hop', 'Contemporary', 'Folk Dance'];

export default function ApplyPage() {
  const [submitted, setSubmitted] = useState(false);
  const [preview, setPreview] = useState(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    if (!user) {
      toast.info('Please login to submit an application.');
      navigate('/login');
      return;
    }
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key === 'photo' && data[key][0]) formData.append('photo', data[key][0]);
        else if (key !== 'photo') formData.append(key, data[key]);
      });
      await submitApplication(formData);
      setSubmitted(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">Application Submitted!</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Thank you for applying to Rhythm Dance Academy. We'll review your application and contact you within 2–3 business days.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <div className="relative bg-cover bg-center bg-no-repeat text-center min-h-[300px] flex items-center justify-center" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10">
          <h1 className="font-display text-5xl font-bold text-white mb-4">Apply Now</h1>
          <p className="text-gray-300 max-w-xl mx-auto">Start your dance journey with us. Fill out the form below.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name *</label>
                <input {...register('fullName', { required: 'Required' })} className="input-field" placeholder="Your full name" />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email *</label>
                <input {...register('email', { required: 'Required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} className="input-field" placeholder="your@email.com" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Mobile Number *</label>
                <input {...register('mobile', { required: 'Required' })} className="input-field" placeholder="+91 00000 00000" />
                {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Date of Birth *</label>
                <input type="date" {...register('dateOfBirth', { required: 'Required' })} className="input-field" />
                {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth.message}</p>}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Gender *</label>
                <select {...register('gender', { required: 'Required' })} className="input-field">
                  <option value="">Select gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
                {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Selected Course *</label>
                <select {...register('selectedCourse', { required: 'Required' })} className="input-field">
                  <option value="">Select course</option>
                  {courses.map(c => <option key={c}>{c}</option>)}
                </select>
                {errors.selectedCourse && <p className="text-red-500 text-xs mt-1">{errors.selectedCourse.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Address *</label>
              <textarea {...register('address', { required: 'Required' })} rows={2} className="input-field resize-none" placeholder="Your full address" />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Previous Dance Experience</label>
              <textarea {...register('previousExperience')} rows={3} className="input-field resize-none"
                placeholder="Describe any previous dance training or experience (or write 'None')" />
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Upload Photo</label>
              <div className="flex items-center gap-4">
                {preview && <img src={preview} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-primary-300" />}
                <label className="flex items-center gap-2 cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl px-5 py-3 hover:border-primary-500 transition-colors">
                  <FiUpload size={18} className="text-gray-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Choose photo (Max 5MB)</span>
                  <input type="file" accept="image/*" {...register('photo')} onChange={handlePhotoChange} className="hidden" />
                </label>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
