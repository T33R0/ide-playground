// Authentication Context - Contract-First WordPress/SG Integration
// Provides centralized authentication state management across the application

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types for authentication
interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName: string;
  tier: 'free' | 'builder' | 'pro';
  avatar?: string;
  socialLinks?: {
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    website?: string;
  };
  createdAt: string;
  lastLogin?: string;
}

interface LoginCredentials {
  username: string;
  password: string;
  remember?: boolean;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<AuthResponse>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Environment-based API configuration
const API_BASE_URL = process.env.REACT_APP_WP_API_URL || 'https://myddpc.com/wp-json';
const IS_DEV = process.env.NODE_ENV === 'development';

// Mock authentication service for development
const mockAuthService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful login
    const mockUser: User = {
      id: 1,
      username: credentials.username,
      email: credentials.username.includes('@') ? credentials.username : `${credentials.username}@example.com`,
      displayName: credentials.username,
      tier: 'builder',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    const token = 'mock-jwt-token-' + Date.now();
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(mockUser));

    return {
      success: true,
      user: mockUser,
      token,
    };
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock successful registration
    const mockUser: User = {
      id: Date.now(),
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      displayName: data.firstName && data.lastName 
        ? `${data.firstName} ${data.lastName}` 
        : data.username,
      tier: 'free',
      createdAt: new Date().toISOString(),
    };

    const token = 'mock-jwt-token-' + Date.now();
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(mockUser));

    return {
      success: true,
      user: mockUser,
      token,
    };
  },

  async logout(): Promise<void> {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  },

  async updateProfile(data: Partial<User>): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const currentUser = JSON.parse(localStorage.getItem('user_data') || '{}');
    const updatedUser = { ...currentUser, ...data };
    
    localStorage.setItem('user_data', JSON.stringify(updatedUser));
    
    return {
      success: true,
      user: updatedUser,
    };
  },

  async refreshToken(): Promise<boolean> {
    const token = localStorage.getItem('auth_token');
    return !!token;
  },
};

// Production WordPress authentication service
const wpAuthService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/myddpc/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        
        return {
          success: true,
          user: data.user,
          token: data.token,
        };
      } else {
        return {
          success: false,
          error: data.message || 'Login failed',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Network error. Please try again.',
      };
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/myddpc/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        localStorage.setItem('auth_token', result.token);
        localStorage.setItem('user_data', JSON.stringify(result.user));
        
        return {
          success: true,
          user: result.user,
          token: result.token,
        };
      } else {
        return {
          success: false,
          error: result.message || 'Registration failed',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Network error. Please try again.',
      };
    }
  },

  async logout(): Promise<void> {
    const token = localStorage.getItem('auth_token');
    
    try {
      await fetch(`${API_BASE_URL}/myddpc/v1/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.warn('Logout request failed:', error);
    }
    
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  },

  async updateProfile(data: Partial<User>): Promise<AuthResponse> {
    const token = localStorage.getItem('auth_token');
    
    try {
      const response = await fetch(`${API_BASE_URL}/myddpc/v1/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        localStorage.setItem('user_data', JSON.stringify(result.user));
        
        return {
          success: true,
          user: result.user,
        };
      } else {
        return {
          success: false,
          error: result.message || 'Profile update failed',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Network error. Please try again.',
      };
    }
  },

  async refreshToken(): Promise<boolean> {
    const token = localStorage.getItem('auth_token');
    
    if (!token) return false;
    
    try {
      const response = await fetch(`${API_BASE_URL}/myddpc/v1/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
        }
        return true;
      }
      
      return false;
    } catch (error) {
      return false;
    }
  },
};

// Choose service based on environment
const authService = IS_DEV ? mockAuthService : wpAuthService;

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize authentication state
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          
          // Verify token is still valid
          const isValid = await authService.refreshToken();
          
          if (isValid) {
            setUser(parsedUser);
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setIsLoading(true);
    
    try {
      const response = await authService.login(credentials);
      
      if (response.success && response.user) {
        setUser(response.user);
      }
      
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<AuthResponse> => {
    setIsLoading(true);
    
    try {
      const response = await authService.register(data);
      
      if (response.success && response.user) {
        setUser(response.user);
      }
      
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<AuthResponse> => {
    const response = await authService.updateProfile(data);
    
    if (response.success && response.user) {
      setUser(response.user);
    }
    
    return response;
  };

  const refreshToken = async (): Promise<boolean> => {
    return await authService.refreshToken();
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export type { User, LoginCredentials, RegisterData, AuthResponse };
