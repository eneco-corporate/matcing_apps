import { NextResponse } from 'next/server';
import { logout } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function POST() {
  await logout();
  redirect('/');
}

export async function GET() {
  await logout();
  redirect('/');
}
