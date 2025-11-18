import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default  auth(async(req) => {
  const session = await auth();
  const isLoggedIn = !!req.auth
  const isOnDashboard = req.nextUrl.pathname.startsWith('/dashboard')
  const isOnLogin = req.nextUrl.pathname.startsWith('/login')
  const isOnSignup = req.nextUrl.pathname.startsWith('/signup')
  const isOnEdit = req.nextUrl.pathname.includes('/edit')
  const isOnCreate = req.nextUrl.pathname.includes('/create')

  if (isOnDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }


  if ((isOnLogin || isOnSignup) && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }
   if ((isOnEdit) && session?.user.role !== 'admin' ) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }
   if ((isOnCreate) && session?.user.role !== 'admin' ) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }
  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}