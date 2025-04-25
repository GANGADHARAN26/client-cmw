import { useEffect, useState } from "react";

export function useIsMobile(breakpoint: number = 768): boolean {
    const [isMobile, setIsMobile] = useState<boolean>(false);
  
    useEffect(() => {
      const checkScreen = (): void => setIsMobile(window.innerWidth < breakpoint);
  
      checkScreen(); // initial check
      window.addEventListener("resize", checkScreen);
  
      return () => window.removeEventListener("resize", checkScreen);
    }, [breakpoint]);
  
    return isMobile;
  }