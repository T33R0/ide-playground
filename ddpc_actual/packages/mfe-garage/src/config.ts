// Configuration for the application
export const config = {
  // Default API URL - will be overridden by environment variables in production
  apiUrl: 'http://localhost:3333'
};

// Interface for environment variables
declare global {
  interface ImportMetaEnv {
    VITE_API_URL?: string;
    REACT_APP_API_URL?: string;
  }
}

// Get environment variables in a cross-platform way
const getEnvVar = (name: string): string | undefined => {
  // @ts-ignore - Vite provides import.meta.env
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-ignore
    return import.meta.env[name];
  }
  // Fallback for other environments
  return process?.env?.[name];
};

// Apply environment overrides
const apiUrl = getEnvVar('VITE_API_URL') || getEnvVar('REACT_APP_API_URL');
if (apiUrl) {
  config.apiUrl = apiUrl;
}

export default config;
