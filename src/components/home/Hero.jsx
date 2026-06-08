import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiPlay } from 'react-icons/fi';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900" />
      <div className="absolute inset-0 opacity-20"
        style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #d946ef 0%, transparent 50%), radial-gradient(circle at 80% 20%, #f97316 0%, transparent 50%)' }} />

      {/* Animated shapes */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-32 grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-center lg:text-left animate-fade-in">
          <span className="inline-block bg-primary-500/20 text-primary-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-primary-500/30">
            ✨ Premier Dance Academy Since 2010
          </span>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Where Every{' '}
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              Step
            </span>{' '}
            Tells a Story
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
            Join Rhythm Dance Academy and discover the art of movement. From classical traditions to modern expressions, find your rhythm with expert instructors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link to="/apply" className="btn-primary flex items-center justify-center gap-2 text-base py-3 px-8">
              Enroll Now <FiArrowRight size={18} />
            </Link>
            <Link to="/classes" className="flex items-center justify-center gap-2 text-white border-2 border-white/30 hover:border-white/60 py-3 px-8 rounded-lg font-semibold transition-all">
              <FiPlay size={18} /> Explore Classes
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-sm mx-auto lg:mx-0">
            {[['500+', 'Students'], ['15+', 'Instructors'], ['10+', 'Dance Styles']].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold text-white">{num}</div>
                <div className="text-gray-400 text-xs mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Image grid */}
        <div className="hidden lg:grid grid-cols-2 gap-4 animate-slide-up">
          {[
            'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=400&h=500&fit=crop',
            'https://images.unsplash.com/photo-1547153760-18fc86324498?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=400&h=500&fit=crop',
          ].map((src, i) => (
            <div key={i} className={`rounded-2xl overflow-hidden ${i === 0 || i === 3 ? 'row-span-1' : ''} ${i % 2 === 0 ? 'mt-8' : ''}`}>
              <img src={src} alt="Dance" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" style={{ height: i === 0 || i === 3 ? '280px' : '200px' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-gray-400 text-xs">Scroll to explore</span>
        <div className="w-5 h-8 rounded-full border-2 border-gray-400 flex items-start justify-center pt-1">
          <div className="w-1 h-2 bg-gray-400 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
