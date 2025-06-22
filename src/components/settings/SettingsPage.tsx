
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '../auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Github,
  Linkedin,
  Code,
  ExternalLink,
  Trash2,
  Save,
  LogOut
} from 'lucide-react';

export const SettingsPage = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSync, setAutoSync] = useState(true);

  const handleUserTypeChange = async (newUserType: 'college' | 'exam') => {
    if (!user?.user_id) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          user_type: newUserType,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.user_id);

      if (error) throw error;

      toast({
        title: "User Type Updated",
        description: `Switched to ${newUserType === 'college' ? 'College' : 'Exam Preparation'} mode.`,
      });
    } catch (error) {
      console.error('Error updating user type:', error);
      toast({
        title: "Error",
        description: "Failed to update user type. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!newPassword || newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleIntegrationConnect = async (platform: string) => {
    setIsLoading(true);
    try {
      // Simulate integration connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: `${platform} Connected`,
        description: `Successfully connected your ${platform} account.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to connect ${platform}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user?.user_id) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );

    if (!confirmed) return;

    setIsLoading(true);
    try {
      // Delete user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('user_id', user.user_id);

      if (profileError) throw profileError;

      // Sign out user
      await signOut();

      toast({
        title: "Account Deleted",
        description: "Your account has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account and app preferences</p>
      </div>

      {/* Account Settings */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <User className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold">Account Settings</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Study Mode
            </label>
            <Select 
              value={user?.userType || 'exam'} 
              onValueChange={(value: 'college' | 'exam') => handleUserTypeChange(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="college">College Student</SelectItem>
                <SelectItem value="exam">Exam Preparation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-semibold">Security</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              New Password
            </label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Confirm Password
            </label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>
          
          <Button 
            onClick={handlePasswordChange} 
            disabled={isLoading || !newPassword || !confirmPassword}
            className="flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Update Password</span>
          </Button>
        </div>
      </Card>

      {/* App Preferences */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Palette className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-semibold">App Preferences</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">Push Notifications</span>
              <p className="text-sm text-gray-600">Receive study reminders and updates</p>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">Dark Mode</span>
              <p className="text-sm text-gray-600">Toggle dark/light theme</p>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">Auto Sync</span>
              <p className="text-sm text-gray-600">Automatically sync data across devices</p>
            </div>
            <Switch checked={autoSync} onCheckedChange={setAutoSync} />
          </div>
        </div>
      </Card>

      {/* Integrations */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Code className="w-5 h-5 text-orange-600" />
          <h2 className="text-lg font-semibold">Integrations</h2>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Github className="w-5 h-5 text-gray-800" />
              <div>
                <span className="font-medium">GitHub</span>
                <p className="text-sm text-gray-600">Connect your coding projects</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleIntegrationConnect('GitHub')}
              disabled={isLoading}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Connect
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Linkedin className="w-5 h-5 text-blue-600" />
              <div>
                <span className="font-medium">LinkedIn</span>
                <p className="text-sm text-gray-600">Showcase your achievements</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleIntegrationConnect('LinkedIn')}
              disabled={isLoading}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Connect
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Code className="w-5 h-5 text-green-600" />
              <div>
                <span className="font-medium">LeetCode</span>
                <p className="text-sm text-gray-600">Track coding progress</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleIntegrationConnect('LeetCode')}
              disabled={isLoading}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Connect
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Code className="w-5 h-5 text-purple-600" />
              <div>
                <span className="font-medium">HackerRank</span>
                <p className="text-sm text-gray-600">Sync coding challenges</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleIntegrationConnect('HackerRank')}
              disabled={isLoading}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Connect
            </Button>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-red-200">
        <div className="flex items-center space-x-2 mb-4">
          <Trash2 className="w-5 h-5 text-red-600" />
          <h2 className="text-lg font-semibold text-red-600">Danger Zone</h2>
        </div>
        
        <div className="space-y-3">
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            className="w-full justify-center flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </Button>
          
          <Button 
            variant="destructive" 
            onClick={handleDeleteAccount}
            disabled={isLoading}
            className="w-full justify-center flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Account</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};
