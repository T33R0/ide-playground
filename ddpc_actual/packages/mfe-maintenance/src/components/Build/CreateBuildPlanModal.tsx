// mfe-build-plans/src/components/Build/CreateBuildPlanModal.tsx

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "shared_ui/dialog";
import { Button } from "shared_ui/button";
import { Input } from "shared_ui/input";
import { Label } from "shared_ui/label";
import { Textarea } from "shared_ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "shared_ui/select";
import { Card, CardContent } from "shared_ui/card";
import { Badge } from "shared_ui/badge";
import { Car, Calendar, Target, DollarSign, Loader2 } from "lucide-react";
import { config } from "shared-config";

// TypeScript interfaces
interface Vehicle {
  vehicle_id: string;
  nickname?: string;
  make: string;
  model: string;
  year: number;
  image?: string;
}

interface BuildPlan {
  name: string;
  vehicleId: string;
  description?: string;
  targetDate?: string;
  estimatedCost?: number;
  priority: "low" | "medium" | "high";
}

interface CreateBuildPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (buildPlan: BuildPlan) => void;
  preSelectedVehicleId?: string;
}

export default function CreateBuildPlanModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  preSelectedVehicleId 
}: CreateBuildPlanModalProps) {
  // State management
  const [formData, setFormData] = useState<BuildPlan>({
    name: '',
    vehicleId: preSelectedVehicleId || '',
    description: '',
    targetDate: '',
    estimatedCost: 0,
    priority: 'medium'
  });
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch vehicles from API
  useEffect(() => {
    if (isOpen) {
      fetchVehicles();
    }
  }, [isOpen]);

  // Set pre-selected vehicle when provided
  useEffect(() => {
    if (preSelectedVehicleId) {
      setFormData(prev => ({ ...prev, vehicleId: preSelectedVehicleId }));
    }
  }, [preSelectedVehicleId]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await fetch(config.api.getUrl('vehicles'));
      
      if (!response.ok) {
        throw new Error('Failed to fetch vehicles');
      }
      
      const vehiclesData: Vehicle[] = await response.json();
      setVehicles(vehiclesData);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setErrors({ general: 'Failed to load vehicles. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof BuildPlan, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Build plan name is required';
    }

    if (!formData.vehicleId) {
      newErrors.vehicleId = 'Please select a vehicle';
    }

    if (formData.targetDate) {
      const targetDate = new Date(formData.targetDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (targetDate < today) {
        newErrors.targetDate = 'Target date cannot be in the past';
      }
    }

    if (formData.estimatedCost && formData.estimatedCost < 0) {
      newErrors.estimatedCost = 'Estimated cost cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    
    try {
      // Here you would typically make an API call to create the build plan
      // For now, we'll just call the onSubmit callback
      if (onSubmit) {
        await onSubmit(formData);
      }
      
      // Reset form and close modal
      setFormData({
        name: '',
        vehicleId: preSelectedVehicleId || '',
        description: '',
        targetDate: '',
        estimatedCost: 0,
        priority: 'medium'
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error creating build plan:', error);
      setErrors({ general: 'Failed to create build plan. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      vehicleId: preSelectedVehicleId || '',
      description: '',
      targetDate: '',
      estimatedCost: 0,
      priority: 'medium'
    });
    setErrors({});
    onClose();
  };

  const selectedVehicle = vehicles.find(v => v.vehicle_id === formData.vehicleId);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "medium": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "low": return "bg-green-500/10 text-green-400 border-green-500/20";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Create New Build Plan</span>
          </DialogTitle>
        </DialogHeader>

        {errors.general && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Build Plan Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Build Plan Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
              placeholder="e.g., Engine Performance Upgrade, Suspension Overhaul"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}
          </div>

          {/* Vehicle Selection */}
          <div className="space-y-2">
            <Label htmlFor="vehicle">Select Vehicle *</Label>
            {loading ? (
              <div className="flex items-center justify-center p-4 border rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span className="text-sm text-muted-foreground">Loading vehicles...</span>
              </div>
            ) : (
              <Select
                value={formData.vehicleId}
                onValueChange={(value: string) => handleInputChange('vehicleId', value)}
              >
                <SelectTrigger className={errors.vehicleId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Choose a vehicle from your garage" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.vehicle_id} value={vehicle.vehicle_id}>
                      <div className="flex items-center space-x-2">
                        <Car className="w-4 h-4" />
                        <span>
                          {vehicle.nickname ? `${vehicle.nickname} (${vehicle.year} ${vehicle.make} ${vehicle.model})` : `${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {errors.vehicleId && <p className="text-red-400 text-sm">{errors.vehicleId}</p>}
            
            {/* Selected Vehicle Preview */}
            {selectedVehicle && (
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Car className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">
                        {selectedVehicle.nickname || `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`}
                      </p>
                      {selectedVehicle.nickname && (
                        <p className="text-sm text-muted-foreground">
                          {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
              placeholder="Describe your build plan goals, expected modifications, and any specific requirements..."
              rows={3}
            />
          </div>

          {/* Target Date and Estimated Cost Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetDate" className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Target Completion Date</span>
              </Label>
              <Input
                id="targetDate"
                type="date"
                value={formData.targetDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('targetDate', e.target.value)}
                className={errors.targetDate ? 'border-red-500' : ''}
              />
              {errors.targetDate && <p className="text-red-400 text-sm">{errors.targetDate}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedCost" className="flex items-center space-x-1">
                <DollarSign className="w-4 h-4" />
                <span>Estimated Cost</span>
              </Label>
              <Input
                id="estimatedCost"
                type="number"
                min="0"
                step="0.01"
                value={formData.estimatedCost || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('estimatedCost', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className={errors.estimatedCost ? 'border-red-500' : ''}
              />
              {errors.estimatedCost && <p className="text-red-400 text-sm">{errors.estimatedCost}</p>}
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">Priority Level</Label>
            <Select
              value={formData.priority}
              onValueChange={(value: "low" | "medium" | "high") => handleInputChange('priority', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={getPriorityColor('low')}>Low</Badge>
                    <span>Nice to have</span>
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={getPriorityColor('medium')}>Medium</Badge>
                    <span>Planned upgrade</span>
                  </div>
                </SelectItem>
                <SelectItem value="high">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={getPriorityColor('high')}>High</Badge>
                    <span>Essential modification</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={submitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || loading}
              className="flex-1"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Target className="w-4 h-4 mr-2" />
                  Create Build Plan
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
