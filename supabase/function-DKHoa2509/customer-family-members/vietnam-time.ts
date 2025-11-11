// ================================================================
// VIETNAM TIMEZONE HELPERS
// ================================================================
export function getVietnamTime() {
  const now = new Date();
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utcTime + 7 * 3600000);
}
export function getVietnamISOString() {
  const vnTime = getVietnamTime();
  // Format: 2025-11-06T23:01:57.494+07:00
  const year = vnTime.getUTCFullYear();
  const month = String(vnTime.getUTCMonth() + 1).padStart(2, '0');
  const day = String(vnTime.getUTCDate()).padStart(2, '0');
  const hours = String(vnTime.getUTCHours()).padStart(2, '0');
  const minutes = String(vnTime.getUTCMinutes()).padStart(2, '0');
  const seconds = String(vnTime.getUTCSeconds()).padStart(2, '0');
  const ms = String(vnTime.getUTCMilliseconds()).padStart(3, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${ms}+07:00`;
}
export function formatVietnamDate(date) {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}
