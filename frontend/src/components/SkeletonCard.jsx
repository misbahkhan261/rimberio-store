export default function SkeletonCard() {
    // - Yeh component tab render hota hai jab backend se products load ho rahe hon (Loading state)
    // - Isse user ko blank screen ke bajaye ek structure (skeleton) nazar aata hai
    return (
        <div className="bg-cream-mid border border-ink-100 rounded-sm overflow-hidden" aria-hidden="true">
            
            {/* - Product Image ka placeholder hissa */}
            <div className="h-[clamp(220px,28vw,340px)] bg-cream-mid relative overflow-hidden">
                {/* - Shimmer effect (Chamakne wali animation) jo loading ka ehsaas dilati hai */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" style={{ animation: 'shimmer 1.5s infinite linear' }} />
            </div>

            {/* - Product Details (Text) ka placeholder area */}
            <div className="p-4">
                
                {/* - Category / Tag ka chhota loading bar */}
                <div className="h-[11px] w-[48%] bg-ink-100 rounded-[2px] mb-2 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" style={{ animation: 'shimmer 1.5s infinite linear' }} />
                </div>

                {/* - Product Title / Name ka lamba loading bar */}
                <div className="h-[11px] bg-ink-100 rounded-[2px] mb-2 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" style={{ animation: 'shimmer 1.5s infinite linear' }} />
                </div>

                {/* - Price aur Button ki jagah aane wala thora mota loading bar */}
                <div className="h-[18px] w-[32%] bg-ink-100 rounded-[2px] mt-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" style={{ animation: 'shimmer 1.5s infinite linear' }} />
                </div>
            </div>
            
        </div>
    );
}