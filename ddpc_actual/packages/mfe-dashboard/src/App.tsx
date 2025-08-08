import React, { useState, useEffect } from 'react';
import './index.css';

// CSS Loading Enforcement for MFE
const enforceMFEStyles = () => {
  // Ensure critical CSS classes are applied
  document.body.classList.add('ddpc-styles-loaded');
  document.documentElement.classList.add('ddpc-app-ready');
  
  // Force style recalculation to prevent CSS loading race conditions
  document.body.offsetHeight;
  
  // Ensure theme class consistency
  const isDark = document.documentElement.classList.contains('dark');
  if (isDark) {
    document.documentElement.classList.add('dark');
  }
};

import { DashboardView } from './components';
import { Loader2 } from 'lucide-react';

// Main App Component - Standardized structure for consistent CSS loading
const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Ensure CSS is fully loaded before rendering
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Enforce MFE styles and force style recalculation
      enforceMFEStyles();
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardView />
    </div>
  );
};

export default App; 