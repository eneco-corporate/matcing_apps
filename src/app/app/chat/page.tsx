'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { useLocale } from '@/contexts/LocaleContext';
import { t } from '@/lib/i18n';
import { MessageCircle } from 'lucide-react';

// Mock data
const mockChats = [
  {
    id: '1',
    name: '1月コホート・グループA',
    lastMessage: 'こんにちは！次のイベント楽しみですね',
    lastMessageTime: new Date('2026-01-06T15:30:00'),
    unreadCount: 3,
  },
  {
    id: '2',
    name: '1月コホート・グループB',
    lastMessage: 'みんな渋谷に集合ですか？',
    lastMessageTime: new Date('2026-01-05T18:20:00'),
    unreadCount: 0,
  },
  {
    id: '3',
    name: '12月卒業生',
    lastMessage: '次の再会イベントいつですか？',
    lastMessageTime: new Date('2026-01-03T12:15:00'),
    unreadCount: 1,
  },
];

export default function ChatPage() {
  const { locale } = useLocale();

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else if (days === 1) {
      return '昨日';
    } else if (days < 7) {
      return `${days}日前`;
    } else {
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }
  };

  return (
    <>
      <Header title={t('chat.title', locale)} />

      <div className="max-w-screen-xl mx-auto px-4 py-4 space-y-2">
        {mockChats.map((chat) => (
          <Link key={chat.id} href={`/app/chat/${chat.id}`}>
            <Card padding="md" className="hover:bg-neutral-50 transition-colors">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-primary-600" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between mb-1">
                    <h3 className="text-body font-semibold text-neutral-900 truncate">
                      {chat.name}
                    </h3>
                    <span className="text-caption text-neutral-500 ml-2 flex-shrink-0">
                      {formatTime(chat.lastMessageTime)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-body-sm text-neutral-600 truncate">
                      {chat.lastMessage}
                    </p>
                    {chat.unreadCount > 0 && (
                      <span className="ml-2 flex-shrink-0 inline-flex items-center justify-center w-5 h-5 bg-primary text-white text-xs font-semibold rounded-full">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
