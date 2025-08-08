import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from 'shared_ui/card';
import { Button } from 'shared_ui/button';
import { Input } from 'shared_ui/input';
import { Label } from 'shared_ui/label';
import { Badge } from 'shared_ui/badge';
import { Alert, AlertDescription } from 'shared_ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from 'shared_ui/dialog';
import { useTier } from 'shared_ui/use-tier';
import { 
  User, 
  CreditCard, 
  AlertTriangle, 
  Crown, 
  Shield,
  Trash2,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';
import { cn } from 'shared_ui/utils';

interface UserProfile {
  name: string;
  email: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile: React.FC = () => {
  const { currentTier, limits } = useTier();
  const [isLoading, setIsLoading] = useState(false); // CSS now loaded at host level
  
  // User data (in real app, this would come from API/auth context)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john.doe@example.com'
  });

  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Modal states
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Form states
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Loading states
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Get tier information
  const getTierInfo = () => {
    const tierPricing: Record<string, { cost: string; billing: string }> = {
      driver: { cost: 'Free', billing: 'No payment required' },
      builder: { cost: '$7.00/month', billing: 'Next payment on August 28, 2025' },
      pro: { cost: '$15.00/month', billing: 'Next payment on August 28, 2025' }
    };
    
    return tierPricing[currentTier];
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'driver': return 'bg-gray-500';
      case 'builder': return 'bg-warehouse-warning';
      case 'pro': return 'bg-gradient-tech';
      default: return 'bg-gray-500';
    }
  };

  // Profile form handlers
  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setUserProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Profile saved:', userProfile);
      // In real app, show success toast
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
    setIsSavingProfile(false);
  };

  // Password form handlers
  const handlePasswordChange = (field: keyof PasswordForm, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
  };

  const isPasswordFormValid = () => {
    return passwordForm.currentPassword && 
           passwordForm.newPassword && 
           passwordForm.confirmPassword &&
           passwordForm.newPassword === passwordForm.confirmPassword &&
           passwordForm.newPassword.length >= 8;
  };

  const handleChangePassword = async () => {
    if (!isPasswordFormValid()) return;
    
    setIsChangingPassword(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setIsPasswordModalOpen(false);
      // In real app, show success toast
    } catch (error) {
      console.error('Failed to change password:', error);
    }
    setIsChangingPassword(false);
  };

  // Delete account handlers
  const isDeleteConfirmationValid = () => {
    return deleteConfirmation === 'DELETE';
  };

  const handleDeleteAccount = async () => {
    if (!isDeleteConfirmationValid()) return;
    
    setIsDeletingAccount(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Account deleted');
      // In real app, redirect to goodbye page or login
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
    setIsDeletingAccount(false);
  };

  const tierInfo = getTierInfo();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-12 pb-8">
    <div className="min-h-screen bg-gradient-warehouse">
      <div className="container mx-auto pt-24 pb-8 px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Account Management</h1>
          <p className="text-muted-foreground">Manage your profile, subscription, and account settings</p>
        </div>

        <div className="grid gap-8">
          {/* Profile Details Card */}
          <Card className="bg-card border-warehouse-steel shadow-warehouse">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Profile</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={userProfile.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleProfileChange('name', e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email Field (Read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={userProfile.email}
                    readOnly
                    className="bg-muted cursor-not-allowed"
                    placeholder="your.email@example.com"
                  />
                  <p className="text-xs text-muted-foreground">
                    Contact support to change your email address
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                {/* Change Password Modal */}
                <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center space-x-2">
                      <Shield className="w-4 h-4" />
                      <span>Change Password</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      {/* Current Password */}
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showPasswords.current ? "text" : "password"}
                            value={passwordForm.currentPassword}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePasswordChange('currentPassword', e.target.value)}
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                              e.preventDefault();
                              setShowPasswords(prev => ({ ...prev, current: !prev.current }));
                            }}
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                          >
                            {showPasswords.current ? 
                              <EyeOff className="w-4 h-4 text-muted-foreground" /> : 
                              <Eye className="w-4 h-4 text-muted-foreground" />
                            }
                          </button>
                        </div>
                      </div>

                      {/* New Password */}
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showPasswords.new ? "text" : "password"}
                            value={passwordForm.newPassword}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePasswordChange('newPassword', e.target.value)}
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                              e.preventDefault();
                              setShowPasswords(prev => ({ ...prev, new: !prev.new }));
                            }}
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                          >
                            {showPasswords.new ? 
                              <EyeOff className="w-4 h-4 text-muted-foreground" /> : 
                              <Eye className="w-4 h-4 text-muted-foreground" />
                            }
                          </button>
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showPasswords.confirm ? "text" : "password"}
                            value={passwordForm.confirmPassword}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePasswordChange('confirmPassword', e.target.value)}
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                              e.preventDefault();
                              setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }));
                            }}
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                          >
                            {showPasswords.confirm ? 
                              <EyeOff className="w-4 h-4 text-muted-foreground" /> : 
                              <Eye className="w-4 h-4 text-muted-foreground" />
                            }
                          </button>
                        </div>
                      </div>

                      {passwordForm.newPassword && passwordForm.confirmPassword && 
                       passwordForm.newPassword !== passwordForm.confirmPassword && (
                        <p className="text-sm text-destructive">Passwords do not match</p>
                      )}
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsPasswordModalOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleChangePassword}
                        disabled={!isPasswordFormValid() || isChangingPassword}
                      >
                        {isChangingPassword ? 'Changing...' : 'Change Password'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Save Changes Button */}
                <Button 
                  onClick={handleSaveProfile}
                  disabled={isSavingProfile}
                  className="bg-gradient-tech text-white"
                >
                  {isSavingProfile ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Subscription & Billing Card */}
          <Card className="bg-card border-warehouse-steel shadow-warehouse">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Subscription</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">You are currently on the</span>
                    <Badge className={`${getTierColor(currentTier)} text-white`}>
                      <Crown className="w-3 h-3 mr-1" />
                      {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)}
                    </Badge>
                    <span className="text-lg">plan.</span>
                  </div>
                  <div className="space-y-1 text-muted-foreground">
                    <p className="text-sm">Cost: <span className="font-medium">{tierInfo.cost}</span></p>
                    <p className="text-sm">Status: <span className="font-medium">{tierInfo.billing}</span></p>
                    <p className="text-sm">Garage Slots: <span className="font-medium">{limits.maxVehicles} vehicles</span></p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  className="w-full sm:w-auto bg-gradient-tech text-white"
                  onClick={() => window.location.href = '/plans'}
                >
                  Manage Subscription & Billing
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone Card */}
          <Card className="bg-card border-destructive shadow-warehouse">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                <span>Danger Zone</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-destructive/50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  These actions are permanent and cannot be undone.
                </AlertDescription>
              </Alert>

              {/* Delete Account Modal */}
              <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="flex items-center space-x-2">
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Account</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-destructive">Delete Account</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <Alert className="border-destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        This action will permanently delete your account and all associated data. 
                        This cannot be undone.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-2">
                      <Label htmlFor="deleteConfirmation">
                        Type <code className="bg-muted px-1 rounded text-destructive font-mono">DELETE</code> to confirm:
                      </Label>
                      <Input
                        id="deleteConfirmation"
                        value={deleteConfirmation}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeleteConfirmation(e.target.value)}
                        placeholder="Type DELETE here"
                        className={cn(
                          isDeleteConfirmationValid() && "border-destructive"
                        )}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsDeleteModalOpen(false);
                        setDeleteConfirmation('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={!isDeleteConfirmationValid() || isDeletingAccount}
                    >
                      {isDeletingAccount ? 'Deleting...' : 'Permanently Delete My Account'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Profile;