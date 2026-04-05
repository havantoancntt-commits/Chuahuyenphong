import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface UserStats {
  dharmaId: string;
  meritPoints: number;
  streak: number;
  lastVisit: string; // ISO date
  totalBellRings: number;
  totalPrayers: number;
  totalRepentance: number;
}

interface UserStatsContextType {
  stats: UserStats;
  addMerit: (amount: number) => void;
  incrementBell: () => void;
  incrementPrayer: () => void;
  incrementRepentance: () => void;
  incrementBow: () => void;
  incrementIncense: () => void;
}

const STORAGE_KEY = 'huyen_phong_user_stats';

const defaultStats: UserStats = {
  dharmaId: '',
  meritPoints: 0,
  streak: 0,
  lastVisit: '',
  totalBellRings: 0,
  totalPrayers: 0,
  totalRepentance: 0,
};

const UserStatsContext = createContext<UserStatsContextType | undefined>(undefined);

export function UserStatsProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<UserStats>(defaultStats);

  // Initialize stats from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    let currentStats: UserStats;

    if (saved) {
      currentStats = JSON.parse(saved);
    } else {
      currentStats = {
        ...defaultStats,
        dharmaId: `HP-${uuidv4().slice(0, 8).toUpperCase()}`,
        lastVisit: new Date().toISOString(),
        streak: 1,
      };
    }

    // Check for daily streak
    const today = new Date().toISOString().split('T')[0];
    const lastVisitDate = currentStats.lastVisit.split('T')[0];

    if (today !== lastVisitDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastVisitDate === yesterdayStr) {
        currentStats.streak += 1;
      } else {
        currentStats.streak = 1;
      }
      currentStats.lastVisit = new Date().toISOString();
    }

    setStats(currentStats);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentStats));
  }, []);

  // Save stats whenever they change
  useEffect(() => {
    if (stats.dharmaId) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    }
  }, [stats]);

  const addMerit = (amount: number) => {
    setStats(prev => ({ ...prev, meritPoints: prev.meritPoints + amount }));
  };

  const incrementBell = () => {
    setStats(prev => ({ 
      ...prev, 
      totalBellRings: prev.totalBellRings + 1,
      meritPoints: prev.meritPoints + 1 
    }));
  };

  const incrementPrayer = () => {
    setStats(prev => ({ 
      ...prev, 
      totalPrayers: prev.totalPrayers + 1,
      meritPoints: prev.meritPoints + 10 
    }));
  };

  const incrementRepentance = () => {
    setStats(prev => ({ 
      ...prev, 
      totalRepentance: prev.totalRepentance + 1,
      meritPoints: prev.meritPoints + 50 
    }));
  };

  const incrementBow = () => {
    setStats(prev => ({ 
      ...prev, 
      totalPrayers: prev.totalPrayers + 1,
      meritPoints: prev.meritPoints + 5 
    }));
  };

  const incrementIncense = () => {
    setStats(prev => ({ 
      ...prev, 
      meritPoints: prev.meritPoints + 10 
    }));
  };

  return (
    <UserStatsContext.Provider value={{ stats, addMerit, incrementBell, incrementPrayer, incrementRepentance, incrementBow, incrementIncense }}>
      {children}
    </UserStatsContext.Provider>
  );
}

export function useUserStats() {
  const context = useContext(UserStatsContext);
  if (context === undefined) {
    throw new Error('useUserStats must be used within a UserStatsProvider');
  }
  return context;
}
