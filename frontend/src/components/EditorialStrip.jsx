import { motion } from 'framer-motion';
import { EDITORIAL_HIGHLIGHTS } from '@/constants';

export default function EditorialStrip() {
    // - Constants se highlights utha kar 4 dafa repeat kar rahe hain 
    // - Taake endless scrolling (marquee) properly aur smooth kaam kare
    const marqueeItems = [
        ...EDITORIAL_HIGHLIGHTS, 
        ...EDITORIAL_HIGHLIGHTS, 
        ...EDITORIAL_HIGHLIGHTS, 
        ...EDITORIAL_HIGHLIGHTS
    ];

    return (
        <section
            style={{
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: '#1C1A17',
                borderTop: '1px solid #2D2A26',
                borderBottom: '1px solid #2D2A26',
                paddingTop: '18px',
                paddingBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                boxSizing: 'border-box'
            }}
            aria-label="Store highlights"
        >
            {/* - Left side ka dhundla (fade) effect taake text smoothly enter ho */}
            <div style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                width: '120px',
                background: 'linear-gradient(to right, #1C1A17, transparent)',
                zIndex: 10,
                pointerEvents: 'none'
            }} />
            
            {/* - Right side ka dhundla (fade) effect taake text smoothly gayab ho */}
            <div style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                width: '120px',
                background: 'linear-gradient(to left, #1C1A17, transparent)',
                zIndex: 10,
                pointerEvents: 'none'
            }} />

            {/* - Asli scrolling track jo Framer Motion se left ki taraf move karta hai */}
            <motion.div 
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4rem',
                    whiteSpace: 'nowrap',
                    willChange: 'transform'
                }}
                animate={{ x: [0, "-50%"] }}
                transition={{
                    ease: "linear",
                    duration: 25,
                    repeat: Infinity,
                }}
            >
                {marqueeItems.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4rem', flexShrink: 0 }}>
                        <span style={{
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                            fontSize: '11px',
                            fontWeight: 500,
                            letterSpacing: '0.22em',
                            textTransform: 'uppercase',
                            color: '#E0DCD5',
                            cursor: 'default',
                            userSelect: 'none'
                        }}>
                            {item}
                        </span>
                        
                        {/* - Har text ke baad ek golden star (✦) separator ke tor par */}
                        <span style={{ color: '#C5A059', fontSize: '10px', opacity: 0.8, userSelect: 'none' }}>
                            ✦
                        </span>
                    </div>
                ))}
            </motion.div>
        </section>
    );
}