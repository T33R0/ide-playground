// Data service for providing API data to microfrontends
// This centralizes all API calls in the host application

export interface Vehicle {
  vehicle_id: string;
  user_id: string;
  nickname: string;
  year: number;
  make: string;
  model: string;
  last_known_mileage: number;
}

export interface MaintenanceLog {
  log_id: string;
  vehicle_id: string;
  title: string;
  mileage: number;
  date: string;
  cost: number;
  notes: string;
}

export interface BuildPart {
  part_id: string;
  vehicle_id: string;
  name: string;
  category: string;
  status: 'Planned' | 'Ordered' | 'Installed';
  cost: number;
  install_date?: string;
}

class DataService {
  private apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8001';

  async getVehicles(): Promise<Vehicle[]> {
    try {
      const response = await fetch(`${this.apiUrl}/user_garage`);
      if (!response.ok) {
        throw new Error('Failed to fetch vehicles');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      throw error;
    }
  }

  async getMaintenanceLogs(): Promise<MaintenanceLog[]> {
    try {
      const response = await fetch(`${this.apiUrl}/user_garage_maintenance`);
      if (!response.ok) {
        throw new Error('Failed to fetch maintenance logs');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching maintenance logs:', error);
      throw error;
    }
  }

  async getBuildParts(): Promise<BuildPart[]> {
    try {
      const response = await fetch(`${this.apiUrl}/user_garage_builds`);
      if (!response.ok) {
        throw new Error('Failed to fetch build parts');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching build parts:', error);
      throw error;
    }
  }

  // Combined method for dashboard widgets
  async getDashboardData() {
    try {
      const [vehicles, maintenanceLogs, buildParts] = await Promise.all([
        this.getVehicles(),
        this.getMaintenanceLogs(),
        this.getBuildParts()
      ]);

      return {
        vehicles,
        maintenanceLogs,
        buildParts
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const dataService = new DataService();
