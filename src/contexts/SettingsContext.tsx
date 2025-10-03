'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Settings {
  // General Settings
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  
  // Notification Settings
  emailNotifications: boolean;
  orderNotifications: boolean;
  messageNotifications: boolean;
  
  // Security Settings
  twoFactorAuth: boolean;
  sessionTimeout: number;
  
  // SEO Settings
  metaTitle: string;
  metaDescription: string;
  googleAnalytics: string;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  loading: boolean;
}

const defaultSettings: Settings = {
  // General Settings
  siteName: 'Food Trucks Maroc',
  siteDescription: 'Constructeur de food trucks au Maroc',
  contactEmail: 'contact@foodtrucks.ma',
  contactPhone: '+212 5XX XXX XXX',
  address: '123 Avenue Mohammed V, Casablanca, Maroc',
  
  // Notification Settings
  emailNotifications: true,
  orderNotifications: true,
  messageNotifications: true,
  
  // Security Settings
  twoFactorAuth: false,
  sessionTimeout: 30,
  
  // SEO Settings
  metaTitle: 'Food Trucks Maroc - Constructeur de Food Trucks au Maroc',
  metaDescription: 'Constructeur de food trucks au Maroc. Solutions mobiles sur mesure pour votre entreprise culinaire.',
  googleAnalytics: '',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  // Load settings from localStorage on mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem('admin_settings');
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          setSettings({ ...defaultSettings, ...parsedSettings });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem('admin_settings', JSON.stringify(settings));
      } catch (error) {
        console.error('Error saving settings:', error);
      }
    }
  }, [settings, loading]);

  // Update document title when metaTitle changes
  useEffect(() => {
    if (settings.metaTitle && !loading) {
      document.title = settings.metaTitle;
    }
  }, [settings.metaTitle, loading]);

  // Update meta description when it changes
  useEffect(() => {
    if (settings.metaDescription && !loading) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', settings.metaDescription);
      }
    }
  }, [settings.metaDescription, loading]);

  // Add Google Analytics when it changes
  useEffect(() => {
    if (settings.googleAnalytics && !loading) {
      // Remove existing Google Analytics script if any
      const existingScript = document.querySelector('script[src*="googletagmanager.com"]');
      if (existingScript) {
        existingScript.remove();
      }

      // Add new Google Analytics script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalytics}`;
      document.head.appendChild(script);

      // Initialize Google Analytics
      const gtagScript = document.createElement('script');
      gtagScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${settings.googleAnalytics}');
      `;
      document.head.appendChild(gtagScript);
    }
  }, [settings.googleAnalytics, loading]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const value: SettingsContextType = {
    settings,
    updateSettings,
    loading,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
