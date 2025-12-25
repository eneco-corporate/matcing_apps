import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/chat/[threadId]/messages - Get all messages in a thread
export async function GET(
  request: NextRequest,
  { params }: { params: { threadId: string } }
) {
  try {
    const user = await requireAuth();
    const { threadId } = params;

    // Verify user has access to this thread (is a member of the group)
    const thread = await prisma.chatThread.findUnique({
      where: { id: threadId },
      include: {
        group: {
          include: {
            members: {
              where: { userId: user.id, isActive: true },
            },
          },
        },
      },
    });

    if (!thread || thread.group.members.length === 0) {
      return NextResponse.json(
        { error: 'アクセス権限がありません' },
        { status: 403 }
      );
    }

    // Get messages
    const messages = await prisma.message.findMany({
      where: {
        threadId,
        deletedAt: null,
      },
      include: {
        user: {
          include: {
            profile: {
              select: {
                nickname: true,
                photoUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json({ messages, currentUserId: user.id });
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: 'メッセージの取得に失敗しました' },
      { status: 500 }
    );
  }
}

// POST /api/chat/[threadId]/messages - Send a new message
export async function POST(
  request: NextRequest,
  { params }: { params: { threadId: string } }
) {
  try {
    const user = await requireAuth();
    const { threadId } = params;
    const body = await request.json();
    const { content } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'メッセージを入力してください' },
        { status: 400 }
      );
    }

    // Verify user has access to this thread
    const thread = await prisma.chatThread.findUnique({
      where: { id: threadId },
      include: {
        group: {
          include: {
            members: {
              where: { userId: user.id, isActive: true },
            },
          },
        },
      },
    });

    if (!thread || thread.group.members.length === 0) {
      return NextResponse.json(
        { error: 'アクセス権限がありません' },
        { status: 403 }
      );
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        threadId,
        userId: user.id,
        content: content.trim(),
      },
      include: {
        user: {
          include: {
            profile: {
              select: {
                nickname: true,
                photoUrl: true,
              },
            },
          },
        },
      },
    });

    // Update thread's updatedAt timestamp
    await prisma.chatThread.update({
      where: { id: threadId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: 'メッセージの送信に失敗しました' },
      { status: 500 }
    );
  }
}
