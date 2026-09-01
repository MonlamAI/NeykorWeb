import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import axios from "axios";

async function upsertAppUser(user: { name?: string | null; email?: string | null }) {
  if (!user.email) {
    throw new Error("No user email found in session");
  }
  await axios.post(
    `${process.env.API_URL}/user`,
    {
      username: user.name || user.email,
      email: user.email,
      role: "USER",
    },
    { headers: { "Content-Type": "application/json" } }
  );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  trustHost: true,
  callbacks: {
    async signIn({ user }) {
      await upsertAppUser(user);
      return true;
    },
  },
});
