import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/blog(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/pricing(.*)",
  "/customers(.*)",
  "/changelog(.*)",
  "/help(.*)",
  "/oauth-callback",
  "/features(.*)",
]);

export default clerkMiddleware(
  (auth, req) => {
    // Protect all routes except public ones
    if (!isPublicRoute(req)) {
      auth().protect();
    }
  },
  { debug: true } // Set debug mode to true
);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
