import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Wallet, CreditCard } from 'lucide-react';
import Swal from 'sweetalert2';
import { useCart } from '@/context/CartContext';
import { useScrollLock } from '@/hooks/useScrollLock';
import {
    formatPrice, getImageFallback,
    isValidName, isValidPhone, isValidAddress,
    isValidLuhn, isValidExpiry,
    formatCardNumber as formatCardNumberUtil, formatExpiry as formatExpiryUtil,
} from '@/utils';


import { submitCheckout } from '@/services/api';
const SWAL_CONFIG = {
    confirmButtonColor: '#3a3228',
    customClass: { popup: 'swal-rimberio' },
};

export default function CartDrawer() {
    const {
        cart,
         cartCount,
          cartSubtotal,
           cartShipping,
            cartTotal,
        incrementQty,
         decrementQty,
          clearCart,
        cartOpen,
         closeDrawer,
    } = useCart();

    console.log({
    cart,
    cartCount,
    cartSubtotal
});
    useScrollLock(cartOpen);

    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');
    const [orderLoading, setOrderLoading] = useState(false);

    useEffect(() => {
        if (!cartOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') closeDrawer();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [cartOpen, closeDrawer]);

    const handleImageError = useCallback((e) => {
        if (e.target.dataset.fallbackTriggered) return;
        e.target.dataset.fallbackTriggered = 'true';
        e.target.src = getImageFallback(e.target.src);
    }, []);

    const handleCardNumberChange = useCallback((e) => {
        setCardNumber(formatCardNumberUtil(e.target.value));
    }, []);

    const handleExpiryChange = useCallback((e) => {
        setCardExpiry(formatExpiryUtil(e.target.value));
    }, []);

    const submitOrder = useCallback(() => {
        if (!isValidName(customerName)) {
            Swal.fire({ icon: 'error', title: 'Name Required', text: 'Please enter your full name (minimum 2 characters).', ...SWAL_CONFIG });
            return;
        }
        if (!isValidPhone(customerPhone)) {
            Swal.fire({ icon: 'error', title: 'Invalid Contact Number', text: 'Please enter a valid Pakistani mobile number (e.g., 03001234567, +923001234567).', ...SWAL_CONFIG });
            return;
        }
        if (!isValidAddress(customerAddress)) {
            Swal.fire({ icon: 'error', title: 'Address Incomplete', text: 'Please enter a complete delivery address (minimum 10 characters).', ...SWAL_CONFIG });
            return;
        }
        if (paymentMethod === 'CARD') {
            if (!isValidLuhn(cardNumber)) {
                Swal.fire({ icon: 'error', title: 'Card Info Invalid', text: 'Please enter a valid card number passing Luhn checks.', ...SWAL_CONFIG });
                return;
            }
            if (!isValidExpiry(cardExpiry)) {
                Swal.fire({ icon: 'error', title: 'Card Expired', text: 'Please provide a valid, non-expired card expiration date (MM / YY).', ...SWAL_CONFIG });
                return;
            }
            const cleanCvv = cardCvv.replace(/\D/g, '');
            if (cleanCvv.length < 3 || cleanCvv.length > 4) {
                Swal.fire({ icon: 'error', title: 'CVV Incomplete', text: 'Provide the 3 or 4 digit CVV security code on the back.', ...SWAL_CONFIG });
                return;
            }
        }

        setOrderLoading(true);

        submitCheckout({
            customerName,
            customerPhone,
            customerAddress,
            paymentMethod,
            cardNumber,
            cardExpiry,
            cart,
        })
            .then((data) => {

                setOrderLoading(false);

                clearCart();
                closeDrawer();

                Swal.fire({
                    icon: "success",
                    title: "Order Confirmed",
                    text: `Thank you for your order, ${customerName}! We will notify you when your items are on the way.`,
                    ...SWAL_CONFIG,
                });
                setCustomerName("");
                setCustomerPhone("");
                setCustomerAddress("");
                setCardNumber("");
                setCardExpiry("");
                setCardCvv("");

            })
            .catch((err) => {

                setOrderLoading(false);

                Swal.fire({
                    icon: "error",
                    title: "Checkout Failed",
                    text: err.message,
                    ...SWAL_CONFIG,
                });

            });
    }, [customerName, customerPhone, customerAddress, paymentMethod, cardNumber, cardExpiry, cardCvv, clearCart, closeDrawer]);

    return (
        <AnimatePresence>
            {cartOpen && (
                <div className="fixed inset-0 z-[1200] no-print" role="dialog" aria-modal="true" aria-label="Shopping bag">
                    <motion.div
                        className="absolute inset-0 bg-ink-900/42 backdrop-blur-[4px] backdrop-saturate-[0.9]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={closeDrawer}
                        aria-hidden="true"
                    />

                    <motion.div
                        className="absolute top-0 bottom-0 right-0 w-[min(480px,100%)] bg-cream flex flex-col shadow-2xl"
                        style={{ boxShadow: 'var(--shadow-2xl), -1px 0 0 var(--color-ink-100)' }}
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {/* Header */}
                        <div className="py-6 px-6 pb-5 border-b border-ink-100 flex items-start justify-between gap-4 shrink-0">
                            <div>
                                <h3 className="font-display text-[clamp(1.5rem,1.3rem+1vw,2rem)] font-medium text-ink-900 tracking-[0.01em] leading-[1.15]">
                                    Your Bag
                                </h3>
                                <span className="font-mono text-[length:clamp(0.6875rem,0.65rem+0.19vw,0.75rem)] tracking-[0.1em] text-ink-400 mt-[2px] block" aria-live="polite" aria-atomic="true">
                                    {cartCount} {cartCount === 1 ? 'item' : 'items'}
                                </span>
                            </div>
                            <button
                                className="w-[34px] h-[34px] rounded-full bg-ink-50 flex items-center justify-center text-ink-500 shrink-0 transition-all duration-[220ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-ink-900 hover:text-white active:scale-[0.88]"
                                onClick={closeDrawer}
                                aria-label="Close shopping bag"
                            >
                                <X size={18} strokeWidth={2} aria-hidden="true" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto overscroll-y-contain py-5 px-6 flex flex-col gap-6 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-ink-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                            {cartCount === 0 && (
                                <div className="flex flex-col items-center justify-center py-16 px-8 text-center gap-4 text-ink-400" style={{ animation: 'fade-up 0.4s cubic-bezier(0.16,1,0.3,1) both' }} role="status">
                                    <ShoppingBag size={52} strokeWidth={1} className="opacity-20" aria-hidden="true" />
                                    <p className="text-[length:clamp(0.8125rem,0.78rem+0.16vw,0.875rem)] tracking-[0.03em] leading-[1.75] text-ink-400">
                                        Your bag is empty.<br />Add something beautiful to begin.
                                    </p>
                                </div>
                            )}

                            {cartCount > 0 && (
                                <>
                                    <div className="flex flex-col gap-3" role="list" aria-label="Items in your bag">
                                        {cart.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex gap-4 p-4 bg-cream-mid rounded-lg border border-ink-100 transition-colors duration-[220ms] hover:border-ink-200"
                                                style={{ animation: 'cart-in 0.28s cubic-bezier(0.16,1,0.3,1) both' }}
                                                role="listitem"
                                            >
                                                <img
                                                    src={item.img1}
                                                    alt={item.name}
                                                    className="w-[68px] h-20 object-cover rounded-sm shrink-0 bg-ink-50 transition-transform duration-[120ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.02]"
                                                    loading="lazy"
                                                    decoding="async"
                                                    onError={handleImageError}
                                                />
                                                <div className="flex-1 min-w-0 flex flex-col gap-1">
                                                    <h4 className="font-display text-[clamp(0.9375rem,0.9rem+0.19vw,1rem)] font-medium text-ink-900 leading-[1.3] tracking-[0.01em] whitespace-nowrap overflow-hidden text-ellipsis">
                                                        {item.name}
                                                    </h4>
                                                    <p className="font-display text-[clamp(0.9375rem,0.9rem+0.19vw,1rem)] text-ink-600 tracking-[0.02em]">
                                                        {formatPrice(item.price)}
                                                    </p>
                                                    <div className="flex items-stretch mt-2 w-fit border border-ink-200 rounded-[2px] overflow-hidden" role="group" aria-label={`Quantity for ${item.name}`}>
                                                        <button
                                                            className="w-7 h-7 flex items-center justify-center text-base leading-none text-ink-600 transition-all duration-[120ms] hover:bg-ink-900 hover:text-white active:scale-[0.88]"
                                                            onClick={() => decrementQty(item.id)}
                                                            aria-label={`Decrease quantity of ${item.name}`}
                                                        >
                                                            −
                                                        </button>
                                                        <span className="w-8 h-7 flex items-center justify-center text-center font-mono text-[length:clamp(0.6875rem,0.65rem+0.19vw,0.75rem)] font-medium text-ink-800 border-l border-r border-ink-200" aria-live="polite" aria-atomic="true" role="status">
                                                            {item.qty}
                                                        </span>
                                                        <button
                                                            className="w-7 h-7 flex items-center justify-center text-base leading-none text-ink-600 transition-all duration-[120ms] hover:bg-ink-900 hover:text-white active:scale-[0.88]"
                                                            onClick={() => incrementQty(item.id)}
                                                            aria-label={`Increase quantity of ${item.name}`}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Checkout Form */}
                                    <div className="flex flex-col gap-5">
                                        <div className="font-mono text-[length:clamp(0.6875rem,0.65rem+0.19vw,0.75rem)] tracking-[0.14em] uppercase text-ink-400 pb-3 border-b border-ink-100">
                                            Shipping Details
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Full name" className="w-full py-3 px-[14px] bg-white border border-ink-200 rounded-sm font-body text-[length:clamp(0.8125rem,0.78rem+0.16vw,0.875rem)] text-ink-800 tracking-[0.01em] outline-none transition-all duration-[220ms] focus:border-ink-700 focus:shadow-[0_0_0_3px_rgba(140,122,107,0.14)] placeholder:text-ink-500" autoComplete="name" aria-label="Full name" minLength={2} spellCheck="false" />
                                            <input type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="Phone / WhatsApp (03001234567)" className="w-full py-3 px-[14px] bg-white border border-ink-200 rounded-sm font-body text-[length:clamp(0.8125rem,0.78rem+0.16vw,0.875rem)] text-ink-800 tracking-[0.01em] outline-none transition-all duration-[220ms] focus:border-ink-700 focus:shadow-[0_0_0_3px_rgba(140,122,107,0.14)] placeholder:text-ink-500" autoComplete="tel" aria-label="Phone number" inputMode="tel" />
                                            <input type="text" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} placeholder="Delivery address" className="w-full py-3 px-[14px] bg-white border border-ink-200 rounded-sm font-body text-[length:clamp(0.8125rem,0.78rem+0.16vw,0.875rem)] text-ink-800 tracking-[0.01em] outline-none transition-all duration-[220ms] focus:border-ink-700 focus:shadow-[0_0_0_3px_rgba(140,122,107,0.14)] placeholder:text-ink-500" autoComplete="street-address" aria-label="Delivery address" minLength={10} />
                                        </div>

                                        {/* Payment Method */}
                                        <div className="flex gap-3 max-[480px]:flex-col" role="group" aria-label="Payment method">
                                            <button
                                                type="button"
                                                className={`flex-1 flex items-center gap-3 p-4 bg-white border-[1.5px] rounded-lg transition-all duration-[220ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-ink-400 hover:-translate-y-px hover:shadow-sm ${paymentMethod === 'COD' ? 'border-ink-900 bg-ink-25 shadow-sm' : 'border-ink-200'
                                                    }`}
                                                onClick={() => setPaymentMethod('COD')}
                                                aria-pressed={paymentMethod === 'COD'}
                                            >
                                                <div className="w-8 h-8 bg-ink-900 rounded-sm flex items-center justify-center text-white shrink-0">
                                                    <Wallet size={15} aria-hidden="true" />
                                                </div>
                                                <div>
                                                    <h4 className="text-[length:clamp(0.6875rem,0.65rem+0.19vw,0.75rem)] font-semibold text-ink-900 tracking-[0.02em] leading-[1.3]">Cash on Delivery</h4>
                                                    <p className="text-[10px] text-ink-400 tracking-[0.04em] leading-[1.3]">Pay after delivery</p>
                                                </div>
                                            </button>
                                            <button
                                                type="button"
                                                className={`flex-1 flex items-center gap-3 p-4 bg-white border-[1.5px] rounded-lg transition-all duration-[220ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-ink-400 hover:-translate-y-px hover:shadow-sm ${paymentMethod === 'CARD' ? 'border-ink-900 bg-ink-25 shadow-sm' : 'border-ink-200'
                                                    }`}
                                                onClick={() => setPaymentMethod('CARD')}
                                                aria-pressed={paymentMethod === 'CARD'}
                                            >
                                                <div className="w-8 h-8 bg-ink-900 rounded-sm flex items-center justify-center text-white shrink-0">
                                                    <CreditCard size={15} aria-hidden="true" />
                                                </div>
                                                <div>
                                                    <h4 className="text-[length:clamp(0.6875rem,0.65rem+0.19vw,0.75rem)] font-semibold text-ink-900 tracking-[0.02em] leading-[1.3]">Card Payment</h4>
                                                    <p className="text-[10px] text-ink-400 tracking-[0.04em] leading-[1.3]">Visa • Mastercard</p>
                                                </div>
                                            </button>
                                        </div>

                                        {/* Card Fields */}
                                        <AnimatePresence>
                                            {paymentMethod === 'CARD' && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="flex flex-col gap-3 p-4 bg-gold-pale rounded-lg border border-[rgba(184,146,74,0.18)]" aria-label="Card details">
                                                        <input type="text" value={cardNumber} onChange={handleCardNumberChange} placeholder="Card number" className="w-full py-3 px-[14px] bg-white border border-ink-200 rounded-sm font-body text-[length:clamp(0.8125rem,0.78rem+0.16vw,0.875rem)] text-ink-800 tracking-[0.01em] outline-none transition-all duration-[220ms] focus:border-ink-700 focus:shadow-[0_0_0_3px_rgba(140,122,107,0.14)] placeholder:text-ink-500" maxLength={19} autoComplete="cc-number" aria-label="Card number" inputMode="numeric" />
                                                        <div className="grid grid-cols-2 gap-3 max-[480px]:grid-cols-1">
                                                            <input type="text" value={cardExpiry} onChange={handleExpiryChange} placeholder="MM / YY" className="w-full py-3 px-[14px] bg-white border border-ink-200 rounded-sm font-body text-[length:clamp(0.8125rem,0.78rem+0.16vw,0.875rem)] text-ink-800 tracking-[0.01em] outline-none transition-all duration-[220ms] focus:border-ink-700 focus:shadow-[0_0_0_3px_rgba(140,122,107,0.14)] placeholder:text-ink-500" maxLength={7} autoComplete="cc-exp" aria-label="Card expiry date (MM/YY)" />
                                                            <input type="password" value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} placeholder="CVV" className="w-full py-3 px-[14px] bg-white border border-ink-200 rounded-sm font-body text-[length:clamp(0.8125rem,0.78rem+0.16vw,0.875rem)] text-ink-800 tracking-[0.01em] outline-none transition-all duration-[220ms] focus:border-ink-700 focus:shadow-[0_0_0_3px_rgba(140,122,107,0.14)] placeholder:text-ink-500" maxLength={4} autoComplete="cc-csc" aria-label="Card security code (CVV)" inputMode="numeric" />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Order Summary */}
                                        <div className="p-5 bg-ink-25 rounded-lg border border-ink-100 flex flex-col gap-2" aria-label="Order summary">
                                            <div className="flex items-center justify-between gap-4">
                                                <span className="text-[length:clamp(0.8125rem,0.78rem+0.16vw,0.875rem)] text-ink-500 tracking-[0.02em]">Subtotal</span>
                                                <span className="text-[length:clamp(0.8125rem,0.78rem+0.16vw,0.875rem)] text-ink-700 font-medium tracking-[0.02em] min-w-[6ch] text-right">{formatPrice(cartSubtotal)}</span>
                                            </div>
                                            <div className="flex items-center justify-between gap-4">
                                                <span className="text-[length:clamp(0.8125rem,0.78rem+0.16vw,0.875rem)] text-ink-500 tracking-[0.02em]">Shipping</span>
                                                <span className="text-[length:clamp(0.8125rem,0.78rem+0.16vw,0.875rem)] text-ink-700 font-medium tracking-[0.02em] min-w-[6ch] text-right">{cartShipping === 0 ? 'FREE' : formatPrice(cartShipping)}</span>
                                            </div>
                                            <div className="h-px bg-ink-200 my-2" />
                                            <div className="flex items-center justify-between gap-4 font-display text-[clamp(1.25rem,1.1rem+0.75vw,1.5rem)] font-semibold text-ink-900 tracking-[0.01em]">
                                                <span>Total</span>
                                                <span>{formatPrice(cartTotal)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        {cartCount > 0 && (
                            <motion.div
                                className="py-4 px-6 pb-6 border-t border-ink-100 shrink-0"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <button
                                    className="w-full inline-flex items-center justify-center gap-3 bg-ink-900 text-white font-mono text-[length:clamp(0.6875rem,0.65rem+0.19vw,0.75rem)] font-medium tracking-[3px] uppercase py-[17px] px-7 rounded-full border-[1.5px] border-ink-900 transition-all duration-[220ms] ease-[cubic-bezier(0.16,1,0.3,1)] relative overflow-hidden hover:bg-ink-700 hover:shadow-md hover:-translate-y-px active:translate-y-px active:scale-[0.98] disabled:bg-ink-300 disabled:border-ink-300 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                                    onClick={submitOrder}
                                    disabled={orderLoading}
                                    aria-busy={orderLoading ? 'true' : 'false'}
                                    aria-label="Place your order"
                                >
                                    {orderLoading && (
                                        <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full" aria-hidden="true" />
                                    )}
                                    {orderLoading ? 'Placing order…' : 'Place Order'}
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
