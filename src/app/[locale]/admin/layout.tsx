
import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  console.log(session)
  if (!session?.user) {
    console.log("No session, redirecting to login");
    redirect('/api/auth/login?returnTo=/admin');
  }

  console.log("User role:", session.user.role); 
  if (session.user.role !== 'ADMIN') {
    redirect('/');
  }

  return <>{children}</>;
}