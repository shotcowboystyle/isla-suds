import {useState} from 'react';
import {useGSAP} from '@gsap/react';
import GSAP from 'gsap';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {SCENTS, findScent, type ScentId} from '~/content/product-page';
import {prefersReducedMotion} from '~/lib/motion';
import {cn} from '~/utils/cn';
import {ScentCard} from './ScentCard';
import styles from './ScentShelf.module.css';
import type {ProductItemFragment} from 'storefrontapi.generated';

if (typeof document !== 'undefined') {
  GSAP.registerPlugin(useGSAP);
}

interface ScentShelfProps {
  connection: React.ComponentProps<typeof PaginatedResourceSection<ProductItemFragment>>['connection'];
  /** The first page's products, for the mood chips. */
  products: ProductItemFragment[];
}

/**
 * The grid, plus the page's signature: pick by mood. Choosing a mood makes the
 * matching bar hop forward and dims the rest, which is the quickest way to tell
 * four lookalike bars apart on a first visit.
 */
export function ScentShelf({connection, products}: ScentShelfProps) {
  const [picked, setPicked] = useState<ScentId | null>(null);
  const {contextSafe} = useGSAP();

  const scentsHere = products.map((product) => findScent(product.handle)).filter((id): id is ScentId => id !== null);

  const hop = contextSafe((id: ScentId) => {
    if (prefersReducedMotion()) return;
    GSAP.to(`[data-card="${id}"] [data-hop]`, {
      keyframes: [
        {scaleX: 1.12, scaleY: 0.86, duration: 0.08},
        {y: '-22%', scaleX: 0.94, scaleY: 1.08, duration: 0.28, ease: 'power2.out'},
        {y: 0, scaleX: 1, scaleY: 1, duration: 0.24, ease: 'power2.in'},
        {scaleX: 1.1, scaleY: 0.86, duration: 0.07},
        {scaleX: 1, scaleY: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)'},
      ],
      overwrite: true,
    });
  });

  const choose = (id: ScentId) => {
    const next = picked === id ? null : id;
    setPicked(next);
    if (next) hop(next);
  };

  return (
    <section className={styles['section']} aria-label="The bars">
      {scentsHere.length > 1 && (
        <div className={styles['picker']}>
          <p id="mood-label" className={styles['picker-label']}>
            Pick by mood
          </p>
          <div className={styles['chips']} role="group" aria-labelledby="mood-label">
            {scentsHere.map((id) => (
              <button
                key={id}
                type="button"
                aria-pressed={picked === id}
                onClick={() => choose(id)}
                className={cn(styles['chip'], picked === id && styles['is-active'])}
              >
                {SCENTS[id].mood}
              </button>
            ))}
            {picked && (
              <button type="button" onClick={() => setPicked(null)} className={styles['reset']}>
                Show all
              </button>
            )}
          </div>
          <p className={styles['verdict']} aria-live="polite">
            {picked ? `${SCENTS[picked].name} it is.` : ''}
          </p>
        </div>
      )}

      <PaginatedResourceSection<ProductItemFragment> connection={connection} resourcesClassName={styles['grid']}>
        {({node: product}) => {
          const id = findScent(product.handle);
          const state = picked && id ? (id === picked ? 'picked' : 'dimmed') : undefined;
          return <ScentCard key={product.id} product={product} scentId={id} state={state} />;
        }}
      </PaginatedResourceSection>
    </section>
  );
}
