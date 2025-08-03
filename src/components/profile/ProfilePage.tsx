
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '../auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  Mail, 
  Calendar, 
  BookOpen, 
  Target, 
  Trophy,
  Edit2,
  Save,
  X,
  CheckCircle
} from 'lucide-react';
import { AvatarUpload } from './AvatarUpload';
import { FileUploadSection } from './FileUploadSection';


export const ProfilePage = () => {
  const { user, refetch } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedCollege, setEditedCollege] = useState(user?.college || '');
  const [editedExamType, setEditedExamType] = useState(user?.examType || '');

  const handleSaveProfile = async () => {
    if (!user?.user_id) return;

    setIsSaving(true);
    try {
      console.log('ProfilePage: Saving profile updates:', {
        name: editedName,
        college: editedCollege,
        exam_type: editedExamType
      });

      const { error } = await supabase
        .from('user_profiles')
        .update({
          name: editedName,
          college: editedCollege,
          exam_type: editedExamType,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.user_id);

      if (error) {
        console.error('ProfilePage: Error updating profile:', error);
        throw error;
      }

      // Refetch user data to update the UI
      if (refetch) {
        await refetch();
      }

      toast({
        title: "Profile Updated Successfully! ✅",
        description: "Your profile information has been saved.",
      });
      setIsEditing(false);
    } catch (error) {
      console.error('ProfilePage: Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedName(user?.name || '');
    setEditedCollege(user?.college || '');
    setEditedExamType(user?.examType || '');
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your account and study preferences</p>
      </div>

      {/* Avatar Upload Section */}
      <AvatarUpload 
        currentAvatar={user?.avatar}
        userName={user?.name}
        onAvatarUpdate={(url) => {
          // Refetch user data to update the UI after avatar update
          if (refetch) {
            refetch();
          }
        }}
      />

      {/* File Upload Section */}
      <FileUploadSection 
        onFileUpload={(fileUrl) => {
          console.log('ProfilePage: File uploaded:', fileUrl);
        }}
      />

      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
                <p className="text-gray-600">{user?.email}</p>
                <Badge className="mt-2">
                  {user?.userType === 'college' ? 'College Student' : 'Exam Preparation'}
                </Badge>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
                disabled={isSaving}
                className="flex items-center space-x-2"
              >
                <Edit2 className="w-4 h-4" />
                <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
              </Button>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="space-y-4 border-t pt-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Full Name
              </label>
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            {user?.userType === 'college' && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  College/University
                </label>
                <Input
                  value={editedCollege}
                  onChange={(e) => setEditedCollege(e.target.value)}
                  placeholder="Enter your college name"
                />
              </div>
            )}

            {user?.userType === 'exam' && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Exam Type
                </label>
                <Input
                  value={editedExamType}
                  onChange={(e) => setEditedExamType(e.target.value)}
                  placeholder="e.g., JEE, NEET, UPSC"
                />
              </div>
            )}

            <div className="flex space-x-2">
              <Button 
                onClick={handleSaveProfile} 
                disabled={isSaving}
                className="flex items-center space-x-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleCancelEdit} className="flex items-center space-x-2">
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Study Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{user?.study_streak || 0}</div>
          <div className="text-sm text-gray-600">Day Streak</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Target className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{Math.round(user?.total_study_hours || 0)}h</div>
          <div className="text-sm text-gray-600">Study Hours</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Trophy className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{user?.current_level || 1}</div>
          <div className="text-sm text-gray-600">Level</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Calendar className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{user?.experience_points || 0}</div>
          <div className="text-sm text-gray-600">XP Points</div>
        </Card>
      </div>

      {/* Account Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600">Name:</span>
            <span className="font-medium">{user?.name}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600">Email:</span>
            <span className="font-medium">{user?.email}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Target className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600">Study Mode:</span>
            <Badge variant="outline">
              {user?.userType === 'college' ? 'College Student' : 'Exam Preparation'}
            </Badge>
          </div>
          {user?.college && (
            <div className="flex items-center space-x-3">
              <BookOpen className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">College:</span>
              <span className="font-medium">{user.college}</span>
            </div>
          )}
          {user?.examType && (
            <div className="flex items-center space-x-3">
              <Target className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">Exam Type:</span>
              <span className="font-medium">{user.examType}</span>
            </div>
          )}
        </div>
      </Card>

    </div>
  );
};
