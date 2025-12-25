import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, createSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, nickname, birthYear } = body;

    // Validation
    if (!email || !password || !nickname || !birthYear) {
      return NextResponse.json(
        { error: 'すべてのフィールドを入力してください' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'パスワードは8文字以上である必要があります' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'このメールアドレスは既に登録されています' },
        { status: 409 }
      );
    }

    // Create user
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        emailVerified: false,
        profile: {
          create: {
            nickname,
            birthYear: parseInt(birthYear),
          },
        },
        verification: {
          create: {
            status: 'UNVERIFIED',
          },
        },
        preferences: {
          create: {
            ageBandMin: 20,
            ageBandMax: 40,
            preferredAreas: JSON.stringify([]),
            availableTimes: JSON.stringify([]),
            interests: JSON.stringify([]),
          },
        },
      },
    });

    // Create session
    await createSession(user.id);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: '登録に失敗しました' },
      { status: 500 }
    );
  }
}
