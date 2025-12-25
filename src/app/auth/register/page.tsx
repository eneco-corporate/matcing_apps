'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    birthYear: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    if (formData.password.length < 8) {
      setError('パスワードは8文字以上である必要があります');
      return;
    }

    const currentYear = new Date().getFullYear();
    const birthYear = parseInt(formData.birthYear);
    const age = currentYear - birthYear;

    if (age < 18 || age > 100) {
      setError('18歳以上の方のみご登録いただけます');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          nickname: formData.nickname,
          birthYear: formData.birthYear,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || '登録に失敗しました');
        return;
      }

      // Success - redirect to app
      router.push('/app');
      router.refresh();
    } catch (err) {
      setError('登録に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-heading-lg text-neutral-900 mb-2">新規登録</h1>
          <p className="text-body text-neutral-600">
            FriendMatchで新しい友達を見つけよう
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
              <label htmlFor="nickname" className="block text-body-sm font-medium text-neutral-700 mb-2">
                ニックネーム *
              </label>
              <input
                id="nickname"
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white text-body focus:outline-none focus:border-primary"
                placeholder="例: なつき"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-body-sm font-medium text-neutral-700 mb-2">
                メールアドレス *
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white text-body focus:outline-none focus:border-primary"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="birthYear" className="block text-body-sm font-medium text-neutral-700 mb-2">
                生まれ年 *
              </label>
              <input
                id="birthYear"
                type="number"
                name="birthYear"
                value={formData.birthYear}
                onChange={handleChange}
                required
                min="1924"
                max={new Date().getFullYear() - 18}
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white text-body focus:outline-none focus:border-primary"
                placeholder="1995"
              />
              <p className="text-caption text-neutral-500 mt-1">
                18歳以上の方のみご登録いただけます
              </p>
            </div>

            <div>
              <label htmlFor="password" className="block text-body-sm font-medium text-neutral-700 mb-2">
                パスワード *
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white text-body focus:outline-none focus:border-primary"
                placeholder="8文字以上"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-body-sm font-medium text-neutral-700 mb-2">
                パスワード（確認）*
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white text-body focus:outline-none focus:border-primary"
                placeholder="パスワードを再入力"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? '登録中...' : 'アカウントを作成'}
              </Button>
            </div>

            <p className="text-caption text-neutral-600 text-center">
              登録することで、
              <Link href="/terms" className="text-primary-600 hover:text-primary-700">
                利用規約
              </Link>
              と
              <Link href="/privacy" className="text-primary-600 hover:text-primary-700">
                プライバシーポリシー
              </Link>
              に同意したものとみなされます
            </p>
          </form>

          <div className="mt-6 pt-6 border-t border-neutral-200 text-center">
            <p className="text-body-sm text-neutral-600">
              既にアカウントをお持ちの方は{' '}
              <Link href="/auth/login" className="text-primary-600 hover:text-primary-700 font-medium">
                ログイン
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
