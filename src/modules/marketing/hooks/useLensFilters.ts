import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LensFilters } from '../types/lens';

export function useLensFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<LensFilters>({
    brandIds: searchParams.get('brands')?.split(',').filter(Boolean) || [],
    featureIds: searchParams.get('features')?.split(',').filter(Boolean) || [],
    material: searchParams.get('material') || null,
    refractiveIndex: searchParams.get('ri') || null,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : null,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : null,
    origin: searchParams.get('origin') || null,
    hasWarranty: searchParams.get('warranty') === 'true',
    search: searchParams.get('q') || '',
    sort: (searchParams.get('sort') as any) || 'newest',
  });

  // Sync filters to URL
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.brandIds.length > 0) {
      params.set('brands', filters.brandIds.join(','));
    }
    if (filters.featureIds.length > 0) {
      params.set('features', filters.featureIds.join(','));
    }
    if (filters.material) {
      params.set('material', filters.material);
    }
    if (filters.refractiveIndex) {
      params.set('ri', filters.refractiveIndex);
    }
    if (filters.minPrice !== null) {
      params.set('minPrice', String(filters.minPrice));
    }
    if (filters.maxPrice !== null) {
      params.set('maxPrice', String(filters.maxPrice));
    }
    if (filters.origin) {
      params.set('origin', filters.origin);
    }
    if (filters.hasWarranty) {
      params.set('warranty', 'true');
    }
    if (filters.search) {
      params.set('q', filters.search);
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
