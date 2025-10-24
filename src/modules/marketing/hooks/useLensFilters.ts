import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LensFilters } from '../types/lens';

export function useLensFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filters from URL params
  const [filters, setFilters] = useState<LensFilters>(() => {
    // Parse attribute filters from URL (format: attr_slug=value1,value2)
    const attributeFilters: Record<string, string[]> = {};
    searchParams.forEach((value, key) => {
      if (key.startsWith('attr_')) {
        const slug = key.replace('attr_', '');
        attributeFilters[slug] = value.split(',').filter(Boolean);
      }
    });
    
    return {
      attributeFilters,
      material: searchParams.get('material'),
      refractiveIndex: searchParams.get('refractive'),
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : null,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : null,
      origin: searchParams.get('origin'),
      hasWarranty: searchParams.get('warranty') === 'true',
      search: searchParams.get('q') || '',
      sort: (searchParams.get('sort') as LensFilters['sort']) || 'newest',
    };
  });

  // Sync filters to URL
  useEffect(() => {
    const params = new URLSearchParams();

    // Add attribute filters
    Object.entries(filters.attributeFilters).forEach(([slug, values]) => {
      if (values.length > 0) {
        params.set(`attr_${slug}`, values.join(','));
      }
    });

    if (filters.material) {
      params.set('material', filters.material);
    }
    if (filters.refractiveIndex) {
      params.set('refractive', filters.refractiveIndex);
    }
    if (filters.minPrice !== null) {
      params.set('minPrice', filters.minPrice.toString());
    }
    if (filters.maxPrice !== null) {
      params.set('maxPrice', filters.maxPrice.toString());
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

  const updateFilter = <K extends keyof LensFilters>(
    key: K,
    value: LensFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleAttributeOption = (attributeSlug: string, optionValue: string) => {
    setFilters(prev => {
      const currentValues = prev.attributeFilters[attributeSlug] || [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter(v => v !== optionValue)
        : [...currentValues, optionValue];
      
      return {
        ...prev,
        attributeFilters: {
          ...prev.attributeFilters,
          [attributeSlug]: newValues,
        },
      };
    });
  };

  const clearFilters = () => {
    setFilters({
      attributeFilters: {},
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
    Object.values(filters.attributeFilters).some(values => values.length > 0) ||
    filters.material !== null ||
    filters.refractiveIndex !== null ||
    filters.minPrice !== null ||
    filters.maxPrice !== null ||
    filters.origin !== null ||
    filters.hasWarranty;

  return {
    filters,
    updateFilter,
    toggleAttributeOption,
    clearFilters,
    hasActiveFilters,
  };
}
