import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered';
  clickable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', variant = 'default', clickable = false, ...props }, ref) => {
    const baseStyles = 'rounded-xl transition-all duration-[var(--transition-normal)]';

    const variants = {
      default: 'bg-[var(--surface-primary)] border border-[var(--border-color)]',
      elevated: 'bg-[var(--surface-secondary)] shadow-[var(--shadow-md)]',
      bordered: 'bg-transparent border-2 border-[var(--border-color)]',
    };

    const interactiveStyles = clickable ? 'cursor-pointer hover:border-[var(--accent-subtle)] hover:shadow-[var(--shadow-lg)]' : '';

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${interactiveStyles} ${className}`}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`px-6 py-4 border-b border-[var(--border-color)] ${className}`}
      {...props}
    />
  )
);

CardHeader.displayName = 'CardHeader';

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`px-6 py-4 ${className}`}
      {...props}
    />
  )
);

CardContent.displayName = 'CardContent';

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`px-6 py-4 border-t border-[var(--border-color)] flex items-center justify-between gap-4 ${className}`}
      {...props}
    />
  )
);

CardFooter.displayName = 'CardFooter';
