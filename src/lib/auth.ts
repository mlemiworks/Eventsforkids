import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { findUserByEmail } from './dataFetching';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
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

        // Previously this was user.passwordHash — the Prisma schema names
        // the column 'password', so we update the reference here.
        const match = await bcrypt.compare(credentials.password, user.password);
        if (!match) return null;

        // user.id is already a string in Prisma (cuid), no need to convert
        return { id: user.id, email: user.email };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/' },
};
