// TypeScript contracts for DDPC Optimized Database Schema v2.0
// This supersedes all previous wiring instructions

// ============================================================================
// CORE USER VEHICLE DATA
// ============================================================================

// The new master record for a user-owned vehicle
export interface Vehicle {
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
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
}

// The new contract for a maintenance log entry
export interface MaintenanceLog {
  id: number;
  vehicle_id: number;
  date_performed: string; // YYYY-MM-DD
  mileage?: number;
  title: string;
  description?: string;
  cost?: number;
  category?: string;
}

// The new contract for a build/modification item
export interface BuildItem {
  id: number;
  vehicle_id: number;
  part_name: string;
  part_brand?: string;
  category?: string;
  status: 'Planned' | 'Purchased' | 'Installed';
  cost?: number;
  date_added: string; // ISO 8601 date string
}

// ============================================================================
// LEGACY USER INTERFACES (for WordPress integration)
// ============================================================================

export interface User {
  ID: number;
  user_login: string;
  user_pass: string;
  user_nicename: string;
  user_email: string;
  display_name: string;
}

export interface UserMeta {
  first_name: string;
  last_name: string;
  user_location: string;
  social_youtube: string;
  social_instagram: string;
  social_twitter: string;
  social_tiktok: string;
  has_public_profile: boolean;
}

// ============================================================================
// SHARED APPLICATION TABLES (unchanged from original schema)
// ============================================================================

export interface VehicleData {
  Year: number;
  Make: string;
  Model: string;
  Trim: string;
  Platform_code: string;
  Country_of_origin: string;
  Body_type: string;
  Car_classification: string;
  Engine_size: number;
  Cylinders: number;
  Cam_type: string;
  Valves: number;
  Valve_timing: string;
  Horsepower_HP: number;
  Horsepower_rpm: number;
  Torque_ft_lbs: number;
  Torque_rpm: number;
  Drive_type: string;
  Transmission: string;
  Fuel_type: string;
  EPA_combined_MPG: number;
  EPA_city_MPG: number;
  EPA_hwy_MPG: number;
  Range_city_mi: number;
  Range_hwy_mi: number;
  Fuel_tank_gal: number;
  EPA_combined_MPGe: number;
  EPA_city_MPGe: number;
  EPA_hwy_MPGe: number;
  EPA_electric_range_mi: number;
  EPA_kWh_100mi: number;
  Battery_capacity_kWh: number;
  Charge_time_240v_hr: number;
  Length_in: number;
  Width_in: number;
  Height_in: number;
  Wheelbase_in: number;
  Curb_weight_lbs: number;
  Doors: number;
  Seating: number;
  Cargo_cu_ft: number;
  Towing_capacity_lbs: number;
  Ground_clearance_in: number;
  MSRP: number;
  Invoice: number;
  Used_price_range: string;
}

export interface VehicleImage {
  id: number;
  year: number;
  make: string;
  model: string;
  image_url: string;
  is_shared: boolean;
  uploaded_by: number;
  uploaded_at: string; // ISO date string
}

export interface VehicleImageFeedback {
  id: number;
  year: number;
  make: string;
  model: string;
  feedback_type: 'wrong_image' | 'no_image';
  user_id: number;
  user_ip: string;
  user_agent: string;
  submitted_at: string; // ISO date string
  resolved: boolean;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// ============================================================================
// COMPONENT PROP TYPES (updated for new schema)
// ============================================================================

export interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit?: (vehicle: Vehicle) => void;
  onDelete?: (vehicleId: number) => void;
  showActions?: boolean;
}

export interface MaintenanceLogProps {
  logs: MaintenanceLog[];
  vehicleId: number;
  onAddLog?: () => void;
  onEditLog?: (log: MaintenanceLog) => void;
}

export interface BuildPlanProps {
  items: BuildItem[];
  vehicleId: number;
  onAddItem?: () => void;
  onUpdateItem?: (item: BuildItem) => void;
}
