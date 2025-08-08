// Maintenance Data Service - Contract-First API Integration
// Uses TypeScript contracts matching database schema

// Local interfaces matching exact database schema
interface MaintenanceLog {
  maint_id: number;
  garage_id: number;
  date_performed: string; // ISO date string
  mileage: number;
  description: string;
  cost: number;
  category: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';

export class MaintenanceService {
  // Fetch all maintenance logs for a specific vehicle
  static async getMaintenanceLogs(garageId: number): Promise<MaintenanceLog[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/user_garage_maintenance?garage_id=${garageId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const logs: MaintenanceLog[] = await response.json();
      return logs;
    } catch (error) {
      console.error('Error fetching maintenance logs:', error);
      throw error;
    }
  }

  // Add a new maintenance log
  static async addMaintenanceLog(log: Omit<MaintenanceLog, 'maint_id'>): Promise<MaintenanceLog> {
    try {
      const response = await fetch(`${API_BASE_URL}/user_garage_maintenance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(log),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newLog: MaintenanceLog = await response.json();
      return newLog;
    } catch (error) {
      console.error('Error adding maintenance log:', error);
      throw error;
    }
  }

  // Update an existing maintenance log
  static async updateMaintenanceLog(log: MaintenanceLog): Promise<MaintenanceLog> {
    try {
      const response = await fetch(`${API_BASE_URL}/user_garage_maintenance/${log.maint_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(log),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedLog: MaintenanceLog = await response.json();
      return updatedLog;
    } catch (error) {
      console.error('Error updating maintenance log:', error);
      throw error;
    }
  }

  // Delete a maintenance log
  static async deleteMaintenanceLog(maintId: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/user_garage_maintenance/${maintId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting maintenance log:', error);
      throw error;
    }
  }

  // Get maintenance summary for dashboard widgets
  static async getMaintenanceSummary(garageId: number): Promise<{
    totalLogs: number;
    totalCost: number;
    lastService: MaintenanceLog | null;
    upcomingServices: MaintenanceLog[];
  }> {
    try {
      const logs = await this.getMaintenanceLogs(garageId);
      const totalCost = logs.reduce((sum, log) => sum + log.cost, 0);
      const sortedLogs = logs.sort((a, b) => new Date(b.date_performed).getTime() - new Date(a.date_performed).getTime());
      
      return {
        totalLogs: logs.length,
        totalCost,
        lastService: sortedLogs[0] || null,
        upcomingServices: [], // This would be calculated based on service intervals
      };
    } catch (error) {
      console.error('Error fetching maintenance summary:', error);
      throw error;
    }
  }

  // Get maintenance categories for filtering
  static getMaintenanceCategories(): string[] {
    return [
      'Engine',
      'Transmission',
      'Brakes',
      'Suspension',
      'Electrical',
      'Cooling System',
      'Fuel System',
      'Exhaust',
      'Tires',
      'Oil Change',
      'Filters',
      'Belts & Hoses',
      'Fluids',
      'Inspection',
      'Other'
    ];
  }
}
