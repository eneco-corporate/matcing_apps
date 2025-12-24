import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Card from '@/components/Card';
import Button from '@/components/Button';

export default async function AdminDashboard() {
  try {
    await requireAdmin();
  } catch {
    redirect('/dashboard');
  }

  const stats = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { verification: { status: 'VERIFIED' } } }),
    prisma.user.count({ where: { verification: { status: 'PENDING' } } }),
    prisma.group.count({ where: { status: { in: ['FORMING', 'ACTIVE'] } } }),
    prisma.report.count({ where: { status: 'PENDING' } }),
  ]);

  const [totalUsers, verifiedUsers, pendingVerifications, activeGroups, pendingReports] = stats;

  const recentUsers = await prisma.user.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      profile: true,
      verification: true,
    },
  });

  const pendingVerificationUsers = await prisma.user.findMany({
    where: {
      verification: { status: 'PENDING' },
    },
    include: {
      profile: true,
      verification: true,
    },
    orderBy: {
      verification: {
        submittedAt: 'desc',
      },
    },
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-neutral-900">管理パネル</h1>
            <Link href="/dashboard">
              <Button variant="outline">ダッシュボードに戻る</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600">{totalUsers}</p>
              <p className="text-sm text-neutral-600 mt-1">総ユーザー数</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{verifiedUsers}</p>
              <p className="text-sm text-neutral-600 mt-1">認証済み</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-600">{pendingVerifications}</p>
              <p className="text-sm text-neutral-600 mt-1">審査待ち</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{activeGroups}</p>
              <p className="text-sm text-neutral-600 mt-1">アクティブグループ</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">{pendingReports}</p>
              <p className="text-sm text-neutral-600 mt-1">未対応報告</p>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            クイックアクション
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/admin/users">
              <Button fullWidth variant="outline">
                ユーザー管理
              </Button>
            </Link>
            <Link href="/admin/verifications">
              <Button fullWidth variant="outline">
                本人確認審査
              </Button>
            </Link>
            <Link href="/admin/reports">
              <Button fullWidth variant="outline">
                報告の確認
              </Button>
            </Link>
            <Link href="/admin/groups">
              <Button fullWidth variant="outline">
                グループ管理
              </Button>
            </Link>
            <Link href="/admin/events">
              <Button fullWidth variant="outline">
                イベント管理
              </Button>
            </Link>
            <form action="/api/admin/matching/run" method="POST">
              <Button type="submit" fullWidth>
                マッチング実行
              </Button>
            </form>
          </div>
        </Card>

        {/* Pending Verifications */}
        {pendingVerificationUsers.length > 0 && (
          <Card className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              本人確認審査待ち
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-neutral-200">
                  <tr className="text-left">
                    <th className="pb-3 font-medium text-neutral-700">ユーザー</th>
                    <th className="pb-3 font-medium text-neutral-700">メール</th>
                    <th className="pb-3 font-medium text-neutral-700">提出日時</th>
                    <th className="pb-3 font-medium text-neutral-700">アクション</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {pendingVerificationUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="py-3">{user.profile?.nickname || '未設定'}</td>
                      <td className="py-3 text-sm text-neutral-600">{user.email}</td>
                      <td className="py-3 text-sm text-neutral-600">
                        {user.verification?.submittedAt
                          ? new Date(user.verification.submittedAt).toLocaleDateString('ja-JP')
                          : '-'}
                      </td>
                      <td className="py-3">
                        <Link href={`/admin/verifications/${user.id}`}>
                          <Button size="sm">審査</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Recent Users */}
        <Card>
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            最近のユーザー
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-neutral-200">
                <tr className="text-left">
                  <th className="pb-3 font-medium text-neutral-700">ニックネーム</th>
                  <th className="pb-3 font-medium text-neutral-700">メール</th>
                  <th className="pb-3 font-medium text-neutral-700">認証状態</th>
                  <th className="pb-3 font-medium text-neutral-700">登録日</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {recentUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="py-3">{user.profile?.nickname || '未設定'}</td>
                    <td className="py-3 text-sm text-neutral-600">{user.email}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        user.verification?.status === 'VERIFIED'
                          ? 'bg-green-100 text-green-800'
                          : user.verification?.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-neutral-100 text-neutral-800'
                      }`}>
                        {user.verification?.status || 'UNVERIFIED'}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-neutral-600">
                      {new Date(user.createdAt).toLocaleDateString('ja-JP')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
