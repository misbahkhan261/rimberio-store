// - Website ka main brand name
export const BRAND_NAME = 'RIMBERIO';

// - Top announcement bar (ticker) mein chalne walay messages
export const TICKER_ITEMS = [
    'FREE SHIPPING OVER RS 5,000',
    'CASH ON DELIVERY NATIONWIDE',
    'CURATED DESIGN PHILOSOPHY',
    'HANDPICKED LUXURY DÉCOR',
    'EASY 7-DAY RETURNS',
];

// - Header/Navbar ke navigation links
export const NAV_LINKS = [
    { href: '#catalog', label: 'Collection' },
    { href: '#faqs', label: 'Shipping' },
    { href: '#support', label: 'Support' },
];

// - Questions aur answers ki list jo FAQ section mein accordion banati hai
export const FAQS = [
    {
        question: 'How long does delivery take?',
        answer: 'All orders are verified and dispatched within 24 hours. Nationwide delivery completes within 7 to 10 working days. Express options are available at checkout for select zones.',
    },
    {
        question: 'Is Cash on Delivery available?',
        answer: 'Yes — Cash on Delivery is available nationwide. A flat shipping fee of Rs 399 applies to all orders, calculated automatically at checkout.',
    },
    {
        question: 'What is your return policy?',
        answer: 'We accept returns within 7 days of delivery for items in original, unused condition. Contact our support team to initiate a return.',
    },
    {
        question: 'How is my payment secured?',
        answer: 'Card payments are processed over an encrypted connection. We never store your card data. COD requires no upfront payment.',
    },
];

// - Editorial strip (middle marquee) mein repeat hone walay highlights
export const EDITORIAL_HIGHLIGHTS = [
    'Free shipping over Rs 5,000',
    'Handpicked quality pieces',
    'Cash on delivery available',
    '7–10 day nationwide delivery',
];

// - Customer support ke contact options (WhatsApp aur Email)
export const SUPPORT_CHANNELS = [
    {
        type: 'whatsapp',
        label: 'WhatsApp',
        value: '+92 300 000 0000',
        href: 'https://wa.me/92300000000',
        external: true,
        variant: 'dark',
    },
    {
        type: 'email',
        label: 'Email',
        value: 'remberiostore80@gmail.com',
        href: 'mailto:remberiostore80@gmail.com',
        external: false,
        variant: 'accent',
    },
];

// - Cart aur checkout ki calculation ke liye rules
export const FREE_SHIPPING_THRESHOLD = 5000; // Rs 5000 se upar free shipping
export const FLAT_SHIPPING_FEE = 399; // Standard delivery charges
export const MAX_QTY = 99; // Ek item ki maximum quantity

// - Browser ki memory (Local Storage) mein cart data save rakhne ke liye key
export const CART_STORAGE_KEY = 'rimberio_cart';

// - Agar real product images load na hon (API down ho ya internet masla ho), toh yeh default (SVG) images nazar aayengi
export const CUBE_FALLBACK_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400' width='100%25' height='100%25' style='background:%23151310'%3E%3Cdefs%3E%3CradialGradient id='glow' cx='50%25' cy='50%25' r='50%25'%3E%3Cstop offset='0%25' stop-color='%23e0a96d' stop-opacity='0.35'/%3E%3Cstop offset='100%25' stop-color='%23151310' stop-opacity='0'/%3E%3C/radialGradient%3E%3ClinearGradient id='glass' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23ffffff' stop-opacity='0.18'/%3E%3Cstop offset='100%25' stop-color='%23ffffff' stop-opacity='0.03'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='200' cy='200' r='180' fill='url(%23glow)'/%3E%3Cpath d='M200 90 L290 140 L290 250 L200 300 L110 250 L110 140 Z' fill='url(%23glass)' stroke='%23c9a96e' stroke-width='1.5' stroke-linejoin='round'/%3E%3Cpath d='M200 90 L200 300' stroke='%23c9a96e' stroke-width='0.5' stroke-dasharray='2,2'/%3E%3Cpath d='M110 140 L200 190 L290 140' stroke='%23c9a96e' stroke-width='0.5' stroke-dasharray='2,2'/%3E%3Cpath d='M200 240 Q195 210 200 180' fill='none' stroke='%2384a98c' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M190 180 C185 155 200 150 200 150 C200 150 215 155 210 180 Z' fill='%23f0a6ca' opacity='0.85'/%3E%3Cpath d='M200 180 C195 160 200 155 200 155 C200 155 205 160 200 180 Z' fill='%23f7cad0'/%3E%3Cpath d='M250 120 L252 125 L257 127 L252 129 L250 134 L248 129 L243 127 L248 125 Z' fill='%23c9a96e'/%3E%3Ctext x='200' y='345' font-family='sans-serif' font-weight='500' font-size='11' fill='%23b0a396' text-anchor='middle' letter-spacing='2'%3EINFINITE TULIP CUBE%3C/text%3E%3C/svg%3E";

export const CLOUD_FALLBACK_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400' width='100%25' height='100%25' style='background:%2313151a'%3E%3Cdefs%3E%3CradialGradient id='cloud-glow' cx='50%25' cy='50%25' r='50%25'%3E%3Cstop offset='0%25' stop-color='%23fbc3bc' stop-opacity='0.35'/%3E%3Cstop offset='100%25' stop-color='%2313151a' stop-opacity='0'/%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle cx='200' cy='200' r='180' fill='url(%23cloud-glow)'/%3E%3Cpath d='M150 240 C120 240 100 215 110 185 C95 165 110 130 135 130 C145 105 180 100 200 115 C220 95 260 105 265 135 C290 135 305 160 295 185 C305 215 285 240 250 240 Z' fill='%231a1f2c' stroke='%23fbc3bc' stroke-width='1.5' stroke-linejoin='round'/%3E%3Cpath d='M170 240 Q165 220 170 205' fill='none' stroke='%2384a98c' stroke-width='2'/%3E%3Cpath d='M165 205 C162 190 170 185 170 185 C170 185 178 190 175 205 Z' fill='%23ffb5a7'/%3E%3Cpath d='M200 240 Q200 215 205 195' fill='none' stroke='%2384a98c' stroke-width='2'/%3E%3Cpath d='M200 195 C197 180 205 175 205 175 C205 175 213 180 210 195 Z' fill='%23fcd5ce'/%3E%3Cpath d='M230 240 Q235 225 230 210' fill='none' stroke='%2384a98c' stroke-width='2'/%3E%3Cpath d='M225 210 C222 195 230 190 230 190 C230 190 238 190 235 210 Z' fill='%23fbc4b6'/%3E%3Cpath d='M140 160 L141 163 L144 164 L141 165 L140 168 L139 165 L136 164 L139 163 Z' fill='%23fbc3bc'/%3E%3Ctext x='200' y='345' font-family='sans-serif' font-weight='500' font-size='11' fill='%238e9aaf' text-anchor='middle' letter-spacing='2'%3ETULIP CLOUD MIRROR%3C/text%3E%3C/svg%3E";