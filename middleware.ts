import { type NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { createServerClient } from '@supabase/ssr'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

// Routes that require authentication (locale-stripped)
const protectedPrefixes = ['/dashboard', '/settings', '/profile', '/messages', '/onboarding']
// Auth-only routes — redirect authenticated users away
const authOnlyPrefixes = ['/login', '/register', '/forgot-password']
// Admin-only routes
const adminPrefixes = ['/admin']

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip for API routes and static assets — Next.js handles these natively
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }

  // Strip locale prefix to get the route path
  const pathnameWithoutLocale = pathname.replace(/^\/(el|en)/, '') || '/'
  const locale = pathname.split('/')[1] ?? 'el'

  const isProtected = protectedPrefixes.some((p) => pathnameWithoutLocale.startsWith(p))
  const isAuthOnly = authOnlyPrefixes.some((p) => pathnameWithoutLocale.startsWith(p))
  const isAdmin = adminPrefixes.some((p) => pathnameWithoutLocale.startsWith(p))

  // Fast-path: if the route needs no auth checks, just run intl middleware
  if (!isProtected && !isAuthOnly && !isAdmin) {
    return intlMiddleware(request)
  }

  // Create a mutable response so Supabase can refresh the session cookie
  const supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // IMPORTANT: do NOT call supabase.auth.getUser() — use getSession() for middleware
  // getUser() makes a network request; getSession() reads from the cookie (fast)
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const isAuthenticated = !!session

  // Unauthenticated → redirect to login
  if ((isProtected || isAdmin) && !isAuthenticated) {
    const loginUrl = new URL(`/${locale}/login`, request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Authenticated on auth-only page → redirect to dashboard
  if (isAuthOnly && isAuthenticated) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard/home`, request.url))
  }

  // Onboarding redirect: authenticated but profile not complete
  // (Full check is done server-side in the dashboard layout; middleware just checks cookie)
  // We intentionally skip this in middleware to avoid an extra DB round-trip.

  // Apply next-intl locale routing on top of the Supabase-refreshed response
  const intlResponse = intlMiddleware(request)

  // Merge Supabase cookies into the intl response
  supabaseResponse.cookies.getAll().forEach(({ name, value, ...rest }) => {
    intlResponse.cookies.set(name, value, rest)
  })

  return intlResponse
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
