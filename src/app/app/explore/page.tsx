'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { EventCard } from '@/components/ui/EventCard';
import { FilterBadge } from '@/components/ui/Badge';
import { useLocale } from '@/contexts/LocaleContext';
import { t } from '@/lib/i18n';
import { Filter } from 'lucide-react';

// Mock data - will be replaced with actual API call
const mockEvents = [
  {
    id: '1',
    title: 'ミート＆グリート・渋谷',
    description: '初めての方も歓迎！カジュアルな雰囲気で新しい友だちに出会おう ✨',
    imageUrl: '/images/events/shibuya.jpg',
    scheduledAt: new Date('2026-01-07T18:30:00'),
    location: '渋谷',
    locationDetails: '渋谷',
  },
  {
    id: '2',
    title: '深い会話・新宿',
    description: '意味のある対話を楽しむ夜。少人数でゆっくりとした時間を',
    imageUrl: '/images/events/shinjuku.jpg',
    scheduledAt: new Date('2026-01-14T19:00:00'),
    location: '新宿',
    locationDetails: '新宿',
  },
  {
    id: '3',
    title: 'カフェトーク・恵比寿',
    description: '週末の午後、おしゃれなカフェで気軽なおしゃべり',
    imageUrl: '/images/events/ebisu.jpg',
    scheduledAt: new Date('2026-01-18T15:00:00'),
    location: '恵比寿',
    locationDetails: '恵比寿',
  },
  {
    id: '4',
    title: 'アートナイト・六本木',
    description: 'アートを見ながら、創造的な会話を楽しもう',
    imageUrl: '/images/events/roppongi.jpg',
    scheduledAt: new Date('2026-01-21T18:00:00'),
    location: '六本木',
    locationDetails: '六本木',
  },
  {
    id: '5',
    title: 'ブランチミート・吉祥寺',
    description: '週末の朝、のんびりブランチしながら交流',
    imageUrl: '/images/events/kichijoji.jpg',
    scheduledAt: new Date('2026-01-25T11:00:00'),
    location: '吉祥寺',
    locationDetails: '吉祥寺',
  },
];

export default function ExplorePage() {
  const { locale } = useLocale();
  const [filterCount, setFilterCount] = useState(0);

  const handleFilterClick = () => {
    // TODO: Open filter modal
    console.log('Open filter');
  };

  const handleResetClick = () => {
    setFilterCount(0);
    // TODO: Reset filters
  };

  return (
    <>
      <Header title={t('explore.title', locale)} />

      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        {/* Filter Controls */}
        <div className="flex items-center gap-3">
          <FilterBadge count={filterCount} onClick={handleFilterClick}>
            <Filter className="w-4 h-4" />
            {t('explore.filter', locale)}
          </FilterBadge>

          {filterCount > 0 && (
            <button
              onClick={handleResetClick}
              className="text-body-sm text-neutral-600 hover:text-neutral-900 underline"
            >
              {t('explore.reset', locale)}
            </button>
          )}
        </div>

        {/* Event List */}
        <div className="space-y-5">
          {mockEvents.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              description={event.description}
              imageUrl={event.imageUrl}
              scheduledAt={event.scheduledAt}
              location={event.location}
              locationDetails={event.locationDetails}
              locale={locale}
            />
          ))}
        </div>
      </div>
    </>
  );
}
