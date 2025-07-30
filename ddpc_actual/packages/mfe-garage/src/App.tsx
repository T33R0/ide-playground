import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "shared_ui/card";
import { Button } from "shared_ui/button";
import { Badge } from "shared_ui/badge";
import { Plus, Eye, Wrench, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const vehicleImage1 = "/assets/vehicle-1.jpg";
const vehicleImage2 = "/assets/vehicle-2.jpg";
const vehicleImage3 = "/assets/vehicle-3.jpg";

interface Vehicle {
  id: string;
  name: string;
  make: string;
  model: string;
  year: number;
  image: string;
  status: "active" | "maintenance" | "completed";
  buildProgress: number;
  lastUpdated: string;
}

const mockVehicles: Vehicle[] = [
  {
    id: "1",
    name: "Project Thunder",
    make: "BMW",
    model: "M3",
    year: 2023,
    image: vehicleImage1,
    status: "active",
    buildProgress: 75,
    lastUpdated: "2024-01-15",
  },
  {
    id: "2",
    name: "Work Horse",
    make: "Ford",
    model: "F-150",
    year: 2022,
    image: vehicleImage2,
    status: "maintenance",
    buildProgress: 45,
    lastUpdated: "2024-01-10",
  },
  {
    id: "3",
    name: "Classic Beast",
    make: "Ford",
    model: "Mustang",
    year: 1969,
    image: vehicleImage3,
    status: "completed",
    buildProgress: 100,
    lastUpdated: "2023-12-20",
  },
];

const Garage = () => {
  const [vehicles] = useState<Vehicle[]>(mockVehicles);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "maintenance":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "completed":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Garage</h1>
            <p className="text-muted-foreground">
              Manage your vehicle collection and builds
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Vehicle
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle) => (
            <Card
              key={vehicle.id}
              className="bg-card border-border hover:border-primary transition-all duration-300 group"
            >
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge
                      variant="outline"
                      className={`capitalize ${getStatusColor(vehicle.status)}`}
                    >
                      {vehicle.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg font-semibold tracking-tight">
                  {vehicle.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground mb-3">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </p>
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Build Progress</span>
                    <span>{vehicle.buildProgress}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-1.5">
                    <div
                      className="bg-primary h-1.5 rounded-full"
                      style={{ width: `${vehicle.buildProgress}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3 mr-1.5" />
                  Last updated: {vehicle.lastUpdated}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex space-x-2">
                <Button variant="outline" size="sm" className="w-full">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                <Button size="sm" className="w-full">
                  <Wrench className="w-4 h-4 mr-2" />
                  Build Plans
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Garage;
