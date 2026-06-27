import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { FAQS } from '@/constants';

export default function FaqSection() {
    const [openFaq, setOpenFaq] = useState(0);

    return (
        <section
            id="faqs"
            className="bg-cream py-16 px-[clamp(1.25rem,4vw,3rem)] max-w-[760px] mx-auto"
            style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 500px' }}
            aria-labelledby="faqs-heading"
        >
            <div className="mb-10">
                <p className="font-mono text-[length:clamp(0.6875rem,0.65rem+0.19vw,0.75rem)] tracking-[0.35em] uppercase text-gold mb-3">
                    Before You Order
                </p>
                <h2 id="faqs-heading" className="font-display text-[clamp(2.25rem,5vw,4.5rem)] font-medium leading-[0.95] tracking-[-0.03em] text-ink-900">
                    Questions &amp; Answers
                </h2>
            </div>

            <div className="flex flex-col" role="list">
                {FAQS.map((faq, index) => {
                    const faqIndex = index + 1;
                    const isOpen = openFaq === faqIndex;

                    return (
                        <div
                            key={faqIndex}
                            className={`border-b border-ink-100 ${index === 0 ? 'border-t border-ink-100' : ''}`}
                            role="listitem"
                        >
                            <button
                                className="w-full flex items-center justify-between gap-4 py-5 font-display text-[clamp(1.25rem,1.1rem+0.75vw,1.5rem)] font-medium text-ink-800 tracking-[0.01em] text-left transition-colors duration-[220ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-ink-900"
                                onClick={() => setOpenFaq(isOpen ? 0 : faqIndex)}
                                aria-expanded={isOpen}
                                aria-controls={`faq-body-${faqIndex}`}
                            >
                                <span>{faq.question}</span>
                                <span
                                    className={`shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-[380ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                                        isOpen
                                            ? 'rotate-180 bg-ink-900 border-ink-900 text-white'
                                            : 'rotate-0 border-ink-200 text-ink-400'
                                    }`}
                                    aria-hidden="true"
                                >
                                    <ChevronDown size={14} strokeWidth={2.5} />
                                </span>
                            </button>
                            <AnimatePresence>
                                {isOpen && (
                                    <motion.div
                                        id={`faq-body-${faqIndex}`}
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pb-5 text-[clamp(0.9375rem,0.9rem+0.19vw,1rem)] text-ink-500 leading-[1.75] tracking-[0.01em]">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
