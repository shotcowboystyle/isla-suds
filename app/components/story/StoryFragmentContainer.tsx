import {useRef} from 'react';
import {useLocation} from 'react-router';
import {STORY_FRAGMENTS} from '~/content/story';
import {useStoryFragmentVisibility} from '~/hooks/use-story-fragment-visibility';
import {cn} from '~/utils/cn';
import {StoryFragment} from './StoryFragment';

interface StoryFragmentContainerProps {
  className?: string;
  /** Optional array of fragment indices to render. If not provided, renders all fragments. */
  fragmentIndices?: number[];
}

/**
 * StoryFragmentContainer renders story fragments scattered throughout the page
 * with Intersection Observer-based visibility detection (AC1, AC5)
 *
 * Fragments appear organically during scroll, not in a dedicated section.
 * Can render all fragments or a specific subset via fragmentIndices prop.
 */
export function StoryFragmentContainer({
  className,
  fragmentIndices,
}: StoryFragmentContainerProps) {
  const location = useLocation();

  // Do not render on wholesale routes (AC5)
  if (location.pathname.startsWith('/wholesale')) {
    return null;
  }

  // Select which fragments to render
  const fragmentsToRender = fragmentIndices
    ? fragmentIndices.map((index) => STORY_FRAGMENTS[index]).filter(Boolean)
    : STORY_FRAGMENTS;

  return (
    <section
      className={cn(
        'relative w-full',
        // Spacing between fragments for organic feel
        'space-y-32 md:space-y-48',
        'py-16 md:py-24',
        className,
      )}
      aria-label="Brand story moments"
    >
      {fragmentsToRender.map((fragment) => (
        <StoryFragmentWrapper key={fragment.title} fragment={fragment} />
      ))}
    </section>
  );
}

/**
 * Wrapper component for individual fragments with visibility detection
 * Each fragment has its own ref and visibility state
 */
function StoryFragmentWrapper({
  fragment,
}: {
  fragment: (typeof STORY_FRAGMENTS)[0];
}) {
  const fragmentRef = useRef<HTMLDivElement>(null);
  const isVisible = useStoryFragmentVisibility(fragmentRef);

  return (
    <div ref={fragmentRef}>
      <StoryFragment fragment={fragment} isVisible={isVisible} />
    </div>
  );
}
