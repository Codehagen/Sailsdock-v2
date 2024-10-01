import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Optionally specify public routes
  publicRoutes: ["/", "/blog(.*)"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
