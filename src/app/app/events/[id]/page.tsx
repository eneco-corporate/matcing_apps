'use client';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { DateBadge, StatusBadge } from '@/components/ui/Badge';
import { AvatarStack } from '@/components/ui/AvatarStack';
import { useLocale } from '@/contexts/LocaleContext';
import { t, formatDateTime } from '@/lib/i18n';
import { Clock, MapPin } from 'lucide-react';

// Mock data
const mockEvent = {
  id: '1',
  title: 'ミート＆グリート・渋谷',
  description: '初めての方も歓迎！カジュアルな雰囲気で新しい友だちに出会おう。このイベントでは、少人数のグループに分かれて会話を楽しみます。リラックスした環境で、自然な形で新しいつながりを作りましょう。',
  imageUrl: '/images/events/shibuya.jpg',
  scheduledAt: new Date('2026-01-07T18:30:00'),
  location: '渋谷',
  locationDetails: '渋谷駅から徒歩5分',
  address: '東京都渋谷区道玄坂2-10-12',
  attendees: [
    { id: '1', nickname: 'Yuki', photoUrl: '' },
    { id: '2', nickname: 'Sakura', photoUrl: '' },
    { id: '3', nickname: 'Mio', photoUrl: '' },
    { id: '4', nickname: 'Rina', photoUrl: '' },
  ],
  rsvpStatus: 'unconfirmed' as const,
  detailedDescription: `
## イベントの流れ

**18:30 - 集合・チェックイン**
会場に到着したら、受付でチェックインをお願いします。

**18:45 - アイスブレイク**
軽い自己紹介と、場を和ませるための会話スターターを用意しています。

**19:00 - グループトーク**
少人数のグループに分かれて、テーマに沿った対話を楽しみます。

**20:00 - フリートーク**
自由に会場を移動しながら、気になる方とゆっくりお話しできる時間です。

**20:30 - クロージング**
次回のイベント案内と、連絡先交換の時間。

## 持ち物

特に必要なものはありません。リラックスした気持ちでお越しください。

## 注意事項

- 遅刻する場合は事前にご連絡ください
- 安全のため、初回参加の方は本人確認が必要です
- 営利目的の勧誘は固くお断りしています
  `,
};

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { locale } = useLocale();

  return (
    <>
      <Header
        showBack
        rightAction={
          <StatusBadge
            status={mockEvent.rsvpStatus}
            locale={locale}
          />
        }
      />

      <div className="max-w-screen-xl mx-auto">
        {/* Hero Image */}
        <div className="relative h-64 bg-neutral-100">
          {mockEvent.imageUrl ? (
            <img
              src={mockEvent.imageUrl}
              alt={mockEvent.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200" />
          )}
          {/* Date Badge Overlay */}
          <div className="absolute top-4 left-4">
            <DateBadge date={mockEvent.scheduledAt} locale={locale} />
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-6 space-y-6">
          {/* Title & Description */}
          <div>
            <h1 className="text-heading-lg text-neutral-900 mb-3">{mockEvent.title}</h1>
            <p className="text-body text-neutral-700">{mockEvent.description}</p>
          </div>

          {/* Meta Info */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 text-body text-neutral-700">
              <Clock className="w-5 h-5 text-neutral-500" />
              <span>{formatDateTime(mockEvent.scheduledAt, locale)}</span>
            </div>
            <div className="flex items-center gap-3 text-body text-neutral-700">
              <MapPin className="w-5 h-5 text-neutral-500" />
              <div>
                <div>{mockEvent.locationDetails}</div>
                <div className="text-body-sm text-neutral-600">{mockEvent.address}</div>
              </div>
            </div>
          </div>

          {/* Attending Section */}
          <div className="border-t border-neutral-200 pt-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-heading-sm text-neutral-900">
                {t('event.attending', locale)}
              </h2>
            </div>
            <AvatarStack avatars={mockEvent.attendees} max={5} />
          </div>

          {/* Details Section */}
          <div className="border-t border-neutral-200 pt-6">
            <h2 className="text-heading-sm text-neutral-900 mb-4">
              {t('event.details', locale)}
            </h2>
            <div className="prose prose-neutral max-w-none text-body text-neutral-700 whitespace-pre-line">
              {mockEvent.detailedDescription}
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="fixed bottom-16 left-0 right-0 bg-background-card border-t border-neutral-200 p-4 safe-bottom">
          <div className="max-w-screen-xl mx-auto flex gap-3">
            <Button variant="outline" className="flex-1">
              {t('event.changeSchedule', locale)}
            </Button>
            <Button variant="primary" className="flex-1">
              {t('event.confirmAttendance', locale)}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
