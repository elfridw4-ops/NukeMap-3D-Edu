import { useState, useEffect, Dispatch, SetStateAction } from 'react';

export function usePersistedState<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(`nukemap_edu_${key}`);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch (e) {
      console.error(`Error loading state from localStorage for key: ${key}`, e);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(`nukemap_edu_${key}`, JSON.stringify(state));
    } catch (e) {
      console.error(`Error saving state to localStorage for key: ${key}`, e);
    }
  }, [key, state]);

  return [state, setState];
}
