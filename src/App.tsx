import { useState, useCallback, useMemo } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { useResolutions } from './hooks/useResolutions';
import { ResolutionForm } from './components/ResolutionForm';
import { ResolutionList } from './components/ResolutionList';
import { CategoryFilter } from './components/CategoryFilter';
import { StatusFilterComponent, type StatusFilter } from './components/StatusFilter';
import type { Resolution, Category } from './types';

function App() {
  const { resolutions, addResolution, deleteResolution, toggleResolution, updateResolution } =
    useResolutions();
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('all');

  const handleEdit = useCallback((updatedResolution: Resolution) => {
    updateResolution(updatedResolution.id, {
      title: updatedResolution.title,
      category: updatedResolution.category,
    });
  }, [updateResolution]);

  const filteredResolutions = useMemo(() => {
    return resolutions.filter((r) => {
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(r.category);
      const statusMatch =
        selectedStatus === 'all' ||
        (selectedStatus === 'completed' && r.completed) ||
        (selectedStatus === 'pending' && !r.completed);

      return categoryMatch && statusMatch;
    });
  }, [resolutions, selectedCategories, selectedStatus]);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-4xl">
          {/* Header */}
          <header className="text-center space-y-4 mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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

              {/* Filtrage par statut */}
              {resolutions.length > 0 && (
                <div className="mb-6">
                  <StatusFilterComponent
                    resolutions={resolutions}
                    selectedStatus={selectedStatus}
                    onStatusChange={setSelectedStatus}
                  />
                </div>
              )}

              <ResolutionList
                resolutions={filteredResolutions}
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
