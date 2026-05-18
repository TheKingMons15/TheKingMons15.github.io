import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  // Rutas completamente públicas (sin auth)
  const publicRoutes = ["/", "/acceso", "/forgot-password", "/auth/callback", "/brochure.html"];
  const isPublicRoute = publicRoutes.some((r) => pathname === r || pathname.startsWith(r + "?"));

  // Archivos estáticos — siempre públicos
  const isStaticFile = /\.(css|js|png|jpg|jpeg|gif|svg|ico|webp|woff|woff2)$/.test(pathname);

  if (isStaticFile || isPublicRoute) {
    // Si ya está autenticado y va a /acceso → redirigir al dashboard
    if (user && pathname === "/acceso") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // Ruta protegida sin auth → redirigir a /acceso
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/acceso";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
