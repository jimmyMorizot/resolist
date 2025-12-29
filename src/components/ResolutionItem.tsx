import { useState, useRef, memo } from 'react';
import type { Resolution, Category } from '@/types';
import { getCategoryConfig, getAllCategories } from '@/lib/categories';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { toast } from 'sonner';
import { Pencil, Trash2, Heart, Briefcase, User, DollarSign, Sparkles, MoreHorizontal, type LucideIcon } from 'lucide-react';

interface ResolutionItemProps {
  resolution: Resolution;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (resolution: Resolution) => void;
}

export const ResolutionItem = memo(function ResolutionItem({
  resolution,
  onToggle,
  onDelete,
  onEdit,
}: ResolutionItemProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(resolution.title);
  const [editCategory, setEditCategory] = useState<Category>(resolution.category);
  const [titleError, setTitleError] = useState('');

  const categoryConfig = getCategoryConfig(resolution.category);
  const allCategories = getAllCategories();

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
  const checkboxRef = useRef<HTMLButtonElement>(null);

  // Déclenche les confetti lors de la complétion (lazy loaded)
  const triggerConfetti = async () => {
    if (!checkboxRef.current) return;

    const rect = checkboxRef.current.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    // Lazy load confetti uniquement quand nécessaire
    const confetti = (await import('canvas-confetti')).default;

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { x, y },
      colors: categoryConfig.confettiColors,
      ticks: 150,
      gravity: 1.2,
      scalar: 0.9,
    });
  };

  const handleToggle = () => {
    // Déclencher les confetti seulement si on passe de non-complété à complété
    if (!resolution.completed) {
      triggerConfetti();
    }
    onToggle(resolution.id);
  };

  const handleDeleteConfirm = () => {
    onDelete(resolution.id);
    setIsDeleteDialogOpen(false);
  };

  const handleEditClick = () => {
    // Reset form with current values
    setEditTitle(resolution.title);
    setEditCategory(resolution.category);
    setTitleError('');
    setIsEditDialogOpen(true);
  };

  const handleEditSave = () => {
    // Validation
    const trimmedTitle = editTitle.trim();

    if (trimmedTitle.length < 3) {
      setTitleError('Le titre doit contenir au moins 3 caractères');
      return;
    }

    if (trimmedTitle.length > 200) {
      setTitleError('Le titre ne peut pas dépasser 200 caractères');
      return;
    }

    // Call onEdit with updated resolution
    onEdit({
      ...resolution,
      title: trimmedTitle,
      category: editCategory,
      updatedAt: new Date().toISOString(),
    });

    // Show success toast
    toast.success('Résolution modifiée avec succès');

    // Close dialog
    setIsEditDialogOpen(false);
    setTitleError('');
  };

  const handleEditCancel = () => {
    setIsEditDialogOpen(false);
    setTitleError('');
  };

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 ${
        resolution.completed
          ? 'bg-muted/50 border-border/50'
          : 'bg-card border-border hover:border-border/80'
      }`}
    >
      {/* Checkbox */}
      <Checkbox
        ref={checkboxRef}
        checked={resolution.completed}
        onCheckedChange={handleToggle}
        className="h-5 w-5 cursor-pointer transition-transform hover:scale-110"
        aria-label={`Marquer "${resolution.title}" comme complétée`}
      />

      {/* Title and Category Badge */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className={`text-base font-medium truncate transition-all duration-200 ${
              resolution.completed
                ? 'line-through text-muted-foreground opacity-60'
                : 'text-foreground'
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
          onClick={handleEditClick}
          className="hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-all hover:scale-105"
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
              className="hover:bg-red-50 text-red-600 hover:text-red-700 transition-all hover:scale-105"
              aria-label={`Supprimer la résolution: ${resolution.title}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white dark:bg-slate-900">
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-slate-900">
          <DialogHeader>
            <DialogTitle>Modifier la résolution</DialogTitle>
            <DialogDescription>
              Modifiez le titre ou la catégorie de votre résolution.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Title Input */}
            <div className="space-y-2">
              <label htmlFor="edit-title" className="text-sm font-medium text-foreground">
                Titre
              </label>
              <Input
                id="edit-title"
                type="text"
                value={editTitle}
                onChange={(e) => {
                  setEditTitle(e.target.value);
                  setTitleError('');
                }}
                placeholder="Titre de la résolution"
                className={titleError ? 'border-red-500 focus-visible:ring-red-500' : ''}
                autoFocus
              />
              {titleError && (
                <p className="text-sm text-red-600">{titleError}</p>
              )}
            </div>

            {/* Category Select */}
            <div className="space-y-2">
              <label htmlFor="edit-category" className="text-sm font-medium text-foreground">
                Catégorie
              </label>
              <Select value={editCategory} onValueChange={(value) => setEditCategory(value as Category)}>
                <SelectTrigger id="edit-category">
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900">
                  {allCategories.map((category) => {
                    const config = getCategoryConfig(category);
                    return (
                      <SelectItem key={category} value={category}>
                        <div className="flex items-center gap-2">
                          <span className={`inline-block w-2 h-2 rounded-full ${config.colors.bg}`}></span>
                          {config.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleEditCancel}>
              Annuler
            </Button>
            <Button onClick={handleEditSave}>
              Sauvegarder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
});
