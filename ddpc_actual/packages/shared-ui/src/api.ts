// packages/shared-ui/src/api.ts
// Centralized API base and endpoint helpers for all MFEs

export const API_BASE_URL = 'http://localhost:8001';

// Vehicles (v2 schema)
export const vehiclesUrl = (): string => `${API_BASE_URL}/api/v1/vehicles`;
export const vehicleMaintenanceUrl = (vehicleId: number): string => `${API_BASE_URL}/api/v1/vehicles/${vehicleId}/maintenance`;
export const vehicleBuildsUrl = (vehicleId: number): string => `${API_BASE_URL}/api/v1/vehicles/${vehicleId}/builds`;

// Generic helper if needed
export const api = (path: string): string => `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
