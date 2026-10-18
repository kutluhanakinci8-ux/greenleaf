/** Greenleaf POS — bağımsız giden posta (tenant verisi izole) */

export function getMailConfig() {
  const from = process.env.GREENLEAF_MAIL_FROM?.trim() || process.env.CRM_EMAIL_FROM?.trim() || '';
  return {
    smtpHost: process.env.GREENLEAF_SMTP_HOST?.trim() || '',
    smtpPort: Number(process.env.GREENLEAF_SMTP_PORT || 587),
    smtpSecure: process.env.GREENLEAF_SMTP_SECURE === '1' || process.env.GREENLEAF_SMTP_PORT === '465',
    smtpUser: process.env.GREENLEAF_SMTP_USER?.trim() || '',
    smtpPass: process.env.GREENLEAF_SMTP_PASS ?? '',
    from,
    fromName: process.env.GREENLEAF_MAIL_FROM_NAME?.trim() || 'Greenleaf POS',
    replyTo: process.env.GREENLEAF_MAIL_REPLY_TO?.trim() || from,
  };
}

export function isSmtpConfigured() {
  const c = getMailConfig();
  return Boolean(c.smtpHost && c.from && c.from.includes('@'));
}

export function getImapConfig() {
  return {
    imapHost: process.env.GREENLEAF_IMAP_HOST?.trim() || '',
    imapPort: Number(process.env.GREENLEAF_IMAP_PORT || 993),
    imapSecure: process.env.GREENLEAF_IMAP_SECURE !== '0',
    imapUser: process.env.GREENLEAF_IMAP_USER?.trim() || process.env.GREENLEAF_IMAP_INBOX?.trim() || '',
    imapPassword: process.env.GREENLEAF_IMAP_PASS ?? '',
    inboxAddress: process.env.GREENLEAF_IMAP_INBOX?.trim() || '',
  };
}

export function isImapConfigured() {
  const c = getImapConfig();
  return Boolean(c.imapHost && c.imapUser && c.imapPassword);
}

/** VPS IP ile SMTP denemesi — Postfix yoksa ECONNREFUSED */
export function getSmtpHostHint() {
  const host = process.env.GREENLEAF_SMTP_HOST?.trim() || '';
  if (!host) return 'GREENLEAF_SMTP_HOST tanımlayın (ör. mail.example.com)';
  if (host === 'localhost' || host === '127.0.0.1') {
    return null;
  }
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
    return 'SMTP host olarak VPS IP kullanılıyor — genelde mail.example.com veya 127.0.0.1:25 relay';
  }
  return null;
}

/** Operasyon / iletişim formu bildirimleri (Faz 2) */
export function getOpsEmail() {
  const explicit = process.env.GREENLEAF_OPS_EMAIL?.trim();
  if (explicit?.includes('@')) return explicit;
  const c = getMailConfig();
  if (c.replyTo?.includes('@')) return c.replyTo;
  return c.from?.includes('@') ? c.from : '';
}

export function buildFromHeader(fromName, fromEmail) {
  if (fromName && fromEmail) {
    return `"${fromName.replace(/"/g, '\\"')}" <${fromEmail}>`;
  }
  return fromEmail;
}
