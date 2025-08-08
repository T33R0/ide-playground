import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'shared_ui/button';
import { Input } from 'shared_ui/input';
import { Switch } from 'shared_ui/switch';

import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  Moon, 
  Send, 
  Sun, 
  Twitter,
  Github
} from 'lucide-react';

const Footer = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Enhanced theme management with CSS enforcement
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Force style recalculation to prevent CSS issues
    document.body.offsetHeight;
    
    // Ensure critical CSS classes are applied
    document.body.classList.add('ddpc-styles-loaded');
    document.documentElement.classList.add('ddpc-app-ready');
  }, [isDarkMode]);

  // Initialize CSS on component mount
  useEffect(() => {
    document.body.classList.add('ddpc-styles-loaded');
    document.documentElement.classList.add('ddpc-app-ready');
    document.body.offsetHeight; // Force style recalculation
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <footer className="relative border-t border-border/40 bg-card/50 backdrop-blur-sm text-card-foreground transition-all duration-300 mt-16">
      <div className="container mx-auto px-6 py-16 md:px-8 lg:px-12">
        <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-4">
          {/* Newsletter Section */}
          <div className="relative lg:col-span-2">
            <h2 className="mb-6 text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Stay Connected</h2>
            <p className="mb-8 text-lg text-muted-foreground/90 leading-relaxed max-w-md">
              Get the latest updates on car builds, maintenance tips, and community features.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="relative max-w-sm">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className="pr-14 h-12 text-base border-border/60 bg-background/80 backdrop-blur-sm focus:border-primary/50 focus:ring-primary/20"
                required
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-2 top-2 h-8 w-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Subscribe</span>
              </Button>
            </form>
            <div className="absolute -right-8 -top-4 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-xl font-semibold text-foreground">Quick Links</h3>
            <nav className="space-y-3 text-base">
              <Link to="/" className="block transition-all duration-200 hover:text-primary hover:translate-x-1 text-muted-foreground hover:text-primary">
                Dashboard
              </Link>
              <Link to="/garage" className="block transition-all duration-200 hover:text-primary hover:translate-x-1 text-muted-foreground hover:text-primary">
                My Garage
              </Link>
              <Link to="/build-plans" className="block transition-all duration-200 hover:text-primary hover:translate-x-1 text-muted-foreground hover:text-primary">
                Build Plans
              </Link>
              <Link to="/maintenance" className="block transition-all duration-200 hover:text-primary hover:translate-x-1 text-muted-foreground hover:text-primary">
                Maintenance
              </Link>
              <Link to="/pricing" className="block transition-all duration-200 hover:text-primary hover:translate-x-1 text-muted-foreground hover:text-primary">
                Pricing
              </Link>
            </nav>
          </div>

          {/* Support & Legal */}
          <div>
            <h3 className="mb-6 text-xl font-semibold text-foreground">Support</h3>
            <nav className="space-y-3 text-base">
              <a href="#" className="block transition-all duration-200 hover:text-primary hover:translate-x-1 text-muted-foreground hover:text-primary">
                Help Center
              </a>
              <a href="#" className="block transition-all duration-200 hover:text-primary hover:translate-x-1 text-muted-foreground hover:text-primary">
                Contact Support
              </a>
              <a href="#" className="block transition-all duration-200 hover:text-primary hover:translate-x-1 text-muted-foreground hover:text-primary">
                Community Forum
              </a>
              <a href="#" className="block transition-all duration-200 hover:text-primary hover:translate-x-1 text-muted-foreground hover:text-primary">
                Feature Requests
              </a>
              <a href="#" className="block transition-all duration-200 hover:text-primary hover:translate-x-1 text-muted-foreground hover:text-primary">
                Bug Reports
              </a>
            </nav>
          </div>

          {/* Social & Theme Toggle */}
          <div className="relative">
            <h3 className="mb-6 text-xl font-semibold text-foreground">Connect With Us</h3>
            <div className="mb-8 flex space-x-4">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-12 w-12 border-border/60 bg-background/80 backdrop-blur-sm hover:bg-blue-50 hover:border-blue-300 hover:scale-110 transition-all duration-200 shadow-sm dark:hover:bg-blue-950/50 dark:hover:border-blue-700"
                asChild
              >
                <a href="#" aria-label="Follow us on Facebook">
                  <Facebook className="h-5 w-5" />
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-12 w-12 border-border/60 bg-background/80 backdrop-blur-sm hover:bg-sky-50 hover:border-sky-300 hover:scale-110 transition-all duration-200 shadow-sm dark:hover:bg-sky-950/50 dark:hover:border-sky-700"
                asChild
              >
                <a href="#" aria-label="Follow us on Twitter">
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-12 w-12 border-border/60 bg-background/80 backdrop-blur-sm hover:bg-pink-50 hover:border-pink-300 hover:scale-110 transition-all duration-200 shadow-sm dark:hover:bg-pink-950/50 dark:hover:border-pink-700"
                asChild
              >
                <a href="#" aria-label="Follow us on Instagram">
                  <Instagram className="h-5 w-5" />
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-12 w-12 border-border/60 bg-background/80 backdrop-blur-sm hover:bg-gray-50 hover:border-gray-300 hover:scale-110 transition-all duration-200 shadow-sm dark:hover:bg-gray-950/50 dark:hover:border-gray-700"
                asChild
              >
                <a href="#" aria-label="Follow us on GitHub">
                  <Github className="h-5 w-5" />
                </a>
              </Button>
            </div>
            
            {/* Theme Toggle */}
            <div className="flex items-center space-x-4 p-4 rounded-xl bg-background/60 backdrop-blur-sm border border-border/40">
              <Sun className={`h-5 w-5 transition-colors duration-200 ${!isDarkMode ? 'text-amber-500' : 'text-muted-foreground/60'}`} />
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
                className="data-[state=checked]:bg-slate-800 data-[state=unchecked]:bg-amber-200"
              />
              <Moon className={`h-5 w-5 transition-colors duration-200 ${isDarkMode ? 'text-slate-300' : 'text-muted-foreground/60'}`} />
              <label htmlFor="dark-mode" className="text-sm font-medium text-foreground cursor-pointer">
                {isDarkMode ? 'Dark' : 'Light'} Mode
              </label>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-border/30 pt-12 text-center md:flex-row">
          <p className="text-base text-muted-foreground/80 font-medium">
            &copy; 2024 <span className="text-foreground font-semibold">DDPC</span> (Drift Drift Panda Club). All rights reserved.
          </p>
          <nav className="flex gap-6 text-base">
            <a href="#" className="transition-all duration-200 hover:text-primary hover:-translate-y-0.5 text-muted-foreground hover:text-primary">
              Privacy Policy
            </a>
            <a href="#" className="transition-all duration-200 hover:text-primary hover:-translate-y-0.5 text-muted-foreground hover:text-primary">
              Terms of Service
            </a>
            <a href="#" className="transition-all duration-200 hover:text-primary hover:-translate-y-0.5 text-muted-foreground hover:text-primary">
              Cookie Settings
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;