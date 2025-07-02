
import React from 'react';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { Dashboard } from '../components/Dashboard';
import { StudyProgress } from '../components/StudyProgress';
import { AIAssistant } from '../components/AIAssistant';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-background">
      <Hero />
      <Features />
      <Dashboard />
      <StudyProgress />
      <AIAssistant />
    </div>
  );
};

export default Index;
