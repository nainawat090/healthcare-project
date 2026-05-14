import { createContext, useContext, useState, useReducer } from 'react';

const AppContext = createContext(null);

const initialState = {
  language:        'en',       // 'en' | 'hi'
  sidebarOpen:     true,
  notifications:   [],
  activeEmergencies: 0,
  queueCount:      0,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LANGUAGE':        return { ...state, language: action.payload };
    case 'TOGGLE_SIDEBAR':      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'ADD_NOTIFICATION':    return { ...state, notifications: [action.payload, ...state.notifications].slice(0, 50) };
    case 'MARK_READ':           return { ...state, notifications: state.notifications.map(n => n.id === action.payload ? { ...n, read: true } : n) };
    case 'CLEAR_NOTIFICATIONS': return { ...state, notifications: [] };
    case 'SET_EMERGENCIES':     return { ...state, activeEmergencies: action.payload };
    case 'SET_QUEUE_COUNT':     return { ...state, queueCount: action.payload };
    default: return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const t = (en, hi) => state.language === 'hi' ? hi : en;

  return (
    <AppContext.Provider value={{ ...state, dispatch, t }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
