import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUpload } from 'react-icons/fi';
import { getFaculty, createFaculty, updateFaculty, deleteFaculty } from '../../services/apiServices';
import { dummyFaculty } from '../../data/dummyData';

export default function AdminFaculty() {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const { register, handleSubmit, reset, setValue, formState: { isSubmitting } } = useForm();

  useEffect(() => { fetchFaculty(); }, []);

  const fetchFaculty = async () => {
    setLoading(true);
    try { const { data } = await getFaculty(); setFaculty(data.faculty?.length ? data.faculty : dummyFaculty); } catch { setFaculty(dummyFaculty); }
    setLoading(false);
  };

  const openModal = (item = null) => {
    setEditItem(item);
    setImagePreview(item?.image || null);
    if (item) {
      setValue('name', item.name);
      setValue('experience', item.experience);
      setValue('bio', item.bio);
      setValue('email', item.email);
      setValue('mobile', item.mobile);
      setValue('specialization', item.specialization?.join(', '));
      setValue('qualifications', item.qualifications?.join(', '));
    } else { reset(); setImagePreview(null); }
    setShowModal(true);
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      const spec = data.specialization ? data.specialization.split(',').map(s => s.trim()).filter(Boolean) : [];
      const quals = data.qualifications ? data.qualifications.split(',').map(s => s.trim()).filter(Boolean) : [];

      formData.append('specialization', JSON.stringify(spec));
      formData.append('qualifications', JSON.stringify(quals));
      ['name', 'experience', 'bio', 'email', 'mobile'].forEach(k => { if (data[k]) formData.append(k, data[k]); });
      if (data.image?.[0]) formData.append('image', data.image[0]);

      if (editItem) await updateFaculty(editItem._id, formData);
      else await createFaculty(formData);

      toast.success(`Faculty member ${editItem ? 'updated' : 'added'} successfully!`);
      setShowModal(false);
      fetchFaculty();
    } catch (err) { toast.error(err.response?.data?.message || 'Operation failed'); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) return;
    try { await deleteFaculty(id); toast.success('Faculty deleted'); fetchFaculty(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Faculty Management</h1>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2 text-sm"><FiPlus size={16} /> Add Faculty</button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-72 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />)}</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {faculty.map((member) => (
            <div key={member._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
                <img src={member.image || 'https://i.pravatar.cc/300'} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-sm text-primary-600 mb-2">{member.experience} yrs experience</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {member.specialization?.slice(0, 2).map(s => <span key={s} className="bg-primary-50 dark:bg-primary-900/20 text-primary-600 text-xs px-2 py-0.5 rounded-full">{s}</span>)}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openModal(member)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
                    <FiEdit2 size={13} /> Edit
                  </button>
                  <button onClick={() => handleDelete(member._id, member.name)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors">
                    <FiTrash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {faculty.length === 0 && <div className="col-span-4 text-center py-20 text-gray-500 dark:text-gray-400">No faculty added yet.</div>}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg my-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white">{editItem ? 'Edit Faculty' : 'Add Faculty'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><FiX size={20} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name *</label>
                <input {...register('name', { required: 'Required' })} className="input-field" placeholder="Instructor name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Experience (years) *</label>
                  <input type="number" {...register('experience', { required: 'Required', min: 0 })} className="input-field" placeholder="10" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                  <input {...register('email')} className="input-field" placeholder="instructor@email.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Mobile</label>
                <input {...register('mobile')} className="input-field" placeholder="+91 00000 00000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Specializations (comma-separated)</label>
                <input {...register('specialization')} className="input-field" placeholder="Bharatanatyam, Classical" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Qualifications (comma-separated)</label>
                <input {...register('qualifications')} className="input-field" placeholder="BFA Dance, Certified Instructor" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Bio</label>
                <textarea {...register('bio')} rows={3} className="input-field resize-none" placeholder="Brief bio..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Profile Photo</label>
                <label className="flex items-center gap-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 cursor-pointer hover:border-primary-500 transition-colors">
                  <FiUpload size={18} className="text-gray-400" />
                  <span className="text-sm text-gray-500">Upload photo</span>
                  <input type="file" accept="image/*" {...register('image')} onChange={(e) => { if (e.target.files[0]) setImagePreview(URL.createObjectURL(e.target.files[0])); }} className="hidden" />
                </label>
                {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 h-24 w-24 rounded-full object-cover" />}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">{isSubmitting ? 'Saving...' : editItem ? 'Update' : 'Add Faculty'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
