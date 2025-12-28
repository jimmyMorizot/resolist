import { Resolution } from '@/types';
import { ResolutionItem } from './ResolutionItem';
import { motion, AnimatePresence } from 'framer-motion';

interface ResolutionListProps {
  resolutions: Resolution[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (resolution: Resolution) => void;
}

export function ResolutionList({
  resolutions,
  onToggle,
  onDelete,
  onEdit,
}: ResolutionListProps) {
  // Si aucune résolution, afficher un message
  if (resolutions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-2">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          Aucune résolution pour le moment
        </h3>
        <p className="text-sm text-gray-500">
          Commencez par ajouter votre première résolution ci-dessus.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {resolutions.map((resolution, index) => (
          <motion.div
            key={resolution.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{
              duration: 0.3,
              delay: index * 0.05,
              layout: { duration: 0.3 },
            }}
          >
            <ResolutionItem
              resolution={resolution}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
