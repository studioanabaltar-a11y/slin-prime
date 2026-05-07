import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface FeatureGuardProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const FeatureGuard: React.FC<FeatureGuardProps> = ({ feature, children, fallback }) => {
  const { subscription } = useAuth();

  // If no subscription or no features list, assume basic access
  if (!subscription || !subscription.plan || !subscription.plan.features) {
    return <>{children}</>;
  }

  const hasFeature = subscription.plan.features.includes(feature);

  if (hasFeature) {
    return <>{children}</>;
  }

  // If fallback is provided (like an upgrade button), show it
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default: hide the restricted feature
  return null;
};

// Hook for easier feature checking in code
export const usePlan = () => {
  const { subscription, profile } = useAuth();

  return {
    hasFeature: (feature: string) => subscription?.plan?.features?.includes(feature) ?? false,
    isOwner: profile?.role === 'owner',
    isAdmin: profile?.role === 'admin' || profile?.role === 'owner',
    isTrialing: subscription?.status === 'trialing',
    isExpired: subscription?.status === 'expired',
    planName: subscription?.plan?.name ?? 'Starter',
  };
};
