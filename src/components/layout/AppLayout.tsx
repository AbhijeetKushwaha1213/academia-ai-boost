import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import OnboardingFlow from '../onboarding/OnboardingFlow';
import ChatInterface from '../chat/ChatInterface';
import ProfileUpload from '../profile/ProfileUpload';
import { supabase } from '../../lib/supabase';

const AppLayout: React.FC = () => {
  const { user, profile, loading } = useAuth();

  console.log('AppLayout render - User:', user?.email, 'Profile:', profile, 'Loading:', loading);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to StudyMate AI</h1>
          <p className="text-gray-600 mb-6">Your intelligent study companion</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  // Show onboarding if user hasn't completed it or profile is missing
  if (!profile || !profile.onboarding_completed) {
    console.log('Showing onboarding - Profile missing or incomplete:', { profile });
    return <OnboardingFlow />;
  }

  // Main app layout with navigation
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold text-gray-900">StudyMate AI</h1>
              <div className="hidden md:flex items-center gap-6">
                <button
                  onClick={() => window.location.href = '/chat'}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  AI Chat
                </button>
                <button
                  onClick={() => window.location.href = '/profile'}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Profile
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Welcome, {profile?.full_name || user.email}
              </div>
              {profile?.avatar_url && (
                <img
                  src={profile.avatar_url}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <button
                onClick={async () => {
                  try {
                    await supabase.auth.signOut();
                    window.location.href = '/';
                  } catch (error) {
                    console.error('Sign out error:', error);
                  }
                }}
                className="text-gray-700 hover:text-red-600 font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Route to different components based on URL */}
        {window.location.pathname === '/chat' && <ChatInterface />}
        {window.location.pathname === '/profile' && <ProfileUpload />}
        
        {/* Default dashboard */}
        {window.location.pathname === '/' && (
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to StudyMate AI! 🎓
            </h2>
            <p className="text-gray-600 mb-8">
              {profile?.mode === 'college' 
                ? `${profile.college_name} - Semester ${profile.semester}`
                : `Preparing for ${profile.target_exam} - ${profile.attempt_year}`
              }
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => window.location.href = '/chat'}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                🤖 Start AI Chat
              </button>
              <button
                onClick={() => window.location.href = '/profile'}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                👤 Manage Profile
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AppLayout;
