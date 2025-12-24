import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createMagicLink } from '@/lib/auth';
import { sendMagicLinkEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email, mode } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'メールアドレスが必要です' },
        { status: 400 }
      );
    }

    let user = await prisma.user.findUnique({ where: { email } });

    if (mode === 'signup') {
      if (user) {
        return NextResponse.json(
          { error: 'このメールアドレスは既に登録されています' },
          { status: 400 }
        );
      }

      user = await prisma.user.create({
        data: {
          email,
          emailVerified: false,
        },
      });
    } else {
      if (!user) {
        return NextResponse.json(
          { error: 'ユーザーが見つかりません' },
          { status: 404 }
        );
      }
    }

    const token = await createMagicLink(email);
    await sendMagicLinkEmail(email, token);

    return NextResponse.json({
      success: true,
      message: 'マジックリンクを送信しました',
    });
  } catch (error) {
    console.error('Magic link error:', error);
    return NextResponse.json(
      { error: 'エラーが発生しました' },
      { status: 500 }
    );
  }
}
