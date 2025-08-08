import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { TierProvider } from 'shared_ui/context/tier-context';

// Universal CSS Loading - Load core styles at host level
import "shared_ui/index.css";
import "./index.css";

// CSS Loading State Management
const ensureCSSLoaded = () => {
  return new Promise<void>((resolve) => {
    // Check if stylesheets are loaded
    const checkStylesheets = () => {
      const stylesheets = Array.from(document.styleSheets);
      const hasSharedUI = stylesheets.some(sheet => {
        try {
          return sheet.href && sheet.href.includes('shared_ui') || 
                 (sheet.cssRules && sheet.cssRules.length > 0);
        } catch (e) {
          return true; // Assume loaded if we can't check due to CORS
        }
      });
      
      if (hasSharedUI || stylesheets.length > 0) {
        resolve();
      } else {
        setTimeout(checkStylesheets, 10);
      }
    };
    
    checkStylesheets();
  });
};

const renderApp = async () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('Failed to find the root element. The app cannot be mounted.');
    return;
  }

  // Wait for CSS to be fully loaded
  await ensureCSSLoaded();

  const root = ReactDOM.createRoot(rootElement);

  // Enhanced CSS persistence enforcement
  const enforceStyles = () => {
    // Add critical classes to prevent FOUC
    document.body.classList.add('ddpc-styles-loaded');
    document.documentElement.classList.add('ddpc-app-ready');
    
    // Force style recalculation to prevent CSS loading race conditions
    document.body.offsetHeight;
    
    // Ensure CSS custom properties are available
    const computedStyle = getComputedStyle(document.documentElement);
    const bgColor = computedStyle.getPropertyValue('--background').trim();
    
    // Apply fallback styles if CSS variables aren't loaded
    if (!bgColor) {
      console.warn('CSS variables not loaded, applying fallbacks');
      document.documentElement.style.setProperty('--background', '0 0% 100%');
      document.documentElement.style.setProperty('--foreground', '222.2 84% 4.9%');
      document.documentElement.style.setProperty('--primary', '195 95% 50%');
    }
  };

  // Comprehensive event listeners for style enforcement
  const events = ['popstate', 'pushstate', 'load', 'DOMContentLoaded', 'readystatechange'];
  events.forEach(event => {
    window.addEventListener(event, enforceStyles);
  });
  
  // MutationObserver to watch for dynamic content changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Re-enforce styles when new content is added
        setTimeout(enforceStyles, 0);
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Initial style enforcement
  enforceStyles();

  root.render(
    <React.StrictMode>
      <TierProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </TierProvider>
    </React.StrictMode>
  );
};

// Wait for the DOM to be fully loaded before rendering the app
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  // DOMContentLoaded has already fired
  renderApp();
}