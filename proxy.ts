import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next 16: middleware is now "proxy" — next-intl's handler plugs in unchanged.
export default createIntlMiddleware(routing);

export const config = {
  // Skip internals, API routes and static files (anything with an extension)
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
