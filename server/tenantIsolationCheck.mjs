import { isLertaPlatformConfigured } from './lertaPlatformBridge.mjs';
import { isSmtpConfigured, getOpsEmail, getSmtpHostHint, isImapConfigured } from './mailConfig.mjs';
import { getOutboxCounts } from './emailOutbox.mjs';

/** Kiracı posta / fatura IMAP ayrımı — salt okunur özet */
export async function getTenantIsolationReport(dataDir) {
  const lertaBridge = isLertaPlatformConfigured();
  const counts = await getOutboxCounts(dataDir);

  const checks = [
    {
      id: 'lerta_bridge_off',
      label: 'NB köprüsü kapalı (üretim hedefi)',
      ok: !lertaBridge,
      detail: lertaBridge
        ? 'LERTA_PLATFORM_BRIDGE veya API anahtarı aktif — tenant-only için kapatın'
        : 'LERTA_PLATFORM_BRIDGE=0 veya API yok',
    },
    {
      id: 'greenleaf_smtp',
      label: 'Giden posta (SMTP env)',
      ok: isSmtpConfigured(),
      detail: isSmtpConfigured() ? 'GREENLEAF_SMTP_* yapılandırıldı' : 'GREENLEAF_SMTP_HOST + GREENLEAF_MAIL_FROM',
    },
    {
      id: 'ops_email',
      label: 'Operasyon / iletişim bildirimi',
      ok: Boolean(getOpsEmail()?.includes('@')),
      detail: getOpsEmail() || 'GREENLEAF_OPS_EMAIL',
    },
    {
      id: 'greenleaf_imap',
      label: 'Posta Gelen IMAP (Faz 7)',
      ok: isImapConfigured(),
      detail: isImapConfigured() ? 'GREENLEAF_IMAP_* yapılandırıldı' : 'Hub Gelen sync için IMAP gerekli',
    },
    {
      id: 'smtp_host_sane',
      label: 'SMTP host (Faz 6)',
      ok: !getSmtpHostHint()?.includes('VPS IP'),
      detail: getSmtpHostHint() || 'mail.example.com veya relay',
    },
    {
      id: 'nb_inbound_mx',
      label: 'NB inbound MX kullanılmıyor',
      ok: true,
      detail: 'Fatura IMAP yalnızca billEmailClient modülü',
    },
    {
      id: 'outbox_failed',
      label: 'Outbox hatalı kuyruk',
      ok: (counts.failed ?? 0) === 0,
      detail: `pending=${counts.pending} sent=${counts.sent} failed=${counts.failed}`,
    },
  ];

  return {
    ok: checks.every((c) => c.ok || c.id === 'greenleaf_smtp' || c.id === 'greenleaf_imap'),
    checks,
    dataPaths: [
      'data/email-outbox/',
      'data/messaging/',
      'data/bill-email-inbox/',
      'data/messaging-attachments/',
      'data/contact-messages.json',
      'data/posta-mail-settings.json',
      'data/posta-inbox/',
    ],
    envHints: [
      'GREENLEAF_* — giden posta, ops, IMAP',
      'LERTA_PLATFORM_* — yalnızca bilinçli test; üretimde kapalı',
      'MAIL_PLATFORM_* — Nakliye Borsası; VPS ile karıştırmayın',
    ],
  };
}
