/**
 * CSS Loading Utility for DDPC MFE Architecture
 * Ensures watertight CSS application across host, shared-ui, and all MFEs
 */

export interface CSSLoadingOptions {
  timeout?: number;
  retryAttempts?: number;
  debug?: boolean;
}

/**
 * Ensures CSS variables are properly loaded and available
 */
export const ensureCSSVariables = (options: CSSLoadingOptions = {}): Promise<void> => {
  const { timeout = 5000, retryAttempts = 10, debug = false } = options;
  
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    const checkVariables = () => {
      attempts++;
      
      if (debug) {
        console.log(`[CSS Loader] Checking CSS variables (attempt ${attempts}/${retryAttempts})`);
      }
      
      try {
        const computedStyle = getComputedStyle(document.documentElement);
        const criticalVars = [
          '--background',
          '--foreground', 
          '--primary',
          '--border',
          '--card'
        ];
        
        const loadedVars = criticalVars.filter(varName => {
          const value = computedStyle.getPropertyValue(varName).trim();
          return value && value !== '';
        });
        
        if (loadedVars.length >= criticalVars.length - 1) { // Allow 1 missing var
          if (debug) {
            console.log(`[CSS Loader] CSS variables loaded successfully`, loadedVars);
          }
          resolve();
          return;
        }
        
        if (attempts >= retryAttempts) {
          console.warn(`[CSS Loader] CSS variables not fully loaded after ${retryAttempts} attempts`);
          // Apply fallback variables
          applyFallbackVariables();
          resolve(); // Don't reject, just use fallbacks
          return;
        }
        
        setTimeout(checkVariables, Math.min(50 * attempts, 200));
        
      } catch (error) {
        console.error('[CSS Loader] Error checking CSS variables:', error);
        if (attempts >= retryAttempts) {
          applyFallbackVariables();
          resolve();
        } else {
          setTimeout(checkVariables, 100);
        }
      }
    };
    
    // Start checking immediately
    checkVariables();
    
    // Timeout fallback
    setTimeout(() => {
      if (attempts < retryAttempts) {
        console.warn('[CSS Loader] CSS loading timeout, applying fallbacks');
        applyFallbackVariables();
        resolve();
      }
    }, timeout);
  });
};

/**
 * Apply fallback CSS variables if loading fails
 */
const applyFallbackVariables = () => {
  const fallbacks = {
    // Light mode fallbacks
    '--background': '0 0% 100%',
    '--foreground': '222.2 84% 4.9%',
    '--card': '0 0% 100%',
    '--card-foreground': '222.2 84% 4.9%',
    '--primary': '195 95% 50%',
    '--primary-foreground': '210 40% 98%',
    '--secondary': '210 40% 96%',
    '--secondary-foreground': '222.2 84% 4.9%',
    '--muted': '210 40% 96%',
    '--muted-foreground': '215.4 16.3% 46.9%',
    '--border': '214.3 31.8% 91.4%',
    '--input': '214.3 31.8% 91.4%',
    '--ring': '195 95% 50%'
  };
  
  Object.entries(fallbacks).forEach(([property, value]) => {
    document.documentElement.style.setProperty(property, value);
  });
  
  console.log('[CSS Loader] Applied fallback CSS variables');
};

/**
 * Enforce CSS classes and prevent FOUC
 */
export const enforceCSSClasses = () => {
  // Add critical classes
  document.body.classList.add('ddpc-styles-loaded');
  document.documentElement.classList.add('ddpc-app-ready');
  
  // Force style recalculation
  document.body.offsetHeight;
  
  // Ensure theme class is properly applied
  const isDark = document.documentElement.classList.contains('dark');
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

/**
 * Initialize CSS loading for MFE components
 */
export const initializeMFECSS = async (mfeName: string, options: CSSLoadingOptions = {}) => {
  const { debug = false } = options;
  
  if (debug) {
    console.log(`[CSS Loader] Initializing CSS for MFE: ${mfeName}`);
  }
  
  try {
    // Wait for CSS variables to be available
    await ensureCSSVariables(options);
    
    // Enforce CSS classes
    enforceCSSClasses();
    
    // Set up observers for dynamic content
    setupCSSObservers(mfeName, debug);
    
    if (debug) {
      console.log(`[CSS Loader] CSS initialization complete for MFE: ${mfeName}`);
    }
    
  } catch (error) {
    console.error(`[CSS Loader] Failed to initialize CSS for MFE: ${mfeName}`, error);
    // Apply fallbacks and continue
    applyFallbackVariables();
    enforceCSSClasses();
  }
};

/**
 * Set up observers to maintain CSS consistency
 */
const setupCSSObservers = (mfeName: string, debug: boolean = false) => {
  // MutationObserver for dynamic content
  const observer = new MutationObserver((mutations) => {
    let needsEnforcement = false;
    
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        needsEnforcement = true;
      }
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        needsEnforcement = true;
      }
    });
    
    if (needsEnforcement) {
      if (debug) {
        console.log(`[CSS Loader] Re-enforcing styles for MFE: ${mfeName}`);
      }
      setTimeout(enforceCSSClasses, 0);
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class']
  });
  
  // Navigation event listeners
  const events = ['popstate', 'pushstate', 'hashchange'];
  events.forEach(event => {
    window.addEventListener(event, () => {
      setTimeout(() => enforceCSSClasses(), 0);
    });
  });
};

/**
 * Theme management utilities
 */
export const themeUtils = {
  isDarkMode: () => document.documentElement.classList.contains('dark'),
  
  setDarkMode: (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    enforceCSSClasses();
  },
  
  toggleTheme: () => {
    const isDark = themeUtils.isDarkMode();
    themeUtils.setDarkMode(!isDark);
    return !isDark;
  }
};
