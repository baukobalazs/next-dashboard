import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/app/lib/session'
 
const protectedRoutes = ['/dashboard']
const publicRoutes = ['/login', '/signup', '/']
 
export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  const isPublicRoute = publicRoutes.includes(path)
 
  // Modern middleware API
  const cookie = req.cookies.get('session')?.value
  const session = await decrypt(cookie)
 
  // Redirect /login-re ha nincs session
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }
 
  // Redirect /dashboard-ra ha már be van jelentkezve
  if (
    isPublicRoute &&
    session?.userId &&
    !path.startsWith('/dashboard')
  ) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }
 
  return NextResponse.next()
}
 
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}