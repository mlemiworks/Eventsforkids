import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { findUserByEmail } from './dataFetching';
import bcrypt from 'bcryptjs';

// NextAuthOptions is a TypeScript type from next-auth that describes all possible
// config. Exporting authOptions lets API routes and server components call
// getServerSession(authOptions) to read the current user's session.
export const authOptions: NextAuthOptions = {
  providers: [
    // CredentialsProvider handles email/password login. We use this instead of
    // an OAuth provider (Google, GitHub) because we manage our own user accounts.
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Sähköposti', type: 'email' },
        password: { label: 'Salasana', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await findUserByEmail(credentials.email);
        if (!user) return null;
        // bcrypt.compare checks a plain-text password against the stored hash
        // without ever reversing or decrypting it — that's the point of bcrypt
        const match = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!match) return null;
        return { id: String(user.id), email: user.email };
      },
    }),
  ],
  // JWT strategy stores the session in a signed cookie on the client rather than
  // in a database — simpler for a small app that doesn't need server-side sessions
  session: { strategy: 'jwt' },
  // When NextAuth needs to show a login page it goes here. We use '/' because
  // our login UI lives in the nav dropdown, not on a dedicated /login page.
  pages: { signIn: '/' },
};
