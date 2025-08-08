import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Badge } from './badge';
import { useTier, UserTier } from '../../hooks/use-tier';

export const TierSwitcher: React.FC = () => {
  const { currentTier, setTier } = useTier();

  const handleTierChange = (newTier: string) => {
    setTier(newTier as UserTier);
  };

  const getTierColor = (tier: UserTier) => {
    switch (tier) {
      case 'guest': return 'bg-gray-400';
      case 'driver': return 'bg-gray-500';
      case 'builder': return 'bg-warehouse-warning';
      case 'pro': return 'bg-gradient-tech';
      default: return 'bg-gray-500';
    }
  };

  const getTierLabel = (tier: UserTier) => {
    switch (tier) {
      case 'guest': return 'Not Signed In';
      case 'driver': return 'Driver';
      case 'builder': return 'Builder';
      case 'pro': return 'Pro';
      default: return 'Unknown';
    }
  };

  // Check if we're in development mode
  const isDev = process.env.NODE_ENV === 'development';

  if (!isDev) {
    // Production mode - just show the badge without dropdown functionality
    return (
      <Badge className={`${getTierColor(currentTier)} text-white text-xs`}>
        {getTierLabel(currentTier)}
      </Badge>
    );
  }

  // Development mode - show as selectable dropdown but styled to look like just a badge
  return (
    <Select value={currentTier} onValueChange={handleTierChange}>
      <SelectTrigger className="border-0 bg-transparent p-0 h-auto focus:ring-0 focus:ring-offset-0">
        <SelectValue>
          <Badge className={`${getTierColor(currentTier)} text-white text-xs cursor-pointer`}>
            {getTierLabel(currentTier)}
          </Badge>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="guest">
          <div className="flex items-center space-x-2">
            <Badge className="bg-gray-400 text-white text-xs">Not Signed In</Badge>
            <span className="text-xs text-muted-foreground">No access</span>
          </div>
        </SelectItem>
        <SelectItem value="driver">
          <div className="flex items-center space-x-2">
            <Badge className="bg-gray-500 text-white text-xs">Driver</Badge>
            <span className="text-xs text-muted-foreground">2 vehicles</span>
          </div>
        </SelectItem>
        <SelectItem value="builder">
          <div className="flex items-center space-x-2">
            <Badge className="bg-warehouse-warning text-black text-xs">Builder</Badge>
            <span className="text-xs text-muted-foreground">3 vehicles + builds</span>
          </div>
        </SelectItem>
        <SelectItem value="pro">
          <div className="flex items-center space-x-2">
            <Badge className="bg-gradient-tech text-white text-xs">Pro</Badge>
            <span className="text-xs text-muted-foreground">5 vehicles + all features</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};