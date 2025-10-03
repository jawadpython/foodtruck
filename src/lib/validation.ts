// Validation utilities for forms

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface ValidationErrors {
  [key: string]: string;
}

export const validateField = (value: unknown, rules: ValidationRule): string | null => {
  // Required validation
  if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
    return 'Ce champ est requis';
  }

  // Skip other validations if value is empty and not required
  if (!value || (typeof value === 'string' && !value.trim())) {
    return null;
  }

  // Min length validation
  if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
    return `Minimum ${rules.minLength} caractères requis`;
  }

  // Max length validation
  if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
    return `Maximum ${rules.maxLength} caractères autorisés`;
  }

  // Pattern validation
  if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
    return 'Format invalide';
  }

  // Custom validation
  if (rules.custom) {
    return rules.custom(value);
  }

  return null;
};

export const validateForm = (data: Record<string, unknown>, rules: ValidationRules): ValidationErrors => {
  const errors: ValidationErrors = {};

  for (const [field, fieldRules] of Object.entries(rules)) {
    const error = validateField(data[field], fieldRules);
    if (error) {
      errors[field] = error;
    }
  }

  return errors;
};

// Common validation patterns
export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^(\+212|0)[5-7][0-9]{8}$/,
  url: /^https?:\/\/.+/,
  alphanumeric: /^[a-zA-Z0-9\s]+$/,
  frenchPhone: /^(\+212|0)[5-7][0-9]{8}$/,
};

// Common validation rules
export const commonRules = {
  required: { required: true },
  email: { 
    required: true, 
    pattern: patterns.email,
    custom: (value: string) => {
      if (!patterns.email.test(value)) {
        return 'Adresse email invalide';
      }
      return null;
    }
  },
  phone: {
    required: true,
    pattern: patterns.frenchPhone,
    custom: (value: string) => {
      if (!patterns.frenchPhone.test(value)) {
        return 'Numéro de téléphone marocain invalide (ex: +212 6XX XXX XXX)';
      }
      return null;
    }
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-ZÀ-ÿ\s'-]+$/,
    custom: (value: string) => {
      if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(value)) {
        return 'Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets';
      }
      return null;
    }
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 1000,
  },
  url: {
    pattern: patterns.url,
    custom: (value: string) => {
      if (value && !patterns.url.test(value)) {
        return 'URL invalide (doit commencer par http:// ou https://)';
      }
      return null;
    }
  },
  dimensions: {
    required: true,
    pattern: /^\d+[m]\s*x\s*\d+[m]\s*x\s*\d+[m]$/,
    custom: (value: string) => {
      if (!/^\d+[m]\s*x\s*\d+[m]\s*x\s*\d+[m]$/.test(value)) {
        return 'Format invalide (ex: 6m x 2.5m x 3m)';
      }
      return null;
    }
  },
  capacity: {
    required: true,
    pattern: /^\d+-\d+\s+personnes?$/,
    custom: (value: string) => {
      if (!/^\d+-\d+\s+personnes?$/.test(value)) {
        return 'Format invalide (ex: 2-3 personnes)';
      }
      return null;
    }
  }
};

// Form-specific validation rules
export const formRules = {
  contactForm: {
    name: commonRules.name,
    email: commonRules.email,
    phone: { ...commonRules.phone, required: false },
    subject: { required: true, minLength: 5, maxLength: 100 },
    message: commonRules.message,
  },
  quoteForm: {
    name: commonRules.name,
    email: commonRules.email,
    phone: commonRules.phone,
    message: commonRules.message,
  },
  truckForm: {
    name: { required: true, minLength: 3, maxLength: 100 },
    description: { required: true, minLength: 20, maxLength: 1000 },
    shortDescription: { required: true, minLength: 10, maxLength: 200 },
    category: { required: true },
    dimensions: commonRules.dimensions,
    capacity: commonRules.capacity,
  },
  settingsForm: {
    siteName: { required: true, minLength: 3, maxLength: 50 },
    contactEmail: commonRules.email,
    contactPhone: commonRules.phone,
    address: { required: true, minLength: 10, maxLength: 200 },
    description: { required: true, minLength: 20, maxLength: 500 },
    keywords: { required: true, minLength: 5, maxLength: 200 },
  }
};

// Helper function to validate nested objects
export const validateNestedForm = (data: Record<string, unknown>, rules: ValidationRules, prefix = ''): ValidationErrors => {
  const errors: ValidationErrors = {};

  for (const [field, fieldRules] of Object.entries(rules)) {
    const fieldPath = prefix ? `${prefix}.${field}` : field;
    const value = prefix ? data[prefix]?.[field] : data[field];
    
    const error = validateField(value, fieldRules);
    if (error) {
      errors[fieldPath] = error;
    }
  }

  return errors;
};

// Helper function to check if form is valid
export const isFormValid = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length === 0;
};

// Helper function to get first error message
export const getFirstError = (errors: ValidationErrors): string | null => {
  const firstKey = Object.keys(errors)[0];
  return firstKey ? errors[firstKey] : null;
};
