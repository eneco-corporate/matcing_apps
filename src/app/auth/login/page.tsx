'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'ログインに失敗しました');
        return;
      }

      // Success - redirect to app
      router.push('/app');
      router.refresh();
    } catch (err) {
      setError('ログインに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-heading-lg text-neutral-900 mb-2">ログイン</h1>
          <p className="text-body text-neutral-600">
            FriendMatchへようこそ
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-body-sm text-red-800">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-body-sm font-medium text-neutral-700 mb-2">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white text-body focus:outline-none focus:border-primary"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-body-sm font-medium text-neutral-700 mb-2">
                パスワード
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white text-body focus:outline-none focus:border-primary"
                placeholder="8文字以上"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? 'ログイン中...' : 'ログイン'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-neutral-200 text-center">
            <p className="text-body-sm text-neutral-600">
              アカウントをお持ちでない方は{' '}
              <Link href="/auth/register" className="text-primary-600 hover:text-primary-700 font-medium">
                新規登録
              </Link>
            </p>
          </div>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/" className="text-body-sm text-neutral-600 hover:text-neutral-900">
            トップページに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
