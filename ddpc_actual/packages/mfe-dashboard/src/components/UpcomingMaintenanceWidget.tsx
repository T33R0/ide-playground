import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from 'shared_ui/card';
import { Badge } from 'shared_ui/badge';
import { Button } from 'shared_ui/button';
import { Wrench, AlertTriangle, Clock, ArrowRight, Plus } from 'lucide-react';
import { vehiclesUrl, vehicleMaintenanceUrl } from 'shared_ui/api';

interface MaintenanceReminder {
  id: string;
  vehicleNickname: string;
  serviceType: string;
  dueIn?: number; // miles until due (positive) or miles overdue (negative)
  dueDate?: string;
  isOverdue: boolean;
}

interface Vehicle {
  id: number;
  user_id: number;
  year: number;
  make: string;
  model: string;
  trim?: string;
  nickname?: string;
  status: 'Active' | 'Sold' | 'Project';
  visibility: 'Public' | 'Private';
  photo_url?: string;
  created_at: string;
  updated_at: string;
}

interface MaintenanceLog {
  id: number;
  vehicle_id: number;
  date_performed: string;
  mileage?: number;
  title: string;
  description?: string;
  cost?: number;
  category?: string;
}

export const UpcomingMaintenanceWidget: React.FC = () => {
  const [maintenanceReminders, setMaintenanceReminders] = useState<MaintenanceReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Using centralized API helpers from shared-ui

  useEffect(() => {
    const fetchMaintenanceData = async () => {
      try {
        setLoading(true);
        
        // Fetch vehicles
        const vehicleResponse = await fetch(vehiclesUrl());
        if (!vehicleResponse.ok) {
          throw new Error('Failed to fetch vehicles');
        }
        const vehicles: Vehicle[] = await vehicleResponse.json();

        // Fetch maintenance logs for all vehicles
        const maintenanceLogs: MaintenanceLog[] = [];
        for (const vehicle of vehicles) {
          try {
            const maintenanceResponse = await fetch(vehicleMaintenanceUrl(vehicle.id));
            if (maintenanceResponse.ok) {
              const logs = await maintenanceResponse.json();
              maintenanceLogs.push(...logs);
            }
          } catch (error) {
            console.warn(`Failed to fetch maintenance for vehicle ${vehicle.id}:`, error);
          }
        }

        // Generate maintenance reminders based on typical intervals
        const reminders: MaintenanceReminder[] = [];
        
        vehicles.forEach((vehicle) => {
          const vehicleLogs = maintenanceLogs.filter((log: MaintenanceLog) => log.vehicle_id === vehicle.id);
          const lastOilChange = vehicleLogs.find((log: MaintenanceLog) => log?.description?.toLowerCase()?.includes('oil'));
          
          // Unique base for reminder IDs
          const vehicleId = vehicle.id.toString();
          
          // Oil change reminder (every 5000 miles)
          if (lastOilChange) {
            // Use the last maintenance mileage as reference (guard undefined)
            const lastMileage = lastOilChange.mileage ?? 0;
            const currentMileage = lastMileage + 2000; // Simulate current mileage
            const milesSinceOilChange = currentMileage - lastMileage;
            const dueIn = 5000 - milesSinceOilChange;
            reminders.push({
              id: `${vehicleId}-oil-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              vehicleNickname: vehicle.nickname || 'My Vehicle',
              serviceType: 'Oil Change',
              dueIn,
              isOverdue: dueIn < 0
            });
          } else {
            // No oil change record, assume due soon
            reminders.push({
              id: `${vehicleId}-oil-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              vehicleNickname: vehicle.nickname || 'My Vehicle',
              serviceType: 'Oil Change',
              dueIn: 1000,
              isOverdue: false
            });
          }

          // Add other common maintenance items with unique IDs
          const timestamp = Date.now();
          const randomSuffix = Math.random().toString(36).substr(2, 9);
          
          reminders.push(
            {
              id: `${vehicleId}-tire-${timestamp}-${randomSuffix}-1`,
              vehicleNickname: vehicle.nickname || 'My Vehicle',
              serviceType: 'Tire Rotation',
              dueIn: Math.floor(Math.random() * 3000) + 500, // Random for demo
              isOverdue: false
            },
            {
              id: `${vehicleId}-brake-${timestamp}-${randomSuffix}-2`,
              vehicleNickname: vehicle.nickname || 'My Vehicle',
              serviceType: 'Brake Inspection',
              dueIn: Math.floor(Math.random() * 5000) - 1000, // Random, some overdue
              isOverdue: Math.random() > 0.7
            }
          );
        });

        // Sort by urgency (overdue first, then by due distance)
        reminders.sort((a, b) => {
          if (a.isOverdue && !b.isOverdue) return -1;
          if (!a.isOverdue && b.isOverdue) return 1;
          return (a.dueIn || 0) - (b.dueIn || 0);
        });

        setMaintenanceReminders(reminders);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenanceData();
  }, []);

  // Load all reminders but display with proper scrolling

  const formatDueText = (reminder: MaintenanceReminder) => {
    if (reminder.isOverdue) {
      return `overdue by ${Math.abs(reminder.dueIn || 0)} miles`;
    } else {
      return `due in ${reminder.dueIn} miles`;
    }
  };

  const getBadgeVariant = (isOverdue: boolean) => {
    return isOverdue ? 'destructive' : 'secondary';
  };

  const getStatusIcon = (isOverdue: boolean) => {
    return isOverdue ? (
      <AlertTriangle className="h-4 w-4 text-red-500" />
    ) : (
      <Clock className="h-4 w-4 text-yellow-500" />
    );
  };

  const handleHeaderClick = () => {
    window.location.href = '/maintenance';
  };

  const handleMaintenanceClick = (id: string) => {
    window.location.href = `/maintenance?reminderId=${id}`;
  };

  return (
    <Card className="flex flex-col border-slate-700 bg-slate-900/50" style={{ height: '100%' }}>
      <CardHeader className="pb-3 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white cursor-pointer hover:text-amber-300 transition-colors" onClick={handleHeaderClick}>
            <Wrench className="h-4 w-4 text-amber-400" />
            <span>Upcoming Maintenance</span>
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-amber-400 hover:text-white hover:bg-amber-900/20 h-6 px-2"
            onClick={() => window.location.href = '/maintenance'}
          >
            View All
          </Button>
        </div>
        <p className="text-sm text-slate-400 mt-1">
          {maintenanceReminders.length} {maintenanceReminders.length === 1 ? 'reminder' : 'reminders'} in the next 30 days
        </p>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col">
        {loading ? (
          // Loading State
          <div className="text-center py-8">
            <Wrench className="h-8 w-8 text-slate-600 mx-auto mb-2 animate-pulse" />
            <p className="text-slate-400 text-sm">Loading maintenance data...</p>
          </div>
        ) : error ? (
          // Error State
          <div className="text-center py-8">
            <Wrench className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-400 text-sm mb-2">Failed to load maintenance data</p>
            <p className="text-slate-500 text-xs">{error}</p>
          </div>
        ) : maintenanceReminders.length === 0 ? (
          // Empty State
          <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              <Wrench className="h-12 w-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No upcoming maintenance</p>
              <p className="text-slate-500 text-xs mt-1">Add a maintenance log to get started</p>
            </div>
            <div className="p-4 border-t border-slate-700">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full bg-amber-600/20 border-amber-500/50 text-amber-300 hover:bg-amber-600/40 hover:text-white"
                onClick={() => window.location.href = '/maintenance/add'}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Maintenance
              </Button>
            </div>
          </div>
        ) : (
          // Maintenance List
          <div className="flex flex-col" style={{ height: '100%' }}>
            <div 
              className="overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent hover:scrollbar-thumb-slate-500 transition-colors" 
              style={{
                flex: '1',
                minHeight: '0',
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgb(75, 85, 99) transparent',
              }}
            >
              <div className="grid gap-3 auto-rows-fr" style={{ gridTemplateRows: 'repeat(3, minmax(0, 1fr))' }}>
                {maintenanceReminders.length > 0 ? (
                  maintenanceReminders.map((reminder, index) => (
                    <div 
                      key={`${reminder.id}-${index}`}
                      className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:bg-slate-700/50 transition-colors cursor-pointer h-full min-h-[4.5rem]"
                      onClick={() => handleMaintenanceClick(reminder.id)}
                    >
                      {/* Status Icon */}
                      <div className={`w-10 h-10 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center ${
                        reminder.isOverdue ? 'bg-red-900/30' : 'bg-amber-900/30'
                      }`}>
                        {reminder.isOverdue ? (
                          <AlertTriangle className="h-5 w-5 text-red-400" />
                        ) : (
                          <Clock className="h-5 w-5 text-amber-400" />
                        )}
                      </div>
                      
                      {/* Reminder Info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-white truncate">
                          {reminder.vehicleNickname}
                        </div>
                        <div className="text-xs text-amber-200 truncate">
                          {reminder.serviceType}
                        </div>
                        <div className="text-xs text-amber-100/70 mt-0.5">
                          {reminder.dueIn !== undefined ? (
                            <span>{Math.abs(reminder.dueIn)} miles {reminder.dueIn >= 0 ? 'until due' : 'overdue'}</span>
                          ) : reminder.dueDate ? (
                            <span>Due {reminder.dueDate}</span>
                          ) : (
                            <span>Due soon</span>
                          )}
                        </div>
                        
                        {/* Overdue Badge */}
                        <div className="flex-shrink-0">
                          {reminder.isOverdue && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-900 text-red-100">
                              Overdue
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 col-span-3">
                    <Wrench className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">No maintenance reminders</p>
                    <p className="text-slate-500 text-xs mt-1">Your vehicles are up to date</p>
                  </div>
                )}
                
                {/* Add empty state placeholders to maintain consistent height */}
                {maintenanceReminders.length > 0 && maintenanceReminders.length < 3 && 
                  Array.from({ length: 3 - maintenanceReminders.length }).map((_, index) => (
                    <div key={`empty-${index}`} className="h-full min-h-[4.5rem] opacity-0 pointer-events-none" />
                  ))
                }
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="p-4 border-t border-slate-700">
              <Button 
                variant="outline" 
                size="sm"
                className="w-full bg-amber-600/20 border-amber-500/50 text-amber-300 hover:bg-amber-600/40 hover:text-white"
                onClick={() => window.location.href = '/maintenance/add'}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Maintenance
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
