
import { useState, useEffect } from 'react';

export function useIsMobile(breakpoint = 1024) { // lg breakpoint
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
        return;
    }
    
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, [breakpoint]);

  return isMobile;
}
