import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from 'shared_ui/card';
import { Button } from 'shared_ui/button';
import { Warehouse, Plus } from 'lucide-react';
import { vehiclesUrl } from 'shared_ui/api';

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

export const MyGarageWidget: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const response = await fetch(vehiclesUrl());
        if (!response.ok) {
          throw new Error('Failed to fetch vehicles');
        }
        const data = await response.json();
        setVehicles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load vehicles');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const totalVehicles = vehicles.length;

  const handleViewFullGarage = () => {
    // Navigate to mfe-garage application
    window.location.href = '/garage';
  };

  const handleVehicleClick = (vehicleId: string) => {
    // Navigate to specific vehicle page
    window.location.href = `/garage/${vehicleId}`;
  };

  const handleHeaderClick = () => {
    // Navigate to garage page when header is clicked
    window.location.href = '/garage';
  };

  const handleAddVehicle = () => {
    // Navigate to add vehicle flow in mfe-garage
    window.location.href = '/garage/add';
  };



  return (
    <Card className="flex flex-col border-slate-700 bg-slate-900/50" style={{ height: '100%' }}>
      <CardHeader className="pb-3 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white cursor-pointer hover:text-blue-300 transition-colors" onClick={handleHeaderClick}>
            <Warehouse className="h-5 w-5 text-blue-400" />
            Garage
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-xs text-slate-400 hover:text-white" onClick={handleViewFullGarage}>
            View All
          </Button>
        </div>
        <p className="text-sm text-slate-400 mt-1">
          {totalVehicles} {totalVehicles === 1 ? 'vehicle' : 'vehicles'} in your garage
        </p>
      </CardHeader>
      <CardContent className="p-0 flex flex-col h-full">
        {loading ? (
          // Loading State
          <div className="text-center py-6">
            <Warehouse className="h-8 w-8 text-slate-600 mx-auto mb-2 animate-pulse" />
            <p className="text-slate-400 text-sm">Loading your garage...</p>
          </div>
        ) : error ? (
          // Error State
          <div className="text-center py-6">
            <Warehouse className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-400 text-sm mb-2">Failed to load vehicles</p>
            <p className="text-slate-500 text-xs">{error}</p>
          </div>
        ) : (
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
                {vehicles.map((vehicle, index) => {
                  // Use the new schema's id field
                  const vehicleId = vehicle?.id?.toString() || `vehicle-${index}-${Date.now()}`;
                
                  return (
                    <div 
                      key={vehicleId}
                      className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/50 border border-slate-600 hover:bg-slate-600/50 transition-colors cursor-pointer h-full min-h-[4.5rem]"
                      onClick={() => handleVehicleClick(vehicleId)}
                    >
                      {/* Vehicle Photo */}
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-slate-600 flex-shrink-0">
                        <div className="w-full h-full flex items-center justify-center">
                          <Warehouse className="h-6 w-6 text-slate-400" />
                        </div>
                      </div>

                      {/* Vehicle Info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-white truncate">
                          {vehicle?.nickname || 'My Vehicle'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {[vehicle?.year, vehicle?.make, vehicle?.model]
                            .filter(Boolean) // Remove any undefined/null values
                            .join(' ') || 'Vehicle details not available'}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {vehicle?.status === 'Active' ? 'Active' : 'Inactive'} • {vehicle?.visibility === 'Public' ? 'Public' : 'Private'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {vehicles.length === 0 && (
                <div className="text-center py-6 col-span-3">
                  <Warehouse className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">No vehicles found</p>
                </div>
              )}
              
              {/* Add empty state placeholders to maintain consistent height */}
              {vehicles.length > 0 && vehicles.length < 3 && 
                Array.from({ length: 3 - vehicles.length }).map((_, index) => (
                  <div key={`empty-${index}`} className="h-full min-h-[4.5rem] opacity-0 pointer-events-none" />
                ))
              }
            </div>
            
            <div className="p-4 border-t border-slate-700">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full bg-blue-600/20 border-blue-500/50 text-blue-300 hover:bg-blue-600/40 hover:text-white"
                onClick={handleAddVehicle}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Vehicle
              </Button>
            </div>
          </div>
        )}


      </CardContent>
    </Card>
  );
};
