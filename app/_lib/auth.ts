import Google from "@auth/core/providers/google";
import NextAuth, { Session } from "next-auth";
import { createGuest, getGuest } from "@/app/_lib/data-service";

interface CustomSession extends Session {
  user: {
    guestId?: number | null;
  } & Session["user"];
}

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      return !!auth?.user;
    },
    async signIn({ user, account, profile }) {
      try {
        const existingGuest = await getGuest(user?.email ?? "");

        if (!existingGuest && user.email && user.name) {
          await createGuest({ email: user.email, fullName: user.name });
        }
        return true;
      } catch {
        return false;
      }
    },
    async session({ session, user }) {
      const guest = await getGuest(session.user.email);
      const customSession = session as CustomSession;

      customSession.user.guestId = guest?.id;

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
