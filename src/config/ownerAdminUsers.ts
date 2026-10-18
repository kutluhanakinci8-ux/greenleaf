/** @deprecated Eski mağaza sahibi listesi — platform operatörleri platformOperators.ts üzerinden tanımlanır */
export const OWNER_ADMIN_USERNAMES = new Set<string>();

export function isOwnerAdminUsername(_username: string): boolean {
  return false;
}
