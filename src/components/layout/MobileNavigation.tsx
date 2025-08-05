
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Menu, 
  Home, 
  CreditCard, 
  Zap, 
  FileText, 
  Trophy,
  User,
  Settings,
  Bell,
  LogOut,
  X,
  ChevronRight,
  Plug
} from 'lucide-react';

interface MobileNavigationProps {
  user: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleSignOut: () => void;
  isOnline: boolean;
}

const navigationItems = [
  { id: 'home', label: 'Dashboard', icon: Home },
  { id: 'flashcards', label: 'Flashcards', icon: CreditCard },
  { id: 'generate', label: 'AI Generator', icon: Zap },
  { id: 'resources', label: 'Resources', icon: FileText },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
];

const bottomItems = [
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

export const MobileNavigation = ({ 
  user, 
  activeTab, 
  setActiveTab, 
  handleSignOut, 
  isOnline 
}: MobileNavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigation = (tab: string) => {
    setActiveTab(tab);
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        
        <SheetContent side="left" className="w-80 p-0">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">StudyMate AI</h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {user && (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 truncate">{user.name}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {user.userType === 'college' ? 'College' : 'Exam Prep'}
                      </Badge>
                      {!isOnline && (
                        <Badge variant="outline" className="text-xs text-red-600">
                          Offline
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-3 py-2">
                <div className="space-y-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavigation(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-3 text-left rounded-lg transition-colors ${
                          isActive
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-gray-500'}`} />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        {isActive && <ChevronRight className="w-4 h-4 text-indigo-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Separator className="my-4" />

              {/* Bottom Items */}
              <div className="px-3 py-2">
                <div className="space-y-1">
                  {bottomItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavigation(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-3 text-left rounded-lg transition-colors ${
                          isActive
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-gray-500'}`} />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        {isActive && <ChevronRight className="w-4 h-4 text-indigo-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t">
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
