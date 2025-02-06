import { createUser } from "@/app/actions/postactions";
import { handleAuth, handleCallback } from "@auth0/nextjs-auth0";

const afterCallback = async (req: any, session: any, config: any) => {
  if (!session?.user) {
    throw new Error("No user email found in session");
  }
  try {
      const userData = {
        username: session.user.name,
        email: session.user.email,
        role: "USER",
      };
      const user=await createUser(userData);
      session.user.role = user.data.role;
  
  } catch (error) {
    console.error("Auth callback failed:", error);
    throw error;
  }
  return session;
};

export const GET = handleAuth({
  callback: handleCallback({
    afterCallback,
  }),
});
