
import React from 'react';
import { Home, BookOpen, Bot, Calendar, Trophy, Settings, Wand2, TrendingUp } from 'lucide-react';

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MobileNavigation = ({ activeTab, onTabChange }: MobileNavigationProps) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'flashcards', label: 'Cards', icon: BookOpen },
    { id: 'ai-chat', label: 'AI Chat', icon: Bot },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
  ];

  const secondaryTabs = [
    { id: 'ai-generator', label: 'Generate', icon: Wand2 },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Show overflow menu for secondary tabs
  const [showMore, setShowMore] = React.useState(false);

  return (
    <div className="lg:hidden">
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'text-indigo-600 bg-indigo-50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs mt-1 font-medium">{tab.label}</span>
              </button>
            );
          })}
          
          {/* More button */}
          <button
            onClick={() => setShowMore(!showMore)}
            className="flex flex-col items-center justify-center p-2 rounded-lg transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-0.5">
                <div className="w-1 h-1 bg-current rounded-full"></div>
                <div className="w-1 h-1 bg-current rounded-full"></div>
                <div className="w-1 h-1 bg-current rounded-full"></div>
                <div className="w-1 h-1 bg-current rounded-full"></div>
              </div>
            </div>
            <span className="text-xs mt-1 font-medium">More</span>
          </button>
        </div>
      </div>

      {/* More menu overlay */}
      {showMore && (
        <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowMore(false)}>
          <div className="absolute bottom-16 left-4 right-4 bg-white rounded-lg border shadow-lg p-4">
            <div className="grid grid-cols-3 gap-4">
              {secondaryTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onTabChange(tab.id);
                      setShowMore(false);
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'text-indigo-600 bg-indigo-50' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-6 h-6 mb-1" />
                    <span className="text-xs font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
