
import React from 'react';
import { useAuth } from '../auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  BookOpen, 
  Bot, 
  TrendingUp, 
  Wand2, 
  Trophy, 
  FolderOpen,
  Settings,
  User,
  LogOut,
  Plug
} from 'lucide-react';

interface DesktopSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSignOut: () => void;
}

export const DesktopSidebar = ({ activeTab, onTabChange, onSignOut }: DesktopSidebarProps) => {
  const { user } = useAuth();

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const mainNavItems = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'flashcards', label: 'Flashcards', icon: BookOpen },
    { id: 'ai', label: 'AI Chat', icon: Bot },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'resources', label: 'Resources', icon: FolderOpen },
  ];

  const secondaryNavItems = [
    { id: 'generate', label: 'AI Generator', icon: Wand2 },
    { id: 'integrations', label: 'Integrations', icon: Plug },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="h-full flex flex-col bg-background border-r border-border sticky top-0">
      {/* Header */}
      <div className="flex items-center h-16 px-6 border-b border-border flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">S</span>
          </div>
          <div>
            <h1 className="font-bold text-foreground text-sm">StudyMate AI</h1>
            <p className="text-xs text-muted-foreground">
              {user.userType === 'exam' ? 'Exam Prep' : 'College'}
            </p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-border flex-shrink-0">
        <div className="flex items-center space-x-3 mb-3">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="text-sm font-medium bg-primary text-primary-foreground">
              {getInitials(user.name || 'U')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1">
            <Badge variant="secondary" className="text-xs">
              Level {user.current_level || 1}
            </Badge>
            <span className="text-muted-foreground">{user.experience_points || 0} XP</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onTabChange('profile')}
            className="h-6 px-2 text-xs"
          >
            <User className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Navigation - Scrollable */}
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start h-9 px-3 transition-all duration-200 ${
                  isActive ? 'bg-accent text-accent-foreground' : 'text-foreground hover:bg-accent/50'
                }`}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="w-4 h-4 mr-3 flex-shrink-0" />
                <span className="text-sm truncate">{item.label}</span>
              </Button>
            );
          })}
        </div>

        <div className="pt-4 border-t border-border">
          <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Tools
          </p>
          <div className="space-y-1">
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start h-9 px-3 transition-all duration-200 ${
                    isActive ? 'bg-accent text-accent-foreground' : 'text-foreground hover:bg-accent/50'
                  }`}
                  onClick={() => onTabChange(item.id)}
                >
                  <Icon className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span className="text-sm truncate">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border flex-shrink-0">
        <Button
          variant="ghost"
          className="w-full justify-start h-9 px-3 text-foreground hover:bg-accent/50 transition-all duration-200"
          onClick={onSignOut}
        >
          <LogOut className="w-4 h-4 mr-3 flex-shrink-0" />
          <span className="text-sm truncate">Sign Out</span>
        </Button>
      </div>
    </div>
  );
};
