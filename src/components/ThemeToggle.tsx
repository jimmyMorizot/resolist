import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';

/**
 * Bouton toggle pour basculer entre mode clair et mode sombre
 * - Affiche une icône Soleil en mode sombre (pour passer en clair)
 * - Affiche une icône Lune en mode clair (pour passer en sombre)
 * - Animation fluide entre les deux états
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative h-9 w-9 rounded-full transition-colors duration-300 hover:bg-slate-200 dark:hover:bg-slate-700"
      aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
      title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
    >
      <Sun
        className={`h-5 w-5 transition-all duration-300 ${
          theme === 'dark'
            ? 'rotate-0 scale-100 text-yellow-400'
            : 'rotate-90 scale-0'
        }`}
        aria-hidden="true"
      />
      <Moon
        className={`absolute h-5 w-5 transition-all duration-300 ${
          theme === 'dark'
            ? 'rotate-90 scale-0'
            : 'rotate-0 scale-100 text-slate-700'
        }`}
        aria-hidden="true"
      />
      <span className="sr-only">
        {theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
      </span>
    </Button>
  );
}
