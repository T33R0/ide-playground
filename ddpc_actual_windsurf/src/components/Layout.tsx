import React, { ReactNode, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Set up event listeners for cross-MFE communication
  useEffect(() => {
    // This will be called when the component mounts
    const handleNotification = (event: CustomEvent) => {
      console.log('Event received in Host:', event.detail);
      
      // Here you could integrate with a toast notification system
      // For now, we'll just log to the console
      const { message, type = 'info', duration = 3000 } = event.detail;
      
      console.log(`[${type.toUpperCase()}] ${message}`);
      
      // In a real app, you would show a toast notification here
      // showToast(message, { type, duration });
    };
    
    // Dynamically import the event bus to avoid circular dependencies
    let cleanup: (() => void) | undefined;
    
    const setupEventBus = async () => {
      try {
        const { listenForEvent } = await import('../utils/eventBus');
        cleanup = listenForEvent('show:notification', handleNotification);
      } catch (error) {
        console.error('Failed to set up event bus listener:', error);
      }
    };
    
    setupEventBus();
    
    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, []);
  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed Header */}
      <Header />

      {/* Main Content - pt-16 to account for fixed header height */}
      <main className="flex-grow pt-20 px-4">
        <div className="container mx-auto">
          {children}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
