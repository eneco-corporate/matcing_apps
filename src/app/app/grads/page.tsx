'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useLocale } from '@/contexts/LocaleContext';
import { t } from '@/lib/i18n';

const perkCards = [
  {
    id: '1',
    type: 'photo',
    imageUrl: '/images/perks/matching.jpg',
    title: '隔月の1on1マッチ（年6回）',
    description: '深いつながりを作るための、慎重にマッチングされた1対1の出会い',
  },
  {
    id: '2',
    type: 'illustration',
    bgColor: 'bg-background-pastel-blue',
    title: '次回シリーズ ¥15,000 OFF',
    description: '新しいコホートに参加して、また新しい仲間と出会おう',
  },
  {
    id: '3',
    type: 'photo',
    imageUrl: '/images/perks/events.jpg',
    title: '隔週イベント（東京）',
    description: 'メンバー限定の特別なイベントやアクティビティへのアクセス',
  },
  {
    id: '4',
    type: 'illustration',
    bgColor: 'bg-background-pastel-green',
    title: '月1回のグループ再会',
    description: 'あなたのコホート仲間との定期的な再会の機会',
  },
  {
    id: '5',
    type: 'photo',
    imageUrl: '/images/perks/conversations.jpg',
    title: '新しい深い会話メニュー',
    description: '毎月更新される、より深い対話を促す会話テーマ',
  },
];

export default function GradsPage() {
  const { locale } = useLocale();
  const [showModal, setShowModal] = useState(false);

  const handleJoinClick = () => {
    setShowModal(true);
  };

  return (
    <>
      <Header title={t('grads.title', locale)} />

      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6 pb-32">
        {/* Header Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-heading-lg text-neutral-900">
              {t('grads.title', locale)}
            </h1>
            <Badge variant="default">{t('grads.membersOnly', locale)}</Badge>
          </div>
          <p className="text-body text-neutral-700">
            {t('grads.subtitle', locale)}
          </p>
          <p className="text-body-lg font-semibold text-neutral-900">
            {t('grads.pricePerYear', locale, { price: '48,000' })}
          </p>
        </div>

        {/* Perk Cards */}
        <div className="space-y-4">
          {perkCards.map((perk) => (
            <Card key={perk.id} padding="none" className="overflow-hidden">
              {perk.type === 'photo' ? (
                <div className="relative h-48 bg-neutral-100">
                  {perk.imageUrl && (
                    <img
                      src={perk.imageUrl}
                      alt={perk.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ) : (
                <div className={`h-48 ${perk.bgColor} flex items-center justify-center p-6`}>
                  <div className="text-center">
                    <div className="text-4xl mb-2">✨</div>
                  </div>
                </div>
              )}
              <div className="p-5">
                <h3 className="text-heading-sm text-neutral-900 mb-2">{perk.title}</h3>
                <p className="text-body text-neutral-700">{perk.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-16 left-0 right-0 bg-background-card border-t border-neutral-200 p-4 safe-bottom">
        <div className="max-w-screen-xl mx-auto">
          <Button variant="primary" fullWidth onClick={handleJoinClick}>
            {t('grads.join', locale)}
          </Button>
        </div>
      </div>

      {/* Coming Soon Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowModal(false)}
        >
          <Card className="mx-4 max-w-sm" onClick={(e) => e?.stopPropagation()}>
            <div className="text-center space-y-4">
              <div className="text-4xl">🎉</div>
              <h2 className="text-heading-md text-neutral-900">
                {t('grads.comingSoon', locale)}
              </h2>
              <p className="text-body text-neutral-700">
                この機能は近日公開予定です。お楽しみに！
              </p>
              <Button variant="primary" fullWidth onClick={() => setShowModal(false)}>
                {t('common.close', locale)}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
