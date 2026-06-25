import createIntlMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth/constants";
import {
  localePrefixFromPath,
  stripLocaleFromPath,
  withLocalePrefix,
} from "@/lib/auth/paths";
import { verifyAdminSessionToken } from "@/lib/auth/session";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const path = stripLocaleFromPath(pathname);
  const localePrefix = localePrefixFromPath(pathname);
  const isLogin = path === "/dashboard/login";
  const isDashboard = path.startsWith("/dashboard");
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const session = token ? await verifyAdminSessionToken(token) : null;

  if (isDashboard && !isLogin && !session) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = withLocalePrefix("/dashboard/login", localePrefix);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLogin && session) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = withLocalePrefix("/dashboard/content", localePrefix);
    dashboardUrl.search = "";
    return NextResponse.redirect(dashboardUrl);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(ar|en)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
