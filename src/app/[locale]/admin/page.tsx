import { auth } from "@/auth";
import { getRole, getUser } from "@/app/actions/getactions";
import AccessClient from "./AccessClient";

type AdminUser = {
  username: string;
  email: string;
  role: string;
  id: string;
};

export default async function AdminPage() {
  const session = await auth();
  let users: AdminUser[] = [];
  let isAdmin = false;

  if (session?.user?.email) {
    const role = await getRole(session.user.email);
    isAdmin = role === "ADMIN";
    if (isAdmin) {
      users = (await getUser()) as AdminUser[];
    }
  }

  return <AccessClient users={users} isAdmin={isAdmin} />;
}
