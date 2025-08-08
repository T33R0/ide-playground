import React, { useState, useEffect } from "react";
import "./index.css";

import { Button } from "shared_ui/button";
import { Input } from "shared_ui/input";
import { Label } from "shared_ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "shared_ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "shared_ui/avatar";
import { Badge } from "shared_ui/badge";
import { Separator } from "shared_ui/separator";
import { Switch } from "shared_ui/switch";
import { RadioGroup, RadioGroupItem } from "shared_ui/radio-group";
import { useTier, tiers } from 'shared_ui/context/tier-context';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "shared_ui/dialog";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Settings,
  Shield,
  Bell,
  CreditCard,
  Key,
  Loader2,
} from "lucide-react";

// Profile Component (moved from host)
const Profile = () => {
  const { currentTier, setCurrentTier } = useTier();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio: "Automotive enthusiast and weekend mechanic. Love working on classic muscle cars and modern performance vehicles.",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Here you would typically save to your backend
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form data to original values
    setIsEditing(false);
  };

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const [notificationSettings, setNotificationSettings] = useState({
    projectUpdates: true,
    communityAlerts: true,
    promotionalOffers: false,
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    dataSharing: true,
  });

  const handlePasswordSave = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    console.log("New password saved:", passwordData.newPassword);
    // Here you would typically call an API to update the password
    // and then close the dialog, maybe show a success toast.
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
              <AvatarFallback className="text-lg">
                {formData.firstName[0]}{formData.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">
                {formData.firstName} {formData.lastName}
              </h1>
              <p className="text-muted-foreground">{formData.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">{currentTier} Plan</Badge>
                <Badge variant="outline">Verified</Badge>
              </div>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "outline" : "default"}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Information */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                {isEditing ? (
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("firstName", e.target.value)}
                  />
                ) : (
                  <p className="text-sm">{formData.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                {isEditing ? (
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("lastName", e.target.value)}
                  />
                ) : (
                  <p className="text-sm">{formData.lastName}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("email", e.target.value)}
                  />
                ) : (
                  <p className="text-sm">{formData.email}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {isEditing ? (
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("phone", e.target.value)}
                  />
                ) : (
                  <p className="text-sm">{formData.phone}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {isEditing ? (
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("location", e.target.value)}
                  />
                ) : (
                  <p className="text-sm">{formData.location}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span className="text-sm">Email Notifications</span>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-24 justify-center">
                      Configure
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Email Notifications</DialogTitle>
                      <DialogDescription>Manage your email notification preferences.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="project-updates">Project Updates</Label>
                        <Switch id="project-updates" checked={notificationSettings.projectUpdates} onCheckedChange={(checked) => setNotificationSettings(prev => ({...prev, projectUpdates: checked}))} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="community-alerts">Community Alerts</Label>
                        <Switch id="community-alerts" checked={notificationSettings.communityAlerts} onCheckedChange={(checked) => setNotificationSettings(prev => ({...prev, communityAlerts: checked}))} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="promotional-offers">Promotional Offers</Label>
                        <Switch id="promotional-offers" checked={notificationSettings.promotionalOffers} onCheckedChange={(checked) => setNotificationSettings(prev => ({...prev, promotionalOffers: checked}))} />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={() => console.log('Email settings saved', notificationSettings)}>Save</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm">Privacy Settings</span>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-24 justify-center">
                      Manage
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Privacy Settings</DialogTitle>
                      <DialogDescription>Control how your information is shared.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                      <div>
                        <Label>Profile Visibility</Label>
                        <RadioGroup defaultValue={privacySettings.profileVisibility} onValueChange={(value) => setPrivacySettings(prev => ({...prev, profileVisibility: value}))} className="mt-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="public" id="public" />
                            <Label htmlFor="public">Public</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="private" id="private" />
                            <Label htmlFor="private">Private</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="data-sharing">Allow data sharing for analytics</Label>
                        <Switch id="data-sharing" checked={privacySettings.dataSharing} onCheckedChange={(checked) => setPrivacySettings(prev => ({...prev, dataSharing: checked}))} />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={() => console.log('Privacy settings saved', privacySettings)}>Save</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  <span className="text-sm">Change Password</span>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-24 justify-center">
                      Update
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>
                        Enter your current and new password. Click save when you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="currentPassword" className="text-right">
                          Current
                        </Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePasswordChange("currentPassword", e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="newPassword" className="text-right">
                          New
                        </Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePasswordChange("newPassword", e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="confirmPassword" className="text-right">
                          Confirm
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePasswordChange("confirmPassword", e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={handlePasswordSave}>Save changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span className="text-sm">Billing & Subscription</span>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-24 justify-center">
                      View
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Billing & Subscription</DialogTitle>
                      <DialogDescription>View your current plan and explore upgrade options.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 grid gap-6 sm:grid-cols-1 md:grid-cols-3">
                      {tiers.map((tier) => (
                        <Card key={tier.id} className={`flex flex-col ${currentTier === tier.id ? 'border-primary' : ''}`}>
                          <CardHeader>
                            <CardTitle>{tier.name}</CardTitle>
                            <p className="text-2xl font-bold">{tier.price}</p>
                          </CardHeader>
                          <CardContent className="flex-1">
                            <p className="text-muted-foreground">{tier.description}</p>
                            <ul className="mt-4 space-y-2">
                              {tier.features.map((feature) => (
                                <li key={feature} className="flex items-center gap-2">
                                  <span className="text-green-500">✔</span>
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                          <CardFooter>
                            <Button 
                              className="w-full" 
                              disabled={currentTier === tier.id}
                              onClick={() => setCurrentTier(tier.id)}
                            >
                              {currentTier === tier.id ? 'Current Plan' : 'Select Plan'}
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
        
        </Card>
      </div>

      {/* Bio Section */}
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            {isEditing ? (
              <textarea
                id="bio"
                className="w-full min-h-[100px] p-3 border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                value={formData.bio}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange("bio", e.target.value)}
                placeholder="Tell us about yourself and your automotive interests..."
              />
            ) : (
              <p className="text-sm text-muted-foreground">{formData.bio}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Save/Cancel buttons when editing */}
      {isEditing && (
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};

// Main Account App Component
const AccountApp: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Ensure CSS is fully loaded before rendering
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Force style recalculation
      document.body.offsetHeight;
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-12 pb-8">
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-12 pb-8">
      <Profile />
    </div>
  );
};

export default AccountApp;