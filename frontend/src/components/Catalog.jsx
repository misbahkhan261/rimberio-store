import { useCallback, useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Sparkles, RefreshCw } from 'lucide-react';
import { fetchProducts } from '@/services/api';
import ProductCard from './ProductCard';
import SkeletonCard from './SkeletonCard';

export default function Catalog() {
    // - Products, loading, error aur category filter ki states
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [activeCategory, setActiveCategory] = useState('all');

    // - Backend se products ka data fetch karne ka function
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

    // - Component mount hote hi products load karega
    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    // - Filter karne ke liye categories ki static list
    const categories = [
        { id: 'all', label: 'All Collection' },
        { id: 'lamps', label: 'Lamps & Lighting' },
        { id: 'vases', label: 'Vases & Pottery' },
        { id: 'art', label: 'Wall Art & Frames' },
    ];

    // - Client-side Filtering logic: Active category ke hisaab se array filter karta hai
    const filteredProducts = useMemo(() => {
        if (activeCategory === 'all') return products;
        return products.filter(product => {
            const cat = (product.category || product.tag || '').toLowerCase();
            const title = product.name?.toLowerCase() || product.title?.toLowerCase() || '';
            
            if (activeCategory === 'lamps') return cat.includes('lamp') || cat.includes('light') || title.includes('lamp');
            if (activeCategory === 'vases') return cat.includes('vase') || cat.includes('pot') || title.includes('vase');
            if (activeCategory === 'art') return cat.includes('art') || cat.includes('frame') || cat.includes('paint') || cat.includes('shelf') || title.includes('frame') || title.includes('shelf') || title.includes('wall');
            return true;
        });
    }, [products, activeCategory]);

    return (
        <section
            id="catalog"
            style={{
                backgroundColor: '#FAF8F5',
                paddingTop: '90px',
                paddingBottom: '90px',
                paddingLeft: '24px',
                paddingRight: '24px',
                width: '100%',
                boxSizing: 'border-box'
            }}
            aria-labelledby="catalog-heading"
        >
            <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
                
                {/* - Catalog ka main header aur text description */}
                <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 52px auto' }}>
                    <span style={{ 
                        display: 'block', 
                        marginBottom: '12px', 
                        fontSize: '11px', 
                        letterSpacing: '0.28em', 
                        textTransform: 'uppercase', 
                        color: '#B58E4A', 
                        fontFamily: "system-ui, -apple-system, sans-serif",
                        fontWeight: 600
                    }}>
                        CURATED COLLECTION
                    </span>
                    
                    <h2 
                        id="catalog-heading" 
                        style={{ 
                            fontSize: 'clamp(2.4rem, 4.2vw, 4rem)', 
                            fontWeight: 300, 
                            lineHeight: 1.05, 
                            letterSpacing: '-0.02em', 
                            marginBottom: '16px', 
                            color: '#1C1A17',
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                            margin: '0 0 16px 0'
                        }}
                    >
                        Archive Drop 001
                    </h2>

                    <p style={{ 
                        maxWidth: '540px', 
                        margin: '0 auto', 
                        fontSize: '15px', 
                        lineHeight: '1.75', 
                        color: '#65625C', 
                        fontWeight: 300,
                        fontFamily: "system-ui, -apple-system, sans-serif"
                    }}>
                        Thoughtfully selected décor designed to elevate everyday living with timeless elegance and warmth.
                    </p>

                    {/* - Category filter buttons (Jab data load ho jaye tab show honge) */}
                    {!loading && !error && products.length > 0 && (
                        <div style={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            gap: '10px', 
                            marginTop: '36px' 
                        }}>
                            {categories.map((category) => {
                                const isActive = activeCategory === category.id;
                                return (
                                    <button
                                        key={category.id}
                                        onClick={() => setActiveCategory(category.id)}
                                        style={{
                                            padding: '10px 24px',
                                            borderRadius: '9999px',
                                            fontSize: '11px',
                                            fontFamily: "system-ui, -apple-system, sans-serif",
                                            fontWeight: isActive ? 600 : 500,
                                            letterSpacing: '0.12em',
                                            textTransform: 'uppercase',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                            border: isActive ? '1px solid #1C1A17' : '1px solid #E2DDD5',
                                            backgroundColor: isActive ? '#1C1A17' : '#ffffff',
                                            color: isActive ? '#ffffff' : '#65625C',
                                            boxShadow: isActive ? '0 4px 16px rgba(0,0,0,0.12)' : 'none',
                                            outline: 'none'
                                        }}
                                    >
                                        {category.label}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* - Products render karne ka Grid Area */}
                <div style={{ width: '100%', minHeight: '350px' }}>
                    
                    {/* - Jab data load ho raha ho toh Skeleton cards dikhayega */}
                    {loading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
                            {[1, 2, 3, 4].map(n => (
                                <SkeletonCard key={n} />
                            ))}
                        </div>
                    )}

                    {/* - Agar API ya internet ka masla ho jaye toh Error UI */}
                    {!loading && error && (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '60px 24px',
                            textAlign: 'center',
                            backgroundColor: 'rgba(255,255,255,0.7)',
                            border: '1px solid #EBE7E0',
                            borderRadius: '20px',
                            maxWidth: '480px',
                            margin: '0 auto'
                        }}>
                            <AlertCircle size={40} strokeWidth={1.3} color="#B58E4A" style={{ marginBottom: '12px' }} />
                            <h3 style={{ fontSize: '22px', fontWeight: 300, color: '#1C1A17', fontFamily: "'Cormorant Garamond', serif", margin: '0 0 8px 0' }}>
                                Collection Unavailable
                            </h3>
                            <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#7A766F', maxWidth: '300px', margin: '0 0 20px 0', fontFamily: 'system-ui' }}>
                                We couldn't load the collection right now. Please check your connection and try again.
                            </p>
                            <button
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '10px 28px',
                                    backgroundColor: '#1C1A17',
                                    color: '#ffffff',
                                    fontFamily: 'system-ui',
                                    fontSize: '11px',
                                    letterSpacing: '0.14em',
                                    textTransform: 'uppercase',
                                    borderRadius: '9999px',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                                onClick={loadProducts}
                            >
                                <RefreshCw size={13} /> Try Again
                            </button>
                        </div>
                    )}

                    {/* - Agar filter karne ke baad koi product na mile toh Empty State UI */}
                    {!loading && !error && filteredProducts.length === 0 && (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '60px 24px',
                            textAlign: 'center',
                            backgroundColor: 'rgba(255,255,255,0.7)',
                            border: '1px solid #EBE7E0',
                            borderRadius: '20px',
                            maxWidth: '480px',
                            margin: '0 auto'
                        }}>
                            <Sparkles size={40} strokeWidth={1.3} color="#B58E4A" style={{ marginBottom: '12px' }} />
                            <h3 style={{ fontSize: '22px', fontWeight: 300, color: '#1C1A17', fontFamily: "'Cormorant Garamond', serif", margin: '0 0 8px 0' }}>
                                New Arrivals Coming Soon
                            </h3>
                            <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#7A766F', maxWidth: '300px', margin: 0, fontFamily: 'system-ui' }}>
                                {activeCategory !== 'all' 
                                    ? `No items found in this category right now.` 
                                    : `Our next curated drop is being prepared. Check back shortly.`}
                            </p>
                            {activeCategory !== 'all' && (
                                <button
                                    onClick={() => setActiveCategory('all')}
                                    style={{
                                        marginTop: '16px',
                                        fontSize: '11px',
                                        fontFamily: 'system-ui',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.12em',
                                        color: '#B58E4A',
                                        background: 'none',
                                        border: 'none',
                                        textDecoration: 'underline',
                                        cursor: 'pointer'
                                    }}
                                >
                                    View All Products
                                </button>
                            )}
                        </div>
                    )}

                    {/* - Data load hone ke baad Products ko render karta hai */}
                    {!loading && !error && filteredProducts.length > 0 && (
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: '36px',
                            width: '100%'
                        }}>
                            {/* - Framer Motion array list ko smoothly animate karne ke liye */}
                            <AnimatePresence mode="popLayout">
                                {filteredProducts.map(product => (
                                    <motion.div
                                        key={product.id}
                                        layout
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.4 }}
                                        style={{ width: '100%', maxWidth: '330px' }}
                                    >
                                        <ProductCard product={product} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
}