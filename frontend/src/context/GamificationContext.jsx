import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { userApi, streakApi, badgeApi } from '../services/api';
import { useAuth } from './AuthContext';

const GamificationContext = createContext();

export const GamificationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState({ current_streak: 0, longest_streak: 0, last_active_date: null });
  const [badges, setBadges] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [levelUpData, setLevelUpData] = useState(null);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    const newToast = { id, ...toast };
    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, toast.duration || 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const refreshGamification = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const [profRes, streakRes, badgeRes] = await Promise.allSettled([
        userApi.getProfile(),
        streakApi.get(),
        badgeApi.getAll(),
      ]);

      if (profRes.status === 'fulfilled' && profRes.value.data?.user) {
        const u = profRes.value.data.user;
        setXp(u.xp || 0);
        setLevel(u.level || 1);
      }

      if (streakRes.status === 'fulfilled' && streakRes.value.data?.streak) {
        setStreak(streakRes.value.data.streak);
      }

      if (badgeRes.status === 'fulfilled' && badgeRes.value.data?.badges) {
        setBadges(badgeRes.value.data.badges);
      }
    } catch (err) {
      console.warn('Failed to refresh gamification state:', err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshGamification();
    } else {
      setXp(0);
      setLevel(1);
      setStreak({ current_streak: 0, longest_streak: 0, last_active_date: null });
      setBadges([]);
    }
  }, [isAuthenticated, refreshGamification]);

  // Handle action rewards returned by backend (e.g. { xp, streak, newlyUnlockedBadges })
  const handleReward = useCallback((gamification) => {
    if (!gamification) return;

    // 1. XP & Level handling
    if (gamification.xp) {
      const { xpGained, newTotalXp, newLevel, leveledUp } = gamification.xp;
      if (typeof newTotalXp === 'number') setXp(newTotalXp);
      if (typeof newLevel === 'number') setLevel(newLevel);

      if (xpGained > 0) {
        addToast({
          type: 'xp',
          title: `+${xpGained} XP Earned!`,
          message: leveledUp ? `Level Up! You reached Level ${newLevel}!` : 'Keep up the great momentum!',
        });
      }

      if (leveledUp) {
        setLevelUpData({ newLevel, totalXp: newTotalXp });
      }
    }

    // 2. Streak handling
    if (gamification.streak) {
      setStreak((prev) => ({
        ...prev,
        current_streak: gamification.streak.current_streak ?? prev.current_streak,
        longest_streak: gamification.streak.longest_streak ?? prev.longest_streak,
        last_active_date: gamification.streak.last_active_date ?? prev.last_active_date,
      }));
    }

    // 3. Badges handling
    if (Array.isArray(gamification.newlyUnlockedBadges) && gamification.newlyUnlockedBadges.length > 0) {
      gamification.newlyUnlockedBadges.forEach((badge) => {
        addToast({
          type: 'badge',
          title: `Achievement Unlocked: ${badge.name}!`,
          message: badge.description,
          duration: 6000,
        });
      });
      // Refresh badge list
      badgeApi.getAll().then((res) => {
        if (res.data?.badges) setBadges(res.data.badges);
      }).catch(() => {});
    }
  }, [addToast]);

  return (
    <GamificationContext.Provider
      value={{
        xp,
        level,
        streak,
        badges,
        toasts,
        levelUpData,
        closeLevelUpModal: () => setLevelUpData(null),
        addToast,
        removeToast,
        refreshGamification,
        handleReward,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => useContext(GamificationContext);
