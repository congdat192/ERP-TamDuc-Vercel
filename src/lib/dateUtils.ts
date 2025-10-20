import { formatInTimeZone } from 'date-fns-tz';

/**
 * Vietnam timezone constant
 */
const VIETNAM_TIMEZONE = 'Asia/Ho_Chi_Minh';

/**
 * Convert UTC date to Vietnam time (GMT+7) and format it
 * 
 * @param utcDate - UTC date string or Date object from External API
 * @param formatStr - Format string (default: 'dd/MM/yyyy HH:mm:ss')
 * @returns Formatted date string in Vietnam timezone
 * 
 * @example
 * // API returns: "2025-09-24T09:26:59.431727+00:00" (UTC)
 * formatToVietnamTime("2025-09-24T09:26:59.431727+00:00") 
 * // Returns: "24/09/2025 16:26:59" (GMT+7)
 * 
 * @example
 * // Custom format
 * formatToVietnamTime("2025-09-24T09:26:59.431727+00:00", "HH:mm dd/MM/yyyy")
 * // Returns: "16:26 24/09/2025"
 */
export function formatToVietnamTime(
  utcDate: string | Date, 
  formatStr: string = 'dd/MM/yyyy HH:mm:ss'
): string {
  try {
    return formatInTimeZone(utcDate, VIETNAM_TIMEZONE, formatStr);
  } catch (error) {
    console.error('[dateUtils] Error formatting date to Vietnam time:', error);
    return 'Invalid date';
  }
}

/**
 * Format date for display (short format)
 * @example "24/09/2025 16:26"
 */
export function formatToVietnamDateTime(utcDate: string | Date): string {
  return formatToVietnamTime(utcDate, 'dd/MM/yyyy HH:mm');
}

/**
 * Format date only (no time)
 * @example "24/09/2025"
 */
export function formatToVietnamDate(utcDate: string | Date): string {
  return formatToVietnamTime(utcDate, 'dd/MM/yyyy');
}

/**
 * Format time only (no date)
 * @example "16:26:59"
 */
export function formatToVietnamTimeOnly(utcDate: string | Date): string {
  return formatToVietnamTime(utcDate, 'HH:mm:ss');
}
