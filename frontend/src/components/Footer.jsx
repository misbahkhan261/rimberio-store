import { BRAND_NAME } from '@/constants';

export default function Footer() {
    return (
        <footer
            style={{
                backgroundColor: '#FAF8F5',
                borderTop: '1px solid #EBE7E0',
                paddingTop: '28px',
                paddingBottom: '28px',
                paddingLeft: '24px',
                paddingRight: '24px',
                width: '100%',
                boxSizing: 'border-box'
            }}
            role="contentinfo"
        >
            {/* - Content ko center aur align karne ke liye main wrapper */}
            <div 
                style={{
                    maxWidth: '1100px', // SupportSection ke container ke sath exact alignment ke liye
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    flexWrap: 'wrap',
                    width: '100%'
                }}
            >
                {/* - Left side par Brand ka Logo / Naam */}
                <span style={{ 
                    fontFamily: "'Cormorant Garamond', Georgia, serif", 
                    fontSize: '18px', 
                    fontWeight: 600, 
                    letterSpacing: '0.24em', 
                    color: '#1C1A17',
                    textTransform: 'uppercase'
                }}>
                    {BRAND_NAME}
                </span>

                {/* - Right side par Copyright notice */}
                {/* - 'new Date().getFullYear()' lagane se saal (year) automatically update hota rahega */}
                <p style={{ 
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    fontSize: '11px', 
                    letterSpacing: '0.06em', 
                    color: '#8C8881',
                    margin: 0,
                    fontWeight: 400
                }}>
                    © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
                </p>
            </div>
        </footer>
    );
}