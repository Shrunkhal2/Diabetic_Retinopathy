import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/auth.service';
import { storageService, STORAGE_KEYS } from '../services/storage.service';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // --------------------
  // AUTH STATE
  // --------------------
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated()
  );

  // --------------------
  // PATIENT STATE
  // --------------------
  const [patients, setPatients] = useState([]);
  const [currentPatient, setCurrentPatient] = useState(null);

  // --------------------
  // INIT LOAD
  // --------------------
  useEffect(() => {
    const storedPatients = storageService.get(
      STORAGE_KEYS.PATIENTS,
      []
    );
    setPatients(storedPatients);
  }, []);

  // --------------------
  // CONTEXT VALUE
  // --------------------
  const value = {
    // auth
    isAuthenticated,
    setIsAuthenticated,

    // patients
    patients,
    setPatients,
    currentPatient,
    setCurrentPatient,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for clean access
export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used inside AppProvider');
  }
  return ctx;
};