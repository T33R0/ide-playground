import React, { useState, useEffect } from "react";
import "./index.css";

import { Card, CardContent, CardHeader, CardTitle } from "shared_ui/card";
import { Button } from "shared_ui/button";
import { Badge } from "shared_ui/badge";
import { Progress } from "shared_ui/progress";
import { Checkbox } from "shared_ui/checkbox";
import { Plus, Calendar, DollarSign, Clock, ChevronDown, ChevronUp, Wrench, Crown, Lock, Loader2, ArrowUpDown, ArrowLeft, GripVertical, Eye, AlertTriangle, CheckCircle } from "lucide-react";
import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useTier } from "shared_ui/use-tier";
import { TierGate } from "shared_ui/use-tier";
import { BuildPlanUpsell } from "shared_ui/tier-upsell";
import { config } from "shared-config";

// Direct API URL override to avoid shared-config caching issues
const API_BASE_URL = 'http://localhost:8001';
const getApiUrl = (endpoint: string, vehicleId?: string) => {
  switch (endpoint) {
    case 'maintenanceLogs':
      return vehicleId ? `${API_BASE_URL}/api/v1/vehicles/${vehicleId}/maintenance` : `${API_BASE_URL}/maintenance_logs`;
    case 'vehicles':
      return `${API_BASE_URL}/api/v1/vehicles`;
    default:
      return `${API_BASE_URL}/${endpoint}`;
  }
};

// API Maintenance Log interface (what comes from the server)
interface ApiMaintenanceLog {
  id: number;
  vehicle_id: number;
  date_performed: string;
  mileage: number;
  description: string;
  cost: number;
  category: string;
  created_at: string;
  updated_at: string;
}

interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  vehicle: string;
  category: string;
  description: string;
  datePerformed: string;
  mileage: number;
  cost: number;
  status: "completed" | "scheduled" | "overdue";
  nextDueDate?: string;
  nextDueMileage?: number;
}

// Maintenance Categories
const MAINTENANCE_CATEGORIES = [
  "Oil Change",
  "Tire Service",
  "Brake Service", 
  "Engine Service",
  "Transmission Service",
  "Cooling System",
  "Electrical",
  "Suspension",
  "Other"
];

// Detailed Maintenance Record Page Component
const MaintenanceDetailPage = () => {
  const { recordId } = useParams<{ recordId: string }>();
  const navigate = useNavigate();
  const [maintenanceRecords] = useState<MaintenanceRecord[]>([]);
  
  const record = maintenanceRecords.find(r => r.id === recordId);
  
  if (!record) {
    return (
      <div className="min-h-screen bg-gradient-warehouse flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Maintenance Record Not Found</h1>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Maintenance
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-warehouse">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Maintenance
          </Button>
          <div className="mb-4">
            <h1 className="text-3xl font-bold">{record.category}</h1>
            <p className="text-muted-foreground">{record.vehicle} - {record.description}</p>
          </div>
        </div>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date Performed</label>
                  <p className="text-lg">{new Date(record.datePerformed).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Mileage</label>
                  <p className="text-lg">{record.mileage.toLocaleString()} miles</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cost</label>
                  <p className="text-lg">${record.cost.toFixed(2)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <Badge className={record.status === 'completed' ? 'bg-green-500' : record.status === 'overdue' ? 'bg-red-500' : 'bg-yellow-500'}>
                    {record.status}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="mt-1">{record.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Mock maintenance records for demonstration
const mockMaintenanceRecords: MaintenanceRecord[] = [
  {
    id: "1",
    vehicleId: "1",
    vehicle: "The Track Rat (1999 BMW Z3 Coupe)",
    category: "Oil Change",
    description: "Full synthetic oil change with premium filter",
    datePerformed: "2024-12-15",
    mileage: 125000,
    cost: 85.50,
    status: "completed",
    nextDueDate: "2025-03-15",
    nextDueMileage: 128000
  },
  {
    id: "2",
    vehicleId: "1",
    vehicle: "The Track Rat (1999 BMW Z3 Coupe)",
    category: "Brake Service",
    description: "Front brake pad replacement and rotor resurfacing",
    datePerformed: "2024-11-20",
    mileage: 124500,
    cost: 450.00,
    status: "completed",
    nextDueDate: "2025-11-20",
    nextDueMileage: 140000
  }
];

// Maintenance Overview Component
const MaintenanceOverview = () => {
  const { currentTier, limits, canAccessFeature } = useTier();
  const [searchParams] = useSearchParams();
  const selectedVehicleId = searchParams.get('vehicleId');
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [allMaintenanceRecords, setAllMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [vehicles, setVehicles] = useState<Record<string, { nickname?: string; make?: string; model?: string; year?: number }>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(() => new Set());
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'vehicle' | 'category' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Sorting function
  const sortMaintenanceRecords = (records: MaintenanceRecord[]) => {
    return [...records].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'vehicle':
          comparison = a.vehicle.localeCompare(b.vehicle);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'date':
          comparison = new Date(a.datePerformed).getTime() - new Date(b.datePerformed).getTime();
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };

  // Apply sorting to maintenance records
  const sortedMaintenanceRecords = sortMaintenanceRecords(maintenanceRecords);

  // Fetch vehicles and maintenance logs from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // First, fetch vehicles
        const vehicleResponse = await fetch(getApiUrl('vehicles'));
        if (!vehicleResponse.ok) {
          throw new Error('Failed to fetch vehicles');
        }
        const vehicles = await vehicleResponse.json();
        
        // Create vehicles map using new schema (id instead of garage_id)
        const vehiclesMap: Record<string, any> = vehicles.reduce((acc: any, vehicle: any) => {
          return {
            ...acc,
            [vehicle.id.toString()]: {
              nickname: vehicle.nickname,
              make: vehicle.make,
              model: vehicle.model,
              year: vehicle.year
            }
          }
        }, {});
        
        setVehicles(vehiclesMap);
        
        // Fetch maintenance logs for all vehicles
        const allMaintenanceLogs: ApiMaintenanceLog[] = [];
        for (const vehicle of vehicles) {
          try {
            const maintenanceResponse = await fetch(getApiUrl('maintenanceLogs', vehicle.id.toString()));
            if (maintenanceResponse.ok) {
              const logs = await maintenanceResponse.json();
              allMaintenanceLogs.push(...logs);
            }
          } catch (error) {
            console.warn(`Failed to fetch maintenance for vehicle ${vehicle.id}:`, error);
          }
        }
        
        // Transform API data to local MaintenanceRecord format
        const transformedMaintenanceRecords: MaintenanceRecord[] = allMaintenanceLogs.map((apiLog: ApiMaintenanceLog) => {
          const vehicleInfo = apiLog.vehicle_id ? vehiclesMap[apiLog.vehicle_id.toString()] : null;
          let vehicleDisplay = 'Unknown Vehicle';
          
          if (vehicleInfo) {
            const { nickname, year, make, model } = vehicleInfo;
            const details = [year, make, model].filter(Boolean).join(' ');
            vehicleDisplay = nickname ? `${nickname} (${details})` : details || 'Unknown Vehicle';
          }
          
          // Ensure unique IDs by prefixing API data with 'api-'
          return {
            id: `api-${apiLog.id.toString()}`,
            vehicleId: apiLog.vehicle_id.toString(),
            vehicle: vehicleDisplay,
            category: apiLog.category,
            description: apiLog.description,
            datePerformed: apiLog.date_performed,
            mileage: apiLog.mileage,
            cost: apiLog.cost,
            status: 'completed' as const,
            nextDueDate: undefined,
            nextDueMileage: undefined
          };
        });
        
        // Combine mock data with API data
        const allRecords = [...mockMaintenanceRecords, ...transformedMaintenanceRecords];
        setAllMaintenanceRecords(allRecords);
        setMaintenanceRecords(allRecords);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load maintenance records. Please try again later.');
        
        // Fallback to mock data only
        setAllMaintenanceRecords(mockMaintenanceRecords);
        setMaintenanceRecords(mockMaintenanceRecords);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedVehicleId]);

  const toggleCardExpansion = (recordId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(Array.from(prev));
      if (newSet.has(recordId)) {
        newSet.delete(recordId);
      } else {
        newSet.add(recordId);
      }
      return newSet;
    });
  };

  const handleDragStart = (e: React.DragEvent, recordId: string) => {
    setDraggedItem(recordId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetId) {
      setDraggedItem(null);
      return;
    }

    const draggedIndex = maintenanceRecords.findIndex(record => record.id === draggedItem);
    const targetIndex = maintenanceRecords.findIndex(record => record.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedItem(null);
      return;
    }

    const newRecords = [...maintenanceRecords];
    const [draggedRecord] = newRecords.splice(draggedIndex, 1);
    newRecords.splice(targetIndex, 0, draggedRecord);
    
    setMaintenanceRecords(newRecords);
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const getStatusColor = (status: MaintenanceRecord['status']): string => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'oil change': return <DollarSign className="w-4 h-4" />;
      case 'brake service': return <AlertTriangle className="w-4 h-4" />;
      default: return <Wrench className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-warehouse">
        <div className="container mx-auto pt-24 pb-8 px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center space-x-3">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-lg">Loading maintenance records...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-warehouse">
        <div className="container mx-auto pt-24 pb-8 px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center space-x-3">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-lg">Loading maintenance records...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TierGate
      requiredFeature="canAccessMaintenance"
      fallback={
        <div className="min-h-screen bg-gradient-warehouse">
          <div className="container mx-auto pt-24 pb-8 px-4">
            <div className="text-center mb-8">
              <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h1 className="text-4xl font-bold mb-2">Maintenance Records</h1>
              <p className="text-muted-foreground">Available in all tiers</p>
            </div>
            <div className="max-w-2xl mx-auto">
              <BuildPlanUpsell compact={false} />
            </div>
          </div>
        </div>
      }
    >
      <div className="min-h-screen bg-gradient-warehouse">
        <div className="container mx-auto pt-24 pb-8 px-4">
          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Maintenance Records</h1>
              <p className="text-muted-foreground">
                {selectedVehicleId ? (
                  <>Showing maintenance for selected vehicle • {maintenanceRecords.length} record{maintenanceRecords.length !== 1 ? 's' : ''}</>
                ) : (
                  <>Track and manage your vehicle maintenance • {maintenanceRecords.length} record{maintenanceRecords.length !== 1 ? 's' : ''}</>
                )}
              </p>
            </div>
            <Button 
              variant="tech" 
              size="lg" 
              className="shadow-elevated"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              New Maintenance Record
            </Button>
          </div>

          {/* Sorting Controls */}
          {maintenanceRecords.length > 0 && (
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-2">
                <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Sort by:</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={sortBy === 'vehicle' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSortBy('vehicle')}
                >
                  Vehicle
                </Button>
                <Button
                  variant={sortBy === 'category' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSortBy('category')}
                >
                  Category
                </Button>
                <Button
                  variant={sortBy === 'date' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSortBy('date')}
                >
                  Date Performed
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="flex items-center space-x-1"
              >
                {sortOrder === 'asc' ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
                <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
              </Button>
            </div>
          )}
        <div className="space-y-6">
          {sortedMaintenanceRecords.length === 0 && selectedVehicleId ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <Wrench className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No Maintenance Records Found</h3>
                <p className="text-muted-foreground mb-6">
                  This vehicle doesn't have any maintenance records yet. Start tracking your maintenance!
                </p>
                <div className="flex space-x-3 justify-center">
                  <Button variant="outline" asChild>
                    <Link to="/maintenance">
                      View All Records
                    </Link>
                  </Button>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Maintenance
                  </Button>
                </div>
              </div>
            </div>
          ) : sortedMaintenanceRecords.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <Wrench className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No Maintenance Records Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start tracking your vehicle maintenance and service history.
                </p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Record
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6">
              {sortedMaintenanceRecords.map((record) => {
                const isExpanded = expandedCards.has(record.id);
                const isDragging = draggedItem === record.id;
                return (
                  <Card 
                    key={record.id} 
                    className={`hover:shadow-lg transition-all duration-200 cursor-pointer ${
                      isDragging ? 'opacity-50 scale-95' : ''
                    }`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, record.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, record.id)}
                    onDragEnd={handleDragEnd}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <GripVertical className="w-4 h-4 text-muted-foreground" />
                          {getCategoryIcon(record.category)}
                          <div>
                            <CardTitle className="text-lg">{record.category}</CardTitle>
                            <p className="text-sm text-muted-foreground">{record.vehicle}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(record.status)}>
                            {record.status}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleCardExpansion(record.id)}
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-sm">{record.description}</p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(record.datePerformed).toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {record.mileage.toLocaleString()} mi
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">${record.cost.toFixed(2)}</span>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Expanded content */}
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t space-y-3">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Category:</span>
                                <p className="text-muted-foreground">{record.category}</p>
                              </div>
                              <div>
                                <span className="font-medium">Status:</span>
                                <p className="text-muted-foreground">{record.status}</p>
                              </div>
                              {record.nextDueDate && (
                                <div>
                                  <span className="font-medium">Next Due:</span>
                                  <p className="text-muted-foreground">{new Date(record.nextDueDate).toLocaleDateString()}</p>
                                </div>
                              )}
                              {record.nextDueMileage && (
                                <div>
                                  <span className="font-medium">Next Due Mileage:</span>
                                  <p className="text-muted-foreground">{record.nextDueMileage.toLocaleString()} mi</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
    </TierGate>
  );
};

// Main App Component - Standardized structure for consistent CSS loading
const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Ensure CSS is fully loaded before rendering
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Force style recalculation to prevent grid layout issues
      document.body.offsetHeight;
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  // Check if we're on a detail page based on URL
  const isDetailPage = window.location.pathname.includes('/details');
  
  return (
    <div className="container mx-auto px-4 py-8">
      {isDetailPage ? <MaintenanceDetailPage /> : <MaintenanceOverview />}
    </div>
  );
};

export default App;
