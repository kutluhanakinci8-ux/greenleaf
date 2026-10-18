/** destek@ e-posta footer — logo, sosyal, iletişim formu */

function trimUrl(value) {
  const v = String(value ?? '').trim();
  return v || '';
}

export function publicSiteUrl() {
  return (
    process.env.GREENLEAF_PUBLIC_BASE_URL?.trim()
    || process.env.GREENLEAF_PUBLIC_URL?.trim()
    || 'https://127.0.0.1:5190'
  ).replace(/\/$/, '');
}

export function getPlatformSupportMailBrand() {
  const site = publicSiteUrl();
  const logoUrl =
    trimUrl(process.env.GREENLEAF_MAIL_LOGO_URL) || `${site}/brand/greenleaf-email-logo.svg`;
  const contactFormUrl =
    trimUrl(process.env.GREENLEAF_CONTACT_FORM_URL) || `${site}/iletisim`;

  const socialDefs = [
    { key: 'instagram', label: 'Instagram', env: 'GREENLEAF_SOCIAL_INSTAGRAM' },
    { key: 'facebook', label: 'Facebook', env: 'GREENLEAF_SOCIAL_FACEBOOK' },
    { key: 'youtube', label: 'YouTube', env: 'GREENLEAF_SOCIAL_YOUTUBE' },
    { key: 'linkedin', label: 'LinkedIn', env: 'GREENLEAF_SOCIAL_LINKEDIN' },
    { key: 'x', label: 'X', env: 'GREENLEAF_SOCIAL_X' },
  ];

  const social = socialDefs.map(({ key, label, env }) => {
    const url = trimUrl(process.env[env]);
    return { key, label, url: url || null };
  });

  return {
    site,
    siteName: process.env.GREENLEAF_MAIL_BRAND_NAME?.trim() || 'Greenleaf POS',
    logoUrl,
    contactFormUrl,
    social,
  };
}
