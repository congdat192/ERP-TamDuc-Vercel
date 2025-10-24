import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LensFilters } from '../types/lens';

export function useLensFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse filters from URL (URL is single source of truth)
  const filters = useMemo<LensFilters>(() => {
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
      sph: searchParams.get('sph') ? Number(searchParams.get('sph')) : undefined,
      cyl: searchParams.get('cyl') ? Number(searchParams.get('cyl')) : undefined,
      useCases: searchParams.get('useCases') ? searchParams.get('useCases')!.split(',') : undefined,
      availableTiers: searchParams.get('availableTiers') 
        ? searchParams.get('availableTiers')!.split(',') as ('IN_STORE' | 'NEXT_DAY' | 'CUSTOM_ORDER' | 'FACTORY_ORDER')[]
        : undefined,
    };
  }, [searchParams]);

  const updateFilter = <K extends keyof LensFilters>(key: K, value: LensFilters[K]) => {
    const params = new URLSearchParams(searchParams);
    
    if (key === 'attributeFilters') {
      // Remove old attr_ params
      Array.from(params.keys()).forEach(k => {
        if (k.startsWith('attr_')) params.delete(k);
      });
      // Add new attr_ params
      Object.entries(value as Record<string, string[]>).forEach(([slug, values]) => {
        if (values.length > 0) {
          params.set(`attr_${slug}`, values.join(','));
        }
      });
    } else if (key === 'useCases' || key === 'availableTiers') {
      // Handle array values
      if (Array.isArray(value) && value.length > 0) {
        params.set(key, value.join(','));
      } else {
        params.delete(key);
      }
    } else if (key === 'minPrice' || key === 'maxPrice') {
      if (value === null || value === undefined) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    } else if (key === 'sph' || key === 'cyl') {
      if (value === undefined) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    } else if (key === 'search') {
      if (value) {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    } else if (key === 'sort') {
      if (value === 'newest') {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    }
    
    setSearchParams(params, { replace: true });
  };

  const toggleAttributeValue = (slug: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    const currentParam = params.get(`attr_${slug}`);
    const currentValues = currentParam ? currentParam.split(',').filter(Boolean) : [];
    
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    if (newValues.length === 0) {
      params.delete(`attr_${slug}`);
    } else {
      params.set(`attr_${slug}`, newValues.join(','));
    }
    
    setSearchParams(params, { replace: true });
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  const hasActiveFilters = 
    Object.keys(filters.attributeFilters).length > 0 ||
    filters.minPrice !== null ||
    filters.maxPrice !== null ||
    filters.search !== '' ||
    filters.sph !== undefined ||
    filters.cyl !== undefined ||
    (filters.useCases && filters.useCases.length > 0) ||
    (filters.availableTiers && filters.availableTiers.length > 0);

  return {
    filters,
    updateFilter,
    toggleAttributeValue,
    clearFilters,
    hasActiveFilters,
  };
}
