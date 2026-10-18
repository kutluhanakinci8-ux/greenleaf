/** Hazır e-posta şablonları (Posta hub — Faz 8) */

const TEMPLATES = [
  {
    id: 'tesekkur',
    label: 'Teşekkür',
    subject: 'Greenleaf POS — teşekkürler',
    body: 'Merhaba,\n\nBizimle iletişime geçtiğiniz için teşekkür ederiz.\n\nSaygılarımızla,\nGreenleaf POS',
  },
  {
    id: 'siparis-alindi',
    label: 'Sipariş alındı',
    subject: 'Siparişiniz alındı',
    body: 'Merhaba,\n\nSiparişiniz kayda alınmıştır. Hazırlık sürecinde sizi bilgilendireceğiz.\n\nGreenleaf POS',
  },
  {
    id: 'stok-bilgi',
    label: 'Stok bilgisi',
    subject: 'Stok / ürün bilgisi',
    body: 'Merhaba,\n\nTalep ettiğiniz ürün hakkında güncel stok bilgisini paylaşmak isteriz:\n\n—\n\nGreenleaf POS',
  },
  {
    id: 'kvkk',
    label: 'KVKK yanıt',
    subject: 'KVKK başvurunuz',
    body: 'Sayın ilgili,\n\nKişisel verilerin korunması kapsamındaki talebiniz tarafımıza ulaşmıştır. Yasal süre içinde dönüş yapılacaktır.\n\nGreenleaf POS',
  },
  {
    id: 'iade',
    label: 'İade / değişim',
    subject: 'İade veya değişim talebiniz',
    body: 'Merhaba,\n\nİade/değişim talebiniz incelenmektedir. Kısa süre içinde dönüş yapacağız.\n\nGreenleaf POS',
  },
  {
    id: 'gecikme',
    label: 'Gecikme özür',
    subject: 'Gecikme hakkında',
    body: 'Merhaba,\n\nYaşanan gecikme için özür dileriz. Siparişinizin durumu hakkında sizi bilgilendirmeye devam edeceğiz.\n\nGreenleaf POS',
  },
  {
    id: 'genel-yanit',
    label: 'Genel yanıt',
    subject: 'Greenleaf POS — mesajınız',
    body: 'Merhaba,\n\nMesajınız için teşekkürler. Talebinizle ilgileniyoruz.\n\nSaygılarımızla,\nGreenleaf POS',
  },
];

export function listMailTemplates() {
  return TEMPLATES.map(({ id, label, subject, body }) => ({ id, label, subject, body }));
}

export function getMailTemplate(id) {
  return TEMPLATES.find((t) => t.id === id) ?? null;
}

/** Müşteriye “yazışmanız var” özet e-postası (Faz 18) */
export function buildMessagingCustomerSummaryEmail({ customerName, subject, bodyText, threadId }) {
  const name = String(customerName ?? 'Müşterimiz').trim();
  const subj = String(subject ?? 'Yazışma').trim();
  const preview = String(bodyText ?? '').trim().slice(0, 500);
  const text = [
    `Sayın ${name},`,
    '',
    'Greenleaf POS ile olan yazışmanızda yeni bir mesaj var.',
    '',
    `Konu: ${subj}`,
    '',
    preview,
    '',
    'Detay için mağazamızla iletişime geçebilir veya size gönderilen kanaldan yanıtlayabilirsiniz.',
    '',
    `Referans: ${threadId ?? '—'}`,
    '',
    '— Greenleaf POS',
  ].join('\n');
  const html = `<div style="font-family:sans-serif;font-size:14px;line-height:1.5">
<p>Sayın ${name},</p>
<p><strong>Yazışmanızda yeni mesaj var.</strong></p>
<p>Konu: ${subj}</p>
<blockquote style="border-left:3px solid #2d6a4f;padding-left:12px;color:#333">${preview.replace(/\n/g, '<br/>')}</blockquote>
<p style="color:#666;font-size:12px">Referans: ${threadId ?? '—'}</p>
</div>`;
  return {
    subject: `Greenleaf POS — yazışmanız var: ${subj}`,
    text,
    html,
  };
}
