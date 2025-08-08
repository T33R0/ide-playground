import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from 'shared_ui/card';
import { Button } from 'shared_ui/button';
import { Progress } from 'shared_ui/progress';
import { useTier, TierGate } from 'shared_ui/use-tier';
import { BuildPlanUpsell } from 'shared_ui/tier-upsell';
import { Wrench, ArrowRight, Package, Plus } from 'lucide-react';
import { vehiclesUrl, vehicleBuildsUrl } from 'shared_ui/api';

interface BuildProject {
  id: string;
  vehicleNickname: string;
  buildName: string;
  partsInstalled: number;
  totalParts: number;
  progressPercentage: number;
}

interface Vehicle {
  id: number;
  nickname?: string;
  make: string;
  model: string;
  year: number;
}

interface BuildItem {
  id: number;
  vehicle_id: number;
  part_name: string;
  part_brand?: string;
  category?: string;
  status: 'Planned' | 'Purchased' | 'Installed';
  date_added?: string;
  installation_date?: string | null;
}

export const BuildProgressWidget: React.FC = () => {
  const { currentTier, canAccessFeature } = useTier();
  const [buildProjects, setBuildProjects] = useState<BuildProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Using centralized API helpers

  useEffect(() => {
    const fetchBuildData = async () => {
      try {
        setLoading(true);
        
        // Fetch vehicles
        const vehiclesResponse = await fetch(vehiclesUrl());
        if (!vehiclesResponse.ok) {
          throw new Error('Failed to fetch vehicles');
        }
        const vehicles: Vehicle[] = await vehiclesResponse.json();

        // Generate build projects from the data
        const projects: BuildProject[] = [];
        
        for (const vehicle of vehicles) {
          try {
            const buildsRes = await fetch(vehicleBuildsUrl(vehicle.id));
            const buildItems: BuildItem[] = buildsRes.ok ? await buildsRes.json() : [];
            const installedParts = buildItems.filter(item => item.status === 'Installed').length;
            const totalParts = Math.max(buildItems.length, 1);
            const progressPercentage = buildItems.length > 0
              ? Math.round((installedParts / totalParts) * 100)
              : 0;

            projects.push({
              id: vehicle.id.toString(),
              vehicleNickname: vehicle.nickname || 'My Vehicle',
              buildName: vehicle.make && vehicle.model && vehicle.year
                ? `${vehicle.year} ${vehicle.make} ${vehicle.model} Build`
                : 'New Build Project',
              partsInstalled: installedParts,
              totalParts,
              progressPercentage,
            });
          } catch (e) {
            // Skip vehicle on error but continue others
          }
        }

        setBuildProjects(projects);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBuildData();
  }, []);

  // Load all build projects but display with proper scrolling

  const handleHeaderClick = () => {
    window.location.href = '/build-plans';
  };

  const handleBuildClick = (projectId: string) => {
    window.location.href = '/build-plans';
  };

  const handleNavigateToBuildPlans = (buildId?: string) => {
    // Navigate to mfe-build-plans application
    const baseUrl = '/build-plans';
    const targetUrl = buildId ? `${baseUrl}/${buildId}` : baseUrl;
    window.location.href = targetUrl;
  };

  const handleUpgradeClick = () => {
    // Navigate to pricing page
    window.location.href = '/pricing';
  };

  const handleAddBuildClick = () => {
    window.location.href = '/build-plans/add';
  };

  return (
    <Card className="flex flex-col border-slate-700 bg-slate-900/50" style={{ height: '100%' }}>
      <CardHeader className="pb-3 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white cursor-pointer hover:text-blue-300 transition-colors" onClick={handleHeaderClick}>
            <Package className="h-4 w-4 text-blue-400" />
            <span>Build Progress</span>
          </CardTitle>
          <TierGate requiredTier="builder">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-blue-400 hover:text-white hover:bg-blue-900/20 h-6 px-2"
              onClick={() => window.location.href = '/build-plans'}
            >
              View All
            </Button>
          </TierGate>
        </div>
        <p className="text-sm text-slate-400 mt-1">
          {buildProjects.length} active {buildProjects.length === 1 ? 'build' : 'builds'} in progress
        </p>
      </CardHeader>
      <CardContent className="p-0 flex flex-col h-full">
        <TierGate 
          requiredTier="builder"
          fallback={
            // Free Tier Upsell
            <div className="text-center py-6">
              <div className="mb-4">
                <Wrench className="h-12 w-12 text-orange-400 mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Ready to start your build?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Unlock unlimited garage slots, mod build lists, and detailed project planning.
                </p>
              </div>
              
              <Button 
                onClick={handleUpgradeClick}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white shadow-md"
              >
                <Wrench className="h-4 w-4 mr-2" />
                Upgrade to Builder - $12.99/mo
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              
              <p className="text-xs text-muted-foreground mt-3">
                500 receipts monthly • 2GB photo storage • Enhanced sharing
              </p>
            </div>
          }
        >
          {/* Builder Tier & Up Content */}
          {loading ? (
            // Loading State
            <div className="text-center py-6">
              <Package className="h-8 w-8 text-slate-600 mx-auto mb-2 animate-pulse" />
              <p className="text-slate-400 text-sm">Loading builds...</p>
            </div>
          ) : error ? (
            // Error State
            <div className="text-center py-6">
              <Package className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-red-400 text-sm mb-2">Failed to load builds</p>
              <p className="text-slate-500 text-xs">{error}</p>
            </div>
          ) : buildProjects.length === 0 ? (
            // Empty State - Show prompt to add a build
            <div className="flex flex-col h-full">
              <div className="flex-1 flex flex-col items-center justify-center p-6">
                <Package className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">No active builds</p>
                <p className="text-slate-500 text-xs mt-1">Start tracking your vehicle modifications</p>
              </div>
              <div className="p-4 border-t border-slate-700">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full bg-blue-600/20 border-blue-500/50 text-blue-300 hover:bg-blue-600/40 hover:text-white"
                  onClick={() => window.location.href = '/build-plans/add'}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Build
                </Button>
              </div>
            </div>
          ) : (
            // Active Build Projects
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
                  {buildProjects.map((project) => {
                    // Ensure we have a valid vehicle ID or create a fallback
                    const vehicleId = project?.id || `vehicle-${Date.now()}`;
                    
                    return (
                      <div 
                        key={vehicleId}
                        className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:bg-slate-700/50 transition-colors cursor-pointer h-full min-h-[4.5rem]"
                        onClick={() => handleBuildClick(vehicleId)}
                      >
                        {/* Build Icon */}
                        <div className="w-10 h-10 rounded-md overflow-hidden bg-blue-900/30 flex-shrink-0 flex items-center justify-center">
                          <Package className="h-5 w-5 text-blue-400" />
                        </div>
                        
                        {/* Build Info */}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-white truncate">
                            {project.vehicleNickname || 'My Build'}
                          </div>
                          <div className="text-xs text-blue-200 truncate">
                            {project.partsInstalled || 0} of {project.totalParts || 0} parts installed
                          </div>
                          <div className="text-xs text-blue-100/70 mt-0.5">
                            {project.progressPercentage || 0}% complete • {project.totalParts - (project.partsInstalled || 0)} remaining
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-3">
                          <div className="text-sm font-medium text-blue-400">
                            {project.progressPercentage || 0}%
                          </div>
                          <div className="w-16 mt-1">
                            <Progress value={project.progressPercentage || 0} className="h-1.5 bg-slate-700" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Add empty state placeholders to maintain consistent height */}
                  {buildProjects.length > 0 && buildProjects.length < 3 && 
                    Array.from({ length: 3 - buildProjects.length }).map((_, index) => (
                      <div key={`empty-${index}`} className="h-full min-h-[4.5rem] opacity-0 pointer-events-none" />
                    ))
                  }
                </div>
              </div>
              <div className="p-4 border-t border-slate-700">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full bg-blue-600/20 border-blue-500/50 text-blue-300 hover:bg-blue-600/40 hover:text-white"
                  onClick={() => handleNavigateToBuildPlans()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Build
                </Button>
              </div>
            </div>
          )}
        </TierGate>
      </CardContent>
    </Card>
  );
};
