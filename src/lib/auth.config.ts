import type { NextAuthConfig } from "next-auth";

/** Edge-safe auth config (no Prisma / bcrypt) used by middleware */
export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    authorized({ auth }) {
      return !!auth;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        const role = (user as { role?: string }).role;
        if (role) token.role = role as typeof token.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        if (token.role) {
          session.user.role = token.role as typeof session.user.role;
        }
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
