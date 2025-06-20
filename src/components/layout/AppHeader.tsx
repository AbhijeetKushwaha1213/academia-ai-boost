
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { NotificationCenter } from '../notifications/NotificationCenter';
import { Menu, X, WifiOff, Wifi } from 'lucide-react';

interface AppHeaderProps {
  user: any;
  isOnline: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onNavigate: (tab: string) => void;
}

export const AppHeader = ({ 
  user, 
  isOnline, 
  sidebarOpen, 
  setSidebarOpen, 
  onNavigate 
}: AppHeaderProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xs">S</span>
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-sm">StudyMate AI</h1>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {!isOnline && <WifiOff className="w-4 h-4 text-red-500" />}
            {isOnline && <Wifi className="w-4 h-4 text-green-500" />}
            
            <NotificationCenter onNavigate={onNavigate} />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('profile')}
              className="p-0 h-auto"
            >
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-xs bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                  {getInitials(user.name || 'U')}
                </AvatarFallback>
              </Avatar>
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {!isOnline && (
                <div className="flex items-center space-x-1 text-red-600 text-sm">
                  <WifiOff className="w-4 h-4" />
                  <span>Offline</span>
                </div>
              )}
              {isOnline && (
                <div className="flex items-center space-x-1 text-green-600 text-sm">
                  <Wifi className="w-4 h-4" />
                  <span>Online</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <NotificationCenter onNavigate={onNavigate} />
          </div>
        </div>
      </div>
    </>
  );
};
