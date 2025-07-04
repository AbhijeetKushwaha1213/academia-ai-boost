
import React from 'react';
import { Home, BookOpen, Bot, Wand2, Trophy, FolderOpen } from 'lucide-react';

interface MobileNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileNavigation = ({ activeTab, setActiveTab }: MobileNavigationProps) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'flashcards', icon: BookOpen, label: 'Cards' },
    { id: 'ai', icon: Bot, label: 'AI' },
    { id: 'generate', icon: Wand2, label: 'Generate' },
    { id: 'achievements', icon: Trophy, label: 'Achieve' },
    { id: 'resources', icon: FolderOpen, label: 'Resources' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 md:hidden z-50 safe-area-pb">
      <div className="grid grid-cols-6 gap-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
              activeTab === item.id
                ? 'text-indigo-600 bg-indigo-50 scale-105'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <item.icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
