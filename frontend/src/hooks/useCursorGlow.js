import { useEffect, useRef } from 'react';

export function useCursorGlow() {
    const glowRef = useRef(null);
    const rafRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const currentRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        if (!isDesktop) return;

        const glow = glowRef.current;
        if (!glow) return;

        const onMouseMove = (e) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;
        };

        window.addEventListener('mousemove', onMouseMove, { passive: true });

        const updateGlow = () => {
            currentRef.current.x += (mouseRef.current.x - currentRef.current.x) * 0.15;
            currentRef.current.y += (mouseRef.current.y - currentRef.current.y) * 0.15;
            glow.style.transform = `translate3d(${currentRef.current.x - 110}px, ${currentRef.current.y - 90}px, 0)`;
            rafRef.current = requestAnimationFrame(updateGlow);
        };

        rafRef.current = requestAnimationFrame(updateGlow);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, []);

    return glowRef;
}
