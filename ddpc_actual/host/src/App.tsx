import { Toaster } from "shared_ui/toaster";
import { Toaster as Sonner } from "shared_ui/sonner";
import { TooltipProvider } from "shared_ui/tooltip";
import { TierProvider } from "shared_ui/use-tier";
import { AuthProvider } from "./contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import AuthPage from "./components/AuthPage";

import PricingPage from "./components/PricingPageNew";
import React, { Suspense, useState, useRef, useEffect } from 'react';

const Home = React.lazy(() => import('mfe_home/HomeApp'));
const Garage = React.lazy(() => import('mfe_garage/GarageApp'));
const BuildPlans = React.lazy(() => import('mfe_build_plans/BuildPlansApp'));
const Maintenance = React.lazy(() => import('mfe_maintenance/MaintenanceApp'));
const Dashboard = React.lazy(() => import('mfe_dashboard/DashboardApp'));
const Account = React.lazy(() => import('mfe_account/AccountApp'));

const queryClient = new QueryClient();

// Layout component that conditionally shows navigation
const AppLayout = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  
  // Pages that shouldn't show navigation
  const noNavPages = ['/register', '/login', '/forgot-password'];
  const showNav = !noNavPages.includes(location.pathname);

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
    <div className="h-screen flex flex-col">
      {showNav && <Navigation isScrolled={isScrolled} />}
      <main ref={mainRef} className="flex-1 overflow-y-auto">
        <Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/garage/*" element={<Garage />} />
            <Route path="/build-plans/*" element={<BuildPlans />} />
            <Route path="/maintenance/*" element={<Maintenance />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/account" element={<Account />} />
            <Route path="/profile" element={<Navigate to="/account" replace />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/register" element={<AuthPage mode="register" />} />
            <Route path="/login" element={<AuthPage mode="login" />} />
          </Routes>
        </Suspense>
        {showNav && <Footer />}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TierProvider initialTier="driver">
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppLayout />
          </TooltipProvider>
        </TierProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
