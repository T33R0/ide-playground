DDPC MFE: Repo Refactor & Build Plan
Objective: To systematically refactor and build the MFE application to align with the DDPC Optimized Database Schema v2.0. This plan supersedes all previous wiring instructions. The end state is a feature-complete frontend operating on a high-fidelity local mock API, ready for final integration with the production backend.

Phase 1: Project-Wide Environment & Contract Refactor
Goal: Update the foundational code and mock server to reflect the new database architecture.

Task 1.1: Update TypeScript Data Contracts
File to Modify: packages/shared-ui/src/types.ts

Action: Replace the entire contents of this file with the following interfaces. This establishes the new data contract for the entire application.

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

Task 1.2: Reconfigure Local Mock API Server
File to Modify: db.json (in the project root)

Action: Replace the entire contents of this file with sample data that adheres to the new schema. The top-level keys must be the new table names.

{
  "vehicles": [
    {
      "id": 1,
      "user_id": 1,
      "year": 1999,
      "make": "BMW",
      "model": "Z3 Coupe",
      "nickname": "The Track Rat",
      "status": "Active",
      "visibility": "Public",
      "photo_url": "https://placehold.co/600x400/1a1a1a/ffffff?text=Z3+Coupe",
      "created_at": "2023-01-15T12:00:00Z",
      "updated_at": "2023-01-15T12:00:00Z"
    }
  ],
  "maintenance_logs": [
    {
      "id": 101,
      "vehicle_id": 1,
      "date_performed": "2025-07-20",
      "mileage": 125100,
      "title": "Oil and Filter Change",
      "description": "Used Liqui Moly 5W-40 and a Mann filter.",
      "cost": 87.50,
      "category": "Engine"
    }
  ],
  "build_items": [
    {
      "id": 201,
      "vehicle_id": 1,
      "part_name": "TC Kline SA Coilovers",
      "part_brand": "TC Kline",
      "category": "Suspension",
      "status": "Installed",
      "cost": 2200.00,
      "date_added": "2024-01-10T12:00:00Z"
    }
  ]
}

File to Modify: routes.json (in the project root)

Action: Replace the entire contents of this file with the new RESTful API route mappings.

{
  "/api/v1/vehicles": "/vehicles",
  "/api/v1/vehicles/:id": "/vehicles/:id",
  "/api/v1/vehicles/:id/maintenance": "/maintenance_logs?vehicle_id=:id",
  "/api/v1/vehicles/:id/builds": "/build_items?vehicle_id=:id"
}

Phase 2: MFE Component Refactor & Implementation
Goal: Systematically update each MFE to use the new data contracts and API routes.

MFE Target: mfe-garage
Component(s): GarageView.tsx, VehicleCard.tsx (or equivalent components that display the list of user vehicles).

Variable Changes:

garage_id must be changed to id.

All other variables (nickname, year, make, model, photo_url) now align with the Vehicle interface.

API Route Change:

Any fetch call to retrieve the garage list must be changed to target: /api/v1/vehicles.

Component(s): VehicleMaintenanceLogView.tsx, MaintenanceRecordCard.tsx (or equivalent components for maintenance).

Variable Changes:

maint_id must be changed to id.

garage_id must be changed to vehicle_id.

date_performed is the correct variable for the date.

description is the correct variable for detailed notes.

API Route Change:

The fetch call to retrieve maintenance logs for a specific vehicle (passing a vehicleId) must be changed to target: /api/v1/vehicles/${vehicleId}/maintenance.

MFE Target: mfe-build-plans
Component(s): BuildPlanView.tsx, PartCategorySection.tsx (or equivalent components for build plans).

Variable Changes:

build_id must be changed to id.

garage_id must be changed to vehicle_id.

part_name, part_brand, category, status, cost now align with the BuildItem interface.

API Route Change:

The fetch call to retrieve build items for a specific vehicle (passing a vehicleId) must be changed to target: /api/v1/vehicles/${vehicleId}/builds.

MFE Target: mfe-dashboard
Component(s): MyGarageWidget.tsx, UpcomingMaintenanceWidget.tsx, BuildProgressWidget.tsx (or equivalent dashboard widgets).

Action: These components will consume data fetched by the other MFEs or make their own calls. They must be updated to reflect all variable and route changes listed above.

The garage widget must use the /api/v1/vehicles route and expect the Vehicle data shape.

The maintenance widget must use the /api/v1/vehicles/${vehicleId}/maintenance route and expect the MaintenanceLog data shape.

The build widget must use the /api/v1/vehicles/${vehicleId}/builds route and expect the BuildItem data shape.

This plan provides a clear, methodical path to refactor the repository. By completing these tasks, the application will be internally consistent, aligned with the superior database architecture, and prepared for a low-friction transition to the live production environment.