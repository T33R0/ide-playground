import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "shared_ui/card";
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
    lastUpdated: "2024-01-15"
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
    lastUpdated: "2024-01-10"
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
    lastUpdated: "2023-12-20"
  }
];

const Garage = () => {
  const [vehicles] = useState<Vehicle[]>(mockVehicles);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-warehouse-success";
      case "maintenance": return "bg-warehouse-warning";
      case "completed": return "bg-primary";
      default: return "bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-warehouse">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Garage</h1>
            <p className="text-muted-foreground">Manage your vehicle collection and builds</p>
          </div>
          <Button variant="tech" size="lg" className="shadow-elevated">
            <Plus className="w-5 h-5 mr-2" />
            Add Vehicle
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} className="group hover:shadow-elevated transition-all duration-300 bg-card border-warehouse-steel">
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={vehicle.image} 
                    alt={vehicle.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className={`${getStatusColor(vehicle.status)} text-white`}>
                      {vehicle.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <CardTitle className="mb-2 text-xl">{vehicle.name}</CardTitle>
                <p className="text-muted-foreground mb-4">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </p>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Build Progress</span>
                    <span>{vehicle.buildProgress}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-gradient-tech h-2 rounded-full transition-all duration-500"
                      style={{ width: `${vehicle.buildProgress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Calendar className="w-4 h-4 mr-1" />
                  Last updated: {vehicle.lastUpdated}
                </div>

                <div className="flex space-x-2">
                  <Link to={`/vehicle/${vehicle.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                  <Link to={`/builds/${vehicle.id}`} className="flex-1">
                    <Button variant="warehouse" size="sm" className="w-full">
                      <Wrench className="w-4 h-4 mr-2" />
                      Build Plans
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Garage;