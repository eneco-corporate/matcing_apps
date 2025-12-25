import { redirect, notFound } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Button from '@/components/Button';
import Card from '@/components/Card';
import SafetyBanner from '@/components/SafetyBanner';

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireAuth();
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      group: {
        include: {
          members: {
            where: { isActive: true },
            include: {
              user: {
                include: {
                  profile: true,
                },
              },
            },
          },
        },
      },
      rsvps: {
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
      },
      promptAssignments: {
        include: {
          prompt: true,
        },
        orderBy: {
          order: 'asc',
        },
      },
    },
  });

  if (!event) {
    notFound();
  }

  const userRsvp = event.rsvps.find(r => r.userId === user.id);
  const isConfirmed = userRsvp?.status === 'CONFIRMED';
  const isPast = new Date(event.scheduledAt) < new Date();
  const isVerified = user.verification?.status === 'VERIFIED';

  const confirmedCount = event.rsvps.filter(r => r.status === 'CONFIRMED').length;

  return (
    <div className="min-h-screen bg-neutral-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="text-primary-600 hover:text-primary-700 flex items-center gap-2 mb-4"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            ダッシュボードに戻る
          </Link>
        </div>

        <Card className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                {event.title}
              </h1>
              {event.group && (
                <p className="text-lg text-neutral-600">
                  {event.group.cohortName}
                </p>
              )}
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              event.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
              event.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
              event.status === 'COMPLETED' ? 'bg-neutral-100 text-neutral-800' :
              'bg-red-100 text-red-800'
            }`}>
              {event.status === 'SCHEDULED' && '予定'}
              {event.status === 'CONFIRMED' && '確定'}
              {event.status === 'COMPLETED' && '完了'}
              {event.status === 'CANCELLED' && 'キャンセル'}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-neutral-900 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                日時
              </h3>
              <p className="text-neutral-700">
                {new Date(event.scheduledAt).toLocaleString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-neutral-900 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                場所
              </h3>
              <p className="text-neutral-700 font-medium">{event.location}</p>
              {event.address && (
                <p className="text-sm text-neutral-600 mt-1">{event.address}</p>
              )}
            </div>
          </div>

          {event.description && (
            <div className="mb-6">
              <h3 className="font-semibold text-neutral-900 mb-2">詳細</h3>
              <p className="text-neutral-700">{event.description}</p>
            </div>
          )}

          <div className="mb-6">
            <h3 className="font-semibold text-neutral-900 mb-2">
              参加者 ({confirmedCount}人)
            </h3>
            <div className="flex flex-wrap gap-2">
              {event.rsvps
                .filter(r => r.status === 'CONFIRMED')
                .map(rsvp => (
                  <div
                    key={rsvp.id}
                    className="flex items-center gap-2 bg-neutral-100 px-3 py-2 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-primary-200 rounded-full flex items-center justify-center text-primary-800 font-medium">
                      {rsvp.user.profile?.nickname.charAt(0)}
                    </div>
                    <span className="text-sm font-medium">
                      {rsvp.user.profile?.nickname}
                    </span>
                    {rsvp.checkedIn && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                        チェックイン済
                      </span>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {!isVerified && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800 text-sm">
                本人確認が完了していないため、参加申込できません。
                <Link href="/settings/verification" className="text-primary-600 hover:text-primary-700 font-medium ml-2">
                  本人確認を行う →
                </Link>
              </p>
            </div>
          )}

          {isVerified && !isConfirmed && !isPast && (
            <form action={`/api/events/${event.id}/rsvp`} method="POST">
              <Button type="submit" fullWidth size="lg">
                参加する
              </Button>
            </form>
          )}

          {isConfirmed && !isPast && (
            <div className="space-y-4">
              {event.group && (
                <Link href={`/chat/${event.group.id}`}>
                  <Button fullWidth size="lg" variant="outline">
                    グループチャットを開く
                  </Button>
                </Link>
              )}
              {!userRsvp?.checkedIn && (
                <Button fullWidth size="lg">
                  チェックイン
                </Button>
              )}
            </div>
          )}

          {isPast && isConfirmed && (
            <Link href={`/feedback/${event.id}`}>
              <Button fullWidth size="lg">
                フィードバックを送る
              </Button>
            </Link>
          )}
        </Card>

        {event.promptAssignments.length > 0 && (
          <Card className="mb-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              会話のきっかけ
            </h2>
            <div className="space-y-4">
              {event.promptAssignments.map((assignment, index) => (
                <div key={assignment.id} className="p-4 bg-neutral-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 mb-1">
                        {assignment.prompt.titleJa}
                      </h3>
                      <p className="text-neutral-700">
                        {assignment.prompt.promptJa}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <SafetyBanner />
      </div>
    </div>
  );
}
