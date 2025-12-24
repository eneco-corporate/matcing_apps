import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { runMatchingAlgorithm } from '@/lib/matching';

export async function POST() {
  try {
    await requireAdmin();

    const result = await runMatchingAlgorithm(4, 6);

    return NextResponse.json({
      success: true,
      groupsCreated: result.groups.length,
      waitlisted: result.waitlisted,
      groups: result.groups,
    });
  } catch (error: any) {
    if (error.message === 'Admin access required') {
      return NextResponse.json(
        { error: '管理者権限が必要です' },
        { status: 403 }
      );
    }

    console.error('Matching error:', error);
    return NextResponse.json(
      { error: 'エラーが発生しました' },
      { status: 500 }
    );
  }
}
