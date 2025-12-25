import Link from 'next/link';
import { Clock, MapPin, Sparkles } from 'lucide-react';
import { DateBadge } from './Badge';
import { cn } from '@/lib/utils';

interface EventCardProps {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  scheduledAt: Date;
  location: string;
  locationDetails?: string;
  locale?: 'ja' | 'en';
  className?: string;
}

export function EventCard({
  id,
  title,
  description,
  imageUrl,
  scheduledAt,
  location,
  locationDetails,
  locale = 'ja',
  className,
}: EventCardProps) {
  const hours = scheduledAt.getHours().toString().padStart(2, '0');
  const minutes = scheduledAt.getMinutes().toString().padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;

  return (
    <Link href={`/app/events/${id}`}>
      <div
        className={cn(
          'bg-white rounded-lg-card border border-neutral-200 shadow-card overflow-hidden',
          'hover:shadow-card-hover transition-shadow',
          className
        )}
      >
        {/* Hero Image */}
        <div className="relative h-48 bg-neutral-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200" />
          )}
          {/* Date Badge Overlay */}
          <div className="absolute top-3 left-3">
            <DateBadge date={scheduledAt} locale={locale} />
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          {/* Title */}
          <h3 className="text-heading-sm text-neutral-900 line-clamp-1">{title}</h3>

          {/* Description */}
          {description && (
            <p className="text-body text-neutral-600 line-clamp-2">
              {description}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-body-sm text-neutral-600">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{timeStr}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>{locationDetails || location}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface CompactEventCardProps {
  id: string;
  title: string;
  imageUrl?: string;
  scheduledAt: Date;
  location: string;
  locale?: 'ja' | 'en';
}

export function CompactEventCard({
  id,
  title,
  imageUrl,
  scheduledAt,
  location,
  locale = 'ja',
}: CompactEventCardProps) {
  const hours = scheduledAt.getHours().toString().padStart(2, '0');
  const minutes = scheduledAt.getMinutes().toString().padStart(2, '0');
  const month = scheduledAt.getMonth() + 1;
  const day = scheduledAt.getDate();
  const dateTimeStr = locale === 'ja'
    ? `${month}月${day}日・${hours}:${minutes}`
    : `${month}/${day} ${hours}:${minutes}`;

  return (
    <Link href={`/app/events/${id}`}>
      <div className="relative h-40 rounded-lg-card overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <h3 className="text-heading-sm font-semibold mb-2">{title}</h3>
          <div className="flex items-center gap-4 text-body-sm">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{dateTimeStr}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
