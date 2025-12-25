'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, MessageCircle, Award, User } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'home', href: '/app', icon: Home, labelKey: 'nav.home' },
  { id: 'explore', href: '/app/explore', icon: Search, labelKey: 'nav.explore' },
  { id: 'chat', href: '/app/chat', icon: MessageCircle, labelKey: 'nav.chat' },
  { id: 'grads', href: '/app/grads', icon: Award, labelKey: 'nav.grads' },
  { id: 'profile', href: '/app/profile', icon: User, labelKey: 'nav.profile' },
];

export function BottomTabBar() {
  const pathname = usePathname();
  const { locale } = useLocale();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background-card border-t border-neutral-200 safe-bottom">
      <div className="flex items-center justify-around h-16 max-w-screen-xl mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href || (tab.id !== 'home' && pathname.startsWith(tab.href));

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors',
                isActive ? 'text-primary' : 'text-neutral-500'
              )}
            >
              <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
              <span className={cn('text-xs', isActive && 'font-medium')}>
                {t(tab.labelKey, locale)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
