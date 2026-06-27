import { ShoppingBag } from 'lucide-react';
import { BRAND_NAME, NAV_LINKS } from '@/constants';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
    const { cartCount, openDrawer } = useCart();

    return (
        <header className="sticky top-[clamp(12px,2vw,20px)] z-[1100] self-center">
            <div className="max-w-[1320px] w-[calc(100%-clamp(24px,6vw,80px))] h-[clamp(64px,5.5vw,82px)] my-[clamp(12px,2vw,20px)] mx-auto py-0 px-[clamp(16px,3vw,40px)] flex items-center justify-between bg-white/82 backdrop-blur-[18px] rounded-full shadow-sm transition-all duration-[220ms] ease-[cubic-bezier(0.16,1,0.3,1)] max-[768px]:w-[calc(100%-24px)] max-[768px]:px-4 max-[768px]:h-16 max-[768px]:my-3">
                <a
                    href="#"
                    className="font-display text-[clamp(1.8rem,4.2vw,2.6rem)] tracking-[clamp(4px,0.8vw,7px)] whitespace-nowrap shrink-0 text-ink-900 max-[768px]:text-[1.8rem] max-[768px]:tracking-[4px]"
                    onClick={(e) => {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    aria-label="Rimberio — return to top"
                >
                    {BRAND_NAME}
                </a>

                <nav className="flex items-center justify-center flex-1 gap-[clamp(20px,4vw,55px)]" role="navigation" aria-label="Primary navigation">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="font-mono no-underline text-ink-600 uppercase tracking-[clamp(2px,0.4vw,4px)] text-[clamp(11px,1.1vw,14px)] relative transition-colors duration-[220ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-ink-900 after:content-[''] after:absolute after:left-0 after:bottom-[-6px] after:w-full after:h-px after:bg-ink-900 after:scale-x-0 after:origin-left after:transition-transform after:duration-[220ms] after:ease-[cubic-bezier(0.16,1,0.3,1)] hover:after:scale-x-100 max-[768px]:text-[11px] max-[768px]:tracking-[2px]"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                <button
                    className="flex items-center justify-center w-[clamp(42px,3.5vw,46px)] h-[clamp(42px,3.5vw,46px)] min-w-11 min-h-11 shrink-0 text-ink-900 transition-transform duration-[120ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-90 relative"
                    onClick={openDrawer}
                    aria-label="Open shopping bag"
                    aria-haspopup="dialog"
                >
                    <ShoppingBag size={18} strokeWidth={1.7} aria-hidden="true" />
                    {cartCount > 0 && (
                        <span
                            className="absolute -top-1 -right-1 bg-ink-900 text-white text-[10px] font-mono font-medium min-w-5 h-5 flex items-center justify-center rounded-full leading-none"
                            aria-live="polite"
                            aria-atomic="true"
                            aria-label={`${cartCount} items in bag`}
                        >
                            {cartCount}
                        </span>
                    )}
                </button>
            </div>
        </header>
    );
}
