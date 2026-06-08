import React from 'react';
import Hero from '../../components/home/Hero';
import { AboutSection, WhyChooseUs, DanceStylesSection, TestimonialsSection, GallerySection, CTASection } from '../../components/home/HomeSections';

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <WhyChooseUs />
      <DanceStylesSection />
      <TestimonialsSection />
      <GallerySection />
      <CTASection />
    </>
  );
}
