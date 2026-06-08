import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const instructors = [
  { name: 'Lakshmi Raghavan', role: 'Bharatanatyam & Classical', exp: '18 Years', image: 'https://i.pravatar.cc/300?img=10' },
  { name: 'Karan Nair', role: 'Hip Hop & Western', exp: '12 Years', image: 'https://i.pravatar.cc/300?img=12' },
  { name: 'Meera Pillai', role: 'Contemporary & Ballet', exp: '15 Years', image: 'https://i.pravatar.cc/300?img=20' },
];

export default function AboutPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 to-primary-900 py-24 text-center">
        <span className="text-primary-300 text-sm font-semibold uppercase tracking-wider">About Us</span>
        <h1 className="font-display text-5xl font-bold text-white mt-3 mb-4">Our Story & Mission</h1>
        <p className="text-gray-300 max-w-2xl mx-auto px-4">Dedicated to the art of dance since 2010, nurturing creativity and passion in every student.</p>
      </div>

      {/* Mission & Vision */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12">
          <div className="bg-primary-50 dark:bg-primary-900/20 rounded-2xl p-8">
            <div className="text-4xl mb-4">🎯</div>
            <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">To provide world-class dance education that nurtures talent, builds confidence, and celebrates the rich cultural heritage of dance. We are committed to creating an inclusive environment where every student can thrive.</p>
          </div>
          <div className="bg-accent-50 dark:bg-accent-900/10 rounded-2xl p-8">
            <div className="text-4xl mb-4">🌟</div>
            <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">Our Vision</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">To be the leading dance academy that transforms passionate individuals into accomplished artists, fostering a lifelong love for dance and cultural expression across generations.</p>
          </div>
        </div>
      </section>

      {/* Academy Story */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">The Journey</span>
            <h2 className="section-title mt-2 mb-6">14 Years of <span className="gradient-text">Excellence</span></h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>Rhythm Dance Academy was founded in 2010 by Guru Lakshmi Raghavan with a vision to make quality dance education accessible to all. What started as a small studio with 20 students has grown into a vibrant community of over 500 active learners.</p>
              <p>Over the years, our students have performed on national stages, won prestigious competitions, and carried the torch of dance artistry forward. We're proud to have contributed to preserving classical dance forms while embracing contemporary expressions.</p>
              <p>Today, we offer 10+ dance styles taught by a team of 15 experienced instructors across state-of-the-art facilities designed for optimal learning.</p>
            </div>
            <Link to="/apply" className="btn-primary inline-flex items-center gap-2 mt-8">
              Join Our Academy <FiArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {['2010 — Founded with 20 students', '2015 — Opened 2nd studio', '2018 — National award winners', '2024 — 500+ active students'].map((milestone, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
                <div className="text-2xl mb-2">🏆</div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{milestone}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructors */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title">Meet Our <span className="gradient-text">Lead Instructors</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {instructors.map(({ name, role, exp, image }) => (
              <div key={name} className="card text-center group hover:shadow-xl transition-shadow">
                <div className="relative overflow-hidden">
                  <img src={image} alt={name} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full">{exp} Experience</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white">{name}</h3>
                  <p className="text-primary-600 text-sm mt-1">{role}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/faculty" className="btn-outline inline-flex items-center gap-2">View All Faculty <FiArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
