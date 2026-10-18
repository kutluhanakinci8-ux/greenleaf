/** Platform operatör hesapları (mağaza store.json içinde değil) */
export const PLATFORM_TENANT_ID = '__platform__';

const PLATFORM_OPERATOR_USERNAMES = new Set([
  'sysop',
  'platform',
]);

const PLATFORM_OPERATOR_ALIASES = new Map([
  ['platform-admin', 'sysop'],
  ['admin', 'sysop'],
]);

export function normalizePlatformOperatorUsername(username) {
  const raw = String(username ?? '').trim().toLowerCase();
  return PLATFORM_OPERATOR_ALIASES.get(raw) ?? raw;
}

export function isPlatformOperatorUsername(username) {
  return PLATFORM_OPERATOR_USERNAMES.has(normalizePlatformOperatorUsername(username));
}

export function isPlatformApiRole(role) {
  return role === 'platform';
}

const DEDICATED_PLATFORM_ONLY = new Set(['sysop']);

export function isDedicatedPlatformOnlyUsername(username) {
  return DEDICATED_PLATFORM_ONLY.has(normalizePlatformOperatorUsername(username));
}
