import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from 'shared_ui/button';
import { Car, BarChart3, Wrench, Warehouse } from "lucide-react";
import { cn } from "shared_ui/utils";

const navLinks = [
  { name: 'Garage', href: '/garage', icon: Warehouse },
  { name: 'Build Plans', href: '/build-plans', icon: Wrench },
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
];

const Navigation = ({ isScrolled }: { isScrolled: boolean }) => {
  const location = useLocation();

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-20 text-white transition-colors duration-300",
        isScrolled ? "bg-transparent" : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold flex items-center gap-2">
              <img src="http://localhost:8080/assets/greyscale-transparent-symbol.png" alt="DDPC Logo" className="h-8 sm:h-10 md:h-12" />
              ddpc
            </Link>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-2 rounded-md p-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-track-grey text-chalk-white'
                      : 'text-exhaust-grey hover:bg-track-grey/50 hover:text-chalk-white'
                  )}
                  title={item.name}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              );
            })}
          </div>
          <div className="flex items-center">
            <Button variant="ghost" className="text-chalk-white hover:bg-track-grey/50">
              Sign In
            </Button>
            <Button className="ml-2 bg-monza-blue text-chalk-white hover:bg-monza-blue/90">
              Register
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;