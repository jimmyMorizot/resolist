import { memo } from 'react';
import { Button } from '@/components/ui/button';
import type { Resolution } from '@/types';

export type StatusFilter = 'all' | 'pending' | 'completed';

interface StatusFilterProps {
  resolutions: Resolution[];
  selectedStatus: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
}

export const StatusFilterComponent = memo(function StatusFilterComponent({
  resolutions,
  selectedStatus,
  onStatusChange,
}: StatusFilterProps) {
  const completedCount = resolutions.filter((r) => r.completed).length;
  const pendingCount = resolutions.filter((r) => !r.completed).length;

  const statuses: { value: StatusFilter; label: string; count: number }[] = [
    { value: 'all', label: 'Toutes', count: resolutions.length },
    { value: 'pending', label: 'En cours', count: pendingCount },
    { value: 'completed', label: 'Complétées', count: completedCount },
  ];

  return (
    <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-1 bg-slate-100 dark:bg-slate-800 w-full sm:w-auto">
      {statuses.map((status) => (
        <Button
          key={status.value}
          variant={selectedStatus === status.value ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onStatusChange(status.value)}
          className={`text-[10px] sm:text-xs px-1.5 sm:px-3 flex-1 sm:flex-none min-w-0 ${
            selectedStatus === status.value
              ? ''
              : 'hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <span className="truncate">{status.label}</span>
          <span
            className={`ml-1 sm:ml-1.5 px-1 sm:px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs flex-shrink-0 ${
              selectedStatus === status.value
                ? 'bg-white/20 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
            }`}
          >
            {status.count}
          </span>
        </Button>
      ))}
    </div>
  );
});
