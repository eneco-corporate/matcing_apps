'use client';

import { Header } from '@/components/layout/Header';
import { Timeline, TimelineItem } from '@/components/ui/Timeline';
import { useLocale } from '@/contexts/LocaleContext';
import { t, formatDateWithWeekday } from '@/lib/i18n';

// Mock data
const mockSeriesItems: TimelineItem[] = [
  {
    id: '1',
    title: formatDateWithWeekday(new Date('2026-01-07'), 'ja'),
    subtitle: 'ミート＆グリート',
    status: 'current',
    date: new Date('2026-01-07'),
  },
  {
    id: '2',
    title: formatDateWithWeekday(new Date('2026-01-14'), 'ja'),
    subtitle: '深い会話セッション',
    status: 'locked',
    date: new Date('2026-01-14'),
  },
  {
    id: '3',
    title: formatDateWithWeekday(new Date('2026-01-21'), 'ja'),
    subtitle: 'アクティビティナイト',
    status: 'locked',
    date: new Date('2026-01-21'),
  },
  {
    id: '4',
    title: formatDateWithWeekday(new Date('2026-01-28'), 'ja'),
    subtitle: 'グループディスカッション',
    status: 'locked',
    date: new Date('2026-01-28'),
  },
  {
    id: '5',
    title: formatDateWithWeekday(new Date('2026-02-04'), 'ja'),
    subtitle: '振り返り＆共有',
    status: 'locked',
    date: new Date('2026-02-04'),
  },
  {
    id: '6',
    title: formatDateWithWeekday(new Date('2026-02-11'), 'ja'),
    subtitle: '1on1マッチング',
    status: 'locked',
    date: new Date('2026-02-11'),
  },
  {
    id: '7',
    title: formatDateWithWeekday(new Date('2026-02-18'), 'ja'),
    subtitle: '卒業イベント',
    status: 'locked',
    date: new Date('2026-02-18'),
  },
];

export default function ExperiencesPage() {
  const { locale } = useLocale();

  return (
    <>
      <Header title={t('series.title', locale)} />

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <Timeline items={mockSeriesItems} locale={locale} />
      </div>
    </>
  );
}
