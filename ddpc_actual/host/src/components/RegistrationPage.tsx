import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from 'shared_ui/card';
import { Button } from 'shared_ui/button';
import { Input } from 'shared_ui/input';
import { Label } from 'shared_ui/label';
import { Alert, AlertDescription } from 'shared_ui/alert';
import { Eye, EyeOff, Car, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from 'shared_ui/utils';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface ValidationState {
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
}

const RegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Password validation - at least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'email':
        if (!value) return 'Email address is required';
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return undefined;
      
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!passwordRegex.test(value)) {
          return 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number';
        }
        return undefined;
      
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== formData.password) return 'Passwords do not match';
        return undefined;
      
      default:
        return undefined;
    }
  };

  const getValidationState = (): ValidationState => {
    return {
      email: !validateField('email', formData.email),
      password: !validateField('password', formData.password),
      confirmPassword: !validateField('confirmPassword', formData.confirmPassword)
    };
  };

  const isFormValid = (): boolean => {
    const validation = getValidationState();
    return validation.email && validation.password && validation.confirmPassword;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    // If confirm password field and password has changed, revalidate confirm password
    if (name === 'password' && touchedFields.has('confirmPassword')) {
      const confirmError = validateField('confirmPassword', formData.confirmPassword);
      setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouchedFields(prev => new Set(prev).add(name));
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mark all fields as touched to show validation errors
    setTouchedFields(new Set(['email', 'password', 'confirmPassword']));

    // Validate all fields
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof FormData]);
      if (error) newErrors[key as keyof FormErrors] = error;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, you would make an API call here
        console.log('Registration data:', {
          email: formData.email,
          password: formData.password
        });

        // On successful registration, redirect to dashboard
        navigate('/dashboard');
      } catch (error) {
        console.error('Registration failed:', error);
        setErrors({ email: 'Registration failed. Please try again.' });
      }
    }

    setIsSubmitting(false);
  };

  const validation = getValidationState();

  return (
    <div className="min-h-screen bg-gradient-warehouse flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-card border-warehouse-steel shadow-warehouse">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-tech rounded-full flex items-center justify-center">
                <Car className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Create Your MyDDPC Account</CardTitle>
            <p className="text-muted-foreground">
              Join the community of automotive enthusiasts
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={cn(
                      "pr-10",
                      touchedFields.has('email') && errors.email && "border-destructive",
                      touchedFields.has('email') && validation.email && "border-warehouse-success"
                    )}
                    placeholder="Enter your email address"
                  />
                  {touchedFields.has('email') && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      {validation.email ? (
                        <CheckCircle className="w-4 h-4 text-warehouse-success" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-destructive" />
                      )}
                    </div>
                  )}
                </div>
                {touchedFields.has('email') && errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={cn(
                      "pr-20",
                      touchedFields.has('password') && errors.password && "border-destructive",
                      touchedFields.has('password') && validation.password && "border-warehouse-success"
                    )}
                    placeholder="Create a strong password"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
                    {touchedFields.has('password') && (
                      validation.password ? (
                        <CheckCircle className="w-4 h-4 text-warehouse-success" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-destructive" />
                      )
                    )}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {touchedFields.has('password') && errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters with uppercase, lowercase, and number
                </p>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={cn(
                      "pr-20",
                      touchedFields.has('confirmPassword') && errors.confirmPassword && "border-destructive",
                      touchedFields.has('confirmPassword') && validation.confirmPassword && "border-warehouse-success"
                    )}
                    placeholder="Confirm your password"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
                    {touchedFields.has('confirmPassword') && (
                      validation.confirmPassword ? (
                        <CheckCircle className="w-4 h-4 text-warehouse-success" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-destructive" />
                      )
                    )}
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {touchedFields.has('confirmPassword') && errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-tech text-white hover:opacity-90 transition-opacity"
                disabled={!isFormValid() || isSubmitting}
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </Button>

              {/* Helper Links */}
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="text-warehouse-accent hover:underline font-medium"
                  >
                    Log In
                  </Link>
                </p>
                
                <p className="text-xs text-muted-foreground">
                  By creating an account, you agree to our{' '}
                  <Link to="/terms" className="text-warehouse-accent hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-warehouse-accent hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegistrationPage;