import { isGreenleafCatalogImageUrl } from './tenantBundledProductImages';

/** Greenleaf (main): kullanıcının yüklediği veya özelleştirdiği görsel — sunucuya yazılır */
export function isGreenleafPersistedImageUrl(url?: string | null): boolean {
  if (!url?.trim()) return false;
  if (url.startsWith('data:image/')) return true;
  if (isGreenleafCatalogImageUrl(url)) return false;
  if (/^\/product-images\/p-\d+/i.test(url.trim())) return false;
  if (/\/product-images\/demo-/i.test(url)) return false;
  return true;
}
