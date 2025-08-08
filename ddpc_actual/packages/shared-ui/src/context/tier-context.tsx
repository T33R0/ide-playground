import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Tier = 'Free' | 'Premium' | 'Enterprise';

export const tiers = [
  {
    id: 'Free',
    name: 'Free',
    price: '$0/mo',
    description: 'For individuals and small projects.',
    features: ['5 Projects', 'Basic Analytics', 'Community Support'],
  },
  {
    id: 'Premium',
    name: 'Premium',
    price: '$29/mo',
    description: 'For growing teams and professionals.',
    features: ['Unlimited Projects', 'Advanced Analytics', 'Priority Email Support', 'Team Collaboration (up to 5 users)'],
  },
  {
    id: 'Enterprise',
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations with advanced needs.',
    features: ['All Premium Features', 'Dedicated Account Manager', 'Custom Integrations', '24/7/365 Support'],
  },
] as const;

interface TierContextType {
  currentTier: Tier;
  setCurrentTier: (tier: Tier) => void;
}

const TierContext = createContext<TierContextType | undefined>(undefined);

export const TierProvider = ({ children }: { children: ReactNode }) => {
  const [currentTier, setCurrentTier] = useState<Tier>('Premium');

  return (
    <TierContext.Provider value={{ currentTier, setCurrentTier }}>
      {children}
    </TierContext.Provider>
  );
};

export const useTier = () => {
  const context = useContext(TierContext);
  if (context === undefined) {
    throw new Error('useTier must be used within a TierProvider');
  }
  return context;
};
