
import React from 'react';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { TrustSection } from '../components/landing/TrustSection';
import { Footer } from '../components/landing/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Hero />
      <Features />
      <TrustSection />
      <Footer />
    </div>
  );
};

export default Index;
