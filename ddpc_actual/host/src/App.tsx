import { Toaster } from "shared_ui/toaster";
import { Toaster as Sonner } from "shared_ui/sonner";
import { TooltipProvider } from "shared_ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import React, { Suspense } from 'react'; // Ensure Suspense is imported
const Dashboard = React.lazy(() => import('mfe_home/App'));
const Garage = React.lazy(() => import('mfe_garage/App'));
const BuildPlans = React.lazy(() => import('mfe_build_plans/BuildPlansApp'));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Navigation />
          <Suspense fallback={<div className="flex-1 p-8 pt-6">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/garage" element={<Garage />} />
              <Route path="/build-plans" element={<BuildPlans />} />
              {/* <Route path="*" element={<NotFound />} /> You can add a NotFound MFE later */}
            </Routes>
          </Suspense>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
