import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  topbar?: React.ReactNode;
}

export const DashboardLayout: React.FC<LayoutProps> = ({
  children,
  sidebar,
  topbar,
}) => {
  return (
    <div className="flex h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Sidebar */}
      {sidebar && (
        <aside className="w-64 border-r border-[var(--border-color)] overflow-y-auto bg-[var(--bg-secondary)] hidden lg:flex flex-col">
          {sidebar}
        </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        {topbar && (
          <header className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)] h-16 flex items-center px-6">
            {topbar}
          </header>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

interface SidebarProps {
  children: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  return (
    <nav className="flex flex-col h-full">
      {children}
    </nav>
  );
};

interface SidebarSectionProps {
  title?: string;
  children: React.ReactNode;
}

export const SidebarSection: React.FC<SidebarSectionProps> = ({ title, children }) => {
  return (
    <div className="py-4 px-4">
      {title && (
        <h3 className="text-xs uppercase tracking-widest text-[var(--text-tertiary)] font-semibold mb-3 px-2">
          {title}
        </h3>
      )}
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
};

interface SidebarItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  icon?: React.ReactNode;
  isActive?: boolean;
  badge?: string | number;
}

export const SidebarItem = React.forwardRef<HTMLAnchorElement, SidebarItemProps>(
  ({ className = '', icon, isActive = false, badge, children, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={`
          flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-[var(--transition-fast)]
          ${isActive
            ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)] font-medium'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-overlay)]'
          }
          ${className}
        `}
        {...props}
      >
        {icon && <span className="w-5 h-5 flex-shrink-0">{icon}</span>}
        <span className="flex-1 text-sm truncate">{children}</span>
        {badge && (
          <span className="text-xs bg-[var(--accent-subtle)] text-[var(--bg-primary)] rounded-full px-2 py-0.5 font-medium flex-shrink-0">
            {badge}
          </span>
        )}
      </a>
    );
  }
);

SidebarItem.displayName = 'SidebarItem';

interface TopBarProps {
  children: React.ReactNode;
}

export const TopBar: React.FC<TopBarProps> = ({ children }) => {
  return (
    <div className="flex items-center justify-between w-full gap-4">
      {children}
    </div>
  );
};
