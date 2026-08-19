import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className = '', variant = 'default', size = 'sm', children, ...props }, ref) => {
    const variants = {
      default: 'bg-[var(--surface-secondary)] text-[var(--text-primary)]',
      success: 'bg-green-500/20 text-green-400',
      warning: 'bg-yellow-500/20 text-yellow-400',
      error: 'bg-red-500/20 text-red-400',
      info: 'bg-blue-500/20 text-blue-400',
    };

    const sizes = {
      sm: 'text-xs px-2 py-1',
      md: 'text-sm px-3 py-1.5',
    };

    return (
      <div
        ref={ref}
        className={`
          inline-flex items-center rounded-full font-medium
          ${variants[variant]} ${sizes[size]} ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';
