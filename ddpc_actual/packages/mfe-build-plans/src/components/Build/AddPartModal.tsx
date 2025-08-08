// mfe-build-plans/src/components/Build/AddPartModal.tsx

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "shared_ui/dialog";
import { Button } from "shared_ui/button";
import { Input } from "shared_ui/input";
import { Label } from "shared_ui/label";
import { Textarea } from "shared_ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "shared_ui/select";

// Enhanced TypeScript interfaces (matching Lovable structure)
interface Part {
  part_id?: string;
  part_name: string;
  part_number?: string;
  brand?: string;
  quantity?: number;
  unitPrice?: number;
  totalPrice?: number;
  status?: "pending" | "ordered" | "delivered" | "installed";
  orderDate?: string;
  deliveryDate?: string;
  supplier?: string;
  notes?: string;
  warranty?: string;
  category?: string;
  priority?: "low" | "medium" | "high";
  dateAdded?: string;
}

interface AddPartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: Partial<Part>) => void;
}

export default function AddPartModal({ isOpen, onClose, onSubmit }: AddPartModalProps) {
    // State to manage form inputs (enhanced with Lovable structure)
    const [formData, setFormData] = useState<Partial<Part>>({
      part_name: '',
      part_number: '',
      brand: '',
      quantity: 1,
      unitPrice: 0,
      category: 'Engine',
      status: 'pending',
      priority: 'medium',
      supplier: '',
      warranty: '',
      notes: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmit && formData.part_name && formData.category) {
            onSubmit(formData);
            setFormData({
              part_name: '',
              part_number: '',
              brand: '',
              quantity: 1,
              unitPrice: 0,
              category: 'Engine',
              status: 'pending',
              priority: 'medium',
              supplier: '',
              warranty: '',
              notes: ''
            }); // Reset form
        }
    };

    const handleInputChange = (field: keyof Part, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const categories = [
      "Engine",
      "Drivetrain", 
      "Suspension",
      "Brakes",
      "Wheels & Tires",
      "Exterior",
      "Interior",
      "Electrical",
      "Exhaust",
      "Cooling",
      "Other"
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add Part to Build Plan</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Part Name */}
                        <div className="space-y-2">
                            <Label htmlFor="part_name">Part Name *</Label>
                            <Input
                                id="part_name"
                                placeholder="e.g., Apex ARC-8 Wheels"
                                value={formData.part_name || ""}
                                onChange={(e) => handleInputChange('part_name', e.target.value)}
                                required
                            />
                        </div>

                        {/* Part Number */}
                        <div className="space-y-2">
                            <Label htmlFor="part_number">Part Number</Label>
                            <Input
                                id="part_number"
                                placeholder="e.g., ARC8-18x9-ET30"
                                value={formData.part_number || ""}
                                onChange={(e) => handleInputChange('part_number', e.target.value)}
                            />
                        </div>

                        {/* Brand */}
                        <div className="space-y-2">
                            <Label htmlFor="brand">Brand *</Label>
                            <Input
                                id="brand"
                                placeholder="e.g., Apex Race Parts"
                                value={formData.brand || ""}
                                onChange={(e) => handleInputChange('brand', e.target.value)}
                                required
                            />
                        </div>

                        {/* Quantity */}
                        <div className="space-y-2">
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input
                                id="quantity"
                                type="number"
                                min="1"
                                placeholder="1"
                                value={formData.quantity || 1}
                                onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                            />
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
                                    {categories.map(category => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Priority */}
                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority</Label>
                            <Select 
                                value={formData.priority} 
                                onValueChange={(value) => handleInputChange('priority', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Unit Price */}
                        <div className="space-y-2">
                            <Label htmlFor="unitPrice">Unit Price ($)</Label>
                            <Input
                                id="unitPrice"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={formData.unitPrice || ""}
                                onChange={(e) => handleInputChange('unitPrice', parseFloat(e.target.value) || 0)}
                            />
                        </div>

                        {/* Status */}
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select 
                                value={formData.status} 
                                onValueChange={(value) => handleInputChange('status', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="ordered">Ordered</SelectItem>
                                    <SelectItem value="delivered">Delivered</SelectItem>
                                    <SelectItem value="installed">Installed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Supplier */}
                    <div className="space-y-2">
                        <Label htmlFor="supplier">Supplier</Label>
                        <Input
                            id="supplier"
                            placeholder="e.g., Performance Parts Plus"
                            value={formData.supplier || ""}
                            onChange={(e) => handleInputChange('supplier', e.target.value)}
                        />
                    </div>

                    {/* Warranty */}
                    <div className="space-y-2">
                        <Label htmlFor="warranty">Warranty</Label>
                        <Input
                            id="warranty"
                            placeholder="e.g., 2 years"
                            value={formData.warranty || ""}
                            onChange={(e) => handleInputChange('warranty', e.target.value)}
                        />
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            placeholder="Additional notes, specifications, or installation requirements..."
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
                            disabled={!formData.part_name || !formData.category || !formData.brand}
                        >
                            Add Part
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}