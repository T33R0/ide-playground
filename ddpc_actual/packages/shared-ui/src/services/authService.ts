// Authentication Service - Contract-First WordPress/SG Integration
// Handles user authentication, session management, and user data

// Local interfaces matching exact database schema
interface User {
  ID: number;
  user_login: string;
  user_pass: string;
  user_nicename: string;
  user_email: string;
  display_name: string;
}

interface UserMeta {
  first_name: string;
  last_name: string;
  user_location: string;
  social_youtube: string;
  social_instagram: string;
  social_twitter: string;
  social_tiktok: string;
  has_public_profile: boolean;
}

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

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';
const WP_API_BASE_URL = process.env.REACT_APP_WP_API_URL || 'https://myddpc.com/wp-json';

export class AuthService {
  private static currentUser: AuthUser | null = null;
  private static authToken: string | null = null;

  // Initialize authentication state from localStorage
  static init(): AuthUser | null {
    try {
      const storedUser = localStorage.getItem('myddpc_user');
      const storedToken = localStorage.getItem('myddpc_auth_token');
      
      if (storedUser && storedToken) {
        this.currentUser = JSON.parse(storedUser);
        this.authToken = storedToken;
        return this.currentUser;
      }
    } catch (error) {
      console.error('Error initializing auth state:', error);
      this.clearAuthData();
    }
    return null;
  }

  // Get current authenticated user
  static getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return this.currentUser !== null && this.authToken !== null;
  }

  // Login with WordPress credentials
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // In development, use mock authentication
      if (process.env.NODE_ENV === 'development') {
        return this.mockLogin(credentials);
      }

      // Production WordPress authentication
      const response = await fetch(`${WP_API_BASE_URL}/myddpc/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const authResponse: AuthResponse = await response.json();
      
      if (authResponse.success && authResponse.user && authResponse.token) {
        this.setAuthData(authResponse.user, authResponse.token);
      }

      return authResponse;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Login failed. Please check your credentials and try again.',
      };
    }
  }

  // Register new user
  static async register(userData: RegistrationData): Promise<AuthResponse> {
    try {
      // In development, use mock registration
      if (process.env.NODE_ENV === 'development') {
        return this.mockRegister(userData);
      }

      // Production WordPress registration
      const response = await fetch(`${WP_API_BASE_URL}/myddpc/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const authResponse: AuthResponse = await response.json();
      
      if (authResponse.success && authResponse.user && authResponse.token) {
        this.setAuthData(authResponse.user, authResponse.token);
      }

      return authResponse;
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Registration failed. Please try again.',
      };
    }
  }

  // Logout user
  static async logout(): Promise<void> {
    try {
      // Call WordPress logout endpoint if in production
      if (process.env.NODE_ENV !== 'development' && this.authToken) {
        await fetch(`${WP_API_BASE_URL}/myddpc/v1/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.authToken}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuthData();
    }
  }

  // Refresh user data
  static async refreshUser(): Promise<AuthUser | null> {
    if (!this.authToken) return null;

    try {
      const response = await fetch(`${WP_API_BASE_URL}/myddpc/v1/auth/me`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const userData: AuthUser = await response.json();
      this.currentUser = userData;
      localStorage.setItem('myddpc_user', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      console.error('Error refreshing user data:', error);
      this.clearAuthData();
      return null;
    }
  }

  // Update user profile
  static async updateProfile(updates: Partial<AuthUser>): Promise<AuthResponse> {
    if (!this.authToken || !this.currentUser) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const response = await fetch(`${WP_API_BASE_URL}/myddpc/v1/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedUser: AuthUser = await response.json();
      this.currentUser = updatedUser;
      localStorage.setItem('myddpc_user', JSON.stringify(updatedUser));

      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        error: 'Failed to update profile. Please try again.',
      };
    }
  }

  // Get authentication headers for API requests
  static getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  // Private helper methods
  private static setAuthData(user: AuthUser, token: string): void {
    this.currentUser = user;
    this.authToken = token;
    localStorage.setItem('myddpc_user', JSON.stringify(user));
    localStorage.setItem('myddpc_auth_token', token);
  }

  private static clearAuthData(): void {
    this.currentUser = null;
    this.authToken = null;
    localStorage.removeItem('myddpc_user');
    localStorage.removeItem('myddpc_auth_token');
  }

  // Mock authentication for development
  private static async mockLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock user data for development
    const mockUser: AuthUser = {
      id: 1,
      username: credentials.username,
      email: 'user@example.com',
      displayName: 'Test User',
      firstName: 'Test',
      lastName: 'User',
      location: 'San Francisco, CA',
      socialLinks: {
        youtube: 'https://youtube.com/@testuser',
        instagram: 'https://instagram.com/testuser',
      },
      hasPublicProfile: true,
      tier: 'builder',
      isAuthenticated: true,
    };

    const mockToken = 'mock_jwt_token_' + Date.now();

    this.setAuthData(mockUser, mockToken);

    return {
      success: true,
      user: mockUser,
      token: mockToken,
      message: 'Login successful (development mode)',
    };
  }

  private static async mockRegister(userData: RegistrationData): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockUser: AuthUser = {
      id: Date.now(),
      username: userData.username,
      email: userData.email,
      displayName: userData.firstName ? `${userData.firstName} ${userData.lastName}` : userData.username,
      firstName: userData.firstName,
      lastName: userData.lastName,
      location: '',
      socialLinks: {},
      hasPublicProfile: false,
      tier: 'free',
      isAuthenticated: true,
    };

    const mockToken = 'mock_jwt_token_' + Date.now();

    this.setAuthData(mockUser, mockToken);

    return {
      success: true,
      user: mockUser,
      token: mockToken,
      message: 'Registration successful (development mode)',
    };
  }
}
