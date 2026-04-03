import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadSession, clearSession, STORAGE_KEYS } from '../api/client';
import { logoutFromServer } from '../api/auth';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // ─── Auth state ──────────────────────────────────────────────────────────────
  const [isAuthenticated, setIsAuthenticated]   = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [accessToken, setAccessToken]           = useState(null);
  const [refreshToken, setRefreshToken]         = useState(null);

  // ─── User state ──────────────────────────────────────────────────────────────
  const [user, setUser] = useState({
    id: null,
    name: '',
    email: '',
    phone: '',
    avatar: '😎',
    avatarColor: '#1a7a5e',
    useCase: 'both',
    initials: 'RK',
    role: '',
  });

  const useCase = user.useCase || 'both';

  // ─── Restore session from AsyncStorage on app launch ─────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const session = await loadSession();
        if (session.accessToken && session.user) {
          setAccessToken(session.accessToken);
          setRefreshToken(session.refreshToken);
          setUser(buildUserState(session.user));
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.warn('Session restore error:', e);
      } finally {
        setIsLoadingSession(false);
      }
    })();
  }, []);

  // ─── Called after successful login or signup complete ─────────────────────────
  const handleAuthSuccess = useCallback((data) => {
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    setUser(buildUserState(data.user));
    setIsAuthenticated(true);
  }, []);

  // ─── Logout ───────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await logoutFromServer();
    } catch (_) {}
    await clearSession();
    setAccessToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);
    setUser({
      id: null, name: '', email: '', phone: '',
      avatar: '😎', avatarColor: '#1a7a5e',
      useCase: 'both', initials: '', role: '',
    });
  }, []);

  // ─── Update useCase ───────────────────────────────────────────────────────────
  const setUseCase = useCallback((newUseCase) => {
    setUser((prev) => ({ ...prev, useCase: newUseCase }));
  }, []);

  // ─── Update user fields ───────────────────────────────────────────────────────
  const updateUser = useCallback((fields) => {
    setUser((prev) => {
      const updated = { ...prev, ...fields };
      AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  }, []);

  return (
    <AppContext.Provider value={{
      isAuthenticated,
      isLoadingSession,
      accessToken,
      refreshToken,
      handleAuthSuccess,
      logout,
      user,
      useCase,
      updateUser,
      setUseCase,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
}

// ─── Map API user → local state shape ────────────────────────────────────────
function buildUserState(apiUser) {
  const name = apiUser.name || '';
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'HI';

  const roleMap = {
    freelance: 'Freelancer',
    split:     'Expense Tracker',
    both:      'Freelancer',
  };

  return {
    id:          apiUser.id || apiUser._id || null,
    name,
    email:       apiUser.email || '',
    phone:       apiUser.phone || '',
    avatar:      apiUser.avatar || '😎',
    avatarColor: apiUser.avatarColor || '#1a7a5e',
    useCase:     apiUser.useCase || 'both',
    role:        roleMap[apiUser.useCase] || 'Freelancer',
    initials,
  };
}
