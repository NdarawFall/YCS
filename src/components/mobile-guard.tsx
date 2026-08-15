"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function MobileGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileSize = window.innerWidth < 1024;
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(
        navigator.userAgent
      );

      if (isMobileSize || isMobileUA) {
        setIsMobile(true);
        if (pathname !== "/desktop-only") {
          router.replace("/desktop-only");
        }
      } else {
        setIsMobile(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [pathname, router]);

  if (isMobile === true) {
    return null;
  }

  return <>{children}</>;
}
