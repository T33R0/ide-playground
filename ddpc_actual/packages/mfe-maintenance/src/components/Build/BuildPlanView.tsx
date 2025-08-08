// mfe-build-plans/src/components/Build/BuildPlanView.tsx

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "shared_ui/card";
import { Button } from "shared_ui/button";
import { Badge } from "shared_ui/badge";
import { Plus, DollarSign, Package, AlertCircle, CheckCircle, Search, Calendar, Wrench } from "lucide-react";
import { Input } from "shared_ui/input";
import PartCategorySection from './PartCategorySection';
import AddPartModal from './AddPartModal';

// Enhanced TypeScript interfaces (inspired by Lovable's comprehensive structure)
interface Part {
  part_id: string;
  part_name: string;
  part_number?: string;
  brand: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: "pending" | "ordered" | "delivered" | "installed";
  orderDate?: string;
  deliveryDate?: string;
  supplier: string;
  notes?: string;
  warranty: string;
  category: string;
  priority: "low" | "medium" | "high";
  dateAdded: string;
}

interface BuildPlan {
  id: string;
  name: string;
  vehicle: string;
  description: string;
  startDate: string;
  targetDate: string;
  totalCost: number;
  progress: number;
  status: "planning" | "in-progress" | "completed" | "on-hold";
}

interface BuildPlanData {
  [category: string]: Part[];
}

interface BuildPlanViewProps {
  vehicleId: string;
  userTier: "free" | "builder" | "pro";
  buildPlan?: BuildPlan;
}

// Enhanced mock data inspired by Lovable's comprehensive structure
const mockBuildPlanData: BuildPlanData = {
  "Engine": [
    {
      part_id: "1",
      part_name: "Performance Camshaft",
      part_number: "CAM-456-PERF",
      brand: "SpeedMaster",
      quantity: 1,
      unitPrice: 1200.00,
      totalPrice: 1200.00,
      status: "delivered",
      orderDate: "2024-01-05",
      deliveryDate: "2024-01-12",
      supplier: "Performance Parts Plus",
      notes: "High-lift performance cam for increased power",
      warranty: "2 years",
      category: "Engine",
      priority: "high",
      dateAdded: "2024-01-10"
    },
    {
      part_id: "2", 
      part_name: "Cold Air Intake System",
      part_number: "AEM-21-8030",
      brand: "AEM",
      quantity: 1,
      unitPrice: 299.99,
      totalPrice: 299.99,
      status: "installed",
      orderDate: "2024-01-08",
      deliveryDate: "2024-01-15",
      supplier: "AEM Performance",
      notes: "Expecting 15-20hp gain",
      warranty: "1 year",
      category: "Engine",
      priority: "high",
      dateAdded: "2024-01-12"
    },
    {
      part_id: "3",
      part_name: "Performance Gasket Set",
      part_number: "GAS-123-PERF",
      brand: "Fel-Pro",
      quantity: 1,
      unitPrice: 500.00,
      totalPrice: 500.00,
      status: "ordered",
      orderDate: "2024-01-15",
      supplier: "AutoZone",
      notes: "Complete engine gasket kit",
      warranty: "90 days",
      category: "Engine",
      priority: "medium",
      dateAdded: "2024-01-15"
    }
  ],
  "Suspension": [
    {
      part_id: "4",
      part_name: "Coilover Kit",
      part_number: "BC-BR-RS",
      brand: "BC Racing",
      quantity: 4,
      unitPrice: 374.99,
      totalPrice: 1499.96,
      status: "pending",
      supplier: "BC Racing Direct",
      notes: "Adjustable dampening, 32-way adjustment",
      warranty: "2 years",
      category: "Suspension",
      priority: "medium",
      dateAdded: "2024-01-15"
    }
  ],
  "Wheels & Tires": [
    {
      part_id: "5",
      part_name: "Apex ARC-8 Wheels",
      part_number: "ARC8-18x9-ET30",
      brand: "Apex Race Parts",
      quantity: 4,
      unitPrice: 300.00,
      totalPrice: 1200.00,
      status: "installed",
      orderDate: "2024-01-01",
      deliveryDate: "2024-01-05",
      supplier: "Apex Race Parts",
      notes: "Flow-formed construction, 18x9 ET30",
      warranty: "1 year",
      category: "Wheels & Tires",
      priority: "medium",
      dateAdded: "2024-01-05"
    }
  ],
  "Brakes": [
    {
      part_id: "6",
      part_name: "Big Brake Kit",
      part_number: "STOPTECH-83.137.4700",
      brand: "StopTech",
      quantity: 1,
      unitPrice: 2499.99,
      totalPrice: 2499.99,
      status: "pending",
      supplier: "StopTech Performance",
      notes: "6-piston front, 4-piston rear calipers",
      warranty: "3 years",
      category: "Brakes",
      priority: "high",
      dateAdded: "2024-01-20"
    }
  ]
};

// This component receives the ID of the vehicle it needs to display a build plan for.
export default function BuildPlanView({ vehicleId, userTier, buildPlan }: BuildPlanViewProps) {
    const [buildPlanData, setBuildPlanData] = useState<BuildPlanData>(mockBuildPlanData);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
  
    useEffect(() => {
      // Load mock data - replace with API call for vehicleId
      setBuildPlanData(mockBuildPlanData);
    }, [vehicleId]);

    // Utility functions
    const handleAddPart = (newPart: Partial<Part>) => {
      const part: Part = {
        part_id: Date.now().toString(),
        part_name: newPart.part_name!,
        part_number: newPart.part_number,
        brand: newPart.brand || "Unknown",
        quantity: newPart.quantity || 1,
        unitPrice: newPart.unitPrice || 0,
        totalPrice: (newPart.quantity || 1) * (newPart.unitPrice || 0),
        status: "pending",
        supplier: newPart.supplier || "",
        notes: newPart.notes,
        warranty: newPart.warranty || "N/A",
        category: newPart.category || "Other",
        priority: newPart.priority || "medium",
        dateAdded: new Date().toISOString().split('T')[0]
      };
      
      const category = newPart.category || "Other";
      setBuildPlanData(prev => ({
        ...prev,
        [category]: [...(prev[category] || []), part]
      }));
      setIsModalOpen(false);
    };

    // Get all parts flattened for calculations and filtering
    const allParts = Object.values(buildPlanData).flat();
    
    // Filter parts based on search term
    const filteredParts = searchTerm
      ? allParts.filter(part =>
          part.part_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          part.part_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          part.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          part.supplier.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : allParts;

    // Rebuild filtered data by category
    const filteredBuildPlanData: BuildPlanData = {};
    filteredParts.forEach(part => {
      if (!filteredBuildPlanData[part.category]) {
        filteredBuildPlanData[part.category] = [];
      }
      filteredBuildPlanData[part.category].push(part);
    });

    // Calculations (using enhanced Lovable structure)
    const totalParts = allParts.length;
    const totalCost = allParts.reduce((sum, part) => sum + part.totalPrice, 0);
    const installedParts = allParts.filter(part => part.status === "installed").length;
    const pendingParts = allParts.filter(part => part.status === "pending" || part.status === "ordered").length;
  
    // If the user is on the free tier, show an upsell message instead of the component.
    if (userTier === 'free') {
      return (
        <Card className="bg-card border-border">
          <CardContent className="p-8 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-4">Plan Your Dream Build</h2>
            <p className="text-muted-foreground mb-6">
              Upgrade to the Builder Tier to create and manage detailed modification plans with parts tracking, cost estimation, and progress monitoring.
            </p>
            <Button className="bg-primary hover:bg-primary/90">
              Upgrade Now
            </Button>
          </CardContent>
        </Card>
      );
    }
  
    return (
      <div className="space-y-6">
        {/* Header with Add Part Button */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Parts & Details</h2>
            <p className="text-muted-foreground">Build Plan: {buildPlan?.name || "Custom Build"}</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary/90 shadow-lg">
            <Plus className="w-5 h-5 mr-2" />
            Add Part
          </Button>
        </div>

        {/* Summary Cards (inspired by Lovable) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-card border-border shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Parts</p>
                  <p className="text-2xl font-bold">{totalParts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Cost</p>
                  <p className="text-2xl font-bold">${totalCost.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Wrench className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Installed</p>
                  <p className="text-2xl font-bold">{installedParts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{pendingParts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter (inspired by Lovable) */}
        <Card className="bg-card border-border shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Input
                placeholder="Search parts, part numbers, brands, or suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Show search results or category sections */}
        <div className="space-y-6">
          {searchTerm ? (
            // Show search results
            <Card className="bg-card border-border shadow-lg">
              <CardHeader>
                <CardTitle>
                  Search Results ({filteredParts.length} parts found)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredParts.length > 0 ? (
                  <div className="space-y-4">
                    {Object.keys(filteredBuildPlanData).map(category => (
                      <PartCategorySection
                        key={category}
                        categoryName={category}
                        parts={filteredBuildPlanData[category]}
                        userTier={userTier}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-4" />
                    <p>No parts found matching "{searchTerm}"</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            // Show all categories
            Object.keys(buildPlanData).map(category => (
              <PartCategorySection
                key={category}
                categoryName={category}
                parts={buildPlanData[category]}
                userTier={userTier}
              />
            ))
          )}
        </div>

        {/* Add Part Modal */}
        <AddPartModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddPart}
        />
      </div>
    );
  }