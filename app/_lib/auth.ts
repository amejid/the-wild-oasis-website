import Google from "@auth/core/providers/google";
import NextAuth from "next-auth";

export const {
  auth,
  handlers: { GET, POST },
} = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
});
