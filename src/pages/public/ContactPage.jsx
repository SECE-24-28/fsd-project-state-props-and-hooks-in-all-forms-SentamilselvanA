import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend } from 'react-icons/fi';
import { submitContact } from '../../services/apiServices';

export default function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await submitContact(data);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      reset();
    } catch {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="pt-16">
      <div className="bg-gradient-to-br from-gray-900 to-primary-900 py-24 text-center">
        <h1 className="font-display text-5xl font-bold text-white mb-4">Contact Us</h1>
        <p className="text-gray-300 max-w-xl mx-auto">Have questions? We'd love to hear from you.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-3 gap-12">
        {/* Info */}
        <div className="lg:col-span-1 space-y-6">
          <div>
            <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">Get in Touch</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">We're here to answer any questions about our dance programs, schedule a trial class, or simply learn more about us.</p>
          </div>
          {[
            { icon: FiMapPin, title: 'Address', content: '123 Dance Avenue, Arts District\nChennai - 600001, Tamil Nadu' },
            { icon: FiPhone, title: 'Phone', content: '+91 98765 43210\n+91 98765 43211' },
            { icon: FiMail, title: 'Email', content: 'info@rhythmdance.com\nadmissions@rhythmdance.com' },
            { icon: FiClock, title: 'Hours', content: 'Mon–Sat: 6:00 AM – 9:00 PM\nSunday: 8:00 AM – 6:00 PM' },
          ].map(({ icon: Icon, title, content }) => (
            <div key={title} className="flex gap-4">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-primary-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{title}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-line mt-0.5">{content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-6">Send Us a Message</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name *</label>
                  <input {...register('name', { required: 'Name is required' })} placeholder="Your full name" className="input-field" />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email *</label>
                  <input {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} placeholder="your@email.com" className="input-field" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone</label>
                  <input {...register('phone')} placeholder="+91 00000 00000" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Subject *</label>
                  <input {...register('subject', { required: 'Subject is required' })} placeholder="Message subject" className="input-field" />
                  {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message *</label>
                <textarea {...register('message', { required: 'Message is required', minLength: { value: 20, message: 'Min 20 characters' } })}
                  rows={5} placeholder="Write your message here..." className="input-field resize-none" />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
              </div>
              <button type="submit" disabled={isSubmitting} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FiSend size={16} /> Send Message</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
