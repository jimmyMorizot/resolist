import { useState, useCallback, useMemo } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { useResolutions } from './hooks/useResolutions';
import { useLocalStorage } from './hooks/useLocalStorage';
import { ResolutionForm } from './components/ResolutionForm';
import { ResolutionList } from './components/ResolutionList';
import { CategoryFilter } from './components/CategoryFilter';
import { StatusFilterComponent, type StatusFilter } from './components/StatusFilter';
import { SortSelect, type SortCriteria } from './components/SortSelect';
import { ThemeToggle } from './components/ThemeToggle';
import { ImportExportMenu } from './components/ImportExportMenu';
import { prioritiesConfig } from './lib/priorities';
import type { Resolution, Category } from './types';

function App() {
  const { resolutions, addResolution, deleteResolution, toggleResolution, updateResolution, importResolutions } =
    useResolutions();
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useLocalStorage<SortCriteria>('sortCriteria', 'priority');

  const handleEdit = useCallback((updatedResolution: Resolution) => {
    updateResolution(updatedResolution.id, {
      title: updatedResolution.title,
      category: updatedResolution.category,
      priority: updatedResolution.priority,
      dueDate: updatedResolution.dueDate,
    });
  }, [updateResolution]);

  const filteredAndSortedResolutions = useMemo(() => {
    // 1. Filtrer
    const filtered = resolutions.filter((r) => {
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(r.category);
      const statusMatch =
        selectedStatus === 'all' ||
        (selectedStatus === 'completed' && r.completed) ||
        (selectedStatus === 'pending' && !r.completed);

      return categoryMatch && statusMatch;
    });

    // 2. Trier
    return [...filtered].sort((a, b) => {
      if (sortBy === 'priority') {
        // Tri par priorité : high (1) → medium (2) → low (3)
        return prioritiesConfig[a.priority].order - prioritiesConfig[b.priority].order;
      } else if (sortBy === 'dueDate') {
        // Tri par date butoir : les plus proches d'abord, null à la fin
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else {
        // sortBy === 'createdAt' : les plus récentes d'abord
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [resolutions, selectedCategories, selectedStatus, sortBy]);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-4xl">
          {/* Header */}
          <header className="text-center space-y-4 mb-8 relative">
            {/* Actions - Position absolue en haut à droite */}
            <div className="absolute right-0 top-0 flex items-center gap-1">
              <ImportExportMenu
                resolutions={resolutions}
                onImport={importResolutions}
              />
              <ThemeToggle />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-black dark:text-white">
              ResoList
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Gérez vos résolutions pour 2026
              {resolutions.length > 0 && (
                <span className="ml-2 text-sm font-medium">
                  ({resolutions.length} résolution{resolutions.length > 1 ? 's' : ''})
                </span>
              )}
            </p>
          </header>

          {/* Main Content */}
          <main className="space-y-8">
            {/* Section Nouvelle Résolution */}
            <section className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 sm:p-8 border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-semibold mb-6 text-slate-900 dark:text-white">
                Nouvelle résolution
              </h2>
              <ResolutionForm onAdd={addResolution} />
            </section>

            {/* Section Liste des Résolutions */}
            <section className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 sm:p-8 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  Mes résolutions
                </h2>

                {/* Filtrage par catégorie */}
                {resolutions.length > 0 && (
                  <CategoryFilter
                    resolutions={resolutions}
                    selectedCategories={selectedCategories}
                    onCategoriesChange={setSelectedCategories}
                  />
                )}
              </div>

              {/* Filtrage par statut et tri */}
              {resolutions.length > 0 && (
                <div className="mb-6 space-y-4">
                  <StatusFilterComponent
                    resolutions={resolutions}
                    selectedStatus={selectedStatus}
                    onStatusChange={setSelectedStatus}
                  />
                  <SortSelect value={sortBy} onValueChange={setSortBy} />
                </div>
              )}

              <ResolutionList
                resolutions={filteredAndSortedResolutions}
                onToggle={toggleResolution}
                onDelete={deleteResolution}
                onEdit={handleEdit}
              />
            </section>
          </main>

          {/* Footer */}
          <footer className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
            <p>
              Créé avec{' '}
              <span className="text-red-500" aria-label="amour">
                ♥
              </span>{' '}
              pour le challenge{' '}
              <a
                href="https://devchallenges.yoandev.co/challenge/week-52/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                DevChallenges Week 52
              </a>
            </p>
          </footer>
        </div>
      </div>
      <Toaster />
    </>
  );
}

export default App;
