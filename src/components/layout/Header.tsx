'use client';

import { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: ReactNode;
  className?: string;
}

export function Header({ title, showBack, onBack, rightAction, className }: HeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <header className={cn('sticky top-0 z-40 bg-background border-b border-neutral-200', className)}>
      <div className="flex items-center justify-between h-14 px-4 max-w-screen-xl mx-auto">
        <div className="flex items-center gap-3 flex-1">
          {showBack && (
            <button
              onClick={handleBack}
              className="flex items-center justify-center w-9 h-9 -ml-2 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-700" />
            </button>
          )}
          {title && (
            <h1 className="text-heading-sm text-neutral-900 truncate">{title}</h1>
          )}
        </div>
        {rightAction && <div className="flex items-center gap-2">{rightAction}</div>}
      </div>
    </header>
  );
}
