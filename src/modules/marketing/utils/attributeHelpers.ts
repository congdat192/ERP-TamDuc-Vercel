import { AttributeOption, LensProductAttribute } from '../types/lens';

/**
 * Normalize options from old format (string[]) or new format (AttributeOption[])
 * Provides backwards compatibility
 */
export function normalizeAttributeOptions(
  options: string[] | AttributeOption[] | any
): AttributeOption[] {
  if (!options || !Array.isArray(options) || options.length === 0) return [];
  
  // Check if already new format
  if (typeof options[0] === 'object' && 'value' in options[0]) {
    return options as AttributeOption[];
  }
  
  // Convert old format (string[]) to new format
  return (options as string[]).map(opt => ({
    value: opt,
    label: opt,
    image_url: null,
    short_description: null,
    content: null,
  }));
}

/**
 * Get option display data by value
 */
export function getAttributeOption(
  attribute: LensProductAttribute,
  value: string
): AttributeOption | null {
  const normalized = normalizeAttributeOptions(attribute.options);
  return normalized.find(opt => opt.value === value) || null;
}

/**
 * Get option label by value
 */
export function getAttributeLabel(
  attribute: LensProductAttribute,
  value: string
): string {
  const option = getAttributeOption(attribute, value);
  return option?.label || value;
}
