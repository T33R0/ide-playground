import React from 'react';
import { Button } from 'shared_ui/button';
import { Card, CardContent } from 'shared_ui/card';
import { Warehouse, Wrench, Package, User } from 'lucide-react';

// Navigation helper function to avoid full page reloads
const navigateTo = (path: string) => {
  // Use history.pushState to navigate without full page reload
  window.history.pushState({}, '', path);
  // Dispatch a popstate event to trigger React Router navigation
  window.dispatchEvent(new PopStateEvent('popstate'));
};

export const DashboardView: React.FC = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Dashboard</h1>
          <p className="text-slate-300 mt-2 text-sm sm:text-base">Welcome back! Here's an overview of your automotive ecosystem.</p>
        </div>

        {/* Main Navigation Buttons - 2x2 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Garage Button */}
          <Card className="border-slate-700 bg-slate-900/50 hover:bg-slate-800/50 transition-colors cursor-pointer group" onClick={() => navigateTo('/garage')}>
            <CardContent className="p-8 flex flex-col items-center justify-center text-center h-48">
              <Warehouse className="h-12 w-12 text-blue-400 mb-4 group-hover:text-blue-300 transition-colors" />
              <h3 className="text-xl font-semibold text-white mb-2">Garage</h3>
              <p className="text-slate-400 text-sm">Manage your vehicles</p>
            </CardContent>
          </Card>

          {/* Maintenance Button */}
          <Card className="border-slate-700 bg-slate-900/50 hover:bg-slate-800/50 transition-colors cursor-pointer group" onClick={() => navigateTo('/maintenance')}>
            <CardContent className="p-8 flex flex-col items-center justify-center text-center h-48">
              <Wrench className="h-12 w-12 text-amber-400 mb-4 group-hover:text-amber-300 transition-colors" />
              <h3 className="text-xl font-semibold text-white mb-2">Maintenance</h3>
              <p className="text-slate-400 text-sm">Track service records</p>
            </CardContent>
          </Card>

          {/* Build Plans Button */}
          <Card className="border-slate-700 bg-slate-900/50 hover:bg-slate-800/50 transition-colors cursor-pointer group" onClick={() => navigateTo('/build-plans')}>
            <CardContent className="p-8 flex flex-col items-center justify-center text-center h-48">
              <Package className="h-12 w-12 text-green-400 mb-4 group-hover:text-green-300 transition-colors" />
              <h3 className="text-xl font-semibold text-white mb-2">Build Plans</h3>
              <p className="text-slate-400 text-sm">Plan modifications</p>
            </CardContent>
          </Card>

          {/* Account Button */}
          <Card className="border-slate-700 bg-slate-900/50 hover:bg-slate-800/50 transition-colors cursor-pointer group" onClick={() => navigateTo('/account')}>
            <CardContent className="p-8 flex flex-col items-center justify-center text-center h-48">
              <User className="h-12 w-12 text-purple-400 mb-4 group-hover:text-purple-300 transition-colors" />
              <h3 className="text-xl font-semibold text-white mb-2">Account</h3>
              <p className="text-slate-400 text-sm">Profile & settings</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
