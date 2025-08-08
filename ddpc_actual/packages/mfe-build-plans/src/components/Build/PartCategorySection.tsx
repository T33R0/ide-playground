// mfe-build-plans/src/components/Build/PartCategorySection.tsx

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "shared_ui/card";
import { Badge } from "shared_ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "shared_ui/select";
import { Input } from "shared_ui/input";
import { Lock, Package, DollarSign, Calendar, Edit, Trash2, ExternalLink } from "lucide-react";
import { Button } from "shared_ui/button";

// Enhanced TypeScript interfaces (matching Lovable structure)
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

interface PartCategorySectionProps {
  categoryName: string;
  parts: Part[];
  userTier: "free" | "builder" | "pro";
}

// This component receives the category name, the list of parts, and the user's tier.
export default function PartCategorySection({ categoryName, parts, userTier }: PartCategorySectionProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      case "ordered": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "delivered": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "installed": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case "engine": return "🔧";
      case "suspension": return "🏁";
      case "wheels & tires": return "🚗";
      case "brakes": return "🛑";
      case "drivetrain": return "⚙️";
      case "exterior": return "🎨";
      case "interior": return "🪑";
      default: return "🔨";
    }
  };

  if (!parts || parts.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="text-2xl">{getCategoryIcon(categoryName)}</span>
            <span>{categoryName}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-4" />
            <p>No parts in this category yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getCategoryIcon(categoryName)}</span>
            <span>{categoryName}</span>
            <Badge variant="outline" className="ml-2">
              {parts.length} parts
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {parts.map(part => (
            <Card key={part.part_id} className="bg-card border-border shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <CardTitle className="text-xl">{part.part_name}</CardTitle>
                      <Badge 
                        variant="outline" 
                        className={`capitalize ${getStatusColor(part.status)}`}
                      >
                        {part.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Part #:</span> {part.part_number || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Brand:</span> {part.brand}
                      </div>
                      <div>
                        <span className="font-medium">Category:</span> {part.category}
                      </div>
                      <div>
                        <span className="font-medium">Warranty:</span> {part.warranty}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {/* Three-column layout inspired by Lovable */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Pricing Section */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Pricing</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Quantity:</span>
                        <span>{part.quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Unit Price:</span>
                        <span>${part.unitPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Total:</span>
                        <span>${part.totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Details Section */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Order Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Supplier:</span>
                        <span>{part.supplier}</span>
                      </div>
                      {part.orderDate && (
                        <div className="flex justify-between">
                          <span>Order Date:</span>
                          <span>{part.orderDate}</span>
                        </div>
                      )}
                      {part.deliveryDate && (
                        <div className="flex justify-between">
                          <span>Delivery:</span>
                          <span>{part.deliveryDate}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Notes Section */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Notes</h4>
                    <p className="text-sm text-muted-foreground">
                      {part.notes || "No notes available"}
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Supplier
                    </Button>
                  </div>
                </div>

                {/* Pro Features: Status and Cost Management */}
                {userTier === 'pro' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-4 border-t border-border">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Update Status</label>
                      <Select defaultValue={part.status}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="ordered">Ordered</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="installed">Installed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Update Cost</label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="$0.00"
                        defaultValue={part.totalPrice}
                      />
                    </div>
                  </div>
                )}

                {userTier !== 'pro' && (
                  <div className="mt-6 pt-4 border-t border-border text-center">
                    <p className="text-sm text-muted-foreground flex items-center justify-center space-x-1">
                      <Lock className="w-4 h-4" />
                      <span>Upgrade to Pro to manage part status and costs</span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}