import { NextRequest, NextResponse } from 'next/server'

const FRAMEWORKS = ['react', 'vue', 'solid'] as const
const DEFAULT_FRAMEWORK = 'react'
const COOKIE_NAME = 'wire-ui-framework'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path starts with a framework prefix: /react/docs/..., /vue/docs/...
  const frameworkMatch = pathname.match(/^\/(react|vue|solid)(\/docs(?:\/.*)?)?$/)

  if (frameworkMatch) {
    const framework = frameworkMatch[1]
    // Set the framework cookie so the client can read it on mount
    const response = NextResponse.next()
    response.cookies.set(COOKIE_NAME, framework, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
    })
    return response
  }

  // Bare /docs or /docs/... without framework prefix — redirect to /{framework}/docs/...
  if (pathname === '/docs' || pathname.startsWith('/docs/')) {
    const storedFramework = request.cookies.get(COOKIE_NAME)?.value
    const framework =
      storedFramework && FRAMEWORKS.includes(storedFramework as (typeof FRAMEWORKS)[number])
        ? storedFramework
        : DEFAULT_FRAMEWORK

    const url = request.nextUrl.clone()
    url.pathname = `/${framework}${pathname}`
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/docs',
    '/docs/:path*',
    '/react/docs',
    '/react/docs/:path*',
    '/vue/docs',
    '/vue/docs/:path*',
    '/solid/docs',
    '/solid/docs/:path*',
  ],
}
