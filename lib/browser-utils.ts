/**
 * Safe browser API utilities for SSR compatibility
 */

export const isBrowser = typeof window !== 'undefined';

export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (!isBrowser) return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('localStorage.getItem failed:', error);
      return null;
    }
  },
  
  setItem: (key: string, value: string): void => {
    if (!isBrowser) return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('localStorage.setItem failed:', error);
    }
  },
  
  removeItem: (key: string): void => {
    if (!isBrowser) return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('localStorage.removeItem failed:', error);
    }
  }
};

export const safeSessionStorage = {
  getItem: (key: string): string | null => {
    if (!isBrowser) return null;
    try {
      return sessionStorage.getItem(key);
    } catch (error) {
      console.warn('sessionStorage.getItem failed:', error);
      return null;
    }
  },
  
  setItem: (key: string, value: string): void => {
    if (!isBrowser) return;
    try {
      sessionStorage.setItem(key, value);
    } catch (error) {
      console.warn('sessionStorage.setItem failed:', error);
    }
  },
  
  removeItem: (key: string): void => {
    if (!isBrowser) return;
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.warn('sessionStorage.removeItem failed:', error);
    }
  }
};