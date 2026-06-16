import { useEffect, useState } from 'react';

export function useLocalStorage(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save localStorage', error);
    }
  }, [key, state]);

  return [state, setState];
}
