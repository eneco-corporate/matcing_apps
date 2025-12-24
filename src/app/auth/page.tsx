'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';
import Link from 'next/link';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [useMagicLink, setUseMagicLink] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      if (useMagicLink) {
        const res = await fetch('/api/auth/magic-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, mode }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'エラーが発生しました');
          return;
        }

        setMessage('マジックリンクをメールで送信しました。メールをご確認ください。');
      } else {
        const res = await fetch('/api/auth/password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, mode }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'エラーが発生しました');
          return;
        }

        if (mode === 'signup') {
          router.push('/onboarding');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (err) {
      setError('エラーが発生しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary-50 to-primary-100">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            {mode === 'login' ? 'ログイン' : '新規登録'}
          </h1>
          <p className="text-neutral-600">
            {mode === 'login'
              ? 'アカウントにログインしてください'
              : '新しいアカウントを作成してください'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            label="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="example@email.com"
          />

          {!useMagicLink && (
            <Input
              type="password"
              label="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              helper={mode === 'signup' ? '8文字以上で入力してください' : ''}
            />
          )}

          {message && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {message}
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <Button type="submit" fullWidth isLoading={isLoading}>
            {useMagicLink
              ? 'マジックリンクを送信'
              : mode === 'login'
              ? 'ログイン'
              : '登録'}
          </Button>

          <button
            type="button"
            onClick={() => setUseMagicLink(!useMagicLink)}
            className="w-full text-sm text-primary-600 hover:text-primary-700"
          >
            {useMagicLink
              ? 'パスワードでログイン'
              : 'マジックリンクでログイン'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setError('');
              setMessage('');
            }}
            className="text-sm text-neutral-600 hover:text-neutral-900"
          >
            {mode === 'login' ? (
              <>
                アカウントをお持ちでない方は{' '}
                <span className="text-primary-600 font-medium">新規登録</span>
              </>
            ) : (
              <>
                すでにアカウントをお持ちの方は{' '}
                <span className="text-primary-600 font-medium">ログイン</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-neutral-200">
          <Link
            href="/"
            className="text-sm text-neutral-600 hover:text-neutral-900 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            トップページに戻る
          </Link>
        </div>
      </Card>
    </div>
  );
}
