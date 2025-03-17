
import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session?.user) {
    redirect('/api/auth/login?returnTo=/admin');
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/');
  }

  return <>{children}</>;
}