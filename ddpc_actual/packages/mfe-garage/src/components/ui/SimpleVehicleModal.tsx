// mfe-garage/src/components/ui/SimpleVehicleModal.tsx

import React, { useState, useEffect } from 'react';
import { Button } from "shared_ui/button";
import { Badge } from "shared_ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "shared_ui/card";
import { X, Save, Edit3, Car, Search } from "lucide-react";
import { useRef } from 'react';

interface Vehicle {
  id: string;
  name: string;
  make: string;
  model: string;
  year: number;
  image: string;
  status: "active" | "maintenance" | "completed";
  buildProgress: number;
  lastUpdated: string;
  dateAdded: string;
  [key: string]: any;
}

interface SimpleVehicleModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedVehicle: Vehicle) => void;
}

const SimpleVehicleModal: React.FC<SimpleVehicleModalProps> = ({
  vehicle,
  isOpen,
  onClose,
  onSave
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    status: 'active' as 'active' | 'maintenance' | 'completed',
    buildProgress: 0,
    image: '',
    // Extended fields
    color: '',
    vin: '',
    mileage: 0,
    notes: ''
  });

  useEffect(() => {
    if (vehicle) {
      setFormData({
        name: vehicle.name,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        status: vehicle.status,
        buildProgress: vehicle.buildProgress,
        image: vehicle.image,
        color: '',
        vin: '',
        mileage: 0,
        notes: ''
      });
    }
  }, [vehicle]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (vehicle) {
      const updatedVehicle: Vehicle = {
        ...vehicle,
        name: formData.name,
        make: formData.make,
        model: formData.model,
        year: formData.year,
        status: formData.status,
        buildProgress: formData.buildProgress,
        image: formData.image,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      onSave(updatedVehicle);
      setIsEditing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "maintenance": return "bg-yellow-500";
      case "completed": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  // Handler for clicking the image to change it
  const handleImageClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handler for file input change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler for Discover button
  const handleDiscoverClick = () => {
    // This would typically open a discovery modal or navigate to a discover page
    console.log('Discover button clicked');
  };

  if (!isOpen || !vehicle) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] mx-4 bg-background rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="flex items-center space-x-4">
            <div 
              className={`relative w-16 h-16 rounded-lg overflow-hidden bg-muted ${
                isEditing ? 'cursor-pointer group' : ''
              }`}
              onClick={handleImageClick}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <img 
                src={formData.image} 
                alt={formData.name}
                className="w-full h-full object-cover"
              />
              {isEditing && isHovering && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-xs text-center p-2">
                    Click to change
                  </span>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="text-2xl font-bold bg-transparent border-b border-primary/30 focus:border-primary outline-none"
                  />
                ) : (
                  formData.name
                )}
              </h2>
              <p className="text-muted-foreground">
                {formData.year} {formData.make} {formData.model}
              </p>
            </div>
          </div>
          
          {/* Discover Button */}
          <div className="flex-1 flex justify-center">
            <Button 
              variant="outline" 
              className="px-4 py-2 flex items-center space-x-2 bg-transparent border-dashed"
              onClick={handleDiscoverClick}
              disabled={!isEditing}
            >
              <Search className="w-4 h-4" />
              <span>Discover</span>
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className={`${getStatusColor(formData.status)} text-white`}>
              {formData.status}
            </Badge>
            {!isEditing ? (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Car className="w-5 h-5" />
                  <span>Vehicle Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Make</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.make}
                        onChange={(e) => handleInputChange('make', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      />
                    ) : (
                      <p className="px-3 py-2 bg-muted rounded-md">{formData.make}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Model</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.model}
                        onChange={(e) => handleInputChange('model', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      />
                    ) : (
                      <p className="px-3 py-2 bg-muted rounded-md">{formData.model}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Year</label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={formData.year}
                        onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      />
                    ) : (
                      <p className="px-3 py-2 bg-muted rounded-md">{formData.year}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Color</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.color}
                        onChange={(e) => handleInputChange('color', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background"
                        placeholder="Vehicle color"
                      />
                    ) : (
                      <p className="px-3 py-2 bg-muted rounded-md">{formData.color || 'Not specified'}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">VIN</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.vin}
                      onChange={(e) => handleInputChange('vin', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      placeholder="Vehicle Identification Number"
                    />
                  ) : (
                    <p className="px-3 py-2 bg-muted rounded-md">{formData.vin || 'Not specified'}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Status & Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Status & Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  {isEditing ? (
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    >
                      <option value="active">Active</option>
                      <option value="maintenance">In Maintenance</option>
                      <option value="completed">Project Complete</option>
                    </select>
                  ) : (
                    <p className="px-3 py-2 bg-muted rounded-md capitalize">{formData.status}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Current Mileage</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={formData.mileage}
                      onChange={(e) => handleInputChange('mileage', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      placeholder="Current mileage"
                    />
                  ) : (
                    <p className="px-3 py-2 bg-muted rounded-md">{formData.mileage || 'Not specified'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Build Progress</label>
                  <div className="space-y-2">
                    <div className="w-full bg-secondary rounded-full h-3">
                      <div
                        className="bg-primary h-3 rounded-full transition-all duration-300"
                        style={{ width: `${formData.buildProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>0%</span>
                      <span className="font-medium">{formData.buildProgress}%</span>
                      <span>100%</span>
                    </div>
                    {isEditing && (
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={formData.buildProgress}
                        onChange={(e) => handleInputChange('buildProgress', parseInt(e.target.value))}
                        className="w-full"
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background resize-none"
                    rows={4}
                    placeholder="Add notes about your vehicle, modifications, or anything else..."
                  />
                ) : (
                  <p className="px-3 py-2 bg-muted rounded-md min-h-[100px]">
                    {formData.notes || 'No notes added yet.'}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleVehicleModal;
