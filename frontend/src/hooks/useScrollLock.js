import { useCallback, useEffect } from 'react';

export function useScrollLock(isLocked) {
    useEffect(() => {
        // - Agar isLocked true ho (jaise cart drawer ya modal khula ho), toh body par 'scroll-locked' class add kar deta hai
        if (isLocked) {
            document.body.classList.add('scroll-locked');
        } else {
            // - Agar lock hata diya jaye toh class remove kar deta hai taake scroll dobara on ho jaye
            document.body.classList.remove('scroll-locked');
        }
        
        // - Cleanup function: Component unmount hone par ya lock false hone par safety ke tor par class lazmi remove karega
        return () => {
            document.body.classList.remove('scroll-locked');
        };
    }, [isLocked]);
}