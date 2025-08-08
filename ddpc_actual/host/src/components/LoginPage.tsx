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
}

interface FormErrors {
  email?: string;
  password?: string;
  auth?: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'email':
        if (!value) return 'Email address is required';
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return undefined;
      
      case 'password':
        if (!value) return 'Password is required';
        return undefined;
      
      default:
        return undefined;
    }
  };

  const isFormValid = (): boolean => {
    return formData.email && formData.password && !errors.email && !errors.password;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    // Clear auth error when user modifies any field
    if (errors.auth) {
      setErrors(prev => ({ ...prev, auth: undefined }));
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
    setTouchedFields(new Set(['email', 'password']));

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
        
        // Stub authentication logic
        // In a real app, you would make an API call here
        console.log('Login attempt:', {
          email: formData.email,
          password: formData.password
        });

        // Simulate authentication success/failure
        // For demo purposes, any email/password combination will work
        // except for specific "fail" cases to test error handling
        if (formData.email === 'fail@test.com' || formData.password === 'fail') {
          setErrors({ auth: 'Invalid email or password. Please try again.' });
        } else {
          // On successful login, redirect to dashboard
          console.log('Login successful');
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Login failed:', error);
        setErrors({ auth: 'Login failed. Please try again.' });
      }
    }

    setIsSubmitting(false);
  };

  const getFieldValidation = (fieldName: string): boolean => {
    return touchedFields.has(fieldName) && !validateField(fieldName, formData[fieldName as keyof FormData]);
  };

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
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <p className="text-muted-foreground">
              Sign in to your MyDDPC account
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Auth Error Alert */}
              {errors.auth && (
                <Alert className="border-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-destructive">
                    {errors.auth}
                  </AlertDescription>
                </Alert>
              )}

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
                      touchedFields.has('email') && getFieldValidation('email') && "border-warehouse-success"
                    )}
                    placeholder="Enter your email address"
                  />
                  {touchedFields.has('email') && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      {getFieldValidation('email') ? (
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-warehouse-accent hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
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
                      touchedFields.has('password') && getFieldValidation('password') && "border-warehouse-success"
                    )}
                    placeholder="Enter your password"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
                    {touchedFields.has('password') && (
                      getFieldValidation('password') ? (
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
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-tech text-white hover:opacity-90 transition-opacity"
                disabled={!isFormValid() || isSubmitting}
              >
                {isSubmitting ? 'Signing In...' : 'Log In'}
              </Button>

              {/* Helper Links */}
              <div className="text-center space-y-3">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-muted-foreground/20" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">or</span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link 
                    to="/register" 
                    className="text-warehouse-accent hover:underline font-medium"
                  >
                    Create one
                  </Link>
                </p>
              </div>
            </form>

            {/* Demo Credentials Helper */}
            <div className="mt-6 p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                <strong>Demo:</strong> Use any email/password to login, or{' '}
                <code className="bg-muted px-1 rounded">fail@test.com</code> to test error handling
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;