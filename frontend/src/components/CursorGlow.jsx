import { useCursorGlow } from '@/hooks/useCursorGlow';

export default function CursorGlow() {
    const glowRef = useCursorGlow();

    return (
        <div
            ref={glowRef}
            className="fixed w-[220px] h-[180px] rounded-full pointer-events-none left-0 top-0 -translate-x-1/2 -translate-y-1/2 z-[9999] hidden [@media(hover:hover)_and_(pointer:fine)]:block"
            style={{
                background: 'radial-gradient(circle, rgba(184,146,74,0.12) 0%, rgba(184,146,74,0.05) 40%, transparent 75%)',
            }}
        />
    );
}
