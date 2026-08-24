import { motion } from 'framer-motion';
import { TICKER_ITEMS } from '@/constants';

// - Constants se items utha kar 4 dafa repeat kiye hain 
// - Taake seamless (bina jhatke ke) infinite loop ban sake
const items = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];

export default function TickerStrip() {
    return (
        <div
            className="no-print bg-[#15110f] text-white h-10 overflow-hidden flex items-center whitespace-nowrap relative z-[1000]"
            role="marquee"
            aria-label="Store announcements"
        >
            {/* - Left aur right side par fade gradients taake text smoothly enter/exit ho */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#15110f] to-transparent z-[2] pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#15110f] to-transparent z-[2] pointer-events-none" />

            {/* - Framer Motion ka infinite scroll */}
            {/* - x: [0, "-50%"] isliye kiya hai kyunke items 4 dafa hain, half tak scroll hone ke baad loop wapis reset ho jayega bina kisi ko pata chale */}
            <motion.div
                className="flex items-center whitespace-nowrap will-change-transform"
                animate={{ x: [0, "-50%"] }}
                transition={{
                    ease: "linear",
                    duration: 25,
                    repeat: Infinity,
                }}
            >
                {items.map((item, i) => (
                    <span
                        key={i}
                        className="inline-flex items-center gap-3 px-8 font-mono text-[11px] tracking-[0.18em] uppercase text-white/80 leading-10 select-none shrink-0"
                    >
                        {/* - Har item ke shuru mein ek golden diamond (◆) separator */}
                        <span className="text-[#C6A15B] text-[9px] opacity-80">◆</span>
                        <span>{item}</span>
                    </span>
                ))}
            </motion.div>
        </div>
    );
}