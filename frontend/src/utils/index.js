export function sanitizeQty(qty) {
    let parsed = parseInt(qty, 10);
    if (isNaN(parsed) || !isFinite(parsed) || parsed < 1) return 1;
    if (parsed > 99) return 99;
    return parsed;
}

export function sanitizeCart(rawCart) {
    if (!Array.isArray(rawCart)) return [];
    return rawCart
        .filter(item => item && typeof item === 'object' && item.id)
        .map(item => ({
            id: String(item.id),
            name: String(item.name || 'Unnamed Item'),
            price: typeof item.price === 'number' && !isNaN(item.price) && isFinite(item.price) ? Math.max(0, item.price) : 0,
            img1: String(item.img1 || ''),
            qty: sanitizeQty(item.qty),
        }));
}

export function discountPercent(product) {
    if (!product || !product.compareAt || product.compareAt <= product.price) return 0;
    return Math.round(((product.compareAt - product.price) / product.compareAt) * 100);
}

export function formatPrice(price) {
    return `Rs ${(price || 0).toLocaleString()}`;
}

export function isValidName(name) {
    return name.trim().length >= 2;
}

export function isValidPhone(phone) {
    if (!phone) return false;
    const clean = phone.replace(/[\s\-\(\)\.\[\]]/g, '');
    return /^(03\d{9}|\+923\d{9}|923\d{9})$/.test(clean);
}

export function isValidAddress(address) {
    return address.trim().length >= 10;
}

export function isValidLuhn(number) {
    const cleanNumber = number.replace(/\D/g, '');
    if (!cleanNumber || cleanNumber.length < 13 || cleanNumber.length > 19) return false;
    let sum = 0;
    let shouldDouble = false;
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cleanNumber.charAt(i), 10);
        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
}

export function isValidExpiry(expiry) {
    const parts = expiry.split('/');
    if (parts.length !== 2) return false;
    const month = parseInt(parts[0].trim(), 10);
    const yearStr = parts[1].trim();
    if (yearStr.length !== 2) return false;
    const year = parseInt('20' + yearStr, 10);
    if (isNaN(month) || isNaN(year) || month < 1 || month > 12) return false;
    const now = new Date();
    const expDate = new Date(year, month, 0, 23, 59, 59);
    return expDate >= now;
}

export function formatCardNumber(value) {
    const digits = value.replace(/\D/g, '');
    let formatted = '';
    for (let i = 0; i < digits.length; i++) {
        if (i > 0 && i % 4 === 0) formatted += ' ';
        formatted += digits[i];
    }
    return formatted;
}

export function formatExpiry(value) {
    const digits = value.replace(/\D/g, '');
    if (digits.length > 2) {
        return digits.substring(0, 2) + ' / ' + digits.substring(2, 4);
    }
    return digits;
}

export function getImageFallback(src) {
    const srcLower = (src || '').toLowerCase();
    const isCube = srcLower.includes('cube') || srcLower.includes('product1') ||
        srcLower.includes('product2') || srcLower.includes('product3') || srcLower.includes('product4');

    if (isCube) {
        return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400' width='100%25' height='100%25' style='background:%23151310'%3E%3Cdefs%3E%3CradialGradient id='glow' cx='50%25' cy='50%25' r='50%25'%3E%3Cstop offset='0%25' stop-color='%23e0a96d' stop-opacity='0.35'/%3E%3Cstop offset='100%25' stop-color='%23151310' stop-opacity='0'/%3E%3C/radialGradient%3E%3ClinearGradient id='glass' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23ffffff' stop-opacity='0.18'/%3E%3Cstop offset='100%25' stop-color='%23ffffff' stop-opacity='0.03'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='200' cy='200' r='180' fill='url(%23glow)'/%3E%3Cpath d='M200 90 L290 140 L290 250 L200 300 L110 250 L110 140 Z' fill='url(%23glass)' stroke='%23c9a96e' stroke-width='1.5' stroke-linejoin='round'/%3E%3Ctext x='200' y='345' font-family='sans-serif' font-weight='500' font-size='11' fill='%23b0a396' text-anchor='middle' letter-spacing='2'%3EINFINITE TULIP CUBE%3C/text%3E%3C/svg%3E";
    }

    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400' width='100%25' height='100%25' style='background:%2313151a'%3E%3Cdefs%3E%3CradialGradient id='cloud-glow' cx='50%25' cy='50%25' r='50%25'%3E%3Cstop offset='0%25' stop-color='%23fbc3bc' stop-opacity='0.35'/%3E%3Cstop offset='100%25' stop-color='%2313151a' stop-opacity='0'/%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle cx='200' cy='200' r='180' fill='url(%23cloud-glow)'/%3E%3Cpath d='M150 240 C120 240 100 215 110 185 C95 165 110 130 135 130 C145 105 180 100 200 115 C220 95 260 105 265 135 C290 135 305 160 295 185 C305 215 285 240 250 240 Z' fill='%231a1f2c' stroke='%23fbc3bc' stroke-width='1.5' stroke-linejoin='round'/%3E%3Ctext x='200' y='345' font-family='sans-serif' font-weight='500' font-size='11' fill='%238e9aaf' text-anchor='middle' letter-spacing='2'%3ETULIP CLOUD MIRROR%3C/text%3E%3C/svg%3E";
}
