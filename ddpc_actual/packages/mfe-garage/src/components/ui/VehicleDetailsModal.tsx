// mfe-garage/src/components/ui/VehicleDetailsModal.tsx

import React, { useState, useEffect } from 'react';
import { Button } from "shared_ui/button";
import { Badge } from "shared_ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "shared_ui/card";
import { 
  X, 
  Save, 
  Settings, 
  Car, 
  Edit3
} from "lucide-react";

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
}

interface VehicleDetailsModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedVehicle: Vehicle) => void;
}

interface ExtendedVehicleData {
  // Basic Info
  nickname: string;
  make: string;
  model: string;
  year: number;
  color: string;
  vin: string;
  licensePlate: string;
  
  // Technical Specs
  engine: string;
  transmission: string;
  drivetrain: string;
  fuelType: string;
  
  // Status & Tracking
  status: "active" | "maintenance" | "completed";
  mileage: number;
  buildProgress: number;
  
  // Financial
  purchasePrice: number;
  currentValue: number;
  totalInvested: number;
  
  // Maintenance
  lastServiceDate: string;
  nextServiceDue: string;
  insuranceExpiry: string;
  registrationExpiry: string;
  
  // Notes & Media
  notes: string;
  image: string;
  tags: string[];
}

const VehicleDetailsModal: React.FC<VehicleDetailsModalProps> = ({
  vehicle,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<ExtendedVehicleData>({
    nickname: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    vin: '',
    licensePlate: '',
    engine: '',
    transmission: '',
    drivetrain: '',
    fuelType: 'Gasoline',
    status: 'active',
    mileage: 0,
    buildProgress: 0,
    purchasePrice: 0,
    currentValue: 0,
    totalInvested: 0,
    lastServiceDate: '',
    nextServiceDue: '',
    insuranceExpiry: '',
    registrationExpiry: '',
    notes: '',
    image: '',
    tags: []
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [isEditing, setIsEditing] = useState(false);

  // Initialize form data when vehicle changes
  useEffect(() => {
    if (vehicle) {
      setFormData({
        nickname: vehicle.name,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        color: '',
        vin: '',
        licensePlate: '',
        engine: '',
        transmission: '',
        drivetrain: '',
        fuelType: 'Gasoline',
        status: vehicle.status,
        mileage: 0,
        buildProgress: vehicle.buildProgress,
        purchasePrice: 0,
        currentValue: 0,
        totalInvested: 0,
        lastServiceDate: '',
        nextServiceDue: '',
        insuranceExpiry: '',
        registrationExpiry: '',
        notes: '',
        image: vehicle.image,
        tags: []
      });
    }
  }, [vehicle]);

  const handleInputChange = (field: keyof ExtendedVehicleData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (vehicle) {
      const updatedVehicle: Vehicle = {
        ...vehicle,
        name: formData.nickname,
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

  if (!vehicle) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-primary/10 to-primary/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                  <img 
                    src={formData.image} 
                    alt={formData.nickname}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold">
                    {isEditing ? (
                      <Input
                        value={formData.nickname}
                        onChange={(e) => handleInputChange('nickname', e.target.value)}
                        className="text-2xl font-bold bg-transparent border-none p-0 h-auto"
                      />
                    ) : (
                      formData.nickname
                    )}
                  </DialogTitle>
                  <p className="text-muted-foreground">
                    {formData.year} {formData.make} {formData.model}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={`${getStatusColor(formData.status)} text-white`}>
                  {formData.status}
                </Badge>
                {!isEditing ? (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <Settings className="w-4 h-4 mr-2" />
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
          </DialogHeader>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsList className="w-full justify-start px-6 py-2 bg-muted/50">
                <TabsTrigger value="basic" className="flex items-center space-x-2">
                  <Car className="w-4 h-4" />
                  <span>Basic Info</span>
                </TabsTrigger>
                <TabsTrigger value="specs" className="flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Specifications</span>
                </TabsTrigger>
                <TabsTrigger value="financial" className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4" />
                  <span>Financial</span>
                </TabsTrigger>
                <TabsTrigger value="maintenance" className="flex items-center space-x-2">
                  <Wrench className="w-4 h-4" />
                  <span>Maintenance</span>
                </TabsTrigger>
                <TabsTrigger value="notes" className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Notes & Media</span>
                </TabsTrigger>
              </TabsList>

              {/* Basic Info Tab */}
              <TabsContent value="basic" className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          <Label htmlFor="make">Make</Label>
                          <Input
                            id="make"
                            value={formData.make}
                            onChange={(e) => handleInputChange('make', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="model">Model</Label>
                          <Input
                            id="model"
                            value={formData.model}
                            onChange={(e) => handleInputChange('model', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="year">Year</Label>
                          <Input
                            id="year"
                            type="number"
                            value={formData.year}
                            onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="color">Color</Label>
                          <Input
                            id="color"
                            value={formData.color}
                            onChange={(e) => handleInputChange('color', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="vin">VIN</Label>
                        <Input
                          id="vin"
                          value={formData.vin}
                          onChange={(e) => handleInputChange('vin', e.target.value)}
                          disabled={!isEditing}
                          placeholder="Vehicle Identification Number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="licensePlate">License Plate</Label>
                        <Input
                          id="licensePlate"
                          value={formData.licensePlate}
                          onChange={(e) => handleInputChange('licensePlate', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Gauge className="w-5 h-5" />
                        <span>Status & Progress</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value) => handleInputChange('status', value)}
                          disabled={!isEditing}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="maintenance">In Maintenance</SelectItem>
                            <SelectItem value="completed">Project Complete</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="mileage">Current Mileage</Label>
                        <Input
                          id="mileage"
                          type="number"
                          value={formData.mileage}
                          onChange={(e) => handleInputChange('mileage', parseInt(e.target.value))}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label>Build Progress</Label>
                        <div className="space-y-2">
                          <Progress value={formData.buildProgress} className="h-3" />
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>0%</span>
                            <span className="font-medium">{formData.buildProgress}%</span>
                            <span>100%</span>
                          </div>
                          {isEditing && (
                            <Input
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
                </div>
              </TabsContent>

              {/* Specifications Tab */}
              <TabsContent value="specs" className="p-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Settings className="w-5 h-5" />
                      <span>Technical Specifications</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="engine">Engine</Label>
                          <Input
                            id="engine"
                            value={formData.engine}
                            onChange={(e) => handleInputChange('engine', e.target.value)}
                            disabled={!isEditing}
                            placeholder="e.g., 3.0L I6 Turbo"
                          />
                        </div>
                        <div>
                          <Label htmlFor="transmission">Transmission</Label>
                          <Input
                            id="transmission"
                            value={formData.transmission}
                            onChange={(e) => handleInputChange('transmission', e.target.value)}
                            disabled={!isEditing}
                            placeholder="e.g., 6-Speed Manual"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="drivetrain">Drivetrain</Label>
                          <Select
                            value={formData.drivetrain}
                            onValueChange={(value) => handleInputChange('drivetrain', value)}
                            disabled={!isEditing}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select drivetrain" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="FWD">Front-Wheel Drive</SelectItem>
                              <SelectItem value="RWD">Rear-Wheel Drive</SelectItem>
                              <SelectItem value="AWD">All-Wheel Drive</SelectItem>
                              <SelectItem value="4WD">Four-Wheel Drive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="fuelType">Fuel Type</Label>
                          <Select
                            value={formData.fuelType}
                            onValueChange={(value) => handleInputChange('fuelType', value)}
                            disabled={!isEditing}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Gasoline">Gasoline</SelectItem>
                              <SelectItem value="Diesel">Diesel</SelectItem>
                              <SelectItem value="Electric">Electric</SelectItem>
                              <SelectItem value="Hybrid">Hybrid</SelectItem>
                              <SelectItem value="E85">E85</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Financial Tab */}
              <TabsContent value="financial" className="p-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5" />
                      <span>Financial Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="purchasePrice">Purchase Price</Label>
                        <Input
                          id="purchasePrice"
                          type="number"
                          value={formData.purchasePrice}
                          onChange={(e) => handleInputChange('purchasePrice', parseFloat(e.target.value))}
                          disabled={!isEditing}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="currentValue">Current Value</Label>
                        <Input
                          id="currentValue"
                          type="number"
                          value={formData.currentValue}
                          onChange={(e) => handleInputChange('currentValue', parseFloat(e.target.value))}
                          disabled={!isEditing}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="totalInvested">Total Invested</Label>
                        <Input
                          id="totalInvested"
                          type="number"
                          value={formData.totalInvested}
                          onChange={(e) => handleInputChange('totalInvested', parseFloat(e.target.value))}
                          disabled={!isEditing}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Maintenance Tab */}
              <TabsContent value="maintenance" className="p-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Wrench className="w-5 h-5" />
                      <span>Maintenance & Legal</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="lastServiceDate">Last Service Date</Label>
                          <Input
                            id="lastServiceDate"
                            type="date"
                            value={formData.lastServiceDate}
                            onChange={(e) => handleInputChange('lastServiceDate', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="nextServiceDue">Next Service Due</Label>
                          <Input
                            id="nextServiceDue"
                            type="date"
                            value={formData.nextServiceDue}
                            onChange={(e) => handleInputChange('nextServiceDue', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="insuranceExpiry">Insurance Expiry</Label>
                          <Input
                            id="insuranceExpiry"
                            type="date"
                            value={formData.insuranceExpiry}
                            onChange={(e) => handleInputChange('insuranceExpiry', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="registrationExpiry">Registration Expiry</Label>
                          <Input
                            id="registrationExpiry"
                            type="date"
                            value={formData.registrationExpiry}
                            onChange={(e) => handleInputChange('registrationExpiry', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notes & Media Tab */}
              <TabsContent value="notes" className="p-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Camera className="w-5 h-5" />
                        <span>Vehicle Photo</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-4">
                        <div className="w-32 h-32 rounded-lg overflow-hidden bg-muted">
                          <img 
                            src={formData.image} 
                            alt={formData.nickname}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {isEditing && (
                          <div className="space-y-2">
                            <Button variant="outline">
                              <Upload className="w-4 h-4 mr-2" />
                              Upload New Photo
                            </Button>
                            <Input
                              placeholder="Or paste image URL"
                              value={formData.image}
                              onChange={(e) => handleInputChange('image', e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="w-5 h-5" />
                        <span>Notes</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={formData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Add notes about your vehicle, modifications, or anything else..."
                        rows={6}
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDetailsModal;
