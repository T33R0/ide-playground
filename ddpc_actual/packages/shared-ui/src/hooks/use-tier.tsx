import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserTier = 'guest' | 'driver' | 'builder' | 'pro';

export interface TierLimits {
  maxVehicles: number;
  canAccessBuildPlans: boolean;
  canShareBuilds: boolean;
  canExportData: boolean;
  canAccessTaskManagement: boolean;
  canAccessTimelines: boolean;
  exportFormat: 'basic' | 'full';
  maxBuildsPerVehicle: number;
}

export interface TierConfig {
  guest: TierLimits;
  driver: TierLimits;
  builder: TierLimits;
  pro: TierLimits;
}

export const TIER_CONFIG: TierConfig = {
  guest: {
    maxVehicles: 0,
    canAccessBuildPlans: false,
    canShareBuilds: false,
    canExportData: false,
    canAccessTaskManagement: false,
    canAccessTimelines: false,
    exportFormat: 'basic',
    maxBuildsPerVehicle: 0,
  },
  driver: {
    maxVehicles: 2,
    canAccessBuildPlans: false,
    canShareBuilds: false,
    canExportData: true,
    canAccessTaskManagement: false,
    canAccessTimelines: false,
    exportFormat: 'basic',
    maxBuildsPerVehicle: 0,
  },
  builder: {
    maxVehicles: -1, // Unlimited
    canAccessBuildPlans: true,
    canShareBuilds: true,
    canExportData: true,
    canAccessTaskManagement: false,
    canAccessTimelines: false,
    exportFormat: 'basic',
    maxBuildsPerVehicle: 2,
  },
  pro: {
    maxVehicles: -1, // Unlimited
    canAccessBuildPlans: true,
    canShareBuilds: true,
    canExportData: true,
    canAccessTaskManagement: true,
    canAccessTimelines: true,
    exportFormat: 'full',
    maxBuildsPerVehicle: 10,
  },
};

export interface TierContextType {
  currentTier: UserTier;
  limits: TierLimits;
  setTier: (tier: UserTier) => void;
  canAccessFeature: (feature: keyof TierLimits) => boolean;
  getUpgradePrompt: (feature: keyof TierLimits) => string | null;
  isAtLimit: (currentCount: number, limitType: 'vehicles' | 'builds') => boolean;
}

const TierContext = createContext<TierContextType | undefined>(undefined);

export interface TierProviderProps {
  children: React.ReactNode;
  initialTier?: UserTier;
}

export const TierProvider: React.FC<TierProviderProps> = ({ 
  children, 
  initialTier = 'driver' 
}) => {
  const [currentTier, setCurrentTier] = useState<UserTier>(initialTier);

  // Load tier from localStorage on mount
  useEffect(() => {
    const savedTier = localStorage.getItem('userTier') as UserTier;
    if (savedTier && Object.keys(TIER_CONFIG).includes(savedTier)) {
      setCurrentTier(savedTier);
    }
  }, []);

  const setTier = (tier: UserTier) => {
    setCurrentTier(tier);
    localStorage.setItem('userTier', tier);
  };

  const limits = TIER_CONFIG[currentTier];

  const canAccessFeature = (feature: keyof TierLimits): boolean => {
    const value = limits[feature];
    return typeof value === 'boolean' ? value : true;
  };

  const getUpgradePrompt = (feature: keyof TierLimits): string | null => {
    if (canAccessFeature(feature)) return null;

    const featureMessages: Record<keyof TierLimits, string> = {
      maxVehicles: "Upgrade to add more vehicles to your garage",
      canAccessBuildPlans: "Upgrade to Builder tier to access Build Plans",
      canShareBuilds: "Upgrade to Builder tier to share your builds",
      canExportData: "Upgrade to access data export features",
      canAccessTaskManagement: "Upgrade to Pro tier for advanced task management",
      canAccessTimelines: "Upgrade to Pro tier for timeline and roadmap features",
      exportFormat: "Upgrade to Pro tier for full PDF export",
      maxBuildsPerVehicle: "Upgrade to create more build plans per vehicle",
    };

    return featureMessages[feature] || "Upgrade to unlock this feature";
  };

  const isAtLimit = (currentCount: number, limitType: 'vehicles' | 'builds'): boolean => {
    if (limitType === 'vehicles') {
      return currentCount >= limits.maxVehicles;
    }
    if (limitType === 'builds') {
      return currentCount >= limits.maxBuildsPerVehicle;
    }
    return false;
  };

  const value: TierContextType = {
    currentTier,
    limits,
    setTier,
    canAccessFeature,
    getUpgradePrompt,
    isAtLimit,
  };

  return (
    <TierContext.Provider value={value}>
      {children}
    </TierContext.Provider>
  );
};

export const useTier = (): TierContextType => {
  const context = useContext(TierContext);
  if (context === undefined) {
    throw new Error('useTier must be used within a TierProvider');
  }
  return context;
};

// Utility component for tier-based rendering
export interface TierGateProps {
  children: React.ReactNode;
  requiredFeature?: keyof TierLimits;
  requiredTier?: UserTier;
  fallback?: React.ReactNode;
}

export const TierGate: React.FC<TierGateProps> = ({ 
  children, 
  requiredFeature,
  requiredTier,
  fallback = null 
}) => {
  const { currentTier, canAccessFeature } = useTier();

  // Check tier-based access
  if (requiredTier) {
    const tierOrder: UserTier[] = ['driver', 'builder', 'pro'];
    const currentTierIndex = tierOrder.indexOf(currentTier);
    const requiredTierIndex = tierOrder.indexOf(requiredTier);
    
    if (currentTierIndex < requiredTierIndex) {
      return <>{fallback}</>;
    }
  }

  // Check feature-based access
  if (requiredFeature && !canAccessFeature(requiredFeature)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};