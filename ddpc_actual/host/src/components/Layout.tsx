import React, { ReactNode, useRef, useState, useEffect } from 'react';
import Navigation from './Navigation';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
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
    <div className="h-screen flex flex-col">
      <Navigation isScrolled={isScrolled} />
      {/* This main element now allows its children to control their own layout */}
      <main ref={mainRef} className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;