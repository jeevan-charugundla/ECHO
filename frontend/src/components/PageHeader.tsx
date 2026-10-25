import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  badge,
  actions
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-4 border-b border-border-main">
      <div className="space-y-1">
        <div className="flex items-center space-x-2.5">
          <h1 className="text-xl font-bold text-primary tracking-tight font-sans">
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p className="text-xs text-secondary leading-relaxed max-w-3xl">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center space-x-2 flex-shrink-0 self-start sm:self-auto">
          {actions}
        </div>
      )}
    </div>
  );
};
