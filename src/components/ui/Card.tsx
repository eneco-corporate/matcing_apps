import { ReactNode, MouseEvent } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: (e?: MouseEvent<HTMLDivElement>) => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, className, onClick, padding = 'lg' }: CardProps) {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  };

  return (
    <div
      className={cn(
        'bg-background-card rounded-card border border-neutral-200 shadow-card',
        paddingStyles[padding],
        onClick && 'cursor-pointer hover:shadow-card-hover transition-shadow',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface HeroCardProps {
  children: ReactNode;
  imageUrl?: string;
  className?: string;
  overlay?: boolean;
}

export function HeroCard({ children, imageUrl, className, overlay = false }: HeroCardProps) {
  return (
    <div className={cn('relative rounded-lg-card overflow-hidden', className)}>
      {imageUrl && (
        <div className="absolute inset-0">
          <img
            src={imageUrl}
            alt=""
            className="w-full h-full object-cover"
          />
          {overlay && (
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
          )}
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

interface SectionCardProps {
  title: string;
  badge?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SectionCard({ title, badge, children, className }: SectionCardProps) {
  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-heading-sm text-neutral-900">{title}</h3>
        {badge}
      </div>
      {children}
    </Card>
  );
}
