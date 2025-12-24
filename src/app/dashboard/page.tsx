import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Button from '@/components/Button';
import Card from '@/components/Card';

export default async function DashboardPage() {
  const user = await requireAuth();

  if (!user.profile) {
    redirect('/onboarding');
  }

  const verificationStatus = user.verification?.status || 'UNVERIFIED';

  // Get user's active groups
  const activeGroups = await prisma.group.findMany({
    where: {
      members: {
        some: {
          userId: user.id,
          isActive: true,
        },
      },
      status: { in: ['FORMING', 'ACTIVE'] },
    },
    include: {
      members: {
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
      },
      events: {
        where: {
          scheduledAt: {
            gte: new Date(),
          },
        },
        orderBy: {
          scheduledAt: 'asc',
        },
        take: 1,
      },
    },
  });

  // Get upcoming events user has RSVP'd to
  const upcomingEvents = await prisma.event.findMany({
    where: {
      rsvps: {
        some: {
          userId: user.id,
          status: 'CONFIRMED',
        },
      },
      scheduledAt: {
        gte: new Date(),
      },
    },
    include: {
      group: true,
      rsvps: {
        where: {
          status: 'CONFIRMED',
        },
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
      },
    },
    orderBy: {
      scheduledAt: 'asc',
    },
    take: 5,
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">
                こんにちは、{user.profile.nickname}さん
              </h1>
              <p className="text-neutral-600">あなたのダッシュボード</p>
            </div>
            <Link href="/settings">
              <Button variant="outline">設定</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Verification Alert */}
        {verificationStatus !== 'VERIFIED' && (
          <div className="mb-6">
            <Card padding="md" className="bg-amber-50 border border-amber-200">
              <div className="flex items-start gap-4">
                <svg className="w-6 h-6 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-900 mb-1">
                    {verificationStatus === 'PENDING' ? '本人確認審査中' : '本人確認が必要です'}
                  </h3>
                  <p className="text-sm text-amber-800 mb-3">
                    {verificationStatus === 'PENDING'
                      ? '本人確認の審査を行っています。完了までしばらくお待ちください。'
                      : 'グループマッチングに参加するには、本人確認が必要です。'}
                  </p>
                  {verificationStatus === 'UNVERIFIED' && (
                    <Link href="/settings/verification">
                      <Button size="sm">本人確認を行う</Button>
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Groups */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                あなたのグループ
              </h2>
              {activeGroups.length === 0 ? (
                <Card>
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-neutral-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 className="text-lg font-medium text-neutral-900 mb-2">
                      まだグループがありません
                    </h3>
                    <p className="text-neutral-600 mb-4">
                      {verificationStatus === 'VERIFIED'
                        ? 'マッチングを待っています。新しいグループが見つかり次第お知らせします。'
                        : '本人確認が完了すると、マッチングが開始されます。'}
                    </p>
                  </div>
                </Card>
              ) : (
                <div className="space-y-4">
                  {activeGroups.map((group) => (
                    <Card key={group.id} hover>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                            {group.cohortName}
                          </h3>
                          <p className="text-sm text-neutral-600 mb-3">
                            Week {group.weekNumber} of {group.maxWeeks} • {group.members.length} メンバー
                          </p>
                          <div className="flex items-center gap-4 text-sm text-neutral-600">
                            {group.targetArea && (
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {group.targetArea}
                              </span>
                            )}
                          </div>
                        </div>
                        <Link href={`/groups/${group.id}`}>
                          <Button size="sm">詳細</Button>
                        </Link>
                      </div>
                      {group.events[0] && (
                        <div className="mt-4 pt-4 border-t border-neutral-200">
                          <p className="text-sm text-neutral-600">
                            次回: {new Date(group.events[0].scheduledAt).toLocaleDateString('ja-JP', {
                              month: 'long',
                              day: 'numeric',
                              weekday: 'short',
                            })}
                          </p>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming Events */}
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                今後の予定
              </h2>
              {upcomingEvents.length === 0 ? (
                <Card>
                  <p className="text-center text-neutral-600 py-8">
                    予定されているイベントはありません
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <Card key={event.id} hover>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-neutral-900 mb-1">
                            {event.title}
                          </h3>
                          <p className="text-sm text-neutral-600 mb-2">
                            {new Date(event.scheduledAt).toLocaleString('ja-JP', {
                              month: 'long',
                              day: 'numeric',
                              weekday: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                          <p className="text-sm text-neutral-600">
                            📍 {event.location}
                          </p>
                        </div>
                        <Link href={`/events/${event.id}`}>
                          <Button size="sm">詳細</Button>
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            <Card>
              <h3 className="font-semibold text-neutral-900 mb-4">
                クイックアクション
              </h3>
              <div className="space-y-2">
                <Link href="/settings/verification" className="block">
                  <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-neutral-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span className="text-sm font-medium">本人確認</span>
                    </div>
                  </button>
                </Link>
                <Link href="/settings" className="block">
                  <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-neutral-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm font-medium">設定</span>
                    </div>
                  </button>
                </Link>
              </div>
            </Card>

            <Card className="bg-primary-50 border border-primary-200">
              <h3 className="font-semibold text-neutral-900 mb-2">
                安全に関するヒント
              </h3>
              <p className="text-sm text-neutral-700">
                初めての方とは必ず公共の場所で会いましょう。違和感を感じたら、すぐに通報してください。
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
