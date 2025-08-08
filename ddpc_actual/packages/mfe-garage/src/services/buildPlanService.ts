// Build Plan Data Service - Contract-First API Integration
// Uses TypeScript contracts matching database schema

// Local interfaces matching exact database schema
interface BuildPart {
  build_id: number;
  garage_id: number;
  part_name: string;
  part_brand: string;
  category: string;
  status: 'planned' | 'ordered' | 'installed' | 'removed';
  date_added: string; // ISO datetime string
  installation_date: string; // ISO date string
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';

export class BuildPlanService {
  // Fetch all build parts for a specific vehicle
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

  // Add a new build part
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

  // Update an existing build part
  static async updateBuildPart(part: BuildPart): Promise<BuildPart> {
    try {
      const response = await fetch(`${API_BASE_URL}/user_garage_builds/${part.build_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(part),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedPart: BuildPart = await response.json();
      return updatedPart;
    } catch (error) {
      console.error('Error updating build part:', error);
      throw error;
    }
  }

  // Delete a build part
  static async deleteBuildPart(buildId: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/user_garage_builds/${buildId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting build part:', error);
      throw error;
    }
  }

  // Get build summary for dashboard widgets
  static async getBuildSummary(garageId: number): Promise<{
    totalParts: number;
    installedParts: number;
    plannedParts: number;
    orderedParts: number;
    progress: number;
  }> {
    try {
      const parts = await this.getBuildParts(garageId);
      const installedParts = parts.filter(p => p.status === 'installed').length;
      const plannedParts = parts.filter(p => p.status === 'planned').length;
      const orderedParts = parts.filter(p => p.status === 'ordered').length;
      const progress = parts.length > 0 ? Math.round((installedParts / parts.length) * 100) : 0;
      
      return {
        totalParts: parts.length,
        installedParts,
        plannedParts,
        orderedParts,
        progress,
      };
    } catch (error) {
      console.error('Error fetching build summary:', error);
      throw error;
    }
  }

  // Get build categories for filtering and organization
  static getBuildCategories(): string[] {
    return [
      'Engine',
      'Turbo/Supercharger',
      'Exhaust',
      'Intake',
      'Suspension',
      'Brakes',
      'Wheels & Tires',
      'Exterior',
      'Interior',
      'Electronics',
      'Drivetrain',
      'Cooling',
      'Fuel System',
      'Ignition',
      'Engine Management',
      'Safety',
      'Audio/Visual',
      'Lighting',
      'Body Kit',
      'Other'
    ];
  }

  // Get status options for build parts
  static getStatusOptions(): Array<{value: BuildPart['status'], label: string, color: string}> {
    return [
      { value: 'planned', label: 'Planned', color: 'bg-gray-100 text-gray-800' },
      { value: 'ordered', label: 'Ordered', color: 'bg-yellow-100 text-yellow-800' },
      { value: 'installed', label: 'Installed', color: 'bg-green-100 text-green-800' },
      { value: 'removed', label: 'Removed', color: 'bg-red-100 text-red-800' },
    ];
  }
}
