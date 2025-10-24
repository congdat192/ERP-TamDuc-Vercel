import { LensFilters } from '../types/lens';

export function getAdvancedFilterCount(filters: LensFilters): number {
  return Object.keys(filters.attributeFilters).filter(
    slug => filters.attributeFilters[slug]?.length > 0
  ).length;
}

export function getSupplyUseCaseFilterCount(filters: LensFilters): number {
  return (
    (filters.sph !== undefined && filters.sph !== 0 ? 1 : 0) + 
    (filters.cyl !== undefined && filters.cyl !== 0 ? 1 : 0) + 
    (filters.useCases?.length || 0) + 
    (filters.availableTiers?.length || 0)
  );
}
