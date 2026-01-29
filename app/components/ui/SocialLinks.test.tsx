import {describe, it, expect} from 'vitest';
import {render, screen} from '@testing-library/react';
import {SocialLinks} from './SocialLinks';

describe('SocialLinks', () => {
  describe('Placeholder Icons (AC4)', () => {
    it('renders all 3 social media icons', () => {
      render(<SocialLinks />);

      const instagramIcon = screen.getByLabelText(/instagram/i);
      const facebookIcon = screen.getByLabelText(/facebook/i);
      const twitterIcon = screen.getByLabelText(/twitter|x/i);

      expect(instagramIcon).toBeInTheDocument();
      expect(facebookIcon).toBeInTheDocument();
      expect(twitterIcon).toBeInTheDocument();
    });

    it('each icon has descriptive aria-label with "coming soon" indicator', () => {
      render(<SocialLinks />);

      const instagramIcon = screen.getByLabelText(
        /isla suds on instagram.*coming soon/i,
      );
      const facebookIcon = screen.getByLabelText(
        /isla suds on facebook.*coming soon/i,
      );
      const twitterIcon = screen.getByLabelText(
        /isla suds on.*twitter|x.*coming soon/i,
      );

      expect(instagramIcon).toBeInTheDocument();
      expect(facebookIcon).toBeInTheDocument();
      expect(twitterIcon).toBeInTheDocument();
    });

    it('icons meet 44x44px minimum touch target size', () => {
      render(<SocialLinks />);

      const instagramIcon = screen.getByLabelText(/instagram/i);

      // Check computed styles (w-11 h-11 = 44px x 44px in Tailwind)
      expect(instagramIcon).toHaveClass('w-11');
      expect(instagramIcon).toHaveClass('h-11');
    });

    it('icons are visually disabled with opacity-50', () => {
      render(<SocialLinks />);

      const instagramIcon = screen.getByLabelText(/instagram/i);
      expect(instagramIcon).toHaveClass('opacity-50');
    });

    it('icons have cursor-not-allowed to indicate disabled state', () => {
      render(<SocialLinks />);

      const instagramIcon = screen.getByLabelText(/instagram/i);
      expect(instagramIcon).toHaveClass('cursor-not-allowed');
    });

    it('icons are not clickable links (disabled state)', () => {
      render(<SocialLinks />);

      const instagramIcon = screen.getByLabelText(/instagram/i);
      // Should be a div, not an <a> tag
      expect(instagramIcon.tagName).not.toBe('A');
    });

    it('container has proper semantic structure with role="list"', () => {
      render(<SocialLinks />);

      const container = screen.getByRole('list', {name: /social media/i});
      expect(container).toBeInTheDocument();
    });

    it('each icon has role="listitem"', () => {
      const {container} = render(<SocialLinks />);

      const listItems = container.querySelectorAll('[role="listitem"]');
      expect(listItems).toHaveLength(3);
    });

    it('icons use design token --canvas-elevated for background', () => {
      render(<SocialLinks />);

      const instagramIcon = screen.getByLabelText(/instagram/i);
      expect(instagramIcon).toHaveClass('bg-[var(--canvas-elevated)]');
    });

    it('layout adapts for future activation (data attributes present)', () => {
      render(<SocialLinks />);

      const instagramIcon = screen.getByLabelText(/instagram/i);
      // Check for data attribute that indicates future link capability
      expect(instagramIcon).toHaveAttribute('data-platform', 'instagram');
    });

    it('icons are keyboard focusable (AC6)', () => {
      render(<SocialLinks />);

      const instagramIcon = screen.getByLabelText(/instagram/i);
      expect(instagramIcon).toHaveAttribute('tabIndex', '0');
    });

    it('icons have visible focus indicators', () => {
      render(<SocialLinks />);

      const instagramIcon = screen.getByLabelText(/instagram/i);
      expect(instagramIcon).toHaveClass('focus-visible:ring-2');
      expect(instagramIcon).toHaveClass(
        'focus-visible:ring-[var(--accent-primary)]',
      );
    });
  });
});
