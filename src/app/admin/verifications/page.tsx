'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Eye } from 'lucide-react';

// Mock data
const mockPendingVerifications = [
  {
    id: '1',
    userId: 'user1',
    nickname: 'Yuki',
    email: 'yuki@example.com',
    submittedAt: new Date('2026-01-06T10:30:00'),
    idImagePath: '/uploads/id1.jpg',
    selfieImagePath: '/uploads/selfie1.jpg',
    photoImagePath: '/uploads/photo1.jpg',
  },
  {
    id: '2',
    userId: 'user2',
    nickname: 'Sakura',
    email: 'sakura@example.com',
    submittedAt: new Date('2026-01-05T15:20:00'),
    idImagePath: '/uploads/id2.jpg',
    selfieImagePath: '/uploads/selfie2.jpg',
    photoImagePath: '/uploads/photo2.jpg',
  },
  {
    id: '3',
    userId: 'user3',
    nickname: 'Mio',
    email: 'mio@example.com',
    submittedAt: new Date('2026-01-04T12:15:00'),
    idImagePath: '/uploads/id3.jpg',
    selfieImagePath: '/uploads/selfie3.jpg',
    photoImagePath: '/uploads/photo3.jpg',
  },
];

export default function AdminVerificationsPage() {
  const [verifications, setVerifications] = useState(mockPendingVerifications);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-background-card border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-heading-lg text-neutral-900">本人確認審査</h1>
              <p className="text-body-sm text-neutral-600 mt-1">
                {verifications.length}件の審査待ち
              </p>
            </div>
            <Link href="/admin">
              <Button variant="outline">管理画面に戻る</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-4">
        {verifications.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-body text-neutral-600">審査待ちの確認書類はありません</p>
            </div>
          </Card>
        ) : (
          verifications.map((verification) => (
            <Card key={verification.id} padding="md">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-heading-sm text-neutral-900">
                      {verification.nickname}
                    </h3>
                    <Badge variant="warning">審査待ち</Badge>
                  </div>
                  <p className="text-body-sm text-neutral-600 mb-1">
                    {verification.email}
                  </p>
                  <p className="text-caption text-neutral-500">
                    提出日時: {formatDate(verification.submittedAt)}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div className="aspect-square rounded-lg bg-neutral-100 overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-caption text-neutral-500">
                      ID画像
                    </div>
                  </div>
                  <div className="aspect-square rounded-lg bg-neutral-100 overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-caption text-neutral-500">
                      セルフィー
                    </div>
                  </div>
                  <div className="aspect-square rounded-lg bg-neutral-100 overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-caption text-neutral-500">
                      プロフィール写真
                    </div>
                  </div>
                </div>

                <Link href={`/admin/verifications/${verification.userId}`}>
                  <Button variant="primary" fullWidth>
                    <Eye className="w-4 h-4 mr-2" />
                    詳細を確認して審査
                  </Button>
                </Link>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
