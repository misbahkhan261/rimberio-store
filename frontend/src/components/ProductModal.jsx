import { useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useScrollLock } from '@/hooks/useScrollLock';
import { formatPrice, getImageFallback } from '@/utils';

export default function ProductModal() {
    const {
        detailOpen, selectedProduct, activeDetailImg, selectedVariant,
        setActiveDetailImg, setSelectedVariant,
        closeModal, addToCart,
    } = useCart();

    useScrollLock(detailOpen);

    useEffect(() => {
        if (!detailOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') closeModal();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [detailOpen, closeModal]);

    const handleImageError = useCallback((e) => {
        if (e.target.dataset.fallbackTriggered) return;
        e.target.dataset.fallbackTriggered = 'true';
        e.target.src = getImageFallback(e.target.src);
    }, []);

    const handleAddAndClose = useCallback(() => {
        if (selectedProduct) {
            addToCart({ ...selectedProduct, selectedVariant });
        }
        closeModal();
    }, [selectedProduct, selectedVariant, addToCart, closeModal]);

    const displayPrice = selectedVariant?.price || selectedProduct?.price || 0;
    const displayCompareAt = selectedVariant?.compareAt || selectedProduct?.compareAt || 0;

    return (
        <AnimatePresence>
            {detailOpen && selectedProduct && (
                <div
                    className="fixed inset-0 z-[1300] flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="detail-title"
                >
                    <motion.div
                        className="absolute inset-0 bg-ink-900/52 backdrop-blur-[8px] backdrop-saturate-[0.85]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        onClick={closeModal}
                        aria-hidden="true"
                    />

                    <motion.div
                        className="relative z-[1] bg-cream rounded-2xl w-full max-w-[900px] max-h-[calc(100vh-2rem)] overflow-hidden shadow-2xl"
                        style={{ boxShadow: 'var(--shadow-2xl), 0 0 0 1px rgba(26,23,19,0.06)' }}
                        initial={{ opacity: 0, scale: 0.95, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 16 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <button
                            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-ink-50 flex items-center justify-center text-ink-500 transition-all duration-[220ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-ink-900 hover:text-white active:scale-[0.88]"
                            onClick={closeModal}
                            aria-label="Close product details"
                        >
                            <X size={18} strokeWidth={2} aria-hidden="true" />
                        </button>

                        <div className="grid grid-cols-2 max-h-[calc(100vh-2rem)] overflow-y-auto overscroll-y-contain max-[640px]:grid-cols-1">
                            <div className="sticky top-0 flex flex-col gap-3 p-6 bg-ink-25 max-h-[calc(100vh-2rem)] overflow-hidden max-[640px]:static max-[640px]:max-h-none max-[640px]:overflow-visible">
                                <div className="flex-1 min-h-0 rounded-lg overflow-hidden bg-ink-50 group">
                                    <img
                                        src={activeDetailImg}
                                        alt={selectedProduct.name}
                                        className="w-full h-full object-cover object-center transition-all duration-[180ms] ease-linear group-hover:scale-[1.02]"
                                        loading="lazy"
                                        decoding="async"
                                        onError={handleImageError}
                                    />
                                </div>
                                <div className="flex gap-2 flex-wrap" role="list" aria-label="Product images">
                                    {selectedProduct.images?.map((img, i) => (
                                        <button
                                            key={i}
                                            className={`w-14 h-14 rounded-sm overflow-hidden shrink-0 bg-ink-50 transition-all duration-[220ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04] hover:shadow-md max-[480px]:w-12 max-[480px]:h-12 ${
                                                activeDetailImg === img
                                                    ? 'border-2 border-ink-900 shadow-sm'
                                                    : 'border-2 border-transparent'
                                            }`}
                                            onClick={() => {
                                                setActiveDetailImg(img);
                                                const matchingVariant = selectedProduct.variants?.find(v => v.image === img);
                                                if (matchingVariant) setSelectedVariant(matchingVariant);
                                            }}
                                            aria-label={`View image ${i + 1} of ${selectedProduct.images.length}`}
                                            aria-pressed={activeDetailImg === img}
                                            role="listitem"
                                        >
                                            <img
                                                src={img}
                                                alt={`${selectedProduct.name} — image ${i + 1}`}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                                decoding="async"
                                                onError={handleImageError}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-8 flex flex-col justify-between gap-8 overflow-y-auto overscroll-y-contain">
                                <div>
                                    <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-gold">
                                        {selectedProduct.tag}
                                    </span>
                                    <h2
                                        id="detail-title"
                                        className="font-display text-[clamp(1.5rem,1.3rem+1vw,2rem)] font-medium text-ink-900 leading-[1.18] tracking-[-0.01em] mt-2 mb-4"
                                    >
                                        {selectedProduct.name}
                                    </h2>
                                    <div className="flex items-baseline gap-3 mb-6">
                                        <span className="font-display text-[clamp(1.25rem,1.1rem+0.75vw,1.5rem)] font-medium text-ink-900 tracking-[0.01em] leading-none">
                                            {formatPrice(displayPrice)}
                                        </span>
                                        {displayCompareAt > displayPrice && (
                                            <span className="text-[length:clamp(0.6875rem,0.65rem+0.19vw,0.75rem)] text-ink-500 line-through tracking-[0.02em]">
                                                {formatPrice(displayCompareAt)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-[length:clamp(0.8125rem,0.78rem+0.16vw,0.875rem)] text-ink-500 leading-[1.75] pt-4 border-t border-ink-100">
                                        <p>Premium composition with structural precision. Finished to the highest standard and verified under our quality assurance process before dispatch.</p>
                                    </div>

                                    {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                                        <div className="mt-6">
                                            <span className="text-[10px] tracking-[0.15em] uppercase text-ink-500 font-semibold block mb-2">
                                                {selectedProduct.tag === 'Cube Lamp' ? 'Select Light Glow Color' : 'Select Frame / Light Color'}
                                            </span>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedProduct.variants.map((v) => (
                                                    <button
                                                        key={v.name}
                                                        type="button"
                                                        className={`px-3 py-1.5 text-xs font-semibold tracking-wider uppercase border transition-all duration-150 cursor-pointer ${
                                                            activeDetailImg === v.image
                                                                ? 'border-amber-700 bg-ink-900 text-amber-100 font-bold shadow-sm'
                                                                : 'border-ink-300 hover:border-ink-800 text-ink-700 bg-transparent'
                                                        }`}
                                                        onClick={() => {
                                                            setActiveDetailImg(v.image);
                                                            setSelectedVariant(v);
                                                        }}
                                                    >
                                                        {v.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    className="w-full inline-flex items-center justify-center gap-3 bg-ink-900 text-white font-mono text-[length:clamp(0.6875rem,0.65rem+0.19vw,0.75rem)] font-medium tracking-[3px] uppercase py-[14px] px-7 rounded-full border-[1.5px] border-ink-900 transition-all duration-[220ms] ease-[cubic-bezier(0.16,1,0.3,1)] relative overflow-hidden hover:bg-ink-700 hover:shadow-md hover:-translate-y-px active:translate-y-px active:scale-[0.98]"
                                    onClick={handleAddAndClose}
                                    aria-label="Add to bag"
                                >
                                    Add to Bag
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
