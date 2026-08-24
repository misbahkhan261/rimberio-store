import { useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useScrollLock } from '@/hooks/useScrollLock';
import { formatPrice, getImageFallback } from '@/utils';

export default function ProductModal() {
    const {
        detailOpen, selectedProduct, activeDetailImg, selectedVariant,
        setActiveDetailImg, setSelectedVariant,
        closeModal, addToCart,
    } = useCart();

    // - Modal khulte hi background ki scrolling rokne ke liye
    useScrollLock(detailOpen);

    // - Keyboard se 'Escape' key press karne par modal close karne ka logic
    useEffect(() => {
        if (!detailOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') closeModal();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [detailOpen, closeModal]);

    // - Agar main image load na ho sakay toh fallback (default) image laga dega
    const handleImageError = useCallback((e) => {
        if (e.target.dataset.fallbackTriggered) return;
        e.target.dataset.fallbackTriggered = 'true';
        e.target.src = getImageFallback(e.target.src);
    }, []);

    // - Product (aur uske selected variant) ko cart mein add karke modal band kar dega
    const handleAddAndClose = useCallback(() => {
        if (selectedProduct) {
            addToCart({ ...selectedProduct, selectedVariant });
        }
        closeModal();
    }, [selectedProduct, selectedVariant, addToCart, closeModal]);

    // - Price dikhane ka logic (agar variant select kiya hai toh uski price, warna default product ki price)
    const displayPrice = selectedVariant?.price || selectedProduct?.price || 0;
    const displayCompareAt = selectedVariant?.compareAt || selectedProduct?.compareAt || 0;

    // - Smart check: Yeh dekhta hai ke kya sach mein 1 se zyada meaningful variants mojood hain?
    const rawVariants = selectedProduct?.variants || [];
    const hasMeaningfulVariants = rawVariants.length > 1 && rawVariants.some((v) => {
        const name = typeof v === 'string' ? v : (v.name || v.label || v.title || '');
        return name && !name.toUpperCase().includes('VARIANT');
    });

    return (
        <AnimatePresence>
            {detailOpen && selectedProduct && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 1400,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '24px',
                        boxSizing: 'border-box'
                    }}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="detail-title"
                >
                    {/* - Dark Backdrop Overlay (Peeche ka blur hissa) */}
                    <motion.div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundColor: 'rgba(10, 10, 10, 0.65)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)'
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={closeModal}
                        aria-hidden="true"
                    />

                    {/* - Main Luxury Modal Container (Asli popup box) */}
                    <motion.div
                        style={{
                            position: 'relative',
                            zIndex: 10,
                            width: '100%',
                            maxWidth: '940px',
                            maxHeight: '88vh',
                            backgroundColor: '#FAF8F5',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            boxShadow: '0 30px 60px rgba(0,0,0,0.18)',
                            border: '1px solid #EBE7E0',
                            display: 'flex',
                            flexWrap: 'wrap'
                        }}
                        initial={{ opacity: 0, scale: 0.96, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 10 }}
                        transition={{ duration: 0.4 }}
                    >
                        {/* - Floating Close Button (Upar right side par) */}
                        <button
                            style={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                zIndex: 50,
                                width: '38px',
                                height: '38px',
                                borderRadius: '50%',
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #E2DDD5',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#1C1A17',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                            }}
                            onClick={closeModal}
                            aria-label="Close product details"
                        >
                            <X size={18} strokeWidth={1.6} />
                        </button>

                        {/* - LEFT COLUMN: Gallery View (Bari image aur neechay choti images) */}
                        <div 
                            style={{
                                flex: '1 1 380px',
                                backgroundColor: '#F4EFE6',
                                padding: '24px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '16px',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderRight: '1px solid #EBE7E0',
                                boxSizing: 'border-box'
                            }}
                        >
                            {/* - Main Active Image Display */}
                            <div 
                                style={{
                                    width: '100%',
                                    height: '360px',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    backgroundColor: '#FFFFFF',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
                                }}
                            >
                                <img
                                    key={activeDetailImg}
                                    src={activeDetailImg || selectedProduct.image}
                                    alt={selectedProduct.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        objectPosition: 'center'
                                    }}
                                    onError={handleImageError}
                                />
                            </div>

                            {/* - Image Thumbnails Row (Agar 1 se zyada images hon tabhi show hoga) */}
                            {selectedProduct.images && selectedProduct.images.length > 1 && (
                                <div 
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        overflowX: 'auto',
                                        maxWidth: '100%',
                                        padding: '4px 0'
                                    }}
                                >
                                    {selectedProduct.images.map((img, i) => (
                                        <button
                                            key={i}
                                            style={{
                                                width: '46px',
                                                height: '46px',
                                                borderRadius: '10px',
                                                overflow: 'hidden',
                                                border: activeDetailImg === img ? '2px solid #1C1A17' : '2px solid transparent',
                                                opacity: activeDetailImg === img ? 1 : 0.6,
                                                cursor: 'pointer',
                                                padding: 0,
                                                backgroundColor: '#FFFFFF',
                                                transition: 'all 0.2s ease',
                                                flexShrink: 0
                                            }}
                                            onClick={() => {
                                                setActiveDetailImg(img);
                                                const matchingVariant = selectedProduct.variants?.find(v => (v.image || v.img) === img);
                                                if (matchingVariant) setSelectedVariant(matchingVariant);
                                            }}
                                        >
                                            <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* - RIGHT COLUMN: Product Details (Naam, description, options) */}
                        <div 
                            style={{
                                flex: '1 1 380px',
                                padding: '40px 36px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                overflowY: 'auto',
                                boxSizing: 'border-box'
                            }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {/* - Category Header */}
                                <span style={{
                                    fontFamily: 'system-ui, -apple-system, sans-serif',
                                    fontSize: '10px',
                                    letterSpacing: '0.26em',
                                    textTransform: 'uppercase',
                                    color: '#B58E4A',
                                    fontWeight: 600
                                }}>
                                    {selectedProduct.tag || "HOME DÉCOR"}
                                </span>

                                {/* - Product Title */}
                                <h2
                                    id="detail-title"
                                    style={{
                                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                                        fontSize: 'clamp(1.8rem, 2.8vw, 2.4rem)',
                                        fontWeight: 300,
                                        lineHeight: 1.15,
                                        color: '#1C1A17',
                                        margin: '0',
                                        paddingRight: '32px'
                                    }}
                                >
                                    {selectedProduct.name}
                                </h2>

                                {/* - Price Section */}
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'baseline', 
                                    gap: '12px',
                                    paddingBottom: '16px',
                                    borderBottom: '1px solid #EBE7E0'
                                }}>
                                    <span style={{ 
                                        fontFamily: 'system-ui, -apple-system, sans-serif', 
                                        fontSize: '22px', 
                                        fontWeight: 500, 
                                        color: '#1C1A17' 
                                    }}>
                                        {formatPrice(displayPrice)}
                                    </span>
                                    {displayCompareAt > displayPrice && (
                                        <span style={{ 
                                            fontFamily: 'system-ui, -apple-system, sans-serif', 
                                            fontSize: '14px', 
                                            color: '#A09C95', 
                                            textDecoration: 'line-through' 
                                        }}>
                                            {formatPrice(displayCompareAt)}
                                        </span>
                                    )}
                                </div>

                                {/* - Product Description */}
                                <p style={{
                                    fontFamily: 'system-ui, -apple-system, sans-serif',
                                    fontSize: '13px',
                                    lineHeight: '1.75',
                                    color: '#65625C',
                                    fontWeight: 300,
                                    margin: 0
                                }}>
                                    {selectedProduct.description || "Premium composition with structural precision. Finished to the highest standard and verified under our quality assurance process before dispatch. Curated for the modern space."}
                                </p>

                                {/* - Variant Selector (Sirf tab render hoga jab asal variants mojood honge) */}
                                {hasMeaningfulVariants && (
                                    <div style={{ marginTop: '8px' }}>
                                        <span style={{
                                            display: 'block',
                                            fontFamily: 'system-ui, -apple-system, sans-serif',
                                            fontSize: '10px',
                                            letterSpacing: '0.18em',
                                            textTransform: 'uppercase',
                                            color: '#8B857E',
                                            fontWeight: 600,
                                            marginBottom: '10px'
                                        }}>
                                            SELECT OPTION
                                        </span>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {rawVariants.map((v, idx) => {
                                                const variantName = typeof v === 'string' ? v : (v.name || v.label || v.title);
                                                const isActive = selectedVariant?.name === variantName || activeDetailImg === (v.image || v.img);

                                                return (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        onClick={() => {
                                                            if (v.image || v.img) setActiveDetailImg(v.image || v.img);
                                                            setSelectedVariant(v);
                                                        }}
                                                        style={{
                                                            padding: '8px 16px',
                                                            fontSize: '10px',
                                                            fontFamily: 'system-ui, -apple-system, sans-serif',
                                                            letterSpacing: '0.12em',
                                                            textTransform: 'uppercase',
                                                            borderRadius: '6px',
                                                            border: isActive ? '1px solid #1C1A17' : '1px solid #E2DDD5',
                                                            backgroundColor: isActive ? '#1C1A17' : '#FFFFFF',
                                                            color: isActive ? '#FFFFFF' : '#65625C',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                    >
                                                        {variantName}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* - Add to Bag Primary CTA Button */}
                            <button
                                style={{
                                    marginTop: '28px',
                                    width: '100%',
                                    height: '48px',
                                    backgroundColor: '#1C1A17',
                                    color: '#FFFFFF',
                                    borderRadius: '100px',
                                    border: 'none',
                                    fontFamily: 'system-ui, -apple-system, sans-serif',
                                    fontSize: '11px',
                                    letterSpacing: '0.22em',
                                    textTransform: 'uppercase',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    boxShadow: '0 6px 18px rgba(28,26,23,0.12)',
                                    transition: 'all 0.3s ease'
                                }}
                                onClick={handleAddAndClose}
                            >
                                <ShoppingBag size={15} strokeWidth={1.8} />
                                <span>Add to Bag</span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}