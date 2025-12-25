'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle, XCircle } from 'lucide-react';

// Mock data
const mockVerification = {
  userId: 'user1',
  nickname: 'Yuki',
  email: 'yuki@example.com',
  submittedAt: new Date('2026-01-06T10:30:00'),
  idImagePath: '/uploads/id1.jpg',
  selfieImagePath: '/uploads/selfie1.jpg',
  photoImagePath: '/uploads/photo1.jpg',
};

export default function VerificationReviewPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = use(params);
  const router = useRouter();
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const handleApprove = async () => {
    // TODO: Call API to approve
    console.log('Approving verification for user:', userId);
    alert('本人確認を承認しました');
    router.push('/admin/verifications');
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('却下理由を入力してください');
      return;
    }
    // TODO: Call API to reject
    console.log('Rejecting verification for user:', userId, 'Reason:', rejectionReason);
    alert('本人確認を却下しました');
    router.push('/admin/verifications');
  };

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
    <>
      <Header title="本人確認審査" showBack />

      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6 pb-32">
        {/* User Info */}
        <Card>
          <h2 className="text-heading-sm text-neutral-900 mb-4">ユーザー情報</h2>
          <div className="space-y-2 text-body">
            <div className="flex justify-between">
              <span className="text-neutral-600">ニックネーム:</span>
              <span className="font-medium text-neutral-900">{mockVerification.nickname}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">メールアドレス:</span>
              <span className="font-medium text-neutral-900">{mockVerification.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">提出日時:</span>
              <span className="font-medium text-neutral-900">
                {formatDate(mockVerification.submittedAt)}
              </span>
            </div>
          </div>
        </Card>

        {/* ID Image */}
        <Card>
          <h3 className="text-heading-sm text-neutral-900 mb-4">身分証明書</h3>
          <div className="aspect-video rounded-lg bg-neutral-100 overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-neutral-500">
              [身分証明書画像がここに表示されます]
            </div>
          </div>
          <p className="text-body-sm text-neutral-600 mt-3">
            運転免許証、パスポート、またはマイナンバーカードを確認してください。
          </p>
        </Card>

        {/* Selfie Image */}
        <Card>
          <h3 className="text-heading-sm text-neutral-900 mb-4">セルフィー（本人確認）</h3>
          <div className="aspect-video rounded-lg bg-neutral-100 overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-neutral-500">
              [セルフィー画像がここに表示されます]
            </div>
          </div>
          <p className="text-body-sm text-neutral-600 mt-3">
            身分証明書と顔が一致するか確認してください。
          </p>
        </Card>

        {/* Photo for Gender Verification */}
        <Card>
          <h3 className="text-heading-sm text-neutral-900 mb-4">
            プロフィール写真（性別確認用）
          </h3>
          <div className="aspect-video rounded-lg bg-neutral-100 overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-neutral-500">
              [プロフィール写真がここに表示されます]
            </div>
          </div>
          <p className="text-body-sm text-neutral-600 mt-3">
            女性であることを確認してください。顔がはっきりと見える写真である必要があります。
          </p>
        </Card>

        {/* Review Notes */}
        <Card className="bg-background-pastel-yellow border-yellow-200">
          <h3 className="text-heading-sm text-neutral-900 mb-3">審査チェックリスト</h3>
          <ul className="space-y-2 text-body-sm text-neutral-700">
            <li>✓ 身分証明書が有効で鮮明か</li>
            <li>✓ セルフィーと身分証明書の顔が一致するか</li>
            <li>✓ プロフィール写真で性別が確認できるか</li>
            <li>✓ すべての画像が加工されていないか</li>
          </ul>
        </Card>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background-card border-t border-neutral-200 p-4">
        <div className="max-w-screen-xl mx-auto flex gap-3">
          <Button
            variant="outline"
            className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
            onClick={() => setShowRejectModal(true)}
          >
            <XCircle className="w-4 h-4 mr-2" />
            却下
          </Button>
          <Button variant="primary" className="flex-1 bg-status-confirmed" onClick={handleApprove}>
            <CheckCircle className="w-4 h-4 mr-2" />
            承認
          </Button>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowRejectModal(false)}
        >
          <Card className="max-w-md w-full" onClick={(e) => e?.stopPropagation()}>
            <h2 className="text-heading-md text-neutral-900 mb-4">本人確認を却下</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-body-sm font-medium text-neutral-700 mb-2">
                  却下理由 *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="ユーザーに通知される理由を入力してください"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white text-body focus:outline-none focus:border-primary resize-none"
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" fullWidth onClick={() => setShowRejectModal(false)}>
                  キャンセル
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  className="bg-red-600 hover:bg-red-700"
                  onClick={handleReject}
                  disabled={!rejectionReason.trim()}
                >
                  却下を確定
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
