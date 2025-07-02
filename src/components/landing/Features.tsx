
import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  Brain, 
  BookOpen, 
  Target, 
  Zap, 
  BarChart3, 
  MessageSquare,
  FileText,
  Trophy
} from 'lucide-react';

export const Features = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Flashcards',
      description: 'Generate smart flashcards from any content using advanced AI technology.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: MessageSquare,
      title: 'AI Study Assistant',
      description: 'Get instant help with explanations, concepts, and problem-solving.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Target,
      title: 'Personalized Study Plans',
      description: 'Customized learning paths based on your goals and progress.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: BarChart3,
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with detailed analytics and insights.',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: Zap,
      title: 'Quick Review Sessions',
      description: 'Efficient spaced repetition system for optimal retention.',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: FileText,
      title: 'Study Materials',
      description: 'Organize and manage all your study resources in one place.',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Trophy,
      title: 'Achievement System',
      description: 'Stay motivated with gamified learning and progress rewards.',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      icon: BookOpen,
      title: 'Resource Library',
      description: 'Access curated study materials and educational content.',
      gradient: 'from-teal-500 to-cyan-500'
    }
  ];

  return (
    <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need to 
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Excel</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful AI-driven tools designed to make studying more effective, engaging, and personalized to your learning style.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/70 backdrop-blur-sm group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center bg-gradient-to-r from-indigo-100 to-purple-100 px-6 py-3 rounded-full">
            <Zap className="w-5 h-5 text-indigo-600 mr-2" />
            <span className="text-indigo-800 font-medium">Start your learning journey today</span>
          </div>
        </div>
      </div>
    </section>
  );
};
