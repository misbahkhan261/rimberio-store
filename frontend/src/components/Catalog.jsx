import { useCallback, useEffect, useState } from 'react';
import { AlertCircle, Heart } from 'lucide-react';
import { fetchProducts } from '@/services/api';
import ProductCard from './ProductCard';
import SkeletonCard from './SkeletonCard';

export default function Catalog() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const loadProducts = useCallback(async () => {
        setLoading(true);
        setError(false);
        try {
            const data = await fetchProducts();
            setProducts(data);
        } catch (_) {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    return (
        <section
            id="catalog"
            className="bg-cream py-16 px-[clamp(1.25rem,4vw,3rem)] max-w-[1320px] mx-auto"
            style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 800px' }}
            aria-labelledby="catalog-heading"
        >
            <div className="text-center max-w-[700px] mx-auto mb-20">
                <span className="block mb-[18px] text-[length:clamp(0.6875rem,0.65rem+0.19vw,0.75rem)] tracking-[0.35em] uppercase text-gold font-mono">
                    CURATED COLLECTION
                </span>
                <h2 id="catalog-heading" className="font-display text-[clamp(2.25rem,5vw,4.5rem)] font-medium leading-[0.95] tracking-[-0.03em] mb-[22px] text-ink-900">
                    Archive Drop 001
                </h2>
                <p className="max-w-[520px] mx-auto text-[clamp(1.0625rem,1rem+0.31vw,1.125rem)] leading-[1.8] text-ink-600">
                    Thoughtfully selected décor designed to elevate everyday living with timeless elegance.
                </p>
            </div>

            <div className="grid grid-cols-[minmax(0,320px)] justify-center gap-10 w-full min-[640px]:grid-cols-[repeat(2,minmax(0,320px))] max-[480px]:gap-6">
                {loading && (
                    <>
                        {[1, 2, 3, 4].map(n => <SkeletonCard key={n} />)}
                    </>
                )}

                {!loading && error && (
                    <div className="col-span-full flex flex-col items-center justify-center py-24 px-8 text-center gap-4 text-ink-400" role="alert">
                        <AlertCircle size={48} strokeWidth={1.2} className="opacity-50" aria-hidden="true" />
                        <p className="font-display text-[clamp(1.5rem,1.3rem+1vw,2rem)] font-medium text-ink-800 tracking-[0.01em]">
                            Collection Unavailable
                        </p>
                        <p className="text-[length:clamp(0.8125rem,0.78rem+0.16vw,0.875rem)] tracking-[0.03em] leading-[1.8] max-w-[300px] text-ink-400">
                            We couldn't load the collection right now. Please check your connection and try again.
                        </p>
                        <button
                            className="mt-2 py-[10px] px-7 border border-ink-800 font-mono text-[length:clamp(0.6875rem,0.65rem+0.19vw,0.75rem)] tracking-[0.14em] uppercase bg-transparent text-ink-800 rounded-[2px] transition-all duration-[220ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-ink-900 hover:text-white active:scale-[0.96]"
                            onClick={loadProducts}
                            aria-label="Retry loading products"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {!loading && !error && products.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-24 px-8 text-center gap-4 text-ink-400">
                        <Heart size={48} strokeWidth={1.2} className="opacity-50" aria-hidden="true" />
                        <p className="font-display text-[clamp(1.5rem,1.3rem+1vw,2rem)] font-medium text-ink-800 tracking-[0.01em]">
                            New Arrivals Coming Soon
                        </p>
                        <p className="text-[length:clamp(0.8125rem,0.78rem+0.16vw,0.875rem)] tracking-[0.03em] leading-[1.8] max-w-[300px] text-ink-400">
                            Our next curated drop is being prepared. Check back shortly.
                        </p>
                    </div>
                )}

                {!loading && !error && products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}
