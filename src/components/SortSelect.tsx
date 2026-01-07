import { memo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowUpDown } from 'lucide-react';

export type SortCriteria = 'priority' | 'dueDate' | 'createdAt';

interface SortSelectProps {
  value: SortCriteria;
  onValueChange: (value: SortCriteria) => void;
}

export const SortSelect = memo(function SortSelect({ value, onValueChange }: SortSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground whitespace-nowrap hidden sm:inline">
        Trier par:
      </span>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-[180px]">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4" />
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-slate-900">
          <SelectItem value="priority">Priorité</SelectItem>
          <SelectItem value="dueDate">Date butoir</SelectItem>
          <SelectItem value="createdAt">Date de création</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
});
