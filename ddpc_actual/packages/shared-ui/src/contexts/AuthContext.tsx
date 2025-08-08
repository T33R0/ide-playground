// Authentication Context Provider - Contract-First WordPress/SG Integration
// Provides authentication state and methods across the MFE application

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthService } from '../services/authService';

// Local interfaces matching exact database schema
interface AuthUser {
  id: number;
  username: string;
  email: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  location?: string;
  socialLinks?: {
    youtube?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
  };
  hasPublicProfile: boolean;
  tier: 'free' | 'builder' | 'pro';
  isAuthenticated: boolean;
}

interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  token?: string;
  message?: string;
  error?: string;
}

interface LoginCredentials {
  username: string;
  password: string;
  remember?: boolean;
}

interface RegistrationData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (userData: RegistrationData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<AuthUser>) => Promise<AuthResponse>;
  refreshUser: () => Promise<AuthUser | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize authentication state on app start
    const initAuth = async () => {
      try {
        setIsLoading(true);
        const storedUser = AuthService.init();
        
        if (storedUser) {
          setUser(storedUser);
          // Optionally refresh user data from server
          try {
            const refreshedUser = await AuthService.refreshUser();
            if (refreshedUser) {
              setUser(refreshedUser);
            }
          } catch (error) {
            console.warn('Failed to refresh user data:', error);
            // Keep the stored user data if refresh fails
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      const response = await AuthService.login(credentials);
      
      if (response.success && response.user) {
        setUser(response.user);
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Login failed. Please try again.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegistrationData): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      const response = await AuthService.register(userData);
      
      if (response.success && response.user) {
        setUser(response.user);
      }
      
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Registration failed. Please try again.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await AuthService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<AuthUser>): Promise<AuthResponse> => {
    try {
      const response = await AuthService.updateProfile(updates);
      
      if (response.success && response.user) {
        setUser(response.user);
      }
      
      return response;
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        error: 'Failed to update profile. Please try again.',
      };
    }
  };

  const refreshUser = async (): Promise<AuthUser | null> => {
    try {
      const refreshedUser = await AuthService.refreshUser();
      if (refreshedUser) {
        setUser(refreshedUser);
      }
      return refreshedUser;
    } catch (error) {
      console.error('Refresh user error:', error);
      return null;
    }
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: user !== null && user.isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use authentication context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Higher-order component for protected routes
interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  requiredTier?: 'free' | 'builder' | 'pro';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback = <div>Please log in to access this content.</div>,
  requiredTier 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <>{fallback}</>;
  }

  // Check tier requirements if specified
  if (requiredTier) {
    const tierLevels = { free: 0, builder: 1, pro: 2 };
    const userTierLevel = tierLevels[user.tier];
    const requiredTierLevel = tierLevels[requiredTier];

    if (userTierLevel < requiredTierLevel) {
      return (
        <div className="text-center p-8">
          <h3 className="text-lg font-semibold mb-2">Upgrade Required</h3>
          <p className="text-gray-600">
            This feature requires a {requiredTier} tier subscription or higher.
          </p>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default AuthContext;
