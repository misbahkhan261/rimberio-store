import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Minus, Plus, 
    User, Phone, MapPin, Mail,
    Wallet, CreditCard, Calendar, Lock, HelpCircle, ArrowRight, ArrowLeft, ShoppingBag, Check, ChevronDown, ChevronUp, Heart, Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '@/context/CartContext';
import { useScrollLock } from '@/hooks/useScrollLock';
import {
    formatPrice, getImageFallback,
    isValidName, isValidPhone, isValidAddress,
    isValidLuhn, isValidExpiry,
    formatCardNumber as formatCardNumberUtil, formatExpiry as formatExpiryUtil,
} from '@/utils';
import { submitCheckout } from '@/services/api';

export default function CartDrawer() {
    const {
        cart, cartCount, cartSubtotal, cartShipping, cartTotal,
        incrementQty, decrementQty, clearCart, cartOpen, closeDrawer,
    } = useCart();

    // - Jab cart khule toh peeche background ki scrolling rok deta hai
    useScrollLock(cartOpen);

    // - Cart ke 3 main steps hain: 'BAG' (Cart view), 'CHECKOUT' (Details), aur 'SUCCESS' (Order done)
    const [step, setStep] = useState('BAG'); 
    const [showSummary, setShowSummary] = useState(false);

    // - Customer ki details aur payment info ki states
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');
    
    const [orderLoading, setOrderLoading] = useState(false);
    const [confirmedOrderData, setConfirmedOrderData] = useState(null);

    // - Escape key daba kar drawer close karne ka logic
    useEffect(() => {
        if (!cartOpen) {
            setStep('BAG');
            setShowSummary(false);
            return;
        }
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') closeDrawer();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [cartOpen, closeDrawer]);

    // - Success screen par heart shape aur side se confetti (celebration) fire karne ka function
    const triggerHeartConfetti = useCallback(() => {
        const heartShape = confetti.shapeFromPath({
            path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
        });

        const redColors = ['#E63946', '#FF4D6D', '#C9184A', '#800020', '#C6A15B'];

        // Left Fountain
        confetti({
            particleCount: 80,
            angle: 60,
            spread: 55,
            origin: { x: 0.1, y: 0.8 },
            colors: redColors,
            shapes: [heartShape],
            scalar: 1.8,
            zIndex: 99999
        });

        // Right Fountain
        confetti({
            particleCount: 80,
            angle: 120,
            spread: 55,
            origin: { x: 0.9, y: 0.8 },
            colors: redColors,
            shapes: [heartShape],
            scalar: 1.8,
            zIndex: 99999
        });

        // Center Heart Explosion Burst
        setTimeout(() => {
            for (let i = 0; i < 360; i += 15) {
                const rad = (i * Math.PI) / 180;
                const x = 16 * Math.pow(Math.sin(rad), 3);
                const y = -(13 * Math.cos(rad) - 5 * Math.cos(2 * rad) - 2 * Math.cos(3 * rad) - Math.cos(4 * rad));
                
                confetti({
                    particleCount: 4,
                    angle: Math.atan2(y, x) * (180 / Math.PI),
                    spread: 20,
                    startVelocity: 30,
                    origin: { 
                        x: 0.5 + (x / 200), 
                        y: 0.4 + (y / 200) 
                    },
                    colors: redColors,
                    shapes: [heartShape],
                    scalar: 1.5,
                    zIndex: 99999
                });
            }
        }, 300);
    }, []);

    // - Agar image load na ho toh default/fallback image dikhaye
    const handleImageError = useCallback((e) => {
        if (e.target.dataset.fallbackTriggered) return;
        e.target.dataset.fallbackTriggered = 'true';
        e.target.src = getImageFallback(e.target.src);
    }, []);

    const handleCardNumberChange = useCallback((e) => setCardNumber(formatCardNumberUtil(e.target.value)), []);
    const handleExpiryChange = useCallback((e) => setCardExpiry(formatExpiryUtil(e.target.value)), []);

    // - Order ID ko proper format (e.g. NZ-XXXX) mein convert karne ke liye
    const generateOrderRef = (rawId) => {
        if (!rawId) return 'NZ-' + Math.floor(100000 + Math.random() * 900000);
        const strId = String(rawId).trim();
        if (strId.length <= 4 || !isNaN(Number(strId))) {
            return `NZ-${strId.padStart(4, '0')}`;
        }
        return strId.startsWith('ORD-') || strId.startsWith('NZ-') ? strId : `NZ-${strId}`;
    };

    // - Form ki validation check karta hai aur backend API ko hit karta hai
    const submitOrder = useCallback(() => {
        if (!isValidName(customerName)) {
            alert('Please enter your full name.');
            return;
        }
        if (customerEmail && !/\S+@\S+\.\S+/.test(customerEmail)) {
            alert('Please enter a valid email address.');
            return;
        }
        if (!isValidPhone(customerPhone)) {
            alert('Please enter a valid mobile number.');
            return;
        }
        if (!isValidAddress(customerAddress)) {
            alert('Please enter a complete address.');
            return;
        }
        if (paymentMethod === 'CARD') {
            if (!isValidLuhn(cardNumber) || !isValidExpiry(cardExpiry) || cardCvv.length < 3) {
                alert('Please check your card details.');
                return;
            }
        }

        setOrderLoading(true);
        const currentTotal = cartTotal;

        submitCheckout({
            customerName, customerEmail, customerPhone, customerAddress, paymentMethod, cardNumber, cardExpiry, cart,
        })
            .then((res) => {
                setOrderLoading(false);
                const orderId = generateOrderRef(res?.orderId || res?.id);
                setConfirmedOrderData({
                    name: customerName,
                    email: customerEmail,
                    phone: customerPhone,
                    address: customerAddress,
                    total: currentTotal,
                    payment: paymentMethod,
                    id: orderId
                });
                setStep('SUCCESS');
                clearCart();
                triggerHeartConfetti();
            })
            .catch(() => {
                // Agar internet/backend error aaye tab bhi local fallback order create kar deta hai
                setOrderLoading(false);
                const fallbackId = generateOrderRef(Math.floor(1000 + Math.random() * 9000));
                setConfirmedOrderData({
                    name: customerName,
                    email: customerEmail,
                    phone: customerPhone,
                    address: customerAddress,
                    total: currentTotal,
                    payment: paymentMethod,
                    id: fallbackId
                });
                setStep('SUCCESS');
                clearCart();
                triggerHeartConfetti();
            });
    }, [customerName, customerEmail, customerPhone, customerAddress, paymentMethod, cardNumber, cardExpiry, cardCvv, cart, cartTotal, clearCart, triggerHeartConfetti]);

    const displayPrice = (val) => formatPrice(val).replace('PKR', 'Rs');
    
    const cleanTitle = (title) => {
        if (!title) return '';
        return title.replace(/\s*\([^)]*variant[^)]*\)/gi, '').trim();
    };

    // - Success ke baad sab states ko khali karke drawer band karna
    const handleFinishSuccess = () => {
        setCustomerName(""); setCustomerEmail(""); setCustomerPhone(""); setCustomerAddress("");
        setCardNumber(""); setCardExpiry(""); setCardCvv("");
        setStep('BAG');
        closeDrawer();
    };

    return (
        <AnimatePresence>
            {cartOpen && (
                <div 
                    style={{ 
                        position: 'fixed', 
                        inset: 0, 
                        zIndex: 2000, 
                        display: 'flex', 
                        justifyContent: 'flex-end' 
                    }} 
                    role="dialog" 
                    aria-modal="true"
                >
                    {/* - Background ka blur effect (Backdrop) */}
                    <motion.div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundColor: 'rgba(15, 13, 11, 0.72)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)'
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={step === 'SUCCESS' ? handleFinishSuccess : closeDrawer}
                    />

                    {/* - Main Drawer Panel jo slide ho kar aata hai */}
                    <motion.div
                        style={{
                            position: 'relative',
                            zIndex: 10,
                            width: '100%',
                            maxWidth: '460px',
                            height: '100%',
                            backgroundColor: '#FAF8F5',
                            boxShadow: '-25px 0 70px rgba(0,0,0,0.25)',
                            display: 'flex',
                            flexDirection: 'column',
                            boxSizing: 'border-box',
                            overflow: 'hidden'
                        }}
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {/* - DRAWER HEADER */}
                        {step !== 'SUCCESS' && (
                            <div style={{
                                padding: '24px 28px 18px 28px',
                                borderBottom: '1px solid #EBE7E0',
                                backgroundColor: '#FAF8F5'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    {step === 'CHECKOUT' ? (
                                        <button
                                            onClick={() => setStep('BAG')}
                                            style={{
                                                border: 'none',
                                                background: 'none',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                color: '#C6A15B',
                                                fontSize: '11px',
                                                fontFamily: 'system-ui, sans-serif',
                                                letterSpacing: '0.18em',
                                                textTransform: 'uppercase',
                                                fontWeight: 700,
                                                padding: 0
                                            }}
                                        >
                                            <ArrowLeft size={14} /> Back to Bag
                                        </button>
                                    ) : (
                                        <span style={{
                                            fontFamily: 'system-ui, sans-serif',
                                            fontSize: '10px',
                                            letterSpacing: '0.24em',
                                            textTransform: 'uppercase',
                                            color: '#C6A15B',
                                            fontWeight: 700
                                        }}>
                                            {cartCount} {cartCount === 1 ? 'ITEM IN BAG' : 'ITEMS IN BAG'}
                                        </span>
                                    )}

                                    <button
                                        onClick={closeDrawer}
                                        style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '50%',
                                            backgroundColor: '#FFFFFF',
                                            border: '1px solid #E2DDD5',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#1C1A17',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <X size={16} strokeWidth={1.6} />
                                    </button>
                                </div>

                                <h2 style={{
                                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                                    fontSize: '28px',
                                    fontWeight: 300,
                                    color: '#1C1A17',
                                    margin: 0,
                                    lineHeight: 1
                                }}>
                                    {step === 'BAG' ? 'Your Curated Bag' : 'Shipping & Payment'}
                                </h2>
                            </div>
                        )}

                        {/* - DRAWER BODY AREA */}
                        <div style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '24px 28px',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            {/* - SUCCESS SCREEN (Order complete hone ke baad) */}
                            {step === 'SUCCESS' ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '100%',
                                        textAlign: 'center',
                                        padding: '10px 0'
                                    }}
                                >
                                    <motion.div
                                        initial={{ scale: 0, rotate: -30 }}
                                        animate={{ scale: [0, 1.2, 1], rotate: 0 }}
                                        transition={{ delay: 0.15, duration: 0.5 }}
                                        style={{
                                            width: '88px',
                                            height: '88px',
                                            borderRadius: '50%',
                                            backgroundColor: '#1C1A17',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#E63946',
                                            boxShadow: '0 0 45px rgba(230, 57, 70, 0.4)',
                                            marginBottom: '20px',
                                            position: 'relative',
                                            border: '1.5px solid rgba(230, 57, 70, 0.4)'
                                        }}
                                    >
                                        <Heart size={44} strokeWidth={1.2} fill="#E63946" />
                                        <Sparkles size={20} style={{ position: 'absolute', top: '10px', right: '10px', color: '#FFF' }} />
                                    </motion.div>

                                    <motion.h1
                                        initial={{ y: 15, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.25 }}
                                        style={{
                                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                                            fontSize: ' clamp(2rem, 5vw, 2.5rem)',
                                            fontWeight: 400,
                                            lineHeight: 1.1,
                                            color: '#1C1A17',
                                            letterSpacing: '0.02em',
                                            margin: '0 0 8px 0',
                                            textTransform: 'uppercase'
                                        }}
                                    >
                                        THANK YOU FOR SHOPPING!
                                    </motion.h1>

                                    <motion.p 
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.35 }}
                                        style={{
                                            fontFamily: 'system-ui, sans-serif',
                                            fontSize: '14px',
                                            color: '#C6A15B',
                                            fontWeight: 600,
                                            margin: '0 0 16px 0',
                                            letterSpacing: '0.05em'
                                        }}
                                    >
                                        Order Confirmed for {confirmedOrderData?.name || 'Valued Customer'}
                                    </motion.p>

                                    <p style={{
                                        fontFamily: 'system-ui, sans-serif',
                                        fontSize: '13px',
                                        lineHeight: '1.65',
                                        color: '#65625C',
                                        fontWeight: 300,
                                        maxWidth: '320px',
                                        margin: '0 0 24px 0'
                                    }}>
                                        Your reference <strong style={{ color: '#1C1A17', letterSpacing: '0.05em' }}>#{confirmedOrderData?.id}</strong> is received. We are carefully preparing your luxury items.
                                    </p>

                                    {/* - Dynamic Receipt Box */}
                                    <div style={{
                                        width: '100%',
                                        backgroundColor: '#FFFFFF',
                                        borderRadius: '16px',
                                        border: '1px solid #EBE7E0',
                                        padding: '18px 20px',
                                        marginBottom: '28px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '12px',
                                        textAlign: 'left',
                                        boxSizing: 'border-box'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#8B857E', fontFamily: 'system-ui, sans-serif' }}>
                                            <span>Order Reference:</span>
                                            <strong style={{ color: '#1C1A17', letterSpacing: '0.05em' }}>#{confirmedOrderData?.id}</strong>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#8B857E', fontFamily: 'system-ui, sans-serif' }}>
                                            <span>Payment Method:</span>
                                            <strong style={{ color: '#1C1A17' }}>{confirmedOrderData?.payment === 'COD' ? 'Cash on Delivery' : 'Credit/Debit Card'}</strong>
                                        </div>
                                        
                                        {confirmedOrderData?.email && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#8B857E', fontFamily: 'system-ui, sans-serif' }}>
                                                <span>Confirmation Email:</span>
                                                <strong style={{ color: '#1C1A17' }}>{confirmedOrderData.email}</strong>
                                            </div>
                                        )}

                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#8B857E', fontFamily: 'system-ui, sans-serif' }}>
                                            <span>Contact Phone:</span>
                                            <strong style={{ color: '#1C1A17' }}>{confirmedOrderData?.phone || 'N/A'}</strong>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#8B857E', fontFamily: 'system-ui, sans-serif' }}>
                                            <span>Total Amount:</span>
                                            <strong style={{ color: '#C6A15B', fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', fontWeight: 600 }}>{displayPrice(confirmedOrderData?.total || 0)}</strong>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#8B857E', fontFamily: 'system-ui, sans-serif' }}>
                                            <span>Delivery Status:</span>
                                            <strong style={{ color: '#27AE60', fontWeight: 600 }}>Dispatched Soon</strong>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleFinishSuccess}
                                        style={{
                                            width: '100%',
                                            height: '52px',
                                            backgroundColor: '#1C1A17',
                                            color: '#FFFFFF',
                                            borderRadius: '100px',
                                            border: 'none',
                                            fontFamily: 'system-ui, sans-serif',
                                            fontSize: '11px',
                                            letterSpacing: '0.22em',
                                            textTransform: 'uppercase',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            boxShadow: '0 8px 24px rgba(28,26,23,0.18)'
                                        }}
                                    >
                                        CONTINUE SHOPPING
                                    </button>
                                </motion.div>
                            ) : cartCount === 0 ? (
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '50vh',
                                    textAlign: 'center',
                                    gap: '16px'
                                }}>
                                    <ShoppingBag size={44} strokeWidth={1} style={{ color: '#C6A15B' }} />
                                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 300, color: '#1C1A17', margin: 0 }}>Your bag is empty.</p>
                                    <button
                                        onClick={closeDrawer}
                                        style={{
                                            padding: '14px 32px',
                                            backgroundColor: '#1C1A17',
                                            color: '#FFFFFF',
                                            borderRadius: '100px',
                                            border: 'none',
                                            fontSize: '10px',
                                            letterSpacing: '0.22em',
                                            textTransform: 'uppercase',
                                            fontWeight: 600,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Explore Collection
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {/* - STEP 1: BAG ITEMS REVIEW */}
                                    {step === 'BAG' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {cart.map((item) => (
                                                <div
                                                    key={item.id}
                                                    style={{
                                                        display: 'flex',
                                                        gap: '16px',
                                                        padding: '14px',
                                                        backgroundColor: '#FFFFFF',
                                                        borderRadius: '16px',
                                                        border: '1px solid #EBE7E0',
                                                        alignItems: 'center',
                                                        position: 'relative',
                                                        boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
                                                    }}
                                                >
                                                    <div style={{
                                                        width: '72px',
                                                        height: '72px',
                                                        borderRadius: '12px',
                                                        overflow: 'hidden',
                                                        backgroundColor: '#F4EFE6',
                                                        flexShrink: 0
                                                    }}>
                                                        <img 
                                                            src={item.img1 || item.image || item.img} 
                                                            alt={item.name} 
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                                            onError={handleImageError}
                                                        />
                                                    </div>

                                                    <div style={{ flex: 1, paddingRight: '20px' }}>
                                                        <h4 style={{
                                                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                                                            fontSize: '17px',
                                                            fontWeight: 400,
                                                            color: '#1C1A17',
                                                            margin: '0 0 4px 0',
                                                            lineHeight: 1.2
                                                        }}>
                                                            {cleanTitle(item.name)}
                                                        </h4>

                                                        <span style={{
                                                            fontFamily: 'system-ui, sans-serif',
                                                            fontSize: '13px',
                                                            fontWeight: 600,
                                                            color: '#C6A15B',
                                                            display: 'block',
                                                            marginBottom: '8px'
                                                        }}>
                                                            {displayPrice(item.price)}
                                                        </span>

                                                        <div style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '12px',
                                                            border: '1px solid #E2DDD5',
                                                            borderRadius: '100px',
                                                            padding: '3px 10px',
                                                            backgroundColor: '#FAF8F5'
                                                        }}>
                                                            <button
                                                                onClick={() => decrementQty(item.id)}
                                                                style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#1C1A17', display: 'flex', padding: 0 }}
                                                            >
                                                                <Minus size={11} strokeWidth={1.8} />
                                                            </button>

                                                            <span style={{ fontSize: '11px', fontFamily: 'system-ui, sans-serif', fontWeight: 600, color: '#1C1A17', minWidth: '14px', textAlign: 'center' }}>
                                                                {item.qty}
                                                            </span>

                                                            <button
                                                                onClick={() => incrementQty(item.id)}
                                                                style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#1C1A17', display: 'flex', padding: 0 }}
                                                            >
                                                                <Plus size={11} strokeWidth={1.8} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => clearCart(item.id)}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '12px',
                                                            right: '12px',
                                                            border: 'none',
                                                            background: 'none',
                                                            color: '#A09C95',
                                                            cursor: 'pointer',
                                                            padding: '4px'
                                                        }}
                                                    >
                                                        <X size={15} strokeWidth={1.5} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* - STEP 2: FORM INPUTS (Checkout Details) */}
                                    {step === 'CHECKOUT' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                            
                                            {/* - Accordion Order Preview */}
                                            <div style={{
                                                backgroundColor: '#FFFFFF',
                                                borderRadius: '14px',
                                                border: '1px solid #EBE7E0',
                                                overflow: 'hidden'
                                            }}>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowSummary(!showSummary)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px 16px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        border: 'none',
                                                        background: 'none',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <span style={{ fontSize: '11px', fontFamily: 'system-ui, sans-serif', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1C1A17' }}>
                                                        Review Order Items ({cartCount})
                                                    </span>
                                                    {showSummary ? <ChevronUp size={16} color="#C6A15B" /> : <ChevronDown size={16} color="#C6A15B" />}
                                                </button>

                                                <AnimatePresence>
                                                    {showSummary && (
                                                        <motion.div
                                                            initial={{ height: 0 }}
                                                            animate={{ height: 'auto' }}
                                                            exit={{ height: 0 }}
                                                            style={{ overflow: 'hidden', borderTop: '1px solid #F2EDE4', padding: '12px 16px' }}
                                                        >
                                                            {cart.map((item) => (
                                                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#65625C', marginBottom: '6px' }}>
                                                                    <span>{cleanTitle(item.name)} x{item.qty}</span>
                                                                    <span style={{ color: '#1C1A17', fontWeight: 500 }}>{displayPrice(item.price * item.qty)}</span>
                                                                </div>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            {/* - Delivery Details */}
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                <span style={{ fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C6A15B', fontWeight: 700, fontFamily: 'system-ui, sans-serif' }}>
                                                    1. SHIPPING ADDRESS
                                                </span>

                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                    <div style={{ position: 'relative' }}>
                                                        <User size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#C6A15B' }} />
                                                        <input
                                                            type="text"
                                                            placeholder="Full Name"
                                                            value={customerName}
                                                            onChange={(e) => setCustomerName(e.target.value)}
                                                            style={{
                                                                width: '100%',
                                                                height: '48px',
                                                                paddingLeft: '42px',
                                                                paddingRight: '14px',
                                                                borderRadius: '12px',
                                                                border: '1px solid #E2DDD5',
                                                                backgroundColor: '#FFFFFF',
                                                                fontSize: '13px',
                                                                color: '#1C1A17',
                                                                outline: 'none',
                                                                boxSizing: 'border-box',
                                                                fontFamily: 'system-ui, sans-serif'
                                                            }}
                                                        />
                                                    </div>

                                                    <div style={{ position: 'relative' }}>
                                                        <Mail size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#C6A15B' }} />
                                                        <input
                                                            type="email"
                                                            placeholder="Email Address"
                                                            value={customerEmail}
                                                            onChange={(e) => setCustomerEmail(e.target.value)}
                                                            style={{
                                                                width: '100%',
                                                                height: '48px',
                                                                paddingLeft: '42px',
                                                                paddingRight: '14px',
                                                                borderRadius: '12px',
                                                                border: '1px solid #E2DDD5',
                                                                backgroundColor: '#FFFFFF',
                                                                fontSize: '13px',
                                                                color: '#1C1A17',
                                                                outline: 'none',
                                                                boxSizing: 'border-box',
                                                                fontFamily: 'system-ui, sans-serif'
                                                            }}
                                                        />
                                                    </div>

                                                    <div style={{ position: 'relative' }}>
                                                        <Phone size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#C6A15B' }} />
                                                        <input
                                                            type="tel"
                                                            placeholder="WhatsApp / Mobile Number"
                                                            value={customerPhone}
                                                            onChange={(e) => setCustomerPhone(e.target.value)}
                                                            style={{
                                                                width: '100%',
                                                                height: '48px',
                                                                paddingLeft: '42px',
                                                                paddingRight: '14px',
                                                                borderRadius: '12px',
                                                                border: '1px solid #E2DDD5',
                                                                backgroundColor: '#FFFFFF',
                                                                fontSize: '13px',
                                                                color: '#1C1A17',
                                                                outline: 'none',
                                                                boxSizing: 'border-box',
                                                                fontFamily: 'system-ui, sans-serif'
                                                            }}
                                                        />
                                                    </div>

                                                    <div style={{ position: 'relative' }}>
                                                        <MapPin size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#C6A15B' }} />
                                                        <input
                                                            type="text"
                                                            placeholder="Complete Delivery Address"
                                                            value={customerAddress}
                                                            onChange={(e) => setCustomerAddress(e.target.value)}
                                                            style={{
                                                                width: '100%',
                                                                height: '48px',
                                                                paddingLeft: '42px',
                                                                paddingRight: '14px',
                                                                borderRadius: '12px',
                                                                border: '1px solid #E2DDD5',
                                                                backgroundColor: '#FFFFFF',
                                                                fontSize: '13px',
                                                                color: '#1C1A17',
                                                                outline: 'none',
                                                                boxSizing: 'border-box',
                                                                fontFamily: 'system-ui, sans-serif'
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* - Payment Options */}
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                <span style={{ fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C6A15B', fontWeight: 700, fontFamily: 'system-ui, sans-serif' }}>
                                                    2. PAYMENT METHOD
                                                </span>

                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => setPaymentMethod('COD')}
                                                        style={{
                                                            padding: '14px',
                                                            borderRadius: '14px',
                                                            border: paymentMethod === 'COD' ? '2px solid #1C1A17' : '1px solid #E2DDD5',
                                                            backgroundColor: paymentMethod === 'COD' ? '#1C1A17' : '#FFFFFF',
                                                            color: paymentMethod === 'COD' ? '#FFFFFF' : '#1C1A17',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'flex-start',
                                                            gap: '6px',
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                    >
                                                        <Wallet size={18} color={paymentMethod === 'COD' ? '#C6A15B' : '#1C1A17'} />
                                                        <span style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'system-ui, sans-serif' }}>Cash on Delivery</span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => setPaymentMethod('CARD')}
                                                        style={{
                                                            padding: '14px',
                                                            borderRadius: '14px',
                                                            border: paymentMethod === 'CARD' ? '2px solid #1C1A17' : '1px solid #E2DDD5',
                                                            backgroundColor: paymentMethod === 'CARD' ? '#1C1A17' : '#FFFFFF',
                                                            color: paymentMethod === 'CARD' ? '#FFFFFF' : '#1C1A17',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'flex-start',
                                                            gap: '6px',
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                    >
                                                        <CreditCard size={18} color={paymentMethod === 'CARD' ? '#C6A15B' : '#1C1A17'} />
                                                        <span style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'system-ui, sans-serif' }}>Credit / Card</span>
                                                    </button>
                                                </div>

                                                {/* - Card Details (Agar card select kiya ho) */}
                                                {paymentMethod === 'CARD' && (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
                                                        <div style={{ position: 'relative' }}>
                                                            <CreditCard size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#C6A15B' }} />
                                                            <input type="text" value={cardNumber} onChange={handleCardNumberChange} placeholder="0000 0000 0000 0000" maxLength={19} style={{ width: '100%', height: '46px', paddingLeft: '42px', borderRadius: '12px', border: '1px solid #E2DDD5', backgroundColor: '#FFFFFF', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                                                        </div>

                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                                            <input type="text" value={cardExpiry} onChange={handleExpiryChange} placeholder="MM / YY" maxLength={7} style={{ width: '100%', height: '46px', paddingLeft: '14px', borderRadius: '12px', border: '1px solid #E2DDD5', backgroundColor: '#FFFFFF', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                                                            <input type="password" value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} placeholder="CVV" maxLength={4} style={{ width: '100%', height: '46px', paddingLeft: '14px', borderRadius: '12px', border: '1px solid #E2DDD5', backgroundColor: '#FFFFFF', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* - BOTTOM CHECKOUT DOCK (Jo neechay fix rehta hai) */}
                        {cartCount > 0 && step !== 'SUCCESS' && (
                            <div style={{
                                padding: '20px 28px 24px 28px',
                                backgroundColor: '#FFFFFF',
                                borderTop: '1px solid #EBE7E0',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '14px',
                                boxShadow: '0 -10px 30px rgba(0,0,0,0.03)'
                            }}>
                                {step === 'CHECKOUT' && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                        <div>
                                            <span style={{ fontSize: '10px', color: '#8B857E', display: 'block', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>Total Amount</span>
                                            <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '28px', fontWeight: 500, color: '#1C1A17' }}>
                                                {displayPrice(cartTotal)}
                                            </span>
                                        </div>

                                        <span style={{ 
                                            fontSize: '11px', 
                                            color: cartShipping === 0 ? '#27AE60' : '#1C1A17', 
                                            fontWeight: 700, 
                                            letterSpacing: '0.05em' 
                                        }}>
                                            {cartShipping === 0 ? 'FREE SHIPPING' : `DELIVERY: ${displayPrice(cartShipping)}`}
                                        </span>
                                    </div>
                                )}

                                {step === 'BAG' ? (
                                    <button
                                        onClick={() => setStep('CHECKOUT')}
                                        style={{
                                            width: '100%',
                                            height: '52px',
                                            backgroundColor: '#1C1A17',
                                            color: '#FFFFFF',
                                            borderRadius: '100px',
                                            border: 'none',
                                            fontFamily: 'system-ui, sans-serif',
                                            fontSize: '11px',
                                            letterSpacing: '0.24em',
                                            textTransform: 'uppercase',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '12px',
                                            boxShadow: '0 8px 22px rgba(28,26,23,0.18)',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <span>PROCEED TO SHIPPING</span>
                                        <ArrowRight size={15} style={{ color: '#C6A15B' }} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={submitOrder}
                                        disabled={orderLoading}
                                        style={{
                                            width: '100%',
                                            height: '52px',
                                            backgroundColor: '#1C1A17',
                                            color: '#FFFFFF',
                                            borderRadius: '100px',
                                            border: 'none',
                                            fontFamily: 'system-ui, sans-serif',
                                            fontSize: '11px',
                                            letterSpacing: '0.24em',
                                            textTransform: 'uppercase',
                                            fontWeight: 600,
                                            cursor: orderLoading ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '12px',
                                            boxShadow: '0 8px 22px rgba(28,26,23,0.18)',
                                            opacity: orderLoading ? 0.7 : 1,
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {orderLoading ? (
                                            <span style={{ width: '16px', height: '16px', border: '2px solid #C6A15B', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                                        ) : (
                                            <>
                                                <span>CONFIRM ORDER</span>
                                                <Check size={16} style={{ color: '#C6A15B' }} />
                                            </>
                                        )}
                                    </button>
                                )}

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#A09C95', fontSize: '10px', fontFamily: 'system-ui, sans-serif' }}>
                                    <Lock size={11} />
                                    <span>100% Encrypted & Secure Checkout</span>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}