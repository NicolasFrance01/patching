import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Usuario", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });
        if (!user) return null;
        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;
        return { id: user.id, name: user.username, email: user.username, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as any).role = token.role;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Always redirect to the custom domain, never to the Azure internal URL
      const CUSTOM_DOMAIN = "https://patching.algeiba.com";
      // If it's a relative URL, prefix with custom domain
      if (url.startsWith("/")) return `${CUSTOM_DOMAIN}${url}`;
      // If it's already on the custom domain, allow it
      if (url.startsWith(CUSTOM_DOMAIN)) return url;
      // Otherwise default to custom domain login
      return `${CUSTOM_DOMAIN}/login`;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET ?? "patching-secret-key-2024",
};
