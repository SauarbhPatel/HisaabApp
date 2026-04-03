import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [useCase, setUseCase] = useState('both'); // 'split' | 'freelance' | 'both'
  const [user, setUser] = useState({
    name: 'Rahul Kumar',
    initials: 'RK',
    email: 'rahul.kumar@gmail.com',
    role: 'Freelancer',
    avatar: '😎',
  });

  const login = (selectedUseCase) => {
    setUseCase(selectedUseCase || 'both');
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUseCase('both');
  };

  return (
    <AppContext.Provider value={{ isAuthenticated, useCase, user, login, logout, setUseCase }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be inside AppProvider');
  return ctx;
}
