import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // Rutas del CRM que requieren autenticación
  const protectedRoutes = ['/dashboard', '/clientes', '/seguimientos', '/reportes', '/admin']
  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r))

  // Sin sesión intentando acceder al CRM → redirigir a /acceso
  if (!user && isProtected) {
    return NextResponse.redirect(new URL('/acceso', request.url))
  }

  // Con sesión activa intentando ir a /acceso → redirigir al dashboard
  if (user && pathname === '/acceso') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)$).*)'],
}