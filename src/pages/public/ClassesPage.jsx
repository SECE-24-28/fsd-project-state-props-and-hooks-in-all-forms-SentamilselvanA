import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiDollarSign, FiUsers, FiSearch } from 'react-icons/fi';
import heroBg from '../../assets/bg-rhythmdance.png';
import { getClasses } from '../../services/apiServices';
import { dummyClasses } from '../../data/dummyData';
import { CardSkeleton } from '../../components/common/LoadingSpinner';

const categories = ['All', 'Bharatanatyam', 'Classical', 'Western', 'Hip Hop', 'Contemporary', 'Folk'];

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchClasses();
  }, [category, page]); // eslint-disable-line react-hooks/exhaustive-deps

  const applyLocalFilters = (data) => {
    let result = data;
    if (category && category !== 'All') result = result.filter(c => c.category === category);
    if (search) result = result.filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase()));
    return result;
  };

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (category && category !== 'All') params.category = category;
      if (search) params.search = search;
      const { data } = await getClasses(params);
      if (data.classes?.length) {
        setClasses(data.classes);
        setTotal(data.total || data.classes.length);
      } else {
        const filtered = applyLocalFilters(dummyClasses);
        setClasses(filtered);
        setTotal(filtered.length);
      }
    } catch {
      const filtered = applyLocalFilters(dummyClasses);
      setClasses(filtered);
      setTotal(filtered.length);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchClasses();
  };

  return (
    <div className="pt-16">
      {/* Hero */}
      <div className="relative bg-cover bg-center bg-no-repeat text-center min-h-[300px] flex items-center justify-center" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10">
          <h1 className="font-display text-5xl font-bold text-white mb-4">Dance Classes</h1>
          <p className="text-gray-300 max-w-xl mx-auto">Explore our wide range of dance programs for all ages and skill levels.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search classes..."
                className="input-field pl-10" />
            </div>
            <button type="submit" className="btn-primary px-5">Search</button>
          </form>
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map(cat => (
              <button key={cat} onClick={() => { setCategory(cat === 'All' ? '' : cat); setPage(1); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${(cat === 'All' && !category) || category === cat ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Classes Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : classes.length === 0 ? (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400">
            <div className="text-5xl mb-4">💃</div>
            <p className="text-xl">No classes found. Check back soon!</p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {classes.map((cls) => (
                <div key={cls._id} className="card group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative overflow-hidden h-48">
                    <img src={cls.image || 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=400&h=300&fit=crop'}
                      alt={cls.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3">
                      <span className="bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full">{cls.category}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-2">{cls.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{cls.description}</p>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <FiClock size={14} className="text-primary-500" />
                        <span>{cls.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <FiUsers size={14} className="text-primary-500" />
                        <span>{cls.ageGroup}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <FiDollarSign size={14} className="text-primary-500" />
                        <span>₹{cls.fees}/month</span>
                      </div>
                      {cls.instructor && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <span>👤</span><span className="truncate">{cls.instructor.name}</span>
                        </div>
                      )}
                    </div>
                    {cls.schedule?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {cls.schedule.map((s, i) => (
                          <span key={i} className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded">
                            {s.day} {s.startTime}–{s.endTime}
                          </span>
                        ))}
                      </div>
                    )}
                    <Link to="/apply" className="btn-primary w-full text-center text-sm">Enroll Now</Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {total > 9 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: Math.ceil(total / 9) }).map((_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${page === i + 1 ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'}`}>
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
