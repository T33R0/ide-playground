// Garage Data Service - Contract-First API Integration
// Uses TypeScript contracts from shared-ui and connects to mock API server

import { UserVehicle, MaintenanceLog, BuildPart, ApiResponse } from '../../../../shared-ui/src/types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';

export class GarageService {
  // Fetch all vehicles for the current user
  static async getUserVehicles(userId?: number): Promise<UserVehicle[]> {
    try {
      const url = userId 
        ? `${API_BASE_URL}/user_garage?user_id=${userId}`
        : `${API_BASE_URL}/user_garage`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const vehicles: UserVehicle[] = await response.json();
      return vehicles;
    } catch (error) {
      console.error('Error fetching user vehicles:', error);
      throw error;
    }
  }

  // Fetch a specific vehicle by garage_id
  static async getVehicle(garageId: number): Promise<UserVehicle | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/user_garage/${garageId}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const vehicle: UserVehicle = await response.json();
      return vehicle;
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      throw error;
    }
  }

  // Fetch maintenance logs for a specific vehicle
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

  // Fetch build parts for a specific vehicle
  static async getBuildParts(garageId: number): Promise<BuildPart[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/user_garage_builds?garage_id=${garageId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const parts: BuildPart[] = await response.json();
      return parts;
    } catch (error) {
      console.error('Error fetching build parts:', error);
      throw error;
    }
  }

  // Add a new vehicle
  static async addVehicle(vehicle: Omit<UserVehicle, 'garage_id'>): Promise<UserVehicle> {
    try {
      const response = await fetch(`${API_BASE_URL}/user_garage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicle),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const newVehicle: UserVehicle = await response.json();
      return newVehicle;
    } catch (error) {
      console.error('Error adding vehicle:', error);
      throw error;
    }
  }

  // Update a vehicle
  static async updateVehicle(garageId: number, updates: Partial<UserVehicle>): Promise<UserVehicle> {
    try {
      const response = await fetch(`${API_BASE_URL}/user_garage/${garageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const updatedVehicle: UserVehicle = await response.json();
      return updatedVehicle;
    } catch (error) {
      console.error('Error updating vehicle:', error);
      throw error;
    }
  }

  // Delete a vehicle
  static async deleteVehicle(garageId: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/user_garage/${garageId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      throw error;
    }
  }

  // Add a maintenance log
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

  // Add a build part
  static async addBuildPart(part: Omit<BuildPart, 'build_id'>): Promise<BuildPart> {
    try {
      const response = await fetch(`${API_BASE_URL}/user_garage_builds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(part),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const newPart: BuildPart = await response.json();
      return newPart;
    } catch (error) {
      console.error('Error adding build part:', error);
      throw error;
    }
  }

  // Calculate build progress for a vehicle
  static calculateBuildProgress(parts: BuildPart[]): number {
    if (parts.length === 0) return 0;
    
    const installedParts = parts.filter(part => part.status === 'installed').length;
    return Math.round((installedParts / parts.length) * 100);
  }

  // Get status badge color for vehicle status
  static getStatusColor(status: UserVehicle['status']): string {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'sold':
        return 'bg-gray-100 text-gray-800';
      case 'in-op':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // Format vehicle display name
  static formatVehicleName(vehicle: UserVehicle): string {
    return vehicle.nickname || `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
  }

  // Format vehicle subtitle
  static formatVehicleSubtitle(vehicle: UserVehicle): string {
    return `${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.trim ? ` ${vehicle.trim}` : ''}`;
  }
}
