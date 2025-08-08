// mfe-garage/src/components/Maintenance/AddEditRecordModal.tsx

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "shared_ui/dialog";
import { Button } from "shared_ui/button";
import { Input } from "shared_ui/input";
import { Label } from "shared_ui/label";
import { Textarea } from "shared_ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "shared_ui/select";

// Enhanced TypeScript interfaces
interface MaintenanceRecord {
  id?: string;
  date: string;
  type: "routine" | "repair" | "inspection" | "emergency";
  category: "engine" | "brakes" | "tires" | "electrical" | "transmission" | "other";
  description: string;
  cost: number;
  mileage: number;
  technician: string;
  location: string;
  notes?: string;
  status: "completed" | "scheduled" | "in-progress";
  nextDue?: string;
}

interface AddEditRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: Partial<MaintenanceRecord>) => void;
  initialData?: Partial<MaintenanceRecord>;
}

// Receives props to control its state and handle data submission.
export default function AddEditRecordModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData = {} 
}: AddEditRecordModalProps) {
    // --- STATE MANAGEMENT ---
    const [formData, setFormData] = useState<Partial<MaintenanceRecord>>(initialData);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmit && formData.description && formData.date && formData.type && formData.category) {
            onSubmit(formData);
            setFormData({}); // Reset form
        }
    };

    const handleInputChange = (field: keyof MaintenanceRecord, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // --- RENDER ---
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add Maintenance Record</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Date */}
                        <div className="space-y-2">
                            <Label htmlFor="date">Date *</Label>
                            <Input
                                id="date"
                                type="date"
                                value={formData.date || ""}
                                onChange={(e) => handleInputChange('date', e.target.value)}
                                required
                            />
                        </div>

                        {/* Type */}
                        <div className="space-y-2">
                            <Label htmlFor="type">Type *</Label>
                            <Select 
                                value={formData.type} 
                                onValueChange={(value) => handleInputChange('type', value)}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="routine">Routine</SelectItem>
                                    <SelectItem value="repair">Repair</SelectItem>
                                    <SelectItem value="inspection">Inspection</SelectItem>
                                    <SelectItem value="emergency">Emergency</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <Label htmlFor="category">Category *</Label>
                            <Select 
                                value={formData.category} 
                                onValueChange={(value) => handleInputChange('category', value)}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="engine">Engine</SelectItem>
                                    <SelectItem value="brakes">Brakes</SelectItem>
                                    <SelectItem value="tires">Tires</SelectItem>
                                    <SelectItem value="electrical">Electrical</SelectItem>
                                    <SelectItem value="transmission">Transmission</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Cost */}
                        <div className="space-y-2">
                            <Label htmlFor="cost">Cost ($)</Label>
                            <Input
                                id="cost"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={formData.cost || ""}
                                onChange={(e) => handleInputChange('cost', parseFloat(e.target.value) || 0)}
                            />
                        </div>

                        {/* Mileage */}
                        <div className="space-y-2">
                            <Label htmlFor="mileage">Mileage</Label>
                            <Input
                                id="mileage"
                                type="number"
                                placeholder="Current mileage"
                                value={formData.mileage || ""}
                                onChange={(e) => handleInputChange('mileage', parseInt(e.target.value) || 0)}
                            />
                        </div>

                        {/* Technician */}
                        <div className="space-y-2">
                            <Label htmlFor="technician">Technician</Label>
                            <Input
                                id="technician"
                                placeholder="Technician name"
                                value={formData.technician || ""}
                                onChange={(e) => handleInputChange('technician', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Input
                            id="description"
                            placeholder="e.g., Oil Change & Filter Replacement"
                            value={formData.description || ""}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            required
                        />
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                        <Label htmlFor="location">Service Location</Label>
                        <Input
                            id="location"
                            placeholder="e.g., AutoCare Plus"
                            value={formData.location || ""}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                        />
                    </div>

                    {/* Next Due */}
                    <div className="space-y-2">
                        <Label htmlFor="nextDue">Next Due Date</Label>
                        <Input
                            id="nextDue"
                            type="date"
                            value={formData.nextDue || ""}
                            onChange={(e) => handleInputChange('nextDue', e.target.value)}
                        />
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            placeholder="Additional notes or observations..."
                            value={formData.notes || ""}
                            onChange={(e) => handleInputChange('notes', e.target.value)}
                            rows={3}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            className="bg-primary hover:bg-primary/90"
                            disabled={!formData.description || !formData.date || !formData.type || !formData.category}
                        >
                            Add Record
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}