import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage(key, initialValue) {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Remove item from localStorage
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

// Hook for managing user preferences
export function useUserPreferences() {
  const [preferences, setPreferences, removePreferences] = useLocalStorage('soulconnect_preferences', {
    theme: 'default',
    notifications: true,
    autoSave: true,
    language: 'en'
  });

  const updatePreference = useCallback((key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  }, [setPreferences]);

  return {
    preferences,
    updatePreference,
    resetPreferences: removePreferences
  };
}

// Hook for managing user generation history
export function useGenerationHistory() {
  const [history, setHistory, clearHistory] = useLocalStorage('soulconnect_history', {
    bios: [],
    dateIdeas: []
  });

  const addBioGeneration = useCallback((generation) => {
    setHistory(prev => ({
      ...prev,
      bios: [
        {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          ...generation
        },
        ...prev.bios.slice(0, 49) // Keep only last 50 generations
      ]
    }));
  }, [setHistory]);

  const addDateIdeaGeneration = useCallback((generation) => {
    setHistory(prev => ({
      ...prev,
      dateIdeas: [
        {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          ...generation
        },
        ...prev.dateIdeas.slice(0, 49) // Keep only last 50 generations
      ]
    }));
  }, [setHistory]);

  const removeBioGeneration = useCallback((id) => {
    setHistory(prev => ({
      ...prev,
      bios: prev.bios.filter(bio => bio.id !== id)
    }));
  }, [setHistory]);

  const removeDateIdeaGeneration = useCallback((id) => {
    setHistory(prev => ({
      ...prev,
      dateIdeas: prev.dateIdeas.filter(idea => idea.id !== id)
    }));
  }, [setHistory]);

  return {
    history,
    addBioGeneration,
    addDateIdeaGeneration,
    removeBioGeneration,
    removeDateIdeaGeneration,
    clearHistory
  };
}

// Hook for managing user profile data
export function useUserProfile() {
  const [profile, setProfile, clearProfile] = useLocalStorage('soulconnect_profile', {
    interests: '',
    personality: '',
    lookingFor: '',
    location: '',
    preferredVibe: '',
    walletAddress: null,
    createdAt: null
  });

  const updateProfile = useCallback((updates) => {
    setProfile(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString()
    }));
  }, [setProfile]);

  const initializeProfile = useCallback((walletAddress) => {
    if (!profile.createdAt) {
      setProfile(prev => ({
        ...prev,
        walletAddress,
        createdAt: new Date().toISOString()
      }));
    }
  }, [profile.createdAt, setProfile]);

  return {
    profile,
    updateProfile,
    initializeProfile,
    clearProfile
  };
}
