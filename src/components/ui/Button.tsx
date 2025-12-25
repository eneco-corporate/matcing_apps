import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary/90 active:bg-primary/80',
    secondary: 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300 active:bg-neutral-400',
    outline: 'border border-neutral-300 text-neutral-900 hover:bg-neutral-50 active:bg-neutral-100',
    ghost: 'text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-body rounded-xl',
    lg: 'px-8 py-4 text-body-lg rounded-xl',
  };

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
