import React from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiCheck, FiArrowRight } from 'react-icons/fi';

const danceStyles = [
  { name: 'Bharatanatyam', desc: 'Ancient classical Indian dance with intricate footwork and expressions.', icon: '💃', color: 'from-orange-400 to-red-500' },
  { name: 'Hip Hop', desc: 'Urban street dance culture with freestyle and breakdancing elements.', icon: '🎤', color: 'from-blue-400 to-purple-500' },
  { name: 'Contemporary', desc: 'Expressive modern dance blending multiple techniques and emotions.', icon: '🌊', color: 'from-teal-400 to-cyan-500' },
  { name: 'Western Dance', desc: 'Energetic styles including jazz, ballet, and ballroom dancing.', icon: '✨', color: 'from-pink-400 to-rose-500' },
  { name: 'Folk Dance', desc: 'Traditional regional dance forms celebrating cultural heritage.', icon: '🌺', color: 'from-yellow-400 to-orange-500' },
  { name: 'Kids Dance', desc: 'Fun-filled dance programs specially designed for children aged 4–12.', icon: '🌟', color: 'from-green-400 to-emerald-500' },
];

const testimonials = [
  { name: 'Priya Sharma', course: 'Bharatanatyam', text: 'This academy transformed my daughter\'s passion into a beautiful art form. The teachers are incredibly patient and skilled.', rating: 5, image: 'https://i.pravatar.cc/100?img=1' },
  { name: 'Arjun Mehta', course: 'Hip Hop', text: 'Best dance school in the city! The instructors really know how to bring out the energy in you. Highly recommend!', rating: 5, image: 'https://i.pravatar.cc/100?img=3' },
  { name: 'Kavya Reddy', course: 'Contemporary', text: 'Joined 6 months ago and I\'ve grown so much. The environment is encouraging and the curriculum is well-structured.', rating: 5, image: 'https://i.pravatar.cc/100?img=5' },
];

export function AboutSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=350&h=450&fit=crop" alt="Dance" className="rounded-2xl object-cover w-full h-64 mt-8" />
            <img src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=350&h=300&fit=crop" alt="Dance" className="rounded-2xl object-cover w-full h-48" />
            <img src="https://images.unsplash.com/photo-1547153760-18fc86324498?w=350&h=250&fit=crop" alt="Dance" className="rounded-2xl object-cover w-full h-48 -mt-6" />
            <img src="https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=350&h=300&fit=crop" alt="Dance" className="rounded-2xl object-cover w-full h-48 mt-4" />
          </div>
          <div className="absolute -bottom-6 -right-6 bg-primary-600 text-white rounded-2xl p-6 shadow-xl">
            <div className="text-4xl font-bold">14+</div>
            <div className="text-sm mt-1 text-primary-100">Years of Excellence</div>
          </div>
        </div>

        <div>
          <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Our Story</span>
          <h2 className="section-title mt-2 mb-6">Where Passion Meets<br /><span className="gradient-text">Perfection</span></h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
            Founded in 2010, Rhythm Dance Academy has been a beacon of artistic excellence, nurturing thousands of dancers across all age groups and skill levels.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
            Our holistic approach blends traditional wisdom with contemporary techniques, creating well-rounded dancers who excel on any stage.
          </p>
          <div className="space-y-3 mb-8">
            {['Expert certified instructors with 10+ years experience', 'State-of-the-art dance studios with professional flooring', 'Flexible timing for students of all ages', 'Regular performances and competitions'].map(item => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                  <FiCheck size={12} className="text-primary-600" />
                </div>
                <span className="text-gray-700 dark:text-gray-300 text-sm">{item}</span>
              </div>
            ))}
          </div>
          <Link to="/about" className="btn-primary inline-flex items-center gap-2">
            Learn More About Us <FiArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function WhyChooseUs() {
  const features = [
    { icon: '🏆', title: 'Award-Winning Academy', desc: 'Recognized nationally for excellence in dance education and student performance.' },
    { icon: '👨‍🏫', title: 'Expert Instructors', desc: 'Learn from certified professionals with decades of performance and teaching experience.' },
    { icon: '🎯', title: 'Personalized Approach', desc: 'Customized learning plans tailored to each student\'s goals, pace, and style.' },
    { icon: '🌟', title: 'Performance Opportunities', desc: 'Regular showcases, competitions, and events to build confidence and stage presence.' },
    { icon: '🏫', title: 'World-Class Facilities', desc: 'Fully equipped studios with sprung floors, mirrors, and professional sound systems.' },
    { icon: '💝', title: 'Inclusive Community', desc: 'A supportive, welcoming environment for dancers of all backgrounds and abilities.' },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
          <h2 className="section-title mt-2">The <span className="gradient-text">Rhythm Difference</span></h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">Discover what makes Rhythm Dance Academy the preferred choice for aspiring dancers.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map(({ icon, title, desc }) => (
            <div key={title} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group">
              <div className="text-4xl mb-4">{icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors">{title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DanceStylesSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">What We Offer</span>
          <h2 className="section-title mt-2">Dance <span className="gradient-text">Styles</span></h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">From classical traditions to modern street styles, explore our diverse range of dance programs.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {danceStyles.map(({ name, desc, icon, color }) => (
            <Link key={name} to="/classes" className="group relative overflow-hidden rounded-2xl bg-gray-50 dark:bg-gray-800 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color} opacity-10 rounded-bl-full`} />
              <div className={`inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br ${color} items-center justify-center text-2xl mb-4`}>
                {icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors">{name}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
              <div className="mt-4 text-primary-600 text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Explore <FiArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/classes" className="btn-outline inline-flex items-center gap-2">
            View All Classes <FiArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
          <h2 className="section-title mt-2">What Our <span className="gradient-text">Students Say</span></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map(({ name, course, text, rating, image }) => (
            <div key={name} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: rating }).map((_, i) => <FiStar key={i} className="text-gold-400 fill-current" size={16} />)}
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 italic">"{text}"</p>
              <div className="flex items-center gap-3">
                <img src={image} alt={name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{name}</p>
                  <p className="text-primary-600 text-xs">{course} Student</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function GallerySection() {
  const images = [
    'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1547153760-18fc86324498?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1537484987248-69b3312bb720?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Gallery</span>
          <h2 className="section-title mt-2">Moments of <span className="gradient-text">Magic</span></h2>
        </div>
        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {images.map((src, i) => (
            <div key={i} className="break-inside-avoid rounded-2xl overflow-hidden hover:opacity-90 transition-opacity cursor-pointer">
              <img src={src} alt={`Gallery ${i + 1}`} className="w-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white 0%, transparent 50%)' }} />
      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Start Your Dance Journey?
        </h2>
        <p className="text-primary-100 text-lg mb-10 max-w-2xl mx-auto">
          Join hundreds of students who have discovered their passion for dance at Rhythm Dance Academy. Classes available for all ages and skill levels.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/apply" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-all inline-flex items-center gap-2">
            Apply Now <FiArrowRight size={18} />
          </Link>
          <Link to="/contact" className="border-2 border-white text-white hover:bg-white/10 font-semibold py-3 px-8 rounded-lg transition-all">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
