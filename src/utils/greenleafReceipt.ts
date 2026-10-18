import type { AppSettings } from '../types/business';
import {
  normalizeReceiptPrinterSettings,
  type ReceiptPrinterSettings,
} from '../types/receiptPrinter';
import { loadTenantId } from '../storage/tenantSession';
import { isPosLiteProfile } from './tenantProductProfile';

export const LEGACY_STORE_TENANT_ID = 'main';

export function isLegacyStoreTenant(tenantId = loadTenantId()): boolean {
  return tenantId === LEGACY_STORE_TENANT_ID;
}

/** POS Lite — tarayıcıdaki eski «gelişmiş yazıcı» ayarını sıfırla */
export function sanitizeReceiptPrinterSettings(
  settings: AppSettings,
  tenantId = loadTenantId(),
): ReceiptPrinterSettings {
  if (isLegacyStoreTenant(tenantId) || isPosLiteProfile(settings)) {
    return normalizeReceiptPrinterSettings(settings.receiptPrinter);
  }
  return normalizeReceiptPrinterSettings(settings.receiptPrinter);
}

/** Yönetici / Greenleaf kasa: sunucu profili kapalı veya POS Lite tenant */
export function shouldUseGreenleafReceiptPath(settings: AppSettings): boolean {
  if (isLegacyStoreTenant() || isPosLiteProfile(settings)) return true;
  const raw = settings.receiptPrinter;
  if (raw == null) return true;
  return !normalizeReceiptPrinterSettings(raw).enabled;
}
