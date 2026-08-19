import React from 'react';

export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-[var(--text-secondary)] border-t-[var(--text-primary)]`} />
  );
};

interface LoadingProps {
  message?: string;
  fullPage?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ message = 'Loading...', fullPage = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <Spinner size="lg" />
      <p className="text-[var(--text-secondary)] text-sm">{message}</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        {content}
      </div>
    );
  }

  return content;
};

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ count = 1, className = '', ...props }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-gradient-to-r from-[var(--surface-primary)] via-[var(--surface-secondary)] to-[var(--surface-primary)] rounded-lg h-4 ${className}`}
          {...props}
        />
      ))}
    </>
  );
};
