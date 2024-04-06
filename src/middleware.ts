import { withClerkMiddleware } from "@clerk/nextjs";

import { NextResponse } from "next/server";

// New middleware don't know why it doesn't work
// export default authMiddleware({
//   publicRoutes: ["/api/trpc/comingSoon.subscribeToUpdates(.*)"],
//   ignoredRoutes: ["/", "/api/trpc/comingSoon.subscribeToUpdates"],
// });

export default withClerkMiddleware(() => {
  return NextResponse.next()
})

// Stop Middleware running on static files
export const config = {
  matcher: [
    /*
     * Match request paths except for the ones starting with:
     * - _next
     * - static (static files)
     * - favicon.ico (favicon file)
     *
     * This includes images, and requests from TRPC.
     */
    "/(.*?trpc.*?|(?!static|.*\\..*|_next|favicon.ico).*)",
  ],
};
