
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { IntegrationsSettings } from './IntegrationsSettings';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Settings as SettingsIcon,
  Link,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';

export const SettingsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    studyReminders: true,
    achievements: true
  });
  const [theme, setTheme] = useState('system');

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile changes have been saved successfully.",
    });
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Notification Settings Updated",
      description: `${key} notifications ${value ? 'enabled' : 'disabled'}.`,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account preferences and integrations</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Link className="w-4 h-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Privacy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="text-lg">
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button variant="outline" size="sm">
                  Change Photo
                </Button>
                <p className="text-sm text-gray-500 mt-1">JPG, GIF or PNG. 1MB max.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={user?.name || ''} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue={user?.email || ''} />
              </div>
              <div>
                <Label htmlFor="userType">User Type</Label>
                <div className="mt-2">
                  <Badge variant="outline">
                    {user?.userType === 'exam' ? 'Exam Preparation' : 'College Student'}
                  </Badge>
                </div>
              </div>
              <div>
                <Label htmlFor="level">Current Level</Label>
                <div className="mt-2">
                  <Badge className="bg-indigo-100 text-indigo-800">
                    Level {user?.current_level || 1}
                  </Badge>
                </div>
              </div>
            </div>
            
            <Button onClick={handleSaveProfile} className="mt-6">
              Save Changes
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive updates via email</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notifications.email}
                  onCheckedChange={(value) => handleNotificationChange('email', value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-gray-500">Receive browser notifications</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={notifications.push}
                  onCheckedChange={(value) => handleNotificationChange('push', value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="study-reminders">Study Reminders</Label>
                  <p className="text-sm text-gray-500">Get reminded about study sessions</p>
                </div>
                <Switch
                  id="study-reminders"
                  checked={notifications.studyReminders}
                  onCheckedChange={(value) => handleNotificationChange('studyReminders', value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="achievements">Achievement Notifications</Label>
                  <p className="text-sm text-gray-500">Celebrate your progress milestones</p>
                </div>
                <Switch
                  id="achievements"
                  checked={notifications.achievements}
                  onCheckedChange={(value) => handleNotificationChange('achievements', value)}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <IntegrationsSettings />
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Theme Preferences</h3>
            <div className="space-y-4">
              <Label>Choose your preferred theme</Label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'light', label: 'Light', icon: Sun },
                  { id: 'dark', label: 'Dark', icon: Moon },
                  { id: 'system', label: 'System', icon: Monitor }
                ].map((themeOption) => {
                  const Icon = themeOption.icon;
                  return (
                    <Button
                      key={themeOption.id}
                      variant={theme === themeOption.id ? 'default' : 'outline'}
                      className="flex flex-col items-center gap-2 h-20"
                      onClick={() => setTheme(themeOption.id)}
                    >
                      <Icon className="w-5 h-5" />
                      {themeOption.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Privacy & Security</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Profile Visibility</Label>
                  <p className="text-sm text-gray-500">Make your profile visible to other users</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Study Analytics</Label>
                  <p className="text-sm text-gray-500">Allow anonymous usage analytics</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="pt-4 border-t">
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  Permanently delete your account and all associated data
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
