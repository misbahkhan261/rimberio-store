import { useCallback, useEffect } from 'react';

export function useScrollLock(isLocked) {
    useEffect(() => {
        if (isLocked) {
            document.body.classList.add('scroll-locked');
        } else {
            document.body.classList.remove('scroll-locked');
        }
        return () => {
            document.body.classList.remove('scroll-locked');
        };
    }, [isLocked]);
}
