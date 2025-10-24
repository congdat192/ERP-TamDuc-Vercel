import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LensFilters } from '../types/lens';

export function useLensFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<LensFilters>(() => {
    // Parse attributeFilters from URL: ?attr_lens_brand=CHEMI,ESSILOR&attr_tinh_nang_trong=UV400
    const attributeFilters: Record<string, string[]> = {};
    searchParams.forEach((value, key) => {
      if (key.startsWith('attr_')) {
        const slug = key.replace('attr_', '');
        attributeFilters[slug] = value.split(',').filter(Boolean);
      }
    });
    
    return {
      attributeFilters,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : null,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : null,
      search: searchParams.get('search') || '',
      sort: (searchParams.get('sort') as LensFilters['sort']) || 'newest',
    };
  });

  // Sync filters to URL
  useEffect(() => {
    const params = new URLSearchParams();
    
    // Sync attributeFilters to URL as attr_slug=value1,value2
    Object.entries(filters.attributeFilters).forEach(([slug, values]) => {
      if (values.length > 0) {
        params.set(`attr_${slug}`, values.join(','));
      }
    });
    
    if (filters.minPrice !== null) {
      params.set('minPrice', filters.minPrice.toString());
    }
    
    if (filters.maxPrice !== null) {
      params.set('maxPrice', filters.maxPrice.toString());
    }
    
    if (filters.search) {
      params.set('search', filters.search);
    }
    
    if (filters.sort !== 'newest') {
      params.set('sort', filters.sort);
    }

    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const updateFilter = <K extends keyof LensFilters>(key: K, value: LensFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleAttributeValue = (slug: string, value: string) => {
    setFilters(prev => {
      const currentValues = prev.attributeFilters[slug] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      const newAttributeFilters = { ...prev.attributeFilters };
      if (newValues.length === 0) {
        delete newAttributeFilters[slug];
      } else {
        newAttributeFilters[slug] = newValues;
      }
      
      return { ...prev, attributeFilters: newAttributeFilters };
    });
  };

  const clearFilters = () => {
    setFilters({
      attributeFilters: {},
      minPrice: null,
      maxPrice: null,
      search: '',
      sort: 'newest',
    });
  };

  const hasActiveFilters = 
    Object.keys(filters.attributeFilters).length > 0 ||
    filters.minPrice !== null ||
    filters.maxPrice !== null ||
    filters.search !== '';

  return {
    filters,
    updateFilter,
    toggleAttributeValue,
    clearFilters,
    hasActiveFilters,
  };
}
