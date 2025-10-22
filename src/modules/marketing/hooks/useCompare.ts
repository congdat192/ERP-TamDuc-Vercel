import { useState, useEffect } from 'react';
import { LensProduct } from '../types/lens';

const COMPARE_KEY = 'lens_compare';
const MAX_COMPARE = 3;

export function useCompare() {
  const [compareList, setCompareList] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(COMPARE_KEY);
    if (saved) {
      try {
        setCompareList(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem(COMPARE_KEY);
      }
    }
  }, []);

  const addToCompare = (productId: string) => {
    setCompareList(prev => {
      if (prev.includes(productId)) return prev;
      if (prev.length >= MAX_COMPARE) return prev;
      
      const newList = [...prev, productId];
      localStorage.setItem(COMPARE_KEY, JSON.stringify(newList));
      return newList;
    });
  };

  const removeFromCompare = (productId: string) => {
    setCompareList(prev => {
      const newList = prev.filter(id => id !== productId);
      localStorage.setItem(COMPARE_KEY, JSON.stringify(newList));
      return newList;
    });
  };

  const clearCompare = () => {
    setCompareList([]);
    localStorage.removeItem(COMPARE_KEY);
  };

  const isInCompare = (productId: string) => compareList.includes(productId);

  const canAddMore = compareList.length < MAX_COMPARE;

  return {
    compareList,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare,
    canAddMore,
    count: compareList.length,
  };
}
