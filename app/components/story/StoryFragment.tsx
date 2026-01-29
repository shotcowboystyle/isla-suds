import {Suspense} from 'react';
import {Link} from 'react-router';
import {
  MotionArticle,
  prefersReducedMotion,
  fadeInVariants,
} from '~/lib/motion';
import {cn} from '~/utils/cn';
import type {StoryFragment as StoryFragmentType} from '~/content/story';

interface StoryFragmentProps {
  fragment: StoryFragmentType;
  className?: string;
  isVisible?: boolean; // Controlled by visibility hook in container
}

/**
 * StoryFragment component displays individual brand story moments
 * during scroll with semantic HTML and accessible design (AC1, AC2, AC3, AC4)
 */
export function StoryFragment({
  fragment,
  className,
  isVisible = true,
}: StoryFragmentProps) {
  const {title, subtitle, content, actions} = fragment;

  // Check prefers-reduced-motion (AC2)
  const shouldAnimate = !prefersReducedMotion();

  // Base content that's shared between static and animated variants
  const fragmentContent = (
    <>
      {/* Title - fluid-heading typography (AC1) */}
      <h2
        className={cn(
          'text-fluid-heading',
          'text-[var(--text-primary)]', // 4.5:1 contrast (AC4)
          'font-serif',
        )}
      >
        {title}
      </h2>

      {/* Subtitle - fluid-body typography (AC1) */}
      <p
        className={cn(
          'text-fluid-body',
          'text-[var(--text-muted)]', // Subtle contrast hierarchy
          'font-sans',
        )}
      >
        {subtitle}
      </p>

      {/* Content - fluid-body typography (AC1) */}
      <p
        className={cn(
          'text-fluid-body',
          'text-[var(--text-primary)]', // 4.5:1 contrast (AC4)
          'font-sans',
          'leading-relaxed',
        )}
      >
        {content}
      </p>

      {/* Action buttons - keyboard-focusable, 44x44px touch targets (AC4) */}
      {actions && actions.length > 0 && (
        <div className="flex flex-wrap gap-3 justify-center mt-2">
          {actions.map((action) => (
            <Link
              key={action.url}
              to={action.url}
              className={cn(
                // 44x44px minimum touch target (AC4)
                'inline-flex items-center justify-center',
                'min-h-[44px] min-w-[44px]',
                'px-6 py-3',
                // Styling
                'bg-[var(--accent-primary)]',
                'text-[var(--canvas-base)]', // 4.5:1 contrast (AC4)
                'font-sans text-base',
                'rounded-md',
                // Hover/focus states
                'hover:bg-[var(--accent-hover)]',
                'focus-visible:outline focus-visible:outline-2',
                'focus-visible:outline-offset-2',
                'focus-visible:outline-[var(--accent-primary)]',
                // Transitions
                'transition-colors duration-200',
              )}
            >
              {action.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );

  // If reduced motion, render static article (AC2)
  if (!shouldAnimate) {
    return (
      <article
        className={cn(
          'flex flex-col gap-4 mx-auto px-4 sm:px-6 lg:px-8',
          'text-center',
          className,
        )}
        data-testid="story-fragment"
      >
        {fragmentContent}
      </article>
    );
  }

  // If motion allowed, render animated article (AC1, AC4)
  return (
    <Suspense
      fallback={
        <article
          className={cn(
            'flex flex-col gap-4 mx-auto px-4 sm:px-6 lg:px-8',
            'text-center',
            className,
          )}
          data-testid="story-fragment"
        >
          {fragmentContent}
        </article>
      }
    >
      <MotionArticle
        className={cn(
          'flex flex-col gap-4 mx-auto px-4 sm:px-6 lg:px-8',
          'text-center',
          className,
        )}
        data-testid="story-fragment"
        // Fade-in animation (AC1, AC4)
        variants={fadeInVariants}
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
        transition={{
          duration: 0.6, // 600ms per AC1
          ease: [0.16, 1, 0.3, 1], // --ease-out-expo
        }}
      >
        {fragmentContent}
      </MotionArticle>
    </Suspense>
  );
}
