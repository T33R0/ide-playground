import React, { useState, useEffect } from "react";
import "./index.css";

// CSS Loading Enforcement for MFE
const enforceMFEStyles = () => {
  // Ensure critical CSS classes are applied
  document.body.classList.add('ddpc-styles-loaded');
  document.documentElement.classList.add('ddpc-app-ready');
  
  // Force style recalculation to prevent CSS loading race conditions
  document.body.offsetHeight;
  
  // Ensure theme class consistency
  const isDark = document.documentElement.classList.contains('dark');
  if (isDark) {
    document.documentElement.classList.add('dark');
  }
};
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "shared_ui/card";
import { Button } from "shared_ui/button";
import { Badge } from "shared_ui/badge";
import { useTier, TierGate } from "shared_ui/use-tier";
import { GarageSlotUpsell } from "shared_ui/tier-upsell";
import { Plus, Wrench, Calendar, ArrowRight, Eye, Crown, Loader2, Box } from 'lucide-react';
import { Link, useParams, useNavigate } from "react-router-dom";
import QuickAddMaintenance from './components/QuickAddMaintenance';
import QuickAddBuildPart from './components/QuickAddBuildPart';
import { MaintenanceService } from './services/maintenanceService';
import { BuildPlanService } from './services/buildPlanService';
import VehicleCarousel from './components/VehicleCarousel';

// TypeScript contracts - using new schema v2.0
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

interface BuildItem {
  id: number;
  vehicle_id: number;
  part_name: string;
  part_brand?: string;
  category?: string;
  status: 'Planned' | 'Purchased' | 'Installed';
  cost?: number;
  date_added: string;
}

// Progress bar component
const Progress = ({ value, className = "" }: { value: number; className?: string }) => (
  <div className={`h-2 bg-gray-200 rounded-full overflow-hidden ${className}`}>
    <div 
      className="h-full bg-primary transition-all duration-300"
      style={{ width: `${value}%` }}
    />
  </div>
);

// Data service functions
const API_BASE_URL = 'http://localhost:8001';

const fetchUserVehicles = async (): Promise<Vehicle[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/vehicles`);
    if (!response.ok) throw new Error('Failed to fetch vehicles');
    return await response.json();
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return [];
  }
};

const fetchMaintenanceLogs = async (vehicleId: number): Promise<MaintenanceLog[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/vehicles/${vehicleId}/maintenance`);
    if (!response.ok) throw new Error('Failed to fetch maintenance logs');
    return await response.json();
  } catch (error) {
    console.error('Error fetching maintenance logs:', error);
    return [];
  }
};

const fetchBuildItems = async (vehicleId: number): Promise<BuildItem[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/vehicles/${vehicleId}/builds`);
    if (!response.ok) throw new Error('Failed to fetch build items');
    return await response.json();
  } catch (error) {
    console.error('Error fetching build items:', error);
    return [];
  }
};

// Utility functions
const getStatusColor = (status: Vehicle['status']): string => {
  switch (status) {
    case 'Active': return 'bg-green-100 text-green-800';
    case 'Sold': return 'bg-red-100 text-red-800';
    case 'Project': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const formatVehicleName = (vehicle: Vehicle): string => {
  return vehicle.nickname || `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
};

const formatVehicleSubtitle = (vehicle: Vehicle): string => {
  return `${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.trim ? ` ${vehicle.trim}` : ''}`;
};

const calculateBuildProgress = (items: BuildItem[]): number => {
  if (items.length === 0) return 0;
  const installedCount = items.filter(item => item.status === 'Installed').length;
  return Math.round((installedCount / items.length) * 100);
};

// Vehicle Card Component - Updated for new schema
const VehicleCard = ({ vehicle, buildProgress }: { vehicle: Vehicle; buildProgress: number }) => (
  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
    <Link to={`/garage/${vehicle.id}`} className="block">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{formatVehicleName(vehicle)}</CardTitle>
            <p className="text-sm text-muted-foreground">{formatVehicleSubtitle(vehicle)}</p>
          </div>
          <Badge className={getStatusColor(vehicle.status)}>{vehicle.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
          {vehicle.photo_url ? (
            <img src={vehicle.photo_url} alt={formatVehicleName(vehicle)} className="w-full h-full object-cover rounded-lg" />
          ) : (
            <div className="text-gray-400 text-center">
              <Box className="mx-auto mb-2" size={32} />
              <p className="text-sm">No photo</p>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Build Progress</span>
            <span className="text-sm font-medium">{buildProgress}%</span>
          </div>
          <Progress value={buildProgress} />
        </div>
      </CardContent>
    </Link>
  </Card>
);

// Main Garage Overview Component
const GarageOverview = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [buildProgress, setBuildProgress] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const { currentTier, limits, canAccessFeature } = useTier();

  useEffect(() => {
    const loadGarageData = async () => {
      setLoading(true);
      try {
        const vehiclesData = await fetchUserVehicles();
        setVehicles(vehiclesData);

        // Load build progress for each vehicle
        const progressData: Record<number, number> = {};
        for (const vehicle of vehiclesData) {
          const buildItems = await fetchBuildItems(vehicle.id);
          progressData[vehicle.id] = calculateBuildProgress(buildItems);
        }
        setBuildProgress(progressData);
      } catch (error) {
        console.error('Error loading garage data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGarageData();
  }, [currentTier]); // Re-load when tier changes

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-12 pb-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  const maxVehicles = limits.maxVehicles;
  const displayedVehicles = maxVehicles === 0 ? [] : vehicles.slice(0, maxVehicles === -1 ? vehicles.length : maxVehicles);
  const canAddVehicle = maxVehicles === -1 || vehicles.length < maxVehicles;

  return (
    <div className="container mx-auto px-4 pt-12 pb-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Garage</h1>
          <p className="text-muted-foreground">
            {displayedVehicles.length} of {maxVehicles === -1 ? 'unlimited' : maxVehicles} vehicles
          </p>
        </div>
        {canAddVehicle && (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Vehicle
          </Button>
        )}
      </div>

      {vehicles.length === 0 ? (
        <Card className="p-12 text-center">
          <Box className="mx-auto mb-4 text-muted-foreground" size={48} />
          <h2 className="text-xl font-semibold mb-2">No vehicles in your garage</h2>
          <p className="text-muted-foreground mb-4">Add your first vehicle to get started</p>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Vehicle
          </Button>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {displayedVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                buildProgress={buildProgress[vehicle.id] || 0}
              />
            ))}
          </div>

          {currentTier === 'driver' && (
            <GarageSlotUpsell currentCount={displayedVehicles.length} />
          )}
        </>
      )}
    </div>
  );
};

// Vehicle Detail Page Component - Updated for new schema with carousel
const VehicleDetailPage = ({ vehicleId }: { vehicleId: string }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [currentVehicleIndex, setCurrentVehicleIndex] = useState(0);
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>([]);
  const [buildItems, setBuildItems] = useState<BuildItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showBuildModal, setShowBuildModal] = useState(false);
  const navigate = useNavigate();

  // Load all vehicles and set initial vehicle
  useEffect(() => {
    const loadVehicles = async () => {
      setLoading(true);
      try {
        const vehicleData = await fetchUserVehicles();
        setVehicles(vehicleData);
        
        const initialIndex = vehicleData.findIndex(v => v.id === parseInt(vehicleId));
        if (initialIndex === -1) {
          navigate('/garage');
          return;
        }
        
        setCurrentVehicleIndex(initialIndex);
      } catch (error) {
        console.error('Error loading vehicles:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVehicles();
  }, [vehicleId, navigate]);

  // Load data for current vehicle
  useEffect(() => {
    const loadCurrentVehicleData = async () => {
      if (vehicles.length === 0) return;
      
      const currentVehicle = vehicles[currentVehicleIndex];
      if (!currentVehicle) return;

      try {
        const [maintenance, builds] = await Promise.all([
          fetchMaintenanceLogs(currentVehicle.id),
          fetchBuildItems(currentVehicle.id)
        ]);
        
        setMaintenanceLogs(maintenance);
        setBuildItems(builds);
      } catch (error) {
        console.error('Error loading vehicle data:', error);
      }
    };

    loadCurrentVehicleData();
  }, [vehicles, currentVehicleIndex]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-12 pb-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  const currentVehicle = vehicles[currentVehicleIndex];
  
  if (!currentVehicle) {
    return (
      <div className="container mx-auto px-4 pt-12 pb-8">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Vehicle not found</h2>
          <Button onClick={() => navigate('/garage')}>
            <ArrowRight className="w-4 h-4 mr-2" />
            Back to Garage
          </Button>
        </div>
      </div>
    );
  }

  const buildProgress = calculateBuildProgress(buildItems);
  const recentMaintenance = maintenanceLogs.slice(0, 3);
  const recentBuilds = buildItems.slice(0, 3);
  
  // Carousel navigation functions
  const goToPreviousVehicle = () => {
    setCurrentVehicleIndex(prev => prev === 0 ? vehicles.length - 1 : prev - 1);
  };
  
  const goToNextVehicle = () => {
    setCurrentVehicleIndex(prev => prev === vehicles.length - 1 ? 0 : prev + 1);
  };
  
  // Button handlers
  const handleAddMaintenance = () => setShowMaintenanceModal(true);
  const handleAddBuildItem = () => setShowBuildModal(true);
  const handleViewAllMaintenance = () => navigate('/maintenance');
  const handleViewBuildPlans = () => navigate(`/build-plans?vehicleId=${currentVehicle.id}`);
  const handleViewDetails = () => {
    // Could navigate to a more detailed vehicle info page or open a modal
    console.log('View vehicle details for:', currentVehicle);
  };

  return (
    <div className="container mx-auto px-4 pt-12 pb-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/garage')} className="mb-4">
          <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
          Back to Garage
        </Button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{formatVehicleName(currentVehicle)}</h1>
            <p className="text-muted-foreground">{formatVehicleSubtitle(currentVehicle)}</p>
          </div>
          <Badge className={getStatusColor(currentVehicle.status)}>{currentVehicle.status}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="relative aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                {/* Carousel Navigation Arrows */}
                {vehicles.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-4 z-10 bg-white/80 hover:bg-white"
                      onClick={goToPreviousVehicle}
                    >
                      <ArrowRight className="w-4 h-4 rotate-180" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-4 z-10 bg-white/80 hover:bg-white"
                      onClick={goToNextVehicle}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </>
                )}
                
                {/* Vehicle Image */}
                {currentVehicle.photo_url ? (
                  <img src={currentVehicle.photo_url} alt={formatVehicleName(currentVehicle)} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <div className="text-gray-400 text-center">
                    <Box className="mx-auto mb-2" size={48} />
                    <p>No photo available</p>
                  </div>
                )}
                
                {/* Vehicle Counter */}
                {vehicles.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {currentVehicleIndex + 1} of {vehicles.length}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wrench className="w-5 h-5 mr-2" />
                  Recent Maintenance
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentMaintenance.length > 0 ? (
                  <div className="space-y-3">
                    {recentMaintenance.map((log) => (
                      <div key={log.id} className="border-l-2 border-primary pl-3">
                        <h4 className="font-medium">{log.title}</h4>
                        <p className="text-sm text-muted-foreground">{log.date_performed}</p>
                        {log.mileage && (
                          <p className="text-sm text-muted-foreground">{log.mileage.toLocaleString()} miles</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No maintenance records</p>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={handleViewAllMaintenance}>
                  View All Maintenance
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Build Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Overall Progress</span>
                      <span className="text-sm font-medium">{buildProgress}%</span>
                    </div>
                    <Progress value={buildProgress} />
                  </div>
                  
                  {recentBuilds.length > 0 ? (
                    <div className="space-y-2">
                      {recentBuilds.map((item) => (
                        <div key={item.id} className="flex justify-between items-center">
                          <span className="text-sm">{item.part_name}</span>
                          <Badge variant={item.status === 'Installed' ? 'default' : 'secondary'}>
                            {item.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No build items</p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={handleViewBuildPlans}>
                  View Build Plans
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" onClick={handleAddMaintenance}>
                <Plus className="w-4 h-4 mr-2" />
                Add Maintenance
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={handleAddBuildItem}>
                <Plus className="w-4 h-4 mr-2" />
                Add Build Item
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={handleViewDetails}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Main App Component - Updated routing logic
const GarageApp = () => {
  // Enforce CSS on component mount
  useEffect(() => {
    enforceMFEStyles();
  }, []);
  
  const path = window.location.pathname;
  
  // Parse vehicle ID from URL
  const vehicleMatch = path.match(/^\/garage\/(\d+)$/);
  const vehicleId = vehicleMatch ? vehicleMatch[1] : null;
  
  if (vehicleId) {
    return <VehicleDetailPage vehicleId={vehicleId} />;
  }
  
  if (path === '/garage/add') {
    return (
      <div className="container mx-auto px-4 pt-12 pb-8">
        <h1 className="text-3xl font-bold mb-6">Add Vehicle</h1>
        <p>Add vehicle form will go here...</p>
      </div>
    );
  }
  
  return <GarageOverview />;
};

export default GarageApp;
