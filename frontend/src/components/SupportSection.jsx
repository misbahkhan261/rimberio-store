import { ArrowUpRight, Mail } from 'lucide-react';
import { SUPPORT_CHANNELS } from '@/constants';

// - Minimalist WhatsApp ka custom SVG icon (Kyunke lucide-react mein default WhatsApp nahi hota)
const WhatsAppIcon = ({ size = 16 }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.8" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
        <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </svg>
);

export default function SupportSection() {
    return (
        <section
            id="support"
            style={{
                backgroundColor: '#FAF8F5',
                borderTop: '1px solid #EBE7E0',
                borderBottom: '1px solid #EBE7E0',
                paddingTop: '70px',
                paddingBottom: '70px',
                paddingLeft: '24px',
                paddingRight: '24px',
                width: '100%',
                boxSizing: 'border-box'
            }}
            aria-labelledby="support-heading"
        >
            <div 
                style={{
                    maxWidth: '1000px',
                    margin: '0 auto',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '40px'
                }}
            >
                {/* - LEFT SIDE: Editorial Content (Heading aur Description) */}
                <div style={{ flex: '1 1 340px', maxWidth: '440px' }}>
                    
                    {/* - Chhoti si line aur upar wala tag */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <span style={{ width: '16px', height: '1px', backgroundColor: '#C6A15B' }}></span>
                        <span style={{ 
                            fontSize: '10px', 
                            letterSpacing: '0.26em', 
                            textTransform: 'uppercase', 
                            color: '#C6A15B', 
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                            fontWeight: 600
                        }}>
                            Concierge Services
                        </span>
                    </div>
                    
                    {/* - Main Heading */}
                    <h2 
                        id="support-heading" 
                        style={{ 
                            fontSize: 'clamp(2.1rem, 3.5vw, 3rem)', 
                            fontWeight: 300, 
                            lineHeight: 1.1, 
                            letterSpacing: '-0.02em', 
                            color: '#1C1A17',
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                            margin: '0 0 14px 0'
                        }}
                    >
                        Get in Touch
                    </h2>

                    {/* - Support Description */}
                    <p style={{ 
                        fontSize: '14px', 
                        lineHeight: '1.7', 
                        color: '#706C65', 
                        fontWeight: 300,
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        margin: 0
                    }}>
                        Have questions regarding custom orders, product details, or shipping? Our dedicated team is available to assist you promptly.
                    </p>
                </div>

                {/* - RIGHT SIDE: Slim & Compact Contact Pills (WhatsApp / Email buttons) */}
                <div style={{ 
                    flex: '1 1 280px', 
                    maxWidth: '340px', 
                    width: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '12px' 
                }}>
                    {/* - Constants file se support channels map ho rahe hain */}
                    {SUPPORT_CHANNELS.map((channel) => {
                        // - Check karta hai ke channel WhatsApp hai ya nahi (icon decide karne ke liye)
                        const isWhatsapp = channel.type?.toLowerCase().includes('whatsapp') || channel.label?.toLowerCase().includes('whatsapp');

                        return (
                            <a
                                key={channel.type}
                                href={channel.href}
                                // - Agar external link hai toh naye tab mein kholne ke liye attributes add karega
                                {...(channel.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '12px 20px',
                                    borderRadius: '50px',
                                    textDecoration: 'none',
                                    backgroundColor: '#1C1A17',
                                    color: '#FFFFFF',
                                    border: '1px solid #1C1A17',
                                    boxShadow: '0 4px 14px rgba(28, 26, 23, 0.06)',
                                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                                }}
                                // - Hover effect ke liye JS event listeners (Kyunke style object mein direct pseudo classes like :hover kaam nahi karti)
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#26231F';
                                    e.currentTarget.style.borderColor = '#C6A15B';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(198, 161, 91, 0.18)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#1C1A17';
                                    e.currentTarget.style.borderColor = '#1C1A17';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(28, 26, 23, 0.06)';
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    {/* - Icon Circle */}
                                    <div style={{ 
                                        color: '#C6A15B', 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        backgroundColor: 'rgba(255, 255, 255, 0.06)',
                                        flexShrink: 0
                                    }}>
                                        {isWhatsapp ? (
                                            <WhatsAppIcon size={16} />
                                        ) : (
                                            <Mail size={15} strokeWidth={1.7} />
                                        )}
                                    </div>

                                    {/* - Contact Details */}
                                    <div>
                                        <span style={{ 
                                            fontFamily: 'system-ui, -apple-system, sans-serif', 
                                            fontSize: '9px', 
                                            letterSpacing: '0.22em', 
                                            textTransform: 'uppercase', 
                                            color: '#C6A15B',
                                            display: 'block',
                                            fontWeight: 600,
                                            marginBottom: '1px'
                                        }}>
                                            {channel.label}
                                        </span>
                                        
                                        <span style={{ 
                                            fontFamily: 'system-ui, -apple-system, sans-serif', 
                                            fontSize: '13px', 
                                            fontWeight: 400, 
                                            color: '#FAF8F5',
                                            letterSpacing: '0.01em',
                                            display: 'block' 
                                        }}>
                                            {channel.value}
                                        </span>
                                    </div>
                                </div>

                                {/* - Arrow Icon Right Side Par */}
                                <div style={{
                                    width: '26px',
                                    height: '26px',
                                    borderRadius: '50%',
                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#FFFFFF',
                                    flexShrink: 0,
                                    marginLeft: '12px'
                                }}>
                                    <ArrowUpRight size={13} strokeWidth={1.6} />
                                </div>
                            </a>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}