
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { UserProfile } from '@/types/user';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserType: (type: 'exam' | 'college', details: any) => Promise<void>;
  updateUser: (updatedUser: UserProfile) => void;
  refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', supabaseUser.id)
        .single();

      if (error) {
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
        
        setUser(userProfile);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const refetch = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await fetchUserProfile(session.user);
    }
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchUserProfile(session.user);
      }
      setIsLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (session?.user) {
        await fetchUserProfile(session.user);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      toast({
        title: "Account Created!",
        description: "Please check your email to verify your account.",
      });
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Sign Out Failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      setUser(null);
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const updateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
  };

  const updateUserType = async (type: 'exam' | 'college', details: any) => {
    if (!user) return;

    try {
      const updateData: any = {
        user_type: type,
        name: details.name || user.name,
      };

      if (type === 'exam') {
        if (details.examType) updateData.exam_type = details.examType;
        if (details.examDate) updateData.exam_date = details.examDate;
        if (details.targetYear) updateData.target_year = details.targetYear;
      } else if (type === 'college') {
        if (details.college) updateData.college = details.college;
        if (details.course) updateData.branch = details.course;
        if (details.semester) updateData.semester = details.semester;
      }

      // Store additional onboarding data as JSON
      if (details.subjects) updateData.subjects = details.subjects;
      if (details.studyPreference) updateData.study_preference = details.studyPreference;
      if (details.motivation) updateData.motivation = details.motivation;
      if (details.dailyHours) updateData.daily_hours = details.dailyHours;
      if (details.reviewModes) updateData.review_modes = details.reviewModes;

      const { error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('user_id', user.user_id);

      if (error) {
        toast({
          title: "Update Failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      // Update local state
      setUser({
        ...user,
        name: details.name || user.name,
        user_type: type,
        exam_type: details.examType,
        college: details.college,
        branch: details.course,
        semester: details.semester,
        exam_date: details.examDate,
      });

      toast({
        title: "Profile Updated",
        description: "Your study preferences have been saved.",
      });
    } catch (error) {
      console.error('Update user type error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      signIn,
      signUp,
      signOut,
      updateUserType,
      updateUser,
      refetch
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
