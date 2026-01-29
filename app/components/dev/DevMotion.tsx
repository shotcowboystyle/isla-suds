import {Suspense, useEffect, useState} from 'react';
import {MotionDiv, prefersReducedMotion} from '~/lib/motion';
import {MotionErrorBoundary} from './MotionErrorBoundary';

/**
 * Dev component to test Framer Motion integration
 * Demonstrates:
 * - Dynamic import via lazy loading
 * - Suspense boundary for loading state
 * - prefers-reduced-motion accessibility check
 * - Basic animations (fade-in, scale)
 */
export function DevMotion() {
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    setReducedMotion(prefersReducedMotion());
  }, []);

  // SSR-safe rendering
  if (!mounted) {
    return (
      <div className="min-h-screen bg-canvas-base p-8">
        <div className="mx-auto">
          <h1 className="mb-8 text-4xl font-bold text-text-primary">
            Framer Motion Test
          </h1>
          <div className="rounded-lg bg-canvas-elevated p-6">
            <p className="text-text-muted">Loading animation test...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas-base p-8">
      <div className="mx-auto space-y-8">
        <header className="mb-12">
          <h1 className="mb-2 text-4xl font-bold text-text-primary">
            Framer Motion Test
          </h1>
          <p className="text-text-muted">
            Testing dynamic import and basic animations
          </p>
          {reducedMotion && (
            <p className="mt-4 rounded bg-yellow-100 p-2 text-sm text-yellow-800">
              ⚠️ Reduced motion preference detected - animations disabled
            </p>
          )}
        </header>

        <MotionErrorBoundary>
          <Suspense
            fallback={
              <div className="rounded-lg bg-canvas-elevated p-6">
                <p className="text-text-muted">Loading motion component...</p>
              </div>
            }
          >
            {reducedMotion ? (
              // Static fallback for reduced motion
              <div className="space-y-6">
                <div className="rounded-lg bg-canvas-elevated p-6">
                  <h2 className="mb-2 text-xl font-semibold text-text-primary">
                    Static Content (No Animation)
                  </h2>
                  <p className="text-text-muted">
                    Animations are disabled because you have reduced motion
                    enabled.
                  </p>
                </div>

                <div className="rounded-lg bg-accent-primary p-6 text-white">
                  <h2 className="mb-2 text-xl font-semibold">Test Box 1</h2>
                  <p className="opacity-90">
                    This box would normally fade in and scale up.
                  </p>
                </div>

                <div className="rounded-lg bg-accent-primary p-6 text-white">
                  <h2 className="mb-2 text-xl font-semibold">Test Box 2</h2>
                  <p className="opacity-90">
                    This box would normally fade in with a delay.
                  </p>
                </div>
              </div>
            ) : (
              // Animated content
              <div className="space-y-6">
                <MotionDiv
                  initial={{opacity: 0}}
                  animate={{opacity: 1}}
                  transition={{duration: 0.6}}
                  className="rounded-lg bg-canvas-elevated p-6"
                >
                  <h2 className="mb-2 text-xl font-semibold text-text-primary">
                    Fade In Animation
                  </h2>
                  <p className="text-text-muted">
                    This box fades in smoothly on page load.
                  </p>
                </MotionDiv>

                <MotionDiv
                  initial={{opacity: 0, scale: 0.95}}
                  animate={{opacity: 1, scale: 1}}
                  transition={{duration: 0.6, delay: 0.2}}
                  className="rounded-lg bg-accent-primary p-6 text-white"
                >
                  <h2 className="mb-2 text-xl font-semibold">
                    Fade In + Scale Animation
                  </h2>
                  <p className="opacity-90">
                    This box fades in and scales up with a slight delay.
                  </p>
                </MotionDiv>

                <MotionDiv
                  initial={{opacity: 0, y: 20}}
                  animate={{opacity: 1, y: 0}}
                  transition={{duration: 0.6, delay: 0.4}}
                  className="rounded-lg bg-accent-primary p-6 text-white"
                >
                  <h2 className="mb-2 text-xl font-semibold">
                    Fade In + Slide Up Animation
                  </h2>
                  <p className="opacity-90">
                    This box slides up while fading in, demonstrating transform
                    animations.
                  </p>
                </MotionDiv>
              </div>
            )}
          </Suspense>
        </MotionErrorBoundary>

        <footer className="mt-12 rounded-lg border border-text-muted/20 p-6">
          <h3 className="mb-4 text-lg font-semibold text-text-primary">
            Implementation Details
          </h3>
          <ul className="space-y-2 text-sm text-text-muted">
            <li>✅ Framer Motion dynamically imported (not in main bundle)</li>
            <li>✅ Suspense boundary handles loading state</li>
            <li>✅ Respects prefers-reduced-motion preference</li>
            <li>✅ SSR-safe (no hydration mismatches)</li>
            <li>✅ Graceful fallback to static content</li>
          </ul>
        </footer>
      </div>
    </div>
  );
}
