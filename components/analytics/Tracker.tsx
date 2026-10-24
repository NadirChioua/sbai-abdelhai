"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { sessionId, track, visitorId, send } from "@/lib/visitor";

/**
 * First-party tracker feeding /admin: one pageview per route, time spent on
 * each page, and the actions that matter to sales (WhatsApp, phone, email,
 * catalogue, film plays, outbound links). Renders nothing.
 */
export default function Tracker() {
  const pathname = usePathname();
  const pageStart = useRef(Date.now());
  const currentPath = useRef<string | null>(null);

  // Pageview on every route change; time spent sent for the page being left.
  useEffect(() => {
    if (!pathname) return;
    if (currentPath.current && currentPath.current !== pathname) {
      track("page_leave", {
        path: currentPath.current,
        duration_ms: Date.now() - pageStart.current,
      });
    }
    currentPath.current = pathname;
    pageStart.current = Date.now();

    const { sid, isNew } = sessionId();
    const params = new URLSearchParams(location.search);
    const external =
      document.referrer && !document.referrer.startsWith(location.origin)
        ? document.referrer
        : null;
    send("/api/e", {
      vid: visitorId(),
      sid,
      type: "pageview",
      path: pathname,
      // Source only counts for the first page of a visit.
      referrer: isNew ? external : null,
      utm_source: params.get("utm_source"),
      utm_medium: params.get("utm_medium"),
      utm_campaign: params.get("utm_campaign"),
    });
  }, [pathname]);

  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState !== "hidden" || !currentPath.current) return;
      track("page_leave", {
        path: currentPath.current,
        duration_ms: Date.now() - pageStart.current,
      });
      pageStart.current = Date.now(); // a return to the tab starts a new count
    };

    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a");
      const href = a?.getAttribute("href");
      if (!href) return;
      if (/wa\.me|whatsapp/i.test(href)) track("whatsapp_click", { target: href.slice(0, 200) });
      else if (href.startsWith("tel:")) track("phone_click", { target: href });
      else if (href.startsWith("mailto:")) track("email_click", { target: href });
      else if (/\.pdf($|\?)/i.test(href)) track("catalogue_download", { target: href });
      else if (/^https?:\/\//i.test(href) && !href.startsWith(location.origin))
        track("outbound_click", { target: href.slice(0, 300) });
    };

    // Feature videos (films, interviews) carry an aria-label; ambient loops do not.
    const played = new WeakSet<HTMLVideoElement>();
    const onPlay = (e: Event) => {
      const v = e.target as HTMLVideoElement;
      if (!(v instanceof HTMLVideoElement) || !v.getAttribute("aria-label") || played.has(v)) return;
      played.add(v);
      track("video_play", { target: v.getAttribute("aria-label") });
    };

    document.addEventListener("visibilitychange", onHide);
    document.addEventListener("click", onClick, true);
    document.addEventListener("play", onPlay, true);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("play", onPlay, true);
    };
  }, []);

  return null;
}
