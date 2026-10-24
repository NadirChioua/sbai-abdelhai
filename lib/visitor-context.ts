/**
 * Server-side enrichment of tracking requests: location from Vercel's edge
 * headers (the IP itself is never stored), device from the user agent, and a
 * traffic channel from the referrer / UTM tags.
 */

const BOT = /bot|crawl|spider|slurp|preview|lighthouse|headless|pagespeed|facebookexternalhit|whatsapp\/|curl|wget|python|node-fetch|axios/i;

export function isBot(ua: string) {
  return !ua || BOT.test(ua);
}

export function geo(headers: Headers) {
  const dec = (v: string | null) => {
    if (!v) return null;
    try {
      return decodeURIComponent(v);
    } catch {
      return v;
    }
  };
  return {
    country: headers.get("x-vercel-ip-country"),
    region: dec(headers.get("x-vercel-ip-country-region")),
    city: dec(headers.get("x-vercel-ip-city")),
  };
}

export function device(ua: string) {
  const type = /ipad|tablet|(android(?!.*mobile))/i.test(ua)
    ? "Tablette"
    : /mobi|iphone|android/i.test(ua)
      ? "Mobile"
      : "Ordinateur";
  const os = /iphone|ipad|ios/i.test(ua)
    ? "iOS"
    : /android/i.test(ua)
      ? "Android"
      : /windows/i.test(ua)
        ? "Windows"
        : /mac os/i.test(ua)
          ? "macOS"
          : /linux/i.test(ua)
            ? "Linux"
            : "Autre";
  const browser = /edg\//i.test(ua)
    ? "Edge"
    : /samsungbrowser/i.test(ua)
      ? "Samsung Internet"
      : /opr\/|opera/i.test(ua)
        ? "Opera"
        : /instagram/i.test(ua)
          ? "Instagram (app)"
          : /fban|fbav/i.test(ua)
            ? "Facebook (app)"
            : /chrome|crios/i.test(ua)
              ? "Chrome"
              : /firefox|fxios/i.test(ua)
                ? "Firefox"
                : /safari/i.test(ua)
                  ? "Safari"
                  : "Autre";
  return { device: type, os, browser };
}

/** Where the visit came from, in words the sales team uses. */
export function channel(referrer: string | null, utmSource: string | null, ua: string) {
  const s = `${utmSource ?? ""} ${referrer ?? ""}`.toLowerCase();
  if (/instagram/.test(s) || /instagram/i.test(ua)) return "Instagram";
  if (/facebook|fb\.|fban|fbav/.test(s) || /fban|fbav/i.test(ua)) return "Facebook";
  if (/whatsapp|wa\.me/.test(s)) return "WhatsApp";
  if (/tiktok/.test(s)) return "TikTok";
  if (/youtube|youtu\.be/.test(s)) return "YouTube";
  if (/google/.test(s)) return "Google";
  if (/bing|yahoo|duckduckgo|ecosia|yandex/.test(s)) return "Autres moteurs";
  if (/qr|catalogue/.test(s)) return "QR catalogue";
  if (/mubawab|avito|sarouty|yakeey|agenz/.test(s)) return "Portails immobiliers";
  if (utmSource) return utmSource;
  if (!referrer) return "Direct";
  try {
    return new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return "Autre";
  }
}
