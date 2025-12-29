import { useState, useRef, memo, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import type { Category } from '../types';
import { ValidationError } from '../hooks/useResolutions';

const CATEGORIES: { value: Category; label: string; emoji: string }[] = [
  { value: 'health', label: 'Santé', emoji: '💪' },
  { value: 'work', label: 'Travail', emoji: '💼' },
  { value: 'personal', label: 'Personnel', emoji: '🎯' },
  { value: 'finance', label: 'Finance', emoji: '💰' },
  { value: 'leisure', label: 'Loisirs', emoji: '🎨' },
  { value: 'other', label: 'Autre', emoji: '📌' },
];

interface ResolutionFormProps {
  onAdd: (title: string, category: Category) => void;
}

export const ResolutionForm = memo(function ResolutionForm({ onAdd }: ResolutionFormProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('personal');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    try {
      onAdd(title, category);

      setTitle('');
      setCategory('personal');
      setError('');

      toast.success('Résolution ajoutée avec succès !', {
        description: `"${title.trim()}" a été ajoutée à votre liste.`,
      });

      inputRef.current?.focus();
    } catch (err) {
      if (err instanceof ValidationError) {
        setError(err.message);
        toast.error('Erreur de validation', {
          description: err.message,
        });
      } else {
        setError('Une erreur est survenue.');
        toast.error('Erreur', {
          description: 'Impossible d\'ajouter la résolution.',
        });
      }
    }
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (error) {
      setError('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Titre de la résolution</Label>
        <Input
          ref={inputRef}
          id="title"
          type="text"
          placeholder="Ex: Faire du sport 3 fois par semaine"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className={error ? 'border-red-500 focus-visible:ring-red-500' : ''}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'title-error' : undefined}
          autoFocus
        />
        {error && (
          <p id="title-error" className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          Entre 3 et 200 caractères
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Catégorie</Label>
        <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
          <SelectTrigger id="category" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-slate-900">
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                <span className="flex items-center gap-2">
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full">
        Ajouter la résolution
      </Button>
    </form>
  );
});
