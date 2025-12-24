import { redirect } from 'next/navigation';
import { verifyMagicLink } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function VerifyMagicLinkPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const token = params.token;

  if (!token) {
    redirect('/auth?error=invalid_token');
  }

  const userId = await verifyMagicLink(token);

  if (!userId) {
    redirect('/auth?error=invalid_or_expired_token');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });

  if (!user) {
    redirect('/auth?error=user_not_found');
  }

  if (!user.profile) {
    redirect('/onboarding');
  }

  redirect('/dashboard');
}
