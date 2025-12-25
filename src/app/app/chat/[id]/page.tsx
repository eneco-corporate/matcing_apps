'use client';

import { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { useLocale } from '@/contexts/LocaleContext';
import { t } from '@/lib/i18n';
import { Send, Flag } from 'lucide-react';

interface Message {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  user: {
    profile: {
      nickname: string;
      photoUrl: string | null;
    } | null;
  };
}

export default function ChatThreadPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { locale } = useLocale();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages
  useEffect(() => {
    fetchMessages();
    // Poll for new messages every 3 seconds
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/chat/${id}/messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);

        // Get current user ID from the first message that belongs to us
        // (In a real app, this would come from a user context)
        if (data.currentUserId) {
          setCurrentUserId(data.currentUserId);
        }
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!message.trim() || sending) return;

    setSending(true);
    setError('');

    try {
      const response = await fetch(`/api/chat/${id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: message.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages([...messages, data.message]);
        setMessage('');
        scrollToBottom();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'メッセージの送信に失敗しました');
        console.error('Failed to send message:', errorData);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setError('メッセージの送信に失敗しました');
    } finally {
      setSending(false);
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
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-neutral-500">読み込み中...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-neutral-500">メッセージがありません</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isOwn = msg.userId === currentUserId;
              const nickname = msg.user.profile?.nickname || 'Unknown';
              const createdAt = new Date(msg.createdAt);

              return (
                <div
                  key={msg.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[75%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                    {!isOwn && (
                      <span className="text-caption text-neutral-600 px-2">
                        {nickname}
                      </span>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        isOwn
                          ? 'bg-primary text-white'
                          : 'bg-white border border-neutral-200 text-neutral-900'
                      }`}
                    >
                      <p className="text-body whitespace-pre-wrap break-words">
                        {msg.content}
                      </p>
                    </div>
                    <span className="text-caption text-neutral-500 px-2">
                      {formatTime(createdAt)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-neutral-200 bg-background-card p-4">
          {error && (
            <div className="mb-3 px-4 py-2 rounded-xl bg-red-50 border border-red-200 text-body-sm text-red-800">
              {error}
            </div>
          )}
          <div className="flex items-end gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={t('chat.typeMessage', locale)}
              className="flex-1 px-4 py-3 rounded-xl border border-neutral-300 bg-white text-body focus:outline-none focus:border-primary resize-none"
              disabled={sending}
            />
            <Button
              variant="primary"
              size="md"
              onClick={handleSend}
              disabled={!message.trim() || sending}
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
