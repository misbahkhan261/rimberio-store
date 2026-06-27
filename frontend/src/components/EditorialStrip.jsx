import { EDITORIAL_HIGHLIGHTS } from '@/constants';

export default function EditorialStrip() {
    return (
        <section
            className="bg-ink-900 py-5 px-[clamp(1.25rem,4vw,3rem)]"
            style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 60px' }}
            aria-label="Store highlights"
        >
            <div className="max-w-[1320px] mx-auto flex items-center justify-center flex-wrap gap-4 max-[640px]:gap-3">
                {EDITORIAL_HIGHLIGHTS.map((item, i) => (
                    <div key={i} className="contents">
                        <span className="font-mono text-[length:clamp(0.6875rem,0.65rem+0.19vw,0.75rem)] tracking-[0.14em] uppercase text-white/80 transition-colors duration-[220ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-white whitespace-nowrap">
                            {item}
                        </span>
                        {i < EDITORIAL_HIGHLIGHTS.length - 1 && (
                            <div className="w-1 h-1 rounded-full bg-gold opacity-50 shrink-0 max-[640px]:hidden" aria-hidden="true" />
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
