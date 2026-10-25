import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: number | string;
  subtext?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  breakdown?: React.ReactNode;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  icon: Icon,
  iconColor = 'text-electric-600',
  iconBg = 'bg-electric-50',
  breakdown,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg border border-border-main p-4 shadow-subtle hover:border-slate-300 transition-all ${
        onClick ? 'cursor-pointer hover:shadow-card' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
          {label}
        </span>
        <span className={`p-2 rounded-md ${iconBg} ${iconColor}`}>
          <Icon className="w-4 h-4" />
        </span>
      </div>

      <div className="mt-2.5 flex items-baseline space-x-2">
        <span className="text-2xl font-bold font-mono text-primary tabular-nums tracking-tight">
          {value}
        </span>
        {subtext && (
          <span className="text-xs text-secondary font-medium">
            {subtext}
          </span>
        )}
      </div>

      {breakdown && (
        <div className="mt-2.5 pt-2 border-t border-border-subtle">
          {breakdown}
        </div>
      )}
    </div>
  );
};
