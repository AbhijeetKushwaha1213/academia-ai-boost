
import React, { useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Bell, Shield, Palette, Save, Loader2 } from 'lucide-react';

export const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    userType: user?.userType || 'exam',
    examType: user?.examType || '',
    college: user?.college || '',
    semester: user?.semester || 1,
  });

  const [preferences, setPreferences] = useState({
    notifications: true,
    studyReminders: true,
    darkMode: false,
    soundEffects: true,
  });

  const handleSaveProfile = async () => {
    if (!user?.user_id) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          name: formData.name,
          email: formData.email,
          user_type: formData.userType,
          exam_type: formData.userType === 'exam' ? formData.examType : null,
          college: formData.userType === 'college' ? formData.college : null,
          semester: formData.userType === 'college' ? formData.semester : null,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.user_id);

      if (error) throw error;

      // Update local user state
      updateUser({
        ...user,
        name: formData.name,
        email: formData.email,
        userType: formData.userType,
        examType: formData.examType,
        college: formData.college,
        semester: formData.semester,
      });

      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      {/* Profile Settings */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <User className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold">Profile Settings</h2>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="userType">User Type</Label>
            <Select value={formData.userType} onValueChange={(value) => setFormData({ ...formData, userType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select user type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exam">Exam Preparation</SelectItem>
                <SelectItem value="college">College Student</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.userType === 'exam' && (
            <div>
              <Label htmlFor="examType">Exam Type</Label>
              <Select value={formData.examType} onValueChange={(value) => setFormData({ ...formData, examType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select exam type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="JEE">JEE (Joint Entrance Examination)</SelectItem>
                  <SelectItem value="NEET">NEET (Medical)</SelectItem>
                  <SelectItem value="CAT">CAT (MBA)</SelectItem>
                  <SelectItem value="GATE">GATE (Engineering)</SelectItem>
                  <SelectItem value="UPSC">UPSC (Civil Services)</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {formData.userType === 'college' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="college">College/University</Label>
                <Input
                  id="college"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  placeholder="Enter your college name"
                />
              </div>
              <div>
                <Label htmlFor="semester">Current Semester</Label>
                <Select value={formData.semester.toString()} onValueChange={(value) => setFormData({ ...formData, semester: parseInt(value) })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <SelectItem key={sem} value={sem.toString()}>Semester {sem}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <Button onClick={handleSaveProfile} disabled={isLoading} className="w-full md:w-auto">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Profile
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Bell className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold">Notifications</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-gray-500">Receive notifications about your study progress</p>
            </div>
            <Switch
              checked={preferences.notifications}
              onCheckedChange={(checked) => setPreferences({ ...preferences, notifications: checked })}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Study Reminders</p>
              <p className="text-sm text-gray-500">Get reminded about your scheduled study sessions</p>
            </div>
            <Switch
              checked={preferences.studyReminders}
              onCheckedChange={(checked) => setPreferences({ ...preferences, studyReminders: checked })}
            />
          </div>
        </div>
      </Card>

      {/* Appearance Settings */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Palette className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold">Appearance</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-gray-500">Switch to dark theme</p>
            </div>
            <Switch
              checked={preferences.darkMode}
              onCheckedChange={(checked) => setPreferences({ ...preferences, darkMode: checked })}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Sound Effects</p>
              <p className="text-sm text-gray-500">Play sounds for achievements and notifications</p>
            </div>
            <Switch
              checked={preferences.soundEffects}
              onCheckedChange={(checked) => setPreferences({ ...preferences, soundEffects: checked })}
            />
          </div>
        </div>
      </Card>

      {/* Privacy Settings */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold">Privacy & Security</h2>
        </div>
        
        <div className="space-y-4">
          <Button variant="outline" className="w-full md:w-auto">
            Change Password
          </Button>
          <Button variant="outline" className="w-full md:w-auto text-red-600 hover:text-red-700">
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  );
};
