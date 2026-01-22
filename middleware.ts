// middleware.ts (root level)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const { pathname } = request.nextUrl

  console.log('Middleware:', { pathname, hasToken: !!token })

  // Public paths that don't require authentication
  const publicPaths = [
    '/', 
    '/login', 
    '/register', 
    '/announcements',
    '/news',
    '/services',
    '/about',
    '/contact',
    '/cookies',
    '/terms',
    '/privacy'
  ]
  const isPublicPath = publicPaths.includes(pathname)
  
  // API routes should be handled separately
  const isApiRoute = pathname.startsWith('/api/')
  
  // PWA files - CRITICAL for PWA to work
  const isPWAFile = pathname === '/manifest.json' || 
                    pathname === '/sw.js' ||
                    pathname === '/workbox-' ||
                    pathname.startsWith('/workbox-') ||
                    pathname === '/swe-worker-' ||
                    pathname.startsWith('/swe-worker-')
  
  // Static and public assets
  const isPublicAsset = pathname.startsWith('/_next') || 
                        pathname.startsWith('/static') ||
                        pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|json|js)$/)

  // Don't process API routes, public assets, or PWA files
  if (isApiRoute || isPublicAsset || isPWAFile) {
    console.log('Middleware: Allowing asset/API/PWA:', pathname)
    return NextResponse.next()
  }

  // If accessing protected route without token, redirect to login
  if (!token && !isPublicPath) {
    console.log('Middleware: No token, redirecting to login')
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If has token and on login/register page, redirect based on role
  if (token && (pathname === '/login' || pathname === '/register')) {
    console.log('Middleware: User has token on login/register, checking role...')
    
    try {
      // Fetch user data to determine role
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/api/auth/me`, {
        headers: {
          'Cookie': `auth_token=${token}`,
          'Accept': 'application/json',
        },
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        const userRole = data.user?.role

        console.log('Middleware: User role detected:', userRole)

        // Redirect based on role
        if (userRole === 'admin') {
          console.log('Middleware: Redirecting admin to admin dashboard')
          return NextResponse.redirect(new URL('/dashboard/admin/', request.url))
        } else if (userRole === 'member') {
          console.log('Middleware: Redirecting member to member dashboard')
          return NextResponse.redirect(new URL('/dashboard/member/', request.url))
        }
      }
    } catch (error) {
      console.error('Middleware: Error fetching user role:', error)
    }

    // Default redirect if role check fails
    console.log('Middleware: Role check failed, redirecting to home')
    return NextResponse.redirect(new URL('/dashboard/member/', request.url))
  }

  // Allow access to all other routes
  console.log('Middleware: Allowing access')
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     * - PWA files (manifest.json, sw.js, workbox files)
     */
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox-.*|swe-worker-.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}