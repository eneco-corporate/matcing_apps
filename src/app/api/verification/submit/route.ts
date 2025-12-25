import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    // Try to get authenticated user, but allow unauthenticated for registration flow
    let userId: string;
    try {
      const user = await requireAuth();
      userId = user.id;
    } catch {
      // For registration flow, user may not be authenticated yet
      // We'll get userId from the most recently created user
      const recentUser = await prisma.user.findFirst({
        orderBy: { createdAt: 'desc' },
      });
      if (!recentUser) {
        return NextResponse.json(
          { error: '認証に失敗しました' },
          { status: 401 }
        );
      }
      userId = recentUser.id;
    }

    const formData = await request.formData();
    const idImage = formData.get('idImage') as File;
    const selfieImage = formData.get('selfieImage') as File;

    if (!idImage || !selfieImage) {
      return NextResponse.json(
        { error: '両方の画像をアップロードしてください' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'uploads', 'verification', userId);
    await mkdir(uploadDir, { recursive: true });

    // Save files
    const idImageBuffer = Buffer.from(await idImage.arrayBuffer());
    const selfieImageBuffer = Buffer.from(await selfieImage.arrayBuffer());

    const idImagePath = path.join(uploadDir, `id_${Date.now()}.${idImage.name.split('.').pop()}`);
    const selfieImagePath = path.join(uploadDir, `selfie_${Date.now()}.${selfieImage.name.split('.').pop()}`);

    await writeFile(idImagePath, idImageBuffer);
    await writeFile(selfieImagePath, selfieImageBuffer);

    // Update verification status
    await prisma.verification.update({
      where: { userId },
      data: {
        status: 'PENDING',
        idImagePath: idImagePath.replace(process.cwd(), ''),
        selfieImagePath: selfieImagePath.replace(process.cwd(), ''),
        submittedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: '本人確認書類を提出しました',
    });
  } catch (error) {
    console.error('Verification submit error:', error);
    return NextResponse.json(
      { error: 'エラーが発生しました' },
      { status: 500 }
    );
  }
}
