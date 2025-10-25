// lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/pages/adminlogin',
    error: '/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      // Pasar la info del usuario al token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken; // ✅ Agrega accessToken al token
      }
      return token;
    },
    async session({ session, token }) {
      // Pasar la info del token a la sesión
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.accessToken = token.accessToken as string; // ✅ Agrega accessToken a la sesión
      }
      return session;
    }
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const email = credentials.email.trim().toLowerCase().substring(0, 254);
          const password = credentials.password.substring(0, 128);

          if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            return null;
          }

          if (password.length < 8 || password.length > 128) {
            return null;
          }

          const startTime = Date.now();

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          });

          const minProcessingTime = 500;
          const elapsed = Date.now() - startTime;
          if (elapsed < minProcessingTime) {
            await new Promise(resolve => 
              setTimeout(resolve, minProcessingTime - elapsed)
            );
          }

          if (!user) {
            return null;
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);

          if (!isValid) {
            return null;
          }

          // ✅ Retorna el usuario con accessToken (puedes generar uno o usar el id)
          return {
            id: user.id.toString(),
            name: `${user.firstName} ${user.lastName}`.trim(),
            email: user.email,
            role: user.role,
            accessToken: `token-${user.id}-${Date.now()}` // Token simple por ahora
          };

        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    })
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};