import { Toaster } from "shared_ui/toaster";
import { Toaster as Sonner } from "shared_ui/sonner";
import { TooltipProvider } from "shared_ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import React, { Suspense, useState, useRef, useEffect } from 'react';

const Home = React.lazy(() => import('mfe_home/HomeApp'));
const Garage = React.lazy(() => import('mfe_garage/GarageApp'));
const BuildPlans = React.lazy(() => import('mfe_build_plans/BuildPlansApp'));
const Dashboard = React.lazy(() => import('mfe_dashboard/DashboardApp'));

const queryClient = new QueryClient();

const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mainEl = mainRef.current;
    const handleScroll = () => {
      if (mainEl) {
        setIsScrolled(mainEl.scrollTop > 10);
      }
    };

    mainEl?.addEventListener('scroll', handleScroll);
    return () => mainEl?.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="h-screen flex flex-col">
          <Navigation isScrolled={isScrolled} />
          <main ref={mainRef} className="flex-1 overflow-y-auto">
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/garage" element={<Garage />} />
                <Route path="/build-plans" element={<BuildPlans />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
