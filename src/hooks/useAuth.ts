
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '../types/user';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for:', userId);
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (data) {
        // Map database fields to UserProfile interface
        const userProfile: UserProfile = {
          id: data.id,
          user_id: data.user_id,
          name: data.name,
          email: data.email,
          user_type: data.user_type === 'college' ? 'college' : 'exam',
          exam_type: data.exam_type || undefined,
          college: data.college || undefined,
          branch: data.branch || undefined,
          semester: data.semester || undefined,
          exam_date: data.exam_date || undefined,
          study_streak: data.study_streak || 0,
          total_study_hours: data.total_study_hours || 0,
          current_level: data.current_level || 1,
          experience_points: data.experience_points || 0,
          avatar: data.avatar || undefined,
          created_at: data.created_at,
          updated_at: data.updated_at
        };
        
        console.log('User profile data:', userProfile);
        setProfile(userProfile);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      throw new Error('No authenticated user');
    }

    try {
      console.log('Updating profile with:', updates);
      
      // Prepare data for database - ensure user_type is string and required fields are present
      const updateData = {
        user_id: user.id,
        email: user.email!,
        name: updates.name || profile?.name || user.email!.split('@')[0],
        user_type: updates.user_type || profile?.user_type || 'exam',
        ...updates,
        updated_at: new Date().toISOString()
      };

      // Remove undefined values and id field
      const cleanedData = Object.fromEntries(
        Object.entries(updateData).filter(([key, value]) => key !== 'id' && value !== undefined)
      );

      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(cleanedData)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      console.log('Profile updated successfully:', data);
      await fetchUserProfile(user.id); // Refetch to get updated data
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return {
    user: profile, // Return the profile as user for backward compatibility
    profile,
    loading,
    updateProfile,
    signOut,
    refreshProfile: () => user && fetchUserProfile(user.id)
  };
};
