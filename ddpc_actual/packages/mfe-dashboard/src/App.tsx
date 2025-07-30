
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "shared_ui/card";
import { Progress } from "shared_ui/progress";
import { Badge } from "shared_ui/badge";
import { Car, Wrench, Clock, TrendingUp, Calendar, DollarSign } from "lucide-react";

const Dashboard = () => {
  const stats = [
    { label: "Total Vehicles", value: "3", icon: Car, change: "+1", changeType: "positive" },
    { label: "Active Builds", value: "2", icon: Wrench, change: "0", changeType: "neutral" },
    { label: "Avg. Build Time", value: "4.2 mo", icon: Clock, change: "-0.3", changeType: "positive" },
    { label: "Total Investment", value: "$24.5k", icon: DollarSign, change: "+2.1k", changeType: "positive" },
  ];

  const recentActivity = [
    { id: 1, action: "Started engine rebuild", vehicle: "Project Thunder", date: "2024-01-15", type: "build" },
    { id: 2, action: "Ordered performance parts", vehicle: "Work Horse", date: "2024-01-14", type: "purchase" },
    { id: 3, action: "Completed suspension upgrade", vehicle: "Classic Beast", date: "2024-01-12", type: "completion" },
    { id: 4, action: "Scheduled maintenance", vehicle: "Project Thunder", date: "2024-01-10", type: "maintenance" },
  ];

  const currentBuilds = [
    { name: "Project Thunder - Engine Rebuild", progress: 75, dueDate: "2024-02-15", priority: "high" },
    { name: "Work Horse - Lift Kit Installation", progress: 45, dueDate: "2024-03-01", priority: "medium" },
    { name: "Classic Beast - Paint Job", progress: 90, dueDate: "2024-01-25", priority: "low" },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "build": return "🔧";
      case "purchase": return "🛒";
      case "completion": return "✅";
      case "maintenance": return "🔧";
      default: return "📝";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive";
      case "medium": return "bg-warehouse-warning";
      case "low": return "bg-warehouse-success";
      default: return "bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-warehouse">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Project Dashboard</h1>
          <p className="text-muted-foreground">Track your build progress and garage analytics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-card border-warehouse-steel shadow-warehouse">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-warehouse-success mr-1" />
                      <span className={`text-sm ${stat.changeType === 'positive' ? 'text-warehouse-success' : 'text-destructive'}`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-tech rounded-lg flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Builds */}
          <Card className="bg-card border-warehouse-steel shadow-warehouse">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wrench className="w-5 h-5 mr-2" />
                Current Builds
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentBuilds.map((build, index) => (
                <div key={index} className="p-4 bg-secondary rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{build.name}</h4>
                    <Badge className={`${getPriorityColor(build.priority)} text-white`}>
                      {build.priority}
                    </Badge>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{build.progress}%</span>
                    </div>
                    <Progress value={build.progress} className="h-2" />
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-1" />
                    Due: {build.dueDate}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-card border-warehouse-steel shadow-warehouse">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-secondary rounded-lg">
                    <div className="text-lg">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.vehicle}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 