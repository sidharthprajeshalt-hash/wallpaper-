import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authMode: 'login' | 'signup';
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (name: string, email: string, pass: string, avatar?: string) => Promise<boolean>;
  loginAsGuest: () => void;
  logout: () => void;
  openAuthModal: (mode?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
}

const STORAGE_KEY_USER = 'wallarthd_auth_user';
const STORAGE_KEY_USERS_DB = 'wallarthd_registered_users';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=200&auto=format&fit=crop&q=80',
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(() => {
    // If no user exists, prompt auth on initial start
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      return !saved;
    } catch {
      return true;
    }
  });

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [user]);

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    // Only allow close if user is logged in or active
    if (user) {
      setIsAuthModalOpen(false);
    }
  };

  const login = async (email: string): Promise<boolean> => {
    try {
      // Look up in registered users or fallback demo
      const registered = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS_DB) || '[]');
      const found = registered.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
      
      const loggedUser: User = found ? {
        id: found.id,
        name: found.name,
        email: found.email,
        avatar: found.avatar || AVATAR_OPTIONS[0],
        joinedDate: found.joinedDate || new Date().toISOString().split('T')[0],
      } : {
        id: 'user-' + Date.now(),
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Wallpaper Creator',
        email: email,
        avatar: AVATAR_OPTIONS[0],
        joinedDate: new Date().toISOString().split('T')[0],
      };

      setUser(loggedUser);
      setIsAuthModalOpen(false);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const signup = async (name: string, email: string, _pass: string, avatar?: string): Promise<boolean> => {
    try {
      const newUser: User = {
        id: 'u-' + Math.random().toString(36).substring(2, 9),
        name: name.trim() || 'Wallpaper Creator',
        email: email.trim(),
        avatar: avatar || AVATAR_OPTIONS[Math.floor(Math.random() * AVATAR_OPTIONS.length)],
        joinedDate: new Date().toISOString().split('T')[0],
      };

      const registered = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS_DB) || '[]');
      registered.push(newUser);
      localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(registered));

      setUser(newUser);
      setIsAuthModalOpen(false);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const loginAsGuest = () => {
    const guestUser: User = {
      id: 'guest-' + Math.random().toString(36).substring(2, 7),
      name: 'Guest Explorer',
      email: 'guest@wallarthd.com',
      avatar: AVATAR_OPTIONS[3],
      joinedDate: new Date().toISOString().split('T')[0],
      isGuest: true,
    };
    setUser(guestUser);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    setIsAuthModalOpen(true);
    setAuthMode('login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthModalOpen,
        authMode,
        login,
        signup,
        loginAsGuest,
        logout,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
