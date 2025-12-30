import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Upload, FolderOpen, Save, FileText } from 'lucide-react';
import type { Resolution } from '@/types';

interface ImportExportMenuProps {
  resolutions: Resolution[];
  onImport: (resolutions: Resolution[]) => void;
}

interface ExportData {
  version: string;
  exportedAt: string;
  resolutions: Resolution[];
}

const FILE_VERSION = '1.0';
const FILE_EXTENSION = '.resolist';

function validateResolution(item: unknown): item is Resolution {
  if (typeof item !== 'object' || item === null) return false;
  const r = item as Record<string, unknown>;
  return (
    typeof r.id === 'string' &&
    typeof r.title === 'string' &&
    typeof r.category === 'string' &&
    typeof r.completed === 'boolean' &&
    typeof r.createdAt === 'string' &&
    typeof r.updatedAt === 'string'
  );
}

function validateImportData(data: unknown): data is ExportData {
  if (typeof data !== 'object' || data === null) return false;
  const d = data as Record<string, unknown>;

  if (typeof d.version !== 'string') return false;
  if (typeof d.exportedAt !== 'string') return false;
  if (!Array.isArray(d.resolutions)) return false;

  return d.resolutions.every(validateResolution);
}

export function ImportExportMenu({ resolutions, onImport }: ImportExportMenuProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importData, setImportData] = useState<ExportData | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const handleExport = () => {
    const exportData: ExportData = {
      version: FILE_VERSION,
      exportedAt: new Date().toISOString(),
      resolutions,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    // Nom du fichier avec date
    const date = new Date().toISOString().split('T')[0];
    link.download = `resolist-${date}${FILE_EXTENSION}`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Export réussi !', {
      description: `${resolutions.length} résolution(s) exportée(s)`,
    });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset input pour permettre de réimporter le même fichier
    event.target.value = '';

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!validateImportData(data)) {
        toast.error('Fichier invalide', {
          description: 'Le format du fichier n\'est pas reconnu.',
        });
        return;
      }

      if (data.resolutions.length === 0) {
        toast.warning('Fichier vide', {
          description: 'Le fichier ne contient aucune résolution.',
        });
        return;
      }

      // Stocker les données et ouvrir le dialog de confirmation
      setImportData(data);
      setIsConfirmDialogOpen(true);
    } catch {
      toast.error('Erreur de lecture', {
        description: 'Impossible de lire le fichier. Vérifiez qu\'il s\'agit d\'un fichier .RES valide.',
      });
    }
  };

  const handleConfirmImport = () => {
    if (!importData) return;

    onImport(importData.resolutions);

    toast.success('Import réussi !', {
      description: `${importData.resolutions.length} résolution(s) importée(s)`,
    });

    setImportData(null);
    setIsConfirmDialogOpen(false);
  };

  const handleCancelImport = () => {
    setImportData(null);
    setIsConfirmDialogOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Import/Export">
            <FileText className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white dark:bg-slate-900">
          <DropdownMenuItem onClick={handleExport} className="cursor-pointer">
            <Save className="h-4 w-4 mr-2" />
            Enregistrer sous...
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleImportClick} className="cursor-pointer">
            <FolderOpen className="h-4 w-4 mr-2" />
            Ouvrir...
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Input file caché */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".resolist,.json"
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />

      {/* Dialog de confirmation d'import */}
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent className="bg-white dark:bg-slate-900">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer l'import</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Vous êtes sur le point d'importer{' '}
                <strong>{importData?.resolutions.length}</strong> résolution(s).
              </p>
              {resolutions.length > 0 && (
                <p className="text-amber-600 dark:text-amber-400">
                  Attention : vos {resolutions.length} résolution(s) actuelle(s) seront remplacées.
                </p>
              )}
              {importData && (
                <p className="text-sm text-muted-foreground">
                  Fichier exporté le :{' '}
                  {new Date(importData.exportedAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel onClick={handleCancelImport}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmImport}
              className="bg-primary hover:bg-primary/90"
            >
              <Upload className="h-4 w-4 mr-2" />
              Importer
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
