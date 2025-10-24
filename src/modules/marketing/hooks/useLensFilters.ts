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

  const toggleBrand = (brandId: string) => {
    setFilters(prev => ({
      ...prev,
      brandIds: prev.brandIds.includes(brandId)
        ? prev.brandIds.filter(id => id !== brandId)
        : [...prev.brandIds, brandId]
    }));
  };

  const toggleFeature = (featureId: string) => {
    setFilters(prev => ({
      ...prev,
      featureIds: prev.featureIds.includes(featureId)
        ? prev.featureIds.filter(id => id !== featureId)
        : [...prev.featureIds, featureId]
    }));
  };

  const clearFilters = () => {
    setFilters({
      brandIds: [],
      featureIds: [],
      material: null,
      refractiveIndex: null,
      minPrice: null,
      maxPrice: null,
      origin: null,
      hasWarranty: false,
      search: '',
      sort: 'newest',
    });
  };

  const hasActiveFilters = 
    filters.brandIds.length > 0 ||
    filters.featureIds.length > 0 ||
    filters.material !== null ||
    filters.refractiveIndex !== null ||
    filters.minPrice !== null ||
    filters.maxPrice !== null ||
    filters.origin !== null ||
    filters.hasWarranty ||
    filters.search !== '';

  return {
    filters,
    updateFilter,
    toggleBrand,
    toggleFeature,
    clearFilters,
    hasActiveFilters,
  };
}
