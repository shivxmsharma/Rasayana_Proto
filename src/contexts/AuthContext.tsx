import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  login: (profile?: UserProfile) => void;
  logout: () => void;
  register: (profile: UserProfile) => void;
}

interface UserProfile {
  fullName: string;
  phone: string;
  location: string;
  farmSize?: string;
  profilePhoto?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const login = (profile?: UserProfile) => {
    setIsAuthenticated(true);
    if (profile) {
      setUserProfile(profile);
    } else {
      // Default demo profile for quick login
      setUserProfile({
        fullName: 'Demo Farmer',
        phone: '+91 9876543210',
        location: 'Rajasthan, India',
        farmSize: '5 acres',
      });
    }
  };

  const register = (profile: UserProfile) => {
    setUserProfile(profile);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        userProfile, 
        login, 
        logout, 
        register 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export type { UserProfile };
