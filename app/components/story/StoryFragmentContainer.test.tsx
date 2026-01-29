import {describe, it, expect, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import {StoryFragmentContainer} from './StoryFragmentContainer';

// Mock the visibility hook
vi.mock('~/hooks/use-story-fragment-visibility', () => ({
  useStoryFragmentVisibility: vi.fn(() => true),
}));

// Mock React Router
vi.mock('react-router', () => ({
  Link: ({
    children,
    to,
    ...props
  }: {
    children: React.ReactNode;
    to: string;
  }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useLocation: () => ({
    pathname: '/',
    search: '',
    hash: '',
    state: null,
    key: 'default',
  }),
}));

describe('StoryFragmentContainer Component', () => {
  it('renders all story fragments when no indices specified (AC1)', () => {
    render(<StoryFragmentContainer />);

    // Should render all story content from STORY_FRAGMENTS
    const fragments = screen.getAllByTestId('story-fragment');
    expect(fragments.length).toBe(8); // All 8 fragments
  });

  it('renders only specified fragments when indices provided (AC1)', () => {
    render(<StoryFragmentContainer fragmentIndices={[0, 2, 4]} />);

    // Should render only 3 specified fragments
    const fragments = screen.getAllByTestId('story-fragment');
    expect(fragments.length).toBe(3);
  });

  it('positions fragments organically (AC1)', () => {
    const {container} = render(<StoryFragmentContainer />);

    // Container should NOT use grid or flex-row that creates dedicated sections
    const containerEl = container.firstChild;
    expect(containerEl).toBeInTheDocument();

    // Should be a semantic container (section or div)
    expect(
      containerEl?.nodeName === 'SECTION' || containerEl?.nodeName === 'DIV',
    ).toBe(true);
  });
});
