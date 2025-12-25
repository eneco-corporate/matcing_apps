import { cn } from '@/lib/utils';

interface Avatar {
  id: string;
  photoUrl?: string;
  nickname: string;
}

interface AvatarStackProps {
  avatars: Avatar[];
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AvatarStack({ avatars, max = 5, size = 'md', className }: AvatarStackProps) {
  const sizeStyles = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const displayed = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className={cn('flex items-center', className)}>
      {displayed.map((avatar, index) => (
        <div
          key={avatar.id}
          className={cn(
            'relative rounded-full border-2 border-white overflow-hidden bg-neutral-200',
            sizeStyles[size],
            index > 0 && '-ml-3'
          )}
          style={{ zIndex: displayed.length - index }}
        >
          {avatar.photoUrl ? (
            <img
              src={avatar.photoUrl}
              alt={avatar.nickname}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-200 to-primary-300 text-neutral-700 font-medium">
              {avatar.nickname.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            'relative rounded-full border-2 border-white bg-neutral-300 flex items-center justify-center',
            sizeStyles[size],
            '-ml-3',
            'text-neutral-700 font-semibold'
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
