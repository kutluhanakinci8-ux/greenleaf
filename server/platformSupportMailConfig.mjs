/** Platform destek — destek@ ayrı posta kutusu (IMAP + giden kimlik) */

import { getImapConfig, isImapConfigured } from './mailConfig.mjs';

const DEFAULT_SUPPORT_ADDRESS = 'destek@example.com';

export function getPlatformSupportMailAddress() {
  return process.env.GREENLEAF_SUPPORT_MAIL_FROM?.trim()
    || process.env.GREENLEAF_SUPPORT_INBOX?.trim()
    || DEFAULT_SUPPORT_ADDRESS;
}

export function getPlatformSupportImapConfig() {
  const fallback = getImapConfig();
  const inbox = process.env.GREENLEAF_SUPPORT_INBOX?.trim() || DEFAULT_SUPPORT_ADDRESS;
  return {
    imapHost: process.env.GREENLEAF_SUPPORT_IMAP_HOST?.trim() || fallback.imapHost,
    imapPort: Number(process.env.GREENLEAF_SUPPORT_IMAP_PORT || fallback.imapPort || 993),
    imapSecure: process.env.GREENLEAF_SUPPORT_IMAP_SECURE !== '0',
    imapUser: process.env.GREENLEAF_SUPPORT_IMAP_USER?.trim() || inbox,
    imapPassword: process.env.GREENLEAF_SUPPORT_IMAP_PASS ?? fallback.imapPassword,
    inboxAddress: inbox,
  };
}

export function isPlatformSupportImapConfigured() {
  const pass = process.env.GREENLEAF_SUPPORT_IMAP_PASS?.trim();
  if (!pass) return false;
  const c = getPlatformSupportImapConfig();
  return Boolean(c.imapHost && c.imapUser && c.imapPassword);
}

export function getPlatformSupportMailPresentation() {
  const from = getPlatformSupportMailAddress();
  return {
    from,
    fromName: process.env.GREENLEAF_SUPPORT_MAIL_FROM_NAME?.trim() || 'Greenleaf Destek',
    replyTo: from,
  };
}

export function supportInboxStatus() {
  const imapConfigured = isPlatformSupportImapConfigured();
  return {
    configured: imapConfigured,
    address: getPlatformSupportMailAddress(),
    imapUser: getPlatformSupportImapConfig().imapUser,
    separateMailbox: true,
    autoreplyFrom: getPlatformSupportMailAddress(),
    fallbackToPlatformImap: !process.env.GREENLEAF_SUPPORT_IMAP_USER?.trim() && isImapConfigured(),
    /** Mağaza outbox → destek@ gelen kutusu (IMAP olmadan da çalışır) */
    outboxBridge: true,
    bridgePrimary: !imapConfigured,
  };
}
