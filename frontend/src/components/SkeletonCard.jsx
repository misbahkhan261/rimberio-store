export default function SkeletonCard() {
    return (
        <div className="bg-cream-mid border border-ink-100 rounded-sm overflow-hidden" aria-hidden="true">
            <div className="h-[clamp(220px,28vw,340px)] bg-cream-mid relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" style={{ animation: 'shimmer 1.5s infinite linear' }} />
            </div>
            <div className="p-4">
                <div className="h-[11px] w-[48%] bg-ink-100 rounded-[2px] mb-2 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" style={{ animation: 'shimmer 1.5s infinite linear' }} />
                </div>
                <div className="h-[11px] bg-ink-100 rounded-[2px] mb-2 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" style={{ animation: 'shimmer 1.5s infinite linear' }} />
                </div>
                <div className="h-[18px] w-[32%] bg-ink-100 rounded-[2px] mt-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" style={{ animation: 'shimmer 1.5s infinite linear' }} />
                </div>
            </div>
        </div>
    );
}
