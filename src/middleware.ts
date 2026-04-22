import { withAuth } from 'next-auth/middleware';

// withAuth wraps the middleware with a session check. If the user has no valid
// session they are redirected to pages.signIn, which we've set to '/' in auth.ts.
export default withAuth({
  pages: {
    signIn: '/',
  },
});

// matcher tells Next.js which routes this middleware applies to.
// Without it, the session check would run on every single request (including
// static files, API routes, etc.) which would be wasteful.
export const config = {
  matcher: ['/create-event'],
};
