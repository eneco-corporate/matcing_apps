import { NextRequest, NextResponse } from 'next/server';
import { requireVerified } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireVerified();
    const { id: eventId } = await params;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        group: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: 'イベントが見つかりません' },
        { status: 404 }
      );
    }

    // Check if user is a member of the group (if event has a group)
    if (event.group) {
      const isMember = event.group.members.some(m => m.userId === user.id && m.isActive);
      if (!isMember) {
        return NextResponse.json(
          { error: 'このグループのメンバーではありません' },
          { status: 403 }
        );
      }
    }

    // Create or update RSVP
    await prisma.rSVP.upsert({
      where: {
        eventId_userId: {
          eventId,
          userId: user.id,
        },
      },
      update: {
        status: 'CONFIRMED',
      },
      create: {
        eventId,
        userId: user.id,
        status: 'CONFIRMED',
      },
    });

    return NextResponse.json({
      success: true,
      message: '参加申込が完了しました',
    });
  } catch (error: any) {
    if (error.message === 'Verification required') {
      return NextResponse.json(
        { error: '本人確認が必要です' },
        { status: 403 }
      );
    }

    console.error('RSVP error:', error);
    return NextResponse.json(
      { error: 'エラーが発生しました' },
      { status: 500 }
    );
  }
}
