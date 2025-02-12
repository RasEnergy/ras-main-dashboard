import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/auth"

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value

  // Allow public access to the home page, login, and signup routes
  if (
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/signup"
  ) {
    return NextResponse.next()
  }

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    try {
      const payload = await verifyToken(token)
      if (!payload || payload.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url))
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/login", "/signup", "/dashboard/:path*"],
}


// import { NextResponse } from "next/server"
// import type { NextRequest } from "next/server"
// import { verifyToken } from "./lib/auth"

// export async function middleware(request: NextRequest) {
//   const token = request.cookies.get("token")?.value

//   if (request.nextUrl.pathname.startsWith("/dashboard")) {
//     if (!token) {
//       return NextResponse.redirect(new URL("/login", request.url))
//     }

//     try {
//       const payload = await verifyToken(token)
//       if (!payload || payload.role !== "admin") {
//         return NextResponse.redirect(new URL("/", request.url))
//       }
//     } catch (error) {
//       return NextResponse.redirect(new URL("/login", request.url))
//     }
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: "/dashboard/:path*",
// }

