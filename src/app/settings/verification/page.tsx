'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import Card from '@/components/Card';
import SafetyBanner from '@/components/SafetyBanner';

export default function VerificationPage() {
  const router = useRouter();
  const [status, setStatus] = useState<string>('');
  const [idImage, setIdImage] = useState<File | null>(null);
  const [selfieImage, setSelfieImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/verification/status');
      const data = await res.json();
      setStatus(data.status || 'UNVERIFIED');
    } catch (err) {
      console.error('Failed to fetch verification status');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!idImage || !selfieImage) {
      setError('IDと自撮り写真の両方をアップロードしてください');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('idImage', idImage);
      formData.append('selfieImage', selfieImage);

      const res = await fetch('/api/verification/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'アップロードに失敗しました');
        return;
      }

      setSuccess('本人確認書類を提出しました。審査には1-2営業日かかります。');
      setStatus('PENDING');
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      setError('エラーが発生しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'VERIFIED') {
    return (
      <div className="min-h-screen bg-neutral-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                本人確認が完了しています
              </h2>
              <p className="text-neutral-600 mb-6">
                グループマッチングに参加できます
              </p>
              <Button onClick={() => router.push('/dashboard')}>
                ダッシュボードへ
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (status === 'PENDING') {
    return (
      <div className="min-h-screen bg-neutral-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                審査中
              </h2>
              <p className="text-neutral-600 mb-6">
                本人確認の審査を行っています。1-2営業日お待ちください。
              </p>
              <Button onClick={() => router.push('/dashboard')}>
                ダッシュボードへ
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            本人確認
          </h1>
          <p className="text-neutral-600">
            安全なコミュニティのため、本人確認をお願いしています
          </p>
        </div>

        <div className="mb-6">
          <SafetyBanner />
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                必要な書類
              </h3>
              <ul className="list-disc list-inside space-y-2 text-neutral-700 mb-6">
                <li>身分証明書（運転免許証、パスポート、マイナンバーカードなど）</li>
                <li>顔がはっきり写った自撮り写真</li>
              </ul>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                身分証明書の写真 <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setIdImage(e.target.files?.[0] || null)}
                required
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="mt-1 text-sm text-neutral-500">
                JPG, PNG形式 (最大5MB)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                自撮り写真 <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelfieImage(e.target.files?.[0] || null)}
                required
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="mt-1 text-sm text-neutral-500">
                顔がはっきり写っている写真をアップロードしてください
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                {success}
              </div>
            )}

            <div className="bg-neutral-50 p-4 rounded-lg">
              <p className="text-sm text-neutral-600">
                <strong>プライバシーについて:</strong> アップロードされた情報は厳重に管理され、本人確認の目的のみに使用されます。第三者に提供されることはありません。
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard')}
                disabled={isLoading}
              >
                後で行う
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
                fullWidth
              >
                提出する
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
