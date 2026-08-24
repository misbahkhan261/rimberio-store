import { memo, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { discountPercent, formatPrice, getImageFallback } from '@/utils';

// - React.memo use kiya hai taake sirf zaroorat par hi yeh card re-render ho aur performance theek rahay
const ProductCard = memo(function ProductCard({ product }) {
    const { addToCart, openQuickView } = useCart();
    
    // - Image preview, hover status aur "Added" button animation ki states
    const [preview, setPreview] = useState(product.img1 || product.image || product.images?.[0]);
    const [addedFeedback, setAddedFeedback] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const discount = discountPercent(product);

    // - Agar API se aane wali image load na ho sakay toh yeh fallback image laga dega
    const handleImageError = useCallback((e) => {
        if (e.target.dataset.fallbackTriggered) return;
        e.target.dataset.fallbackTriggered = 'true';
        e.target.src = getImageFallback(e.target.src);
    }, []);

    // - Cart mein item add karke button par 2 second ke liye "✓ ADDED" ka feedback show karta hai
    const handleAddToBag = useCallback((e) => {
        e.stopPropagation();
        addToCart(product);
        setAddedFeedback(true);
        setTimeout(() => setAddedFeedback(false), 2000); 
    }, [addToCart, product]);

    const easeCustom = [0.25, 1, 0.5, 1];

    return (
        <motion.article
            style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                position: 'relative'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => openQuickView(product)}
            role="button"
            tabIndex={0}
            aria-label={`View details for ${product.name || product.title}`}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openQuickView(product); } }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, ease: easeCustom }}
        >
            {/* - Image Container (Jisme discount badge aur hover effect hoga) */}
            <div 
                style={{
                    position: 'relative',
                    overflow: 'hidden',
                    aspectRatio: '1/1',
                    backgroundColor: '#F3F0EC',
                    borderRadius: '24px',
                    width: '100%',
                    transition: 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
                    boxShadow: isHovered ? '0 20px 45px -10px rgba(0,0,0,0.12)' : 'none'
                }}
            >
                {/* - Glassmorphic Discount Badge (Sirf tab aayega jab discount > 0 ho) */}
                <AnimatePresence>
                    {discount > 0 && (
                        <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{
                                position: 'absolute',
                                top: '14px',
                                left: '14px',
                                zIndex: 20,
                                backgroundColor: 'rgba(28, 26, 23, 0.85)',
                                backdropFilter: 'blur(10px)',
                                WebkitBackdropFilter: 'blur(10px)',
                                color: '#ffffff',
                                fontFamily: 'system-ui, -apple-system, sans-serif',
                                fontSize: '10px',
                                fontWeight: 600,
                                letterSpacing: '0.12em',
                                padding: '6px 12px',
                                borderRadius: '9999px',
                                textTransform: 'uppercase',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                        >
                            SAVE {discount}%
                        </motion.span>
                    )}
                </AnimatePresence>

                {/* - Main Product Image */}
                <motion.img
                    src={preview}
                    alt={product.name || product.title}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        display: 'block'
                    }}
                    loading="lazy"
                    decoding="async"
                    onError={handleImageError}
                    animate={{
                        scale: isHovered ? 1.05 : 1
                    }}
                    transition={{ duration: 0.7, ease: easeCustom }}
                />

                {/* - Hover par aane wala Quick View Overlay */}
                <motion.div 
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.12)',
                        backdropFilter: 'blur(2px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 15,
                        pointerEvents: 'none'
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: easeCustom }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 15 }}
                        transition={{ duration: 0.4, ease: easeCustom }}
                        style={{
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                            fontSize: '11px',
                            fontWeight: 500,
                            letterSpacing: '0.16em',
                            textTransform: 'uppercase',
                            color: '#ffffff',
                            backgroundColor: 'rgba(255, 255, 255, 0.25)',
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            padding: '10px 22px',
                            borderRadius: '9999px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
                        }}
                    >
                        Quick View
                    </motion.div>
                </motion.div>
            </div>

            {/* - Product Details Area (Naam, category waghera) */}
            <div style={{ paddingTop: '16px', paddingBottom: '8px', display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                
                {/* - Category Tag */}
                <span style={{ 
                    fontFamily: 'system-ui, -apple-system, sans-serif', 
                    fontSize: '10px', 
                    letterSpacing: '0.18em', 
                    textTransform: 'uppercase', 
                    color: '#B58E4A',
                    fontWeight: 600 
                }}>
                    {product.tag || product.category || 'HOME DÉCOR'}
                </span>

                {/* - Title */}
                <h3 style={{ 
                    fontFamily: "'Cormorant Garamond', Georgia, serif", 
                    fontSize: '19px', 
                    fontWeight: 500, 
                    color: '#1C1A17', 
                    lineHeight: '1.2', 
                    margin: '2px 0 0 0',
                    letterSpacing: '-0.01em',
                    minHeight: '44px'
                }}>
                    {product.name || product.title}
                </h3>

                {/* - Pricing & Add to Bag Footer (STRICT FULL WIDTH FLEX BETWEEN) */}
                <div style={{ 
                    marginTop: '10px', 
                    paddingTop: '12px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    width: '100%',
                    borderTop: '1px solid #EBE7E0'
                }}>
                    {/* - Price Left */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {product.compareAt > product.price && (
                            <span style={{ 
                                fontSize: '11px', 
                                color: '#A09C95', 
                                textDecoration: 'line-through',
                                fontFamily: 'system-ui, -apple-system, sans-serif',
                                fontWeight: 400
                            }}>
                                {formatPrice(product.compareAt)}
                            </span>
                        )}
                        <span style={{ 
                            fontFamily: 'system-ui, -apple-system, sans-serif', 
                            fontSize: '16px', 
                            fontWeight: 600, 
                            color: '#1C1A17', 
                            lineHeight: '1',
                            letterSpacing: '-0.02em'
                        }}>
                            {formatPrice(product.price)}
                        </span>
                    </div>

                    {/* - Add To Bag Button Right */}
                    <button
                        style={{
                            position: 'relative',
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                            fontSize: '10px',
                            fontWeight: 600,
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            padding: '9px 18px',
                            borderRadius: '9999px',
                            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                            cursor: addedFeedback ? 'default' : 'pointer',
                            backgroundColor: addedFeedback ? '#B58E4A' : '#1C1A17',
                            color: '#ffffff',
                            border: 'none',
                            outline: 'none',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            marginLeft: 'auto'
                        }}
                        onClick={handleAddToBag}
                        disabled={addedFeedback}
                        aria-label="Add to bag"
                    >
                        {/* - Button ka text change hone ka animation */}
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={addedFeedback ? 'added' : 'add'}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.2 }}
                                style={{ display: 'block' }}
                            >
                                {addedFeedback ? '✓ ADDED' : 'ADD TO BAG'}
                            </motion.span>
                        </AnimatePresence>
                    </button>
                </div>
            </div>
        </motion.article>
    );
});

export default ProductCard;