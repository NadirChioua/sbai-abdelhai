"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/next";
import { hasConsent } from "@/lib/consent";

/**
 * Vercel Web Analytics, loaded only once the visitor accepts in the consent
 * banner (lib/consent.ts). It is cookieless, but the privacy notice promises
 * that any audience measurement waits for explicit consent.
 */
export default function ConsentedAnalytics() {
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    setGranted(hasConsent());
    const onChange = () => setGranted(hasConsent());
    window.addEventListener("sbai:consent", onChange);
    return () => window.removeEventListener("sbai:consent", onChange);
  }, []);

  return granted ? <Analytics /> : null;
}
