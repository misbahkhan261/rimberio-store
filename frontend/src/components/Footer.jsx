import { BRAND_NAME } from '@/constants';

export default function Footer() {
    return (
        <footer
            className="py-8 px-[clamp(1.25rem,4vw,3rem)] bg-cream border-t border-ink-100"
            style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 150px' }}
            role="contentinfo"
        >
            <div className="max-w-[1320px] mx-auto flex items-center justify-between gap-4 flex-wrap">
                <span className="font-display text-[clamp(1.0625rem,1rem+0.31vw,1.125rem)] font-semibold tracking-[0.22em] text-ink-800 uppercase">
                    {BRAND_NAME}
                </span>
                <p className="text-[length:clamp(0.6875rem,0.65rem+0.19vw,0.75rem)] tracking-[0.06em] text-ink-500">
                    © {new Date().getFullYear()} Rimberio. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
