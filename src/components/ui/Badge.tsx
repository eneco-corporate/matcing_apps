import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'free';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variantStyles = {
    default: 'bg-neutral-200 text-neutral-700',
    success: 'bg-status-confirmed text-white',
    error: 'bg-status-unconfirmed text-white',
    warning: 'bg-yellow-500 text-white',
    free: 'bg-neutral-400 text-white',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-pill text-caption font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

interface DateBadgeProps {
  date: Date;
  locale?: 'ja' | 'en';
  className?: string;
}

export function DateBadge({ date, locale = 'ja', className }: DateBadgeProps) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const text = locale === 'ja' ? `${month}月${day}日` : `${month}/${day}`;

  return (
    <div
      className={cn(
        'bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm',
        'text-caption font-semibold text-neutral-900',
        className
      )}
    >
      {text}
    </div>
  );
}

interface StatusBadgeProps {
  status: 'confirmed' | 'unconfirmed' | 'pending';
  locale?: 'ja' | 'en';
}

export function StatusBadge({ status, locale = 'ja' }: StatusBadgeProps) {
  const labels = {
    ja: {
      confirmed: '確認済み',
      unconfirmed: '未確認',
      pending: '審査中',
    },
    en: {
      confirmed: 'Confirmed',
      unconfirmed: 'Unconfirmed',
      pending: 'Pending',
    },
  };

  const variant = status === 'confirmed' ? 'success' : 'error';

  return <Badge variant={variant}>{labels[locale][status]}</Badge>;
}

interface FilterBadgeProps {
  count?: number;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function FilterBadge({ count, children, onClick, className }: FilterBadgeProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-pill',
        'bg-white border border-neutral-300 text-body-sm text-neutral-900',
        'hover:bg-neutral-50 active:bg-neutral-100 transition-colors',
        className
      )}
    >
      {children}
      {count !== undefined && count > 0 && (
        <span className="inline-flex items-center justify-center w-5 h-5 bg-primary text-white text-xs font-semibold rounded-full">
          {count}
        </span>
      )}
    </button>
  );
}
