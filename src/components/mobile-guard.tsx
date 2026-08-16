"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function MobileGuard({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
