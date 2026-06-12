import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUpload } from 'react-icons/fi';
import { getClasses, createClass, updateClass, deleteClass, getFaculty } from '../../services/apiServices';
import { dummyClasses, dummyFaculty } from '../../data/dummyData';

export default function AdminClasses() {
  const [classes, setClasses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editClass, setEditClass] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [imageFile, setImageFile] = useState(null);

  const { register, handleSubmit, reset, setValue, formState: { isSubmitting, errors } } = useForm();

  useEffect(() => {
    fetchData();
    getFaculty().then(({ data }) => {
      const apiFaculty = data.faculty || [];
      const apiIds = new Set(apiFaculty.map(f => f._id));
      setFaculty([...dummyFaculty.filter(f => !apiIds.has(f._id)), ...apiFaculty]);
    }).catch(() => setFaculty(dummyFaculty));
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await getClasses({ limit: 50 });
      setClasses(data.classes?.length ? data.classes : dummyClasses);
    } catch {}
    setLoading(false);
  };

  const openModal = (cls = null) => {
    setEditClass(cls);
    setImagePreview(cls?.image || null);
    setImageFile(null);
    if (cls) {
      Object.keys(cls).forEach(k => setValue(k, cls[k]));
      setValue('instructorId', cls.instructor?._id || cls.instructor || '');
      setValue('scheduleDay', cls.schedule?.[0]?.day || '');
      setValue('scheduleStart', cls.schedule?.[0]?.startTime || '');
      setValue('scheduleEnd', cls.schedule?.[0]?.endTime || '');
    } else {
      reset();
      setImagePreview(null);
    }
    setShowModal(true);
  };

  const isDummyId = (id) => !id || !/^[a-f\d]{24}$/i.test(id);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      const schedule = data.scheduleDay ? [{ day: data.scheduleDay, startTime: data.scheduleStart, endTime: data.scheduleEnd }] : [];
      formData.append('schedule', JSON.stringify(schedule));

      ['title', 'description', 'category', 'ageGroup', 'duration', 'fees'].forEach(k => {
        if (data[k]) formData.append(k, data[k]);
      });

      if (data.instructorId && !isDummyId(data.instructorId)) {
        formData.append('instructor', data.instructorId);
      }

      if (imageFile) formData.append('image', imageFile);

      if (editClass && !isDummyId(editClass._id)) {
        await updateClass(editClass._id, formData);
      } else {
        await createClass(formData);
      }

      toast.success(`Class ${editClass ? 'updated' : 'created'} successfully!`);
      setShowModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete class "${title}"?`)) return;
    try {
      await deleteClass(id);
      toast.success('Class deleted');
      fetchData();
    } catch { toast.error('Delete failed'); }
  };

  const categories = ['Bharatanatyam', 'Classical', 'Western', 'Hip Hop', 'Contemporary', 'Folk'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Dance Classes</h1>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2 text-sm">
          <FiPlus size={16} /> Add Class
        </button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <div key={cls._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-40 bg-gray-100 dark:bg-gray-700">
                <img src={cls.image || 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=400&h=200&fit=crop'}
                  alt={cls.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">{cls.category}</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{cls.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{cls.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <span>₹{cls.fees}/month</span>
                  <span>{cls.duration}</span>
                  <span>{cls.ageGroup}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openModal(cls)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
                    <FiEdit2 size={14} /> Edit
                  </button>
                  <button onClick={() => handleDelete(cls._id, cls.title)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors">
                    <FiTrash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {classes.length === 0 && <div className="col-span-3 text-center py-20 text-gray-500 dark:text-gray-400">No classes found. Add your first class!</div>}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl my-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white">{editClass ? 'Edit Class' : 'Add New Class'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><FiX size={20} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Title *</label>
                  <input {...register('title', { required: 'Required' })} className="input-field" placeholder="Class title" />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description *</label>
                  <textarea {...register('description', { required: 'Required' })} rows={3} className="input-field resize-none" placeholder="Class description" />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category *</label>
                  <select {...register('category', { required: 'Required' })} className="input-field">
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Instructor</label>
                  <select {...register('instructorId')} className="input-field">
                    <option value="">Select instructor</option>
                    {faculty.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Age Group *</label>
                  <input {...register('ageGroup', { required: 'Required' })} className="input-field" placeholder="e.g., 5-12 years" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Duration *</label>
                  <input {...register('duration', { required: 'Required' })} className="input-field" placeholder="e.g., 60 minutes" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Monthly Fees (₹) *</label>
                  <input type="number" {...register('fees', { required: 'Required', min: 0 })} className="input-field" placeholder="2000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Schedule Day</label>
                  <select {...register('scheduleDay')} className="input-field">
                    <option value="">Select day</option>
                    {days.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Start Time</label>
                  <input type="time" {...register('scheduleStart')} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">End Time</label>
                  <input type="time" {...register('scheduleEnd')} className="input-field" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Class Image</label>
                  <label className="flex items-center gap-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 cursor-pointer hover:border-primary-500 transition-colors">
                    <FiUpload size={18} className="text-gray-400" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Upload image</span>
                    <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files[0]; if (f) { setImageFile(f); setImagePreview(URL.createObjectURL(f)); } }} className="hidden" />
                  </label>
                  {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 h-32 rounded-lg object-cover" />}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
                  {isSubmitting ? 'Saving...' : editClass ? 'Update Class' : 'Create Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
