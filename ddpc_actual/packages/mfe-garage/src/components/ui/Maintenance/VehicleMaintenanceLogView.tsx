// mfe-garage/src/components/Maintenance/VehicleMaintenanceLogView.tsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'shared_ui/button';
import { Card, CardContent, CardHeader, CardTitle } from 'shared_ui/card';
// Temporarily commenting out useTier as it's not available in shared_ui
// import { useTier } from 'shared_ui/hooks/use-tier';
import { Plus, Download, Calendar, DollarSign, FileText, AlertTriangle } from 'lucide-react';
import { config } from 'shared-config';

// Import the actual useTier hook type from shared_ui when available
// For now, we'll define a more complete mock implementation

type TierLevel = 'free' | 'builder' | 'pro';

interface TierLimits {
  recordLimit: number;
  exportFormat: 'basic' | 'full' | 'premium';
  canExport: boolean;
  canUseAdvancedFeatures: boolean;
  maxVehicles: number;
  maxMaintenanceRecords: number;
}

interface UseTierReturn {
  tier: TierLevel;
  limits: TierLimits;
  isPro: boolean;
  isBuilder: boolean;
  isFree: boolean;
  features: string[];
  hasFeature: (feature: string) => boolean;
}

// Temporary mock for useTier until we have the actual hook
const useTier = (): UseTierReturn => {
  const tier: TierLevel = 'builder' as const;
  const limits: TierLimits = {
    recordLimit: 100,
    exportFormat: 'full',
    canExport: true,
    canUseAdvancedFeatures: true,
    maxVehicles: 10,
    maxMaintenanceRecords: 1000
  };
  
  const features = [
    'export',
    'maintenance-reminders',
    'build-plans',
    'advanced-analytics'
  ] as const;

  // Use type assertions for the tier checks since we know the exact value
  const isPro = false;
  const isBuilder = true;
  const isFree = false;

  return {
    tier,
    limits,
    isPro,
    isBuilder,
    isFree,
    features: [...features], // Convert readonly array to mutable array
    hasFeature: (feature: string) => features.includes(feature as any)
  };
};

// Temporary mock for TierGate component
interface TierGateProps {
  children: React.ReactNode;
  requiredFeature?: string;
}

const TierGate = ({ children, requiredFeature }: TierGateProps) => {
  // In a real implementation, this would check if the required feature is available
  return <>{children}</>;
};

// Import the MaintenanceRecordCard component
import MaintenanceRecordCard from './MaintenanceRecordCard';
import AddEditRecordModal from './AddEditRecordModal';

// Define the MaintenanceStatus type
type MaintenanceStatus = 'completed' | 'scheduled' | 'in-progress' | 'pending' | 'overdue';

// Define the API MaintenanceRecord interface (what comes from the API)
interface ApiMaintenanceRecord {
  entry_id: number;
  vehicle_id: string;
  date: string;
  mileage: number;
  title: string;
  category: string;
  labor_cost: number;
  parts_cost?: number;
  notes?: string;
  status?: string;
  next_due?: string;
  technician?: string;
  location?: string;
  created_at?: string;
  updated_at?: string;
}

// Define the local MaintenanceRecord interface (what we use in the UI)
export interface MaintenanceRecord extends Omit<ApiMaintenanceRecord, 'status'> {
  status: 'completed' | 'scheduled' | 'in-progress';
  cost: number;
  description: string;
  created_at: string;
  updated_at: string;
}

// Define the filters interface
interface Filters {
  category: string;
  status: string;
  search: string;
}

interface VehicleMaintenanceLogViewProps {
  vehicleId: string;
}

// Mock data matching the API response structure
const mockRecords: MaintenanceRecord[] = [
  {
    entry_id: 1,
    vehicle_id: "z3-coupe-99",
    date: "2024-01-15",
    mileage: 45230,
    title: "Oil and Filter Change",
    category: "Engine",
    labor_cost: 85.99,
    parts_cost: 24.99,
    notes: "Used synthetic oil and OEM filter",
    status: "completed",
    cost: 110.98,
    description: "Used synthetic oil and OEM filter",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:30:00Z"
  },
  {
    entry_id: 2,
    vehicle_id: "z3-coupe-99",
    date: "2024-01-10",
    mileage: 45150,
    title: "Front Brake Service",
    category: "Brakes",
    labor_cost: 245.50,
    parts_cost: 120.00,
    notes: "Replaced pads and rotors",
    status: "completed",
    cost: 365.50,
    description: "Replaced pads and rotors",
    created_at: "2024-01-10T14:30:00Z",
    updated_at: "2024-01-10T16:45:00Z"
  },
  {
    entry_id: 3,
    vehicle_id: "z3-coupe-99",
    date: "2024-01-05",
    mileage: 45100,
    title: "Annual Inspection",
    category: "Inspection",
    labor_cost: 35.00,
    parts_cost: 0,
    notes: "Passed all safety checks",
    status: "completed",
    cost: 35.00,
    description: "Passed all safety checks",
    created_at: "2024-01-05T09:15:00Z",
    updated_at: "2024-01-05T10:30:00Z"
  },
  {
    entry_id: 4,
    vehicle_id: "z3-coupe-99",
    date: "2023-12-20",
    mileage: 44800,
    title: "Tire Rotation",
    category: "Tires",
    labor_cost: 45.00,
    parts_cost: 0,
    notes: "Rotated tires and checked pressure",
    status: "completed",
    cost: 45.00,
    description: "Rotated tires and checked pressure",
    created_at: "2023-12-20T13:20:00Z",
    updated_at: "2023-12-20T14:00:00Z"
  }
];

// This component receives the ID of the vehicle it needs to display records for.
export default function VehicleMaintenanceLogView() {
    // --- STATE MANAGEMENT ---
    const { vehicleId } = useParams();
    const [records, setRecords] = useState<MaintenanceRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingRecord, setEditingRecord] = useState<MaintenanceRecord | null>(null);
  
    // State for filters and sorting
    const [filters, setFilters] = useState<Filters>({
      category: '',
      status: '',
      search: ''
    });
  
    // Get the current tier information
    const tierInfo = useTier();
    const { limits } = tierInfo;
  
    // --- DATA FETCHING ---
    useEffect(() => {
      if (!vehicleId) {
        setLoading(false);
        return;
      }

      const fetchRecords = async () => {
        try {
          const response = await fetch(`${config.api.getUrl('maintenanceLogs')}?vehicle_id=${vehicleId}`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch maintenance records');
          }
          
          const data = await response.json();
          
          // Transform the API response to include computed fields
          const transformedData = data.map((record: ApiMaintenanceRecord): MaintenanceRecord => {
            // First, create a safe version of the record with all required fields
            const safeRecord = {
              // Required fields with defaults
              entry_id: record.entry_id || Date.now(),
              vehicle_id: record.vehicle_id || 'unknown-vehicle',
              date: record.date || new Date().toISOString().split('T')[0],
              mileage: typeof record.mileage === 'number' ? record.mileage : 0,
              title: record.title || 'Untitled Maintenance',
              category: record.category || 'Other',
              labor_cost: typeof record.labor_cost === 'number' ? record.labor_cost : 0,
              notes: record.notes || '',
              created_at: record.created_at || new Date().toISOString(),
              updated_at: record.updated_at || new Date().toISOString(),
              description: record.notes || 'No description provided',
              
              // Optional fields
              parts_cost: record.parts_cost,
              next_due: record.next_due,
              technician: record.technician,
              location: record.location
            };
            
            // Map the status to a valid value
            const status = (['completed', 'scheduled', 'in-progress'] as const)
              .includes(record.status as any)
              ? record.status as 'completed' | 'scheduled' | 'in-progress'
              : 'completed'; // Default to 'completed' if status is invalid or missing

            // Calculate the total cost
            const cost = (safeRecord.labor_cost || 0) + (safeRecord.parts_cost || 0);
            
            // Create the final record with all required fields
            return {
              ...safeRecord,
              status,
              cost,
              description: safeRecord.description,
              created_at: safeRecord.created_at,
              updated_at: safeRecord.updated_at
            };
          });
          
          setRecords(transformedData);
          setError(null);
        } catch (error) {
          console.error('Error fetching maintenance records:', error);
          setError('Failed to load maintenance records. Using mock data instead.');
          setRecords(mockRecords); // Fallback to mock data
        } finally {
          setLoading(false);
        }
      };

      fetchRecords();
    }, [vehicleId]);

    // --- UTILITY FUNCTIONS ---
    const handleAddRecord = (newRecord: Partial<MaintenanceRecord>) => {
      const record: MaintenanceRecord = {
        entry_id: Date.now(),
        vehicle_id: vehicleId,
        date: newRecord.date || new Date().toISOString().split('T')[0],
        title: newRecord.title || 'New Maintenance Record',
        category: newRecord.category || 'Other',
        mileage: newRecord.mileage || 0,
        labor_cost: newRecord.labor_cost || 0,
        notes: newRecord.notes || '',
        status: "completed"
      };
      setRecords([record, ...records]);
      setIsModalOpen(false);
    };

    const handleExportData = () => {
      const format = limits.exportFormat === 'full' ? 'Full PDF/CSV' : 'Basic CSV';
      const filteredRecords = records
        .filter(record => {
          if (filters.category && record.category.toLowerCase() !== filters.category.toLowerCase()) return false;
          if (filters.status && record.status !== filters.status) return false;
          return true;
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limits.recordLimit);
      const exportData = {
        vehicleId,
        records: limits.exportFormat === 'full' ? filteredRecords : filteredRecords.map(r => ({
          date: r.date,
          title: r.title,
          category: r.category,
          labor_cost: r.labor_cost
        })),
        totalCost: records.reduce((sum, record) => sum + (record.labor_cost || 0), 0),
        recordCount: records.length,
        exportDate: new Date().toISOString(),
        format: limits.exportFormat
      };
      
      // In a real app, this would generate and download the file
      console.log('Exporting maintenance data:', exportData);
      alert(`Exporting maintenance records as ${format}...`);
    };

    // --- CALCULATIONS ---
    const totalCost = records.reduce((sum, record) => sum + (record.labor_cost || 0), 0);
    const overdueCount = records.filter(record => 
      record.next_due && new Date(record.next_due) < new Date()
    ).length;
  
    // --- RENDER ---
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Digital Maintenance Records</h1>
              <p className="text-muted-foreground">Vehicle ID: {vehicleId}</p>
            </div>
            <TierGate requiredFeature="canExportData">
              <Button 
                variant="outline" 
                onClick={handleExportData}
              >
                <Download className="w-4 h-4 mr-2" />
                Export ({limits.exportFormat === 'full' ? 'Full' : 'Basic'})
              </Button>
            </TierGate>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Records</p>
                    <p className="text-2xl font-bold">{records.length}</p>
                  </div>
                  <FileText className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Cost</p>
                    <p className="text-2xl font-bold">${totalCost.toFixed(2)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Last Service</p>
                    <p className="text-2xl font-bold">{records[0]?.date || "N/A"}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Overdue Items</p>
                    <p className="text-2xl font-bold">{overdueCount}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Add New Record Button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Maintenance Log</h2>
            <Button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="w-5 h-5 mr-2" />
              Add Record
            </Button>
          </div>

          {/* Maintenance Records List */}
          <div className="space-y-4">
            {records
              .filter(record => {
                if (filters.category && record.category.toLowerCase() !== filters.category.toLowerCase()) return false;
                if (filters.status && record.status !== filters.status) return false;
                return true;
              })
              .map((record) => (
                <MaintenanceRecordCard key={record.entry_id} record={record} />
              ))}
          </div>

          {/* Add/Edit Record Modal */}
          <AddEditRecordModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleAddRecord}
          />
        </div>
      </div>
    );
  }