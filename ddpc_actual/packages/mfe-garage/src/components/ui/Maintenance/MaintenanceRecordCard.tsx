// mfe-garage/src/components/Maintenance/MaintenanceRecordCard.tsx

import React from 'react';
import { Card, CardContent } from "shared_ui/card";
import { Button } from "shared_ui/button";
import { Badge } from "shared_ui/badge";
import { Wrench } from "lucide-react";

// Interface matching the API response structure from db.json
interface MaintenanceRecord {
  entry_id: number;
  vehicle_id: string;
  date: string;
  mileage: number;
  title: string;
  category: string;
  labor_cost: number;
  notes?: string;
  status?: "completed" | "scheduled" | "in-progress";
  next_due?: string;
  technician?: string;
  location?: string;
}

interface MaintenanceRecordCardProps {
  record: MaintenanceRecord;
}

// This component receives a single 'record' object as a prop.
export default function MaintenanceRecordCard({ record }: MaintenanceRecordCardProps) {
  const getCategoryColor = (category: string) => {
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('oil') || categoryLower.includes('fluid')) return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    if (categoryLower.includes('brake')) return "bg-red-500/20 text-red-400 border-red-500/30";
    if (categoryLower.includes('tire')) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    if (categoryLower.includes('inspect')) return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "engine": return "";
      case "brakes": return "";
      case "tires": return "";
      case "electrical": return "";
      case "transmission": return "";
      default: return "";
    }
  };

  return (
    <Card className="bg-card border-border hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{record.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(record.category)}`}>
                      {record.category}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(record.date).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Labor Cost:</span>
                    <span>${record.labor_cost.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Mileage:</span>
                    <span>{record.mileage.toLocaleString()} mi</span>
                  </div>
                  {record.technician && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Technician:</span>
                      <span>{record.technician}</span>
                    </div>
                  )}
                  {record.location && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Location:</span>
                      <span>{record.location}</span>
                    </div>
                  )}
                  {record.notes && (
                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Notes:</span> {record.notes}
                      </p>
                    </div>
                  )}
                  {record.next_due && (
                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-amber-600 dark:text-amber-400">
                        <span className="font-medium">Next Due:</span> {new Date(record.next_due).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          <Button variant="outline" size="sm">
            <Wrench className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}