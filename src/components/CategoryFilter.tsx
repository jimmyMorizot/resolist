import { memo } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getCategoryConfig, getAllCategories } from '@/lib/categories';
import type { Category, Resolution } from '@/types';
import { Filter, X, Heart, Briefcase, User, DollarSign, Sparkles, MoreHorizontal, type LucideIcon } from 'lucide-react';

interface CategoryFilterProps {
  resolutions: Resolution[];
  selectedCategories: Category[];
  onCategoriesChange: (categories: Category[]) => void;
}

export const CategoryFilter = memo(function CategoryFilter({
  resolutions,
  selectedCategories,
  onCategoriesChange,
}: CategoryFilterProps) {
  const allCategories = getAllCategories();

  const iconMap: Record<string, LucideIcon> = {
    Heart,
    Briefcase,
    User,
    DollarSign,
    Sparkles,
    MoreHorizontal,
  };

  const getCategoryCount = (category: Category): number => {
    return resolutions.filter((r) => r.category === category).length;
  };

  const toggleCategory = (category: Category) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter((c) => c !== category));
    } else {
      onCategoriesChange([...selectedCategories, category]);
    }
  };

  const clearFilters = () => {
    onCategoriesChange([]);
  };

  const selectAll = () => {
    onCategoriesChange([]);
  };

  const hasActiveFilters = selectedCategories.length > 0;
  const allSelected = selectedCategories.length === 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          <span>Filtrer</span>
          {hasActiveFilters && (
            <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
              {selectedCategories.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-slate-900 border shadow-lg">
        <DropdownMenuLabel>Filtrer par catégorie</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuCheckboxItem
          checked={allSelected}
          onCheckedChange={selectAll}
          className="font-medium"
        >
          Toutes les catégories
          <span className="ml-auto text-xs text-muted-foreground">
            {resolutions.length}
          </span>
        </DropdownMenuCheckboxItem>

        <DropdownMenuSeparator />

        {allCategories.map((category) => {
          const config = getCategoryConfig(category);
          const IconComponent = iconMap[config.icon] || MoreHorizontal;
          const count = getCategoryCount(category);
          const isSelected = selectedCategories.includes(category);

          return (
            <DropdownMenuCheckboxItem
              key={category}
              checked={isSelected}
              onCheckedChange={() => toggleCategory(category)}
            >
              <IconComponent className="h-4 w-4 mr-2" />
              {config.label}
              <span className="ml-auto text-xs text-muted-foreground">{count}</span>
            </DropdownMenuCheckboxItem>
          );
        })}

        {hasActiveFilters && (
          <>
            <DropdownMenuSeparator />
            <button
              onClick={clearFilters}
              className="w-full flex items-center px-2 py-1.5 text-sm text-destructive hover:bg-accent rounded-sm cursor-pointer"
            >
              <X className="h-4 w-4 mr-2" />
              Effacer les filtres
            </button>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
