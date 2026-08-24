import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { FAQS } from '@/constants';

export default function FaqSection() {
    // - Kaunsa FAQ khula hua hai uski state (Default 1 rakha hai taake pehla FAQ pehle se open rahay)
    const [openFaq, setOpenFaq] = useState(1);

    return (
        <section
            id="faqs"
            style={{
                backgroundColor: '#FAF8F5',
                paddingTop: '80px',
                paddingBottom: '90px',
                paddingLeft: '20px',
                paddingRight: '20px',
                width: '100%',
                boxSizing: 'border-box'
            }}
            aria-labelledby="faqs-heading"
        >
            <div style={{ maxWidth: '780px', margin: '0 auto', width: '100%' }}>
                
                {/* - FAQ section ka main header */}
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <span style={{ 
                        display: 'block', 
                        marginBottom: '10px', 
                        fontSize: '11px', 
                        letterSpacing: '0.28em', 
                        textTransform: 'uppercase', 
                        color: '#B58E4A', 
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        fontWeight: 600
                    }}>
                        BEFORE YOU ORDER
                    </span>
                    
                    <h2 
                        id="faqs-heading" 
                        style={{ 
                            fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', 
                            fontWeight: 300, 
                            lineHeight: 1.1, 
                            letterSpacing: '-0.02em', 
                            color: '#1C1A17',
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                            margin: 0
                        }}
                    >
                        Questions &amp; Answers
                    </h2>
                </div>

                {/* - FAQ items ki list (Accordion) jo array se map ho kar render ho rahi hai */}
                <div style={{ display: 'flex', flexDirection: 'column' }} role="list">
                    {FAQS.map((faq, index) => {
                        const faqIndex = index + 1;
                        // - Check karta hai ke current FAQ open hai ya nahi
                        const isOpen = openFaq === faqIndex;

                        return (
                            <div
                                key={faqIndex}
                                style={{
                                    borderBottom: '1px solid #EBE7E0',
                                    borderTop: index === 0 ? '1px solid #EBE7E0' : 'none',
                                    transition: 'background-color 0.3s ease',
                                }}
                                role="listitem"
                            >
                                <button
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: '16px',
                                        paddingTop: '22px',
                                        paddingBottom: '22px',
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        outline: 'none',
                                        cursor: 'pointer',
                                        textAlign: 'left'
                                    }}
                                    // - Click karne par agar open hai toh close kar dega (0), warna isko open (faqIndex) kar dega
                                    onClick={() => setOpenFaq(isOpen ? 0 : faqIndex)}
                                    aria-expanded={isOpen}
                                    aria-controls={`faq-body-${faqIndex}`}
                                >
                                    <span style={{
                                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                                        fontSize: 'clamp(1.2rem, 1.5vw, 1.45rem)',
                                        fontWeight: 500,
                                        color: isOpen ? '#B58E4A' : '#1C1A17',
                                        transition: 'color 0.2s ease'
                                    }}>
                                        {faq.question}
                                    </span>
                                    
                                    <span
                                        style={{
                                            width: '30px',
                                            height: '30px',
                                            borderRadius: '50%',
                                            border: isOpen ? '1px solid #1C1A17' : '1px solid #DED8CE',
                                            backgroundColor: isOpen ? '#1C1A17' : '#ffffff',
                                            color: isOpen ? '#ffffff' : '#65625C',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                            flexShrink: 0
                                        }}
                                        aria-hidden="true"
                                    >
                                        <ChevronDown size={14} strokeWidth={2} />
                                    </span>
                                </button>

                                {/* - Framer Motion se smooth open/close (height change) ki animation */}
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            id={`faq-body-${faqIndex}`}
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                            style={{ overflow: 'hidden' }}
                                        >
                                            <div style={{
                                                paddingBottom: '24px',
                                                fontSize: '14px',
                                                lineHeight: '1.75',
                                                color: '#65625C',
                                                fontFamily: 'system-ui, -apple-system, sans-serif',
                                                fontWeight: 400,
                                                maxWidth: '700px'
                                            }}>
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}