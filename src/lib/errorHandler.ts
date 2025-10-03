// Error handling utilities

export interface AppError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: Date;
}

export class CustomError extends Error {
  public code: string;
  public details?: unknown;
  public timestamp: Date;

  constructor(code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'CustomError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date();
  }
}

// Error codes
export const ERROR_CODES = {
  // Authentication errors
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
  AUTH_SESSION_EXPIRED: 'AUTH_SESSION_EXPIRED',
  
  // Validation errors
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  VALIDATION_REQUIRED_FIELD: 'VALIDATION_REQUIRED_FIELD',
  VALIDATION_INVALID_FORMAT: 'VALIDATION_INVALID_FORMAT',
  
  // Data errors
  DATA_NOT_FOUND: 'DATA_NOT_FOUND',
  DATA_ALREADY_EXISTS: 'DATA_ALREADY_EXISTS',
  DATA_SAVE_FAILED: 'DATA_SAVE_FAILED',
  DATA_DELETE_FAILED: 'DATA_DELETE_FAILED',
  
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  NETWORK_TIMEOUT: 'NETWORK_TIMEOUT',
  NETWORK_OFFLINE: 'NETWORK_OFFLINE',
  
  // Email errors
  EMAIL_SEND_FAILED: 'EMAIL_SEND_FAILED',
  EMAIL_INVALID_ADDRESS: 'EMAIL_INVALID_ADDRESS',
  
  // File errors
  FILE_UPLOAD_FAILED: 'FILE_UPLOAD_FAILED',
  FILE_INVALID_TYPE: 'FILE_INVALID_TYPE',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  
  // Generic errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
} as const;

// Error messages in French
export const ERROR_MESSAGES = {
  [ERROR_CODES.AUTH_INVALID_CREDENTIALS]: 'Email ou mot de passe incorrect',
  [ERROR_CODES.AUTH_UNAUTHORIZED]: 'Vous n\'êtes pas autorisé à effectuer cette action',
  [ERROR_CODES.AUTH_SESSION_EXPIRED]: 'Votre session a expiré. Veuillez vous reconnecter',
  
  [ERROR_CODES.VALIDATION_FAILED]: 'Les données saisies ne sont pas valides',
  [ERROR_CODES.VALIDATION_REQUIRED_FIELD]: 'Ce champ est requis',
  [ERROR_CODES.VALIDATION_INVALID_FORMAT]: 'Format invalide',
  
  [ERROR_CODES.DATA_NOT_FOUND]: 'Données non trouvées',
  [ERROR_CODES.DATA_ALREADY_EXISTS]: 'Ces données existent déjà',
  [ERROR_CODES.DATA_SAVE_FAILED]: 'Erreur lors de la sauvegarde',
  [ERROR_CODES.DATA_DELETE_FAILED]: 'Erreur lors de la suppression',
  
  [ERROR_CODES.NETWORK_ERROR]: 'Erreur de connexion. Vérifiez votre connexion internet',
  [ERROR_CODES.NETWORK_TIMEOUT]: 'Délai d\'attente dépassé. Veuillez réessayer',
  [ERROR_CODES.NETWORK_OFFLINE]: 'Vous êtes hors ligne. Vérifiez votre connexion',
  
  [ERROR_CODES.EMAIL_SEND_FAILED]: 'Erreur lors de l\'envoi de l\'email',
  [ERROR_CODES.EMAIL_INVALID_ADDRESS]: 'Adresse email invalide',
  
  [ERROR_CODES.FILE_UPLOAD_FAILED]: 'Erreur lors du téléchargement du fichier',
  [ERROR_CODES.FILE_INVALID_TYPE]: 'Type de fichier non autorisé',
  [ERROR_CODES.FILE_TOO_LARGE]: 'Fichier trop volumineux',
  
  [ERROR_CODES.UNKNOWN_ERROR]: 'Une erreur inattendue s\'est produite',
  [ERROR_CODES.SERVER_ERROR]: 'Erreur du serveur. Veuillez réessayer plus tard',
} as const;

// Error handler class
export class ErrorHandler {
  static createError(code: keyof typeof ERROR_CODES, details?: unknown): CustomError {
    const message = ERROR_MESSAGES[code] || ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR];
    return new CustomError(code, message, details);
  }

  static handleError(error: unknown): AppError {
    console.error('Error occurred:', error);

    // If it's already a CustomError, return it
    if (error instanceof CustomError) {
      return {
        code: error.code,
        message: error.message,
        details: error.details,
        timestamp: error.timestamp,
      };
    }

    // Handle Firebase errors
    if (error?.code?.startsWith('auth/')) {
      switch (error.code) {
        case 'auth/invalid-email':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          return {
            code: ERROR_CODES.AUTH_INVALID_CREDENTIALS,
            message: ERROR_MESSAGES[ERROR_CODES.AUTH_INVALID_CREDENTIALS],
            details: error,
            timestamp: new Date(),
          };
        case 'auth/too-many-requests':
          return {
            code: ERROR_CODES.AUTH_UNAUTHORIZED,
            message: 'Trop de tentatives. Veuillez réessayer plus tard',
            details: error,
            timestamp: new Date(),
          };
        default:
          return {
            code: ERROR_CODES.AUTH_UNAUTHORIZED,
            message: ERROR_MESSAGES[ERROR_CODES.AUTH_UNAUTHORIZED],
            details: error,
            timestamp: new Date(),
          };
      }
    }

    // Handle Firestore errors
    if (error?.code?.startsWith('firestore/')) {
      switch (error.code) {
        case 'firestore/not-found':
          return {
            code: ERROR_CODES.DATA_NOT_FOUND,
            message: ERROR_MESSAGES[ERROR_CODES.DATA_NOT_FOUND],
            details: error,
            timestamp: new Date(),
          };
        case 'firestore/permission-denied':
          return {
            code: ERROR_CODES.AUTH_UNAUTHORIZED,
            message: ERROR_MESSAGES[ERROR_CODES.AUTH_UNAUTHORIZED],
            details: error,
            timestamp: new Date(),
          };
        default:
          return {
            code: ERROR_CODES.DATA_SAVE_FAILED,
            message: ERROR_MESSAGES[ERROR_CODES.DATA_SAVE_FAILED],
            details: error,
            timestamp: new Date(),
          };
      }
    }

    // Handle network errors
    if (error?.name === 'NetworkError' || error?.message?.includes('network')) {
      return {
        code: ERROR_CODES.NETWORK_ERROR,
        message: ERROR_MESSAGES[ERROR_CODES.NETWORK_ERROR],
        details: error,
        timestamp: new Date(),
      };
    }

    // Handle timeout errors
    if (error?.name === 'TimeoutError' || error?.message?.includes('timeout')) {
      return {
        code: ERROR_CODES.NETWORK_TIMEOUT,
        message: ERROR_MESSAGES[ERROR_CODES.NETWORK_TIMEOUT],
        details: error,
        timestamp: new Date(),
      };
    }

    // Handle validation errors
    if (error?.name === 'ValidationError') {
      return {
        code: ERROR_CODES.VALIDATION_FAILED,
        message: error.message || ERROR_MESSAGES[ERROR_CODES.VALIDATION_FAILED],
        details: error,
        timestamp: new Date(),
      };
    }

    // Default error
    return {
      code: ERROR_CODES.UNKNOWN_ERROR,
      message: error?.message || ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR],
      details: error,
      timestamp: new Date(),
    };
  }

  static getErrorMessage(error: unknown): string {
    const appError = this.handleError(error);
    return appError.message;
  }

  static logError(error: unknown, context?: string): void {
    const appError = this.handleError(error);
    
    console.group(`🚨 Error${context ? ` in ${context}` : ''}`);
    console.error('Code:', appError.code);
    console.error('Message:', appError.message);
    console.error('Timestamp:', appError.timestamp);
    if (appError.details) {
      console.error('Details:', appError.details);
    }
    console.groupEnd();
  }
}

// Utility function for async error handling
export const withErrorHandling = async <T>(
  asyncFn: () => Promise<T>,
  context?: string
): Promise<T> => {
  try {
    return await asyncFn();
  } catch (error) {
    ErrorHandler.logError(error, context);
    throw ErrorHandler.handleError(error);
  }
};

// Utility function for sync error handling
export const handleSyncError = <T>(fn: () => T, context?: string): T => {
  try {
    return fn();
  } catch (error) {
    ErrorHandler.logError(error, context);
    throw ErrorHandler.handleError(error);
  }
};
