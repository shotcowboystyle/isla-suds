import {Link} from 'react-router';
import chunky from '~/components/ui/ChunkyButton.module.css';
import {CART_MESSAGES} from '~/content/cart';
import {useExplorationStore} from '~/stores/exploration';
import {cn} from '~/utils/cn';

/**
 * EmptyCart Component
 * Displays warm, encouraging empty cart state with clear action button
 * when the shopping cart has no items.
 */
export function EmptyCart() {
  const setCartDrawerOpen = useExplorationStore((state) => state.setCartDrawerOpen);

  const handleExplore = () => {
    setCartDrawerOpen(false); // Close drawer before navigation
  };

  return (
    <div className={cn('flex flex-col items-center justify-center', 'h-full p-6 text-center', 'space-y-6')}>
      <p className={cn('text-(--text-primary)', 'text-lg font-bold sm:text-xl', 'max-w-sm')}>{CART_MESSAGES.empty}</p>
      <Link
        to="/collections/frontpage"
        onClick={handleExplore}
        className={cn(chunky.chunky, 'inline-flex h-11 w-full px-6 text-xl sm:w-auto')}
        aria-label="Explore the Collection, closes cart"
      >
        Explore the Collection
      </Link>
    </div>
  );
}
