import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  full_name: string;
  clinic_id: string;
  role: 'owner' | 'admin' | 'doctor' | 'secretary';
}

interface Clinic {
  id: string;
  name: string;
  plan_id: string;
}

interface Subscription {
  id: string;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'expired';
  current_period_end: string;
  plan: {
    name: string;
    slug: string;
    features: string[];
  };
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  clinic: Clinic | null;
  subscription: Subscription | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshAuthData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAuthData = async (userId: string) => {
    try {
      // Fetch Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileData) {
        setProfile(profileData);

        // Fetch Clinic
        const { data: clinicData } = await supabase
          .from('clinics')
          .select('*')
          .eq('id', profileData.clinic_id)
          .single();
        
        if (clinicData) setClinic(clinicData);

        // Fetch Subscription with Plan details
        const { data: subData } = await supabase
          .from('subscriptions')
          .select(`
            *,
            plan:plans (
              name,
              slug,
              features
            )
          `)
          .eq('clinic_id', profileData.clinic_id)
          .maybeSingle();

        if (subData) {
          // Check for manual expiration
          const isExpired = subData.current_period_end && new Date(subData.current_period_end) < new Date();
          setSubscription({
            ...subData,
            status: isExpired && subData.status !== 'canceled' ? 'expired' : subData.status
          });
        }
      }
    } catch (error) {
      console.error('Error fetching auth data:', error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        await fetchAuthData(currentUser.id);
      }
      setLoading(false);
    };

    initialize();

    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        await fetchAuthData(currentUser.id);
      } else {
        setProfile(null);
        setClinic(null);
        setSubscription(null);
      }
      setLoading(false);
    });

    return () => {
      authSubscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setClinic(null);
    setSubscription(null);
  };

  const refreshAuthData = async () => {
    if (user) await fetchAuthData(user.id);
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      profile, 
      clinic, 
      subscription, 
      loading, 
      signOut,
      refreshAuthData 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
