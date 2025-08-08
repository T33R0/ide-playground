import React, { useState, useEffect } from 'react';
import './index.css';

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

import { Card, CardContent, CardHeader, CardTitle } from "shared_ui/card";
import { Button } from "shared_ui/button";
import { Badge } from "shared_ui/badge";
import { Progress } from "shared_ui/progress";
import { Checkbox } from "shared_ui/checkbox";
import { Plus, Calendar, DollarSign, Clock, ChevronDown, ChevronUp, Wrench, Crown, Lock, Loader2, ArrowUpDown, ArrowLeft, GripVertical, Eye } from "lucide-react";
import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useTier } from "shared_ui/use-tier";
import { TierGate } from "shared_ui/use-tier";
import BuildPlanView from "./components/Build/BuildPlanView";
import CreateBuildPlanModal from "./components/Build/CreateBuildPlanModal";
import { BuildPlanUpsell } from "shared_ui/tier-upsell";
import { config } from "shared-config";

// API base URL for new schema v2.0
const API_BASE_URL = 'http://localhost:8001';
const getApiUrl = (endpoint: string, vehicleId?: string) => {
  const endpointMap: { [key: string]: string } = {
    'buildItems': vehicleId ? `/api/v1/vehicles/${vehicleId}/builds` : '/build_items',
    'vehicles': '/api/v1/vehicles'
  };
  return `${API_BASE_URL}${endpointMap[endpoint] || endpoint}`;
};

// API Build Item interface (what comes from the server) - new schema v2.0
interface ApiBuildItem {
  id: number;
  vehicle_id: number;
  part_name: string;
  part_brand?: string;
  category?: string;
  status: 'Planned' | 'Purchased' | 'Installed';
  cost?: number;
  date_added: string;
}

// API Vehicle interface - new schema v2.0
interface ApiVehicle {
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

interface BuildTask {
  id: string;
  title: string;
  completed: boolean;
  estimatedHours: number;
  cost: number;
  priority: "low" | "medium" | "high";
}

// Local Build Plan interface (what we use in the UI)
interface BuildPlan {
  id: string;
  name: string;
  vehicle: string;
  vehicleId?: string;
  description: string;
  startDate: string;
  targetDate: string;
  totalCost: number;
  progress: number;
  status: "planning" | "in-progress" | "completed" | "on-hold";
  tasks: BuildTask[];
}

const mockBuildPlans: BuildPlan[] = [
  {
    id: "1",
    name: "Engine Performance Upgrade",
    vehicle: "Project Thunder",
    description: "Complete engine rebuild with performance modifications",
    startDate: "2024-01-01",
    targetDate: "2024-02-15",
    totalCost: 8500,
    progress: 75,
    status: "in-progress",
    tasks: [
      { id: "1", title: "Remove engine", completed: true, estimatedHours: 8, cost: 0, priority: "high" },
      { id: "2", title: "Disassemble engine components", completed: true, estimatedHours: 12, cost: 0, priority: "high" },
      { id: "3", title: "Machine work - bore cylinders", completed: true, estimatedHours: 4, cost: 2500, priority: "high" },
      { id: "4", title: "Install performance camshaft", completed: false, estimatedHours: 6, cost: 1200, priority: "medium" },
      { id: "5", title: "Reassemble engine", completed: false, estimatedHours: 16, cost: 500, priority: "high" },
      { id: "6", title: "Install engine", completed: false, estimatedHours: 10, cost: 0, priority: "high" },
    ]
  },
  {
    id: "2",
    name: "Suspension Lift Kit",
    vehicle: "Work Horse",
    description: "Install 6-inch lift kit with new shocks and springs",
    startDate: "2024-01-15",
    targetDate: "2024-03-01",
    totalCost: 3200,
    progress: 25,
    status: "in-progress",
    tasks: [
      { id: "7", title: "Order lift kit components", completed: true, estimatedHours: 1, cost: 2800, priority: "high" },
      { id: "8", title: "Remove stock suspension", completed: false, estimatedHours: 6, cost: 0, priority: "medium" },
      { id: "9", title: "Install lift kit", completed: false, estimatedHours: 12, cost: 200, priority: "high" },
      { id: "10", title: "Alignment and testing", completed: false, estimatedHours: 2, cost: 200, priority: "medium" },
    ]
  }
];

// Detailed Build Plan Page Component
const BuildPlanDetailPage = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const [buildPlans] = useState<BuildPlan[]>(mockBuildPlans);
  
  const plan = buildPlans.find(p => p.id === planId);
  
  if (!plan) {
    return (
      <div className="min-h-screen bg-gradient-warehouse flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Build Plan Not Found</h1>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Build Plans
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
            Back to Build Plans
          </Button>
          <div className="mb-4">
            <h1 className="text-3xl font-bold">{plan.name}</h1>
            <p className="text-muted-foreground">{plan.vehicle} - {plan.description}</p>
          </div>
        </div>
        <BuildPlanView vehicleId={planId!} userTier="pro" buildPlan={plan} />
      </div>
    </div>
  );
};

// Build Plans Overview Component
const BuildPlansOverview = () => {
  const { currentTier, limits, canAccessFeature } = useTier();
  const [searchParams] = useSearchParams();
  const selectedVehicleId = searchParams.get('vehicleId');
  const [buildPlans, setBuildPlans] = useState<BuildPlan[]>([]);
  const [allBuildPlans, setAllBuildPlans] = useState<BuildPlan[]>([]);
  const [vehicles, setVehicles] = useState<Record<string, { nickname?: string; make?: string; model?: string; year?: number }>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(() => new Set());
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'vehicle' | 'status' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Sorting function
  const sortBuildPlans = (plans: BuildPlan[]) => {
    return [...plans].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'vehicle':
          comparison = a.vehicle.localeCompare(b.vehicle);
          break;
        case 'status':
          const statusOrder = { 'planning': 0, 'in-progress': 1, 'completed': 2, 'on-hold': 3 };
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
        case 'date':
          comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };

  // Apply sorting to build plans
  const sortedBuildPlans = sortBuildPlans(buildPlans);

  // Fetch vehicles and build plan parts from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // First, fetch build items
        const response = await fetch(getApiUrl('buildItems'));
        
        if (!response.ok) {
          throw new Error('Failed to fetch build items');
        }
        
        const data: ApiBuildItem[] = await response.json();
        
        // Extract unique vehicle IDs from build items
        const vehicleIds = Array.from(new Set(
          data
            .map(item => item.vehicle_id.toString())
            .filter((id): id is string => Boolean(id))
        ));
        
        // Fetch vehicles if we have vehicle IDs
        let vehiclesMap: Record<string, any> = {};
        if (vehicleIds.length > 0) {
          const vehicleResponse = await fetch(getApiUrl('vehicles'));
          if (vehicleResponse.ok) {
            const vehicleData = await vehicleResponse.json();
            vehiclesMap = vehicleData.reduce((acc: any, vehicle: any) => {
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
          }
        }
        
        setVehicles(vehiclesMap);
        
        // Transform API data to local BuildPlan format
        const transformedBuildPlans: BuildPlan[] = data.map((apiItem) => {
          const vehicleInfo = apiItem.vehicle_id ? vehiclesMap[apiItem.vehicle_id.toString()] : null;
          let vehicleDisplay = 'Unassigned Vehicle';
          
          if (vehicleInfo) {
            const { nickname, year, make, model } = vehicleInfo;
            const details = [year, make, model].filter(Boolean).join(' ');
            vehicleDisplay = nickname ? `${nickname} (${details})` : details || 'Unknown Vehicle';
          }
          
          // Map status from API to our expected values
          const statusMap: Record<string, 'planning' | 'in-progress' | 'completed' | 'on-hold'> = {
            'Installed': 'completed',
            'Purchased': 'in-progress',
            'Planned': 'planning'
          };
          
          const mappedStatus = statusMap[apiItem.status] || 'planning';
          const progress = mappedStatus === 'completed' ? 100 : (mappedStatus === 'in-progress' ? 50 : 0);
          
          return {
            id: apiItem.id.toString(),
            name: `${apiItem.part_name} Build Plan`,
            vehicle: vehicleDisplay,
            vehicleId: apiItem.vehicle_id.toString(),
            description: `Build plan for ${apiItem.part_name} installation`,
            startDate: apiItem.date_added ? apiItem.date_added.split('T')[0] : new Date().toISOString().split('T')[0],
            targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            totalCost: apiItem.cost || 0,
            progress: progress,
            status: mappedStatus,
            tasks: [
              {
                id: `${apiItem.id}-task-1`,
                title: `Install ${apiItem.part_name}`,
                completed: mappedStatus === 'completed',
                estimatedHours: 4,
                cost: apiItem.cost || 0,
                priority: 'medium' as const
              },
              {
                id: `${apiItem.id}-task-2`,
                title: `Test ${apiItem.part_name}`,
                completed: false,
                estimatedHours: 2,
                cost: 0,
                priority: 'low' as const
              }
            ]
          };
        });
        
        // Ensure unique IDs by prefixing API data with 'api-'
        const apiPlansWithUniqueIds = transformedBuildPlans.map(plan => ({
          ...plan,
          id: `api-${plan.id}`,
          tasks: plan.tasks.map(task => ({
            ...task,
            id: `api-${task.id}`
          }))
        }));
        
        // Combine mock data with API data
        const allPlans = [...mockBuildPlans, ...apiPlansWithUniqueIds];
        setAllBuildPlans(allPlans);
        setBuildPlans(allPlans);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load build plans. Please try again later.');
        
        // Fallback to mock data only
        setAllBuildPlans(mockBuildPlans);
        setBuildPlans(mockBuildPlans);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedVehicleId]);

  const toggleTask = (planId: string, taskId: string) => {
    setBuildPlans(plans =>
      plans.map(plan =>
        plan.id === planId
          ? {
              ...plan,
              tasks: plan.tasks.map(task =>
                task.id === taskId
                  ? { ...task, completed: !task.completed }
                  : task
              )
            }
          : plan
      )
    );
  };

  const toggleCardExpansion = (planId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(Array.from(prev));
      if (newSet.has(planId)) {
        newSet.delete(planId);
      } else {
        newSet.add(planId);
      }
      return newSet;
    });
  };

  const handleDragStart = (e: React.DragEvent, planId: string) => {
    setDraggedItem(planId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetPlanId: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetPlanId) {
      setDraggedItem(null);
      return;
    }

    const draggedIndex = buildPlans.findIndex(plan => plan.id === draggedItem);
    const targetIndex = buildPlans.findIndex(plan => plan.id === targetPlanId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedItem(null);
      return;
    }

    const newPlans = [...buildPlans];
    const [draggedPlan] = newPlans.splice(draggedIndex, 1);
    newPlans.splice(targetIndex, 0, draggedPlan);
    
    setBuildPlans(newPlans);
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleCreateBuildPlan = async (buildPlanData: any) => {
    try {
      // Here you would typically make an API call to create the build plan
      // For now, we'll create a mock build plan and add it to the state
      const newBuildPlan: BuildPlan = {
        id: Date.now().toString(),
        name: buildPlanData.name,
        vehicle: vehicles[buildPlanData.vehicleId] 
          ? `${vehicles[buildPlanData.vehicleId].nickname || ''} ${vehicles[buildPlanData.vehicleId].year} ${vehicles[buildPlanData.vehicleId].make} ${vehicles[buildPlanData.vehicleId].model}`.trim()
          : 'Unknown Vehicle',
        vehicleId: buildPlanData.vehicleId,
        description: buildPlanData.description || '',
        startDate: new Date().toISOString().split('T')[0],
        targetDate: buildPlanData.targetDate || '',
        totalCost: buildPlanData.estimatedCost || 0,
        progress: 0,
        status: 'planning',
        tasks: []
      };
      
      setBuildPlans(prev => [...prev, newBuildPlan]);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating build plan:', error);
      throw error;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planning": return "bg-muted";
      case "in-progress": return "bg-warehouse-accent";
      case "completed": return "bg-warehouse-success";
      case "on-hold": return "bg-warehouse-warning";
      default: return "bg-muted";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive";
      case "medium": return "bg-warehouse-warning";
      case "low": return "bg-warehouse-success";
      default: return "bg-muted";
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-warehouse">
        <div className="container mx-auto pt-24 pb-8 px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center space-x-3">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-lg">Loading your build plans...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TierGate
      requiredFeature="canAccessBuildPlans"
      fallback={
        <div className="min-h-screen bg-gradient-warehouse">
          <div className="container mx-auto pt-24 pb-8 px-4">
            <div className="text-center mb-8">
              <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h1 className="text-4xl font-bold mb-2">Build Plans</h1>
              <p className="text-muted-foreground">Available in Builder tier and above</p>
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
              <h1 className="text-4xl font-bold mb-2">Build Plans</h1>
              <p className="text-muted-foreground">
                {selectedVehicleId ? (
                  <>Showing build plans for selected vehicle • {buildPlans.length} build{buildPlans.length !== 1 ? 's' : ''}</>
                ) : currentTier === 'free' ? (
                  <>Plan and track your vehicle modification projects • {buildPlans.length} / {limits.maxBuildsPerVehicle} builds</>
                ) : (
                  <>Plan and track your vehicle modification projects • {buildPlans.length} build{buildPlans.length !== 1 ? 's' : ''}</>
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
              New Build Plan
            </Button>
          </div>

          {/* Sorting Controls */}
          {buildPlans.length > 0 && (
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
                  variant={sortBy === 'status' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSortBy('status')}
                >
                  Status
                </Button>
                <Button
                  variant={sortBy === 'date' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSortBy('date')}
                >
                  Date Created
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
          {sortedBuildPlans.length === 0 && selectedVehicleId ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <Wrench className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No Build Plans Found</h3>
                <p className="text-muted-foreground mb-6">
                  This vehicle doesn't have any build plans yet. Start planning your modifications!
                </p>
                <div className="flex space-x-3 justify-center">
                  <Button variant="outline" asChild>
                    <Link to="/build-plans">
                      View All Build Plans
                    </Link>
                  </Button>
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Build Plan
                  </Button>
                </div>
              </div>
            </div>
          ) : sortedBuildPlans.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <Wrench className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No Build Plans Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start planning your vehicle modifications and track your progress.
                </p>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Build Plan
                </Button>
              </div>
            </div>
          ) : (
            sortedBuildPlans.map((plan) => {
            const isExpanded = expandedCards.has(plan.id);
            const isDragging = draggedItem === plan.id;
            return (
              <Card 
                key={plan.id} 
                className={`bg-card border-warehouse-steel shadow-warehouse transition-all duration-200 ${
                  isDragging ? 'opacity-50 scale-105' : ''
                }`}
                draggable={!isExpanded}
                onDragStart={(e: React.DragEvent) => handleDragStart(e, plan.id)}
                onDragOver={handleDragOver}
                onDrop={(e: React.DragEvent) => handleDrop(e, plan.id)}
                onDragEnd={handleDragEnd}
              >
                <CardHeader className="cursor-pointer" onClick={() => toggleCardExpansion(plan.id)}>
                  <div className="flex items-start space-x-3">
                    {/* Drag Handle - only visible when collapsed */}
                    {!isExpanded && (
                      <div 
                        className="flex items-center justify-center w-6 h-6 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        <GripVertical className="w-4 h-4" />
                      </div>
                    )}
                    
                    <div className="flex items-start justify-between flex-1">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{plan.name}</CardTitle>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-foreground">{plan.vehicle}</span>
                        </div>
                        {isExpanded && <p className="text-sm">{plan.description}</p>}
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge className={`${getStatusColor(plan.status)} text-white`}>
                          {plan.status}
                        </Badge>
                        {isExpanded && (
                          <Button variant="outline" size="sm" asChild className="w-auto px-3" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                            <Link to={`${plan.id}/details`}>
                              <Eye className="w-4 h-4 mr-1" />
                              Parts & Details
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Target Date</p>
                          <p className="text-sm font-medium">{plan.targetDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Budget</p>
                          <p className="text-sm font-medium">${plan.totalCost.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Est. Hours</p>
                          <p className="text-sm font-medium">
                            {plan.tasks.reduce((acc, task) => acc + task.estimatedHours, 0)}h
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Wrench className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Progress</p>
                          <p className="text-sm font-medium">{plan.progress}%</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {isExpanded && (
                    <div className="mt-4">
                      <Progress value={plan.progress} className="h-3" />
                    </div>
                  )}
                </CardHeader>

                {isExpanded && (
                  <CardContent>
                    <h4 className="font-medium mb-4">Tasks</h4>
                    <div className="space-y-3">
                      {plan.tasks && plan.tasks.map((task) => (
                        <div
                          key={`${plan.id}-${task.id}`}
                          className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                            task.completed ? 'bg-warehouse-success/10 border-warehouse-success/20' : 'bg-secondary border-border'
                          }`}
                        >
                          <Checkbox
                            id={`task-${plan.id}-${task.id}`}
                            checked={task.completed}
                            onCheckedChange={() => toggleTask(plan.id, task.id)}
                          />
                          <div className="flex-1">
                            <label 
                              htmlFor={`task-${plan.id}-${task.id}`}
                              className={`font-medium cursor-pointer ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                            >
                              {task.title}
                            </label>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-xs text-muted-foreground">
                                {task.estimatedHours}h
                              </span>
                              <span className="text-xs text-muted-foreground">
                                ${task.cost.toLocaleString()}
                              </span>
                              <Badge 
                                className={`${getPriorityColor(task.priority)} text-white text-xs`}
                                key={`priority-${plan.id}-${task.id}`}
                              >
                                {task.priority}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })
          )}
        </div>
        
        {/* Create Build Plan Modal */}
        <CreateBuildPlanModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateBuildPlan}
          preSelectedVehicleId={selectedVehicleId || undefined}
        />
      </div>
    </div>
    </TierGate>
  );
};

// Main App Component - Standardized structure for consistent CSS loading
const App = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  
  // Ensure CSS is fully loaded before rendering
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Enforce MFE styles and force style recalculation
      enforceMFEStyles();
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
      {isDetailPage ? <BuildPlanDetailPage /> : <BuildPlansOverview />}
    </div>
  );
};

export default App;