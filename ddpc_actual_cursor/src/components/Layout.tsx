
import React, { useEffect, ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  useEffect(() => {
    import('host/eventBus').then(({ listenForEvent }) => {
      const cleanup = listenForEvent('show:notification', (e: CustomEvent) => {
        console.log('Event received in Host:', e.detail);
        // In the future, this could trigger a toast notification UI
      });
      return cleanup;
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout; 