
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  userType: 'exam' | 'college' | null;
  examType?: string;
  college?: string;
  semester?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => void;
  updateUserType: (type: 'exam' | 'college', details: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const signIn = async (email: string, password: string) => {
    // Firebase Auth integration would go here
    console.log('Signing in:', email);
    setUser({
      id: '1',
      email,
      name: 'Student',
      userType: null
    });
  };

  const signUp = async (email: string, password: string, name: string) => {
    // Firebase Auth integration would go here
    console.log('Signing up:', email, name);
    setUser({
      id: '1',
      email,
      name,
      userType: null
    });
  };

  const signOut = () => {
    setUser(null);
  };

  const updateUserType = (type: 'exam' | 'college', details: any) => {
    if (user) {
      setUser({
        ...user,
        userType: type,
        ...details
      });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      signIn,
      signUp,
      signOut,
      updateUserType
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
