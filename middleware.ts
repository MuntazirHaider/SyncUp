import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes (no auth required)
const publicRoutes = ["/sign-in(.*)", "/sign-up(.*)", "/intro(.*)"];

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();

  const pathname = request.nextUrl.pathname;

  const isPublic = publicRoutes.some((route) => {
    const regex = new RegExp(`^${route}$`);
    return regex.test(pathname);
  });

  // If the route is not public and the user is not authenticated, redirect to /intro
  if (!isPublic && !userId) {
    const introUrl = new URL("/intro", request.url);
    return NextResponse.redirect(introUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip static files and internals
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
