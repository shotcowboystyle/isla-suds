import {cn} from '~/utils/cn';
import {ProductCard} from './ProductCard';
import type {RecommendedProductFragment} from 'storefrontapi.generated';

export interface ConstellationGridProps {
  products: RecommendedProductFragment[] | null;
  className?: string;
}

/**
 * ConstellationGrid component - Organic product layout
 *
 * Desktop (≥1024px):
 * - Organic positions with subtle rotations (-3° to +3°)
 * - CSS transform-based layout (no scroll listeners)
 * - Subtle hover effects (GPU-composited only)
 *
 * Mobile (<1024px):
 * - Simple 2-column grid
 * - No rotations
 * - Fluid from 320px to 1024px
 *
 * Accessibility:
 * - All cards keyboard focusable
 * - Focus order follows visual flow
 * - Visible focus indicators
 */
export function ConstellationGrid({
  products,
  className,
}: ConstellationGridProps) {
  if (!products || products.length === 0) {
    return null;
  }

  // Full class strings so Tailwind JIT includes them (no dynamic concatenation).
  const rotationClasses = [
    'lg:rotate-[-2deg]',
    'lg:rotate-[3deg]',
    'lg:rotate-[-3deg]',
    'lg:rotate-[2deg]',
  ] as const;
  // Organic desktop placement: irregular grid areas so layout feels hand-placed (AC1).
  const placementClasses = [
    'lg:col-start-1 lg:row-start-1',
    'lg:col-start-3 lg:row-start-1',
    'lg:col-start-2 lg:row-start-2',
    'lg:col-start-1 lg:row-start-3',
  ] as const;

  return (
    <section
      className={cn(
        'constellation-grid',
        'py-[var(--space-2xl)] px-[var(--space-md)]',
        className,
      )}
      aria-label="Product constellation grid"
    >
      {/* Mobile: 2-column grid. Desktop: organic positions via custom grid placement + rotations */}
      <div
        className={cn(
          'grid grid-cols-2 gap-[var(--space-md)]',
          'lg:grid-cols-4 lg:gap-[var(--space-lg)] lg:max-w-6xl lg:mx-auto',
        )}
      >
        {products.map((product, index) => {
          const i = index % 4;
          return (
            <div
              key={product.id}
              className={cn('min-w-0', placementClasses[i])}
            >
              <ProductCard
                product={product}
                rotationClass={rotationClasses[i]}
                loading={index < 2 ? 'eager' : 'lazy'}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
