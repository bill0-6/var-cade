"use client";

import { useState, useEffect } from 'react';

export function useGhostAuth() {
  const [handle, setHandle] = useState<string>('');
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    try {
      const storedHandle = localStorage.getItem('var_cade_handle');
      if (storedHandle) {
        setHandle(storedHandle);
      } else {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const newHandle = `@Fan_${randomNum}`;
        localStorage.setItem('var_cade_handle', newHandle);
        setHandle(newHandle);
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    } finally {
      setIsReady(true);
    }
  }, []);

  return { handle, isReady };
}