import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  // The eventBus listener can be removed if not used,
  // but it doesn't affect the layout.
  // useEffect(() => { ... });

  return (
    <div className="flex flex-col min-h-screen bg-neutral-800 text-neutral-100">
      <Header />
      {/* MAKE THE MAIN ELEMENT A FLEX CONTAINER */}
      <main className="flex flex-col flex-grow pt-20">
        {/* The MFE now renders inside a container that can properly expand */}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;