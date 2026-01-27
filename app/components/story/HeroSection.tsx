import {forwardRef} from 'react';
import {HERO_TAGLINE} from '~/content/story';
import {cn} from '~/utils/cn';

interface HeroSectionProps {
  className?: string;
}

export const HeroSection = forwardRef<HTMLElement, HeroSectionProps>(
  function HeroSection({className}, ref) {
    return (
      <section
        ref={ref}
        className={cn(
          'relative min-h-[100dvh] flex items-center justify-center',
          'bg-[var(--canvas-base)]',
          // Story 2.2: CSS scroll-snap for mobile - snap to top of hero
          'snap-start',
          className,
        )}
        aria-label="Hero section"
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center">
            {/* Logo placeholder - using brand name text until real logo asset provided */}
            <h1
              className={cn(
                'text-[var(--text-primary)]',
                'font-serif',
                'text-4xl sm:text-5xl md:text-6xl lg:text-7xl',
                'mb-4',
              )}
            >
              Isla Suds
            </h1>

            {/* Tagline */}
            <p className="text-fluid-display text-text-primary max-w-4xl">
              {HERO_TAGLINE}
            </p>
          </div>
        </div>
      </section>
    );
  },
);
HeroSection.displayName = 'HeroSection';