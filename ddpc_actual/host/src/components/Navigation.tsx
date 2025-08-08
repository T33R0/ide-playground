import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from 'shared_ui/button';
import { TierSwitcher } from 'shared_ui/tier-switcher';
import { cn } from "shared_ui/utils";

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
          {/* Left side - Pricing */}
          <div className="flex items-center">
            <Link 
              to="/pricing" 
              className="text-exhaust-grey hover:text-chalk-white text-sm font-medium transition-colors"
            >
              Pricing
            </Link>
          </div>

          {/* Center - DDPC Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link to="/" className="text-xl font-bold flex items-center gap-2">
              <img src="http://localhost:8080/assets/greyscale-transparent-symbol.png" alt="DDPC Logo" className="h-8 sm:h-10 md:h-12" />
              ddpc
            </Link>
          </div>

          {/* Right side - Sign In and Account Type */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Button asChild variant="ghost" className="text-chalk-white hover:bg-track-grey/50">
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
            <TierSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;