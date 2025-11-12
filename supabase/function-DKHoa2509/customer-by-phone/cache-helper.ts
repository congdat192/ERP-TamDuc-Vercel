/**
 * Cache Helper
 * Memory cache utilities for Edge Function
 */ const cache = new Map();
const CACHE_TTL = 60000; // 60 seconds
export function getCached(key) {
  const item = cache.get(key);
  if (!item || Date.now() > item.expires) {
    cache.delete(key);
    return null;
  }
  return item.value;
}
export function setCache(key, value, ttl = CACHE_TTL) {
  cache.set(key, {
    value,
    expires: Date.now() + ttl
  });
}
