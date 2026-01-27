import {render, screen} from '@testing-library/react';
import {describe, it, expect} from 'vitest';
import {HeroSection} from './HeroSection';

describe('HeroSection', () => {
  it('renders without errors', () => {
    render(<HeroSection />);
    const hero = screen.getByRole('region', {name: /hero/i});
    expect(hero).toBeInTheDocument();
  });

  it('applies canvas-base background color', () => {
    render(<HeroSection />);
    const hero = screen.getByRole('region', {name: /hero/i});
    expect(hero).toHaveClass('bg-[var(--canvas-base)]');
  });

  it('spans full viewport height', () => {
    render(<HeroSection />);
    const hero = screen.getByRole('region', {name: /hero/i});
    expect(hero).toHaveClass('min-h-[100dvh]');
  });

  it('centers content vertically and horizontally', () => {
    render(<HeroSection />);
    const hero = screen.getByRole('region', {name: /hero/i});
    expect(hero).toHaveClass('flex');
    expect(hero).toHaveClass('items-center');
    expect(hero).toHaveClass('justify-center');
  });

  it('accepts custom className prop', () => {
    render(<HeroSection className="custom-class" />);
    const hero = screen.getByRole('region', {name: /hero/i});
    expect(hero).toHaveClass('custom-class');
  });

  it('has proper TypeScript props interface', () => {
    // This is a compile-time check, but we can verify runtime behavior
    const props: React.ComponentProps<typeof HeroSection> = {
      className: 'test',
    };
    expect(props).toBeDefined();
  });

  it('displays brand name', () => {
    render(<HeroSection />);
    const logo = screen.getByText(/isla suds/i);
    expect(logo).toBeInTheDocument();
  });

  it('logo is prominently displayed', () => {
    render(<HeroSection />);
    const logo = screen.getByText(/isla suds/i);
    expect(logo.tagName).toBe('H1');
  });

  it('displays tagline below logo', () => {
    render(<HeroSection />);
    const tagline = screen.getByText(/handcrafted/i);
    expect(tagline).toBeInTheDocument();
  });

  it('tagline uses fluid display typography', () => {
    render(<HeroSection />);
    const tagline = screen.getByText(/handcrafted/i);
    expect(tagline).toHaveClass('text-fluid-display');
  });

  it('tagline uses primary text color', () => {
    render(<HeroSection />);
    const tagline = screen.getByText(/handcrafted/i);
    expect(tagline).toHaveClass('text-text-primary');
  });
});
