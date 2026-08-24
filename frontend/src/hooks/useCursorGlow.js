import { useEffect, useRef } from 'react';

export function useCursorGlow() {
    // - Refs create kiye hain taake DOM element, animation frame aur mouse coordinates ko track kiya ja sakay bina re-renders ke
    const glowRef = useRef(null);
    const rafRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const currentRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        // - Sirf desktop devices (jahan fine pointer aur hover available ho) par hi cursor glow chalega
        const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        if (!isDesktop) return;

        const glow = glowRef.current;
        if (!glow) return;

        // - Mouse move hone par target coordinates update karta hai
        const onMouseMove = (e) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;
        };

        window.addEventListener('mousemove', onMouseMove, { passive: true });

        // - RequestAnimationFrame (RAF) loop jo glow ko mouse ke peeche smooth easing (lag effect) ke sath move karata hai
        const updateGlow = () => {
            // - Lerp (Linear Interpolation) formula taake glow smoothly follow kare (0.15 factor speed control karta hai)
            currentRef.current.x += (mouseRef.current.x - currentRef.current.x) * 0.15;
            currentRef.current.y += (mouseRef.current.y - currentRef.current.y) * 0.15;
            
            // - Transform translate3d use kiya hai taake GPU acceleration (hardware performance) behtar rahay
            glow.style.transform = `translate3d(${currentRef.current.x - 110}px, ${currentRef.current.y - 90}px, 0)`;
            rafRef.current = requestAnimationFrame(updateGlow);
        };

        rafRef.current = requestAnimationFrame(updateGlow);

        // - Cleanup function: Component unmount hone par event listener aur animation frame ko hata deta hai (memory leak bachane ke liye)
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, []);

    return glowRef;
}