import { memo, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { discountPercent, formatPrice, getImageFallback } from '@/utils';

const ProductCard = memo(function ProductCard({ product }) {
    const { addToCart, openQuickView } = useCart();
    const [preview, setPreview] = useState(product.img1);
    const [addedFeedback, setAddedFeedback] = useState(false);

    const discount = discountPercent(product);

    const handleImageError = useCallback((e) => {
        if (e.target.dataset.fallbackTriggered) return;
        e.target.dataset.fallbackTriggered = 'true';
        e.target.src = getImageFallback(e.target.src);
    }, []);

    const handleAddToBag = useCallback((e) => {
        e.stopPropagation();
        addToCart(product);
        setAddedFeedback(true);
        setTimeout(() => setAddedFeedback(false), 1400);
    }, [addToCart, product]);

    return (
        <motion.article
            className="w-full max-w-[320px] flex flex-col bg-transparent cursor-pointer group"
            style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 450px' }}
            onClick={() => openQuickView(product)}
            role="button"
            tabIndex={0}
            aria-label={`View details for ${product.name}`}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openQuickView(product); } }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -5 }}
        >
            <div className="relative overflow-hidden aspect-[4/5] bg-ink-25 isolate rounded-sm">
                {discount > 0 && (
                    <span
                        className="absolute top-3 left-3 z-[4] bg-ink-900 text-white font-mono text-[10px] font-medium tracking-[0.1em] py-1 px-2 rounded-[2px] uppercase"
                        style={{ animation: 'badge-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both' }}
                    >
                        {discount}% off
                    </span>
                )}
                <img
                    src={preview}
                    alt={product.name}
                    className="w-full h-full object-cover object-center transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                    loading="lazy"
                    decoding="async"
                    onError={handleImageError}
                />
                <div className="absolute inset-0 grid grid-cols-2" aria-hidden="true">
                    <div onMouseEnter={() => setPreview(product.img1)} />
                    <div onMouseEnter={() => setPreview(product.images?.[1] || product.img1)} />
                </div>
                <div className="absolute inset-0 bg-ink-900/[0.34] flex items-center justify-center opacity-0 transition-opacity duration-[220ms] ease-[cubic-bezier(0.16,1,0.3,1)] z-[3] pointer-events-none group-hover:opacity-100">
                    <span className="font-mono text-[length:clamp(0.6875rem,0.65rem+0.19vw,0.75rem)] tracking-[0.18em] uppercase text-white border border-white/52 py-[9px] px-5 rounded-[2px] translate-y-[6px] transition-transform duration-[120ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-y-0">
                        Quick View
                    </span>
                </div>
            </div>

            <div className="py-4 flex flex-col gap-2 flex-1">
                <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-gold">
                        {product.tag}
                    </span>
                </div>
                <h3 className="font-display text-[clamp(1.0625rem,1rem+0.31vw,1.125rem)] font-medium text-ink-900 leading-[1.25] tracking-[0.01em]">
                    {product.name}
                </h3>
                <div className="mt-auto pt-3 flex items-center justify-between gap-2 border-t border-ink-50">
                    <div className="flex flex-col gap-[2px]">
                        {product.compareAt > product.price && (
                            <span className="text-[length:clamp(0.6875rem,0.65rem+0.19vw,0.75rem)] text-ink-500 line-through tracking-[0.02em]">
                                {formatPrice(product.compareAt)}
                            </span>
                        )}
                        <span className="font-display text-[clamp(1.25rem,1.1rem+0.75vw,1.5rem)] font-medium text-ink-900 tracking-[0.01em] leading-none">
                            {formatPrice(product.price)}
                        </span>
                    </div>
                    <button
                        className="font-mono text-[10px] font-medium tracking-[0.14em] uppercase border border-ink-200 py-2 px-[14px] rounded-[2px] bg-transparent transition-all duration-[220ms] ease-[cubic-bezier(0.16,1,0.3,1)] whitespace-nowrap shrink-0 hover:bg-ink-900 hover:text-white hover:border-ink-900 active:scale-[0.93] disabled:bg-gold-pale disabled:text-gold disabled:border-gold-soft disabled:cursor-default disabled:transform-none"
                        onClick={handleAddToBag}
                        disabled={addedFeedback}
                        aria-label="Add to bag"
                    >
                        {addedFeedback ? '✓ Added' : 'Add to Bag'}
                    </button>
                </div>
            </div>
        </motion.article>
    );
});

export default ProductCard;
