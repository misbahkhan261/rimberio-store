import { TICKER_ITEMS } from '@/constants';

const items = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];

export default function TickerStrip() {
    return (
        <div
            className="no-print bg-[#15110f] text-white h-10 overflow-hidden flex items-center whitespace-nowrap relative z-[1000]"
            role="marquee"
            aria-label="Store announcements"
        >
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#15110f] to-transparent z-[2] pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#15110f] to-transparent z-[2] pointer-events-none" />
            <div
                className="flex whitespace-nowrap hover:[animation-play-state:paused]"
                style={{ animation:'ticker-scroll 24s linear infinite' }}
            >
                {items.map((item, i) => (
                    <span
                        key={i}
                        className="inline-block px-10 font-mono text-[length:clamp(0.6875rem,0.65rem+0.19vw,0.75rem)] tracking-[0.14em] uppercase text-white/80 leading-10 select-none whitespace-nowrap"
                    >
                        ◆ {item}
                    </span>
                ))}
            </div>
        </div>
    );
}
