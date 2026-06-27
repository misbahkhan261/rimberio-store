import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export default function Hero() {
    return (
        <section className="min-h-[calc(100dvh-170px)] flex flex-col justify-center items-center text-center py-12 px-[clamp(1.25rem,4vw,3rem)] max-[520px]:landscape:min-h-auto max-[520px]:landscape:py-12">
            <motion.div
                className="max-w-[980px] mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                <span className="font-mono tracking-[6px] text-[length:clamp(0.6875rem,0.65rem+0.19vw,0.75rem)] text-gold uppercase">
                    CURATED FOR MODERN SPACES
                </span>

                <div className="w-[60px] h-px bg-gold mx-auto my-[18px]" />

                <h1 className="max-w-[850px] font-display text-[clamp(2.5rem,7vw,6.875rem)] leading-[0.92] tracking-[-0.03em] text-ink-900 mx-auto">
                    Where thoughtful design<br />
                    meets everyday living.
                </h1>

                <div className="text-gold-soft my-[35px_0_18px] text-xl" aria-hidden="true">✧</div>

                <p className="max-w-[560px] mx-auto mt-[30px] text-[clamp(1rem,2.5vw,1.375rem)] leading-[1.8] text-ink-600">
                    Discover timeless décor chosen<br />
                    to make every corner feel complete.
                </p>
            </motion.div>

            <motion.div
                className="mt-10"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
            >
                <a href="#catalog" tabIndex={-1} aria-label="Scroll to collection">
                    <ArrowDown size={20} strokeWidth={1.6} className="text-ink-400" />
                </a>
            </motion.div>
        </section>
    );
}
