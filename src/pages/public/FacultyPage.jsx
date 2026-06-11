import React, { useState, useEffect } from 'react';
import { FiMail, FiPhone, FiAward } from 'react-icons/fi';
import { getFaculty } from '../../services/apiServices';
import { dummyFaculty } from '../../data/dummyData';
import { CardSkeleton } from '../../components/common/LoadingSpinner';
import heroBg from '../../assets/bg-rhythmdance.png';

export default function FacultyPage() {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFaculty().then(({ data }) => {
      const apiFaculty = data.faculty || [];
      const apiIds = new Set(apiFaculty.map(f => f._id));
      setFaculty([...dummyFaculty.filter(f => !apiIds.has(f._id)), ...apiFaculty]);
    }).catch(() => setFaculty(dummyFaculty)).finally(() => setLoading(false));
  }, []);

  const displayFaculty = faculty;

  return (
    <div className="pt-16">
      <div className="relative bg-cover bg-center bg-no-repeat text-center min-h-[300px] flex items-center justify-center" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10">
          <h1 className="font-display text-5xl font-bold text-white mb-4">Our Faculty</h1>
          <p className="text-gray-300 max-w-xl mx-auto">Meet our team of passionate and experienced dance instructors.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayFaculty.map((member) => (
              <div key={member._id} className="card group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center">
                <div className="relative overflow-hidden h-64">
                  <img src={member.image || 'https://i.pravatar.cc/300'} alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                    <div className="flex gap-3">
                      {member.email && <a href={`mailto:${member.email}`} className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-primary-600 hover:bg-primary-600 hover:text-white transition-colors"><FiMail size={15} /></a>}
                      {member.mobile && <a href={`tel:${member.mobile}`} className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-primary-600 hover:bg-primary-600 hover:text-white transition-colors"><FiPhone size={15} /></a>}
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">{member.name}</h3>
                  <div className="flex items-center justify-center gap-1.5 mt-1 mb-3">
                    <FiAward size={14} className="text-gold-500" />
                    <span className="text-sm text-gold-500 font-medium">{member.experience} Years Experience</span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-1.5 mb-3">
                    {(member.specialization || []).map(s => (
                      <span key={s} className="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs px-2 py-0.5 rounded-full">{s}</span>
                    ))}
                  </div>
                  {member.bio && <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed line-clamp-3">{member.bio}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
