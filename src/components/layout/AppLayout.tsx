import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import OnboardingFlow from '../onboarding/OnboardingFlow';
import ChatInterface from '../chat/ChatInterface';
import ProfileUpload from '../profile/ProfileUpload';

const AppLayout: React.FC = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Study Assistant</h1>
          <p className="text-gray-600 mb-6">Please sign in to continue</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // Show onboarding if user hasn't completed it
  if (!profile?.onboarding_completed) {
    return <OnboardingFlow />;
  }

  // Main app layout with navigation
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold text-gray-900">Study Assistant</h1>
              <div className="flex items-center gap-6">
                <button
                  onClick={() => window.location.href = '/chat'}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Chat
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
                onClick={() => window.location.href = '/logout'}
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
              Welcome to your Study Assistant
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
                Start Chatting
              </button>
              <button
                onClick={() => window.location.href = '/profile'}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Manage Profile
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AppLayout;