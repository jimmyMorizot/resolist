import { useState } from 'react';
import type { Resolution } from '@/types';
import { getCategoryConfig } from '@/lib/categories';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Pencil, Trash2, Heart, Briefcase, User, DollarSign, Sparkles, MoreHorizontal, type LucideIcon } from 'lucide-react';

interface ResolutionItemProps {
  resolution: Resolution;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (resolution: Resolution) => void;
}

export function ResolutionItem({
  resolution,
  onToggle,
  onDelete,
  onEdit,
}: ResolutionItemProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const categoryConfig = getCategoryConfig(resolution.category);

  // Map icon names to components
  const iconMap: Record<string, LucideIcon> = {
    Heart,
    Briefcase,
    User,
    DollarSign,
    Sparkles,
    MoreHorizontal,
  };

  const IconComponent = iconMap[categoryConfig.icon] || MoreHorizontal;

  const handleToggle = () => {
    onToggle(resolution.id);
  };

  const handleDeleteConfirm = () => {
    onDelete(resolution.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 ${
        resolution.completed
          ? 'bg-gray-50 border-gray-200'
          : 'bg-white border-gray-300 hover:border-gray-400'
      }`}
    >
      {/* Checkbox */}
      <Checkbox
        checked={resolution.completed}
        onCheckedChange={handleToggle}
        className="h-5 w-5"
        aria-label={`Marquer "${resolution.title}" comme complétée`}
      />

      {/* Title and Category Badge */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className={`text-base font-medium truncate transition-all duration-200 ${
              resolution.completed
                ? 'line-through text-gray-500 opacity-60'
                : 'text-gray-900'
            }`}
          >
            {resolution.title}
          </span>
          {/* Category Badge */}
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium whitespace-nowrap ${categoryConfig.colors.bg} ${categoryConfig.colors.text} border ${categoryConfig.colors.border}`}
          >
            <IconComponent className="h-3.5 w-3.5" />
            {categoryConfig.label}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 ml-auto flex-shrink-0">
        {/* Edit Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(resolution)}
          className="hover:bg-blue-50 text-blue-600 hover:text-blue-700"
          aria-label={`Éditer la résolution: ${resolution.title}`}
        >
          <Pencil className="h-4 w-4" />
        </Button>

        {/* Delete Button with Confirmation */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-red-50 text-red-600 hover:text-red-700"
              aria-label={`Supprimer la résolution: ${resolution.title}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer la résolution "{resolution.title}" ? Cette
                action ne peut pas être annulée.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex gap-3 justify-end">
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Supprimer
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
