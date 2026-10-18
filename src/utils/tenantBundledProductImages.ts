import type { Product } from '../types/product';

/** Demo ürün görselleri — sunucudaki demo-*.svg veya data: URL */
export function resolveBundledProductImagePath(
  product: Pick<Product, 'id' | 'productCode'>,
): string | undefined {
  if (product.productCode?.startsWith('DEMO-') || (product.id >= 1001 && product.id < 2000)) {
    return `/product-images/demo-${product.id}.svg`;
  }
  return undefined;
}

export function isBundledProductImageUrl(url?: string | null): boolean {
  if (!url?.trim()) return false;
  if (url.startsWith('data:image/')) return true;
  if (url.includes('/product-images/demo-')) return true;
  return false;
}

/** Greenleaf katalog görseli — tenant snapshot’a yazılmaz */
export function isGreenleafCatalogImageUrl(url?: string | null): boolean {
  if (!url?.trim()) return false;
  if (url.includes('greenleaf')) return true;
  return /\/product-images\/p-\d+/i.test(url);
}
