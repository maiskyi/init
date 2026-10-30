import { type PaymentMethodIconName } from '@rockethash/uikit';

// Payment methods arrive from the cashier API as slugs (`gift-cards-g2a`),
// carrying neither an icon nor a title, so both are resolved here.
//
// The two records are kept separate because their coverage differs: every slug
// has a label, but only those with a confident icon match appear below. A slug
// is deliberately left out rather than pointed at a similarly-named asset --
// `vietcombank` is not Viet A Bank (`VIETA_BANK`) and `o_pay` is not PayOp
// (`PAY_OP`). Values are not type-checked against the icon set: uikit types
// `PAYMENT_METHOD_ICONS` as `Record<string, ...>` and exports it from no barrel,
// so a membership type would mean copying its 53 names into the wallet, where
// they would drift. An unmatched name renders the blank icon slot.
export const PAYMENT_METHOD_ICONS_BY_NAME: Record<
  string,
  PaymentMethodIconName
> = {
  agribank: 'AGRIBANK',
  asia_commercial_bank_qr: 'QR',
  'astro-pay': 'ASTRO_PAY',
  bidv_bank: 'BIDV',
  bidv_bank_qr: 'QR',
  coins: 'QR',
  eximbank: 'EXIMBANK',
  'gift-cards-g2a': 'G2A',
  'gift-cards-kinguin': 'KINGUIN',
  metamask: 'METAMASK',
  ob_card: 'CREDIT_CARDS',
  'payment-card-ru': 'CREDIT_CARDS',
  'payment-card-ua': 'UKR_CARD',
  'payment-card-world-wide': 'WORLWIDE',
  'phone-beeline-ru': 'TELEPHONE',
  'phone-megafon': 'TELEPHONE',
  'phone-mts-ru': 'MTS',
  'phone-tele2': 'TELE2',
  qiwi: 'QIWI',
  sacombank: 'SACOMBANK',
  skinsback: 'SKINS',
  techcombank: 'TECHCOMBANK',
  tronlink: 'TRON_LINK',
  vietcombank_qr: 'QR',
  vietinbank: 'VIETIN_BANK',
  'vietnam_prosperity_joint-stock_commercial_bank': 'VP_BANK',
  voucher: 'VOUCHER_1',
  'wallet-connect': 'WALLET_CONNECT',
  webmoney: 'WEBMONEY',
  'yandex-money': 'YANDEX',
};

// Only `coins`, `skinsback` and `voucher` are confirmed by the Figma frame; the
// rest are brand spellings pending product-copy review. A slug missing from this
// record falls back to the slug itself, so an unknown method stays identifiable.
export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  agribank: 'Agribank',
  asia_commercial_bank: 'Asia Commercial Bank',
  asia_commercial_bank_qr: 'Asia Commercial Bank QR',
  'astro-pay': 'AstroPay',
  bank: 'Bank Transfer',
  bidv_bank: 'BIDV',
  bidv_bank_qr: 'BIDV QR',
  bkash: 'bKash',
  coins: 'Wallet Address',
  donga_bank: 'DongA Bank',
  easypaisa: 'Easypaisa',
  eximbank: 'Eximbank',
  'gift-cards-g2a': 'G2A Gift Card',
  'gift-cards-kinguin': 'Kinguin Gift Card',
  imps: 'IMPS',
  jazzcash: 'JazzCash',
  metamask: 'MetaMask',
  'moon-pay': 'MoonPay',
  nagad: 'Nagad',
  o_pay: 'OPay',
  ob_card: 'OB Card',
  open_finance: 'Open Finance',
  'payment-card-ru': 'Bank Card (RU)',
  'payment-card-ua': 'Bank Card (UA)',
  'payment-card-world-wide': 'Bank Card (Worldwide)',
  'phone-beeline-ru': 'Beeline',
  'phone-megafon': 'MegaFon',
  'phone-mts-ru': 'MTS',
  'phone-tele2': 'Tele2',
  pix: 'Pix',
  qiwi: 'QIWI',
  rocket: 'Rocket',
  sacombank: 'Sacombank',
  skinsback: 'Skins',
  techcombank: 'Techcombank',
  tronlink: 'TronLink',
  upay: 'Upay',
  vietcombank: 'Vietcombank',
  vietcombank_qr: 'Vietcombank QR',
  vietinbank: 'VietinBank',
  'vietnam_prosperity_joint-stock_commercial_bank': 'VPBank',
  voucher: 'Voucher',
  'wallet-connect': 'WalletConnect',
  webmoney: 'WebMoney',
  'yandex-money': 'Yandex Money',
};
