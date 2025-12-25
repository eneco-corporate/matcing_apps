'use client';

import { CompactEventCard } from '@/components/ui/EventCard';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useLocale } from '@/contexts/LocaleContext';
import { t } from '@/lib/i18n';
import { ChevronRight } from 'lucide-react';

// Mock data
const mockUser = {
  nickname: 'Natsuki',
};

const mockUpcomingEvent = {
  id: '1',
  title: 'ミート＆グリート・渋谷',
  imageUrl: '/images/events/shibuya.jpg',
  scheduledAt: new Date('2026-01-07T18:30:00'),
  location: '渋谷',
};

export default function HomePage() {
  const { locale } = useLocale();

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
      {/* Greeting */}
      <div className="mb-2">
        <h1 className="text-heading-lg text-neutral-900">
          {t('home.greeting', locale, { name: mockUser.nickname })}
        </h1>
      </div>

      {/* Upcoming Event Hero */}
      <CompactEventCard
        id={mockUpcomingEvent.id}
        title={mockUpcomingEvent.title}
        imageUrl={mockUpcomingEvent.imageUrl}
        scheduledAt={mockUpcomingEvent.scheduledAt}
        location={mockUpcomingEvent.location}
        locale={locale}
      />

      {/* Can't Make It Card */}
      <Card padding="md">
        <div className="flex items-center justify-between">
          <span className="text-body text-neutral-700">
            {t('home.cantMakeIt', locale)}
          </span>
          <Button variant="ghost" size="sm">
            {t('home.change', locale)}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </Card>

      {/* Personality Test Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="text-heading-sm text-neutral-900">
            {t('home.personalityTest', locale)}
          </h2>
          <Badge variant="free">{t('home.free', locale)}</Badge>
        </div>

        <Card className="bg-background-pastel-pink">
          <div className="space-y-4">
            <p className="text-body-lg text-neutral-900">
              {t('home.whatIsYourType', locale)}
            </p>
            <Button variant="primary" fullWidth>
              {t('home.takeDiagnostic', locale)}
            </Button>
          </div>
        </Card>
      </div>

      {/* Action Cards */}
      <div className="space-y-3">
        {/* Confirm Attendance */}
        <Card padding="md">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-body font-medium text-neutral-900">
                  {t('home.confirmAttendance', locale)}
                </span>
                <Badge variant="error">{t('home.unconfirmed', locale)}</Badge>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-400" />
          </div>
        </Card>

        {/* Add Introduction */}
        <Card padding="md">
          <div className="flex items-center justify-between">
            <span className="text-body font-medium text-neutral-900">
              {t('home.addIntro', locale)}
            </span>
            <ChevronRight className="w-5 h-5 text-neutral-400" />
          </div>
        </Card>

        {/* Invite Friend */}
        <Card padding="md">
          <div className="flex items-center justify-between">
            <span className="text-body font-medium text-neutral-900">
              {t('home.inviteFriend', locale)}
            </span>
            <ChevronRight className="w-5 h-5 text-neutral-400" />
          </div>
        </Card>
      </div>
    </div>
  );
}
