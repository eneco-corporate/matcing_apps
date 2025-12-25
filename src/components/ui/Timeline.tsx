import { Lock, Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TimelineItem {
  id: string;
  title: string;
  subtitle: string;
  status: 'completed' | 'current' | 'locked';
  date?: Date;
}

interface TimelineProps {
  items: TimelineItem[];
  locale?: 'ja' | 'en';
  className?: string;
}

export function Timeline({ items, locale = 'ja', className }: TimelineProps) {
  return (
    <div className={cn('relative', className)}>
      {/* Vertical Line */}
      <div className="absolute left-4 top-6 bottom-6 w-0.5 bg-neutral-200" />

      {/* Items */}
      <div className="space-y-4">
        {items.map((item, index) => {
          const isCompleted = item.status === 'completed';
          const isCurrent = item.status === 'current';
          const isLocked = item.status === 'locked';

          return (
            <div key={item.id} className="relative flex items-start gap-4">
              {/* Icon */}
              <div
                className={cn(
                  'relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2',
                  isCompleted && 'bg-status-confirmed border-status-confirmed',
                  isCurrent && 'bg-white border-primary',
                  isLocked && 'bg-white border-neutral-300'
                )}
              >
                {isCompleted && <Check className="w-4 h-4 text-white" />}
                {isCurrent && <Circle className="w-3 h-3 fill-primary text-primary" />}
                {isLocked && <Lock className="w-4 h-4 text-neutral-400" />}
              </div>

              {/* Content Card */}
              <div
                className={cn(
                  'flex-1 rounded-card px-5 py-4 border',
                  isCurrent && 'bg-neutral-50 border-neutral-300',
                  !isCurrent && 'bg-white border-neutral-200'
                )}
              >
                <div className="text-body font-medium text-neutral-900">{item.title}</div>
                <div className="text-body-sm text-neutral-600 mt-1">{item.subtitle}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
