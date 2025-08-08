// Shared configuration for all MFEs

// Type definitions
export interface ApiEndpoints {
  vehicles: string;
  maintenanceLogs: string;
  buildPlanParts: string;
  users: string;
  [key: string]: string; // Allow dynamic endpoint access
}

export interface ApiConfig {
  baseUrl: string;
  endpoints: ApiEndpoints;
  timeout: number;
  getUrl: (endpoint: keyof ApiEndpoints) => string;
}

export interface FeaturesConfig {
  enableAnalytics: boolean;
  enableErrorReporting: boolean;
}

// Default configuration values
const defaultEndpoints: ApiEndpoints = {
  vehicles: '/vehicles',
  maintenanceLogs: '/maintenance_logs',
  buildPlanParts: '/build_plan_parts',
  users: '/users'
};

const defaultConfig: {
  api: Omit<ApiConfig, 'getUrl'> & { endpoints: ApiEndpoints };
  features: FeaturesConfig;
} = {
  api: {
    baseUrl: 'http://localhost:8001',
    endpoints: defaultEndpoints,
    timeout: 10000 // 10 seconds
  },
  features: {
    enableAnalytics: false,
    enableErrorReporting: false
  }
};

export interface AppConfig {
  api: ApiConfig;
  features: FeaturesConfig;
}

// Get environment variables in a cross-platform way
const getEnvVar = (name: string): string | undefined => {
  // @ts-ignore - Vite provides import.meta.env
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-ignore
    return import.meta.env[`VITE_${name}`] || import.meta.env[`REACT_APP_${name}`];
  }
  
  // Fallback for other environments (Node.js/webpack)
  // Check if process exists before accessing it
  if (typeof process !== 'undefined' && process.env) {
    return process.env[`VITE_${name}`] || process.env[`REACT_APP_${name}`];
  }
  
  // Browser fallback - return undefined if no environment variables are available
  return undefined;
};

// Build the configuration
const buildConfig = (): AppConfig => {
  const apiUrl = getEnvVar('API_URL') || defaultConfig.api.baseUrl;
  
  return {
    api: {
      ...defaultConfig.api,
      baseUrl: apiUrl,
      getUrl: (endpoint: keyof ApiEndpoints) => {
        const path = defaultConfig.api.endpoints[endpoint] || '';
        return `${apiUrl}${path}`;
      }
    },
    features: {
      ...defaultConfig.features,
      enableAnalytics: getEnvVar('ENABLE_ANALYTICS') === 'true',
      enableErrorReporting: getEnvVar('ENABLE_ERROR_REPORTING') === 'true'
    }
  };
};

// Export the config
const config = buildConfig();

export default config;
