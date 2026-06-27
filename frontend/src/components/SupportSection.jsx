import { ExternalLink } from 'lucide-react';
import { SUPPORT_CHANNELS } from '@/constants';

export default function SupportSection() {
    return (
        <section
            id="support"
            className="py-[3.5rem_clamp(1.25rem,4vw,3rem)_4rem] bg-cream-mid border-t border-b border-ink-100"
            style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 300px', padding: 'clamp(3rem,5vw,3.5rem) clamp(1.25rem,4vw,3rem) 4rem' }}
            aria-labelledby="support-heading"
        >
            <div className="max-w-[1320px] mx-auto grid grid-cols-2 gap-10 items-center max-[768px]:grid-cols-1 max-[768px]:gap-6">
                <div>
                    <p className="font-mono text-[length:clamp(0.6875rem,0.65rem+0.19vw,0.75rem)] tracking-[0.35em] uppercase text-gold mb-3">
                        We're here
                    </p>
                    <h2 id="support-heading" className="font-display text-[clamp(2rem,1.6rem+2vw,3rem)] font-normal text-ink-900 tracking-[-0.01em] leading-[1.1] mb-3">
                        Get in Touch
                    </h2>
                    <p className="text-[length:clamp(0.8125rem,0.78rem+0.16vw,0.875rem)] text-ink-500 leading-[1.72]">
                        Questions about an order, a product, or just want to say hello — reach out anytime.
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    {SUPPORT_CHANNELS.map((channel) => (
                        <a
                            key={channel.type}
                            href={channel.href}
                            {...(channel.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                            className={`flex items-center gap-3 py-4 px-5 rounded-lg transition-all duration-[120ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] max-w-[380px] hover:translate-x-1 hover:shadow-lg max-[768px]:max-w-full ${
                                channel.variant === 'dark'
                                    ? 'bg-ink-900 text-white'
                                    : 'bg-white text-ink-800 border border-ink-100'
                            }`}
                            aria-label={
                                channel.external
                                    ? `${channel.label} — ${channel.value} (opens in new tab)`
                                    : `${channel.label} — ${channel.value}`
                            }
                        >
                            <div>
                                <span className="font-mono text-[9px] tracking-[0.14em] uppercase opacity-65 block leading-none">
                                    {channel.label}
                                </span>
                                <span className="text-[length:clamp(0.8125rem,0.78rem+0.16vw,0.875rem)] font-medium tracking-[0.02em] block mt-[2px]">
                                    {channel.value}
                                </span>
                            </div>
                            <ExternalLink size={14} strokeWidth={1.8} className="ml-auto shrink-0 opacity-40" aria-hidden="true" />
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
