import NextAuth from 'next-auth';
import { authOptions } from '@/src/lib/auth';

// NextAuth needs to handle both GET (session reads) and POST (sign-in, sign-out)
// requests on the same route. We create one handler and export it under both names.
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
