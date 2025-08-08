import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Crown, Zap, Star, ArrowRight } from 'lucide-react';
import { useTier, UserTier } from '../../hooks/use-tier';

export interface UpsellCardProps {
  targetTier: UserTier;
  featureTitle: string;
  featureDescription: string;
  benefits: string[];
  className?: string;
  compact?: boolean;
}

const getTierIcon = (tier: UserTier) => {
  switch (tier) {
    case 'builder': return Zap;
    case 'pro': return Crown;
    default: return Star;
  }
};

const getTierColor = (tier: UserTier) => {
  switch (tier) {
    case 'builder': return 'bg-orange-500 hover:bg-orange-600 text-white';
    case 'pro': return 'bg-purple-600 hover:bg-purple-500 text-white';
    default: return 'bg-gray-500 hover:bg-gray-600 text-white';
  }
};

export const UpsellCard: React.FC<UpsellCardProps> = ({
  targetTier,
  featureTitle,
  featureDescription,
  benefits,
  className = '',
  compact = false,
}) => {
  const { setTier } = useTier();
  const TierIcon = getTierIcon(targetTier);

  const handleUpgrade = () => {
    // In a real app, this would trigger payment flow
    // For demo purposes, we'll just upgrade the tier
    setTier(targetTier);
  };

  if (compact) {
    return (
      <div className={`p-4 bg-card border border-warehouse-steel rounded-lg ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TierIcon className="w-5 h-5 text-warehouse-accent" />
            <div>
              <p className="font-medium">{featureTitle}</p>
              <p className="text-sm text-muted-foreground">{featureDescription}</p>
            </div>
          </div>
          <Button 
            size="sm" 
            onClick={handleUpgrade}
            className={getTierColor(targetTier)}
          >
            Upgrade <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className={`border-warehouse-steel shadow-warehouse ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <TierIcon className="w-6 h-6 text-warehouse-accent" />
            <span>{featureTitle}</span>
          </CardTitle>
          <Badge className={getTierColor(targetTier)}>
            {targetTier.charAt(0).toUpperCase() + targetTier.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{featureDescription}</p>
        
        <div className="space-y-2">
          <h4 className="font-medium">What you'll unlock:</h4>
          <ul className="space-y-1">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-center space-x-2 text-sm">
                <div className="w-1.5 h-1.5 bg-warehouse-accent rounded-full" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <Button 
          onClick={handleUpgrade} 
          className={`w-full ${getTierColor(targetTier)}`}
        >
          Upgrade to {targetTier.charAt(0).toUpperCase() + targetTier.slice(1)}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

// Pre-configured upsell cards for common scenarios
export const BuildPlanUpsell: React.FC<{ compact?: boolean }> = ({ compact }) => (
  <UpsellCard
    targetTier="builder"
    featureTitle="Build Plans - $12.99/mo"
    featureDescription="Unlock unlimited garage slots, mod build lists, and detailed project planning."
    benefits={[
      "Unlimited garage slots and advanced maintenance tracking",
      "Mod build lists and wishlists with detailed project planning",
      "Enhanced sharing features and community integration",
      "500 receipts monthly with 2GB photo storage",
      "Basic analytics and insights on spending patterns",
    ]}
    compact={compact}
  />
);

export const TaskManagementUpsell: React.FC<{ compact?: boolean }> = ({ compact }) => (
  <UpsellCard
    targetTier="pro"
    featureTitle="Pro Features - $24.99/mo"
    featureDescription="Everything in Builder plus advanced project management and premium features."
    benefits={[
      "Everything in Builder plus advanced project management",
      "Comprehensive budget tracking with detailed cost analysis",
      "Mobile app access (launching Year 1)",
      "Unlimited receipts with 10GB photo storage",
      "Advanced analytics dashboard and export capabilities",
      "Priority email support and API access",
    ]}
    compact={compact}
  />
);

export const GarageSlotUpsell: React.FC<{ compact?: boolean }> = ({ compact }) => (
  <UpsellCard
    targetTier="builder"
    featureTitle="Unlimited Garage Slots - $12.99/mo"
    featureDescription="Expand beyond 2 vehicles with unlimited garage slots and advanced features."
    benefits={[
      "Unlimited garage slots (from 2)",
      "Advanced maintenance tracking",
      "Mod build lists and wishlists",
      "500 receipts monthly with 2GB storage",
      "Enhanced sharing and community features",
    ]}
    compact={compact}
  />
);