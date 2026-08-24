import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

// - Background images ki list jo hero section mein automatically slide hongi
// Optimized URLs with proper focal crop parameters so images don't over-zoom
const images = [
    "https://images.pexels.com/photos/32097932/pexels-photo-32097932.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1920&h=1080",
    "https://images.pexels.com/photos/38697214/pexels-photo-38697214.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1920&h=1080",
    "https://images.pexels.com/photos/4278988/pexels-photo-4278988.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1920&h=1080",
    "https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1920&h=1080",
    "https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1920&h=1080"
];

export default function Hero() {
    // - Current image aur backend se aane wale products ka count track karne ki states
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [productCount, setProductCount] = useState(0);

    // - Backend se live products fetch karke unki tadad (count) nikalta hai
    useEffect(() => {
        fetch("http://127.0.0.1:5000/api/products")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setProductCount(data.length);
                } else if (data.products && Array.isArray(data.products)) {
                    setProductCount(data.products.length);
                }
            })
            .catch(() => {
                // Agar error aaye ya server band ho toh default 2 dikhayega
                setProductCount(2);
            });
    }, []);

    // - Har 5.5 seconds ke baad image khud-ba-khud change karne ka timer
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 5500);

        return () => clearInterval(timer);
    }, []);

    // - Framer Motion ke liye custom easing aur smooth animations ki setting
    const easeCustom = [0.25, 1, 0.5, 1];
    const easeSmooth = [0.76, 0, 0.24, 1];

    const staggerContainer = {
        animate: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
    };

    const textReveal = {
        initial: { y: "120%", opacity: 0, rotate: 2 },
        animate: { y: "0%", opacity: 1, rotate: 0, transition: { duration: 1.1, ease: easeSmooth } }
    };

    return (
        <section id="hero" className="relative w-full h-screen min-h-[680px] overflow-hidden flex items-center bg-[#1C1A17]">
            
            {/* - BACKGROUND SLIDER (Fade transition ke sath) */}
            <div className="absolute inset-0 z-0 overflow-hidden bg-[#1C1A17]">
                <AnimatePresence mode="popLayout">
                    <motion.img
                        key={currentImageIndex}
                        src={images[currentImageIndex]}
                        alt="Rimberio Curated Accents"
                        initial={{ opacity: 0, scale: 1.02 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, transition: { duration: 1.2 } }}
                        transition={{ duration: 1.4, ease: easeSmooth }}
                        className="absolute inset-0 w-full h-full object-cover object-top sm:object-center"
                        style={{ filter: "brightness(0.78) contrast(0.98)" }}
                    />
                </AnimatePresence>

                {/* - Upar likha text clear dikhane ke liye shadows/gradients */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50 z-10 pointer-events-none" />
            </div>

            {/* - MAIN CONTENT AREA (Left side Text aur Right side Glass Card) */}
            <div className="relative z-20 mx-auto w-full max-w-[1500px] px-6 sm:px-10 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-20">
                
                {/* - LEFT SIDE (Main Heading aur Text) */}
                <div 
                    className="lg:col-span-7 flex flex-col justify-center items-start text-white"
                    style={{ paddingLeft: 'clamp(10px, 3vw, 50px)' }}
                >
                    <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: easeCustom }}
                        className="uppercase tracking-[6px] sm:tracking-[7px] text-[11px] sm:text-[12px] font-mono text-[#E2C48C]"
                    >
                        Curated for Modern Spaces
                    </motion.span>

                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: easeCustom }}
                        className="w-16 h-px bg-[#E2C48C] mt-4 mb-6 origin-left"
                    />

                    <motion.h1
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                        className="text-[clamp(38px,4.5vw,70px)] leading-[1.05] tracking-[-0.03em] font-[300] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                        <span className="block overflow-hidden pb-1"><motion.span variants={textReveal} className="block">Where thoughtful</motion.span></span>
                        <span className="block overflow-hidden pb-1"><motion.span variants={textReveal} className="block">design meets</motion.span></span>
                        <span className="block overflow-hidden pb-1"><motion.span variants={textReveal} className="block">everyday living.</motion.span></span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8, ease: easeCustom }}
                        className="max-w-[460px] mt-5 text-[15px] sm:text-[16px] leading-[1.7] text-white/90 font-light drop-shadow-[0_1px_5px_rgba(0,0,0,0.3)]"
                    >
                        Timeless décor, carefully curated to bring beauty, warmth and intention into every corner of your home.
                    </motion.p>

                    {/* - Explore Collection Button */}
                    <motion.a
                        href="#catalog"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1, ease: easeCustom }}
                        whileHover="hover"
                        className="group inline-flex items-center gap-4 mt-8 sm:mt-10 bg-transparent text-white uppercase tracking-[4px] text-[12px] font-mono transition-all duration-500 cursor-pointer"
                    >
                        <span className="relative overflow-hidden">
                            Explore Collection
                            <span className="absolute left-0 bottom-0 w-full h-[1px] bg-white origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
                        </span>
                        
                        <span className="w-10 h-px bg-white transition-all duration-500 group-hover:w-14 group-hover:bg-[#E2C48C]" />
                        
                        <motion.div variants={{ hover: { x: 5 } }} transition={{ duration: 0.3, ease: easeCustom }}>
                            <ArrowRight size={16} strokeWidth={1.6} className="transition-colors duration-500 group-hover:text-[#E2C48C]" />
                        </motion.div>
                    </motion.a>
                </div>

            </div>

            {/* - RIGHT SIDE GLASS CARD (Products count aur Rating dikhane ke liye) */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5, ease: easeCustom }}
                style={{
                    position: 'absolute',
                    right: '40px',
                    bottom: '40px',
                    zIndex: 30,
                    backgroundColor: 'rgba(28, 26, 23, 0.45)',
                    backdropFilter: 'blur(28px)',
                    WebkitBackdropFilter: 'blur(28px)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: '24px',
                    padding: '28px 30px',
                    width: '340px',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
                    color: '#ffffff',
                    boxSizing: 'border-box'
                }}
            >
                <div style={{ marginBottom: '16px' }}>
                    <span style={{ 
                        display: 'block', 
                        textTransform: 'uppercase', 
                        letterSpacing: '2.5px', 
                        fontSize: '10px', 
                        fontFamily: 'monospace', 
                        color: '#E2C48C', 
                        lineHeight: '1',
                        marginBottom: '6px'
                    }}>
                        EST. 2026
                    </span>
                    <h3 style={{ 
                        fontSize: '24px', 
                        lineHeight: '1.1', 
                        fontWeight: 300, 
                        letterSpacing: '0.5px', 
                        margin: 0, 
                        color: '#ffffff',
                        fontFamily: "'Cormorant Garamond', serif" 
                    }}>
                        Curated Accents
                    </h3>
                </div>

                <div style={{ 
                    paddingTop: '16px', 
                    borderTop: '1px solid rgba(255,255,255,0.25)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between' 
                }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '22px', fontWeight: 300, lineHeight: '1', color: '#ffffff' }}>
                            {productCount > 0 ? `${productCount}+` : "0+"}
                        </div>
                        <p style={{ 
                            fontSize: '9px', 
                            textTransform: 'uppercase', 
                            letterSpacing: '1.5px', 
                            color: 'rgba(255,255,255,0.85)', 
                            marginTop: '6px', 
                            marginBottom: 0,
                            whiteSpace: 'nowrap',
                            lineHeight: '1'
                        }}>
                            Items Live
                        </p>
                    </div>

                    <div style={{ width: '1px', height: '28px', backgroundColor: 'rgba(255,255,255,0.3)', margin: '0 16px' }} />

                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '22px', fontWeight: 300, lineHeight: '1', color: '#ffffff' }}>
                            4.9★
                        </div>
                        <p style={{ 
                            fontSize: '9px', 
                            textTransform: 'uppercase', 
                            letterSpacing: '1.5px', 
                            color: 'rgba(255,255,255,0.85)', 
                            marginTop: '6px', 
                            marginBottom: 0,
                            whiteSpace: 'nowrap',
                            lineHeight: '1'
                        }}>
                            Rating
                        </p>
                    </div>
                </div>

                {/* - PAGINATION DOTS (Images change karne ke indicators) */}
                <div style={{ marginTop: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    {images.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            style={{
                                height: '6px',
                                borderRadius: '9999px',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.5s ease',
                                width: currentImageIndex === idx ? '24px' : '8px',
                                backgroundColor: currentImageIndex === idx ? '#E2C48C' : 'rgba(255,255,255,0.4)'
                            }}
                        />
                    ))}
                </div>
            </motion.div>

        </section>
    );
}