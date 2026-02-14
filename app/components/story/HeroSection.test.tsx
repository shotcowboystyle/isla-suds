import {render, screen} from '@testing-library/react';
import {describe, it, expect, vi} from 'vitest';
import {HeroSection} from './HeroSection';

// Mock GSAP and related modules
vi.mock('@gsap/react', () => ({
  useGSAP: vi.fn(),
}));

vi.mock('gsap', () => ({
  default: {
    timeline: vi.fn(() => ({
      to: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
    })),
    set: vi.fn(),
    to: vi.fn(),
  },
}));

vi.mock('gsap/SplitText', () => ({
  SplitText: {
    create: vi.fn(() => ({chars: []})),
  },
}));

// Mock image/video imports
vi.mock('~/assets/images/hero-mobile-2.png?responsive', () => ({
  default: {src: '/mock-hero-mobile.png'},
}));

vi.mock('~/assets/images/hero-video-thumbnail.png', () => ({
  default: '/mock-thumbnail.png',
}));

vi.mock('~/assets/video/soap-bar-blast.mp4', () => ({
  default: '/mock-video.mp4',
}));

// Mock Picture component
vi.mock('~/components/Picture', () => ({
  Picture: ({alt, ...props}: any) => <img alt={alt} {...props} />,
}));

// Mock LiquidButton
vi.mock('~/components/ui/LiquidButton', () => ({
  LiquidButton: ({text, href, ...props}: any) => (
    <a href={href} {...props}>
      {text}
    </a>
  ),
}));

// Mock CSS modules
vi.mock('~/components/story/HeroSection.module.css', () => ({
  default: new Proxy(
    {},
    {
      get: (_target, prop) => String(prop),
    },
  ),
}));

describe('HeroSection', () => {
  it('renders without errors', () => {
    render(<HeroSection />);
    const hero = screen.getByRole('region', {name: /hero/i});
    expect(hero).toBeInTheDocument();
  });

  it('renders as a section element with aria-label', () => {
    render(<HeroSection />);
    const hero = screen.getByRole('region', {name: /hero section/i});
    expect(hero.tagName).toBe('SECTION');
  });

  it('has data-testid for testing', () => {
    render(<HeroSection />);
    const hero = screen.getByTestId('hero-section');
    expect(hero).toBeInTheDocument();
  });

  it('accepts custom className prop', () => {
    render(<HeroSection className="custom-class" />);
    const hero = screen.getByRole('region', {name: /hero/i});
    expect(hero).toHaveClass('custom-class');
  });

  it('has proper TypeScript props interface', () => {
    const props: React.ComponentProps<typeof HeroSection> = {
      className: 'test',
    };
    expect(props).toBeDefined();
  });

  it('displays hero tagline start text', () => {
    render(<HeroSection />);
    const taglineStart = screen.getByText(/natural skincare/i);
    expect(taglineStart).toBeInTheDocument();
  });

  it('tagline start is in an h1 element', () => {
    render(<HeroSection />);
    const taglineStart = screen.getByText(/natural skincare/i);
    expect(taglineStart.tagName).toBe('H1');
  });

  it('displays hero tagline end text', () => {
    render(<HeroSection />);
    const taglineEnd = screen.getByText(/you can trust/i);
    expect(taglineEnd).toBeInTheDocument();
  });

  it('displays hero content paragraph', () => {
    render(<HeroSection />);
    const content = screen.getByText(/silky-smooth feel/i);
    expect(content).toBeInTheDocument();
    expect(content.tagName).toBe('P');
  });

  it('renders a Shop Now call-to-action', () => {
    render(<HeroSection />);
    const cta = screen.getByText(/shop now/i);
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute('href', '/products');
  });
});
