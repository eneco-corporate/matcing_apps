'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { useLocale } from '@/contexts/LocaleContext';
import { t } from '@/lib/i18n';
import { Send, Flag } from 'lucide-react';

// Mock data
const mockMessages = [
  {
    id: '1',
    userId: 'user1',
    nickname: 'Yuki',
    content: 'こんにちは！次のイベント楽しみですね',
    createdAt: new Date('2026-01-06T15:30:00'),
    isOwn: false,
  },
  {
    id: '2',
    userId: 'current',
    nickname: 'Natsuki',
    content: '私も楽しみです！どんな雰囲気なんでしょうか',
    createdAt: new Date('2026-01-06T15:32:00'),
    isOwn: true,
  },
  {
    id: '3',
    userId: 'user2',
    nickname: 'Sakura',
    content: 'カジュアルで楽しい雰囲気ですよ😊',
    createdAt: new Date('2026-01-06T15:35:00'),
    isOwn: false,
  },
  {
    id: '4',
    userId: 'current',
    nickname: 'Natsuki',
    content: '良かった！安心しました',
    createdAt: new Date('2026-01-06T15:36:00'),
    isOwn: true,
  },
];

export default function ChatThreadPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { locale } = useLocale();
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      // TODO: Send message
      console.log('Sending:', message);
      setMessage('');
    }
  };

  const formatTime = (date: Date) => {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Header
        title="1月コホート・グループA"
        showBack
        rightAction={
          <button className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-neutral-100 transition-colors">
            <Flag className="w-5 h-5 text-neutral-700" />
          </button>
        }
      />

      <div className="flex flex-col h-[calc(100vh-3.5rem-4rem)]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {mockMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[75%] ${msg.isOwn ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                {!msg.isOwn && (
                  <span className="text-caption text-neutral-600 px-2">
                    {msg.nickname}
                  </span>
                )}
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    msg.isOwn
                      ? 'bg-primary text-white'
                      : 'bg-white border border-neutral-200 text-neutral-900'
                  }`}
                >
                  <p className="text-body whitespace-pre-wrap break-words">
                    {msg.content}
                  </p>
                </div>
                <span className="text-caption text-neutral-500 px-2">
                  {formatTime(msg.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-neutral-200 bg-background-card p-4">
          <div className="flex items-end gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t('chat.typeMessage', locale)}
              className="flex-1 px-4 py-3 rounded-xl border border-neutral-300 bg-white text-body focus:outline-none focus:border-primary resize-none"
            />
            <Button
              variant="primary"
              size="md"
              onClick={handleSend}
              disabled={!message.trim()}
              className="flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
