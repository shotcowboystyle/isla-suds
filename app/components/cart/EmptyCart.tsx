import {Link} from 'react-router';
import {useExplorationStore} from '~/stores/exploration';
import {cn} from '~/utils/cn';
import {CART_MESSAGES} from '~/content/cart';

/**
 * EmptyCart Component
 * Displays warm, encouraging empty cart state with clear action button
 * when the shopping cart has no items.
 */
export function EmptyCart() {
  const setCartDrawerOpen = useExplorationStore(
    (state) => state.setCartDrawerOpen,
  );

  const handleExplore = () => {
    setCartDrawerOpen(false); // Close drawer before navigation
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        'h-full p-6 text-center',
        'space-y-6',
      )}
    >
      <p
        className={cn(
          'text-[var(--text-primary)]',
          'text-lg sm:text-xl',
          'max-w-sm',
        )}
      >
        {CART_MESSAGES.empty}
      </p>
      <Link
        to="/"
        onClick={handleExplore}
        className={cn(
          'inline-flex items-center justify-center',
          'bg-[var(--accent-primary)] text-white',
          'hover:bg-[var(--accent-primary)]/90 active:bg-[var(--accent-primary)]/80',
          'rounded px-6 h-11',
          'w-full sm:w-auto',
          'transition-colors',
          'font-medium',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-primary)]',
        )}
        aria-label="Explore the Collection, closes cart"
      >
        Explore the Collection
      </Link>
    </div>
  );
}
