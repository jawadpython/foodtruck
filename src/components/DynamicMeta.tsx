'use client';

import { useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';

export default function DynamicMeta() {
  const { settings, loading } = useSettings();

  useEffect(() => {
    if (!loading) {
      // Update document title
      if (settings.metaTitle) {
        document.title = settings.metaTitle;
      }

      // Update meta description
      if (settings.metaDescription) {
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', settings.metaDescription);
        } else {
          // Create meta description if it doesn't exist
          const meta = document.createElement('meta');
          meta.name = 'description';
          meta.content = settings.metaDescription;
          document.head.appendChild(meta);
        }
      }

      // Update Open Graph title
      if (settings.metaTitle) {
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
          ogTitle.setAttribute('content', settings.metaTitle);
        } else {
          const meta = document.createElement('meta');
          meta.setAttribute('property', 'og:title');
          meta.content = settings.metaTitle;
          document.head.appendChild(meta);
        }
      }

      // Update Open Graph description
      if (settings.metaDescription) {
        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) {
          ogDescription.setAttribute('content', settings.metaDescription);
        } else {
          const meta = document.createElement('meta');
          meta.setAttribute('property', 'og:description');
          meta.content = settings.metaDescription;
          document.head.appendChild(meta);
        }
      }
    }
  }, [settings.metaTitle, settings.metaDescription, loading]);

  return null; // This component doesn't render anything
}
