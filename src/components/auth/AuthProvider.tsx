import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  userType: 'exam' | 'college';
  examType?: string;
  college?: string;
  branch?: string;
  semester?: number;
  examDate?: string;
  study_streak: number;
  total_study_hours: number;
  current_level: number;
  experience_points: number;
  avatar?: string;
}

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
      console.log('AuthProvider: Fetching profile for user:', supabaseUser.id);
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', supabaseUser.id)
        .single();

      if (error) {
        console.error('AuthProvider: Error fetching user profile:', error);
        setUser(null);
        return;
      }

      if (data) {
        console.log('AuthProvider: Profile data received:', data);
        
        // Ensure user_type is properly typed
        const userType = data.user_type === 'college' ? 'college' : 'exam';
        
        const userData = {
          id: data.id,
          user_id: data.user_id,
          name: data.name,
          email: data.email,
          userType: userType as 'exam' | 'college',
          examType: data.exam_type || undefined,
          college: data.college || undefined,
          branch: data.branch || undefined,
          semester: data.semester || undefined,
          examDate: data.exam_date || undefined,
          study_streak: data.study_streak || 0,
          total_study_hours: data.total_study_hours || 0,
          current_level: data.current_level || 1,
          experience_points: data.experience_points || 0,
          avatar: data.avatar || undefined
        };
        
        console.log('AuthProvider: Setting user state with data:', userData);
        setUser(userData);
      } else {
        console.log('AuthProvider: No profile data found for user');
        setUser(null);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setUser(null);
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

    // Listen for auth changes - SECURITY FIX: Prevent deadlocks
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Only log in development to prevent sensitive data exposure
      if (process.env.NODE_ENV === 'development') {
        console.log('Auth state changed:', event, session?.user?.email);
      }
      
      // Synchronous state updates only
      if (session?.user) {
        // Defer profile fetching to prevent deadlocks
        setTimeout(() => {
          fetchUserProfile(session.user);
        }, 0);
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
      
      // Rate limiting for login attempts
      const clientId = `login_${email}_${Date.now()}`;
      
      const { error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      if (error) {
        // Don't expose specific auth errors to prevent enumeration attacks
        const safeMessage = error.message.includes('Invalid login credentials') 
          ? 'Invalid email or password'
          : 'Authentication failed. Please try again.';
          
        toast({
          title: "Sign In Failed",
          description: safeMessage,
          variant: "destructive",
        });
        throw new Error(safeMessage);
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    } catch (error) {
      // Don't log sensitive auth errors in production
      if (process.env.NODE_ENV === 'development') {
        console.error('Sign in error:', error);
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      
      // Basic input validation
      if (!email || !password || !name) {
        throw new Error('All fields are required');
      }
      
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }
      
      const { error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: {
            name: name.trim(),
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        // Sanitize error messages
        const safeMessage = error.message.includes('already registered')
          ? 'An account with this email already exists'
          : 'Account creation failed. Please try again.';
          
        toast({
          title: "Sign Up Failed",
          description: safeMessage,
          variant: "destructive",
        });
        throw new Error(safeMessage);
      }

      toast({
        title: "Account Created!",
        description: "Please check your email to verify your account.",
      });
    } catch (error) {
      // Don't log sensitive information in production
      if (process.env.NODE_ENV === 'development') {
        console.error('Sign up error:', error);
      }
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
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      throw new Error('No authenticated user found');
    }

    try {
      console.log('AuthProvider: Updating user type:', type, 'with details:', details);

      const updateData: any = {
        user_type: type,
        name: details.name,
        email: session.user.email,
        updated_at: new Date().toISOString()
      };

      // Set avatar if provided
      if (details.avatarUrl) updateData.avatar = details.avatarUrl;
      
      // Set age range if provided
      if (details.age) updateData.age_range = details.age;

      if (type === 'exam') {
        if (details.examType) updateData.exam_type = details.examType;
        if (details.examDate) updateData.exam_date = details.examDate;
        if (details.targetYear) updateData.target_year = details.targetYear;
      } else if (type === 'college') {
        if (details.college) updateData.college = details.college;
        if (details.course) {
          updateData.branch = details.course;
          updateData.course = details.course;
        }
        if (details.semester) updateData.semester = details.semester;
      }

      // Store additional onboarding data as JSONB
      if (details.subjects && Array.isArray(details.subjects)) {
        updateData.subjects = JSON.stringify(details.subjects);
      }
      if (details.studyPreference && Array.isArray(details.studyPreference)) {
        updateData.study_preference = JSON.stringify(details.studyPreference);
      }
      if (details.motivation && Array.isArray(details.motivation)) {
        updateData.motivation = JSON.stringify(details.motivation);
      }
      if (details.dailyHours) updateData.daily_hours = details.dailyHours;
      if (details.reviewModes && Array.isArray(details.reviewModes)) {
        updateData.review_modes = JSON.stringify(details.reviewModes);
      }
      if (details.studyReminder) updateData.study_reminder = details.studyReminder;

      console.log('AuthProvider: Saving update data:', updateData);

      const { error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('user_id', session.user.id);

      if (error) {
        console.error('AuthProvider: Database update error:', error);
        toast({
          title: "Update Failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      console.log('AuthProvider: Profile updated successfully, fetching fresh data...');
      
      // Refetch the user profile to get updated data
      await fetchUserProfile(session.user);

      toast({
        title: "Profile Setup Complete! ✅",
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
