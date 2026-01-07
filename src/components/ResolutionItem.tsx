import { useState, useRef, memo, useMemo } from 'react';
import { format, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Resolution, Category, Priority } from '@/types';
import { getCategoryConfig, getAllCategories, getIconComponent } from '@/lib/categories';
import { prioritiesConfig, prioritiesList } from '@/lib/priorities';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
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
import { Pencil, Trash2, Calendar, AlertTriangle } from 'lucide-react';

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
  const [editPriority, setEditPriority] = useState<Priority>(resolution.priority);
  const [editDueDate, setEditDueDate] = useState<Date | undefined>(
    resolution.dueDate ? new Date(resolution.dueDate) : undefined
  );
  const [titleError, setTitleError] = useState('');

  const categoryConfig = getCategoryConfig(resolution.category);
  const priorityConfig = prioritiesConfig[resolution.priority];
  const allCategories = getAllCategories();
  const IconComponent = getIconComponent(categoryConfig.icon);
  const checkboxRef = useRef<HTMLButtonElement>(null);

  // Calcul du statut de la date butoir
  const dueDateStatus = useMemo(() => {
    if (!resolution.dueDate || resolution.completed) return null;

    const dueDate = new Date(resolution.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    const daysLeft = differenceInDays(dueDate, today);

    if (daysLeft < 0) {
      return { type: 'overdue' as const, label: 'En retard', daysLeft };
    } else if (daysLeft === 0) {
      return { type: 'today' as const, label: "Aujourd'hui", daysLeft };
    } else if (daysLeft <= 7) {
      return { type: 'approaching' as const, label: `${daysLeft}j restants`, daysLeft };
    }
    return { type: 'normal' as const, label: format(new Date(resolution.dueDate), 'd MMM', { locale: fr }), daysLeft };
  }, [resolution.dueDate, resolution.completed]);

  const triggerConfetti = async () => {
    if (!checkboxRef.current) return;

    const rect = checkboxRef.current.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

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
    setEditTitle(resolution.title);
    setEditCategory(resolution.category);
    setEditPriority(resolution.priority);
    setEditDueDate(resolution.dueDate ? new Date(resolution.dueDate) : undefined);
    setTitleError('');
    setIsEditDialogOpen(true);
  };

  const handleEditSave = () => {
    const trimmedTitle = editTitle.trim();

    if (trimmedTitle.length < 3) {
      setTitleError('Le titre doit contenir au moins 3 caractères');
      return;
    }

    if (trimmedTitle.length > 200) {
      setTitleError('Le titre ne peut pas dépasser 200 caractères');
      return;
    }

    onEdit({
      ...resolution,
      title: trimmedTitle,
      category: editCategory,
      priority: editPriority,
      dueDate: editDueDate?.toISOString(),
      updatedAt: new Date().toISOString(),
    });

    toast.success('Résolution modifiée avec succès');

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
          {/* Priority Badge */}
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium whitespace-nowrap ${priorityConfig.colors.bg} ${priorityConfig.colors.text} border ${priorityConfig.colors.border}`}
          >
            {priorityConfig.label}
          </div>
          {/* Due Date Badge */}
          {dueDateStatus && (
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                dueDateStatus.type === 'overdue'
                  ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800'
                  : dueDateStatus.type === 'today'
                  ? 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-800'
                  : dueDateStatus.type === 'approaching'
                  ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800'
                  : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
              } border`}
            >
              {dueDateStatus.type === 'overdue' ? (
                <AlertTriangle className="h-3.5 w-3.5" />
              ) : (
                <Calendar className="h-3.5 w-3.5" />
              )}
              {dueDateStatus.label}
            </div>
          )}
          {/* Show date for completed resolutions */}
          {resolution.completed && resolution.dueDate && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium whitespace-nowrap bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:border-slate-700 border opacity-60">
              <Calendar className="h-3.5 w-3.5" />
              {format(new Date(resolution.dueDate), 'd MMM', { locale: fr })}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 ml-auto flex-shrink-0">
        {/* Edit Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleEditClick}
          className="hover:bg-blue-50 dark:hover:bg-blue-950 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all hover:scale-105"
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
              className="hover:bg-red-50 dark:hover:bg-red-950 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-all hover:scale-105"
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
              Modifiez le titre, la catégorie ou la date butoir de votre résolution.
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

            {/* Category, Priority and Due Date */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

              <div className="space-y-2">
                <label htmlFor="edit-priority" className="text-sm font-medium text-foreground">
                  Priorité
                </label>
                <Select value={editPriority} onValueChange={(value) => setEditPriority(value as Priority)}>
                  <SelectTrigger id="edit-priority">
                    <SelectValue placeholder="Sélectionnez une priorité" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-900">
                    {prioritiesList.map((p) => (
                      <SelectItem key={p} value={p}>
                        {prioritiesConfig[p].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Date butoir
                </label>
                <DatePicker
                  date={editDueDate}
                  onDateChange={setEditDueDate}
                  placeholder="Aucune date"
                />
              </div>
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
