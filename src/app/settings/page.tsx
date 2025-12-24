import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import Link from 'next/link';
import Card from '@/components/Card';
import Button from '@/components/Button';

export default async function SettingsPage() {
  const user = await requireAuth();

  return (
    <div className="min-h-screen bg-neutral-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-primary-600 hover:text-primary-700 flex items-center gap-2 mb-4"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            ダッシュボードに戻る
          </Link>
          <h1 className="text-3xl font-bold text-neutral-900">設定</h1>
        </div>

        <div className="space-y-6">
          {/* Account Info */}
          <Card>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              アカウント情報
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  メールアドレス
                </label>
                <p className="text-neutral-900">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  ニックネーム
                </label>
                <p className="text-neutral-900">{user.profile?.nickname || '未設定'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  アカウント状態
                </label>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                  user.status === 'SUSPENDED' ? 'bg-amber-100 text-amber-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {user.status === 'ACTIVE' ? 'アクティブ' :
                   user.status === 'SUSPENDED' ? '一時停止' : 'Ban済み'}
                </span>
              </div>
            </div>
          </Card>

          {/* Verification Status */}
          <Card>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              本人確認
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-700 mb-2">
                  現在の状態:
                  <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                    user.verification?.status === 'VERIFIED' ? 'bg-green-100 text-green-800' :
                    user.verification?.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                    user.verification?.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                    'bg-neutral-100 text-neutral-800'
                  }`}>
                    {user.verification?.status === 'VERIFIED' ? '認証済み' :
                     user.verification?.status === 'PENDING' ? '審査中' :
                     user.verification?.status === 'REJECTED' ? '却下' :
                     '未認証'}
                  </span>
                </p>
                {user.verification?.status === 'REJECTED' && user.verification?.rejectionReason && (
                  <p className="text-sm text-red-600 mt-2">
                    理由: {user.verification.rejectionReason}
                  </p>
                )}
              </div>
              {user.verification?.status !== 'VERIFIED' && (
                <Link href="/settings/verification">
                  <Button size="sm">
                    {user.verification?.status === 'PENDING' ? '詳細を見る' :
                     user.verification?.status === 'REJECTED' ? '再提出' :
                     '本人確認を行う'}
                  </Button>
                </Link>
              )}
            </div>
          </Card>

          {/* Preferences */}
          <Card>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              マッチング設定
            </h2>
            {user.preferences ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    希望年齢層
                  </label>
                  <p className="text-neutral-900">
                    {user.preferences.ageBandMin}〜{user.preferences.ageBandMax}歳
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    希望エリア
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {JSON.parse(user.preferences.preferredAreas || '[]').map((area: string) => (
                      <span
                        key={area}
                        className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    興味・趣味
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {JSON.parse(user.preferences.interests || '[]').map((interest: string) => (
                      <span
                        key={interest}
                        className="px-3 py-1 bg-neutral-100 text-neutral-800 rounded-full text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pt-4">
                  <Link href="/settings/preferences">
                    <Button variant="outline">設定を変更</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-neutral-600 mb-4">設定がまだ完了していません</p>
                <Link href="/onboarding">
                  <Button>設定を完了する</Button>
                </Link>
              </div>
            )}
          </Card>

          {/* Privacy & Safety */}
          <Card>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              プライバシーと安全
            </h2>
            <div className="space-y-3">
              <Link
                href="/settings/privacy"
                className="block p-3 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-neutral-900">プライバシー設定</h3>
                    <p className="text-sm text-neutral-600">表示する情報を管理</p>
                  </div>
                  <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
              <Link
                href="/settings/blocked"
                className="block p-3 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-neutral-900">ブロックリスト</h3>
                    <p className="text-sm text-neutral-600">ブロックしたユーザーを管理</p>
                  </div>
                  <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </div>
          </Card>

          {/* Account Actions */}
          <Card className="border border-red-200">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              アカウント操作
            </h2>
            <div className="space-y-3">
              <form action="/api/auth/logout" method="POST">
                <Button type="submit" variant="outline" fullWidth>
                  ログアウト
                </Button>
              </form>
              <Button variant="danger" fullWidth>
                アカウントを削除
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
