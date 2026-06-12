import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { getFAQs, submitEnquiry } from '../../services/apiServices';

const defaultFAQs = [
  { _id: '1', question: 'What age groups do you accept?', answer: 'We welcome students of all ages! We have special programs for kids (4–12), teens (13–17), and adults (18+).' },
  { _id: '2', question: 'Do I need prior dance experience?', answer: 'No prior experience is required. We have beginner, intermediate, and advanced classes to suit everyone.' },
  { _id: '3', question: 'What are the fee structures?', answer: 'Fees vary by course and duration. Monthly fees range from ₹1,500–₹4,000. Contact us for detailed pricing.' },
  { _id: '4', question: 'How do I enroll?', answer: 'You can apply online through our Apply Now page, or visit us in person. We also offer free trial classes for new students.' },
  { _id: '5', question: 'Are there performance opportunities?', answer: 'Yes! We organize annual recitals, participate in competitions, and offer students regular stage performance opportunities.' },
  { _id: '6', question: 'What should I wear to class?', answer: 'Comfortable, flexible clothing suitable for movement. Specific attire requirements may vary by dance style.' },
];

const courses = ['Bharatanatyam', 'Classical Dance', 'Western Dance', 'Hip Hop', 'Contemporary', 'Folk Dance', 'Kids Dance'];

export function FAQPage() {
  const [faqs, setFAQs] = useState([]);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    getFAQs()
      .then(({ data }) => setFAQs(data.faqs.length ? data.faqs : defaultFAQs))
      .catch(() => setFAQs(defaultFAQs));
  }, []);

  return (
    <div className="pt-16">
      <div className="bg-gradient-to-br from-gray-900 to-primary-900 py-24 text-center">
        <h1 className="font-display text-5xl font-bold text-white mb-4">FAQ</h1>
        <p className="text-gray-300">Frequently Asked Questions</p>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-3">
        {faqs.map((faq) => (
          <div key={faq._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => setOpen(open === faq._id ? null : faq._id)}
              className="w-full flex items-center justify-between px-6 py-5 text-left"
            >
              <span className="font-semibold text-gray-900 dark:text-white pr-4">{faq.question}</span>
              {open === faq._id
                ? <FiChevronUp className="text-primary-600 flex-shrink-0" />
                : <FiChevronDown className="text-gray-400 flex-shrink-0" />}
            </button>
            {open === faq._id && (
              <div className="px-6 pb-5 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-4">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PrivacyPolicyPage() {
  const sections = [
    ['Information We Collect', 'We collect information you provide directly to us, such as when you create an account, submit an application, or contact us. This includes name, email, mobile number, and payment information.'],
    ['How We Use Your Information', 'We use the information we collect to provide and improve our services, process applications, communicate with you about classes and events, and send you marketing communications (with your consent).'],
    ['Information Sharing', 'We do not sell, trade, or otherwise transfer your personal information to outside parties except as described in this policy. We may share information with trusted service providers who assist us in operating our website.'],
    ['Data Security', 'We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.'],
    ['Contact Us', 'If you have any questions about this Privacy Policy, please contact us at privacy@rhythmdance.com'],
  ];

  return (
    <div className="pt-16">
      <div className="bg-gradient-to-br from-gray-900 to-primary-900 py-24 text-center">
        <h1 className="font-display text-5xl font-bold text-white mb-4">Privacy Policy</h1>
        <p className="text-gray-300">Last updated: January 2024</p>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-16">
        {sections.map(([title, content]) => (
          <section key={title} className="mb-8">
            <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-3">{title}</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{content}</p>
          </section>
        ))}
      </div>
    </div>
  );
}

export function TermsPage() {
  const sections = [
    ['Enrollment & Fees', 'Enrollment is confirmed upon receipt of the registration fee. Monthly fees are due on the 1st of each month. A grace period of 7 days is provided before late fees apply.'],
    ['Attendance Policy', 'Regular attendance is essential for skill development. Students with poor attendance may be asked to re-enroll at a lower level. Make-up classes are available for missed sessions.'],
    ['Code of Conduct', 'All students and parents/guardians are expected to treat instructors and fellow students with respect. Disruptive behavior may result in suspension or termination of enrollment.'],
    ['Photography & Media', 'By enrolling, you consent to photography and video recording for promotional purposes. Please inform us in writing if you do not wish to be photographed.'],
    ['Refund Policy', 'Fees paid are non-refundable except in cases of medical emergencies with documentation. Course transfers may be arranged subject to availability.'],
    ['Changes to Terms', 'We reserve the right to modify these terms at any time. Students will be notified of significant changes via email.'],
  ];

  return (
    <div className="pt-16">
      <div className="bg-gradient-to-br from-gray-900 to-primary-900 py-24 text-center">
        <h1 className="font-display text-5xl font-bold text-white mb-4">Terms & Conditions</h1>
        <p className="text-gray-300">Last updated: January 2024</p>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-16">
        {sections.map(([title, content]) => (
          <section key={title} className="mb-8">
            <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-3">{title}</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{content}</p>
          </section>
        ))}
      </div>
    </div>
  );
}

export function EnquiryPage() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting }, setValue } = useForm();
  const { user } = useSelector((s) => s.auth);

  // Pre-fill fields from logged-in user so the enquiry is linked to their account
  useEffect(() => {
    if (user) {
      setValue('name',  user.name);
      setValue('email', user.email);
      setValue('mobile', user.mobile || '');
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    try {
      await submitEnquiry(data);
      setSubmitted(true);
      reset();
    } catch {}
  };

  return (
    <div className="pt-16">
      <div className="bg-gradient-to-br from-gray-900 to-primary-900 py-24 text-center">
        <h1 className="font-display text-5xl font-bold text-white mb-4">Enquiry</h1>
        <p className="text-gray-300">Have a question about our courses? Ask us!</p>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-16">
        {submitted ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Enquiry Submitted!</h2>
            <p className="text-gray-600 dark:text-gray-400">We'll get back to you within 24 hours.</p>
            <button onClick={() => setSubmitted(false)} className="btn-primary mt-6">Submit Another</button>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Name *</label>
                  <input {...register('name', { required: 'Required' })} className="input-field" placeholder="Your name" />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email *</label>
                  <input {...register('email', { required: 'Required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} className="input-field" placeholder="your@email.com" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Mobile *</label>
                  <input {...register('mobile', { required: 'Required' })} className="input-field" placeholder="+91 00000 00000" />
                  {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Course Interested *</label>
                  <select {...register('courseInterested', { required: 'Required' })} className="input-field">
                    <option value="">Select course</option>
                    {courses.map(c => <option key={c}>{c}</option>)}
                  </select>
                  {errors.courseInterested && <p className="text-red-500 text-xs mt-1">{errors.courseInterested.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message *</label>
                <textarea {...register('message', { required: 'Required' })} rows={4} className="input-field resize-none" placeholder="Your enquiry..." />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
              </div>
              <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3">
                {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
