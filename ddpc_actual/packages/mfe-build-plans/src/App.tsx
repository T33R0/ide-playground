import React, { useState } from "react";
import "./index.css";
import { Card, CardContent, CardHeader, CardTitle } from "shared_ui/card";
import { Button } from "shared_ui/button";
import { Badge } from "shared_ui/badge";
import { Progress } from "shared_ui/progress";
import { Checkbox } from "shared_ui/checkbox";
import { Plus, Calendar, Clock, DollarSign, Wrench } from "lucide-react";

interface BuildTask {
  id: string;
  title: string;
  completed: boolean;
  estimatedHours: number;
  cost: number;
  priority: "low" | "medium" | "high";
}

interface BuildPlan {
  id: string;
  name: string;
  vehicle: string;
  description: string;
  startDate: string;
  targetDate: string;
  totalCost: number;
  progress: number;
  status: "planning" | "in-progress" | "completed" | "on-hold";
  tasks: BuildTask[];
}

const mockBuildPlans: BuildPlan[] = [
  {
    id: "1",
    name: "Engine Performance Upgrade",
    vehicle: "Project Thunder",
    description: "Complete engine rebuild with performance modifications",
    startDate: "2024-01-01",
    targetDate: "2024-02-15",
    totalCost: 8500,
    progress: 75,
    status: "in-progress",
    tasks: [
      { id: "1", title: "Remove engine", completed: true, estimatedHours: 8, cost: 0, priority: "high" },
      { id: "2", title: "Disassemble engine components", completed: true, estimatedHours: 12, cost: 0, priority: "high" },
      { id: "3", title: "Machine work - bore cylinders", completed: true, estimatedHours: 4, cost: 2500, priority: "high" },
      { id: "4", title: "Install performance camshaft", completed: false, estimatedHours: 6, cost: 1200, priority: "medium" },
      { id: "5", title: "Reassemble engine", completed: false, estimatedHours: 16, cost: 500, priority: "high" },
      { id: "6", title: "Install engine", completed: false, estimatedHours: 10, cost: 0, priority: "high" },
    ]
  },
  {
    id: "2",
    name: "Suspension Lift Kit",
    vehicle: "Work Horse",
    description: "Install 6-inch lift kit with new shocks and springs",
    startDate: "2024-01-15",
    targetDate: "2024-03-01",
    totalCost: 3200,
    progress: 25,
    status: "in-progress",
    tasks: [
      { id: "7", title: "Order lift kit components", completed: true, estimatedHours: 1, cost: 2800, priority: "high" },
      { id: "8", title: "Remove stock suspension", completed: false, estimatedHours: 6, cost: 0, priority: "medium" },
      { id: "9", title: "Install lift kit", completed: false, estimatedHours: 12, cost: 200, priority: "high" },
      { id: "10", title: "Alignment and testing", completed: false, estimatedHours: 2, cost: 200, priority: "medium" },
    ]
  }
];

const BuildPlans = () => {
  const [buildPlans, setBuildPlans] = useState<BuildPlan[]>(mockBuildPlans);

  const toggleTask = (planId: string, taskId: string) => {
    setBuildPlans(plans =>
      plans.map(plan =>
        plan.id === planId
          ? {
              ...plan,
              tasks: plan.tasks.map(task =>
                task.id === taskId
                  ? { ...task, completed: !task.completed }
                  : task
              )
            }
          : plan
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planning": return "bg-muted";
      case "in-progress": return "bg-warehouse-accent";
      case "completed": return "bg-warehouse-success";
      case "on-hold": return "bg-warehouse-warning";
      default: return "bg-muted";
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Build Plans</h1>
            <p className="text-muted-foreground">Plan and track your vehicle modification projects</p>
          </div>
          <Button variant="tech" size="lg" className="shadow-elevated">
            <Plus className="w-5 h-5 mr-2" />
            New Build Plan
          </Button>
        </div>

        <div className="space-y-6">
          {buildPlans.map((plan) => (
            <Card key={plan.id} className="bg-card border-warehouse-steel shadow-warehouse">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl mb-2">{plan.name}</CardTitle>
                    <p className="text-muted-foreground mb-2">{plan.vehicle}</p>
                    <p className="text-sm">{plan.description}</p>
                  </div>
                  <Badge className={`${getStatusColor(plan.status)} text-white`}>
                    {plan.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Target Date</p>
                      <p className="text-sm font-medium">{plan.targetDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Budget</p>
                      <p className="text-sm font-medium">${plan.totalCost.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Est. Hours</p>
                      <p className="text-sm font-medium">
                        {plan.tasks.reduce((acc, task) => acc + task.estimatedHours, 0)}h
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Wrench className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Progress</p>
                      <p className="text-sm font-medium">{plan.progress}%</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Progress value={plan.progress} className="h-3" />
                </div>
              </CardHeader>

              <CardContent>
                <h4 className="font-medium mb-4">Tasks</h4>
                <div className="space-y-3">
                  {plan.tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                        task.completed ? 'bg-warehouse-success/10 border-warehouse-success/20' : 'bg-secondary border-border'
                      }`}
                    >
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTask(plan.id, task.id)}
                      />
                      <div className="flex-1">
                        <p className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {task.estimatedHours}h
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ${task.cost.toLocaleString()}
                          </span>
                          <Badge className={`${getPriorityColor(task.priority)} text-white text-xs`}>
                            {task.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuildPlans;