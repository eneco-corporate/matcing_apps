'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';

interface EventInput {
  id: string;
  title: string;
  description: string;
  location: string;
  scheduledDate: string;
  scheduledTime: string;
}

export default function CreateSeriesPage() {
  const router = useRouter();
  const [seriesName, setSeriesName] = useState('');
  const [seriesDescription, setSeriesDescription] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState('');
  const [events, setEvents] = useState<EventInput[]>([
    {
      id: '1',
      title: '',
      description: '',
      location: '',
      scheduledDate: '',
      scheduledTime: '18:30',
    },
  ]);

  const addEvent = () => {
    setEvents([
      ...events,
      {
        id: Date.now().toString(),
        title: '',
        description: '',
        location: '',
        scheduledDate: '',
        scheduledTime: '18:30',
      },
    ]);
  };

  const removeEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  const updateEvent = (id: string, field: keyof EventInput, value: string) => {
    setEvents(
      events.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  const handleSubmit = async () => {
    const seriesData = {
      name: seriesName,
      description: seriesDescription,
      isPaid,
      price: isPaid ? parseInt(price) : null,
      totalEvents: events.length,
      events: events.map((e, index) => ({
        ...e,
        seriesOrder: index,
        scheduledAt: new Date(`${e.scheduledDate}T${e.scheduledTime}`),
      })),
    };

    // TODO: Submit to API
    console.log('Creating series:', seriesData);

    // Mock success
    alert('シリーズを作成しました！');
    router.push('/admin/series');
  };

  const canSubmit =
    seriesName &&
    events.length > 0 &&
    events.every((e) => e.title && e.location && e.scheduledDate);

  return (
    <>
      <Header title="イベントシリーズを作成" showBack />

      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6 pb-32">
        {/* Series Info */}
        <Card>
          <h2 className="text-heading-sm text-neutral-900 mb-4">シリーズ情報</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-body-sm font-medium text-neutral-700 mb-2">
                シリーズ名 *
              </label>
              <input
                type="text"
                value={seriesName}
                onChange={(e) => setSeriesName(e.target.value)}
                placeholder="例: 2026年1月コホート"
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white text-body focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-body-sm font-medium text-neutral-700 mb-2">
                説明
              </label>
              <textarea
                value={seriesDescription}
                onChange={(e) => setSeriesDescription(e.target.value)}
                placeholder="シリーズの概要を入力..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white text-body focus:outline-none focus:border-primary resize-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isPaid"
                checked={isPaid}
                onChange={(e) => setIsPaid(e.target.checked)}
                className="w-5 h-5 rounded border-neutral-300 text-primary focus:ring-primary"
              />
              <label htmlFor="isPaid" className="text-body font-medium text-neutral-700">
                有料シリーズ
              </label>
            </div>

            {isPaid && (
              <div>
                <label className="block text-body-sm font-medium text-neutral-700 mb-2">
                  価格（円）
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="30000"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white text-body focus:outline-none focus:border-primary"
                />
              </div>
            )}
          </div>
        </Card>

        {/* Events */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-heading-sm text-neutral-900">
              イベント ({events.length})
            </h2>
            <Button variant="outline" size="sm" onClick={addEvent}>
              <Plus className="w-4 h-4 mr-2" />
              イベントを追加
            </Button>
          </div>

          {events.map((event, index) => (
            <Card key={event.id}>
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-body font-semibold text-neutral-900">
                  イベント {index + 1}
                </h3>
                {events.length > 1 && (
                  <button
                    onClick={() => removeEvent(event.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-body-sm font-medium text-neutral-700 mb-2">
                    タイトル *
                  </label>
                  <input
                    type="text"
                    value={event.title}
                    onChange={(e) => updateEvent(event.id, 'title', e.target.value)}
                    placeholder="例: ミート＆グリート・渋谷"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white text-body focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-body-sm font-medium text-neutral-700 mb-2">
                    説明
                  </label>
                  <textarea
                    value={event.description}
                    onChange={(e) => updateEvent(event.id, 'description', e.target.value)}
                    placeholder="イベントの詳細..."
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white text-body focus:outline-none focus:border-primary resize-none"
                  />
                </div>

                <div>
                  <label className="block text-body-sm font-medium text-neutral-700 mb-2">
                    場所 *
                  </label>
                  <input
                    type="text"
                    value={event.location}
                    onChange={(e) => updateEvent(event.id, 'location', e.target.value)}
                    placeholder="渋谷、新宿、恵比寿など"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white text-body focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-body-sm font-medium text-neutral-700 mb-2">
                      日付 *
                    </label>
                    <input
                      type="date"
                      value={event.scheduledDate}
                      onChange={(e) => updateEvent(event.id, 'scheduledDate', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white text-body focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-body-sm font-medium text-neutral-700 mb-2">
                      時間 *
                    </label>
                    <input
                      type="time"
                      value={event.scheduledTime}
                      onChange={(e) => updateEvent(event.id, 'scheduledTime', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white text-body focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background-card border-t border-neutral-200 p-4">
        <div className="max-w-screen-xl mx-auto flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => router.back()}>
            キャンセル
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            シリーズを作成
          </Button>
        </div>
      </div>
    </>
  );
}
