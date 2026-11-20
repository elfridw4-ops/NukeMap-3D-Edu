import { useState, useEffect, Dispatch, SetStateAction } from 'react';

function isPlainObject(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

export function usePersistedState<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(`nukemap_edu_${key}`);
      if (stored === null) return initialValue;
      const parsed = JSON.parse(stored);
      if (isPlainObject(initialValue) && isPlainObject(parsed)) {
        return { ...initialValue, ...parsed } as T;
      }
      return parsed as T;
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
