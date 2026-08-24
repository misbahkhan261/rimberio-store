import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { CART_STORAGE_KEY, FREE_SHIPPING_THRESHOLD, FLAT_SHIPPING_FEE } from '@/constants';
import { sanitizeCart, sanitizeQty } from '@/utils';

// - Cart context create kar rahe hain taake puri app mein cart ka data share ho sakay
const CartContext = createContext(null);

export function CartProvider({ children }) {
    // - LocalStorage se pehle se saved cart data load karta hai, agar na ho toh empty array ([]) deta hai
    const [cart, setCart] = useState(() => {
        try {
            const stored = localStorage.getItem(CART_STORAGE_KEY);
            return stored ? sanitizeCart(JSON.parse(stored)) : [];
        } catch (_) {
            return [];
        }
    });

    // - Drawer (Cart slide-over) aur Modal (Quick view) ki states
    const [cartOpen, setCartOpen] = useState(false);
    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [activeDetailImg, setActiveDetailImg] = useState('');
    const [selectedVariant, setSelectedVariant] = useState(null);

    // - Jab bhi cart update ho, yeh localStorage mein automatically save kar deta hai
    useEffect(() => {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(sanitizeCart(cart)));
        } catch (_) { /* storage unavailable */ }
    }, [cart]);

    // - Cart ki total calculations (Items count, subtotal, shipping fee, aur grand total)
    const cartCount = useMemo(() => cart.reduce((sum, item) => sum + sanitizeQty(item.qty), 0), [cart]);
    const cartSubtotal = useMemo(() => cart.reduce((sum, item) => sum + (item.price * sanitizeQty(item.qty)), 0), [cart]);
    const cartShipping = useMemo(() => {
        if (cartCount === 0) return 0;
        // Agar subtotal free shipping threshold se zyada hai toh shipping free (0), warna flat fee
        return cartSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE;
    }, [cartCount, cartSubtotal]);
    const cartTotal = useMemo(() => {
        if (cartCount === 0) return 0;
        return cartSubtotal + cartShipping;
    }, [cartCount, cartSubtotal, cartShipping]);

    // - Product ko cart mein add karne ka function (Variants aur ID handle karte hue)
    const addToCart = useCallback((product) => {
        if (!product) return;
        const variant = product.selectedVariant || selectedVariant || (product.variants && product.variants[0]);
        const itemId = variant ? `${product.id}-${variant.name.toLowerCase().replace(/[^a-z0-9]/g, '')}` : product.id;
        const itemName = variant ? `${product.name} (${variant.name})` : product.name;
        const itemImg = variant ? variant.image : product.img1;
        const itemPrice = (variant && typeof variant.price === 'number') ? variant.price : (product.price || 0);

        setCart(prev => {
            const existing = prev.find(item => item.id === itemId);
            if (existing) {
                return prev.map(item =>
                    item.id === itemId
                        ? { ...item, qty: sanitizeQty(item.qty + 1) }
                        : item
                );
            }
            return [...prev, {
                id: String(itemId),
                name: String(itemName),
                price: itemPrice,
                img1: String(itemImg),
                qty: 1,
            }];
        });
    }, [selectedVariant]);

    // - Item ki quantity aik barhata hai (+)
    const incrementQty = useCallback((itemId) => {
        setCart(prev => prev.map(item =>
            item.id === itemId ? { ...item, qty: sanitizeQty(item.qty + 1) } : item
        ));
    }, []);

    // - Item ki quantity kam karta hai (-) ya agar qty 1 ho toh cart se remove kar deta hai
    const decrementQty = useCallback((itemId) => {
        setCart(prev => {
            const item = prev.find(i => i.id === itemId);
            if (!item) return prev;
            if (sanitizeQty(item.qty) > 1) {
                return prev.map(i => i.id === itemId ? { ...i, qty: sanitizeQty(i.qty - 1) } : i);
            }
            return prev.filter(i => i.id !== itemId);
        });
    }, []);

    // - Pura cart clear (khali) karne ke liye
    const clearCart = useCallback(() => setCart([]), []);

    // - Cart Drawer kholne aur band karne ke handlers
    const openDrawer = useCallback(() => setCartOpen(true), []);
    const closeDrawer = useCallback(() => setCartOpen(false), []);

    // - Quick View modal kholne ka function
    const openQuickView = useCallback((product) => {
        if (!product) return;
        setSelectedProduct(product);
        setActiveDetailImg(product.img1);
        setSelectedVariant(null);
        setDetailOpen(true);
    }, []);

    // - Quick View modal band karne ka function
    const closeModal = useCallback(() => {
        setDetailOpen(false);
    }, []);

    // - Performance optimize karne ke liye useMemo mein values wrap ki gayi hain
    const value = useMemo(() => ({
        cart, cartCount, cartSubtotal, cartShipping, cartTotal,
        addToCart, incrementQty, decrementQty, clearCart,
        cartOpen, openDrawer, closeDrawer,
        detailOpen, selectedProduct, activeDetailImg, selectedVariant,
        setActiveDetailImg, setSelectedVariant,
        openQuickView, closeModal,
    }), [
        cart, cartCount, cartSubtotal, cartShipping, cartTotal,
        addToCart, incrementQty, decrementQty, clearCart,
        cartOpen, openDrawer, closeDrawer,
        detailOpen, selectedProduct, activeDetailImg, selectedVariant,
        openQuickView, closeModal,
    ]);

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// - Custom hook taake doosray components mein asani se cart use ho sakay
export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}