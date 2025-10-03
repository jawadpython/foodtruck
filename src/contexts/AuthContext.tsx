'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Environment-based admin credentials
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@foodtrucks.ma';
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    // Only run on client side
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('admin_user');
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        } catch (error) {
          localStorage.removeItem('admin_user');
        }
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Validate input
      if (!email || !password) {
        throw new Error('Email et mot de passe requis');
      }

      // Simple authentication check (in production, use proper hashing)
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const userData: User = {
          id: 'admin-1',
          email: ADMIN_EMAIL,
          role: 'admin',
          createdAt: new Date(),
        };
        
        setUser(userData);
        if (typeof window !== 'undefined') {
          localStorage.setItem('admin_user', JSON.stringify(userData));
        }
        return;
      } else {
        throw new Error('Email ou mot de passe incorrect');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_user');
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signOut,
    isAdmin: user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
