import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    const {
      nickname,
      birthYear,
      bio,
      interests,
      conversationDepth,
      drinkingOk,
      smokingOk,
      quietMode,
      noAlcoholMeetups,
      ageBandMin,
      ageBandMax,
      preferredAreas,
      availableTimes,
    } = await request.json();

    if (!nickname || !birthYear) {
      return NextResponse.json(
        { error: 'ニックネームと生まれ年が必要です' },
        { status: 400 }
      );
    }

    await prisma.profile.create({
      data: {
        userId: user.id,
        nickname,
        birthYear,
        bio: bio || null,
      },
    });

    await prisma.verification.create({
      data: {
        userId: user.id,
        status: 'UNVERIFIED',
      },
    });

    await prisma.preference.create({
      data: {
        userId: user.id,
        ageBandMin: ageBandMin || 20,
        ageBandMax: ageBandMax || 50,
        preferredAreas: JSON.stringify(preferredAreas || []),
        availableTimes: JSON.stringify(availableTimes || []),
        interests: JSON.stringify(interests || []),
        drinkingOk: drinkingOk ?? true,
        smokingOk: smokingOk ?? false,
        conversationDepth: conversationDepth || 'BALANCED',
        quietMode: quietMode ?? false,
        noAlcoholMeetups: noAlcoholMeetups ?? false,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'プロフィールを作成しました',
    });
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json(
      { error: 'エラーが発生しました' },
      { status: 500 }
    );
  }
}
