
import React from 'react';
import OnboardingFlow from '../onboarding/OnboardingFlow';
import ChatInterface from '../chat/ChatInterface';
import ProfileUpload from '../profile/ProfileUpload';
import { supabase } from '../../lib/supabase';
import { UserProfile } from '../../types/user';

interface AppLayoutProps {
  user: UserProfile;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleSignOut: () => Promise<void>;
  isOnline: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  user, 
  activeTab, 
  setActiveTab, 
  handleSignOut, 
  isOnline 
}) => {
  console.log('AppLayout render - User:', user?.email, 'ActiveTab:', activeTab);

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
                  onClick={() => setActiveTab('chat')}
                  className={`font-medium transition-colors ${
                    activeTab === 'chat' 
                      ? 'text-blue-600' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  AI Chat
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`font-medium transition-colors ${
                    activeTab === 'profile' 
                      ? 'text-blue-600' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('home')}
                  className={`font-medium transition-colors ${
                    activeTab === 'home' 
                      ? 'text-blue-600' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Dashboard
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Welcome, {user?.full_name || user?.email}
              </div>
              {user?.avatar_url && (
                <img
                  src={user.avatar_url}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              {!isOnline && (
                <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                  Offline
                </span>
              )}
              <button
                onClick={handleSignOut}
                className="text-gray-700 hover:text-red-600 font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Route to different components based on activeTab */}
        {activeTab === 'chat' && <ChatInterface />}
        {activeTab === 'profile' && <ProfileUpload />}
        
        {/* Default dashboard */}
        {activeTab === 'home' && (
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to StudyMate AI! 🎓
            </h2>
            <p className="text-gray-600 mb-8">
              {user?.mode === 'college' 
                ? `${user.college_name} - Semester ${user.semester}`
                : `Preparing for ${user.target_exam} - ${user.attempt_year}`
              }
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setActiveTab('chat')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                🤖 Start AI Chat
              </button>
              <button
                onClick={() => setActiveTab('profile')}
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
