<<<<<<< HEAD
import { Role, Department } from "@prisma/client";
=======
import { Department, Role } from "@prisma/client";
>>>>>>> 4f319fae5521788b5775fcd0040476382cfa1dbc
import { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [],
  useSecureCookies: process.env.NODE_ENV === "production",
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const userLoggedIn = !!auth?.user;
      const isHomeRoute = nextUrl.pathname === "/";
      const isAuthRoutes = nextUrl.pathname.startsWith("/auth");
      const authOrHomeRoutes = isHomeRoute || isAuthRoutes;
      const verifiedEmail = auth?.user?.emailVerified;

      const isAdminRoutes = nextUrl.pathname.startsWith("/admin");
      const isAdmin = auth?.user?.role === "ADMIN";

      if (!userLoggedIn && !isAuthRoutes) {
        return Response.redirect(new URL("/auth/sign-in", nextUrl));
      }

      if (!!verifiedEmail && !isAuthRoutes) {
        return Response.redirect(new URL("/auth/sign-in", nextUrl));
      }

      if (userLoggedIn && isHomeRoute) {
        return Response.redirect(new URL("/booking", nextUrl));
      }

      if (!userLoggedIn && !authOrHomeRoutes) {
        return Response.redirect(new URL("/", nextUrl));
      }

      if (userLoggedIn && authOrHomeRoutes) {
        return Response.redirect(new URL("/booking", nextUrl));
      }

      if (isAdminRoutes && !isAdmin) {
        return false;
      }

      return true;
    },
    session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.role = token.role as Role;
        session.user.department = token.department as Department;
      }

      return session;
    },
    jwt({ token, user }) {
      if (!user) return token;

      if (user) {
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.department = user.department;
      }

      return token;
    },
  },
} as NextAuthConfig;
